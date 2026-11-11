# 25_ghibli · Ghibli visual family: overall language + implemented background study


## 2026-10-15 · Overall-language study (still to be validated across scenes)

First read [cross-scene style distillation](../15-cross-scene-style-distillation.md). The lower half of this card is engineering experience from one existing room scene; it proves that part of the watercolor/cel approach runs, not that it represents the whole Ghibli system, and it is not a composition template for a new film.

**Set the scope first.** *My Neighbor Totoro*, *Kiki's Delivery Service* and *Spirited Away* can be used to study characters, hand-painted backgrounds and everyday actions in different environments; *The Tale of the Princess Kaguya* has clearly different line and negative-space organization and cannot be forced into the same watercolor background recipe. When making something, choose the film/author scope that matches this content, and compare clips across different places, lighting and actions rather than picking only forest vistas. The official [works and scene stills](https://www.ghibli.jp/works/) can locate references; the [scene-still release note](https://www.ghibli.jp/info/013344/) does not mean all material carries an unlimited license.

**Transferable research dimensions.** ① Character silhouettes, expressions and key actions are clear, and the background has its own observation and material detail; ② characters and environment are compatible in perspective, light direction, contact shadows and color — the two are not required to be painted with the same watercolor texture; ③ everyday actions have body weight, an order of using objects, and reactions; ④ environment motion has causes such as wind, gravity, contact; ⑤ the scene has both a habitable structure and a narrative use. These are initial research generalizations; whatever does not hold in a given film means the scope must be revised.

**Content is variable.** A green forest, a country house, a girl, a cat, a broom, food and giant clouds are not mandatory. The subject can be a city repair shop, a night-shift transit station, or a fictional equipment bay. "Slice of life" must not be equated with a fixed slow pace; tense passages also need accurate action.

**Production hypothesis.** Start from this scene's space and light; design the character separately, checking proportions, silhouette and expression on their own; build per doc 10's frame library or import material, then composite and choreograph in code. The background's washes are only an optional material device — multiplying a paper texture over the whole character image is not "done". The existing `scenes/25_ghibli.js` can be a reference for local background technique; the character and the new space must be redesigned, and a complex turn or interaction cannot be replaced by translating a single image.

**Transfer stress test (to do).** Recovering a lost item in a city laundromat; an unmanned automatic irrigation system starting up; two adult repair technicians making an emergency patch in a space capsule. These three are not new templates, only a check of transfer ability without forests, girls and slow motion.

**Feedback loop.** Each time, record the film scope, scene, adopted route, image/animation evidence, character-environment consistency and contact problems; when an old conclusion fails, revise the original sentence first. One scene passing cannot rate the whole studio. Current state: the existing background study holds its original quality; the overall visual and performance direction is still research.

## Existing watercolor background example (historical implementation, not a style definition)

> Source: transfer test B (an independent agent working with read-only skill access, 2026-10-04). The scene code was ported after integration to `scripts/engine/scenes/25_ghibli.js`.

Filenames at experiment time: `scenes/c4_ghibli.js` (~270 lines). Median 17ms per frame, **first frame 619ms** (watercolor ground cache); frame difference 5.1%.

**Watercolor renderer**
- `deform(pts, depth, amp, r)`: midpoint displacement. Each round pushes the midpoint of every edge along the normal by an approximate Gaussian amount (3 uniform numbers summed), amplitude proportional to edge length (min(1, len/80)), amp×0.6 per round.
- `wash(g, pts, color, {layers, alpha, amp, seed, edge, blend, fill})`: deform 3 rounds for the base shape; each layer deforms 2 more rounds and fills with `multiply` at low α (transparent pigment layering), and strokes a 1.6px same-color edge at α=edge. The edges stack layer by layer — that is the **water-mark edge** where pigment deposits at the rim. fill can take a gradient (sky, wall).
- Common parameters: large wall areas layers 5, α 0.4, amp 12; color blooms layers 3, α 0.045, amp 40 (large deformation); planks layers 3, α 0.5, amp 3, edge 0.14; opaque whites (window frame, tablecloth, clouds) use `blend:'source-over'`, α 0.9–0.95.
- Wall = radial gradient wash (bright by the window `#fbf3e0` → corners `#dcc49a`) + 28 heavily deformed transparent color blooms (alternating warm yellow, pink, blue-gray, pale green) + dark blooms in two corners. Wainscot and floor each get their own tonal wash **board by board**. Finally `multiply` at α 0.3 lays a high-frequency paper grain on top.
- Clouds: white opaque round puffs (16 puffs, edges drawn with wash) + `source-atop` blue-gray gradient at the bottom, cached as a sprite. The big camphor tree is also a sprite, rotating ±0.025rad about its roots.

**Cel character `cel(c, p, base, shade, dx, dy)`**: fill the whole shape with the shade color first, then inside clip(p) translate the shape itself toward the light by (−dx, −dy) and fill the base color, leaving only a crescent of shadow on the shaded side. Finally stroke a 2.4px warm brown line `#4a3428`. One function gives you Ghibli-style two-tone cel.

**Motif animation**
- White sheer curtains: two panels, the hem billows `q²·(90 + 70·gust)`, gust = 0.55 + 0.45·sin(3.2lt + phase), plus a `sin(7lt + 6q)` ripple; 3 semi-transparent wash layers, fixed seed, so the edges do not boil.
- 360 blades of grass outside the window: the wind comes in gusts, `wind = 0.5 + 0.5·sin(3.1t − 0.018x)`, phase advancing along x, so you can see a gust wave sweep across the slope.
- Clouds drift 22–30px/s; the canopy sways lightly; 34 komorebi light patches on the wall (`screen` warm-yellow radial gradients, positions drifting with noise, brightness flickering `sin(5t + 1.7i)`); daisies on the table nod; the girl's long hair is blown back-right (7-point smooth, pushed by wind); the red bow's ribbon flutters; the tablecloth's hanging edge swings.

**Character**: long blonde hair + big red bow (a nod to Kiki's Delivery Service, not a copy of the character), teal long dress + white apron + white cuffs; the cat is warm orange + cream cel. The broom leaning against the wall in the background is an easter egg.
**Watercolor fill for the character**: review said "the background looks right, the character doesn't (flat vector)". The character is first drawn into offscreen L, then a separate texture layer M is built (paper grain α 0.8 + 40 transparent color blooms `charBloom`, α 0.1, amp 16), M is clipped to L's silhouette with `destination-in`, then composited back with `multiply`. Line color softened from `#4a3428` to `#6a4a38`.
**Curtains**: review said they don't billow. gust frequency 3.2 → 5.4, billow `q²·(60 + 150·gust)`.

**Pitfalls**
- Color blooms at α 0.07×4 layers with grain multiply 0.5 made the wall look like moldy old parchment. A Ghibli room is bright: blooms dropped to α 0.045×3 layers, and the whole gradient brightened by one stop.
- The first version built the wall from two rectangular washes (darker on the right), producing a hard seam at x≈1100. Dark areas need heavily deformed polygons (amp 60), not rectangles.

**Still improvable**: the character is still flat; Ghibli-style hair highlight chunks could be added; flowing curtain shadows could be added within the light patches on the floor.

---


### 2026-10-15 · New scene engineering trial

Added `54_ghibli_lab`, a street-corner repair shop with a tram passing and small motions of objects and environment; run it with `render.py --film style_studies --solo 54_ghibli_lab --from 0 --to 6`. The code is separate from the original 25 room. Determinism and decode passed, and independent review found no technical red flags blocking this round's research presentation; it is still on the procedural-illustration side, has not reached studio-film recognizability, and has not been validated across scenes.
