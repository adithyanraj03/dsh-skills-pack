# 12_bauhaus · 1923 Bauhaus poster

File: `scenes/12_bauhaus.js` (~210 lines). Performance: warm average 5ms, max 9.5ms, first frame ≈85ms; determinism passes; motion difference 4.9% of pixels from lt 0.34→0.46 (black bar, grid window, concentric arcs, cat, ball and doll all moving). On screen for 0.47s (T11 blue square/red circle/yellow triangle/circular hole transition 0.20s, origin (1330,590) ≈ red circle center).

## Pipeline
1. **Fully cached base `bh_bg`**: cream old paper `#ebe3cf` + a 320×180 fbm tile scaled up at α0.5 (aged mottling) + a thin diagonal line running through (40,170)→(1900,840) (under the window) + top-left black horizontal bar (60,61,256,13), red vertical bar (292,105,24,468) + vertical bauhaus (`Poppins-800` 210px, `rotate(-π/2)` then horizontally scaled to exactly 820px long, origin (262,1000), read bottom-to-top) + small gray square + ground line (345,898)-(1860,915) + yellow right triangle + katze (Poppins-800 150px, red `#d3262b`) + two lines of Poppins-600 31px at lower right + black-topped table / chrome tube legs (three-color linear gradient) + Breuer cantilever chair (same path stroked 15px dark gray / 10px chrome / 3px highlight offset 2px) + two grain layers (dark speckle 0.02 density α0.35, old-print black spots).
2. Red circle cached separately at 520²: base color + `source-atop` overlay of fbm light mottling at α0.55, imitating the uneven ink of silkscreen/lithography.
3. Characters and composition are all geometric bodies: no curved outlines at all, only circles, squares, triangles and thick bars.

## Motif animation
- **The long diagonal black bar turns like a clock hand**: angles measured frame by frame from the original (frames 575–579: 28°, frame 581: 33°, frame 583: 37°, frame 585: 42°, frame 587: 46°, frame 591: 49.5°) written as `deg = 28 + 21.5·easeOut(clamp((lt-0.26)/0.22))`. Pivot = hub center (1125,195) (confirmed against frames 576/590: the hub does not move, the lower end sweeps down), bar 27px from -432 to +150, thin parallel line offset 30px, red short bar offset -30px, the arc inside the hub turning with it.
- **Mondrian grid window cycling**: 4×4 grid (inner frame 366..794 × 126..561, cell 100×101, gap 9.5), 6 cells take part in the cycle, 13fps on the beat `step=floor(lt·13)`, each cell with a different phase, switching only when `(step+2·sw)%9 < 6` (not every beat, so the rhythm is not mechanical); cycle colors are only red, yellow, blue, cream, light blue and gray. The pattern cell (9px graph paper) and the quarter-circle cell are kept.
- **Concentric arcs**: 6 arcs on the right side of the red circle, start phase wobbling with `sin(9lt-0.7i)·0.05`, radius breathing `±3`, arc length sweeping from 55% to 100% within 0.4s — like sound waves pushing outward.
- **Steam above the cup**: one 2.2px sine hairline (26 cycles/170px, `-18t` traveling wave), fading out through a linear gradient.
- **Cat taps the ball and it rolls**: right front paw `tap = sin(clamp((lt-0.05)/0.16)·π)` extends 36px forward then retracts; blue ball r31 rolls from x712 to 816 with easeOut over `lt 0.13→0.47`, **rotation = displacement/radius** (a white diameter line + white dot show that it is rolling), with two speed lines behind it while rolling. Tail = 26px-thick orange arc + same-width dashed dark-orange stripes, angle following `choreo.tail·0.5`.

## Geometricizing the characters (all anchors come from RIG)
- **Schlemmer doll**: head = circle r70 (`G.A.headC + (14,-18)`), golden geometric hair piece = a sector of the back half of the head (-1.95→1.15rad) + a forehead triangle + a bun circle r34 + a semicircular hair plate behind (`G.A.back`); face = black vertical-bar eyes (becoming horizontal bars when blinking), red square cheek, short black mouth. The whole head group rotates around `G.A.neck` by `G.tilt` (tilting back when drinking). Torso = blue trapezoid + a rear black trapezoid (rising and falling with breathe); skirt = black sector r178 + blue trapezoid; limbs = thick black round-ended bars, joints = cream discs + 5px black ring + black center dot. The near arm uses `G.A.shoulder/elbow/hand` directly (RIG's IK cup hold); the far arm rests flat on the table (reproducing the hand reaching toward the tabletop in the original).
- **Cat**: body circle r100 (computed from `K.box` as (536,805), scaled with breathe) + 4 dark-orange horizontal stripes on the left (clipped inside the circle) + cream sector at lower right (orange and white planes); head = 104 square (`K.headC + (14,48)`, rotating slightly ±0.08rad with the tail phase) + yellow triangular ears + cream lower half of the face + dark-orange forehead band; eyes = white circles + black vertical-bar pupils.

## Palette
Paper `#ebe3cf`; black `#161514`; red `#d3262b`; blue `#2a58b4`; yellow `#efc12f`; light blue `#b9cee0`/`#a6c0da`; gray `#c6c3bb`; cream `#f2ecdf`; orange `#ee8a2a`/`#c25a14`; chrome `#c9c9c6`.

## Pitfalls
- The first version computed the grid at 107px and it overflowed the black frame by 16px on the right — the grid window size must be derived backwards from "inner frame width − 3 gaps".
- Black was included in the cycle colors, so when the cycle landed on a black cell the whole window suddenly got heavy, like a broken cell; removed.
- The doll's mouth was originally drawn per the original as a long black bar sticking out past the head, which on the girl's face looked like a cigarette; changed to a short horizontal bar inside the head.

## Still improvable
- The cat head/body positions were shifted down relative to the RIG skeleton (so the square head sits on the round body), leaving about a 50px difference in cat head position from the neighboring eras during transitions.
