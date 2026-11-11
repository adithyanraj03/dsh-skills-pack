#!/usr/bin/env python3
# /// script
# requires-python = ">=3.9"
# dependencies = []
# ///
"""storyboard_lint.py — mechanically check one storyboard before you write any code.

Usage:
  uv run storyboard_lint.py storyboard.md [--script script.txt]     # or python3 storyboard_lint.py …

Before the table, lock the look in three lines (outside the table, above it):
  Style: one sentence (one style card or one drawing method; the whole film uses only this one)
  Palette: a palette name (paper/poster/ink/navy/bauhaus/snow/wood/chalk) or 3–6 hex values
  Characters: none / hands and back only / frame lib <path> (AI-generated frames)
  Flat-cartoon exception: Style starts with 37_rick_morty or 52_south_park, Characters says "original semantic SVG…"
  Blue-purple OK: <reason> (optional; only when the user explicitly asked for blue-purple)
Then one markdown table (template and example in references/storyboard-template.md), one shot per row, columns:
  Time | Object | Action | Camera | On-screen text | How (optional, recommended) | Tags (optional)
Tables inside code fences (```) are not checked. When the file has several tables, only the first one
with both an Object and an Action column is linted.

Per-row checks:
  ① Object: must not be empty, must not be only layout words ("title, bullets, text, list, label, caption, card, background, screen, icon"),
     and must not be an empty scene ("empty shot, flat color, black frame, black screen, all black, gradient")          → red
  ② Action: must not be empty, must not be only all-purpose verbs ("appears, shows, displayed, fades in…")                → red
  ③ On-screen text ≤ 8 tokens (each CJK char is one; each run of letters/digits is one)                                   → red
  ④ First shot must not be text-led (Object is a title/text, or ≥ 7 text tokens, or How is y5 kinetic type)                → red
  ⑥ A shot is 2–6 s; 6–8 s or under 2 s → yellow; over 8 s → red; more than a fifth of shots at 6–8 s → red
  ⑦ Three consecutive shots with the same Camera value ("hold" and "pan" exempt) → yellow
  ⑮ Three consecutive shots all pushing inward (slow push / fast push / push in / slam / zoom in, mixed counts) → yellow
  ⑧ Last shot must not be text-led (centered quote card, pure text card; same test as ④)                                  → red
  ⑪ A middle shot that is a number-bearing text-led card (a lone number card)                                             → yellow
  ⑨ With --script: Arabic numbers in on-screen text (percentages, years, units) not found in the script                   → red
     (the script may spell numbers out in words — "sixty percent" = 60%, "fifteen point two" = 15.2 — and Chinese numerals also count)
  ⑩ With a Tags column: more than 3 tags in one shot                                                                      → yellow
Whole-table checks:
  ⑤ text-led shots ≤ 30% of the film                                                                                      → red
  How column (checked when present): one parametric clip (.json) carrying over 8 s total → red; more than 2 clip grammars (collage) → red
  ⑫ style lock: any of the Style / Palette / Characters lines missing                                                     → red
  ⑬ palette: hex values in the blue-purple zone (hue 225°–300°, saturation ≥ 0.30) → red (yellow when "Blue-purple OK" is written); more than 6 colors → yellow
  ⑭ characters: Characters line says code-drawn / chibi / robot → red; Object column has a robot / stick figure / mascot / cartoon character while Characters is not a frame lib → red;
     y4 used while Characters is not a frame lib → red; coins/balls/ions given faces in Object → yellow
  ⑯ accent moves (fast push, slam, whip) on more than a third of the shots → yellow
  Time spans not connecting; no camera move anywhere in the table (only holds and cuts) → yellow

Exit codes: red present → 1; yellow-only or all green → 0; unreadable file or no table found → 2. Standard library only.
"""
import re
import sys
from pathlib import Path

# Windows consoles default to a legacy codepage (cp1252/cp437) that cannot encode ①–⑯ or "→";
# force UTF-8 so the report prints instead of crashing.
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass

RED, YELLOW, GREEN = "RED", "YELLOW", "GREEN"

# ① Object: after removing layout words, filler words, colors and punctuation, nothing left = "no object written".
ABSTRACT = """title subtitle headline heading header bullet bullets point points text words word copy list checklist
label labels caption subtitle card cards text card quote card background backdrop bg color colors flat color solid color
frame frames screen icon icons graphic graphics keyword keywords quote slogan tagline summary conclusion concept content
information info element elements thing things diagram diagrams image images picture whiteboard blackboard page pages
layout animation animations effect effects paragraph sentence dot dots symbol symbols numbering index arrow arrows
line lines shape shapes square squares block blocks color block gradient gradients glow particle particles decoration
empty shot empty scene empty frame black frame blank starfield""".split()
ABSTRACT_SET = {w for w in ABSTRACT}
FILLER_WORDS = """a an the of and or to in on at with for from into onto over under above below this that these those its it
is are being was were as while while's left right top bottom middle center centre side sides front back inside outside
up down big small large little new old white black red blue green yellow grey gray orange purple pink beige brown navy
all every each some more most shot one two three four five six seven eight nine ten eleven twelve thirteen fourteen
fifteen sixteen seventeen eighteen nineteen twenty thirty forty fifty sixty seventy eighty ninety hundred thousand
million billion""".split()
FILLER_WORDS_SET = {w for w in FILLER_WORDS}
PUNCT = re.compile(r"[^\w°%.→\-]+|[\u4e00-\u9fff]", re.UNICODE)

def _words(s):
    s = s.lower()
    s = re.sub(r"[\u4e00-\u9fff]", " ", s)
    return [w for w in re.split(r"[^\w°%.→-]+", s) if w]

# ④ if the Object column contains these words, the shot counts as text-led.
TEXTY = re.compile(r"\b(titles?|subtitles?|headlines?|texts?|words?|bullets?|lists?|captions?|keywords?|quotes?|slogans?|taglines?|text card|quote card)\b", re.I)
# ② Action: after removing modifiers and the Object's own nouns, only all-purpose verbs left = "no action".
WEAK = """appear appears appearing appeared show shows showing showed display displays displayed present presents presented
fade in fades in fade out fades out pop up pops up popup emerge emerges emerged list lists listed light up lights up
stay stays staying still motionless hold holds keeping keep keeps sit sits siting place placed places exist exists
introduce introduces explain explains describe describes emphasize emphasizes highlight highlights labeled labelled
enter enters exit exits visible""".split()
ACT_FILLER = """one by one one gradually slowly then start starts meanwhile next together once again the a an of and or to
in on at with for from is are being while as very more most""".split()


def cam_norm(s):
    return re.sub(r"\s+", " ", (s or "").lower().strip())


# Camera column vocabulary: hold / slow push / pull back / pan / fast push / slam / cut (whip = whip pan).
# Usage and durations: references/camera-language.md
CAM_MOVE = ("slow push", "pull back", "pull out", "pan", "fast push", "slam", "push in", "push", "whip", "move")
CAM_IN = ("slow push", "fast push", "push in", "slam", "push", "zoom in", "zoom-in", "zoomin")
CAM_ACCENT = ("fast push", "slam", "whip")
# ① Object left with only these words: an empty scene, not a layout element — different fix
EMPTY_SCENE = re.compile(r"empty shot|empty scene|empty frame|empty screen|black frame|black screen|white screen|"
                         r"all black|all white|dark frame|blank|flat color|\bsolid\b|\bgradient\b|^background$|^backdrop$")
EMPTY_CELL = {"", "-", "—", "–", "none", "n/a", "na", "empty", "(empty)", "/", "——"}
GRAMMAR = re.compile(r"\b([ty][1-9])(?:_[a-z_]+)?\b", re.I)
# ⑫–⑭ style lock
LOCK = re.compile(r"^\s*[-*]?\s*(?:\*\*)?(Style|Palette|Characters|Blue-purple OK)(?:\*\*)?\s*[:：]\s*(.+?)\s*$", re.I)
PALETTES = {"paper", "poster", "ink", "navy", "bauhaus", "snow", "wood", "chalk"}
HEX = re.compile(r"#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b")
FLAT_STYLE = re.compile(r"^(?:37_rick_morty|52_south_park)(?=$|[\s：:，,；;·（(])", re.I)
CHAR_BAD = re.compile(r"code[- ]?drawn|code[- ]?generated|hand[- ]?drawn svg|\bsvg\b|chibi|stick[- ]?figure|robot|cartoon (?:person|character|figure)", re.I)
CHAR_FRAMES = re.compile(r"frame lib|frames|\.png|/", re.I)
CHAR_NONE = re.compile(r"^none$|no people|no character|no faces|hands (and back )?only|hands|back of|silhouette", re.I)
OBJ_CHAR = re.compile(r"\brobot\b|stick[- ]?figure|\bchibi\b|\bmascot\b|cartoon (?:person|character|figure)", re.I)
OBJ_FACE = re.compile(r"(smiley|smile|faces?|eyes|expressions?)[^,;|]{0,14}(coins?|balls?|ions?|electrons?|particles?|molecules?)|"
                      r"(coins?|balls?|ions?|electrons?|particles?|molecules?)[^,;|]{0,14}(smiley|smile|faces?|eyes|expressions?)", re.I)


def read_lock(text, table_line=None):
    """Style lock outside the table: {Style, Palette, Characters, Blue-purple OK}. Code fences don't count;
    when a key repeats, the line closest above the table wins (below the table only if nothing above)."""
    before, after, fence = {}, {}, False
    for i, ln in enumerate(text.splitlines(), 1):
        if ln.strip().startswith("```"):
            fence = not fence; continue
        m = None if fence else LOCK.match(ln)
        if not m: continue
        if table_line is None or i < table_line: before[m.group(1).capitalize() if m.group(1).lower() != "blue-purple ok" else "Blue-purple OK"] = m.group(2).strip()
        else: after.setdefault(m.group(1).capitalize() if m.group(1).lower() != "blue-purple ok" else "Blue-purple OK", m.group(2).strip())
    return {**after, **before}


def blue_purple_hex(h):
    h = h if len(h) == 6 else "".join(c * 2 for c in h)
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
    mx, mn = max(r, g, b), min(r, g, b); d = mx - mn
    if d == 0 or mx == 0: return False
    hue = (((g - b) / d) % 6 if mx == r else (b - r) / d + 2 if mx == g else (r - g) / d + 4) * 60
    return 225 <= hue <= 300 and d / mx >= 0.30 and 0.06 <= mx <= 0.90


def strip_cells(line):
    s = line.strip().replace("｜", "|")
    if s.startswith("|"): s = s[1:]
    if s.endswith("|"): s = s[:-1]
    return [c.strip() for c in s.split("|")]


def find_table(text):
    """Return (header, rows[(lineno, cells)]). Skips code fences; takes the first table with both Object and Action columns."""
    lines, fence, i = text.splitlines(), False, 0
    while i < len(lines):
        ln = lines[i]
        if ln.strip().startswith("```"):
            fence = not fence; i += 1; continue
        if not fence and ln.strip().startswith(("|", "｜")) and i + 1 < len(lines) and re.match(r"^\s*[|｜]?\s*:?-{2,}", lines[i + 1]):
            head = strip_cells(ln)
            rows, j = [], i + 2
            while j < len(lines) and lines[j].strip().startswith(("|", "｜")):
                rows.append((j + 1, strip_cells(lines[j]))); j += 1
            hl = [h.lower() for h in head]
            if any("object" in h for h in hl) and any(("action" in h) for h in hl):
                return head, rows
            i = j; continue
        i += 1
    return None, []


def columns(head):
    col = {}
    for k, h0 in enumerate(head):
        h = h0.lower()
        if "time" in h and "time" not in col: col["time"] = k
        elif "object" in h and "obj" not in col: col["obj"] = k
        elif "action" in h and "act" not in col: col["act"] = k
        elif "camera" in h and "cam" not in col: col["cam"] = k
        elif "tag" in h and "tags" not in col: col["tags"] = k
        elif "how" in h and "how" not in col: col["how"] = k
        elif "text" in h and "text" not in col: col["text"] = k
    return col


def parse_t(tok):
    tok = tok.strip()
    if ":" in tok:
        m, s = tok.split(":", 1)
        return int(m) * 60 + float(s)
    return float(tok)


def parse_span(cell):
    nums = re.findall(r"\d+:\d+(?:\.\d+)?|\d+(?:\.\d+)?", cell)
    if len(nums) < 2: return None
    a, b = parse_t(nums[0]), parse_t(nums[1])
    return (a, b) if b > a else None


def clean_cell(c):
    c = re.sub(r"<br\s*/?>", " ", c or "")
    return c.strip().strip("`*_").strip()


def is_empty(c):
    return clean_cell(c) in EMPTY_CELL


def _singular(w):
    if w.endswith("ies") and len(w) > 4: return w[:-3] + "y"
    if w.endswith("es") and len(w) > 4: return w[:-2]
    if w.endswith("s") and len(w) > 3: return w[:-1]
    return w


def obj_residue(obj):
    left = [w for w in _words(clean_cell(obj)) if w not in ABSTRACT_SET and w not in FILLER_WORDS_SET and not w.isdigit()]
    return " ".join(left)


def act_residue(act, obj=""):
    """What's left after removing all-purpose verbs, modifiers and the Object column's own nouns.
    "bullets appear one by one" and "spores appear" leave nothing."""
    obj_toks = {_singular(w) for w in _words(clean_cell(obj))}
    out = []
    for w in _words(clean_cell(act)):
        if _singular(w) in obj_toks: continue
        if w.isdigit(): continue
        out.append(w)
    s = " " + " ".join(out) + " "
    for w in sorted({*WEAK, *ACT_FILLER, *(" ".join(p.split()) for p in ["fade in", "fade out", "pop up", "light up", "one by one"])}, key=len, reverse=True):
        s = s.replace(" " + w + " ", " ")
    return s.strip()


def text_len(t):
    t = clean_cell(t)
    if t in EMPTY_CELL: return 0
    t = re.sub(r"[「」『』“”\"'‘’《》]", "", t)
    return len(re.findall(r"[㐀-鿿]|[A-Za-z0-9][A-Za-z0-9.%°'’-]*", t))


def how_kind(how):
    """How column → kind of picture method: grammar id (t1…y6), scenes, material; otherwise verbatim."""
    h = clean_cell(how)
    if h in EMPTY_CELL: return None
    m = GRAMMAR.search(h)
    if m: return m.group(1).lower()
    if re.search(r"scenes?|\.js\b|code[- ]?drawn", h, re.I): return "scenes"
    if re.search(r"material|screenshot|photo|footage|live|original|screen recording|recording", h, re.I): return "material"
    return h


def clip_name(how):
    m = re.search(r"[^\s|，,：:（）()]+\.json", clean_cell(how))
    return m.group(0) if m else None


def tag_count(cell):
    """Tags column: split on commas, semicolons, slashes, middots; if no separator at all, split on spaces."""
    c = clean_cell(cell)
    if c in EMPTY_CELL: return 0
    parts = [x for x in re.split(r"[、，,;；·•|/]+", c) if x.strip()]
    if len(parts) <= 1: parts = c.split()
    return len(parts)


# ⑨ Numbers: on screen only Arabic digits count (the English word "one" is everywhere; treating it as a number would false-positive);
# the script accepts digits, English number words and Chinese numerals — better to miss than to wrongly accuse.
CN_DIGIT = {"零": 0, "〇": 0, "一": 1, "二": 2, "两": 2, "三": 3, "四": 4, "五": 5, "六": 6, "七": 7, "八": 8, "九": 9}
CN_UNIT = {"十": 10, "百": 100, "千": 1000}
CN_BIG = {"万": 10 ** 4, "亿": 10 ** 8}
ARABIC = re.compile(r"\d+(?:,\d{3})*(?:\.\d+)?")
CN_NUM = re.compile(r"[零〇一二两三四五六七八九十百千万亿]+(?:点[零〇一二三四五六七八九]+)?")
SRT_NOISE = re.compile(r"\d{1,2}:\d{2}:\d{2}[,.]\d{1,3}|^\s*\d+\s*$", re.M)

EN_ONES = {"zero": 0, "one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6, "seven": 7, "eight": 8, "nine": 9,
           "ten": 10, "eleven": 11, "twelve": 12, "thirteen": 13, "fourteen": 14, "fifteen": 15, "sixteen": 16,
           "seventeen": 17, "eighteen": 18, "nineteen": 19}
EN_TENS = {"twenty": 20, "thirty": 30, "forty": 40, "fifty": 50, "sixty": 60, "seventy": 70, "eighty": 80, "ninety": 90}
EN_SCALES = {"hundred": 10 ** 2, "thousand": 10 ** 3, "million": 10 ** 6, "billion": 10 ** 9}
_BASE = sorted(list(EN_ONES) + list(EN_TENS) + ["point"], key=len, reverse=True)          # longest first: sixty before six
_CONT = sorted(list(EN_ONES) + list(EN_TENS) + ["hundred", "thousand", "million", "billion", "point"], key=len, reverse=True)
EN_NUM_WORD = re.compile(r"\b(?:" + "|".join(_BASE) + r")(?:[- ](?:(?:" + "|".join(_CONT) + r")))?"
                         r"(?:\s+(?:" + "|".join(_CONT) + r"))*", re.I)


def en_number_run(run):
    """One run of English number words → (value, decimals) candidates. 'twenty five' → 25; 'fifteen point two' → 15.2;
    'one hundred twenty three' → 123; 'twelve thousand' → 12000."""
    toks = re.split(r"[\s-]+", run.lower().strip())
    toks = [t for t in toks if t and t != "and"]
    if not toks: return []
    if len(toks) > 1 and all(t in EN_ONES and EN_ONES[t] <= 9 for t in toks):   # digit-by-digit reading: "two zero two five" = 2025
        return [(float("".join(str(EN_ONES[t]) for t in toks)), 0)]
    out, i = [], 0
    # split at "point": integer part then digit-by-digit fraction
    if "point" in toks:
        p = toks.index("point")
        ints = en_number_run(" ".join(toks[:p])) if p else [(0, 0)]
        frac_digits = [EN_ONES.get(t, None) for t in toks[p + 1:]]
        if all(d is not None for d in frac_digits) and frac_digits and ints:
            fr = "".join(str(d) for d in frac_digits)
            return [(float(f"{int(v)}.{fr}" if v == int(v) else f"{v}.{fr}"), len(fr)) for v, _ in ints]
        return ints
    total, sect, num = 0, 0, None
    for t in toks:
        if t in EN_ONES: num = (num + EN_ONES[t]) if num and num >= 10 and num % 10 == 0 else EN_ONES[t]   # "twenty five" = 25
        elif t in EN_TENS: num = (num or 0) + EN_TENS[t] if num and num < 10 else EN_TENS[t]
        elif t == "hundred": sect += (1 if num is None else num) * 100; num = None
        elif t in EN_SCALES:
            sect = (sect + (num or 0)) or 1
            total += sect * EN_SCALES[t]; sect, num = 0, None
        else: return []
    out.append((float(total + sect + (num or 0)), 0))
    return out


def cn_ints(s):
    """Chinese integers, two readings: 三百一十八 → 318, 二零二五 → 2025 (digit by digit), 一千二 → 1200 and 1002."""
    if not s: return set()
    if all(ch in CN_DIGIT for ch in s):
        return {int("".join(str(CN_DIGIT[ch]) for ch in s))}
    total, sect, num, last = 0, 0, None, None
    for ch in s:
        if ch in CN_DIGIT: num = CN_DIGIT[ch]
        elif ch in CN_UNIT: sect += (1 if num is None else num) * CN_UNIT[ch]; num, last = None, CN_UNIT[ch]
        elif ch in CN_BIG: total += (sect + (num or 0)) * CN_BIG[ch]; sect, num, last = 0, None, CN_BIG[ch]
        else: return set()
    out = {total + sect + (num or 0)}
    if num is not None and last and last > 10 and s[-2] not in "零〇":         # 一千二 = 1200, 三万五 = 35000
        out.add(total + sect + num * last // 10)
    return out


def cn_values(tok):
    """Chinese number → [(value, decimals)]."""
    a, _, b = tok.partition("点")
    ints = cn_ints(a) if a else {0}
    if not b: return [(float(i), 0) for i in ints]
    frac = "".join(str(CN_DIGIT[ch]) for ch in b)
    return [(float(f"{i}.{frac}"), len(frac)) for i in ints]


def scaled(v, dec, after):
    """A number followed by 万/亿/k/M/%: accept both the written and the multiplied value (screen 1.2K = script twelve hundred)."""
    out = [(v, dec)]
    m = re.match(r"\s*(万|亿|[kK]|[mM](?![a-zA-Z]))", after)
    if m:
        k = {"万": 4, "亿": 8, "k": 3, "K": 3, "m": 6, "M": 6}[m.group(1)]
        out.append((v * 10 ** k, dec - k))
    return out


def arabic(tok):
    t = tok.replace(",", "")
    return float(t), len(t.partition(".")[2])


def screen_numbers(text):
    """Numbers in on-screen text: [(raw, [(value, decimals)])]."""
    t = clean_cell(text)
    return [(m.group(0), scaled(*arabic(m.group(0)), t[m.end():])) for m in ARABIC.finditer(t)]


def script_numbers(script):
    """Numbers spoken in the script: [(value, tolerance)]. Tolerance follows the precision of the spoken number:
    say "nine times" and a screen 8.7 matches; say "fifteen point two" and the screen must show 15.2."""
    s = SRT_NOISE.sub(" ", script)
    have = []
    for m in ARABIC.finditer(s):
        have += scaled(*arabic(m.group(0)), s[m.end():])
    for m in CN_NUM.finditer(s):
        for v, d in cn_values(m.group(0)):
            have += scaled(v, d, s[m.end():])
            if s[m.end():m.end() + 1] == "成": have.append((v * 10, d - 1))     # 六成 = 60%
    for m in EN_NUM_WORD.finditer(s):
        after = s[m.end():]
        for v, d in en_number_run(m.group(0)):
            have.append((v, d))
            if re.match(r"\s*percent", after, re.I): have.append((v, d))       # "sixty percent" = 60 (screen shows 60%)
            if re.match(r"\s*(thousand|million|billion)", after, re.I):
                have += scaled(v, d, " " + re.match(r"\s*(thousand|million|billion)", after, re.I).group(1)[0].join(["k", "M", "M", "B"]))
    return {(round(v, 6), 0.5 * 10.0 ** -d + 1e-9) for v, d in have}


def number_in(vals, have):
    return any(abs(x - v) <= tol for x, _ in vals for v, tol in have)


def lint(text, script=None):
    """Return dict: rows (per-row results), table (whole-table results), verdict, summary.
    script: full voiceover script (optional); ⑨ is only checked when given."""
    head, raw = find_table(text)
    if head is None:
        return {"error": "no storyboard table found: need a markdown table with at least Object and Action columns (tables inside code fences don't count)."}
    col = columns(head)
    miss = [n for k, n in (("time", "Time"), ("obj", "Object"), ("act", "Action"), ("cam", "Camera"), ("text", "On-screen text")) if k not in col]
    if miss:
        return {"error": "storyboard is missing columns: " + ", ".join(miss) + ". Columns: Time | Object | Action | Camera | On-screen text | How."}
    get = lambda cells, k: cells[col[k]] if k in col and col[k] < len(cells) else ""
    rows, table = [], []
    for n, (lineno, cells) in enumerate(raw, 1):
        if all(is_empty(c) for c in cells): continue
        obj, act, cam, txt, how = (get(cells, k) for k in ("obj", "act", "cam", "text", "how"))
        span = parse_span(get(cells, "time"))
        r = {"n": len(rows) + 1, "line": lineno, "obj": clean_cell(obj), "act": clean_cell(act), "cam": clean_cell(cam),
             "text": clean_cell(txt), "how": clean_cell(how), "span": span, "dur": (span[1] - span[0]) if span else None,
             "chars": text_len(txt), "issues": []}
        bad = r["issues"].append
        if is_empty(obj):
            bad((RED, "① object", "Object column is empty", "write one thing you could point at in frame and say 'that one': a person, a hand, a machine, a concrete object"))
        elif not obj_residue(obj) and EMPTY_SCENE.search(clean_cell(obj).lower()):
            bad((RED, "① object", f"'{r['obj']}' is an empty scene (empty shot, flat color, black frame) — the protagonist is not in frame", "this shot needs its protagonist or main object doing something too; to let the film breathe, let the object hold still or pull back — don't remove it"))
        elif not obj_residue(obj):
            bad((RED, "① object", f"'{r['obj']}' is not an object, it is a layout element", "behind every bullet there is a thing doing something — draw it: 'three reasons' → three concrete things, one shot each, each doing one thing"))
        if is_empty(act):
            bad((RED, "② action", "Action column is empty", "write one verb: falls down, cracks open, burrows in, gets sliced"))
        elif not act_residue(act, obj):
            bad((RED, "② action", f"'{r['act']}' is just appears/shows — no action", "write the object's own action: where it comes from, where it goes, what it hits, what it becomes"))
        if r["chars"] > 8:
            bad((RED, "③ text", f"on-screen text has {r['chars']} tokens, over 8", "keep one word or half a phrase; hand the rest to the voiceover or subtitles"))
        r["texty"] = bool(TEXTY.search(r["obj"])) or r["chars"] >= 7 or how_kind(how) == "y5"
        if span is None:
            bad((RED, "⑥ duration", f"time span '{clean_cell(get(cells, 'time'))}' cannot be read", "write it as 0–3 or 0:03–0:07"))
        elif r["dur"] > 8:
            bad((RED, "⑥ duration", f"this shot is {r['dur']:g} s, over 8 s", "split into two or three shots of 2–6 s each, changing the picture or the camera move"))
        elif r["dur"] > 6:
            bad((YELLOW, "⑥ duration", f"this shot is {r['dur']:g} s (6–8 s allowed only for a few)", "split if you can; otherwise let something new happen inside it: the object's next action, pan to the next thing, pull back to reveal"))
        elif r["dur"] < 2:
            bad((YELLOW, "⑥ duration", f"this shot is only {r['dur']:g} s", "insert shots may be short; if the voiceover can't finish a sentence here, merge into a neighboring shot"))
        if is_empty(cam):
            bad((YELLOW, "camera", "Camera column is empty", "write one: hold / slow push / pull back / pan / fast push / slam / cut"))
        if "tags" in col:
            r["tags"] = tag_count(get(cells, "tags"))
            if r["tags"] > 3:
                bad((YELLOW, "⑩ tags", f"this shot has {r['tags']} tags crowded together", "max 3 per shot; hand the rest to the voiceover or the next shot; pin each tag next to the object it labels — don't make a row of glowing pills"))
        rows.append(r)
    if not rows:
        return {"error": "storyboard is empty: one shot per row under the header."}

    # ④ first shot
    f = rows[0]
    if f["texty"]:
        f["issues"].append((RED, "④ opening", "first shot is text-led (title/text)", "open the first 3 seconds with a concrete small scene: a person or an object doing something tied to the topic; give the title a shot later, or not at all"))
    elif f["chars"] >= 4:
        f["issues"].append((YELLOW, "④ opening", f"the very first shot already has {f['chars']} text tokens", "let the picture speak first; save text for shot two"))
    # ⑧ last shot
    z = rows[-1]
    if len(rows) > 1 and z["texty"]:
        z["issues"].append((RED, "⑧ ending", "last shot is text-led (centered quote card / pure text card)",
                            "end on the protagonist or main object doing one action: into the pocket, book closes, pull back to reveal; text may live on an object in frame — no standalone text card"))
    # ⑪ middle number cards: a lone number on a flat card keeps reading (in blind reviews) as "a PPT page inserted"
    for r in rows[1:-1]:
        if r["texty"] and screen_numbers(r["text"]):
            r["issues"].append((YELLOW, "⑪ number card", "this shot is a standalone number card",
                                "slam the number onto an object inside the world: a phone screen, a battery bar, a price tag, a chalkboard, paper; no standalone big-type card on a flat background"))
    # ⑨ screen numbers vs script
    if script is not None:
        have = script_numbers(script)
        for r in rows:
            miss = [tok for tok, vals in screen_numbers(r["text"]) if not number_in(vals, have)]
            if miss:
                r["issues"].append((RED, "⑨ numbers", f"on-screen number(s) '{', '.join(miss)}' not found in the script — screen and voiceover disagree",
                                    "check the source and make the on-screen text the number the voiceover speaks (or change the voiceover); both sides must be the same number"))
    # ⑦ three identical camera moves in a row
    for k in range(2, len(rows)):
        c = rows[k]["cam"]
        if c and not is_empty(c) and c not in ("hold", "pan") and c == rows[k - 1]["cam"] == rows[k - 2]["cam"]:   # holds may repeat; panning item to item across the Vox desk is normal too
            alt = " / ".join(w for w in ("hold", "slow push", "pull back", "pan", "cut") if w != c)
            rows[k]["issues"].append((YELLOW, "⑦ camera", f"three consecutive shots are all '{c}'", f"change the middle one to: {alt} — pick by what this shot wants the audience to look at"))
    # ⑮ three inward pushes in a row: push every shot and the whole film becomes a stutter of zoom-ins
    # (2026-10-12 Nobel short: 102 s, ~48 push-ins, judged "too many, too fast, not smooth")
    inward = [any(w in cam_norm(r["cam"]) for w in CAM_IN) and "pull" not in cam_norm(r["cam"]) and "out" not in cam_norm(r["cam"]) for r in rows]
    for k in range(2, len(rows)):
        if inward[k] and inward[k - 1] and inward[k - 2] and not any(i[1] == "⑦ camera" for i in rows[k]["issues"]):
            rows[k]["issues"].append((YELLOW, "⑮ push-ins", "three consecutive shots all push inward", "after pushing in there must be give and take: switch the middle to hold, pull back, pan, or a hard cut to a new shot size; if live footage is already moving, hold"))
    # time spans connecting
    for k in range(1, len(rows)):
        a, b = rows[k - 1]["span"], rows[k]["span"]
        if a and b and abs(b[0] - a[1]) > 0.05:
            rows[k]["issues"].append((YELLOW, "time", f"previous shot ends at {a[1]:g}s, this one starts at {b[0]:g}s", "connect them, or note an intentional gap here"))

    n = len(rows)
    texty = [r["n"] for r in rows if r["texty"]]
    if len(texty) / n > 0.30:
        table.append((RED, "⑤ text share", f"text-led shots {len(texty)}/{n} ({len(texty) / n:.0%}), over 30%: shots {', '.join(map(str, texty))}",
                      "replace half of them with a thing doing something; hand the words to voiceover and subtitles"))
    long_ = [r["n"] for r in rows if r["dur"] and 6 < r["dur"] <= 8]
    if len(long_) > max(1, n // 5):
        table.append((RED, "⑥ duration", f"{len(long_)} shots run 6–8 s (shots {', '.join(map(str, long_))}); only a few are allowed",
                      "split them; every shot 2–6 s"))
    if not any(any(w in cam_norm(r["cam"]) for w in CAM_MOVE) for r in rows):
        table.append((YELLOW, "camera", "no camera move anywhere in the table — only holds and cuts", "the delivery gate measures in-shot motion; all-hold usually means red; add slow pushes, pans or pull-backs where the eye must travel (the object's own motion counts too)"))
    acc = [r["n"] for r in rows if any(w in cam_norm(r["cam"]) for w in CAM_ACCENT)]
    if n >= 6 and len(acc) * 3 > n:
        table.append((YELLOW, "⑯ accents", f"fast push / slam / whip used on {len(acc)}/{n} shots (shots {', '.join(map(str, acc))}) — too many accents and no accent lands",
                      "save them for the reveals, reversals and key numbers; switch the rest to slow push, pan, pull back or hold"))
    total = sum(r["dur"] or 0 for r in rows)
    if "how" in col:
        clips = {}
        for r in rows:
            c = clip_name(r["how"])
            if c: clips.setdefault(c, []).append(r)
        for c, rs in clips.items():
            s = sum(r["dur"] or 0 for r in rs)
            if s > 8:
                table.append((RED, "how", f"parametric clip {c} carries {s:g} s (shots {', '.join(str(r['n']) for r in rs)})",
                              "one parametric clip carries at most 8 s; longer reads as a PPT page — split into several specs and put other methods in between"))
        grams = sorted({k for k in (how_kind(r["how"]) for r in rows) if k and GRAMMAR.fullmatch(k)})
        if len(grams) > 2:
            table.append((RED, "how", f"{len(grams)} clip grammars used ({', '.join(grams)}) — that assembles into several art styles",
                          "one film uses at most 2 clip grammars, every spec writes the same theme; the other shots use scenes on the same palette, or real material full-frame"))
        empty_how = [r["n"] for r in rows if how_kind(r["how"]) is None]
        if empty_how:
            table.append((YELLOW, "how", f"shots {', '.join(map(str, empty_how))} have no How written", "say which grammar's clip (shotNN.json), scenes/<id>.js, or material"))
    else:
        table.append((YELLOW, "how", "no How column — can't check clip length or grammar count", "add one: y2 clip shot01.json / scenes/<id>.js / material photo"))

    # ⑫–⑭ style lock: one visual language for the film, palette out of blue-purple, characters either fine-drawn or faceless
    lock = read_lock(text, raw[0][0] - 2 if raw else None)
    miss = [k for k in ("Style", "Palette", "Characters") if not lock.get(k)]
    if miss:
        table.append((RED, "⑫ style lock", f"missing {', '.join(repr(m) for m in miss)} above the table",
                      "write three lines above the table — Style: one sentence, the whole film uses only this; Palette: a palette name or 3–6 hex values (references/palettes.md); "
                      "Characters: none / hands and back only / frame lib <path> (references/character-fidelity.md)"))
    pal = lock.get("Palette", "")
    if pal:
        hexes = HEX.findall(pal)
        named = any(n in pal.lower() for n in PALETTES)
        bp = [f"#{h}" for h in hexes if blue_purple_hex(h)]
        if bp:
            table.append((YELLOW if lock.get("Blue-purple OK") else RED, "⑬ palette", "palette contains blue-purple: " + ", ".join(bp) + (" (Blue-purple OK reason given)" if lock.get("Blue-purple OK") else ""),
                          "swap to a set from references/palettes.md, or move these hues out of 225°–300°; write 'Blue-purple OK: reason' only when the user explicitly asked for blue-purple"))
        if len(hexes) > 6:
            table.append((YELLOW, "⑬ palette", f"palette has {len(hexes)} colors", "one film: 3–6 colors — ground, surface, primary text, secondary text, one or two accents"))
        if not hexes and not named:
            table.append((YELLOW, "⑬ palette", f"palette '{pal}' is neither a palette name nor hex values", "use a name from references/palettes.md, or 3–6 #hex values"))
    ch = lock.get("Characters", "")
    frames = bool(ch and CHAR_FRAMES.search(ch))
    # Only the explicitly selected, documented flat-character routes; y4 still needs frames.
    flat_svg = bool(FLAT_STYLE.search(lock.get("Style", ""))
                    and ch.lower().startswith("original semantic svg")
                    and not re.search(r"real (?:person|people)|photoreal|realistic", ch, re.I))
    if ch and CHAR_BAD.search(ch) and not (frames or flat_svg):
        table.append((RED, "⑭ characters", f"Characters says '{ch}': code-drawn chibi figures and robots are retired",
                      "with image generation, use AI frames (references/10-characters.md); without, show only hands, backs, silhouettes — or no people at all"))
    for r in rows:
        if OBJ_CHAR.search(r["obj"]) and not (frames or flat_svg):
            r["issues"].append((RED, "⑭ characters", f"Object column has '{OBJ_CHAR.search(r['obj']).group(0)}' but Characters is not a frame lib",
                                "make this shot hands, a back, or an object; to show a character, build the frame lib first (references/character-fidelity.md)"))
        if OBJ_FACE.search(r["obj"] + " " + r["act"]):
            r["issues"].append((YELLOW, "⑭ characters", "a coin / ball / ion was given a face", "draw things as things: shape, color, action carry the meaning — no expressions"))
        if how_kind(r["how"]) == "y4" and not frames:
            r["issues"].append((RED, "⑭ characters", "y4 requires a character frame lib; the Characters line is not one", "switch to y2/y5 or scenes and tell it with hands and objects; with image generation, build the frame lib first"))

    issues = [x for r in rows for x in r["issues"]] + table
    verdict = RED if any(x[0] == RED for x in issues) else YELLOW if issues else GREEN
    numbered = [r["n"] for r in rows if screen_numbers(r["text"])]
    return {"rows": rows, "table": table, "verdict": verdict, "total": total, "texty": texty,
            "script": script is not None, "numbered": numbered}


def report(res):
    if "error" in res: return [res["error"]]
    L = []
    for r in res["rows"]:
        light = RED if any(x[0] == RED for x in r["issues"]) else YELLOW if r["issues"] else GREEN
        span = f"{r['span'][0]:g}–{r['span'][1]:g}s" if r["span"] else "?"
        L.append(f"[{light}] shot {r['n']:>2}  {span:<10} {r['obj'][:28]}")
        for lv, tag, what, fix in r["issues"]:
            L.append(f"      [{lv}] {tag}: {what}. Fix: {fix}")
    L.append("")
    L.append(f"whole table: {len(res['rows'])} shots, {res['total']:g} s, {len(res['texty'])} text-led shots")
    for lv, tag, what, fix in res["table"]:
        L.append(f"  [{lv}] {tag}: {what}. Fix: {fix}")
    L.append("")
    L.append({RED: "Verdict: RED. Fix the storyboard and rerun this command; do not start coding until red clears.",
              YELLOW: "Verdict: YELLOW. You may start; think through each yellow item and write a reason for it in the delivery notes.",
              GREEN: "Verdict: GREEN. You may start."}[res["verdict"]])
    if not res.get("script") and res.get("numbered"):
        L.append(f"shots {', '.join(map(str, res['numbered']))} show numbers on screen: add --script script.txt to check they match the voiceover.")
    L.append("What a machine can't check — verify yourself: one concrete example running through the film, one art style throughout; adjacent shots differing in composition; the first 3 seconds being a small scene, not the topic.")
    return L


def main(argv=None):
    argv = list(sys.argv[1:] if argv is None else argv)
    if any(a in ("-h", "--help") for a in argv):
        print(__doc__); return 0
    sp = None
    if "--script" in argv:
        k = argv.index("--script")
        if k + 1 >= len(argv):
            print("--script needs a script path after it", file=sys.stderr); return 2
        sp = Path(argv[k + 1]); del argv[k:k + 2]
    if len(argv) != 1:
        print(__doc__); return 2
    p = Path(argv[0])
    try:
        text = p.read_text(encoding="utf-8")
        script = sp.read_text(encoding="utf-8") if sp else None
    except OSError as e:
        print(f"cannot read {e.filename}: {e.strerror}", file=sys.stderr); return 2
    res = lint(text, script)
    print("\n".join(report(res)))
    if "error" in res: return 2
    return 1 if res["verdict"] == RED else 0


if __name__ == "__main__":
    sys.exit(main())
