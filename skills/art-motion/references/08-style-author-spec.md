# 08 · Style author spec (general edition, for whoever writes scenes and for dispatched agents)

> Replaces the early `era-author-spec.md` that was hard-wired to the recreation project. When you dispatch an agent to draw a style, give it this page's path plus the specifics from the "this project" section.

## Interface

One style segment = `scenes/<id>.js`:

```js
SCENES['<id>'] = { draw(c, lt, t) { /* fill 1920×1080 */ }, init(IMG) { /* optional: one-time precompute */ } };
```

- `c` the target 2D context; `lt` this segment's local time (seconds, counted from the start of that segment's transition); `t` film-wide time.
- Segment table `eras.js`: `{ id, eighths or dur, transition: { type, dur }, counter: {...} }`. Film length is computed automatically from the segment table.
- Transitions `transitions.js`: `TRANSITIONS.<name> = (c, A_old, B_new, p, o) => {}`.
- A scene with a missing file, a syntax error, or no registration → the engine refuses to start, and render/qa error out immediately. Don't judge success by "it looks like it rendered".

## Read first (in order)

1. `references/02-mechanics.md` (the five layers of mechanics — only for speedrun/time-travel films), `04-code-drawing.md` (pipeline, renderer quick reference, pitfalls), `07-proven-practices.md`.
2. `references/style-recipes/INDEX.md`: find the closest style as a starting point, then read that card.
3. The benchmark implementation `scripts/engine/scenes/09_postimp.js`; the scene source closest to your style.
4. `lib/`: `paint.js` (noise/texture/renderers/palettes/choreography), `rig.js` (character rig, visibleLines), `kit.js` and other utility libraries. **Check the library first, then write your own.**

## Two starting points

**With a reference film**: first run `scripts/analyze/breakdown.py` to get reference frames (`ref/segNN.png`), a motion heatmap, and a transition contact sheet, then break it down per doc 01. Reference frames decide composition, motifs, and palette; the heatmap decides "what moves inside the picture".

**Without a reference film** (the more common case):
First read [cross-scene style distillation](15-cross-scene-style-distillation.md). While a new card is in research state, keep the survey of works, the production hypotheses, and the implementation evidence separate; rebuild the scene for the new subject, and don't inherit characters/props/layout from the famous work.
1. Write down the 3–5 most identifiable formal elements of the style (material, brushwork, palette, motif, traces of the medium). Check primary sources (images of the original works, art-history descriptions); when building a card for the first time, look at several different works, record the stable features and the exceptions, and don't summarize an artist's whole output from one famous painting.
2. Give every element a "way it can move" — how it would naturally move inside that painting's world (water shimmers, paper drifts, gold glints, printing plates misregister, film flickers).
3. Work out how this kind of picture was actually made (brushed, carved, printed, pasted, inlaid, sprayed, rendered), and write that physical process as a renderer.
4. Produce one frame first: look at the still in a side-by-side comparison against the original, and only set it in motion once it is recognizable at a glance.

## Hard requirements

1. **Composition**: speedrun/time-travel films use the composition coordinates this project specifies (identical across segments — both the transitions and "the same character travelling through" depend on them). Other subjects compose for the subject: the style decides how to frame and how to light, so don't reuse the demo room's coordinates.
2. **Characters**: speedrun/time-travel films use the `RIG` rig and the shared choreography — change the drawing method, not the blocking or the action; other subjects design characters and blocking for the subject (for humans, use AI-generated frames, see doc 10). **Characters must also go through that style's material treatment** (brushstrokes, grain, paper-texture multiply, ink-bleed edges, halftone dots, color-plate misregistration…), otherwise they look like pasted-on clip art — the most common weakness across all 36 styles. When you need line art, use `drawGirl/drawCat` with `mode:'line'` (it goes through visibleLines internally, so it won't draw through).
3. **The picture must live**: a main action plus 2–4 small motif loops, visible inside the hold window. In speedrun/time-travel films, character motion runs on film-wide time (`PAINT.cupCycle(t)` and the like) and does not reset when segments change.
4. **Smoothness**: don't re-roll seeds across the whole screen at a low frame rate (it reads as flicker); apply boiling only to line art or motif areas. Intentionally "stepped frame rates" (rubber hose 12fps, shadow puppet 10fps) go through `stepTime` — that's style, not stutter. For scrolling patterns, the modulo period equals the pattern's real period.
5. **Determinism**: all randomness goes through a seed; the same t rendered twice is pixel-identical.
6. **Performance**: static parts use `PAINT.cached`; offscreens that read pixels use `willReadFrequently` and `g.reset()` every frame; target ≤150ms per frame (qa measures real time including the GPU flush).
7. **Text**: type inside the style should preferably be drawn as paths in that style's material; when using a font, first verify the glyphs exist with `U.assertGlyphs` (missing glyphs silently fall back to a system font).
8. **Aging stays off the body**: flaking, stains, and scratches only on the background; set protection zones over character areas (Dunhuang flaking landing on a back reads as "a hole in the clothes").

## Self-check and delivery

```sh
uv run --with playwright python <project>/render.py --solo <id> --stills 0.4,0.6,0.8,1.0 --out <renders>/<id>   # stills
uv run <skill>/scripts/qa.py --project <project> --ids <id>                                                      # numbers
```

At least 3 rounds per segment: look at stills against the original/reference comparison → run qa to check motion/static frame pairs/jumps/duration/determinism → fix. Four questions: ① Can you tell at a glance which style it is? ② Are the characters right, and do they blend with the background? ③ Inside the hold window, can you see the picture moving — and is it free of flicker and stutter? ④ Are there goofs (occlusion, broken lines, misregistration, blank areas, overlapping text)?

Delivery: `scenes/<id>.js` plus a recipe card (in the `style-recipes/` format: pipeline, key parameters and color values, how the motif animations are done, signature transition, performance, pitfalls, still improvable); write parameters, performance, and quality conclusions only from actual measurement; leave the parts you didn't do in research state. Verifying one scene is not a claim of cross-scene validation. **Before delivering a multi-segment film, dispatch an agent that took no part in production to review the finished film alone.**

## The three-direction gate when nobody is around

With Huashu (the author) present: render three options for a new style direction or character interpretation on the same frame first, for him to choose.
Nobody to ask (automated tests, overnight batches): execute the direction the task brief specifies, and in the delivery notes list the "other two directions you could have offered", one line each, for him to choose when he's back.
