# 17_ink · Chinese ink-wash freehand (Bada Shanren / Qi Baishi)

> Source: transfer test A (implemented by an independent agent with the skill read-only, 2026-10-04). The scene code was later ported into `scripts/engine/scenes/17_ink.js`.

At experiment time the file was named `scenes/01_ink.js` (313 lines). Frame difference 0.45↔0.9s is 3.3% (threshold 24), median adjacent-frame difference 0.62%, and no static frame pairs.

**Pipeline** (the opposite of the doc 09 benchmark: paper is the ground, ink is only added, never laid down as a fill). The opening uses `lt += 0.12`, so the first few strokes have already landed on frame 0 — it is not a blank sheet (review noted that a blank first frame cannot serve as the cover).
Xuan paper (cached) → wash layer: pale-ink distant mountains, vermilion sun → mist bands (blurred paper-colored ellipses moving horizontally) → a bird skimming past → static brushwork: window, desk, ground line, cached once drawn → bamboo branches ("ge"-character leaves) → Qi Baishi shrimp in the hanging scroll → cat: ochre wash + burnt ink → girl: indigo wash + fine-line drawing + garment folds → steam wisps → seal.

**Xuan paper**
`P.texture('#efe6d0', scale .0025, amt 9, grain 7)`. Over it, 2,600 short paper-fiber arcs: half brown at α.05–.13, half light at α.12–.27. Then a radial vignette reaching α.22 at the edges.

**Brush `brush(c, pts, {w, tone, dry, reveal, bristles, head, tail})`**
- The point list is first densified with Catmull-Rom, then resampled at 4px equal arc length (`KIT.resample`). Without resampling, the frequency of the dry-brush noise would change with stroke length.
- Pressure: `prof(q) = smoothstep(0,head,q) · (1−0.7·smoothstep(1−tail,1,q)) · (0.85+0.15·noise)`.
- Wet core: the whole stroke is filled as a ribbon, width `w·prof·(1−0.85·dry·q^0.8)`, α is tone×0.72. It gets thinner toward the end, showing the ink running out.
- Bristles: each is one **continuous** polyline, offset laterally by ±0.475w·prof. Where the noise `noise(k·1.9, i·0.09)` falls below `dry·q^1.2·0.95+0.05`, the bristle breaks, and the exposed paper is the dry-brush streak.
- Pitfall: the first version drew bristles as "a separate stroke per short segment + round cap"; the joints stacked into dark nodes, looking like bamboo joints or hemp rope. It had to be changed to one continuous path per bristle with butt cap.
- Parameters: window frame w14–18, dry .45–.6; desk surface w22; garment folds w4–6, dry .3–.4, tone .78; ground line w5, dry .85, tone .35.

**Wash layer `washLayer`**
- Shapes are first drawn on scratch, then composited onto the paper with multiply, in two passes.
- Outer halo: `blur(halo·(0.4+grow))`, α is haloA·grow.
- Body: `blur(blur·(1.6−0.6grow))`.
- grow goes from 0 to 1 with lt: the opening blooms from nothing, then the outer halo keeps slowly widening — that is "ink spreading on paper".
- Girl halo 12, α.6; cat halo 9, α.78; distant mountains halo 14.

**Reserved white**
- The cat's white parts (muzzle, chest, paws) are cut out of the ochre layer with `destination-out`, exposing the paper color. This reads more like ink wash than painting white.
- The girl's cross-collar inner shirt is cut out the same way.
- The face is filled with paper color, then outlined with a 1.8px burnt-ink fine line.

**Color**
- Ink `[16,14,12]`, divided into five tones by tone (burnt .9 / dense .8 / heavy .6 / pale .35 / clear .15).
- Ochre (cat) `#c47a3c`; indigo (clothes) `#6f8aa0`, wide sleeves `#7d97ab`; gamboge (blonde hair) `rgba(226,170,52,.75)` multiply.
- Carmine appears in only three places: sash, hairpin bead, lips, using `[190,40,40]`. Also vermilion sun `#d8553f` and seal `#c4281e`.

**Motif animation**
- **Opening write-on**: lt 0→0.45, each stroke `reveal = ss(d, d+l, lt/0.45)`, written in the order window, desk, bamboo, cat, person.
- Bamboo: a segmented pale-ink main branch, swinging around (835,70) by `sin(2.9t)·0.11`, larger toward the tips. 5 groups of "ge"-character leaves with 3 leaves each (L110, w15), fluttering by `sin(7t+g)·0.2`.
- Mist bands: 4 paper-colored ellipses, blur 14, α.72, moving horizontally at 150–270px/s, revealing and hiding the distant mountains.
- Bada-style bird: skims in from the right of the window at 420px/s, wings are two strokes, flapping about 8 times per second (`sin(52·lt)`).
- Qi Baishi shrimp (two in the hanging scroll, 1.45×): 6 pale-ink segments + one burnt-ink stroke down the middle of the head-carapace, two long and two short antennae traveling in waves, three-segment long claws, body bends `sin(7t)·0.12`, swimming along a curve.
- Bada white-eye: the cat's pupils sit at the top of the eye socket, "white eyes toward heaven".
- Seal: at lt 0.3–0.4 it presses from 1.5× down to 1×, stamped with multiply; "Baishi" (白石) in intaglio.

**Pitfalls**
- Static brushwork is drawn live during the write-on, then cached once as `ink_static` when complete; otherwise thousands of bristles would be drawn every frame.
- The bird's path in the first version passed through the bamboo leaves and was invisible; it only read clearly after moving it above the mist bands at y≈470.
- Washes use multiply and are transparent, so the windowsill ink line showed through the cat's ears and the table legs through the skirt; review read this as "the layers are wrong". The fix is to first backfill a layer of paper color inside the cat and dress silhouettes (clip, then drawImage the paper), then apply the wash. This amounts to "reserving this area" on the paper first.
