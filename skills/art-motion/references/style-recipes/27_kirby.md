# 27_kirby · 1966 Marvel cosmic era (Jack Kirby + four-color offset printing)

> Source: transfer test C (an independent agent working from the skill read-only, 2026-10-04). The scene code was ported into `scripts/engine/scenes/27_kirby.js` after consolidation.

File name at experiment time: `scenes/k1_kirby.js` (255 lines). About 20ms per frame, frame delta 7.5%.

**Pipeline: draw the same geometry twice**
1. **Color plate layer**: paper `#f4ecd6` + flat fill + Ben-Day dots. C dots over the light-blue wall ground (pitch 9, r 2.7, 15°), purple dots over the deep-blue floor ground (pitch 9, r 3.2, 75°), skin is red dots (pitch 7, r 1.5, 75°). **The whole layer gets `drawImage(color, 4, 3)` = misregistration**.
2. **Ink line layer**: white ground, each part "fill white → shadow → 6px black outline". Composited with `multiply` over the color plates, where white = transparent. Filling each part white covers the lines of the parts behind it, so only the visible lines remain and visibleLines is not needed.
3. **Kirby spotted blacks + feathering**: light comes from the window (LIGHT=(-0.86,-0.5)).
   - Black crescent: `path ∩ ¬translate(path, LIGHT·d1)`, d1=14. The method is to `clip(path)` first, then use "a full-screen rectangle + the translated path" as `clip(…,'evenodd')`, and finally fillRect black.
   - Feathering band: the same extraction with d2=30 gives a band; inside it, draw parallel lines along the light direction (spacing 9px, line width 2.6).
   - Parameters (d1/d2): skirt 16/34, torso 14/30, sleeve 10/22, hair 12/26, cat body 16/34, tabletop 10/18.
   - A single function applies Kirby-style shading to any Path2D.

**Motif animation**
- **Kirby krackle**: a cluster of 16–26 black circles. Distances distributed as `R·rnd^0.7`, larger toward the center (`R·(0.05+0.2·(1-d/R))`), reseeded at 12fps, radius pulsing with `sin(18t+i)`. 6 clusters travel along an S-shaped energy stream outside the window (`(k/6+0.42t)%1`); the stream is an orange-edged, yellow-cored band with a jagged ink edge. Heat haze uses krackle too (4 small clusters drifting upward).
- **Speed lines**: cup-lift speed `|sin(min(1,lt/0.9)π)|`; 9 black lines drag down from the base of the cup, length 70–180·v, jittering at 12fps; two action arcs behind the elbow.
- **Onomatopoeia SLURRP!**: from lt 0.52 it pops out with `outBack`, in `Bangers-400` 132px (×0.82); 7 layers of black extrusion (each offset by (0.8d,d)) build Kirby's blocky dimensional lettering; a 46px band on the upper part of the red letters is clipped to yellow (two-color letters); underneath is a 26-point yellow explosion frame; jitter ±3px at 12fps.
- **Panels**: main panel 24..1534; the right-hand panel is a cat-face close-up, pupils rise with `cup` (`lerp(14,-18,cup)`) and look left. The background is a magenta ground + yellow dots + 44 focused black triangles (changed at 12fps) + 6 krackle clusters around the head. Bottom caption box "BUT THE CAT IS WATCHING!", top-left caption box "MEANWHILE, AT TEA TIME...". The counter is built as a caption box with a yellow ground, black border and black offset shadow, sitting in the seam of the top-right panel.

**Character**: 1960s red A-line dress, white Peter Pan collar (two ellipses), three black buttons down the front placket, black headband (an elliptical arc in the head's rotated coordinate system, line width 11), flipped-out hair ends (drawn in the `skirt` hook, sitting behind the torso). The chair is a Saarinen Tulip chair.

**Pitfalls**
- The onomatopoeia started at (1000,300) at full size and covered the window and the girl's face. Moved to (990,318) and scaled to 0.82.
- The large black ellipse on the right of the cat close-up made the cat read as a tortoiseshell; changed to a narrow crescent hugging the edge.
- The planet ring must be split into a back half-arc (drawn first) and a front half-arc (drawn last), otherwise the ring cuts through the planet.
- **Still improvable**: the image leans "clean pop comic"; it still lacks Kirby's blocky fingers, more exaggerated perspective and muscular tension.

---
