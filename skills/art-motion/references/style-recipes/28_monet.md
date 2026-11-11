# 28_monet · 1899 Monet, Water Lilies + Japanese Footbridge

> Source: transfer test C (an independent agent working from the skill read-only, 2026-10-04). The scene code was ported into `scripts/engine/scenes/28_monet.js` after consolidation.

File name at experiment time: `scenes/k2_monet.js` (176 lines). About 105ms per frame, frame delta 30% (mostly the boiling water surface).

**Composition**: wall = an Orangerie-style water-lily mural (water surface over the whole wall), window = the green Japanese footbridge (arched bridge + wisteria + pond water), green Giverny shutters on both sides of the window, the girl seated in front of the mural.

**Pipeline (the doc 09 benchmark structure)**
1. Base layer `moBase`, redrawn every frame, because the water lilies drift and the willow shadows sway.
   - Water surface: vertical gradient `#b9c7e6→#8fa6d6→#6c84bf→#5a72a8`, plus 4 pale pink-yellow skylight reflections.
   - Willow shadows: 5 vertical bands, edges wavering horizontally by `sin(0.03y−3.2t+k)·14`.
   - Water lilies: 10 clumps, about 100 notched ellipses in total (rx 38–78, ry 12–21), 40% carrying pink/white flowers.
2. Four brushstroke passes:
   - Water surface: cell 9, len 34, w 6.5, **horizontal** angle≈0±0.06, boil 6.
   - Window view: cell 6, len 13, w 4.5, diagonal strokes in the upper half, horizontal strokes in the lower half, boil 6.
   - Floor: cell 12, len 34, w 8, **boil 0**.
   - Window frame/shutters: cell 6, one vertical and one horizontal pass, boil 0.
   - Every pass outline 0 (Impressionism does not outline).
3. **The bridge is its own layer**: in the base layer, first lay a dark tree-shade backing `#24452a` behind the bridge; the bridge itself uses a coarse `#3f8a62` line (20px) as backing, with `#8fdcae` bright lines drawn over it. Strokes use cell 5 and a 5-color pale blue-green palette. Without this the bridge is swallowed by the foliage palette and disappears entirely.
4. Per-region palettes:
   - Water `#5b6fb5 #7d8fd0 #9db5e0 #6aa0a8 #b7a6d8 #d9c8e8 #8fb8a8 #a6c4e8 #c8b0d8` (mix .45)
   - Leaves `#5f8f4a #7fae5a #3f6f4a #9cc070 #6f9a7a #b4cc78`
   - Pinks `#f0a0b8 #f7d0dc #fff2f4 #e88aa0`
   - Floor `#c69a6a #b07a5a #d8b08a #9a6a7a #8a7aa8 #e0bc90`
5. Character: flat fill in fill mode → fine strokes with source-atop (cell 6, len 12; the white dress samples from `#fbf8f2 #e4e0f6 #cfd2ee #f8ecd0 #d8e8f2`) → **color shading**: a linear gradient of warm yellow at α.22 on the lit side and purple at α.32 on the shadow side (source-atop) → then only the facial features, in fine `#5a4f8a` lines.

**Motif animation**
- **Trembling highlights on the water**: 160 short bright horizontal strokes (`#fffbe8 #fdf0d0 #f8e0ec #e8f4ff`). Brightness `clamp(sin(t·(5..11)+φ)·sin(2.3t+i))`, jumping ±5px horizontally at 10fps.
- Water lilies drift `x+sin(1.3t+φ)·7+6t`, willow shadows waver, 3 ripples (dashed ellipses ry=rx·0.22, expanding and fading out).
- Wisteria: 12 hanging clusters, each of 9 pale-violet dots from large to small, swaying by `sin(2.4t+0.9i)·8`. The straw hat's blue ribbon flutters.

**Character**: 1899 white summer dress, high collar, puff sleeves (ellipses at the shoulders), pale-blue sash; the RIG straw hat is painted `#ecd28a`.
**Pitfalls**
- Full-screen boil at 6fps gives a 47% frame delta; the whole screen is noise.
- The first wisteria used thick strokes and came out looking like smooth pills; changed to a column of dots.
- The counter is unreadable on top of the stroke ground; it needs a milky-white glow with blur 18.

---
