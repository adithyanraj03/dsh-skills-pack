# 29_seurat · 1884 Seurat, A Sunday on La Grande Jatte (pointillism: an optical color-mixing renderer)

> Source: transfer test C (an independent agent working from the skill read-only, 2026-10-04). The scene code was ported into `scripts/engine/scenes/29_seurat.js` after consolidation.

File name at experiment time: `scenes/k3_seurat.js` (136 lines). About 100ms per frame, frame delta 7.4% (serene; mean adjacent-frame delta 0.45).

**Renderer (the important part, can be pulled into paint.js)**
1. A flat base layer over the whole frame, character included (~3ms per frame). Underneath everything lay the base layer through `blur(4px) saturate(.85) brightness(1.06)` as the underpainting color; the gaps between dots let it show through.
2. **Fixed hexagonal grid, equal-size dots**: pitch 10, row spacing 8.66, r 4.5, each dot with a static ±1.2px jitter. About 24,000 dots. Dots are accumulated into 21 Path2Ds by color, and each color is filled once.
3. **Optical color-mixing selection**: a palette of 21 solid colors.
   - 14 saturated colors: `#1a2058 #2a3a9a #3f6fd0 #6aaee6 #1f6a52 #2f9a5a #a8c83a #f2cf3a #f08a2a #e0432a #c0306a #7a4aa8 #f8f4e8 #e8b48a`
   - 7 pale colors (Seurat's "colors mixed with white"): `#f6e49a #f6c48a #cfe08a #b0cff0 #f2b8c8 #c99a4a #9a7ac8`
   - For every pair (i,j), **project** the target color onto the segment Pj→Pi to get a continuous ratio w, clamped to [.2,.8]. The distance then adds `0.004·|Pi−Pj|²` to penalize pairs that are too far apart, so black and white dots never mix into gray. Take the pair with the smallest distance; each dot uses Pi or Pj according to `hash(i,j) < w`.
   - Results are cached in a Map by 15-bit quantized color.
4. **Add a ±20 hash jitter to the target color before selection** (R+dj, G+0.8dj, B−0.6dj). The switch boundary between paired colors therefore becomes interleaved dots, and no vertical color bands appear.
5. **Complementary dots**: 8% of the dots are swapped for the complementary color (blue↔orange, green↔red-violet, yellow↔purple…, 21 mappings in total). **Irradiation**: compare with the spot 14px to the lower right; when the brightness difference is >45, with 45% probability place a white dot on the bright side and a deep-blue dot on the dark side.
6. **Seurat's own painted border**: a 28px deep-blue band around all four sides, also passed through the pointillist renderer, so orange complementary dots appear inside it.

**Motif animation**:
- The Seine in the window: a sailboat drifting (40px/s), a steamboat smoking, the silhouette of a lady with a parasol + a small monkey.
- The dots on the river surface are re-hashed at 6fps = shimmer.
- Indoors, an orange-red butterfly circles above the table (`sin(2.6t)·120`), wings flapping `|sin(20t)|`.
- 6fps makes 7% of the dots swap to their paired color, showing light trembling between dots. The first version used 4fps/3% and independent review judged it "essentially a freeze" (mean adjacent-frame delta 0.1–0.2); after changing it to 6fps/7% it rose to 0.45.

**Character**: 1880s deep blue-violet gown + a bustle at the back of the waist (an arc in the `back` hook) + white high collar + orange buttons + a small round hat with a red feather. A closed red parasol leans against the chair back.
**Pitfalls** (both at the renderer level)
- Preferring a single solid color (the added penalty) cuts a gradient wall into several vertical bands.
- With the ratio made continuous, the paired colors switch along whole columns at the boundary and still band. The target-color jitter in step 4 is what fixes it.
- The first palette had no pale colors, so the bright wall decomposed into white + skin tone + scattered blue dots and looked like snow noise.

---
