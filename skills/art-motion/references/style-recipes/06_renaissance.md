# 06_renaissance · 1503 High Renaissance (Leonardo da Vinci style)

16–37ms per frame (median 16ms).

## Pipeline
1. Static layer `ren_static`: first paint the whole room on the raw canvas, then draw the entire layer into the cache with `filter: blur(1.3px)` — effectively applying sfumato to the whole image. The room contents are as follows:
   - Wall: P.texture #43321f→#22180e, plus a radial gradient for the window glow, darkened at the top.
   - Window: semicircular arched window, stone frame lit on the left, the distant view in the opening.
   - Floor tiles: perspective checkerboard. Computed with real projection: `y = 420 + f·h/Z`, `x = 960 + f·X/Z`, f=1029, h=5.75, Z starts at 16 and each tile forward is 1.4. The first row lands at y=790, then 825/868/922/989 going down, matching the original's row spacing. Tile colors are #a88c64 and #5c2418, with a soft-light pool of light laid over and a radial vignette (centered at 760,960).
   - Square table with a white cloth, ladder-back chair.
2. Distant view (aerial perspective): three layers of mountains, bluer and paler with distance (#9fb4b8 → #7d9294), contours generated with fbm. Then the lake, the river valley (gray-green shifting to warm ochre), a winding silver-white river (width growing from 3 to 16px with distance), cypresses and round trees, a stone bridge.
3. Each frame, draw in order: river glints (24 light points drifting downstream, twinkling) → birds → ornithopter (all three clipped inside the window opening) → character layer → light shaft and floating dust → overlay layer.
4. Overlay layer `ren_over` (cached, then a single drawImage):
   - Vignette: α0.3 at 0.55, α0.8 at the edge.
   - Yellow glaze: α0.07.
   - Canvas weave: one line every 3px.
   - Oil brushstroke texture: 9000 strokes, α0.022/0.028, line width 5–10, random direction.
   - Craquelure: P.craquelure at α0.32; then use `brightness(0) invert(1)` to turn it into white lines, offset 1px, α0.16, composited once with `lighter`, mimicking the bright lifted edges of flaking paint.

## Sfumato
Draw the characters into an offscreen layer `renChars` first, processing only the region (320,180,1200,780). Composite back onto the main image in two passes: first `blur(2.6px)` fully opaque, then a sharp layer at α0.38 on top. Edges end up soft while the features stay legible. Characters have no outlines at all; volume comes entirely from gradients:
- Skirt folds: bright fold rgba(200,70,60,.3), dark fold rgba(40,0,0,.45).
- Velvet sleeve: draw a band of rgba(170,200,140,.45) along the bone direction.
- Face: a lit gradient from the left, plus eye-socket shadow.

## Motif animation
- Ornithopter: flies from x=470 to 740 during 0–1.35s while bobbing up and down and pitching slightly. The flaps of the two bat wings follow `up = 0.5+0.5·sin(t·12+phase)`, wingtips moving between −118 and +24px. The far wing is scaled to 0.78, darkened, and phase-shifted by 0.5. Wing construction: leading-edge spar + 6 radial ribs + scalloped trailing membrane, tail rudder also swinging. The first version was a flat "paper plane" that no one could recognize as Leonardo's ornithopter; only after redrawing it as this ribbed fan wing was it recognizable.
- Light shaft: the wedge is drawn once into a cache with `blur(28px)` and screen-composited every frame. The first version filled the polygon directly every frame and the two hard edges looked fake. Floating dust is 46 particles drifting slowly up along the shaft and twinkling.
- The girl sips from the silver cup per the choreography, closing her eyes when cup>0.7. The cat keeps squinting and smiling, tail swinging.

## Pitfalls
- The first version of the oil texture used 26000 strokes, α0.05, direction following noise, and the whole wall looked like a Van Gogh swirl (Post-Impressionism). Dropping to 9000 strokes, α0.025, random direction brought back the classical-oil-painting feel.
- The inner-edge darkening on the cat's body used 26px, α0.45, which made the cream-white body look like a glass cloche. Changed to 14px, α0.22, and the white chest now uses a radial gradient to "bleed" the orange fur in, leaving no hard boundary.
- The floor tiles were too bright and too contrasty in v1, like a vector illustration. The surroundings must be darkened, leaving only the pool of light where the window light falls.

## v2 rework (review: too static 0.20 vs 0.46; the subject was blurred while outside the window was sharp — depth of field inverted)
- Sfumato changed to: blur layer 1.6px (was 2.6), sharp layer α0.82 (was 0.38). Soft edges kept, features and contours now clear.
- Ornithopter enlarged 1.6×, flight path 440→790, pitch amplitude ±0.07; birds increased to 14, scaled 1–1.8×.
- Cat: head tilts and rubs around the neck ±0.16rad, squint tightens and loosens alternately, tail ×2.2, breathing ×3, look turns left and right. Girl: hair tips swing ±11px, sip ×1.6.
- Cloud shadows sweep across the river valley outside the window; shaft brightness varies with the "cloud passing the sun" at 0.75±0.35; floating dust 70 particles.
- Static-segment frame difference: 0.20 (review measure) / 0.30 (my measure) → 0.37. Original 0.43.
