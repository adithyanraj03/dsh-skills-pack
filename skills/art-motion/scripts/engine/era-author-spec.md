# Era author spec (pure-code drawing)

> This is the author spec for the Art History Speedrun reproduction film: the composition coordinates and character setup below apply only to this film and similar speedrun/time-travel films. For the general version, see `references/08-style-author-spec.md`; for a new subject, recompose for that subject.

Each era you are responsible for = one file `scenes/<id>.js`, registered as:

```js
SCENES['<id>'] = { draw(c, lt, t) { /* fill 1920x1080 */ } };
```

- `c`: target 2D context; `lt`: this segment's local time (seconds, counted from the start of this era's transition, may be slightly longer than the segment duration); `t`: film-wide time.
- **Do not draw the year plaque** (the engine draws it at upper right, 1500–1890 × 40–210); leave this area as background and do not put important elements there.
- **Do not modify `lib/`, `engine.js`, `eras.js`, `transitions.js`, or another person's scene file**. Write any utility functions you need in your own file.

## Available libraries (read the source first)
- `lib/paint.js` → `PAINT`: noise (noise/fbm), texture (texture/grain/craquelure), hand-drawn lines (roughPath/boilSeed),
  style renderers: strokes (flow-field brushwork, supports `palette` regional palettes) / dabs / mosaic / halftone / pixelate / facets, `swatch` color groups, `choreo` shared choreography, steam, particles, `scratch(key)` offscreen canvas.
- `lib/rig.js` → `RIG`: `RIG.girl(opt)` girl skeleton (seated in profile facing left, returns each body part's Path2D + anchor points `G.A`), `RIG.drawGirl(c,G,pal)` (pal.mode can be fill/line),
  `RIG.cat(opt)` orange-and-white cat skeleton (seated facing right), `RIG.drawCat(c,K,pal)`, `RIG.drawCup`, `RIG.smooth(points)` smooth curve, `RIG.taper` tapered limb, `RIG.ik2`.
- **Benchmark implementation: `scenes/09_postimp.js` (Van Gogh)** — study its structure: flat-color underpainting → style renderer repaint (regional palettes) → characters in flat color + fine brushwork → linework added → moving highlights.

## Hard requirements
1. **Same scene skeleton**: standard composition — window (350,120)-(810,560), cat sitting on the floor (390,610)-(690,905), table (810,620)-(1200,905), person (1120,200)-(1500,910). Every era in the reference film aligns to this set of positions, and transitions depend on it.
2. **Characters**: the person is a 17-year-old blonde European girl wearing **a girl's outfit from that era** (modest clothing); the cat is an **orange-and-white cat** (orange tabby on the head/back/tail; white muzzle/chest/belly/paws).
   It must be based on the `RIG.girl` / `RIG.cat` skeletons and choreography (the same skeleton and the same set of actions), but the drawing method must change to that era's method: you may take only the Path2D and fill/stroke/silhouette it yourself, add clothing at the anchors, or apply period-specific deformation to the skeleton points (such as the Egyptian frontal eye or a black-figure silhouette).
3. **The picture must live**: the main character's motion uses `PAINT.choreo(lt,t)` (`cup` cup raise, `tail` tail flick, `blink` blink, `breathe` breathe),
   plus 2–4 **small loops drawn from that era's visual motifs** — see the "in-shot actions" for each era in `../breakdown/storyboard.md` (examples: a rock-painting animal running by alternating two poses, a scarab pushing the sun ball, a meander band rolling, Vesuvius smoking, gold-leaf highlights sweeping past, an ornithopter flying by, cherry blossoms falling, light spots flickering...).
   Each era appears for only 0.25–1.4 seconds, and the action must be **visible** within that window.
4. **The style is made by code**: use renderers/textures/lines to draw it as an artwork of that era, not clip art. Lines can use 8–12fps "boil" (`boilSeed`) to add a hand-drawn feel.
5. **Performance**: ≤ 150ms per frame (1920×1080). Cache static parts with `PAINT.cached`. All randomness uses seeds; the same t must draw the same frame.

## References
- Reference-film frames for that era: `../image-gen/ref/<id>.png` (composition, motifs, palette — everything except the counter; extract them yourself from the reference film, as they are not distributed with the skill)
- AI design plates (same composition, already changed to the blonde girl + orange-and-white cat): `../image-gen/plates/<id>.png` — treat them as art-direction references; **do not paste the images into the frame**; draw everything in code.
- In-shot actions, transition origins: `../breakdown/storyboard.md`
- Reference film at 60fps: `../reference_films/<reference-film>.mp4` (bring your own)

## Self-check (at least 3 rounds per era)
```sh
cd <your project directory>   # contains engine/ (copied from scripts/engine)
uv run --with playwright python engine/render.py --solo <id> --stills 0,0.3,0.6,0.9 --out renders/<id>
uv run --with playwright python engine/render.py --solo <id> --from 0 --to 1.2 --out renders/<id>/clip.mp4
```
Compare your frames with the reference-film frames and design plates in a contact sheet (PIL), and ask yourself: ① Can you tell at a glance which era/artist it is? ② Does the girl look like a 17-year-old blonde girl, and is the cat an orange-and-white cat? ③ Can you see the picture moving within 1 second? ④ Are there goofs (misalignment, broken lines, incorrect occlusion, blank areas)?
If any item fails, revise until satisfied.

## Delivery
- `scenes/<id>.js`
- `notes/<id>.md`: which techniques were used (renderer parameters, palette, how the motif animation was made, pitfalls hit); **this is experience to feed back into the skill**; write concretely and include numbers.
