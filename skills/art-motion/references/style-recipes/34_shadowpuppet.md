# 34_shadowpuppet · Chinese shadow puppetry

> Source: transfer test D (an independent agent working from the skill read-only, 2026-10-04). The scene code was ported into `scripts/engine/scenes/34_shadowpuppet.js` after consolidation.

File name at experiment time: `scenes/r3_piying.js`, about 121ms per frame (each leather piece gets its own offscreen buffer, and there are many multiplies).

**Pipeline**: shadow screen (radial warm light from the oil lamp behind the screen + screen-mode wick hotspot + 3px cloth weave, weave cached) → prop layer (window lattice, table, vase of flowers, square-back chair, cached) → butterfly → cat → girl, one offscreen layer per group → each layer first stamps an offset soft shadow, then multiplies its body → rivets → control rods → wooden frame.

**Key parameters**
- Leather-piece function `piece(g, path, col, carve)`:
  - Fill the color.
  - Carve the pattern with destination-out inside the clip.
  - Stroke a same-color "leather edge" 2×edge wide inside the clip, so the carving never cuts through the outer contour.
  - Stroke a 2.6px dark-brown edge #3a160a.
- Carving-pattern library:
  - Roe dots: s14–22, r3–3.5.
  - Round flowers: 5-petal ellipses, s36–46.
  - Cloud scrolls: small Archimedean spirals, line width 3.4, s24–40.
  - Lattice: s26–32.
  - Cut lines: line width 3–7.
- Stamping onto the screen: `stamp(layer)` first multiplies at α0.28 with blur 6px and offset (7,5) — the ghost a leather piece casts when it is not pressed flat against the screen — then multiplies the body. Transmission = screen color × leather color, so overlapping pieces naturally darken.
- Colors: red #c0352a, green #2f7d4c, amber #d99a2e (blonde hair = amber leather), yellow #e2bd4a, blue #2c5a8a, orange #d9782a (the cat).
- Screen: radial #fff6d6 → #f2d7a0 → #cf9a58 → #7a4a20; flame perturbation `fl = 0.5·noise(3ts) + 0.3·noise(9ts)`, ts stepped at 15fps. The light center drifts ±26/±18px, hotspot radius 260+40·fl.
- The female role's "empty face": after the hair is drawn, destination-out the whole face, stroke only the face contour, then add phoenix eyes (a long upward flick + lower lid line + pupil dot), willow-leaf brows and a dot of lip color.
- Mapping for the orange-and-white cat: orange = orange leather; white chest, white muzzle, white legs and white paws = **cut out entirely, leaving only the leather edge**; tabby stripes = cut lines. This applies to every "silhouette / cut-out" style: white areas are simply cut away.
- Motion:
  - The girl as a whole sways ±0.012rad around (1260,930); the head turns ±0.06 around the neck rivet.
  - The cup lift steps at 10fps.
  - Wrist looseness: dangle = 0.35·sin(11·ls)·(1 − 0.6·cup); the cup swings along with the hand.
  - The cat's head nods around the neck by 0.1·sin(6ts) + 0.05.
  - The tail is a 4-segment hinge; each segment rotates 0.3·sin(7ts − 0.9i) + 0.38 relative to the previous one, so the whip tip lags segment by segment.
  - The dangling hairpin bead strands swing.
- Rods: 5px dark-brown lines, blur 1.2px multiplied, running from the neck, wrist, cat's back, cat's head and butterfly down to the bottom edge of the frame.

**Motif animation**: the flame makes the light pool on the whole screen jump, the butterfly (wings flipped with scaleX at 12fps, rod attached), the wrist swing, the cat's nod and tail whip tip, the dangling hairpin. Motion area 6.8%.

**Pitfalls**
- Table legs crossing the skirt: after multiply, red × green is nearly black and becomes a black trapezoid. Darkening on overlap is correct in shadow puppetry, but do not put the overlap on the visual focus — just move the table legs.
- The cat's front legs started as one solid orange rectangle that covered the white chest. Only two almost entirely cut-away white legs read as "orange and white".
- Rods crossing the subject look chaotic: run the rods down and outward from the leather piece, never across another character.
