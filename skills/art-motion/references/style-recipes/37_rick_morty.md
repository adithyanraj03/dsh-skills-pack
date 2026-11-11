# 37_rick_morty · Rick & Morty flat outlined cartoon

When using code characters in the shot table, write `Style: 37_rick_morty Rick & Morty-style flat cartoon` and `Characters: original semantic SVG` to enable the narrow exception for the character check; y4 still requires a frame lib.


Source: SVG single-frame recreation and animation experiment from 2026-10-14. It is the 36th catalogued style; the internal ID uses 37_rick_morty to avoid overwriting the existing 36_picasso_blue. It is a standalone style; crossing into other art movements is only optional narrative.

## Before you start

- This example is an SVG pipeline and cannot be dropped directly into the Canvas engine's eras.js or recorded with the ordinary render.py for Canvas; otherwise SVG characters will be missed. Use this example's render.py to screenshot the whole page, or export a video first and then connect it as an engine clip. The old 35-style gallery and overview image remain unchanged; this example has its own preview.
- The example contains only a code-drawn room, girl, and cat, and does not rely on original-film screenshots, Rick/Morty character assets, or sound. When migrating to a new subject, keep the drawing method and rearrange the scene.
- This style allows characters to be drawn as semantic SVG from explicit references — a narrow exception to the existing "characters via AI frame generation" route; it does not extend to live-action portraits or arbitrary chibi characters.

## Runnable starting point

Copy the entire `scripts/engine/reference_films/rick_morty/` directory into the project. Open index.html directly to preview, play, and scrub offline. No Node, API, or online fonts required.

```sh
uv run --with playwright playwright install chromium
uv run --with playwright python render.py --stills 0,1,2 --out verify
uv run --with playwright python render.py --from 0 --to 8 --fps 24 --out style36.mp4
```

Video export additionally requires ffmpeg. The entry point defaults to 8 seconds silent; --to can specify a longer time. Per-frame interface `window.seek(t,state)`: t is non-negative seconds; omitting state automatically raises the cup and shifts the gaze; passing state fully controls the performance. state contains `look:[x,y]`, `catLook:[x,y]` (each axis -1..1), `sip`, `catJump`, `gBlink`, `cBlink` (all 0..1). seek does not accumulate state and supports out-of-order rendering; automatic blinking and tail wagging depend on t.

File roles: svg-kit.js provides rounded outlined primitives, curves, and seeded texture; room.js draws layered characters and scene, with colors centralized in the C object; index.html handles preview and seek; render.py handles whole-page per-frame screenshots and encoding.

## Drawing method and motion

1920×1088 original coordinates, viewBox `0 4 1920 1080`. Stroke #222323, default 2.35px, round caps and joins; detail lines 1.6–2.6px. Warm gray wall #cdbf96, wood floor #9b7752, skin #efc4a0, sky #a7d6ea; hard-edged flat fills, a few darker areas in the same hue family, low-contrast mottling left in the background. Characters and props share the same stroke; do not add realistic lighting to compensate for texture.

Faces rely on contour proportions and small curves for eyelids and mouth; large eye whites, small dot pupils, no glossy highlight eyes. Hair spikes use mixedPath; cheeks and limbs use smoothPath. Body, head, arm-and-cup, eyelids, and pupils are grouped; establish the still frame first, then move using the original anchors. The tail uses a centerline plus width to generate a closed contour; do not swap in a random shape each frame.

Default performance: slow lift of the cup, slight head turn, gaze shift, deterministic blinking, cat tail wag. catJump is a sine airborne progress; body and tail share the displacement; there is no landing squash or walk cycle. While holding the cup, the shoulder anchor stays in place and the cuff follows the cup.

## Migrating from reference frames to other scenes

First measure composition and occlusion, then take the median color of each region; thresholding dark outlines to cut connected color blocks can help measure coordinates, but do not treat auto-traced paths as the character skeleton. Group hands, eyes, face, hem, and furniture semantically; the still frame is skeleton frame 0. Walking requires toe-driven two-bone IK and phase advance by actual distance; this example has no walk rig, so do not claim it supports arbitrary character walking.

Frontal characters moving sideways easily develop scissor legs: widen the two-foot stance, shorten the stride, and turn the gaze; do not mirror a character with asymmetric clothing. Ground objects sort by foot/base y; wall texture is clipped with the same shape. When SVG and Canvas share a page, isolate modules with an IIFE; for SVG filter userSpaceOnUse regions use real canvas coordinates, never 0,0,1,1.

## Verification and follow-up feedback

The bundled render.py uses Chromium's `--disable-partial-raster` to avoid antialiasing differences caused by SVG partial rasterization. Independent re-check on 2026-10-14: under this configuration, cold start and out-of-order frame capture [1,7,1,1,0,1] produced a t=1 screenshot with 0-pixel difference; an ordinary browser only guarantees deterministic DOM state, so do not claim pixel-identical screenshots.

For every change, at minimum verify under the above rendering configuration that cold-start and out-of-order seek match pixel-for-pixel at the same moment, that two moments differ visually, that 0 and maximum expression do not crop, and that the browser reports no errors; then visually check the head-body seam and eyelids. Example quality is currently ★★: runnable, but modeling and complex motion still have room to improve; do not reuse the contour score from the original garage recreation as this room's similarity score.

Read this card's shortcomings before use; write new findings back to this card with date, scene, evidence, and verification status. If an old conclusion fails, edit the original sentence first; do not promote a single experience into a rule for all styles; for reproducible stable failures, fix the code first and test determinism.
