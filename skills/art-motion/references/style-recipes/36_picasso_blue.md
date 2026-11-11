# 36_picasso_blue · 1903 Picasso, Blue Period

> Source: transfer test D (an independent agent working from the skill read-only, 2026-10-04). The scene code was ported into `scripts/engine/scenes/36_picasso_blue.js` after consolidation.

File name at experiment time: `scenes/r5_bluepicasso.js`, about 24ms per frame.

**Pipeline**: monochrome blue flat base (wall, floor, night sea and moon outside the window) → repaint with wide dry strokes, then blur 7px and composite at 80% → very faint dry-brush filaments → copy the window frame back as-is, add small strokes → table as its own layer → coarse environment contours (no boil) → waves, broken moonlight, clouds → character (stretched as a whole) → character small strokes + cool-light gradient → visibleLines coarse contours → shawl fold lines → slow heat haze → canvas weave + cool vignette.

**Key parameters**
- Palette: #132240 / #1d3866 / #2d5a94 / #6b8fb6 / #b6c8d8 / blue-gray #3b6878, strictly monochrome.
- The orange-and-white cat is separated by value: orange = mid blue #4f719a, tabby #273f66, white = pale blue #b6c8d8. Blonde hair = the brightest blue-gray #cbd8e0, skin #90a9be; the hair must be one step brighter than the skin for "blonde" to read.
- Wall strokes: cell34, len110, w34, jitter 4, vertical ±0.5·noise(0.003); palette mixBase 0.8; afterwards blur 7px and composite at α0.8. Floor strokes use the same parameters, horizontal.
- Dry-brush filaments: 900, α0.07, length 30–90.
- Stretching: the girl `DOMMatrix().translate(1240,932).scale(0.84,1.12)`, pivoting on the soles; the cat scale(0.82,1.14), pivoting on (540,905). The same matrix is used in three places: Path2D.addPath, the offscreen setTransform, and the setTransform inside the visibleLines callback.
- Shawl: draped down from forehead/headTop, over nape and back, landing at waist+70, color #6b8fb6, fold lines rgba(20,40,80,.6) 4px. Long fingers: 3 slender ellipses 22×4.5 wrapped around the cup.
- Contours: Prussian blue #0c1830, 5px, no boil. Blue Period contours are certain; they should not wobble.
- Slow: breathing sin(1.8t)·0.026 (about 2× the amplitude and 0.45× the frequency of the shared choreography); the cup lift uses 1.25s to raise (the shared choreography uses 0.9s); heat haze rises on 0.5× time.

**Motif animation**: waves outside the window move sideways (faster the closer they are, speed 20 + 0.25·(y − 400)), 14 broken moonlight streaks flicker, one pale long cloud crosses the moon, slow breathing (girl and cat), the cup lift, heat haze. Motion area 3.2%.

**Pitfalls**
- The first version left a little ochre in the cat and the hair (a nod to The Old Guitarist), and independent review ruled that it broke the monochrome. The Blue Period should be all blue, separated by value.
- cell16, len40, w14 vertical strokes across the wall read as "rain / a blanket" — that is Impressionism, not the Blue Period. Go wide, long and low-contrast, then blur a layer over it.
- Densely packed round caps on wide strokes form a "phalanx of heads" (see ② item 11). The 7px blur suppresses it; the real fix is to add a cap parameter to strokes.
- If the table area is masked out of the big strokes with a rectangle, a flat rectangular patch is left on the floor. The table must be its own layer drawn after the strokes; do not punch a hole in the strokes.
