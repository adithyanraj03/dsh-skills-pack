"""Check a LaTeX project's citations: \\cite keys vs .bib, and .bib entries vs Crossref / arXiv.

Usage:
    python check_bib.py <project_dir> [--bib refs.bib] [--offline] [--limit N] [--json out.json]

Stdlib only. Prints one line per problem and a summary. Exit code 0 = no problems,
1 = problems found, 2 = bad input. Network lookups are read-only GETs of public
metadata (Crossref, arXiv); --offline skips them.
"""
import argparse
import difflib
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

UA = "check_bib/1.0 (citation checker; mailto:none@example.com)"
CITE_RE = re.compile(r"\\(?:no)?cite[a-zA-Z]*\*?(?:\[[^\]]*\]){0,2}\{([^}]*)\}")
ENTRY_RE = re.compile(r"@(\w+)\s*\{\s*([^,\s]+)\s*,", re.I)


def read(path):
    with open(path, encoding="utf-8", errors="replace") as f:
        return f.read()


def strip_comments(tex):
    return re.sub(r"(?<!\\)%.*", "", tex)


def find_files(root, ext):
    out = []
    for d, dirs, files in os.walk(root):
        dirs[:] = [x for x in dirs if not x.startswith(".") and x not in ("node_modules", "graft", "localtex")]
        out += [os.path.join(d, f) for f in files if f.lower().endswith(ext)]
    return out


def parse_bib(text):
    """Return {key: {type, fields...}}. Handles nested braces and quoted values."""
    entries = {}
    for m in ENTRY_RE.finditer(text):
        etype, key = m.group(1).lower(), m.group(2)
        if etype in ("comment", "string", "preamble"):
            continue
        i, depth = m.end(), 1
        while i < len(text) and depth:
            depth += {"{": 1, "}": -1}.get(text[i], 0)
            i += 1
        body = text[m.end():i - 1]
        fields, j = {}, 0
        for fm in re.finditer(r"(\w[\w-]*)\s*=\s*", body):
            if fm.start() < j:
                continue
            name, k = fm.group(1).lower(), fm.end()
            if k < len(body) and body[k] == "{":
                d, s = 0, k
                while k < len(body):
                    d += {"{": 1, "}": -1}.get(body[k], 0)
                    k += 1
                    if d == 0:
                        break
                val = body[s + 1:k - 1]
            elif k < len(body) and body[k] == '"':
                e = body.find('"', k + 1)
                val, k = body[k + 1:e], e + 1
            else:
                e = re.search(r"[,\n]", body[k:])
                val = body[k:k + e.start()] if e else body[k:]
                k += len(val)
            fields[name] = re.sub(r"\s+", " ", val).strip()
            j = k
        fields["_type"] = etype
        entries[key] = fields
    return entries


def norm(s):
    s = re.sub(r"\\[a-zA-Z]+\s*", "", s or "")
    s = re.sub(r"[{}$\\]", "", s)
    return re.sub(r"[^a-z0-9 ]", "", s.lower()).strip()


def sim(a, b):
    return difflib.SequenceMatcher(None, norm(a), norm(b)).ratio()


def get(url, timeout=20):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def crossref_doi(doi):
    data = json.loads(get("https://api.crossref.org/works/" + urllib.parse.quote(doi)))["message"]
    year = (data.get("issued", {}).get("date-parts") or [[None]])[0][0]
    return {"title": (data.get("title") or [""])[0], "year": year,
            "authors": [a.get("family", "") for a in data.get("author", [])], "src": "crossref-doi"}


def crossref_search(title, author):
    q = urllib.parse.urlencode({"query.bibliographic": f"{title} {author}", "rows": 1})
    items = json.loads(get("https://api.crossref.org/works?" + q))["message"]["items"]
    if not items:
        return None
    it = items[0]
    year = (it.get("issued", {}).get("date-parts") or [[None]])[0][0]
    return {"title": (it.get("title") or [""])[0], "year": year, "doi": it.get("DOI"),
            "authors": [a.get("family", "") for a in it.get("author", [])], "src": "crossref-search"}


def arxiv(aid):
    xml = get("http://export.arxiv.org/api/query?id_list=" + urllib.parse.quote(aid))
    ns = {"a": "http://www.w3.org/2005/Atom"}
    e = ET.fromstring(xml).find("a:entry", ns)
    if e is None or e.find("a:title", ns) is None:
        return None
    return {"title": e.find("a:title", ns).text, "year": int(e.find("a:published", ns).text[:4]),
            "authors": [n.find("a:name", ns).text.split()[-1] for n in e.findall("a:author", ns)], "src": "arxiv"}


def arxiv_id(f):
    for k in ("eprint", "arxiv", "url", "journal", "note", "doi"):
        m = re.search(r"(\d{4}\.\d{4,5})(v\d+)?", f.get(k, ""))
        if m and ("arxiv" in (f.get(k, "") + f.get("archiveprefix", "") + f.get("journal", "")).lower() or k == "eprint"):
            return m.group(1)
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project")
    ap.add_argument("--bib", action="append")
    ap.add_argument("--offline", action="store_true")
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--json")
    a = ap.parse_args()
    if not os.path.isdir(a.project):
        print("error: not a folder:", a.project)
        return 2
    bibs = [os.path.join(a.project, b) for b in a.bib] if a.bib else find_files(a.project, ".bib")
    texs = find_files(a.project, ".tex")
    if not bibs:
        print("error: no .bib file found")
        return 2

    entries = {}
    for b in bibs:
        for k, v in parse_bib(read(b)).items():
            if k in entries:
                print(f"DUPLICATE-KEY {k} ({os.path.basename(b)})")
            v["_file"] = os.path.basename(b)
            entries[k] = v
    cited = {}
    for t in texs:
        for m in CITE_RE.finditer(strip_comments(read(t))):
            for k in m.group(1).split(","):
                k = k.strip()
                if k:
                    cited.setdefault(k, os.path.relpath(t, a.project))

    problems = []
    for k, where in sorted(cited.items()):
        if k not in entries:
            problems.append({"key": k, "kind": "MISSING-IN-BIB", "detail": f"cited in {where}"})
    for k in sorted(set(entries) - set(cited)):
        problems.append({"key": k, "kind": "UNUSED", "detail": "in .bib but never cited"})

    checked = 0
    if not a.offline:
        for k in sorted(set(entries) & set(cited)):
            if a.limit and checked >= a.limit:
                break
            f = entries[k]
            title, year = f.get("title", ""), f.get("year", "")
            author1 = re.split(r"\s+and\s+", f.get("author", ""))[0].split(",")[0].split()[-1:] or [""]
            if not title:
                problems.append({"key": k, "kind": "NO-TITLE", "detail": ""})
                continue
            checked += 1
            try:
                rec = None
                if f.get("doi"):
                    rec = crossref_doi(re.sub(r"^https?://(dx\.)?doi\.org/", "", f["doi"]))
                elif arxiv_id(f):
                    rec = arxiv(arxiv_id(f))
                else:
                    rec = crossref_search(title, author1[0])
            except Exception as e:  # network or parse failure is reported, never treated as a pass
                problems.append({"key": k, "kind": "LOOKUP-FAILED", "detail": str(e)[:120]})
                continue
            finally:
                time.sleep(0.4)
            if not rec:
                problems.append({"key": k, "kind": "NOT-FOUND", "detail": title[:90]})
                continue
            s = sim(title, rec["title"])
            if s < 0.85:
                kind = "TITLE-MISMATCH" if rec["src"] != "crossref-search" else "NOT-FOUND?"
                problems.append({"key": k, "kind": kind,
                                 "detail": f"bib='{title[:70]}' vs {rec['src']}='{(rec['title'] or '')[:70]}' (sim {s:.2f})"})
            elif year and rec.get("year") and abs(int(re.sub(r'\D', '', year) or 0) - int(rec["year"])) > 1:
                problems.append({"key": k, "kind": "YEAR-MISMATCH", "detail": f"bib={year} {rec['src']}={rec['year']}"})
            if rec["src"] == "crossref-search" and s >= 0.95 and rec.get("doi") and not f.get("doi"):
                problems.append({"key": k, "kind": "ADD-DOI", "detail": rec["doi"]})

    for p in problems:
        print(f"{p['kind']:<15} {p['key']:<30} {p['detail']}")
    hard = [p for p in problems if p["kind"] not in ("UNUSED", "ADD-DOI")]
    print(f"\nsummary: {len(cited)} cited keys, {len(entries)} bib entries, {checked} looked up online, "
          f"{len(hard)} problems, {len(problems) - len(hard)} notes")
    if a.json:
        with open(a.json, "w", encoding="utf-8") as fh:
            json.dump(problems, fh, indent=1)
    return 1 if hard else 0


if __name__ == "__main__":
    sys.exit(main())
