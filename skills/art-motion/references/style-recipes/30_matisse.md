# 30_matisse · 1947 Matisse, Jazz cut-outs

> Source: transfer test C (an independent agent working from the skill read-only, 2026-10-04). The scene code was ported into `scripts/engine/scenes/30_matisse.js` after consolidation.

File name at experiment time: `scenes/k4_matisse.js` (167 lines). About 25ms per frame, frame delta 9.3%.

**Composition**: wall = the two-blue checkerboard of "Polynesia" (`#1d4fb8 / #4f95dc`, each cell a 240×236 cut-out block), window = "Icarus" (cobalt-blue ground, black figure, red heart, yellow stars), floor = emerald `#1f9a5a` with a black baseboard strip, the tabletop is a black cut-out, the chair is a yellow cut-out.

**Technique**
1. **Scissor polyline `cut(pts)`**: sample a point along the contour every 14–24px, add a ±2–2.5px seeded jitter, connect the points with straight lines. Every shape generated from scratch is handled this way.
2. **Seaweed (critical)**: one tapered stem, plus 2×lobes **round-capped capsule fingers** alternating left and right. Finger angle `±(1.05−0.55u)`, length `width·(1−0.45u)`, width `width·(0.34−0.12u)`. All sub-paths are `addPath`ed into the same Path2D and filled once with nonzero to get the union, so the shadow is also computed only once. **Do not "modulate the width along a spine"**: the first version did that and produced caterpillars and Z-shaped lightning bolts.
3. **Hand-cut edges for RIG characters**: the RIG does not expose point lists, so the character layer as a whole gets a pixel displacement. The static displacement field is `fbm(0.028x, 0.028y, 2)·9`, one set for dx and one for dy, processed only over the bbox (330,470)-(1600,980), about 15ms.
4. **Paper shadow**: shadow offset (5,6), blur 4, `rgba(10,20,40,.3)`, to read as paper pinned to the wall.
5. **Gouache brush marks**: cache 2,600 long streaks (60–300px, width 6–22, half black and half white, α .04–.13, tilted −0.25rad), applied `overlay` over the whole frame.

**Motif animation**:
- The seaweed sways from its root like a sheet of paper, `sin(2.8t+φ)·0.13`; the curl breathes with `scaleX 0.93–1.0`.
- Icarus: 7 irregular yellow stars, twinkling as they turn (scale `.82+.22sin(7t+1.9k)`); the black figure drifts up and down; the red heart beats (`1+.18·max(0,sin 9t)`).
- Two white birds flap (scaleY `.55+.45cos 13t`).
- A sheet of pink paper tumbles and falls (scaleX=cos 6t).
- The heat haze is two small white cut-out shapes.

**Character**: Matisse's "Romanian Blouse". White wide-sleeved blouse, a cobalt-blue embroidered band down the front placket (small alternating red and yellow triangles), red/blue embroidered bands on the sleeves that rotate with the arm (clipped inside upperArm), red long skirt + black belt, blonde hair as 5 cut-out curl clusters. Facial features use cut-out scraps only: black almond eyes, red triangle lips, pink cheek discs.
**Pitfalls**: the falling paper's first trajectory crossed the girl's face; moved it to the left wall. Put a white cut-out scrap under the counter, otherwise black digits on cobalt blue are unreadable.

---
