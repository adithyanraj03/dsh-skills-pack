# 04_roman · 79 CE Pompeii mosaic — technique notes

File: `scenes/04_roman.js` (~330 lines). Final self-check: warm max 17ms / mean 13ms (1920×1080), init 206ms (once at boot), 17,871 stones, of which 13,067 re-sample color every frame in the dynamic region. Determinism passed.

## Core idea: layout computed once, color flows across the stones every frame

A mosaic's animation should look like this: the stones themselves are fixed to the wall; what moves is color flowing from one stone to the next. So the renderer splits into two halves.

1. **init (`build()`, 206ms)**: first compute where each stone is, how big, which way it faces, which pixels belong to it, and how the bevel is shaded, stored as `ID` (Int32, the stone index per pixel, -1 = grout) and `SH` (Uint8, shading per pixel, 128 = 1.0).
2. **Every frame**: redraw the flat underlay, `getImageData` once, then sample color at the centers of the dynamic stones (plus each stone's fixed color jitter), fill the dynamic rectangle pixel by pixel with `color×shading>>7`, finally `putImageData` into its own offscreen canvas and `drawImage` it onto `c`.
   - Pitfall: **you cannot `putImageData` directly onto `c`**, because that ignores the engine's punch zoom and transition cropping. You must write into the offscreen canvas first, then `drawImage`.
   - Per frame the pixel loop touches only about 1 million pixels (4 border bands, inside the frame, the girl, the cat), roughly 5ms with a JS loop. All offscreen contexts use `{willReadFrequently:true}` so `getImageData` is fast.

## Stone layout (andamento: laid along contours)

Simplified from the approach in Hausner 2001, "Simulating Decorative Mosaics".

- **Structure map**: the static underlay plus the frame-0 cat and girl (the moving near arm omitted), downsampled to 960×540. Pixels whose summed RGB difference from a neighbor exceeds 34 are marked as edges, and the border bands' boundaries in the category map also count as edges.
- **Distance field**: Felzenszwalb–Huttenlocher exact Euclidean distance transform (two-pass 1D lower envelope), about 20ms at half resolution.
- **Lay stones by walking contours**: candidate pixels satisfy |d−(k+½)s|<1.5 and k< that class's ring count, i.e. the iso-distance bands. Starting from an unvisited candidate, walk the 8-neighborhood preferring the candidate most consistent with the previous direction (direction smoothed 0.6/0.4), placing a stone when the distance from the last one ≥s. A stone's orientation is the tangent of the distance-field gradient. A spatial hash guarantees any two stones are ≥0.8× the average size apart.
- **Fill holes with regular rows**: lay a grid per class, offset by half a stone like brickwork (row jitter ±5%, column jitter ±9%). The minimum-spacing test uses 0.86; if it fits, place it. This step also fills the holes between contour rows and along the centerline.
  - Pitfall: at first only places with "distance ≥K×s" received grid stones, so narrow shapes (the cat's tail, 26px wide) ended up with no stones at all and the whole tail showed grout. Relying on the minimum spacing alone solved it.
- **Border bands laid separately**: each side lays 11 rows in its own local coordinates, stones 7.6px, width along the side direction randomized 0.86–1.14; the four corners are 11×11 squares.

| Class | Stone edge px | Contour rings | Color jitter |
|---|---|---|---|
| Wall | 12 | 1, then regular rows | ±8%, 7% of stones additionally darkened 12% |
| Halo (white edge outside people/cat/objects) | 11 | 9 (the whole halo runs along the contour) | ±5% |
| Girl's body / objects | 10 | all along the contour | ±5% |
| Girl's face, cat's head | 6 | all | ±4% |
| Hair | 8 | all | ±5% |
| Inside the volcano frame | 9 | 2 | ±6% |
| Outer border band | 7.6 | rows along the side | ±5% |
| Text | 7 | all | ±5% |
| Ground band | 13 | 1 | ±6.5% |

Besides the jitter in the table, each stone also gets an additive gray jitter of ±7. 9% of stones skew warm (+12,+4,−8), 7% skew cool (−6,0,+9).

## Stone shape and grout: weighted L∞ Voronoi

- Each stone is a rotated square. Its four half-edges each independently take `s/2×(1.08–1.28)`, and the rotation angle jitters ±0.06rad. The distance from a pixel to stone k is `D=max(|u|/h±, |v|/h±)`, where (u,v) is the pixel's position in that stone's local coordinates.
- During rasterization record, for each pixel, the smallest D1, the second-smallest D2 and the corresponding stone index; the cost is 1.5h per stone's bounding box.
- **Grout**: pixels satisfying `D1>1`, or `(D2−D1)·h/2 < g` (g = clamp(0.1s, 0.75, 1.25)px), count as grout, i.e. they fall near the bisector between two stones. So the seam is about 1.5–2.5px wide and stones get irregular edges "cut" by their neighbors, as if truly chiseled.
  - Pitfall: half-edges first took only `s/2×(0.9–1.1)`, so stones were smaller than the spacing and grout took about 40% of the area, looking sparse. Making stones 8–28% larger than the half-spacing and letting the bisector do the cutting makes them dense. This one detail is the key to the texture.
- **Bevel shading**: within 2.2px of an edge, brighten or darken ±16% by the dot product of the outward normal with the light direction (−0.6,−0.8) (upper-left bright, lower-right dark). Add a dome term `−5%·D1²` and ±3% per-pixel grain.
- Grout color: `rgb(112,103,92)` ±8 noise.

## Flat underlay and palette

- Wall `#e4ddcd`, halo `#f5f1e8` (every person and object is outlined with a 44–50px halo, along which the stones lay a white edge), stroke `#46322a`, stroke 8px (face 8px, so that it forms rows).
- Picture frame: red `#a8322a`, then inward a deep red `#7c221d` line, a gold `#d0a23c` line, a dark line.
- Volcano: the three faces are bright `#7c84b8`, mid `#4e5796`, dark `#2f3672`; sky `#9ec0d8`→`#d3e3e4`; hillside `#6f9341`/`#92b254`; ground `#cba344`; cypress `#2b5a2f`; lava `#d64a22`/`#f2952c`.
- Girl: stola `#efe7d5`, two red stripes at the hem `#a8322a`; the red shawl in three pieces (draped diagonally behind, one across the knees, one hanging down the front), fold lines `#7c221d`, with a gold brooch; the short cuffs are cut into the upper arm as a circle centered on the shoulder with radius 62, edged in red; gold hair `#dcaa42`, layering lines `#9c6c1c`, spiral bun at the back of the head; the red hairband is a cubic bezier that follows the head tilt. Eyes are drawn as 10×6 white plus radius-5.5 dark, so they land exactly as a "one white, one dark" pair of 6px stones.
- Cat: orange `#dc8530`, darkened back `#c06a24`, stripes `#9c4818`, white `#f7f2e8`, big amber eyes `#e9c22c` (radius eyeR×1.65), red collar `#b02a22` with a gold tag. The body is smoothed with `RIG.smooth(K.bodyPts)` into a pear shape, replacing the original polygon. Tail rings are drawn with the dashed line `setLineDash([9,13])`.
- "CAVE CATTVM": **hand-written monospaced bold-stroke letters** (C from an elliptical arc; A, V, E, T, M from polylines), stroke 14px, letter height 60px, letter spacing 16, scaled horizontally to 600px wide.
  - Pitfall: using Cinzel-700 with plain fillText, thin horizontal strokes break at 7–9px stones (E becomes F, A loses its crossbar), and tight spacing glues letters together. After three iterations the conclusion is "mosaic letters = monospaced bold strokes, each stroke about 2 stones wide".

## Motif animation (this segment lt 0–0.94s, drawn to 1.29s during the T04 transition)

- **Four-side wave pattern flowing clockwise**: each side switches to local coordinates with `setTransform` (u along the clockwise direction, v from outside inward) and draws the same Vitruvian scroll: starting from the inner black band, the spiral r shrinks from 24 to 5 over 2.25 turns, stroke width 13, period 81px. Phase is `42·lt + 81·easeInOut((lt−0.485)/0.365)`, i.e. constant drift throughout plus one extra period at the original's frames 226–248. Stone positions don't move, so black and white flow between the stones — exactly how a mosaic animates. Between 0.4→0.9s, 20% of the border band's pixels change.
- **Vesuvius smoking**: the crater is only 70px below the top of the frame, so smoke rising straight up is cropped immediately and invisible (the first version hit this pitfall). Instead the whole ash-cloud band drifts right at 55px/s (period 380px), plus 9 smoke puffs (dark `#3f3c3a`→light `#a29c94`) hugging the sky and drifting low to the right, 12 sparks (10px squares, parabolic paths) and lava pulsing in the crater. Within the frame 4.4% of pixels change.
- **Raising the cup**: rhythm from `choreo.cup/sip`, the cup a gold two-handled kantharos, white stone steam at the rim, opacity 1−0.85·cup. The path is the hand-written `armPose` (see "review rework" below).
  - Pitfall: with 15px wall stones the hand and cup smeared into one mass inside the big stones. At one point the arm's swept area got its own 8.5px stones, which became a pale patch at rest; finally the whole wall was unified at 12px.
- **Cat**: tail uses `choreo.tail×1.6` (at 9px stones the original amplitude was too small to read as a sway); on blink the eyes become orange stones plus a dark line.

## Performance and the dynamic rectangle

- The dynamic rectangle is computed at init from the bounding boxes of sampled poses (cup in 0.05 steps from 0 to 1, sip at 0/0.15; cat tail over ±0.75), expanded by 58px to include the halo and steam. Outside the rectangle is the static frame-0 mosaic.
  - Pitfall: the rectangle must be large enough, or stones crossing its boundary end up half new color, half old.
- Across the full film timeline, the Roman segment's frames (including the two transitions before and after and the new/old double layer) all render under 40ms, apart from cold caches of other eras on first entering a transition.

## Things to know from self-check

- `selfcheck`'s "motion differential 0.2↔0.7" is polluted by the engine's beat punch zoom. Below lt<0.37 the whole frame is scaling, and it reports 68% — that is not the drawing moving. Measuring 0.4↔0.9 instead (the punch is over): full frame 6.2%, of which border band 20.4%, girl 8.4%, frame 4.4%, cat 0.8%.

## Where it could still be better

- When the girl raises the cup to her mouth, hand, cup and face crowd together and are slightly mushy at the 6–8.5px stone scale.

## Review rework (second round)

- **Cat**: anchored at the soles (540,905), scaled to 0.85 with a canvas transform (category map and dynamic rectangle scaled in sync), the ear tips drop from y≈540 to about 590, and the halo no longer touches the frame. The head is redrawn as front-view Egyptian-style cat: two R17 big amber round eyes, black vertical pupils, 7px dark eye sockets, an 11px dark stroke around the head, which is also stroked into the category map at 6px small stones so the outline can form rows.
- **Cup smearing the face**: no longer uses the skeleton's original cup-raising path; instead the hand-written `armPose`. The cup moves along a quadratic bezier "tabletop→up-front (1150,470)→in front of the lips", ending with the rim's right end against `G.lips[0]`, tilt 0.15rad (8.6°). The hand supports under the foot of the cup (offset interpolated from (28,34) to (3,44)), IK with the same arm lengths 165/122 and the same elbow direction. The forearm stands in front of the chin, exposing nose, lips, chin and eyes. The face stroke is thickened to 10px.
- **Restoring the wall's continuity**: removed the "arm swept area 8.5px" class. Wall stones unified at 12px (also closer to the original film's wall stone scale); the dynamic region's wall shares the surrounding layout and only re-samples color each frame, so no boundary shows.
  - Lesson: never give the dynamic region its own stone size for detail — at rest it is a patch.
- After rework: warm max 17.1ms, mean 13.0ms, determinism passed.

## Review rework (third round, v1 review report items 3 and 4)

- **The border doesn't look like it's scrolling**: across the full timeline (renderFrame) it actually is moving, but with "stones fixed, only color changes" each frame the scroll moves only 1–3px, and after quantization by 7.6px stones it barely lights up in the motion heat map.
  - Fix: turn the border into a "conveyor belt". At init, pre-bake a 2106px-long (26 periods) stone strip. The pattern period is 81px and the stone layout also loops at 81px: 11 stones per row, widths individually random but normalized to exactly 81px, jitter reused by period. So the whole strip tiles seamlessly at any phase.
  - Each frame, for each of the four sides do one `c.transform(side's local coordinates)`, then clip and `drawImage(strip, BW−2·81+phase, 0)`; the stones travel clockwise with the pattern. The corner squares stay static.
  - Phase becomes `15·lt + 81·easeInOut((lt−0.485)/0.365)`, constant drift reduced from 42 to 15px/s, the main motion left to the one period at the original's frames 226–248.
  - Static-stretch motion amount (motion.py, 480×270 mean frame difference, frames 222–253): the recreation rises from 1.98 to 4.62, original film 2.90. At 42px/s drift it was 5.5.
  - Rule: when slow pattern displacement is smaller than the stone size, "only color changes" gets eaten by quantization — either move the stones with it, or make the displacement much larger than the stones.
- **The cup doesn't read**: the cup is removed from the underlay and becomes a `cupSprite` tiling of 4.4px small stones. Content: the two-handled cup at 1.3× scale — dark stroked stones, gold body (darkened on the right), bright rim over a dark interior, two handles, foot. Each frame it is laid over the mosaic as a whole at `armPose`'s position and tilt. The steam also becomes two columns of white square stones rising along a sine (`steamTiles`), with grout edges. Only the cup's white halo remains in the underlay.
  - Rule: props narrower than 3 stones don't read in a fixed layout — they should be made into movable "inlay plaques" (emblema-style).
- **The face's features don't read**: face stones go from 6px to 5px. Eye whites 13×7, darks 8×7, about 3 dark stones plus white; lips changed to red `#a8282a`, an 8.5×6 ellipse, about 2 stones; brows 6px dark brown. At half of 1080p you can read the eyes and mouth.
- After rework: warm max 20.9ms, p90 17.4ms, mean 13.9ms, determinism passed.
