# 13_pop · 1962 Pop (Lichtenstein comic panel + Warhol four-panel)

File: `scenes/13_pop.js` (~230 lines). Performance: warm average 6ms, max 9ms, first frame ≈45ms; determinism passes; motion difference 11.6% of pixels from lt 0.34→0.46. On screen for 0.47s (T12 yellow flash halftone transition 0.16s).

## Pipeline
1. **Ben-Day dots = `createPattern`, zero cost**: a small pitch×pitch tile drawing 4 corners + center = 5 circles = a 45° grid (diagonal pitch pitch/√2). Wall: pitch 24, r5.6, blue `#2f5cc8` on white (diagonal 17px, matching the 17px period measured by FFT on the original); skin: pitch 13, r3.3, red `#e2483c` on skin `#fae0cc`; yellow ground: pitch 14 r2.2 α0.18 for faint print dots. Skin uses `fillStyle = pattern; fill(path)`, two orders of magnitude faster than `PAINT.halftone` (per-dot getImageData), and the pattern is aligned to screen coordinates so it does not "swim" as the character moves.
2. **Fully cached base `pop_bg`**: comic panel outer frame 6px black; white baseboard 754–792 (6px black lines above and below); yellow ground 796→990/1003 (horizon slightly slanted); red band; MEANWHILE... (`Bangers-400` 46px, black frame 5px on yellow); Warhol white picture frame + blue windowsill line; blue chair; paper grain.
3. **All characters are "5px thick black outline + flat fill"**, a single function `ink(c, path, fill, lw)` throughout; highlights are thick white short strokes; shadows use `hatch()`: 10px-pitch, 3.5px-wide black diagonals clipped inside an ellipse.

## Motif animation
- **Warhol four-panel color swap**: 4 color sets (background/face/lower face/eyeshadow/lipstick), `step = floor(lt·11)` (≈ once every 5.5 frames; the original switches at frames 601, 605/606, 612), panel i uses set `(i+step)%4`. Cat face = RIG.smooth's 9-point head shape + lower-face ellipse + black block on the right (the smeared shadow of a silkscreen misregistration) + eyeshadow/lipstick/nose/whiskers; two white glass reflections in the upper-right panel.
- **Thought-bubble dots blinking in sequence**: original "dot 1 frames 612–615, dot 2 614–617, dot 3 616–618" → a 12-frame cycle, dot k is lit (r20, jumps up 6px) when `((f-2k) mod 12) < 4`, otherwise r12. Bubble = 10 circles stroked 11px black all at once, then filled white all at once (the cheapest way to write a union outline).
- **WIGGLE WIGGLE burst frame shaking**: 30fps on the beat, hash-jittered ±8px/±6px/±0.03rad; outer white burst (14 spikes, radius 128/178 with randomness) + inner yellow burst + two lines of `Bangers-400` 82px red text (12px black stroke + 4px black drop shadow); 10 black triangular action lines around the outside pulsing in length `0.85+0.25·sin(40lt+2i)`.
- **Cat wiggles its rear, getting ready to pounce**: era-appropriate deformation using RIG.cat's anchors — crouch low: body a custom 10-point contour (origin at `K.box`), head `K.headC + (22,104)` pressed low against the body, white front-paw ellipses reaching forward; wiggle: `wig = sin(lt·2π·6)·16` (6Hz, ~3 times in 0.47s), point weight `clamp((560-x)/140)` → displacement grows toward the rear, which also tips up `|wig|·0.6`; stripes and tail follow the same deformation; three curved action lines beside the rear move with wig.
- **Girl holding the cup**: RIG IK cup hold; cup = white cup + blue diagonal stripes + coffee; steam is two black wavy lines jittering at 14Hz.

## The girl (Lichtenstein)
- Big golden waves: hair mass (19 points, smooth, trailing edge bulging with `sin(2.1i+4t)·14`) + 7 curl balls (r30–48, arranged along the trailing edge); **stroke all 10px black first, then fill all yellow = union outline**; inside each curl ball one 4.5px black C arc + one dark-gold `#d9a514` arc = the sculptural Lichtenstein curl; 5 black S strands, 2 white highlights.
- Skin (face, neck, hands, legs) all red Ben-Day dots; red dress (cut at the knee, hem clipped with a curve not a rectangle) + white highlight bars; two dotted legs + red high heels (7-point polygons); big eyes (white 12×8.5, blue iris r7, highlight dot) + 3 thick lashes + eyebrows moved up 5px; lips enlarged.

## Palette
Black `#141414`; paper `#f3eedb`; blue `#2f5cc8`; yellow `#f7d52c`; red `#d8232a`/`#a8161c`; white `#fbf8ee`; skin `#fae0cc` + dots `#e2483c`; golden hair `#f8d62c`/`#d9a514`; cat `#f39a2c`/`#c4561a`; Warhol grounds `#9ccf3a/#e0359a/#2fc0b0/#f08a2a`.

## Pitfalls
- Drawing the cat head at RIG's original position leaves it floating above the crouched body (a gap); in the crouch the head must move down ~100px into the body.
- The first version of the hair was just one big sheet of yellow with slight waves, which at a distance looked like a cloth draped over the head; Lichtenstein's golden hair is recognizable because of "curl balls + black C arcs".

## Still improvable
- The original girl has a teardrop and a white collar (the classic Lichtenstein crying girl); the setting sheet dropped them and I did not add them; for a more "comic" look a speech balloon could be added.
