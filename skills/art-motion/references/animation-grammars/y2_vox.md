# Y2 · Vox-style collage explainer: video animation grammar card

In one line: lay the argument out on a desk covered with real material — clippings, photographs, documents — and the camera moves across that desk like an investigative reporter's eye; lines and pen strokes go on in a stop-and-start rhythm, and the sense of evidence comes from "these things really were put here".

Demo film: `scripts/engine/demos/y2_vox/` (render `render.py --film demos/y2_vox`) (8s, 3 shots, 2 transitions), overview: `assets/animation-grammars/y2_vox_overview.jpg`
Basis: research on this style (the original research text and per-frame data stay in the experiment archive and were not collected into the skill; the numbers used are excerpted in this card). Five samples: Missing Chapter (2022), the psychedelic poster film (2019), Vox Borders (2018), Johnny Harris (2026), plus a Vox 2026 live-footage film as a control. 13 camera moves were fitted for easing, and colours were sampled.

## Before you start

1. **Real material is the main image.** Screenshots, original text, and photographs fill the frame or nearly fill it, pushing in to the sentence that has to be read; the desk is a world the camera travels through, not a ground colour behind a small image. Measure it: if more than 2 consecutive shots have material narrower than 60% of the frame width, that is "picture-frame layout".
2. **Rotate "slide-in → typed label → red circle".** When storyboarding, write a table of reveal actions: appear directly (at the cut), push in, pan to the next one, highlighter sweep, red line connect, stamp, tear off... The same reveal sequence is not used more than 3 times in a row. Evidence: in one long film, 36 of 37 labels slid in, and by the middle the audience could already predict the next step.
3. **The text to be read goes on the top layer and is drawn last,** not following the stacking order of the object it belongs to. Photos, clips, and cards added later covering the text is the most common recurring continuity error in this grammar.
4. **Reverse-compute the camera endpoint from what has to be read at that moment** (frame the target, then leave margin), do not hand-fill coordinates; neighbouring cards' labels left half in frame get pushed off-screen.
5. **On the accumulating desk, every time a new card goes down, read the on-screen text in reading order.** Two cards' text sitting next to each other can spell out a wrong sentence ("over" right next to "acquire"), so pull a card or write the qualifier in full.
6. **The formal action of one event is performed only once.** An action already performed in the wide layout is not repeated after the push-in, otherwise it reads as "it happened again".

---

## ① When to use it

**Use it:**
- Content with real archives, news, history, maps, people: "how did this happen", "who said what, and when".
- When the VO is reporter-style argument: quotation, evidence, cause and effect. When the narration says "look at this sentence" or "note this number", the image goes and highlights that sentence.
- Moments where a quotation, a set of numbers, or a year needs the audience to "see the source with their own eyes".
- The demo film uses the real numbers from the 2012 Google "cat recognition" paper: 1,000 machines, 16,000 CPU cores, 10 million YouTube screenshots, unlabelled. Sources: arXiv:1112.6209 and Google's official blog.

**Don't use it:**
- Pure mechanics, pure concept, nothing real to stick on the desk. Forcing it becomes a "fake archive"; use Y1.
- Derivations and steps: use Y3.
- Content that needs a lot of character performance: cut-paper characters can only move in stop-steps.

## ② Frame composition

- **Three-colour system** (measured on Missing Chapter):
  - near-black ground `#171716`
  - paper white `#E0DCDA`–`#EEEDED`
  - one red in two steps: bright red `#B65255` for lines, dark red `#93403C` for fills
  - fluorescent yellow `#DACF08` (darker and more olive than the Vox logo's `#FFF200`; logo yellow is rarely used in large areas in the films)
  - old map paper `#E4DCCF`, parchment `#CFB195`
  - no pure white, no pure black.
- **[This film]**:
  - desk `#e4ddcf`, tiled paper grain with fibers and low-frequency light and dark.
  - clue red `#b8433f`, a little brighter than measured, because it has to read at 1080p.
  - fluorescent `rgba(218,207,8,.9)`, composited in multiply.
  - shot 3 is a large black card stock on the desk `#1b1b1a`, with the desk showing on all four sides.
- **Materials**:
  - photographs are always grayscale halftone (45°), with a white border and two strips of translucent tape.
  - clippings have torn edges, yellowed, Songti headline.
  - labels are Borders-style black bars with white bold text ("2012 · Google").
  - index cards are lined paper.
  - the paper grain is **static**. Measured frame difference on hold segments is 0.0–0.1, no frame-by-frame grain; that is the Johnny Harris 2026 film-stock look, not Vox.
- **Shadows are very weak.** Black-ground cards show almost no shadow at 360p [measured]. [This film] uses blur 10, offset (3,6), α 0.28 uniformly.
- **Deliberately imperfect**: the Vox art director's own words are "You don't want it to look perfect because that might make it look more like an ad than an editorial piece" [primary source].
- **Characters**: cut out of real photographs as stickers, with a white border and shadow. [This film] Huashu (the author) uses `HUASHU.draw`, offsetting the silhouette in 16 directions by 12px and laying a paper-white layer underneath as the sticker edge.

## ③ Motion paths

- **Two-layer frame rate (the core)** [measured]:
  - the camera layer is smooth 24fps motion.
  - the element layer (map blocks growing, red route lines, typing, hand-drawn circles, pop-ins) steps at 12fps, "on twos". In the psychedelic-poster film, 52% of motion frames show the "move–stop–move" alternating fingerprint.
  - [This film] the camera is computed continuously at 60fps; every element is quantized with `MO.step(t, 12)` before progress is computed. QA measured 16.9% static frame pairs in shot 1 — that is the stop frame of on-twos, not stutter.
- **Camera easing** [13 moves measured]:
  - median duration 1.29s, range 0.71–1.96s, **not one of them linear**.
  - 7 moves are symmetric easeInOutSine, equivalent to AE's default Easy Ease, used for the long-distance "find the next card".
  - 6 moves start fast and settle with a long tail, close to `cubic-bezier(.33,0,.2,1)`, used for "pull out to reveal" and "follow the clue across".
- **[This film] camera**:
  - shot 1: after the highlighter sweep finishes, a 1.5s sineInOut push toward that line (1.14→1.28). BD measured that a sweep is often followed by one push.
  - transition A: 1.1s long-tail bezier.
  - transition B: 0.6s sineInOut push.
  - shot 3: 0.85s long-tail bezier pull back.
  - These measured durations (push 0.6–1.5s, pull back about 1s, following a line 1.3–1.8s) are the new film's defaults. The demo film's 0.9s slow push at the open of shot 1 (1.14→1.165, only 2%, bringing nothing out) and the 1%/s constant slow drift after the pull back in shot 3 are old practice; the new film does not copy them.
- **Entrances** [measured]:
  - archive photos and clippings **appear directly at the cut**, no pop, no drop.
  - only when tracking along a timeline does the next card slide in from off-screen, tilted 5–15°, flattening on arrival, about 0.8s.
  - [This film] small photos and the Huashu sticker use `slideIn`: 0.55s quartOut, from 12° tilt to flat, 12fps step.
- **Lines and pen** [measured]:
  - red underline drawn in 0.5–1s.
  - red ellipse circle about 1s, one stroke, ends not closed, slightly crossing.
  - highlighter bar one line 1.5–3s, sweeping with the words the VO is saying.
  - typing about 13 characters/s, on twos.
  - [This film] red circle 0.65s, highlighter 0.9s (demo compression), typing 13 characters/s, each red line 0.5s, staggered 0.15s, counter rolls to 10,000,000 in 1.4s cubicOut.
- **The camera stops during holds**: measured frame difference on hold segments 0.0–0.1 — when Vox's desk stops, it stops. While there is animation inside the card (line drawing, highlighter, typing) the camera does not move; when a pure still holds for a long time, push in at the point where the VO reaches the thing to be read (0.5–0.9s to find the card, 1.0–1.5s push, ease in and out; only the reveal gets a fast 0.28s push), or pan to the next card, without adding constant slow drift.

## ④ Transitions (6 common ones)

1. **Hard cut**: the vast majority; cut points sit on the narration's punctuation [measured].
2. **Pan along a red line (timeline tracking)**: the camera moves horizontally along a red line, 1.3–1.8s, long-tail easing; the next card slides in from the right at an angle and flattens.
   - [This film] transition A: the red line runs from the highlighted line of the clipping to the count label on the investigation wall, the camera follows in 1.1s, with a short motion blur along the velocity direction (7 stacked samples, coefficient 0.6).
3. **Push into paper or a photo → hard cut to a high-res scan of the same image**: 1.0–1.4s, S-curve easing.
   - [This film] transition B: push fully into the small photo on the wall (log interpolation to z≈9.6); hard cut to a large scan of the same image (halftone goes from fine to coarse, reading as "swapped in a clearer one"); then cut to shot 3.
4. **Pull back from a single photo → reveal the whole collage**: about 1.0s, fast start, long tail (measured MC 2:30).
5. **Map blocks growing, route lines drawn**: 2.5–3.5s, on twos, line ends with a solid red dot.
6. **A real hand turning pages, pulling paper** (Missing Chapter's signature): in code this can be approximated as "paper slides in along an arc with a shifting shadow".

**Caution**: the "torn-paper transition" did not appear once in the 5 samples. It is a common move on template sites, not Vox grammar. The first version of this film used torn paper; after reading the research it was replaced.

## ⑤ Rhythm and text

- **Shot length** [measured, collage segments]:
  - two modes: slow mode (Missing Chapter) median 3.3s, about 12 cuts/min, one card holds 3–7s, carried by in-card line drawing and highlighting.
  - fast mode (psychedelic poster 1.8s, Johnny Harris 1.4s) about 25–33 cuts/min, images barely move, the rhythm comes from cutting.
- **Aligning with the VO**:
  - the speed of highlighter bars, typing, and line drawing is locked to the speaking speed, not to the musical beat.
  - Johnny Harris's formulation is "Each word must correspond to a movement or action within the animation", and he writes his script in two columns [primary source].
  - Joss Fong changes the music about every 20s [primary source].
- **Text**:
  - names and places in small serif type, white text below the photo.
  - black-ground timeline titles typed out character by character, 13 characters/s, with a red line running across the frame.
  - quotations surface in a handwritten "bleeding ink" style, about 2s, then a red bar follows line by line [measured].
  - [This film] uses Songti SC for clippings and cards, PuHui-Heavy for large labels, Anton for numbers.

## ⑥ Implementation notes

> After collection into the skill (2026-10-04 v0.4): the general functions in this card's "new" section have been unified into `scripts/engine/lib/` (names changed to the unified MO / CAM / DG / TY / CH / UI / CL / TOON), and the demo film's own code is in `scripts/engine/demos/y2_vox/`. For the library quick reference and "how to choose a grammar for a piece of VO", see `references/09-video-animation-grammars.md`.

- Reused from the skill:
  - `PAINT.cached`, `PAINT.scratch`: all paper scraps, photos, and clippings are drawn once into sprites
  - `PAINT.grain`: static grain
  - `PAINT.noise/fbm`
  - `KIT.densify/resample`: hand-drawn circles
  - `HUASHU.build/pose/draw`
  - engine transition interface
- New, now unified into the library (`lib/collage.js` / `camera.js` / `diagram.js` / `motion.js`):
  - `MO.step(t,12)`: on twos.
  - `CL.paperTile`: tileable paper grain, sampled on a torus so it is seamless, with fibers.
  - `CL.halftone`: grayscale to 45° halftone dots, batched into one path with a single fill.
  - `CL.tornEdge`: torn edge.
  - `DG.hand / DG.drawPartial / DG.cum`: hand-drawn lines, drawn out by length.
  - `CAM.motionBlur`: stack frames along the velocity direction.
  - the new film's real-material pieces: `MD.print` (a print: white border, aged paper colour, shadow, tape, can crop to the focus point), `MD.label` (black torn-edge label, 12fps typing), `MD.cover` (full-bleed fill + focus + push, used when hard-cutting to live footage); shots use `CAM.track`'s glide and push, punching only on accents. The parametric clip y2 has already switched to this set: photos take up eight or nine tenths of the frame, the camera by default takes 0.7s to move to the next piece, slow-pushes 0.9s on highlight (writing `"camera": "snap"` in the spec's top-level `data` switches it to a 0.30s pan and 0.28s fast push), never a constant slow push.
  - `MO.bezier`: long-tail easing `(.33,0,.2,1)`.
- The demo film's own (`demos/y2_vox/vox.js`; `slideIn / highlight / stringPts` are now in the library as `CL.slideIn / CL.highlight / CL.stringPts`):
  - `slideIn`: tilted slide-in that flattens.
  - `highlight`: highlighter band with a fuzzy edge, multiply.
  - `stringPts`: a sagging red line.
  - `deskCam`: desk camera keyframes, adding a push at the end.
- **Key architecture**:
  - shots 1 and 2 are the same desk world and the same camera. Transition A uses `same` (A and B are the same picture to begin with), and the pan is done entirely by the camera.
  - shot 3 is a large black card stock on the desk. Transition B uses `cut`, cutting on the frame where the push is full.
- **Performance**: shot 3 takes 73/89ms per frame (mean/peak), and the Huashu sticker does 16 offsets per frame to pad its border. The sticker border can be cached and recomputed only when the pose changes at 12fps.

## ⑦ Representative works and primary references

- Samples:
  - Missing Chapter "The case to rename this famous Christmas plant" https://www.youtube.com/watch?v=lLSUjl4WatY
  - "Where the 1960s 'psychedelic' look came from" https://www.youtube.com/watch?v=9vuqI2v2IRs
  - Vox Borders "China is erasing its border with Hong Kong" https://www.youtube.com/watch?v=MQyxG4vTyZ8
  - Johnny Harris "The Internet Didn't Fail. It Was Taken." https://www.youtube.com/watch?v=0rKDo3hKbVk
- Primary:
  - Interview with Vox art director Joey Sendaydiego https://www.storybench.org/how-vox-uses-animation-to-make-complicated-topics-digestible-for-everyone/
  - Interview with Joss Fong https://www.theopennotebook.com/2020/01/07/videogram-how-a-vox-video-explains-the-science-behind-the-first-photo-of-a-black-hole/
  - Johnny Harris "How I Make My Maps" https://www.youtube.com/watch?v=GsojLuJpe_0
- Secondary: PremiumBeat "Replicating Vox motion graphic" https://www.premiumbeat.com/blog/replicating-vox-motion-graphic/
- Demo film facts:
  - Le et al., ICML 2012, arXiv:1112.6209 https://arxiv.org/abs/1112.6209
  - Google official blog 2012-06-26 https://blog.google/innovation-and-ai/products/using-large-scale-brain-simulations-for/

## ⑧ The 3 easiest things to get wrong

1. **Everything moving smoothly at 60fps together**. Half the handmade feel of collage comes from the two-layer frame rate — "camera glides, elements step". All-smooth looks like a corporate promo, all-12fps makes the camera dizzy.
2. **Passing template grammar off as Vox**: torn paper, every image popping and dropping in, paper grain jittering frame by frame. None of these appeared in the measurements: Vox photos are simply there at the cut, the paper grain is dead, and transitions are mostly hard cuts and pushes. The more fancy entrances there are, the less it looks like "an editorial department's work".
3. **Using Vox logo yellow as a large-area ground, laying on too many colours**. The yellow in the films is the `#DACF08` highlighter step, used only to mark emphasis. The subject is the three colours "black, paper white, one red", and one more accent colour is enough.

---

## Review and revision (independent agent sees only the final film, 8/10)

Review notes and how this round handled them:
- "Shot 3 turns pure black, the big desk breaks": changed to a large black card stock laid on the same desk, with the desk paper showing on all four sides. Still Missing Chapter's black-card grammar, but the desk does not break.
- "0–0.9s completely static": at the time the demo film added an opening slow push (1.14→1.165). The current approach: put the first event within 0.3s (the photo is there at the cut, the highlighter or red line starts at once), or open with one 0.17s slam.
- "The halftone blurry image fills the screen for too long": push shortened from 0.7s to 0.6s, pull back from 1.0s to 0.85s. The pull back starts at z=3.68 so the photo is the same screen width on both sides of the hard cut, and the large image gets tape at the same position so the hard cut reads as "swapped for a hi-res scan".
- "A blank paper strip appears first": the strip now slides in at an angle, typing moved up to 0.4s.
- "The main figure cuts in half-body from the right in one frame": the start point moved to 1100px off-screen, so the first 12fps step is still off-frame.
- "The highlighter does not finish before the film ends": typing, red circle, and highlighter all moved earlier, the highlighter finishes at 1.8s, then holds 0.3s.
- "The word 'cat' in its mind is too small": raised to 40px.
- "The camera is smooth the whole way, on-twos is not enough": not changed. Research measured Vox as "camera smooth at 24fps, elements stepping at 12fps"; making the camera step too would go against the measurement.

## QA (`scripts/qa.py` in the skill, final version after revision)

| Shot | Measurement window (in-shot seconds) | Motion area % mean/peak | Static frame pairs % | Jump frames | Time per frame mean/peak ms | Determinism |
|---|---|---|---|---|---|---|
| y2_s1 | 0.35–2.58 | 11.02 / 16.71 | 3.1 | 0 | 17.4 / 20.3 | ✓ pixel-identical |
| y2_s2 | 1.1–3.28 | 16.09 / 76.76 | 3.1 | 16 (continuous 2.77–3.28s) | 23.4 / 52.2 | ✓ pixel-identical |
| y2_s3 | 0.35–2.08 | 7.77 / 37.41 | 0.0 | 14 (continuous 0.39–0.83s) | 73.3 / 88.5 | ✓ pixel-identical |

Transition smoke test (render each transition once, slowest frame): y2_s2 (same) 55.2ms; y2_s3 (hardcut) 43.8ms

How to read:
- **Shot 2's jumps** are continuous from 2.77–3.28s: they are the 0.6s push into the small photo on the wall, pushing to 9.6×.
- **Shot 3's jumps** are continuous from 0.39–0.83s: they are the 0.85s pull back that reveals after the hard cut.
- Both are full-screen zooms, and are in-design camera motion. The hard cut itself lands on shot 3 frame 0, outside the measurement window.
- **Static frame pairs 3.1%**: comes from the element layer's on-twos (12fps stop frames). In the first version the opening camera did not move and this number was 16.9%; after the review noted "0–0.9s completely static" an opening slow push was added, dropping it to 3.1%. This number going down does not mean it got better: a constant slow push can press static frame pairs very low and still read like flipping slides; the right fix for a static opening is to make the first event happen earlier.
- **Shot 3 at 73/89ms per frame** is the heaviest of the three: the Huashu sticker does 16 offsets per frame to pad its white border, and the black card-stock grain has to be drawn too. To speed it up, recompute the sticker only when the pose changes at 12fps and reuse it on the other frames.

Re-run: `uv run scripts/qa.py --project scripts/engine --film demos/y2_vox --out <dir>` (the table above is from the experiment; for the re-run after collection into the skill see the regression table in doc 09).
