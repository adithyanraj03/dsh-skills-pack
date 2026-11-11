# 02_egypt · 1350 BC Egyptian tomb mural (pure code)

File: `scenes/02_egypt.js` (about 460 lines). Performance: warm max 20.7ms / mean 10.5ms (1920×1080), `init()` preheats caches at boot, so the first frame no longer stalls 170ms. Determinism check passed.

## Pipeline
1. **Static layer `eg_static` (cached once)**: plaster wall → hieroglyph columns → window (cornice / colored block frame / white ground / Aten sun disc / sacred serpent) → ceramic jars ×3 → offering table and offerings → gold chair → blue bowl → ground line and bottom multi-layer frieze → deep blue band → top/left/right colored block borders.
2. **Moving motifs (drawn per frame, cheap)**: water-sign hieroglyphs flowing, Aten rays + end hands opening and closing, two long rays extending in front of the cat supporting an ankh, scarab pushing the sun ball.
3. **Characters**: redrawn in the Egyptian convention, not using RIG.drawGirl/drawCat, only taking anchors and choreography.
4. **Mural surface**: `eg_surface` mottled layer `multiply` over the whole picture + `P.grain` grain + 6 random-walk hairline cracks (the cracks are drawn in the surface layer, so they cross the characters, like real wall aging).

Egyptian murals are "no perspective, flat fill, contour lines"; here **no brushstroke renderer at all**, and the lines do not boil (clean 2.2–2.8px dark brown lines `#2a1810` are what looks right); the period feel comes entirely from convention (profile face with frontal eye, frontal shoulders) + palette + pattern density.

## Palette
Wall `#eadcb8`→mottled shadow `#d8c597`; four-color border red `#b8322a` blue `#2a58a8` yellow `#e2b13a` green `#2e8a55`, cream between blocks `#f2ead6`, black seams `#231a14`; gold `#e0ab38`/dark gold `#a8741c`/bright gold `#f3d27a`; deep blue band `#1c2236`; column divider red line `#9a2b22`; Aten sun disc `#c8372b`, rays `#c23a2a`, small hands `#b4452c`; skin `#e6b282` (Egyptian women's pale yellow ochre); cat orange `#e08a3c` stripes `#b45a1c` white `#f6efe0`; scarab lapis `#2c56b0` + turquoise `#3fa6a0`.

## Hieroglyphs (the part that most gives period feel)
- wrote **24 glyph functions** (ankh, sun disc, bread, reed, owl, falcon, heron, horned viper, Eye of Horus, cartouche, scarab, seated person, leg, arm, basket, house, three verticals, feather, djed pillar, shen ring, jar, lotus, nfr, mouth, water), each drawn in 10–20 strokes within a ~50px box, with its own candidate colors. Line width 3.1 (about 3px after scaling), `round` caps.
- columns measured from the original film: left 3 columns x=78..306/y=66..566, upper middle 4 columns x=852..1172/y=66..452, right 4 columns x=1560..1866/y=252..882, 1 column left of the cat x=298..366/y=614..886.
- layout: `U.rng(1350)` seed, filled column by column downward, glyph scale = column width/78×(1.0–1.14), spacing 6–11px; **no adjacent repeats within a column, same glyph ≤3 times per column, scarab/water down-weighted 60%** (the first version had no limits and the screen was all scarabs, like stickers).
- the layout is computed at module init with positions stored — so water glyphs can stay out of the cache and be drawn separately per frame. At least 6 water glyphs guaranteed.

## Motif animation (all from lt/t only, deterministic)
| Motif | Method | Numbers |
|---|---|---|
| Scarab pushing the sun ball | x(lt)=800+642·(lt−0.394), measured from the original at 10.7px/frame; modulo 2160 looping; ball roll angle = ball center x / radius; legs two poses `floor(lt*15)%2` (switch every 4 frames at 60fps) | overall ×1.22, ball r=23×1.22 |
| Aten small hands opening/closing | open=0.5+0.5·sin(2π·lt/0.4+k·0.9), finger spread angle (0.1+0.24·open) | period 0.4s, 13 inside the window + 2 outside |
| Ray micro-tremor | end x+=3·sin(7t+1.3k), y+=2·cos(6t+k) | ±3px |
| Water glyphs flowing | zigzag phase = floor(lt·12)·0.5, 12fps stepping, 4 steps per cycle | 0.33s/cycle, like hand-drawn frame by frame |
| Holding the cup | `cup = lerp(0.8,1,choreo.cup)`: the original "holds it at the lips drinking the whole time", only the last 20% raising + choreo.sip head tilt | — |
| Cat | choreo.tail tail swing (RIG.cat.tailPts), blink (t≈2.18–2.30, landing exactly on this section's lt≈0.77–0.89), breathe upper body | — |

Motion amount: lt 0.45↔0.9 (avoiding the beat-impact scale) moving pixels 3.5%, concentrated in the ray hands, cat tail, girl's head and arms, scarab — not a lot but all gaze focal points.

## Characters: Egyptian convention
**Girl** (`RIG.girl({dy:-25})`, dy puts the feet on the y=900 ground line):
- the profile takes `G.face`; the **frontal eye** is drawn by hand: almond white + black pupil r4.2 attached to the upper lid, upper lash line 3.2px dragged back 18px (kohl tail), long brow.
- **frontal shoulders**: the torso does not use G.torso, hand-drawn wide trapezoid x 1270–1452 (both shoulders visible, wide at the top narrowing down).
- white linen: fill skin color first, then overlay white at `alpha .9` → a little skin shows through = translucent linen feel; the body of the skirt has 27 bezier fine pleats fanning from the waist to the hem (clipped inside the skirt, `rgba(120,96,70,.5)` 1.3px), chest vertical pleats spaced 9px.
- broad collar: 5 concentric semi-ellipses (blue/red/green/gold/blue, rx 50→88, ry 24→55), an outer ring of 18 alternating red-blue teardrop pendants.
- **golden braids**: after clipping the wig outline, draw 15 vertical braids, each = 11.5px dark gold base line + 8.5px gold line + a left-right alternating diagonal segment every 8px (herringbone), ends staggered in length. The first version filled it with small round beads, like "golden caviar"; only long strips + diagonal segments read as braids.
- gold headband (bezier 15px black base/11px gold/3px bright gold) + back hanging ribbons, large gold earrings, gold armlets (gold 8px + blue 2.5px stripes).
- **cup-holding arm**: RIG's default hand sits at the cup side and the shoulder at the torso middle, so the elbow swings far out. Changed to "hand supporting under the cup body (the cup foot)", shoulder moved to the front shoulder (1282,476), `RIG.ik2(sh, hand, 140, 160, -1)` making the elbow hang down to the chest.
- blue lotus cup: petal-shaped cup body + three pale blue petal lines + cup foot, following G.cup's position/tilt.

**Cat = Bastet seated pose** (`RIG.cat({dy:-5})` takes headC, tailPts, blink, breathe; the body is drawn by hand):
- silhouette: upright chest + round rump, **front legs wrapped into the silhouette**, chest to front paws one white area, then two lines dividing the two front legs + toe lines. The first version drew the front legs as two separate white columns, like bowling pins.
- head turned to the side + tall pointed ears + frontal almond eyes (yellow `#e8cf4a`, vertical pupils, black eyeliner tails), white muzzle, whiskers, gold earrings.
- collar clipped inside "body ∪ head" (`Path2D.addPath` merged), otherwise the round head stroke pokes out of the neck; Eye of Horus gold pendant.
- orange tabby: 9 dark orange arcs on the back, 4 on the thighs, 5 on top of the head, a stripe every 3 sample points on the tail, white tail tip.

## Pitfalls hit
- selfcheck's 0.2↔0.7 difference in this section reads as "the whole picture is moving" — that is the engine's beat-impact scale (lt<0.36s), not the scene moving. To see real motion compare two frames at lt≥0.4.
- `P.texture` takes about 170ms the first time; preheat in `init()` (called at engine boot), otherwise it stalls on the first frame of the T01 transition.
- the gravel blocks in the original's ref are transition residue, not picture content, don't copy them (they're not in the design sheets either).
- the year plate area 1500–1890×40–210 keeps wall only; the right hieroglyph columns start at y=252, exactly avoiding it.
- review rework: at the cat's original size the ear tip was y≈530, pressing on the colored block at the bottom of the window frame (y 530–560), like the cat's head stuck into the window frame. Changed to anchor at the sole (540,898), with a canvas transform scaling the whole thing to 0.85 (RIG.cat still s=1), the ear tip landing at y≈585; the two long rays' ends are converted with the same transform via `catPt()`, the small hands still landing at the cat's head/muzzle; the back line and rump moved forward 12–20px for a more slender Bastet pose. **Lesson: it is not enough for the cat/person and the window frame each to align to the standard composition frame; the two frames sit very close at y≈540–600, so parts that exceed the skeleton box such as raised ears need a separate clearance check against neighboring objects.**

## Rework v2: Egypt too static (review report item 3)
Convention: whole-film renderFrame, static segment frames 112–140, 480×270 per-frame mean absolute difference (counter masked out). **Before 0.32 → after 0.84 (original 0.90)**, performance warm max 21.7ms.
- **Cup-holding loop**: lt<0.35 raises to the lips per choreo; after that, one loop every 0.6s `cup = 1 − 0.46·(1−cos 2πu)/2` (cup lowered from the lips to 0.54 then raised back); while the cup is at the lips add head tilt `sip += 0.3·clamp((cup−0.78)/0.22)·(0.65+0.35·sin 13lt)`, head tilt up to ~0.2rad. This item contributes the most.
- **Inscriptions being written out**: every 0.12s take 6 glyphs from a shuffled glyph table (seed 77, across all columns): first erase with a wall-texture `drawImage` sub-rectangle, then stroke out per stroke with `setLineDash([p·95, 999])` (each subpath's dash starts over on its own, exactly like writing stroke by stroke), the filled part only appears at p>0.55; the stroke color falls from bright gold `#f6c846` back to its original color, with a 10px gold shadowBlur afterglow, done writing in 0.36s. About 18 glyphs are writing at the same time.
- **Aten pulsing**: period 0.45s; ray length ±9% in sequence along the fan (phase −0.55k, like a wave sweeping across), line width 2.2→3.8, small hands scale 0.9–1.2 overall, finger spread angle 0.03–0.45; the sun disc has a gold halo + bright ring pulsing, with the disc redrawn above the halo to stay red. Small hand coordinates clamped inside the window (x 428–752, y≤512), otherwise half a hand gets clipped by the window frame when extended.
- **Cat**: tail amplitude `tail·2.1 + 0.25·sin 9.5t`; the two ears twitch quickly out of phase (once every ~0.38s for 0.1s, rotating 0.32–0.38rad around the ear-base midpoint).
- Lesson: fine-line motifs like Aten rays and water glyphs hardly register in a 480×270 frame difference; **to measure "visibly moving" you need local motion with enough area** (arm + head, whole-glyph erase/rewrite); fine-line sway can only be garnish. The first version's disc pulsing covered the disc with translucent orange, washing the red disc orange at the peak; changed to a halo outside the disc + bright ring.
