# Y3 · Whiteboard hand-drawn explainer (RSA Animate type): video animation grammar card

In one line: the speaker says a sentence and a hand writes that sentence and draws a diagram on a big whiteboard; the camera follows the argument across the board, and at the end it pulls back so the audience sees the whole argument as one drawing.

Demo film: `scripts/engine/demos/y3_whiteboard/` (render `render.py --film demos/y3_whiteboard`) (8s, 3 shots, 2 kinds of transition + a closing pull back), overview: `assets/animation-grammars/y3_whiteboard_overview.jpg`
Basis: research on this style (the original research text and per-frame data stay in the experiment archive and were not collected into the skill; the numbers used are excerpted in this card). Measured RSA Animate "Changing Education Paradigms" and Minute Physics "Why is it Dark at Night?", and also checked VideoScribe's and Doodly's official documentation and first-hand statements from Andrew Park and Henry Reich.

**Pick one grammar first, do not mix**:
- RSA type: one big whiteboard, the camera moves across the board, 5.3 times per minute.
- Minute Physics type: one page per sheet, hard cut between sheets, 8.1 times per minute, the camera does not move.
- This card and the demo film follow the RSA type. The key points of the Minute Physics type are in ④ and ⑧.

## Before you start

1. **Drawing little and writing much is a storyboarding-layer problem — decide the visual metaphor before you start drawing.** For each board, first write down the object or gag to be drawn, then decide the words; a handwritten full sentence is no longer than one line. Count it: if more than half the characters on the board coincide with the VO's original wording at that moment, it is drawing little and writing much, and no amount of puns or icons added in post can save it.
2. **Block templates must rotate.** Blocks with the same structure, such as "year → object → orange label" or "dot → one line → one icon", are not used more than 3 times in a row in the whole film; switch to a comparison (two panels left and right), a process (chained with arrows), a zoomed-in detail, or one whole large drawing.
3. **Do not hand-fill camera coordinates when framing.** Reverse-compute from the bounding box of this segment's strokes (frame it, then leave margin); old text cut in half at the frame edge gets pushed off-screen.
4. **Line type is fixed from the first stroke.** Solid = has happened, dashed = planned, dotted = cross-segment lead line; things on the board can only be erased or kept, never fade out.
5. **Run every object's shape past "could this be read as a crude shape".** Round heads, sides flaring outward, and long vertical things with round bottoms are the most likely to go wrong; change to a pointed head and a flat bottom before drawing.

---

## ① When to use it

**Use it:**
- Argumentative content: talks, opinions, causal chains, historical threads. Content where concepts have relationships and can be drawn as one map fits best. Andrew Park's own words are "put the information in space so people can see the relationships between things" [primary source].
- A short science explainer on one chain of reasoning, go Minute Physics type.
- The VO pace is steady and the keywords are clear. RSA's writing speed is roughly equal to speaking speed, like "subtitles being handwritten" [measured].

**Don't use it:**
- Content that needs precise data charts; hand-drawing error is large.
- Content with complex action and spatial relationships; the whiteboard has no depth of field.
- Content that needs emotional intensity; single-colour line art expresses it weakly.
- Wanting it to "improve comprehension": Türkay 2016's experiment did not find whiteboard animation taught better than other formats. Its value is in holding attention and in companionship [secondary source].

## ② Frame composition

- **Palette** (measured on RSA):
  - ground: pure white `#FBFBFB`
  - line: black `#0A0503`
  - the only accent colour: orange, text `#EB701F`, fill `#F3742D`; a light orange face hatched with diagonal lines about `#E9A67C`
  - orange is about 22% of all stroke pixels, used only on keywords and diagonal hatching.
  - Minute Physics instead uses pinkish off-white paper `#E7DBE1`, plus pale yellow coloured pencil `#EDE6A2` and pale blue `#B5CBE8`.
- **[This film]**: ground `#FBFBFB`, line `#0A0503`, accent `#EF7226`. The cat's body is laid in with 22% opacity orange.
- **Line width**: RSA strokes are about 0.6–0.7% of frame height, about 6–7px at 1080p; shadow hatching about 0.3%; title text height about 5.5% of frame height. Minute Physics lines are thicker, about 0.8% [measured]. [This film] line width 6.5px.
- **Composition**:
  - RSA is "plan the final whole drawing first, then draw it backwards" [primary source].
  - each framed area holds 3–6 image-text blocks, and fills up before the camera moves on.
  - one smooth move travels only 0.23 frame widths, so old and new areas overlap heavily and the audience always sees the edge of the previous block [measured].
  - the whole drawing revealed at the end is a very long horizontal long scroll.
- **Type**: RSA is all-caps handwritten lettering (comic dialogue lettering). [This film] uses LXGW WenKai for Chinese, subset into woff.
- **Hand**:
  - a real right hand holds a black marker, entering from the **lower right**, forearm angled to the lower right, covering 15–25% of the frame.
  - when not drawing, the whole hand leaves the frame. Hand time on screen: RSA 49%, Minute Physics 40% [measured].
  - [This film] the code-drawn hand: a bare forearm with shading and hair, index finger pressing a black marker, scale 0.82, gently swaying at 7 rad/s.

## ③ Motion paths

- **Writing speed** [measured, 9 cases]:
  - body text median about 16 characters/s.
  - opening titles half that, about 7.5 characters/s, used to "state the theme".
  - the VO is about 13 characters/s, so writing speed roughly equals speaking speed.
  - [This film] body 16 characters/s; "Cat?" written at title speed 7.5 characters/s.
- **Drawing speed** [measured + generalised]:
  - small icons 0.5–1s, a person's head about 2s.
  - the median new ink area for RSA is 0.25% of the frame per second.
  - complex illustrations are not drawn in front of the camera: either draw them in advance and reveal them as the camera moves there, or hard-cut the whole thing in and let the hand only fill colour.
- **[This film]**:
  - line pen speed 2600 world pixels/s, about 2× RSA's live action. An 8s demo has to be compressed; slow it down for a real film.
  - stroke duration is length divided by pen speed, at least 0.04s per stroke, 0.02s pen-lift gap.
  - within each stroke use sineInOut, slow at the start and the end.
  - Huashu (the author) is revealed by a 0.7s "Reveal": the pen tip walks an 8-line zigzag inside his joints' bounding box, and `DG.revealMask` turns the covered area into a clip so the line art only appears inside the clip.
  - the first version used `setLineDash` per part and drew everything at once with the pen tip following the joints; the review judged that "the pen does not lead the line", so it was changed.
  - Chinese characters have no stroke-order data, so each character is revealed with a 3-line zigzag, the pen tip going back and forth, which looks like writing.
- **Speed multiplier**: Henry Reich shoots 1 photo per second and holds 2 frames on each while drawing, equivalent to about 12× speed. RSA is inferred at 5–8× [primary source + inference].
- **Pop-ins "without the hand"**: some of RSA's orange keywords pop in whole in post, not hand-drawn (ANAESTHETIC, CREATIVITY) [measured]. [This film] "×10 million images" and "It's a cat!" pop in with 0.3s backOut(2.2), and the hand does not go over.
- **Pen tip path**:
  - when the gap between two strokes is <0.25s, the pen tip slides from the end of the previous stroke along an arc to the start of the next (sineInOut, lifted 30px).
  - when the gap is longer, lift the pen out of frame: 0.35s cubicIn retreating to off-screen lower right.
  - 0.3s before the next stroke starts, come in from the lower right with cubicOut.
- **Continuous motion**: the "life" of a whiteboard film comes from the hand always drawing. RSA's drawing activity and speech word density are almost uncorrelated (|r|<0.07): when the speech pauses, the hand does not stop [measured].

## ④ Transitions (5 common ones)

1. **Smooth move or push/pull on the board** (RSA's mainstay, 41 times).
   - 1.2–2.4s, **easeInOutSine**: measured peak/mean speed 1.49, the theoretical sine value is 1.57.
   - one pan travels about 0.23 frame widths, overlapping the previous block by about 75%.
   - [This film] transition B: 0.9s sineInOut (4.7→5.6s), a diagonal move of about 0.5 frame widths while pushing to 1.12×. When the move starts the hand is drawing an orange connecting line toward the new area — the hand leads the camera.
2. **Whip pan**: a fast pan plus motion blur, about 0.8s, travelling 0.5–1.2 frame widths in one move, used to jump to a far area of the board (RSA 15 times).
   - [This film] transition A: 0.8s cubicInOut panning about a full screen. Only during these 0.8s is blur made by stacking 9 samples along the velocity direction; smooth moves and pull backs stay sharp.
3. **Pull back to reveal the whole drawing** (ending).
   - RSA's ending: grey fills the frame → 0.6s fast pull back → about 9s horizontal pan across the long scroll → pull back again to see the whole drawing.
   - VideoScribe has "Zoom at end?" checked by default [primary source].
   - [This film] 6.85→7.5s sineInOut pulling to 0.45×, holds 0.5s, while the whole board lays in a very light grey `#EEEEEC` over 0.5s.
4. **Cloud or explosion wipe**: cartoon smoke puffs fill and then disperse, about 1s (RSA 1 time).
5. **Hard cut**: hard cut to a pre-drawn image (RSA, a few); Minute Physics type changes sheets by hard cut (mainstay, 8.1 per minute); Minute Physics inverts the whole frame when it talks about night.

**Caution**: "push into a picture frame or a thought bubble" and "page turn" do not appear in the samples. The first version of this film did a "push into the thought bubble"; after reading the research it was replaced with a whip pan plus a smooth move.

## ⑤ Rhythm and text

- **Hold per block**: median 6.6s between camera moves on RSA (quartiles 4.0–13.8s); Minute Physics median 7.1s per shot [measured]. The 8s demo film holds 3 blocks, about 2.5× a real film's density.
- **Aligning with the VO (the core)** [measured]:
  - writing starts 0.2–0.8s after the corresponding phrase starts, median +0.5s.
  - finishes within 1s after the phrase ends: write while speaking, slightly behind, **never ahead**.
  - the exception is visual setup (pill bottle, arrow), drawn a few seconds early to wait for the line.
  - Minute Physics drops the image the moment the noun is said, median +0.3s.
- **Transitions cut on topic, not on pauses**: a new board corresponds to a new argument [measured + generalised].
- **Music**: RSA has **no music** under the speech. Minute Physics has music all the way through, about 9dB below the voice [measured].
- **Tool defaults**:
  - VideoScribe's hold after drawing defaults to 0.5s [primary source], camera moves default to 1s [secondary source].
  - Doodly defaults to 3s to draw each asset [primary source].

## ⑥ Implementation notes

> After collection into the skill (2026-10-04 v0.4): the general functions in this card's "new" section have been unified into `scripts/engine/lib/` (names changed to the unified MO / CAM / DG / TY / CH / UI / CL / TOON), and the demo film's own code is in `scripts/engine/demos/y3_whiteboard/`. For the library quick reference and "how to choose a grammar for a piece of VO", see `references/09-video-animation-grammars.md`.

- Reused from the skill:
  - `KIT.densify / KIT.resample`: Catmull-Rom densification, then arc-length equidistant resampling; `DG.hand` adds low-frequency noise on top
  - `PAINT.noise`, `PAINT.cached`
  - `HUASHU.build/pose/details`: Huashu line art
  - engine transition interface
- New, now unified into the library (`lib/diagram.js` / `camera.js`):
  - `DG.cum / DG.pointAt / DG.drawPartial`: draw a polyline out by length, return the pen tip position.
  - `CAM.at`: keyframed camera.
  - `CAM.motionBlur`: motion blur.
  - `DG.revealMask / DG.zigzag`: zigzag reveal mask (added after review).
- The demo film's own (`demos/y3_whiteboard/whiteboard.js`; the stroke timeline, pen glides, and marker are now in the library as `DG.board` / `B.penAt` / `DG.pen`):
  - **stroke timeline**: `addLine / addText / addPop / addFill` are ordered, durations are computed automatically from length and speed, and on delivery `Y3.timeline` is printed to check each block's end time. In the first version the second block was scheduled to 7.9s, 2.5s after the camera move, and this number is how it was spotted.
  - `drawStroke`: five kinds — line, text, pop, fill, character. Text and characters are both revealed with a zigzag mask, and the pen tip coordinates are taken directly from the mask's leading edge.
  - `penAt`: the pen tip's and the hand's path, including pen glides, lifting out of frame, and entering frame.
  - `drawHand`: hand and marker.
  - Eraser texture is placed in screen space, following only camera pans and not zoom, otherwise a 5× push turns it into big grey blotches.
- **Key architecture**: the three shots draw the same whiteboard with the same camera, and all transitions are `same`. The "transition" is itself camera motion, so nothing on the board can ever jump during a transition.

## ⑦ Representative works and primary references

- Samples:
  - RSA ANIMATE: Changing Education Paradigms https://www.youtube.com/watch?v=zDZFcDGpL4U
  - MinutePhysics: Why is it Dark at Night? https://www.youtube.com/watch?v=gxJ4M7tyLRE
- Andrew Park interview (Sketchnote Army 2025) https://sketchnotearmy.com/blog/2025/11/18/andrew-park
- Cognitive Media "hairy hand" https://www.hairyhand.co/about
- VideoScribe official documentation:
  - Camera and Zoom at end https://help.videoscribe.co/knowledge/use-zoom-and-set-the-camera
  - Draw entrance https://help.videoscribe.co/knowledge/draw
  - Entrance animations https://help.videoscribe.co/knowledge/entrance-animations
- Doodly defaults https://support.voomly.com/en/articles/12735753-doodly-how-do-i-customize-video-settings
- Learning-outcome study (cited indirectly) https://en.wikipedia.org/wiki/Whiteboard_animation

## ⑧ The 3 easiest things to get wrong

1. **Filling a whole block before speaking, or drawing only after finishing speaking.** The magic of whiteboard film is "say a sentence, write a sentence": writing speed equals speaking speed, about 0.5s behind the VO. Drawing first then speaking makes the audience wait; speaking first then drawing makes the drawing a redundant restatement. Do not draw complex illustrations live — draw them in advance and reveal them as the camera moves there.
2. **Cutting to the next blank screen full-frame every time.** RSA's smooth move travels only 0.23 frame widths, old and new areas overlap heavily, and the audience always knows where they are in one big drawing. Use the 0.8s whip pan with blur only when jumping far. The ending must pull back to the whole drawing; that is this type's landing.
3. **Too many colours, lines too thin or too even, the hand hanging on screen the whole time.** Use only black plus one accent colour, line width about 0.65% of frame height. The hand enters only while drawing and exits to the lower right when done; emphasis words can pop in without the hand. Also do not mix RSA and Minute Physics: either one big whiteboard with camera moves, or one page per sheet with hard cuts.

---

## Review and revision (independent agent sees only the final film, 6/10, the lowest of the three)

Review notes and how this round handled them:
- "The pen tip does not lead the line; several of Huashu's strokes appear at once; the characters are wiped out by a mask":
  - Huashu changed to VideoScribe's Reveal method: the complete line art hides underneath, the pen tip walks an 8-line zigzag, whatever the pen passes is revealed, and the pen tip is always on the leading edge.
  - characters changed to being written one by one: each character gets a stretch of time, the pen tip goes back and forth in a 3-line zigzag inside the character box, and the mask reveals along.
  - newly written `DG.revealMask` (union of same-direction rectangular bars; under nonzero, overlaps do not cancel) and `DG.zigzag`.
- "0.4s dead zone after the whip pan": the second block moved up to start drawing at 3.12s, and the hand enters as the whip pan lands.
- "The screenshot frame line crosses the cat's head": each frame fills a layer of whiteboard colour before stroking, so the front frame covers the back frame's lines.
- "'Find the pattern yourself' is cut in half by the top edge": the third block moved down 60px overall.
- "After the pull back the grey ground and eraser marks look like a dirty wall": grey ground lightened to `#EEEEEC`, eraser-mark opacity halved.
- "The wide shot holds only 0.15s, the three drawings do not connect":
  - an orange arrow pointing right added at the end of block one, so the whip pan has a direction.
  - an orange connecting line drawn at the end of block two leading to block three, the hand leading the camera.
  - pull back moved up to 6.85–7.5s, the wide shot holds 0.5s.
- "The hand is a cartoon hand with a blue sleeve": changed to a bare forearm with shading and hair, closer to RSA's real hand. Still code-drawn.

## QA (`scripts/qa.py` in the skill, final version after revision)

| Shot | Measurement window (in-shot seconds) | Motion area % mean/peak | Static frame pairs % | Jump frames | Time per frame mean/peak ms | Determinism |
|---|---|---|---|---|---|---|
| y3_s1 | 0.35–2.48 | 3.1 / 5.31 | 0.0 | 0 | 6.5 / 6.9 | ✓ pixel-identical |
| y3_s2 | 0.8–2.23 | 4.65 / 9.57 | 0.0 | 0 | 6.5 / 7.3 | ✓ pixel-identical |
| y3_s3 | 0.85–3.23 | 4.45 / 10.94 | 0.0 | 0 | 8.3 / 9.0 | ✓ pixel-identical |

Transition smoke test (render each transition once, slowest frame): y3_s2 (same) 46.9ms; y3_s3 (same) 14ms

How to read:
- none of the three whiteboard shots has a jump: every "transition" is camera motion on the same board, so nothing on the board jumps.
- motion area 3–4.7% comes mainly from the hand and the line being drawn, and is higher while the camera moves.
- under 10ms per frame, because it is all vector lines with no pixel-level processing.

Re-run: `uv run scripts/qa.py --project scripts/engine --film demos/y3_whiteboard --out <dir>` (the table above is from the experiment; for the re-run after collection into the skill see the regression table in doc 09).
