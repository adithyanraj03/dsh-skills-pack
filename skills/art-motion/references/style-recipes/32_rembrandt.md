# 32_rembrandt · 1642 Rembrandt chiaroscuro

> Source: transfer test D (an independent agent working from the skill read-only, 2026-10-04). The scene code was ported into `scripts/engine/scenes/32_rembrandt.js` after consolidation.

File name at experiment time: `scenes/r1_rembrandt.js`, about 47ms per frame.

**Pipeline**: fully lit base layer (paint the room, the leaded diamond-pane window and the Turkish table carpet at their "all lights on" colors) → repaint the background with broad brown strokes, then blur 2.2px and composite at 75% (a brushed-out ground) → table carpet as its own layer, fine strokes → character flat fill + volume gradients + fine strokes → character "lost edge" treatment → **lighting map multiply** → window glass brightened with screen + cloud shadow sweeping past → bristle impasto → candle flame, dust motes in the light shaft, heat haze → craquelure, grain, vignette cached layer + soft-light golden-brown glaze.

**Key parameters**
- Lighting map: base color rgb(30,21,13), equivalent to 0.13 ambient light. Composited with lighter:
  - Light shaft: a wedge polygon, 40px blur, cached, α 0.8–0.95.
  - The window itself: r330.
  - Face pool: r250 α0.95. Chest: r230 α0.55. Cat: r240 α0.8. Tabletop: r280 α0.6.
  - Candlelight: r190+40·fc, α 0.6+0.4·fc.
  - The "separation light" on the wall behind the girl: r300 α0.35. Rembrandt often brightened the wall behind a figure's shadow side to separate the figure from the background.
  - The whole frame is then multiplied.
- Flicker: `flick(t) = 0.5·noise(2.2t) + 0.25·noise(6.5t)`; the light-pool centers drift ±14px with noise(0.9t); the cloud shadow `cloud = 0.5 + 0.5·sin(2.2t − 0.6)` makes window light ×(1 − 0.35·cloud), while a dark radial blob crosses the glass at 260px/s.
- Background strokes: cell18, len54, w16, jitter 6, angle −0.9 + 1.6·noise(0.003); palette mixBase 0.7.
- Lost edge: draw the character layer once with blur(2.4px) at full opacity, then composite a sharp layer at α0.62. The shadow side melts into the background while the facial features stay recognizable.
- Impasto (bristle brush): one stroke = round(w/1.3) parallel bristles, each with brightness ±17, both ends randomly shortened 0–25%, line width 1.4–2.6; one α0.28 shadow underneath; 2+w/3 highlight dots scattered along the top. Used only on lit areas: blonde hair, collar, porcelain cup, pearls, the cat's white chest, the top of the cat's head.
- Glaze layers: craquelure α0.28×0.28; grain density 0.05 α0.12; vignette 0.75; soft-light rgba(200,140,60,.35).

**Motif animation**: the candle flame (noise-driven side-to-side lean and height jumps), window light dimmed by the cloud shadow and then recovering, 70 dust motes in the light shaft (shown only inside the shaft, flickering on a 24-frame cycle), the cup lift, the heat haze. Motion area 8.0% (0.45↔1.0s).

**Pitfalls**
- The first impasto came out as three tidy lines — "shadow offset + main stroke + bright ridge" — and read like a white sticker or a band-aid. Only the bristle brush reads as paint.
- Copying a region of the original back (`drawImage(b, x,y,w,h…)`) brings the un-stroked background with it and leaves a rectangular patch. Props should be their own layer drawn after the strokes; do not copy regions.
- Grain at density 0.12 / α0.22 covers the face in dirt specks; 0.05 / 0.12 is just right.
- The hand must be drawn before the cup, otherwise the hand ellipse covers the porcelain cup. The order inside drawGirl is "hand→cup→thumb"; follow that order when redrawing.
