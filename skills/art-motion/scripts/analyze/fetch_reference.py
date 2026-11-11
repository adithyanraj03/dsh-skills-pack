#!/usr/bin/env python3
# /// script
# dependencies = ["pillow"]
# ///
"""Original-art anchoring: pull public-domain originals from Wikimedia Commons by keyword, keep them local, and extract a dominant palette plus a contact sheet.

Run this before any new style demo: look at the originals, note the signature features, take the real colour values — never paint an 'inspired flat illustration' from memory.

uv run fetch_reference.py --out refs/ostia "Giotto Lamentation Scrovegni" "Giotto Meeting at the Golden Gate" [--n 1] [--colors 8]

Each query takes the first n (default 1) 1600px-wide thumbnails, saved as <out>/<index>_<title>.jpg, and also writes <out>/references.md (source URL, dominant hex colours) and <out>/contact-sheet.jpg.
Only public-domain works (reproductions of originals whose author died more than 70 years ago); the script does not judge copyright — that is up to the caller.
After pulling you must look at the contact sheet and check three things: (1) are these really works by this painter (the search also mixes in maps, modern photos and reproductions shot on museum walls); (2) are they three different works (the script only drops near-duplicates); (3) which ones are framed reproductions (the palette already samples the central 80%, but composition still has to be judged by eye).
"""
import argparse, json, re, sys, time, urllib.parse, urllib.request
from pathlib import Path
from PIL import Image, ImageDraw

UA = {'User-Agent': 'art-motion-research/1.0 (https://github.com/alchaincyf/huashu-art-motion)'}


def get(url, timeout=60, tries=4):
    # Wikimedia Commons occasionally returns an SSL EOF: retry a few times before failing
    for k in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout) as r:
                return r.read()
        except Exception as e:
            if k == tries - 1:
                raise
            time.sleep(1.5 * (k + 1))


def api(**kw):
    return json.loads(get('https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode({**kw, 'format': 'json'})))


def search(q, n):
    d = api(action='query', generator='search', gsrsearch=f'{q} filetype:bitmap', gsrnamespace=6, gsrlimit=n + 4,
            prop='imageinfo', iiprop='url|size', iiurlwidth=1600)
    pages = sorted(d.get('query', {}).get('pages', {}).values(), key=lambda p: p.get('index', 0))
    out = []
    for p in pages:
        ii = (p.get('imageinfo') or [{}])[0]
        if ii.get('thumburl') and ii.get('width', 0) >= 900:
            out.append((p['title'].removeprefix('File:'), ii['thumburl'], ii.get('descriptionurl', '')))
        if len(out) >= n:
            break
    return out


def palette(im, k):
    w, h = im.size; im = im.crop((int(w * .1), int(h * .1), int(w * .9), int(h * .9)))   # drop frame, wall and page margins: sample colours from the central 80% only
    q = im.convert('RGB').resize((200, 200)).quantize(colors=k, method=Image.Quantize.MEDIANCUT)
    pal = q.getpalette()[:k * 3]
    cnt = sorted(q.getcolors(), reverse=True)
    return ['#%02x%02x%02x' % tuple(pal[i * 3:i * 3 + 3]) + f' {c / 400:.0f}%' for c, i in cnt]


def ahash(im):
    from PIL import ImageOps
    g = ImageOps.autocontrast(im.convert('L').resize((16, 16)), cutoff=2)       # stretch contrast first, so a colour-graded copy lands near the same hash as the original
    px = list(g.tobytes()); m = sum(px) / 256
    return sum((1 << i) for i, v in enumerate(px) if v > m)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('queries', nargs='+')
    ap.add_argument('--out', required=True)
    ap.add_argument('--n', type=int, default=1)
    ap.add_argument('--colors', type=int, default=8)
    a = ap.parse_args()
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    rows, md, seen = [], ['# Original references\n'], []
    for q in a.queries:
        hits = search(q, a.n)
        if not hits:
            print(f'!! nothing found: {q}', file=sys.stderr); continue
        for title, url, page in hits:
            fn = out / (f'{len(rows) + 1:02d}_' + re.sub(r'[^\w]+', '_', title)[:50] + '.jpg')
            fn.write_bytes(get(url, 90))
            im = Image.open(fn)
            hv = ahash(im)
            if any(bin(hv ^ h2).count('1') <= 40 for h2 in seen):                      # another reproduction / colour-graded version of the same work: drop it instead of padding the count
                fn.unlink(); print('dup  ', title, '(near-duplicate of an image already taken; dropped)'); continue
            seen.append(hv)
            rows.append((fn, im.copy()))
            md.append(f'- {fn.name}\n  - Source: {page}\n  - Dominant colours: {", ".join(palette(im, a.colors))}')
            print('ok', fn.name)
    if rows:
        W, H, cols = 640, 400, 3
        sheet = Image.new('RGB', (W * cols, H * ((len(rows) + cols - 1) // cols)), 'white')
        for i, (fn, im) in enumerate(rows):
            t = im.convert('RGB'); t.thumbnail((W, H))
            sheet.paste(t, ((i % cols) * W, (i // cols) * H))
            ImageDraw.Draw(sheet).text(((i % cols) * W + 6, (i // cols) * H + 6), fn.stem[:40], fill=(255, 0, 0))
        sheet.save(out / 'contact-sheet.jpg', quality=88)
    (out / 'references.md').write_text('\n'.join(md) + '\n')


main()
