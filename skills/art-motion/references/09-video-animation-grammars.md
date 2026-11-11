# 09 · Video animation grammars: 8 ways to draw YouTube explainer / tech / AI / finance videos

Read this when making the "animation segments" of a VO explainer film. It is the master index of the 8 grammar cards (`references/animation-grammars/`), the selection table, the cross-grammar rules, the library quick reference, and the clip contract for the VO pipeline.

All 8 grammars have a directly renderable demo film (`scripts/engine/demos/<grammar>/`, pixel-identical to the experimental originals when brought in; after the 2026-10-05 fix to `TY.charsIn` opacity, the y1 demo title fades out over 0.55s as intended, and the frames in that 0.55s differ from the original) and a parametric clip (`scripts/engine/clips/<grammar>.js`, where you feed it one JSON and it outputs a video of exact duration).

---

## 1 · Overview

| Grammar | Use case | One-line core grammar | Typical shot length | Primary easing | Primary transition | Card | Demo |
|---|---|---|---|---|---|---|---|
| **y1 Kurzgesagt flat explainer** | Explaining scale, explaining "what's inside", explaining mechanism systems; a gently narrated science voice | Draw an abstract concept as one concrete object, put it in a glowing world that can scale indefinitely, and let the camera travel between scales; the environment moves gently, the subject changes on VO beats | Hard-cut shots 7–9s, the visual unit changes every 4.6–6.7s | `MO.k75` = bezier(.75,0,.25,1); loops `MO.easyEase` | Dive-in shot `lensReveal`, fill then pull out `matchCut` (logarithmic camera push/pull) | `animation-grammars/y1_kurzgesagt.md` | `--film demos/y1_kurzgesagt` |
| **y2 Vox collage** | Arguments with real archives, news, screenshots, people; "look at this line", "notice this number" | The argument is laid out on a desk of real material; the camera moves across that desk like an investigative reporter's eye, and lines and pen strokes are drawn on in staccato steps | Slow tier median 3.3s (one card 3–7s); fast tier 1.4–1.8s | Camera `MO.sineInOut` / long tail `MO.longTail`; elements step at 12fps | Hard cut, pan along the red line `same`, push all the way into a photo → hard cut `cut` | `animation-grammars/y2_vox.md` | `--film demos/y2_vox` |
| **y3 whiteboard hand-drawn (RSA)** | Reasoning chains, steps, "why"; deriving while talking | One line written per sentence, the camera follows the argument across a large whiteboard, and finally pulls back to show the whole board | Median 6.6s per block | Pan across the board `MO.sineInOut` 1.2–2.4s; long jump 0.8s whip pan + motion blur | Same board `same` (the camera move is the transition), pull back to close | `animation-grammars/y3_whiteboard.md` | `--film demos/y3_whiteboard` |
| **y4 storytime stick character** | First-person experiences, disasters, punchlines; the audience wants "this person" | The VO is the lead and the picture is the reaction image that goes with it: poses fast-cut in 0.1s and then hold, and the punchline comes from cutting to a reaction close-up and going silent on that beat | ASL 2.43s (median 1.87s) | Pose change `MO.expoOut` 0.1s + `MO.settle` squash-and-settle; character 24fps | Hard cut `cut`, smash cut `smash`, whip `whip`, jump closer | `animation-grammars/y4_storytime.md` | `--film demos/y4_storytime` |
| **y5 kinetic type** | Lists, "X stages", quote lines, number opens, chapter cards | Type is the actor: keywords slam in on the stressed beat, the main word is big enough to read at a glance, and there is always only one focal point | One shot per bar (about 2s at 120BPM) | `MO.expoOut` entrance, `MO.springHz` slam, exit `MO.expoIn` faster | Rush into a color block `fillZoom`, color bands `bands`, page push `push` | `animation-grammars/y5_kinetic_type.md` | `--film demos/y5_kinetic_type` |
| **t1 3Blue1Brown** | Explaining how one mechanism turns into another step by step: networks, matrices, gradients, probability | On a black background put only the one thing being discussed; use Transform to turn the previous concept straight into the next; color = concept name; almost no cuts | One animation 1–3s + 1s hold; one concept 8–20s | `MO.smooth` (6t⁵−15t⁴+10t³), used for almost everything | Transform continuation (no cut), camera pass-through `zoomThrough`, `fadeShift` | `animation-grammars/t1_3b1b.md` | `--film demos/t1_3b1b` |
| **t2 keynote UI** | Product/feature launches, version updates, tutorial steps, spec announcements | One thing per screen; the product screenshot or object is the lead and gets pushed in on; nouns and numbers land when the VO says them; light-blob backdrops and glass cards are optional packaging, use sparingly | Talk one screen 5–8s; product fast cuts 1.5–3s | `MO.spring` bounce 0–0.15, `MO.appleOut` | Blur push `blurPush`, card expand `expandRect` | `animation-grammars/t2_keynote_ui.md` | `--film demos/t2_keynote_ui` |
| **t3 finance chart** | Revenue, share price, share of market, inflection points; numbers the audience will screenshot and check | Build the axes first, then let the data grow, then annotate only one thing; the numbers are always honest, the animation only decides how they appear | One chart 2.5–6s | `MO.quintOut`, line `MO.smooth` | Panel pan `slidePush`, push into a region `zoomThrough` (live + bScale0), hard cut with the layout fixed | `animation-grammars/t3_finance_chart.md` | `--film demos/t3_finance_chart` |

Overview images: `assets/animation-grammars/<grammar>_overview.jpg` (one frame per shot).

Demo commands (run in `scripts/`):

```sh
uv run --with playwright python engine/render.py --film demos/y1_kurzgesagt --out y1.mp4            # Render the demo film
uv run scripts/qa.py --project scripts/engine --film demos/y1_kurzgesagt --out <dir>               # Acceptance (run from the skill root)
# Preview: start a local server and open scripts/engine/index.html?film=demos/y1_kurzgesagt, then drag the timeline
```

The demo films are all compressed to about 8 seconds — 2.5–3× the density of a real film — only so the whole grammar can be seen in a demo. When actually using them, slow down to the shot lengths in the table above.

---

## 2 · How to choose a grammar for a stretch of VO

First look at what this stretch of VO is doing, then pick the drawing method. A film can switch grammars between segments, but never mix them within one segment.

| This stretch of VO is… | Choose | Don't choose | Why |
|---|---|---|---|
| Explaining a concept, a mechanism ("how a neural network…") | **t1 3b1b** (you need derivation and formulas) or **y1 Kurzgesagt** (you need scale, you need charm) | y2 (nothing real to paste up, it becomes a fake archive) | Mechanisms are clearest through morphing and scale |
| News, events, history, with screenshots and quotes | **y2 Vox** | y1 (flat cartoon dilutes credibility) | The audience wants to see the source for themselves |
| Your own experience, disasters, punchlines | **y4 storytime** | t2 (it carries good-news energy by default) | The punchline lives in the pause of the reaction shot |
| A list, a few key points, a few stages, one quote line | **y5 kinetic type** | t1 (nothing to morph) | The information is structure, not picture |
| A product, tutorial steps, features, specs | **t2 keynote UI** (full-frame screenshot pushed in on; glass card optional) | t1 (glass and light blobs don't carry logic, and the reverse is just as true) | One thing per screen; nouns and numbers are the leads |
| Numbers, growth, trends, comparisons | **t3 finance chart** | t2's big number (only use it when there is a single number) | You need axes and units, and it has to stand up to checking |
| Deriving while talking, arguing step by step | **y3 whiteboard** | A single full-screen switch | One line written per sentence; the final pull-back is the landing |

Two fallbacks:
- Real screenshots to show → t2 (tutorial, clean) or y2 (argument, evidential). The screenshot is the main image, as full-frame as possible, always scaled proportionally, never cropping key UI.
- Only one number in the segment → don't draw a chart; use t2/y5's big-number count-up and land it on the moment the VO says the value.

---

## 3 · Cross-grammar rules

Rules distilled from the 8 cards that hold no matter which grammar you switch to. The source is given after each one.

1. **The camera is a function of time only; the scene is redrawn from the camera vector.** Push, pull, pan, and pass-through are all the same world canvas redrawn under a different camera, so a 60× zoom stays sharp, and during a transition the previous shot keeps advancing its camera by time (`live:true` in `zoomThrough`). (y1 ⑥ "key architecture"; y3 ⑥; t1 ④-2)
2. **Zoom with logarithmic interpolation, and crossing a circular opening needs enough magnification.** `CAM.zlerp` magnifies by the same factor every frame, while linear interpolation is slow at first then violent; to pass into an opening of radius r the factor must be ≥ the distance from the opening center to the farthest screen corner / r (about 1100/r when centered, `CAM.coverZoom`). (y1 ⑧-2; t1 ④-2)
3. **Align the reveal frame to the beat or the VO word.** A transition is counted from the new segment's start, so the frame where the new picture is revealed must land on the bar line: segment start = bar line − reveal point × transition duration (`MO.onBeat`). A number must land when the VO says the value: count start = the moment the number is spoken − count duration. Whiteboard writing starts about 0.5s after the matching phrase. (y5 ④ "alignment techniques"; t2 ⑤; t3 ⑤; y3 ⑤)
4. **Structure first, then data, then annotation.** The axes come out first, the data grows after, the annotation comes last, and one shot annotates only one thing; 3b1b Writes the problem first and then demonstrates; keynote goes eyebrow → product name → subtitle. (t3 ③; t1 ⑤; t2 ③)
5. **One focal point per screen.** Only one thing enters at any moment, everything else is still; main word to supporting line at least 3:1; the background sits one notch lower than the lead in saturation, contrast, and line weight. (y5 ⑧-1; t2 ⑤; y4 ⑧-2)
6. **Slow in, fast out, and hold after it lands.** Entrance 0.3–0.4s, exit about 0.18s; after a number lands hold at least 0.5s, after a punchline hold ≥0.9s, and 3b1b waits about 1s after each animation. (y5 ⑤; t3 ⑧-3; y4 ⑤; t1 ⑤)
7. **Move on events, and let the camera come and go.** The camera moves only when the audience's eye needs to go somewhere new: transitions use slow push, pan, and pull back (0.6–1.5s, ease in and out, measured from Vox and 3b1b); fast push (18–32% closer in 0.28s) and slam (0.17s, 1.55→0.94→1.0) are only for reveals, reversals, and key numbers; after pushing in you must pull out or pan away, never three pushes in a row. The same move on every shot is a PowerPoint, whether it's a constant-rate slow push (the Nobel literature film r2, "it feels exactly like playing a PPT") or a quick push on every shot (the Nobel economics short: about 48 pushes in 102 seconds, "too many, and the pace is too fast, not smooth at all"). Numbers and big type slam onto objects inside the film's world (a screen, a battery bar, a price tag, a blackboard); never stand up a plain-color background text card — in blind review such cards read the same as a white-background chart insert, "a PPT slide dropped in". The engine has these ready: `CAM.track` (the camera move table; no move written means slow push), `MO.slam` (element slam), with the duration constants in `MO.PULSE`; the highlight in parametric clips t2, y1, y2 defaults to slow push, and only `"camera": "snap"` in the spec's top-level `data` makes it a fast push; there is no built-in constant-rate slow push or breathing. The environment layer (Kurzgesagt's star twinkles, particles) may keep moving gently forever; storytime is completely still in seven frames out of ten, and its life is in fast cuts + holds. Art History Speedrun is a different matter — the picture must stay alive (see doc 04). For the move table, each grammar's camera baseline, and when to mind the count, see `camera-language.md`. (y1 ③, ⑧-1; y4 ⑧-1; t2 ③)
8. **Two frame rates: the camera is smooth, elements step.** In Vox the camera is smooth while paper scraps, highlighter, and typing run at 12fps on twos; in storytime the character is 24fps and the camera 60fps. All-silky looks like a corporate promo, all-stepped looks jittery. (y2 ③, ⑧-1; y4 ③)
9. **Color = concept, and use few accent colors.** One color tells one concept (W in a formula and its connecting lines are the same blue); past 3–4 semantic colors nobody remembers them; Vox is black, paper white, and one red; whiteboard is black plus one orange. (t1 ⑧-3; t3 ⑧-2; y2 ⑧-3; y3 ⑧-3)
10. **Put transitions at breaths and topic changes, not mid-sentence.** A whip cuts between two sentences, a reaction shot sits inside a silence; a whiteboard pan lands on a new argument; a Vox hard cut lands on punctuation. (y4 ⑤; y3 ⑤; y2 ④)
11. **Review checks logic and how numbers are framed, not just whether it looks good.** Caught in practice: "up 8.7×" should be "up to 8.7× the original"; the count restarted from 0 after expanding to full screen; the narration talked about hidden layers while the line connected to pixels; a multiplier must be computable from the numbers on the chart. (t3 revision table; t2 revision table; t1 ⑥)
12. **Real material is the main image, kept as it is.** When there's a screenshot, photo, footage, or original text, let it be full-frame or close to it, pushed in on the part you're discussing; code only explains, annotates, and moves the camera (`MD.cover` full-frame + focus + push-in, `MD.print` photo print, `MD.label` black torn-edge label; the screenshot card in parametric clip t2 and the photos in y2 already default to full-frame or 80–90% of the frame); scale screenshots proportionally and never crop key UI; data may change only "how it appears", never "what it is"; bars always start at 0, and when an axis doesn't start at 0, say so; fictional data must carry an "illustrative data" badge on every shot, and real data must never show that badge. (t3 ②, ⑧-1; clip contract)

---

## 4 · Library quick reference (`scripts/engine/lib/`, already loaded by both index.html and clip.html)

| File | Namespace | What's in it |
|---|---|---|
| `motion.js` | `MO` | Camera-move durations `PULSE` (transitions push/glide/pull, accents punch/pan/slam) / `slamK/slam` (slam 1.55→0.94→1.0) / `pulse` (move progress), `seg/at/anim/step` (12fps stepping), manim `smooth/thereAndBack/rushInto/rushFrom/doubleSmooth/wiggle/lagged`, `sineInOut/cubic*/quart/quint/expo*/backOut/elasticOut`, `bezier` plus `appleOut/emphasized/k75/easyEase/longTail`, SwiftUI `spring/smoothSpring/snappy/bouncy`, `springHz/settle`, `float`, `invert` (easing reverse lookup), `beat/onBeat` (bar alignment). Canvas size `U.setStage/onStage` lives in `util.js` |
| `camera.js` | `CAM` | `apply/with`, `toScreen/toWorld`, `zlerp` (logarithmic zoom), `coverZoom`, `anchor`, `pushTo` (push toward a point, moving that point smoothly to center or zooming in place), `at` (keyframes, pan along a path), **`track` (the camera move table: `push` slow push (default) / `pull` pull back / `glide` find the next thing / `to` go to a given camera / `punch` fast push / `pan` fast pan / `slam` whole-frame slam / `shake` camera shake / `cut` hard cut; the camera is computed from t alone)**, `layer` (parallax), `velocity/motionBlur` (whip blur), `drift` (handheld micro-drift, only for art styles and pure-atmosphere shots) |
| `diagram.js` | `DG` | Point lists `cum/len/pointAt/drawPartial` (stroke-by-stroke drawing) / `xform/arcPts/ellipsePts/hand` (hand-drawn jitter) / `revealMask/zigzag` (Reveal), Transform `rectPts/circlePts/morph/shape`, color `mix/mixA/rgba`, the 3b1b palette `MANIM` (already ×1.5 saturation) / `saturate`, `math/write` (manim Write, stroke first then fill), `neuron/edgeEnds/edge/flash`, `indicate/circumscribe/brace`, whiteboard `board` (stroke timeline + slide between pen positions), `pen` (marker) |
| `typo.js` | `TY` | `text/width/font`, `wrap/fit` (line breaking; `fit` shrinks the type size until it truly fits: line count ≤ maxLines and every line width measured, so even a single long English word stays in frame; with `soft:true` it returns `ok:false` instead of overflowing so you can change the plan, and `balance:true` breaks multiple lines to equal length), `charsIn` (character-by-character float-up), `rise` (mask rise), `pop`, `blurIn` (emerge from blur), `typed/typedCount` (typing), `marker/underline`, `slam` (main-word slam), `keyword/keywordMarker` (keyword emphasis), `fmt/count/tabular` (number roll and tabular figures) |
| `chart.js` | `CH` | `lin/ticks`, `grid/xLabels` (axes first), `bars` (grow from 0 + synchronized count + highlight dims the rest), `line/yAt`, `candles`, `callout` (dot → leader line → text), `tag/demoBadge/frame` (The Economist layout) |
| `ui.js` | `UI` | `mesh` (light-blob backdrop), `grainTex`, `backdrop`, `shadow`, `glass` (frosted-glass card), `sheen` (light sweep), `persp` (fake 3D), `icon`, `rr/rrPath/scratch` |
| `collage.js` | `CL` | `paperTile/fillPaper` (paper texture), `tornEdge/tornRect` (torn edge), `halftone/photo` (halftone photo), `placed/shadowed/slideIn` (slide in tilted and settle flat), `tape/pin`, `stringPts/string` (red string), `highlight` (feathered highlighter), `stickerEdge` (cut-paper white edge) |
| `media.js` | `MD` | Real material as the subject: `cover` (fill the frame, with focus `fx/fy`, push-in `z`, crop `crop`, and `fit:'contain'` to keep the whole image uncropped), `toScreen` (points/boxes on the material → screen coordinates), `focusFor/zoomFor` (how many times to zoom to reach a given region), `print` (photo print / Polaroid: white border, aged paper tone, drop shadow, tape), `label` (black torn-edge label, typing at 12fps), `frameAt` (pick a frame from a frame sequence), `size`. Missing material always errors out; it never draws a blank frame |
| `toon.js` | `TOON` | `flat` (two-tone faceting), `glow/vgrad/circle/ellipse`, `bean` (the bean character, only for demo films and white-model previews, never in a finished film; parametric clip y4 no longer calls it) with `LOOKS/look`, `POSES`, `poseAt` (pose-to-pose + settle), `blinkAt`, `alive`, `env/mouth` (lip sync reads the envelope), `sweat/mark` |

The transitions are at the end of `transitions.js`, in the section "Transitions for the YouTube explainer grammars": `same / lensReveal / matchCut / whip / smash / fillZoom / bands / push / zoomThrough / blurPush / expandRect / slidePush / fadeShift`, each with a one-line description and its parameters. Hard cuts use the existing `cut`.

Small engine-related changes: a vertical full film via `render.py --film <name> --width 1080 --height 1920` (or write `window.FILM_SIZE = [1080, 1920]` in eras.js); the engine, transitions, camera, and libraries all compute against the current canvas, while the 35 art-style scenes were still only drawn for landscape; a segment's `clip` (video frame sequence) fills the frame proportionally by default, and writing `clipDraw(c, frame, lt, t)` lays it out yourself (push-in, focus, photo print), with missing frames or images erroring out and refusing to render; a segment may write `dur` (seconds) instead of `eighths`; `window.BPM` changes the beat; an explainer film writes `window.PUNCH = 0` to turn off beat punch (or writes `punch` on a single transition); `window.SCENE_LIBS / SCENE_DIR` let a film keep its code in its own directory (that's how demos is organized).

**Old names from the experiments → current names** (for reference when reading archived experiment code): `YT.camAt→CAM.at`, `YT.camForAnchor→CAM.anchor`, `YT.apply/camera→CAM.apply/with` (camera fields `zoom/rot` became `z/r`), `YT.ease.*→MO.*`, `YT.spring(t,f,d)→MO.springHz`, `YT.textIn→TY.charsIn`, `YT.type→TY.typed`, `YT.partial→DG.drawPartial`, `YT.at→DG.pointAt`, `YT.circlePts→DG.ellipsePts`, `YT.paperTile/halftone/tornEdge→CL.*`, `YT.bean/POSES/mouth→TOON.*`, `MN.*→DG.*` (`lerpPts→morph`, `C→MANIM`, `FONT_RM→FONT.rm`), `GL.*→UI.*`, `MO.textIn→TY.blurIn`, `MO.count/fmt/tabular→TY.*`, `easeOutQuint/easeOutExpo→quintOut/expoOut`, transitions `k_lens→lensReveal`, `k_fill→matchCut`, `hardcut→cut`, y5's `zoomThrough→fillZoom` (it collided with 3b1b's camera pass-through).

Fonts: Chinese sans-serif uses `PuHui-Medium/Bold/Heavy/Black` throughout (the open-source build is actually Noto Sans SC 500/700/800/900, keeping the family names; see `lib/fonts.js`), whiteboard uses `LXGWWenKai-500`, and both are subsets covering all 6763 GB2312 Han characters, so changing the topic normally needs no extra glyphs. Formulas use `CMU-rm/it`, keynote uses `Inter`, finance numbers use `RobotoCondensed`. Noto Sans/Serif SC (`NotoSansSC/NotoSerifSC`) contains only the characters used by three demo films — don't use it for new content.

---

## 5 · Clip contract (the "animation segment" for the VO pipeline)

A VO video pipeline (whichever one you use) calls these 8 grammars at the right segments to make animation segments, with the pipeline acting as director, choosing the grammar and computing cues from word-level VO timestamps. This section is the agreement between the two sides.

### Entry point

**In the VO pipeline, wrap a script around these — don't type the commands below by hand**: draft reads the duration off the finished film's timeline and emits a word list and a spec draft → render parses the words, calls this section's render.py, counts frames, swaps the result into the edit project, and freezes it → verify checks sync frame by frame against the chapters. That's how the author's own pipeline hooks up (that part is not open-sourced with this repo). Below is the engine's own interface.

```sh
cd <skill>/scripts
uv run --with playwright python engine/render.py --spec clip.json --out clip.mp4            # Silent H.264 yuv420p
uv run --with playwright python engine/render.py --spec clip.json --alpha --out clip.mov    # ProRes 4444 with alpha (no background drawn, for the pipeline to composite)
uv run --with playwright python engine/render.py --spec clip.json --stills 0.5,2,4 --out stills/   # Extract frames to check
# Preview: start a local server and open scripts/engine/clip.html?spec=examples/t3_finance_chart.json, then drag the timeline
```

- Duration is strictly `duration`: frame count = round(duration × fps), and the time of frame i is i / fps. H.264 gets one keyframe per second (GOP = fps), so the pipeline's renderer can seek by the second without freezing a frame.
- **A single clip should not run past 8 seconds.** When `duration` exceeds 8 seconds, render.py prints a prominent warning at the start and at the end, without failing (long clips are legitimate in the VO pipeline). A clip that runs too long reads as one PowerPoint slide: one layout to the end, bullet points piling up, the background dead from start to finish. Split a film into multiple shots, one spec (or one set of scenes) per shot, changing composition between shots but not the art style (same theme, at most 2 grammars), then concatenate (SKILL.md rail tier steps 3–4, `references/storyboard-template.md`). Some sample specs run 8.5–10s; that's a demonstration of how to write one segment, not the length of a film.
- **One color set for the whole film: `theme`.** Every spec in a film writes the same `"theme"`: a palette name `paper`, `poster`, `ink`, `navy`, `bauhaus`, `snow`, `wood`, `chalk` (values in `references/palettes.md`), or an object `{"name": "wood", "accent": "#B8452A"}` to change just one or two keys, or a full 6-key `{bg, surface, ink, sub, accent, accent2}`. A misspelled name, an object missing keys (and without a name), or a value that isn't #hex → startup failure. A grammar that has a theme written doesn't draw large gradient backdrops or neon glow, and all secondary colors derive from these 6. With no theme, each grammar uses its own default (y1 now defaults to deep-ink flat fill, no longer the dark purple starfield). t3 additionally accepts the old `"light"`, `"dark"`, and its own theme object; `"paper"` now means the paper palette.
- Width, height, and fps are read from the spec and default to 1920×1080@30; for vertical write `width: 1080, height: 1920` (or override the spec on the command line with `--width 1080 --height 1920`); every grammar has a vertical layout.
- Material paths in a spec are relative to the spec file (absolute paths also work); render.py only serves the files named in the spec. It recognizes these fields: `cues[].image`, `cues[].frames` (video frame sequence: a directory or an array of paths), `data.image`, `data.character` (y4 frame lib directory). For how paths resolve, see `engine/spec_assets.py`.
- Measure the segment: `uv run qa.py --spec <clip.json>` (in `scripts/`; measures the whole clip as one segment for determinism, motion, still-frame pairs, isolated jumps, and time cost, scaled to the frame for vertical; monotonic smooth pushes, pans, and slams under 2 seconds count as camera events, not jumps).
- Delivery: `uv run deliver.py clip.mp4 --spec <clip.json> --out output/`. It must first pass the `film_gate.py` gate (fast-motion frame ratio < 0.035 is a red light; an empty picture lasting a continuous 0.3 seconds or more in the middle is a red light, and even very short clips are blocked; no copy, non-zero exit), and only then copies and writes `delivery-notes.md`, whose facts section the script writes. The gate is calibrated on 1–2 minute finished films, and clips under 10 seconds have noisy numbers; if the clip is to be assembled into a finished film, run deliver.py on the finished film.
- A page error (grammar file broken, image or video frame missing) → non-zero exit, no film. `qa.py --spec` and render.py use the same asset resolution (`engine/spec_assets.py`) and accept both `frames` and a character frame lib. A Han character in the spec that the font subset lacks only warns (it falls back to a system font and will look different on another machine); common characters are all in the subset.

### spec

```json
{
  "grammar": "t3_finance_chart",          // 1 of 8: t1_3b1b | t2_keynote_ui | t3_finance_chart | y1_kurzgesagt | y2_vox | y3_whiteboard | y4_storytime | y5_kinetic_type
  "duration": 7, "fps": 30, "width": 1920, "height": 1080,
  "safe": { "top": 0, "bottom": 520 },     // Optional: edges to leave clear (px), see below
  "alpha": false,                          // Optional: true = no background drawn (render.py --alpha sets it automatically)
  "theme": "wood",                         // Every spec in a film writes the same one: palette name or object, see "one color set for the whole film" above
  "data": { ... },                        // Grammar-level parameters; the fields each grammar accepts are on its "data" line below; unrecognized fields are ignored
  "cues": [ { "at": 1.2, "kind": "bar", "text": "...", "sub": "...", "data": { ... }, "image": "screenshot.png", "dur": 1.0 } ]
}
```

**Common cue fields** (which each grammar accepts is in the sections below):

| Field | Meaning |
|---|---|
| `at` | Seconds, required. The "reveal frame": the element is first visible at t = at (internally the animation counts from the frame before at). Exception: for `number`, at is the moment the number **lands**. Cues need not be in time order — clip.js sorts them; a cue whose at exceeds duration is dropped with a warning (it can't be seen and takes no layout space). |
| `kind` | Required. **A kind this grammar doesn't recognize raises no error and draws nothing** — write against the table below. |
| `text` | Main text: title, point, label, the wording inside a bubble, the big type in an insert shot. |
| `sub` | Secondary text: t2 card description, y5 supporting line, the short line actually shown in the y4 bubble, the line he types in the y4 insert shot. |
| `image` | Image path, relative to the spec file (absolute paths, `data:`, and `http(s):` also work). Missing file → refuse to render. |
| `frames` / `fps` / `loop` | Video frame sequence (accepted by t2's screenshot card and y2's photos): a directory (png/jpg/webp sorted by filename) or an array of paths; plays from at at `fps` (default 30), stops on the last frame when done, and `loop: true` loops it. Layout is set from the first frame. Missing frames → refuse to render. |
| `data` | This cue's own parameters (`index`, `rect`, `icon`, …), see each section. |
| `dur` | Only a few kinds read it: t1's title/point/equation/line, t3's bar/line/candle, y1's enter, y4's react/insert. Other kinds ignore it even if written. |

**`safe`**: `{top, bottom, left, right, fill?}` (px, default 0). clip.js passes it, along with the resulting content box `ctx.box = {x, y, w, h}`, to the grammar; `fill` is an optional color painted over the cleared edges after rendering (in a vertical film it makes a chart a "card" at the same position and on the same background as the adjacent contain screenshots; not painted with `--alpha`). **All 8 grammars accept `top` / `bottom`** (each grammar object sets `safe: true`, and content is laid out only between top..H−bottom: t3's axes and source line, y2's camera zoom and frame center, the layouts of t1/t2/y1/y3/y5, y4's bubble and insert-shot big type); **no grammar currently lays out against `left` / `right`** — writing them only gets the edges painted with `fill`, and content still runs to the edge. In a vertical 1080×1920 VO film the subtitle band sits around 1400–1520, so take `bottom` 490–570; landscape usually `bottom` 160–220. A new grammar that wants to accept safe follows t3: add `safe.top` to the layout's vertical baseline and subtract `safe.bottom` from bottom elements, or lay out against `ctx.box` directly, then write `safe: true` in the grammar object (clip.js console.warns if the spec gives safe and the grammar omits it).

**How `number` (big number) is framed** — only t2, t3, y5 accept it; the other 5 ignore it and show nothing:

| Item | Rule |
|---|---|
| Value | `data.value` (a number, may be negative; omitted means 0). Rolls from 0 to value (expoOut, fast then slow); negatives use a true minus sign "−", and the integer part gets thousands separators automatically. |
| Format | `data.prefix` (e.g. `"¥"`), `data.suffix` (e.g. `"%"`, `"×"`; write the space yourself if you want one), `data.decimals` (default **0**; t3's `spec.data.decimals` only controls bar labels and **number does not inherit it** — write the decimals again in the cue if you want them). |
| Description | Write any one of `text`, `sub`, `data.text`; clip.js unifies the three. |
| Small label | `data.label`: t2 draws it above the number, y5 at the top left of the page; t3 doesn't draw it. |
| Timing | `at` = the moment the number lands. t2 and t3 start rolling at at−0.9s; y5 turns the page and starts rolling at at−0.7s. So a number's at must be at least 0.9 (0.7 for y5), or most of the roll will already have happened on frame 0. |
| Position | t2: its own screen, with the previous screen starting to exit at at−0.9s, never stacked on a card; t3: a strip reserved above the chart area, right-aligned, with the description to the left of the number; y5: its own page. |

### Cues accepted by each grammar

In each section below, the first line is the spec-level `data` and the table lists cues. The "minimum spec" is the least you can write to render a decent-looking segment: copy the structure and change the content to your subject; the first cue is always a picture event, not a title.

#### t1_3b1b (3b1b / manim explanation: formulas, curves, points)

Spec-level data: none.

| kind | Fields | Notes | Example |
|---|---|---|---|
| `title` | `text`, `data.color`, `dur` | Writes from at; when another title comes the old one moves up and fades out; if too long, shrink the type first, then break to two lines. Not for openings — put an object on the first frame | `{"at":4,"kind":"title","text":"Attention is a weighted average"}` |
| `equation` | `data.tokens` or `text`, `dur` (1.2s for the first, 1.5s after) | token: `{s, it?, col?, gap?, sub?, sup?, size?}`; `col` takes a manim color name (`BLUE_C` `YELLOW` `GREEN_C` `TEAL_C` `RED_C`…) or #hex. Given only text it splits automatically: single letters italic, runs of letters (softmax) upright. From the second one on it Transforms from the previous | `{"at":1,"kind":"equation","text":"softmax(QK)V"}` |
| `point` | `text`, `dur` | One line per sentence, Written; older points dim as new ones arrive. When it doesn't fit, first give the curve less room (vertical 50%→30%), then shrink the type (≥0.6×); still not enough and the whole block rolls up when a new point appears while the earliest fades out (with a warning) | `{"at":3,"kind":"point","text":"Compute similarity first"}` |
| `line` | `data.values` (evenly spaced y) or `data.points` (`[[x,y],…]`), `text` = curve label, `data.color`, `dur` | The axes Create first and then the curve is drawn; from the second one on it morphs from the previous. With a line, landscape is text left / chart right, vertical is chart top / text bottom | `{"at":2,"kind":"line","text":"Loss","data":{"values":[9,5,3,2,1.5]}}` |
| `highlight` | `data.index` (which point, from 0, default the newest) or `data.target:"equation"` | Indicate + a yellow box held on screen | `{"at":5,"kind":"highlight","data":{"index":0}}` |

Minimum spec:
```json
{"grammar":"t1_3b1b","duration":6,"cues":[
  {"at":0,"kind":"line","text":"Weight of each word","data":{"values":[1,2,7,2,1]}},
  {"at":1.6,"kind":"equation","text":"softmax(QK)V"},
  {"at":3.4,"kind":"point","text":"The more alike, the higher the weight"},
  {"at":4.6,"kind":"highlight","data":{"target":"equation"}}]}
```

#### t2_keynote_ui (keynote UI: feature cards, screenshot cards, big numbers)

Spec-level data: `eyebrow` (small text above the title), `title`, `subtitle`, `accent` (accent color, default `#3d6bff`), `frame` (screenshot card packaging: default `"full"` full-frame; `"glass"` is the old frosted-glass card, optional, use sparingly).

| kind | Fields | Notes | Example |
|---|---|---|---|
| `title` | `text`/`sub` override data.title/subtitle | Floats out of blur from at. Not for openings — start with a screenshot or a number | `{"at":5,"kind":"title"}` |
| `card` / `step` / `image` (synonyms) | `text` card title, `sub` description, `image` screenshot; `data.step` sets the number; imageless cards may add `data.icon` (`wave memory agent clock phone layers chart code check play bolt lock`), `data.value/prefix/suffix/decimals/label` (count-up on the card) | With an image (default `frame:"full"`): one per screen, the screenshot filling the frame (proportional, uncropped; `data.fit:"cover"` crops to fill around `data.focus:[fx,fy]`), with a darkened blurred copy of the same image behind it; `text`/`sub` sit in a black torn-edge label at bottom left; it hard-cuts in on the at frame (a light 0.17s slam), and when the previous screen is also a full-frame screenshot it pans across at the same magnification for 0.30s. `data.frame:"glass"` uses the old glass card. Also accepts `frames` (screen-recording frames). No image: up to 3 consecutive cards side by side on one screen | `{"at":2,"kind":"card","text":"One line makes an image","sub":"No prompt needed","data":{"icon":"bolt"}}` |
| `highlight` | `data.rect=[x,y,w,h]` (relative to the screenshot, 0..1), `text` optional label, `data.fill` (fraction of the frame the box occupies after push-in, default 0.42) | Boxes a region of the current screenshot and dims the rest; in full-frame mode the camera pushes in at the same time (at least 18% closer, at most 2.6×; default slow push 0.9s, or `data.camera:"snap"` at the spec top level for a 0.28s fast push), and the next highlight on the same image moves over (default 0.7s, 0.30s for snap) | `{"at":5,"kind":"highlight","data":{"rect":[0.6,0.2,0.2,0.1]}}` |
| `number` | See the number rules above; `data.over: true` | Its own screen. With `data.over: true` and the previous screen being a full-frame screenshot: it does not start a new screen — the camera pulls back to the whole screenshot, the screenshot dims, and the number slams on top and counts. Use it when the number is about something in that screenshot; don't cut to a light-blob background | `{"at":4,"kind":"number","text":"Monthly active users","data":{"value":1.2,"decimals":1,"suffix":"B"}}` |

Minimum spec:
```json
{"grammar":"t2_keynote_ui","duration":6,"cues":[
  {"at":0.9,"kind":"number","text":"Monthly active users","data":{"value":1.2,"decimals":1,"suffix":"B"}},
  {"at":2.4,"kind":"card","text":"Voice input","sub":"Speak and it becomes text","data":{"icon":"wave"}},
  {"at":3.6,"kind":"card","text":"Long-term memory","sub":"Remembers what you said last time","data":{"icon":"memory"}}]}
```
This is how you write it without screenshots. With a product screenshot, lead with a screenshot card (`{"at":0,"kind":"card","image":"screenshot.png","text":"…"}`, see `examples/t2_keynote_ui.json`; for two real screenshots full-frame + push-in + pan, see `examples/t2_fullbleed_pulse.json`).

#### t3_finance_chart (The Economist-style data chart)

Spec-level data: `title`, `unit` (subtitle: metric and unit; if it doesn't fit shrink first, then break to two lines), `source` (source at bottom left; same, and keep clear of the bottom-right badge), `badge?` (the bottom-right badge is only drawn if written, e.g. "illustrative data"; don't write it for real data), `chart: "bar"|"line"|"candle"`, `series: [{label, value, color?}]` or candlesticks `[{label, o, h, l, c}]`, `decimals` (bar/point labels, default 1), `prefix`, `suffix`, `highlight: {index, text, sub}`, `colors: {main, accent, dim}`, `upDown: "cn"` (red up, green down, the default) `|"us"`, `xAxis: "category"|"time"` (bars name every category by default, lines/candles thin by time by default), `theme` (may also be written as the spec-level `theme`): `"light"` (white background, default) `|"dark"` (dark background, light type), the eight palette names (`"paper"` is now the paper palette), or `{bg, ink, sub, grid, bar, dim, red…}`; with no theme written but `safe.fill` giving the film's background color, the chart background uses that, and dark colors automatically switch to a dark background with light type.

**Keep chart shots inside the film's world**: the chart background should be in the same color family as the shots before and after it (for a dark film use `theme:"dark"` or write the film's background into `safe.fill`); don't suddenly cut to a white-background report inside a night scene or a dark film; better still, draw the chart onto an object inside the film's world — output an alpha clip with `--alpha` and composite it onto a screen, a blackboard, or a sheet of paper in the film.

| kind | Fields | Notes | Example |
|---|---|---|---|
| `title` | — | When the layout (title, subtitle, source) appears. May be omitted: without it the layout comes out at 0s together with the axes | `{"at":0,"kind":"title"}` |
| `bar` / `line` / `candle` | `dur` (default based on count); a bar chart may write several bars, each with `data.index` (a number or an array) = those bars only grow at that moment | Axes → data grows. Bars always start at 0; when a line/candle y-axis doesn't start at 0 the subtitle automatically adds "y-axis does not start at 0"; negative bars write their value below the bar base, with annotations running downward; when category names don't fit, shrink the type first and then stagger them onto two lines, and the annotated bar always has a name; ticks take their decimals from the step size | `{"at":1.2,"kind":"bar"}` |
| `highlight` | `text`/`sub` override data.highlight, `data.index` which bar | The callout dot pops on the at frame, with leader line + text; if a diagonal placement would cover another bar or value it moves directly above this bar, and if there isn't room on top it adds another tick level automatically | `{"at":4,"kind":"highlight","data":{"index":2},"text":"Highest"}` |
| `number` | See the number rules above | A strip reserved above the chart area, so it never covers the line's leading tip | `{"at":5,"kind":"number","text":"Latest close","data":{"value":259.97,"prefix":"¥","decimals":2}}` |

Minimum spec:
```json
{"grammar":"t3_finance_chart","duration":6,"data":{"title":"R&D spending at three companies","unit":"2024, hundred million yuan","source":"Source: illustrative data","badge":"Illustrative data","chart":"bar",
  "series":[{"label":"A","value":120},{"label":"B","value":86},{"label":"C","value":43}]},"cues":[
  {"at":0.3,"kind":"bar"},{"at":3.5,"kind":"highlight","data":{"index":0},"text":"Most"}]}
```

#### y1_kurzgesagt (flat explainer: central object + satellite nodes + scale travel)

Spec-level data: `center` (name of the first layer's central object), `center_style: {color, shape: "circle"|"rounded"|"hex"|"diamond", ring: true}` (if omitted, a neutral style is generated from the name: color and shape are decided by the text, the same name gets the same style, and there is no orbit ring), `image` (crop an image into the central object, with the name moved into a capsule below), `flow: true` (string the nodes into a chain with signals flowing through in order and numbers on them — use it when explaining "one after another"). The environment layer (star twinkles, particles, signal pulses) keeps moving gently throughout; the central object, nodes, and labels hold once they land, and the camera does not slow-push.

| kind | Fields | Notes | Example |
|---|---|---|---|
| `title` | `text` | The top title floats up character by character; it fades out over 0.5s from the at of the first highlight or enter. Not for openings — put nodes on the first frame | `{"at":1,"kind":"title","text":"What happens in one search"}` |
| `point` | `text`, `data.color` | A satellite node plus label capsule for the current layer. Up to 3 go on the upper half circle, 4 or more around the full circle. Labels are clamped inside frame for the current camera, and long labels shrink first | `{"at":1.4,"kind":"point","text":"Tokenize"}` |
| `highlight` | `data.index` (counts only the current layer's points, from 0, default the newest) | Pushes in to that node (about 30%; default slow push 0.9s, or `data.camera:"snap"` at the spec top level for a 0.28s fast push) and dims the rest; when already pushed in, the next highlight moves over at the same magnification | `{"at":5,"kind":"highlight","data":{"index":1}}` |
| `enter` | `data.index` (which node to dive into, default the newest), `text` (name of the new center, defaulting to the node name), `data.style` (the new central object's center_style), `dur` (default 1.6) | Scale travel: the push starts on the at frame, at about at+0.55×dur the screen is one flat color and it cuts to the new layer, and by at+dur the new central object has been pulled out. Points after that belong to the new layer (write the first new point's at after at+dur) | `{"at":4,"kind":"enter","data":{"index":0},"text":"Tokenizer"}` |

Minimum spec:
```json
{"grammar":"y1_kurzgesagt","duration":6,"data":{"center":"Search engine"},"cues":[
  {"at":0.3,"kind":"point","text":"Crawl"},{"at":1.1,"kind":"point","text":"Index"},
  {"at":2.2,"kind":"enter","data":{"index":1},"text":"Inverted index"},
  {"at":4.2,"kind":"point","text":"Word → page"}]}
```

#### y2_vox (collage desk: screenshots, clippings, red string, highlighter)

Spec-level data: none.

| kind | Fields | Notes | Example |
|---|---|---|---|
| `image` / `clip` (synonyms) | `image` or `frames` (video frames), `text` = black torn-edge label pressed into the bottom left (typing at 12fps), `data.halftone: true` converts to grayscale halftone, `data.fit:"cover"` + `data.focus` + `data.aspect` crops to fill around the focus | Slides onto the desk from at; a photo print (white border, aged paper tone, drop shadow, tape), proportional and uncropped by default. While the camera sits on one, it takes 80–90% of the frame. Landscape lays out left→right, vertical top→down; the red string is drawn out first, and the camera pans over in the 0.30s before at | `{"at":1,"kind":"image","image":"screenshot.png","text":"Homepage"}` |
| `title` | `text` (empty or whitespace-only warns and is skipped) | Black label strip with white type, typing at 13 characters/second. Good for landing the theme at the end, not for openings | `{"at":5,"kind":"title","text":"There are three threads here"}` |
| `point` | `text` | Ruled index card, typed (short gaps speed it up to at most 40 characters/second) | `{"at":4,"kind":"point","text":"Posted one day before the announcement"}` |
| `highlight` | `data.rect=[x,y,w,h]` (relative to **the current image**, 0..1; relative to the cropped frame when `fit:"cover"`) | Highlighter sweeps → red circle → camera pushes over (default slow push 0.9s, or `data.camera:"snap"` at the spec top level for a 0.28s fast push; if the box starts outside the frame it pushes first and arrives the frame before at). Eyeballed rects are usually off by 20–30% — check with `--stills` first | `{"at":2.5,"kind":"highlight","data":{"rect":[0.1,0.2,0.3,0.1]}}` |

Minimum spec (y2 needs real material: if there's no screenshot, photo, or original text to paste up, don't pick y2 — see section 2):
```json
{"grammar":"y2_vox","duration":6,"cues":[
  {"at":0,"kind":"image","image":"screenshot.png","text":"Site announcement"},
  {"at":1.6,"kind":"highlight","data":{"rect":[0.1,0.2,0.3,0.1]}},
  {"at":4,"kind":"point","text":"Two weeks later the price changed"}]}
```

#### y3_whiteboard (whiteboard hand-drawn: one line per sentence, icons, circling the key point)

Spec-level data: none.

| kind | Fields | Notes | Example |
|---|---|---|---|
| `title` | `text` | Starts at 7.5 characters/second and speeds up automatically if it can't make the next cue. Not for openings — draw the first stroke first | `{"at":4,"kind":"title","text":"Why write tests"}` |
| `point` | `text` | Draws a small circle as the bullet first, then writes, starting at 16 characters/second | `{"at":1.5,"kind":"point","text":"Someone watching while you change code"}` |
| `draw` | `data.icon` (`person cat network doc chat bulb check cross screen stack gear target clock chart`; a wrong name warns and only the caption is written), `text` = the caption under the icon (shrink the type first if it doesn't fit), `data.arrow: false` skips the arrow | Sits beside the line just written; consecutive draws are joined by orange arrows | `{"at":2.5,"kind":"draw","text":"Automatic checks","data":{"icon":"check"}}` |
| `image` | `image` | Zigzag reveal + hand-drawn frame, proportional and uncropped | `{"at":4,"kind":"image","image":"sketch.png"}` |
| `highlight` | `data.index` (which one, from 0), `data.target`: `"title"` / `"draw"` / `"image"` (counts points by default), `data.style: "underline"` | Circle it in orange or underline it; no index = the most recently written one | `{"at":5,"kind":"highlight","data":{"index":0,"style":"underline"}}` |

Minimum spec:
```json
{"grammar":"y3_whiteboard","duration":6,"cues":[
  {"at":0,"kind":"draw","text":"Automatic checks","data":{"icon":"check"}},
  {"at":1.4,"kind":"point","text":"Someone watching while you change code"},
  {"at":3.0,"kind":"draw","text":"Safe to refactor","data":{"icon":"gear"}},
  {"at":4.6,"kind":"highlight","data":{"target":"draw","index":0}}]}
```

#### y4_storytime (the bean character tells a story: bubbles, reaction close-ups, insert shots)

Spec-level data: `character` — **it must be your own frame lib** (AI frame generation, see `references/10-characters.md`; delivery line in `references/character-fidelity.md`); the code-drawn presets (`neutral`/`bun`/`author`) and the shape objects are retired, and startup fails whether you write them or not. Without image-generation capability, don't use y4 — switch to y2/y5 or tell it with scenes of hands and objects. A frame lib is a directory (render.py strips the extension from each filename and uses it as the pose name: `rest talk point shrug type stiff react back`, with `<pose>_open` being the open-mouth frame), or `{"frames": {"talk": "me/talk.png", …}}`; frame images have a transparent background, with the soles at the bottom center of the image, and at least rest or talk is required. The camera holds and the character doesn't breathe; change comes from fast cuts, reaction close-ups slamming in, and insert shots. With `window.VO_ENV` present it lip-syncs to the VO envelope; without it, it synthesizes from the character count. safe only clears room for type (bubbles, insert-shot big type); the character, the desk, and the face in a reaction close-up are graphics and will reach into the subtitle band in vertical — subtitles over a body still read fine, but don't expect them to move aside.

| kind | Fields | Notes | Example |
|---|---|---|---|
| `point` / `title` (synonyms) | `text` = the VO transcript (sets the mouth-open duration, ≈6.5 characters/second), `sub` = the short line actually shown in the bubble (≤12 characters is best; text only shows if omitted), `data.pose`: `talk` / `point` / `shrug` / `type` | The bubble pops and the mouth starts moving on the at frame | `{"at":0.1,"kind":"point","text":"I asked it to fix one typo,","sub":"just one character"}` |
| `highlight` | `data.mark` (default "?") | "?" or "!" pops up + a worried shrug | `{"at":4,"kind":"highlight","data":{"mark":"!"}}` |
| `react` | `dur` (counted from at, by default until the next cue) | Jumps to a big reaction close-up: dead-fish eyes + sweat drop, not a word | `{"at":3,"kind":"react"}` |
| `insert` | `sub` = the line he types on the computer (wraps when long, at most 3 lines), `text` = the big type that slams in, `data.hit` (**absolute seconds**, default at+1.3, or at+0.4 when there's no sub), `data.count` + `data.unit` (the top-right counter stops at this number when the slam lands), `data.app` (window title, default "AI assistant"), `dur` (counted from at, by default until the next cue) | Cuts to a close-up of the computer screen on the desk: typing → the reply scrolls faster and faster like a code wall → the big type slams in | `{"at":2,"kind":"insert","sub":"fix a typo","text":"It changed 40 files","data":{"hit":3.4}}` |

Minimum spec:
```json
{"grammar":"y4_storytime","duration":6,"cues":[
  {"at":0.1,"kind":"insert","sub":"change 'their' to 'there'","text":"It changed 40 files","data":{"hit":1.5}},
  {"at":2.6,"kind":"react"},
  {"at":4.0,"kind":"point","text":"I only asked for one character.","sub":"just one character"}]}
```

#### y5_kinetic_type (kinetic type: one cue per page)

Spec-level data: `palette: [[background, type color], …]` (cycles per page).

| kind | Fields | Notes | Example |
|---|---|---|---|
| `title` / `point` | `text` main word (auto-shrinks when too long, at most two lines), `sub` supporting line, `data.label` (small label at top left), `data.key` (the word in the supporting line to color), `data.num` (giant background number) | The main word slams in on the at frame, and page changes are a color-band wipe (starting 0.3s before at). Two or more points = a list: draws a progress rail + giant background numbers | `{"at":1.8,"kind":"point","text":"Slow","sub":"Change one thing at a time","data":{"label":"01","key":"one thing"}}` |
| `number` | See the number rules above | One page, one big number | `{"at":4,"kind":"number","sub":"Share that pass first try","data":{"value":87.5,"decimals":1,"suffix":"%"}}` |
| `highlight` | `data.word` (a word inside the main word; omit it to highlight the whole main word) | Highlighter + a small zoom; when the highlighter is the same color as the type (yellow type on a deep blue page) the type under it reverses out to the background color. A word that isn't in the main word warns and does nothing (use `data.key` for words in the supporting line) | `{"at":3,"kind":"highlight","data":{"word":"Slow"}}` |

Minimum spec:
```json
{"grammar":"y5_kinetic_type","duration":5,"cues":[
  {"at":0.7,"kind":"number","sub":"Share that pass first try","data":{"value":87.5,"decimals":1,"suffix":"%"}},
  {"at":2.2,"kind":"point","text":"Slow","sub":"Change one thing at a time","data":{"key":"one thing"}},
  {"at":3.6,"kind":"highlight","data":{"word":"Slow"}}]}
```

### Samples (`scripts/engine/examples/`)

```sh
cd <skill>/scripts
uv run --with playwright python engine/render.py --spec engine/examples/t3_finance_chart.json --out t3.mp4   # NVIDIA revenue over five fiscal years (real 10-K data): the bars grow in three batches, each landing on a word
uv run --with playwright python engine/render.py --spec engine/examples/t2_keynote_ui.json   --out t2.mp4   # Leads with a screenshot card + boxes a number, vertical screenshot, then one big number
uv run --with playwright python engine/render.py --spec engine/examples/t1_3b1b.json         --out t1.mp4   # Gradient descent: the loss curve comes out first, the formula transforms, the curve morphs
uv run --with playwright python engine/render.py --spec engine/examples/y2_vox.json          --out y2.mp4   # Opens with a screenshot pasted on the desk, highlighter + red circle + push-in, closing label lands the theme
uv run --with playwright python engine/render.py --spec engine/examples/y3_whiteboard.json   --out y3.mp4   # Whiteboard: draw then write, icons alternating with short lines, finally circling the first icon
uv run --with playwright python engine/render.py --spec engine/examples/t2_fullbleed_pulse.json --out t2b.mp4   # Two real terminal screenshots full-frame: push to the timer, pan to the second, pull back to the whole screenshot and slam the number on top to close (number's data.over)
# Also y1_kurzgesagt (a drop of seawater → dive into a diatom) / y4_storytime (opens on a screen close-up) / y5_kinetic_type (opens with a number slam); add --width 1080 --height 1920 to any of them for vertical; sample assets are in examples/assets/: the three chart images are final frames rendered by t3 itself (numbers already landed, no play bar, no path), and the two terminal screenshots are captured from real python3 -m timeit output
# The samples demonstrate how to write: don't move their subject, composition, or assets into a finished film as-is
```

### Reminders for the pipeline director

- Don't cram too many cues into one animation segment: given the shot lengths in section 1, 2–5 cues in a 3–8 second clip is most comfortable; too dense and the writing is forced to speed up and the camera can't get into place.
- **Three bottom lines for writing a spec** (this is where most slide-flipping PPTs come from): the first cue is a picture event (curve, screenshot, data growing, dive-in, icon, screen close-up, number slam), not a title at second 0; text-type cues (title, point) are no more than half, and the same kind never appears 3 times in a row; each on-screen `text` and `sub` is at most 14 characters, and the VO transcript belongs to the subtitles (when y4 has a `sub`, its `text` only sets the mouth-open duration and never appears on screen, so it's exempt).
- Grammars with type in the picture (t1/t3/y3/y5) compete with the pipeline's burned-in subtitles for attention; when compositing, move the subtitles aside or don't burn them in for that segment.
- Alpha mode (`--alpha`) only removes the background layer; element shadows remain. y2's paper scraps and t2's glass card read on alpha as "cards floating over the picture". Under alpha, t3's type carries a halo in the theme background color (default white paper with black type = white halo; `theme:"dark"` is light type with a dark halo), so it stays legible over other pictures; t1's white type carries a dark halo.
- **In vertical, when pasting a screenshot, box the half-sentence the VO is currently saying.** On a vertical desktop a screenshot is about 900px wide, and 16px body text on a web page needs a 2–2.5× push-in to be readable; when the box covers a full-width line of type (box width close to frame width) the red circle doesn't fit and the camera can't push in. If one sentence spans two lines, split it into two highlights, each on one keyword (measured 2026-10-04: after splitting, a 2.4× push-in gave ~50px type height). Eyeballed rects are usually off by 20–30% — render one still with `--stills` to check.
- **Stepped animation in a grammar file must count from at.** If on-twos stepping rounds to an absolute time grid (`MO.step(t, 12)`), an element shows up as much as one step early (2 frames early at 30fps). Write `MO.step(t − at, 12)` so the at frame is the first frame. y4's character frames still snap to absolute 24fps, so a cue may land up to 1 frame off — check before use.

---

## 6 · Regression (when brought into the skill on 2026-10-04)

| Subject | Result |
|---|---|
| The 16 original segments (`eras.js`), the 36 all-style samples (`--film gallery`) | Pixel-identical at the same moment across 61 frames before and after the change; qa fully error-free, determinism ✓, motion/jump numbers unchanged, time cost back-to-back 21.5 → 22.3 ms/frame (within noise) |
| The 8 demo films vs the experimental originals | Pixel-identical at 16 moments per film (including transition windows); all 25 qa segments error-free, determinism ✓; motion, jumps, and time cost match the original project (each film's first segment start moved from 8/16s to 0 and the qa sampling window differs, so the first segment's numbers differ slightly) |
| After the 2026-10-05 final-review fixes | 87 qa segments (8 samples + 16 originals + 36 style samples + 8 demo films) all deterministic ✓ and free of page errors; sample stills changed only as expected (t2 differs by 1 color level = the determinism fix, y5's deep-blue page keyword became orange, y1's title actually fades out); the independent final review of 36 specs (landscape samples, vertical, stress, edge cases, alpha) found no 🔴 |
| After pulse shots, real-material pieces, and vertical full films entered the engine on 2026-10-10 | 18 moments taken from each of the 16 original segments, 36 all-style samples, 8 demo films, and the long-scroll demo are pixel-identical before and after in landscape (demo y4 explicitly uses `char: 'author'`); 9 samples rendered in both landscape and vertical, qa deterministic ✓; the vertical test film's push / bands / iris / comicPanels transitions compute correctly at 1080×1920 |
| Known jumps | y1_s3 (the middle of a 42×→1× pull-back), y2_s2/s3 (a fast pan and a push filling a photo), t1_s3 (passing into a neuron), the y5 beat accents — all designed camera push/pull or beat flashes, present in the originals. Since 2026-10-10 qa counts monotonic pushes and pans shorter than 0.35 seconds as camera events: t1_s3's 1.51s, y5 k4_agent's 2.2s, and t3_s1's 2.1s in the demo films are now counted as camera events; everything else is longer than 0.35 seconds (or is an on-twos single-frame jump) and is still counted as a jump |
| 2026-10-10 gate and one-command delivery | Before and after the qa change: motion, still-frame pairs, determinism, and framing unchanged for the 8 demo films and 9 sample specs; jumps decreased only by those reclassified as camera events (by event: 3 in the demo films; 1 in sample t2_keynote_ui, 3 in y4_storytime, 2 in y5_kinetic_type, all 0.07–0.34s pushes, slams, or pose fast-cuts), while pushes longer than 0.35 seconds and on-twos single-frame jumps are still reported; synthetic film (the same three images, 3 seconds per shot): a constant-rate 7.5% slow push on every shot gives 0.000 fast-motion frames and a red light, one 0.3s 30% fast push on every shot gives 0.095 and a green light; in whole-film mode a 0.3s fast push used to count 8 jumps and now counts 1 camera event, while a one-frame white flash is still counted as a jump |

---

## 7 · Pitfalls hit

- **(2026-10-04, measured after hooking up the VO pipeline) In y2, after a push-in the next box sat outside the frame and the highlighter started sweeping off-screen.** The audience saw it 7 frames late. Fixed: when the box's start point isn't in the current shot, the camera moves there first, arriving the frame before at, and then reveals; the push-in factor is also constrained by "keep the red circle in frame" (the circle is 1.24× the box width and 1.5× its height).
- **(2026-10-04, parametric clip review) t3's ticks lied, categories lost their names, and the big number covered the line tip.** `fmtTick` kept decimals only when the step was <1, so with a step of 2.5 the values −2.5/2.5/7.5 printed as −3/3/8; 10 category bars in vertical were thinned by `ceil(n/6)` and the annotated "first" happened to lose its name; number sat fixed in the top right of the chart area, exactly where the rising line's tip was. All three fixed (see the t3 row in section 5).
- **(same) In y2 the camera left before the text card finished typing.** The camera's departure looked only at the next item's at−0.95. It now waits for "typing done + 0.5s hold" (at the latest at−0.4), and when the gap is short it speeds typing from 13 up to at most 40 characters/second.
- **(same) The full-width space in PuHui Medium/Bold was zero width.** The source font (Alibaba PuHuiTi 3.0 weights 65/85) itself had 0, so "USD　y-axis does not start at 0" ran together. `font_subset.py` now sets it to the same width as the full-width glyph U+4E00 when extracting a subset; existing files were fixed with `--fix-widths`.
- **(same) t3's vertical callout landed right on the burned-in subtitle band.** The vertical chart bottom sat at y≈1660 and the callout at y≈1460, overlapping the subtitles (1400–1520) of a 1080×1920 film. Added `safe`.

- **(2026-10-05, parametric clip final review) Everything written from the samples was fine, but switching to vertical and real lengths sent things off-frame.** The independent final review of 33 specs (landscape samples, self-written vertical, stress, edge cases, alpha) found 12 🔴: y2's empty text made the renderer loop forever and hang; on y5's deep-blue page the highlighter was the same color as the yellow type and painted the main word out, and long numbers went off-frame in vertical; t1's 7 vertical points were pressed into the subtitle band; t3's vertical subtitle and source lines went off-frame, a callout covered the neighboring bar, and on alpha over a dark background it was invisible; y1's vertical labels were clipped; y3's vertical captions went off-frame; y4's vertical typing overflowed the bubble; t2 differed by 1 color level between two renders of the same moment (a reused buffer held the previous frame). Self-testing also found that `TY.charsIn` didn't multiply the outer opacity (y1's promised title fade was a one-frame disappearance), t3's lowest negative bar put its value over the category name, and `TY.fit` counted lines without measuring line width. The rule: **wherever something "doesn't fit" there must be a fallback — shrink, then wrap, then yield space, and only warn last**; a layout tuned only to sample lengths breaks the moment it meets real VO.

- **The two experiments each wrote a `window.YT` with completely different APIs.** On merge they were split by function into 8 namespaces, and things with the same name but different meanings were renamed: G2's `zoomThrough` (rush into a color block) → `fillZoom`, G2's `spring(t, freq, decay)` → `MO.springHz`, G1's `circlePts` (open ellipse) → `DG.ellipsePts`.
- **woff2 fonts failed the glyph check.** The engine's `U.loadCmaps` only parses WOFF1/TTF, so G3's woff2 threw console.error on load and qa failed it. Everything was converted to woff when brought in.
- **A background read from whole-film time shifts phase depending on where the film sits on the timeline.** The keynote demo's light blobs originally sat at 8–16s, and once it became a standalone film the composition changed completely; `T2.PHASE = 8` preserved the approved picture. Light blobs in parametric clips read only clip time and are unaffected.
- **Ticks must enclose the data entirely.** `CH.ticks` only returned whole ticks within a range, so with a max of 130 the top tick could be 100 and bars pushed out of the axes; the clip now adds one level above and below.
- **System fonts aren't in the skill.** The Vox demo's serif (Songti SC) and the kinetic-type demo's code font (Menlo) were macOS system fonts and would look different on another machine; the parametric clips have all been switched to fonts bundled with the skill.


## Full VO films and the 9th grammar

All 8 above ship parametric clips. There is also [presenter-style finance explainer](animation-grammars/y6_presenter_explainer.md), which provides a grammar and full-film reference code but no parametric clip yet. For complete VO production, framing checks, and the feedback loop of lessons, see [full VO films and the feedback loop](12-full-vo-film-and-feedback.md).
