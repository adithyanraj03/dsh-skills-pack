# 16 · Style Demo Protocol: From "Inspired Flat Illustration" to "A Painting You Recognize at a Glance"

When to read: when making or remaking any art-style demo scene (`scenes/<id>.js`), or when delegating it to an agent, give the agent this page's path. Doc 15 covers "how to research a style and how to transfer it"; this page covers "what level a demo must reach to count, and how to get there step by step."

## Why the 17 demos added on 2026-10-15 were almost unusable

On 2026-10-16 we rendered them as stills, viewed them side by side, and pulled public-domain originals for comparison; this turned up five root causes (most of the 17 fit; 45 Renoir is an external bitmap plus mesh warp and 44 has drapery, so they are not flat vector blocks, but they equally lack original anchoring and a material layer):

1. **No one looked at the originals.** The recipe cards had only text descriptions and museum collection links, so the maker (the agent) drew from impression. The result was that most images looked like the same modern flat illustrator with a different palette: clean vector-block shapes, with the style reduced to "a palette plus a layer of noise."
2. **The card wording removed the anchor too.** "Do not generalize from a single famous work" and "do not copy the composition" were meant to prevent plagiarism, but in practice became "do not work from the original." What should be prevented is copying a famous work's figures and coordinates, not learning its brushwork, materials, color relationships, or figure-construction logic.
3. **There was no "material" layer.** The old benchmarks (Van Gogh 09, ink wash 17) were strong because they ran the image through real art materials: flow-field brushstrokes, flying white, ink bleed. The new scenes were 35–70 lines, drawing only shapes, never passing through materials.
4. **One subject was applied to every style.** Washing machines, water wheels, and machine repair kept recurring (this redo did not entirely avoid it either: 38 and 47 both have "wooden crate / cargo," and 51 used a water-lifting wheel again—47 has been changed to sacks, and the rest are on the progress list to fix), and each style's own narrative logic (Ma Yuan's corner, the miniature's all-over fill, Gauguin's cropping, Giotto's gaze) was flattened out.
5. **There was no score threshold.** Self-check covered only qa's technical items (renders, deterministic, no flicker); no one held up the original and asked "does it look like it?" So anything that could run for 6 seconds counted as delivered.

## Protocol (in order, each step has an artifact)

### 1. Original anchoring

```sh
uv run <skill>/scripts/analyze/fetch_reference.py --out <project>/reference/<style> "Artist Work A" "Artist Work B" "Artist Work C"
```

At least 3 **different works** (the doc 15 standard). The script pulls public-domain images from Wikimedia Commons, stores them locally, extracts a main palette, and produces a contact sheet. Then **actually look at that contact sheet** and write down:

- 5 signature features, each classified as "must have / bonus / forbidden." Example: Ma Yuan (马远)—must have: one-corner composition, large areas of negative space, axe-cut texture strokes; bonus: weeping willows, a tiny figure looking into the void; forbidden: full-frame fill, bright saturated color.
- Main palette (use the color values extracted by the script; state what the lights lean toward and what the darks lean toward).
- How this kind of painting is actually made in the real world (brushing, carving, tracing, coating, pasting). That physical process is the renderer's specification.

### 2. Recompose the subject according to the style's own logic

Do not copy the figures and coordinates of famous works, but learn **how they organize the picture**: Ma Yuan's negative space plus one corner; the miniature's ground tipped upright to fill the frame, its architecture cut open; Gauguin's cropped foreground and diagonal divisions; Giotto's gazes locking figures together; Impressionism's sky taking half the frame and water dragging the bank into broken strokes. Write one sentence stating "this style's composition rule," then use it to lay out the new subject. **The same subject must not be used for a second style.**

### 3. Draw "clean shapes," then pass them through the "medium channel"

It is forbidden to call flat vectors plus noise a style. A scene has two layers:

- Shape layer: draw objects, people, and space cleanly (can be Canvas paths, an offscreen canvas).
- Material layer: use `lib/medium.js` or the older library to run the shape layer through real art materials.

| Channel | What it does | Used for |
|---|---|---|
| `MEDIUM.broken(src, o)` | Repaints as individual curved strokes, warm in the lights and cool in the darks | Impressionism (Sisley, Pissarro, Guardi, Renoir) |
| `MEDIUM.fresco(c, plate, o)` + `MEDIUM.plaster` | Pigment bitten into the lime plus plaster grain, pinholes, seams | Fresco (Giotto, Piero, Raphael) |
| `MEDIUM.silk` + `P.brush` / `P.inkWash` | Silk texture, flying white, ink in five tones | Ink wash (Ma Yuan) |
| `MEDIUM.flat(c, path, fill, o)` | Cloisonné enamel: short strokes following the brush direction inside a single color area plus a thick, uneven dark outline | Gauguin, Synthetism, stained glass |
| `MEDIUM.figure(c, o)` | Volumetric clothed figures: robes, cloaks, folds, gaze | Fresco, miniature painting, flat narrative work |
| `MEDIUM.outline / hatchFill` | Varying-width lines, hatching | Woodcut, copperplate, shadows in miniature painting |

When the library has no matching channel, write a channel function into `medium.js`; do not hard-code it inside a single scene.

### 4. One frame first, side-by-side comparison

Produce a still first; do not start with animation.

```sh
uv run --with playwright python <project>/render.py --film style_studies --solo <id> --stills 3 --no-counter --out renders/<id>
uv run <skill>/scripts/analyze/side_by_side.py --ref reference/<style> --frame renders/<id>/t003.00.png --out compare/<id>.jpg
```

The question "is this a painting you recognize at a glance?" can only be answered while holding this side-by-side image.

### 5. Make the painting live: use the style's own motion logic

One main action plus 2 motif loops (doc 08 item 3). The style's own way of moving: ink follows the wind, brushstrokes breathe, the water surface tears reflections apart, frescoes barely move but gazes and handoffs move. Do not use the same fade in/out for every style.

### 6. Score, threshold 80, at most two rounds

| Item | Score | How to judge |
|---|---|---|
| Signature hits | 35 | Check off each "must have" from step 1; deduct 7 for each missing one |
| Material credibility | 20 | View at 1:1 zoom: real art material or vectors plus noise? |
| Composition and narrative | 15 | Does it use this style's own way of organizing, and is the event clear at a glance? |
| Figure and object construction | 15 | Is there weight and relationship? If it looks childish or like a sticker at a glance, it scores below 8 |
| Motion | 10 | Alive without flicker; motion serves the event |
| Technical | 5 | qa determinism, framing, runtime |

**Two automatic vetoes**: signature hits below 25; a figure or main subject that looks childish at a glance (doodle-like). AI judges only factual items; taste items (whether the composition looks good) are left to Huashu (the author). Self-scores are only for ranking and must not be written as "passed." If it is still below 80 after two rounds, record its status as a research recipe, put the sticking points in the card's "still improvable," and do not register it as implemented.

**Self-scores run high.** The 2026-10-16 batch's self-scores averaged about 10 points above independent review (at most 17). Therefore: the score table must include item scores and the signature checklist; the independent review score goes beside the self-score, and the lower one governs; if any automatic-veto item appears in the progress table's "current weakness" column, the status must not say "complete."

## Rules for people (the most fragile part of newly added styles)

This section and the narrow-bridge people rules in SKILL.md are **merged into one rule**; this is authoritative:

- **General styles**: real people / the person themselves / anthropomorphic characters go through AI frame generation plus matting (methods B/C); code only handles placement, frame swapping, and material. Without image-generation capability, show only hands and back.
- **Narrow exception (explicitly chosen flat narrative work, where code may draw people)**: 37 Rick & Morty, 52 South Park-style cutout, and the fresco / miniature / Synthetism demos remade on 2026-10-16 (38 Giotto, 48 Gauguin, 51 Persian miniature). These three are **research-level demos, not character solutions for a delivered film**: when a delivered film needs a protagonist the audience must identify with, still use B/C.
- People in the exception must also have weight and gaze: pupils toward the other person, hands reaching for objects, clothing folds following force. A doodle-style round head with a pill-shaped body does not pass.
- Do not enlarge a character you cannot do well: shrink it to a distant view, turn it into a back view, or let the foreground character be cropped by the frame.
- Do not borrow the costume color combination of a named character (52 changed its teal hat with a light pom-pom for this reason); also do not copy the original's title-sequence composition wholesale.

## Known pitfalls

- **Originals pulled back must be checked against the contact sheet**: searches mix in maps, modern photographs, and framed reproductions shot on museum walls (42 Guardi's third image is a modern church photo, 47's third is a framed reproduction, and 50's first and third are the original and a color-graded version of the same *Mountain Path in Spring*). `fetch_reference.py` only does approximate deduplication and samples color from the central 80%; it cannot tell "is this by this painter?" or "are these three different works?"—those two things need human eyes. Before writing a work title into the scene header comment, confirm it against the contact sheet.

- Draw the "shape layer" first, then repaint; **the repaint canvas must be drawn in local coordinates** (e.g., a boat). Do not repaint the whole screen every frame or it will be slow. For small motions such as a boat or a person: draw to a small canvas → `MEDIUM.broken` → paste back.
- In the nine-argument form of `drawImage`, if `sx+sw` exceeds the source image width, the excess is blank; for sky drift use `sx = t*speed` and make the source image wider than the stage (47's sky is 2600 wide).
- Small missing dots at the edges had two sources, both fixed: `M.broken`'s base image now expands outward by 14px before blurring; when shifting the water surface row by row, widen the destination width (`dx-24, W+48`), otherwise the shifted ends expose the base color underneath.
- Ma Yuan-style ink wash: hanging branches must cluster, curve, and vary in length; evenly spaced vertical lines read as a fence. People always use "back view + one stroke of clothing fold + reserved silk," never filled in.
- Gauguin-style: shapes are always round, never polylines; polyline figures read as memes.

## This round's (2026-10-16) progress and self-scores

See the status column in `references/style-recipes/INDEX.md` and `style-recipes/_redo-progress.md`. Self-scores are for ranking, not acceptance conclusions.
