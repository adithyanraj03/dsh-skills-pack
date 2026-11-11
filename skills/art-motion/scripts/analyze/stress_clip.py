#!/usr/bin/env python3
# /// script
# dependencies = ["pillow"]
# ///
"""Animation-grammar robustness stress test: render four variants of the same spec — portrait / overlong text / English / square — one frame each from after 'all cues have appeared', and tile them into one check sheet.

uv run scripts/analyze/stress_clip.py scripts/engine/examples/y5_kinetic_type.json --out <dir> [--variants portrait,long,en,square] [--at 0.95]

What to look for (ask each variant against the base version):
  long      does text overflow the frame / get clipped / shrink past legibility / land on other elements? Long text should wrap or scale down to the lower bound, stay readable, never overflow
  en        Latin text has different proportions: are weight, line breaks and tracking still right?
  portrait  did the layout re-flow for a narrow tall canvas (vertical stacking, enlarged), instead of squeezing the 16:9 layout into a narrow one? Content must not be clipped
  square    1:1, same as above
Once the sheet is out, review every cell by hand; fix problems in the grammar file, not just in the spec.
"""
import argparse, copy, json, subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

LONG = " — this is a deliberately overlong caption, appended to test whether auto-wrapping, scaling and collision avoidance stay stable"
TEXT_KEYS = ("text", "sub", "label", "title", "caption", "word", "key")


def font(size=16):
    for f in ('/System/Library/Fonts/PingFang.ttc', '/System/Library/Fonts/STHeiti Medium.ttc', '/Library/Fonts/Arial Unicode.ttf'):
        try:
            return ImageFont.truetype(f, size)
        except Exception:
            pass
    return ImageFont.load_default()


def absolutize(o, base: Path):
    if isinstance(o, dict):
        return {k: absolutize(v, base) for k, v in o.items()}
    if isinstance(o, list):
        return [absolutize(v, base) for v in o]
    if isinstance(o, str) and not o.startswith(('/', 'data:', 'http')) and (base / o).exists() and '.' in o.split('/')[-1]:
        return str((base / o).resolve())
    return o


def map_text(o, fn, key=None):
    if isinstance(o, dict):
        return {k: map_text(v, fn, k) for k, v in o.items()}
    if isinstance(o, list):
        return [map_text(v, fn, key) for v in o]
    if isinstance(o, str) and key in TEXT_KEYS and key != 'word':
        return fn(o)
    return o


EN_POOL = ["Gradient descent walks downhill", "One sentence turns into three thousand lines", "Revenue grew 7.8x in five years",
           "Two charts, both drawn by code", "Only one thing at a time", "A single drop holds billions of organisms"]


def en_fn():
    i = [0]

    def f(s):
        i[0] += 1
        return EN_POOL[i[0] % len(EN_POOL)] if len(s) > 4 else "OK " + str(i[0])
    return f


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('spec'); ap.add_argument('--out', required=True)
    ap.add_argument('--variants', default='portrait,long,en,square'); ap.add_argument('--at', type=float, default=0.95, help='frame at this fraction of the duration (default 0.95 = most cues have appeared)')
    a = ap.parse_args()
    sp = Path(a.spec).resolve(); out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    eng = Path(__file__).resolve().parents[1] / 'engine'
    base = absolutize(json.loads(sp.read_text(encoding='utf-8')), sp.parent)
    dur = base['duration']; t = round(dur * a.at, 2)
    vs = {'base': base}
    for v in a.variants.split(','):
        d = copy.deepcopy(base)
        if v == 'portrait': d['width'], d['height'] = 1080, 1920
        elif v == 'square': d['width'], d['height'] = 1080, 1080
        elif v == 'long': d = map_text(d, lambda s: s + LONG)
        elif v == 'en': d = map_text(d, en_fn())
        else: sys.exit(f'unknown variant {v}')
        vs[v] = d
    tiles = []
    for name, d in vs.items():
        f = out / f'{name}.json'; f.write_text(json.dumps(d, ensure_ascii=False))
        r = subprocess.run(['uv', 'run', '--with', 'playwright', 'python', str(eng / 'render.py'), '--spec', str(f), '--stills', str(t), '--out', str(out / name)], capture_output=True, text=True)
        pngs = sorted((out / name).glob('*.png'))
        if not pngs:
            print(f'[{name}] render failed:', (r.stdout + r.stderr).strip().splitlines()[-1:]); tiles.append((name, None)); continue
        tiles.append((name, Image.open(pngs[-1]).convert('RGB')))
    H = 420; row = []
    for name, im in tiles:
        im = im.resize((int(im.width * H / im.height), H)) if im else Image.new('RGB', (300, H), (110, 0, 0)); row.append((name, im))
    W = sum(i.width for _, i in row) + 8 * (len(row) + 1)
    sh = Image.new('RGB', (W, H + 30), (24, 24, 24)); dr = ImageDraw.Draw(sh); x = 8
    for name, im in row:
        sh.paste(im, (x, 26)); dr.text((x, 4), f'{sp.stem} · {name} @ {t}s', fill=(255, 220, 90), font=font(15)); x += im.width + 8
    o = out / 'check-sheet.jpg'; sh.save(o, quality=88); print('->', o)


main()
