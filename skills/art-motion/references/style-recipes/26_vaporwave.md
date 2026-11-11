# 26_vaporwave · 2011 vaporwave / cyber neon

> Source: transfer test B (implemented by an independent agent with the skill read-only, 2026-10-04). The scene code was later ported into `scripts/engine/scenes/26_vaporwave.js`.

At experiment time the file was named `scenes/c5_vaporwave.js` (about 210 lines). Review red light: the top in the first version was pink and blended into the pink-toned skin, reading as if she were naked. Changed to a lavender-purple trench coat `#8f7cf6` + white triangular collar + cyan zipper line. Median 49ms per frame; frame difference 25% (the VHS post-processing keeps the whole screen moving).

**Pipeline**: draw the whole frame into offscreen S first, then run VHS post-processing to output to c (the counter is drawn on top by the engine and is unaffected by chromatic aberration).
1. Wall: deep purple vertical gradient `#0d0322 → #4a0f6a` + magenta radial light at the window, cyan radial light at the sign. A cyan light strip along the baseboard.
2. **`glowLine(c, col, w, blur)`**: stroke the same path first with a thick shadowBlur glow, then with a 2–3px near-white core line — that is a neon tube.
3. Sunset in the window: the sun is a yellow → orange → magenta vertical gradient, cut with 7 horizontal slits using `destination-out`, slit width increasing with depth (2 + q²·16), the whole thing moving up at 0.9/s. The horizon is wireframe mountains (magenta glow), below which a cyan perspective grid scrolls toward the viewer, with palm silhouettes swaying on both sides.
4. Ground: magenta perspective grid, vanishing point (960,600), horizontal lines `y = 600 + 520/d`, d = k + 1 − phase (phase = 1.3t mod 1), line width thickening toward the foreground.
5. **The neon sign "カフェ" is drawn as polylines, drawing the tubes by hand** (not relying on a font): each kana is 1–3 strokes in (u,v) unit coordinates. Each character flickers by frame hash: off when `hash(floor(30t), k) < 0.07`; "フ" additionally goes off with 22% probability when `f mod 17 < 5`, and when off, a dark purple tube is drawn.
6. Win95 dialog TEA.EXE: gray body, navy gradient title bar, progress blocks `3 + 14lt`, percentage `18 + 70lt`. On the table, a marble bust (22-point profile silhouette, purple-gray gradient + vein lines + pink rim light + sunglasses joke).
7. Character: pink sweater, cyan pleated long skirt, blonde hair + pink scrunchie. Glow outline "pink on the window side, cyan on the back side": the same set of paths is stroked twice, clipped to the left and right halves of the screen.

**VHS post `vhs(c, S, t, lt)`**
- RGB split: for each channel, draw S into a temporary canvas, `multiply` a solid color `#ff0000/#00ff00/#0000ff` to extract that channel, then composite onto black with `lighter` at an offset. Offset 3 + 1.5sin(7t), with occasional (hash<0.12) +6.
- Tracking noise band: 70px tall, scrolling down at `(520lt + 200) mod (H+160)`. Inside the band, every 6px a horizontal displacement `±30·sin(πy/bh)`, overlaid with 90 white-gray noise lines.
- Scanlines: 4×4 tile pattern (row 0 α 0.28, row 2 α 0.12). OSD: PressStart2P "PLAY" + hand-drawn ▶ (the font lacks this glyph), flashing every 16 frames; bottom-left date and timecode driven by lt.

**Palette**: magenta `#ff4fd8`, hot pink `#ff2f8f`, cyan `#3ff6ff`, deep purple `#12052a / #2a0b4a`, sun yellow `#ffd84a`, orange `#ff8a3a`.

**Pitfalls**
- Full-width "ＶＡＰＯＲＷＡＶＥ", ▶, and Japanese are all missing from `lib/fonts` and silently fall back to a system font. The label was changed to half-width + letter-spacing 7; the ▶ and kana are drawn by hand.
- The character outline uses part paths, so the waistline, arms, and torso junctions also glow. Neon line art can accept that, but for a pure outer contour you must first draw the silhouette offscreen, then stroke the offscreen edge.

---
