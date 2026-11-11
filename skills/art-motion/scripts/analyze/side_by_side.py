#!/usr/bin/env python3
# /// script
# dependencies = ["pillow"]
# ///
"""Original side by side: the originals pulled by fetch_reference.py on the left (up to 3), our rendered still(s) on the right, in one image, to compare the signature by eye.

uv run side_by_side.py --ref refs/giotto --frame renders/38_giotto/t003.00.png --out compare/38_giotto.jpg [--title "Giotto v2"]

You must produce this image before scoring. The question 'can I tell whose painting this is at a glance' can only be answered while holding the originals, never from memory.
"""
import argparse
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


def font(size=16):
    for f in ('/System/Library/Fonts/PingFang.ttc', '/System/Library/Fonts/STHeiti Medium.ttc', '/System/Library/Fonts/Hiragino Sans GB.ttc', '/Library/Fonts/Arial Unicode.ttf'):
        try:
            return ImageFont.truetype(f, size)
        except Exception:
            pass
    return ImageFont.load_default()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--ref', required=True, help='output directory of fetch_reference.py')
    ap.add_argument('--frame', required=True, nargs='+', help='our rendered stills (one or more)')
    ap.add_argument('--out', required=True)
    ap.add_argument('--title', default='')
    a = ap.parse_args()
    refs = sorted(p for p in Path(a.ref).glob('*.jpg') if p.name != 'contact-sheet.jpg')[:3]
    H = 480
    tiles = []
    for p in refs:
        im = Image.open(p).convert('RGB'); im = im.resize((int(im.width * H / im.height), H)); tiles.append((im, 'Original ' + p.stem[3:30]))
    ours = []
    for f in a.frame:
        im = Image.open(f).convert('RGB'); im = im.resize((int(im.width * H / im.height), H)); ours.append((im, 'Ours ' + Path(f).stem))
    row = tiles + ours
    W = sum(i.width for i, _ in row) + 8 * (len(row) + 1)
    sheet = Image.new('RGB', (W, H + 56), (24, 24, 24)); d = ImageDraw.Draw(sheet); x = 8
    if a.title:
        d.text((8, 4), a.title, fill=(255, 255, 255), font=font(18))
    for im, cap in row:
        sheet.paste(im, (x, 28)); d.text((x, H + 34), cap, fill=(255, 210, 120) if cap.startswith('Ours') else (170, 200, 255), font=font(15)); x += im.width + 8
    Path(a.out).parent.mkdir(parents=True, exist_ok=True)
    sheet.save(a.out, quality=90)
    print('->', a.out)


main()
