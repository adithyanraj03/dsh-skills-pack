# 07 · Proven practices: what has been shown to work

This page records reusable practices, evidence, and the conditions under which they apply.

This page records only **things done right**: the practice, the evidence (what was measured / who reused it successfully and under what conditions), why it works, and when to use it. Pitfalls live in each reference file under "Pitfalls hit". Every entry carries its source; when a later reader reuses it successfully, add a line to the evidence; when reuse fails, write down the boundary.

---

## 1. Directing and mechanics

**1. A transition = the signature language of the next style.**
- Evidence: all 15 transitions in Art History Speedrun were designed this way; two independent agents in transfer tests A and B both rated it "the most valuable, most transferable sentence in the whole skill", and 9 new transitions (gold-leaf spiral spreading out, The Scream's colour bands pressing down, the flying apsara's ribbons peeling off the old painting, polka dots growing, melting drips, hard-edged sunlight, wet paper blooming, VHS tearing…) were derived almost directly from that one sentence, with no detours.
- Why: a transition does two things at once — it says goodbye to the old style and previews the new one. Within 0.3 seconds the viewer knows "who is next".
- How to use it: list the new style's most recognisable formal elements (material, brushwork, motif, medium failure), pick one that can go "from nothing to full screen", and build it as a process that grows out of some object inside the frame (the cat, the cup, the head).

**2. Speedrun / time-travel films: one skeleton, one choreography, N ways of painting = "the same pair of characters travelling through time" for free.**
- Evidence: RIG.girl/RIG.cat return a Path2D plus anchors, reused by all 36 styles; both A and B said "when the style changes, the person and the cat stay in place, stance and action line up automatically, and you get that effect for free".
- How to use it: only for speedrun / time-travel films built on "the same scene, changing styles": fix the character skeleton and the motion curves first, then write the styles, and let a style change only "how it is drawn", never "where it is and how it moves". Other subjects are composed per subject; the style itself may also decide composition — do not carry over this skeleton's staging.

**3. The protagonist's action must be continuous across segments and run on whole-film time.**
- Evidence: in the first version of transfer test A each segment re-ran the drink on local time, and the review said, verbatim, "what the viewer sees is her raising the cup five times, not one instant repainted in five styles"; after switching to whole-film time (`PAINT.cupCycle(t)`), the pose matched on both sides of every transition and the "two heads" continuity break also disappeared.
- How to use it: in speedrun / time-travel films, all character action runs on whole-film time t; only "a performance exclusive to one segment" uses local lt.

**4. A beat grid plus beat-point impact applied to both the old and the new layer.**
- Evidence: v1 applied the impact only to the new layer, and review measured the first 6 of 15 transitions dragging 0.1–0.17s behind the beat; after applying it to both layers at once, the first frame change in all 15 transitions landed on the beat (±2 frames), with beat-frame differences of 7–33.
- How to use it: in any cut-to-the-beat edit, the beat frame must carry a whole-screen visible change.

**5. Open by letting the first image "paint itself".**
- Evidence: in the ink-wash segment of transfer test A the first 0.45 seconds write the brushstrokes out in a reveal and let the ink bleed spread; review approved it, and frame 0 is no longer a blank sheet.
- How to use it: when the film's first segment has no transition to borrow from, open with that style's "making-of process" (strokes written out, print colour plates laid down one plate at a time, pixels lighting up row by row).

## 2. Visual beauty

**6. A regional palette matters more than colour jitter.**
- Evidence: the first Van Gogh version only jittered colour and came out as "noise in the same blue"; only after each region got a 7–8 colour group (`P.swatch`) did Van Gogh appear. A's Munch (one group each for sky / fjord / mountain / wall / floor) copied this directly and worked.
- How to use it: for any brushstroke / colour-dot style, define the colour groups by region first, draw every stroke from its group, then mix in 30–45% of the underpainting colour to keep the light and shade.

**7. Give large areas to the renderer, put small props and characters on their own layer, and add linework last.**
- Evidence: the sunflowers and the table legs were smashed into a mush by the large strokes and became clear once split into layers; B's Hopper "dual-version light-and-shadow crop" is an extension of this rule.
- Boundary: ink wash, printmaking, and pattern pipelines run in a different order (paper is the base and ink is only added on top; the pattern itself is the renderer), see doc 04.

**8. Characters must go through the same renderer, or they look like pasted-on cut-outs.**
- Evidence: among the 36 styles, the ones where characters also went through the renderer (Van Gogh fine strokes, mosaic stones, 8-bit pixels, faceted planes, black-figure silhouettes, shadow-puppet cut-outs) blended best; the ones that only flat-filled a vector skeleton (ink-wash figures 6/10, Ghibli figures "like flat vector", Dalí "leaning vector illustration") were the weakest point of their segment.
- How to use it: after flat-filling a character, apply at least one "material treatment of that style" — brushstrokes, grain, paper-texture multiply, ink-bleed edges, halftone dots, plate misregistration.

**9. Drawing the lettering in a style as paths looks more in-style than using a font.**
- Evidence: B's Cyrillic block letters (5×7 modules) and neon-tube kana; Rome's mosaic lettering (monospaced heavy strokes, each stroke ≥2 stones wide). A font subset with missing glyphs silently falls back to a system font, and the look changes on another machine.
- How to use it: draw titles, signs, and cartouches as paths in the style's material first; when a font is unavoidable, verify the glyphs are present first.

**10. The material's physical process is the renderer.**
- Evidence: ukiyo-e "flat colour offset (3,2)px against the ink lines + bokashi horizontal brush streaks" = colour woodblock printing; mosaic "lay out once, let colour flow through the stones each frame" = how real mosaic animates; gold leaf "horizontal brushed noise with y frequency 20× the x frequency" gave metal on the first try and was reused directly by A's Klimt.
- How to use it: before writing a new renderer, ask "how is this painting actually made in the real world", and turn that process into code.

**11. Small things have to be drawn bigger than instinct says.**
- Evidence: the ukiyo-e wave claws did not read at 22–50px and only at 44–74px did they become The Great Wave off Kanagawa; A had to scale Qi Baishi's shrimp 1.45× and the flying apsara 1.35× before they read.

## 3. Motion

**12. Art-style frames: each act = one main action + 2–4 small loops taken from that style's motifs.**
- Evidence: plain image cutting cannot express motion inside the painting; in the 16 segments built this way, qa motion area was 1.6–14%, with no jumps anywhere.
- Boundary: this rule covers art-style frames (the painting must stay alive). Explainer shots follow item 29 — motion lives on events.
- How to use it: take the motif motion list from the breakdown's motion heatmap; without a reference film, list the 3 most recognisable formal elements of the style yourself and pair each with one way it can move.

**13. Let the direction field vary continuously over time instead of reseeding the boil at 8fps.**
- Evidence: a whole-screen 8fps reseed gave frame differences of 18–20 (larger than a transition) and review read it as "the painting is flashing"; after fixing stroke positions and letting the direction field sway continuously, jumps were 0 and motion area 9%. Boil is reserved for line art only.

**14. The modulo period of a scrolling pattern equals the pattern's real period.**
- Evidence: A's polka-dot skirt used spacing as the modulo and the wrap frame jumped across the whole patch (2.7× frame difference); modulo on the hexagonal grid's two-row period made it disappear.

## 4. Stability and efficiency

**15. Spec + benchmark implementation + grouped parallel agents, passing first time.**
- Evidence: 16 eras in 4 parallel groups, 30–35 minutes per group, all delivered usable on the first pass; the later 4-group transfer test (20 new styles) was likewise single-pass. The spec spelled out interfaces, available libraries, hard requirements, self-checks, and delivery notes; the benchmark implementation made the "five-layer structure" copyable.

**16. Always send an independent review agent before delivery, looking only at the finished film.**
- Evidence: the v1 replica review caught 4 classes of problem — late beats, whole-screen flashing, too static, cat breaking character; transfer A's review caught "raised the cup five times", "two heads", "transparent arm"; B's review caught "ЧАЙ read back as ЧАИ" and "the pink outfit looks like no clothes" — none of which the maker found across 3 viewings.

**17. Acceptance by numbers: qa.py.**
- Evidence: motion area, static frame pairs, jumps, real elapsed time (with a forced GPU flush), and determinism — 16 segments verified in 40 seconds. Checking only first-vs-last differences misses stutter (A: Klimt showed 33% change but 14/48 frame pairs were static); measuring only JS time reports a fake 1ms (B).

**18. Seed every random source; rendering the same instant twice comes out pixel-identical.**
- Evidence: all 36 styles passed cold/hot render comparison; renders do not flicker and can be re-rendered in chunks and concatenated.

**19. Cache all static parts; each frame draws only what moves.**
- Evidence: Bauhaus 2.5ms, Pop 5ms, 8-bit 3ms; 4 of B's 5 segments cached the entire base plate. The heaviest, Van Gogh (three full-frame passes of strokes), at 117ms still rendered the whole film at 60fps in under 2 minutes.

## 5. Breakdown and reference

**20. Use reference frames as image-generation references to lock composition; overlay a grid on AI character sheets to read key points.**
- Evidence: with an original film frame as the reference, gpt-image overlaid 50% on the original nearly matched pixel for pixel; the first version of the girl's skeleton was handwritten from coordinates and read as a boy, and after overlaying a 20px grid and reading the points, one round produced a readable 17-year-old blonde girl.

**21. The motion heatmap tells you before you start that "the painting is alive".**
- Evidence: before looking at the heatmap I assumed each segment was a single painting; the heatmap showed 2.5–34% of the area moving in every segment, which decided the whole approach.

**22. For grid fitting, use "the largest step that keeps 80% inliers".**
- Evidence: least-residual fitting picks a tiny step to force-fit every point; after the change, 16 detected points fitted a period of 14.1 frames (an eighth note at 128 BPM), and 3 false detections were flagged as outliers.

## 6. Scaling up (2026-10-04 evening, integrating the 36 styles)

**23. Let independent agents each build their own wheels first, then consolidate into one library.**
- Evidence: the 4 transfer-test groups each wrote their own brushes / renderers / post effects, and integration merged them into brush.js (7), render.js (14), post.js (6); after porting 20 segments onto the unified library, 16 were pixel-identical to the original projects outside the character box — the library's API was enough to carry real usage.
- Why: unifying the library first designs abstractions nobody uses; let real styles grow first and only put into the library what appears more than twice (the inverse of "three lines of duplication beat premature abstraction" also holds: at the third repetition it should be collected).

**24. The transfer test is itself the best requirements document.**
- Evidence: a brief of "read only the skill, build a style the skill does not have, write feedback" got the 4 agents to return over 60 concrete issues between them (silent degradation, hard-coded film length, timing without a flush, skeleton bugs, mislabelled dabs), each with a reproduction scenario; none of them surfaced when the author used it himself.
- How to use it: every time the skill gains a major capability, send 2 skill-only agents at a task they have never seen and require them to report back "what helped / where you got stuck".

**25. Acceptance tooling has to be accepted too.**
- Evidence: qa.py once went all green, but integration revealed it never executed transition code at all — one transition referenced a nonexistent function and the whole frame crashed without a report; a "transition smoke test" only then caught it. A glyph check that used measureText comparison under-reported on a Mac and was changed to read the font file's character table.
- How to use it: deliberately break every check once (delete a scene, write a broken transition, use a missing glyph) and confirm it really does turn red.

## 7. Video animation grammars (2026-10-04 evening, 5 YouTube + 3 tech-finance)

**26. Measure real sample films before defining a grammar.**
- Evidence: G1's first Vox version used a torn-paper transition, but frame-by-frame counting of 5 Vox sample films showed it never once appeared; the whiteboard's first version pushed in on thought bubbles, which the RSA samples do not have either. G2 measured one TheOdd1sOut film: average shot 2.4 seconds, seven out of ten adjacent frame pairs completely static — the opposite of the instinct that "animation should always move".
- How to use it: before building a grammar, run `breakdown.py` on 2–5 representative works to measure shot length, static ratio, and transition types, then write the card. The "style features" in your head are often someone else's.

**27. The camera is decided by whole-film time alone; the transition function only composites the two shots.**
- Evidence: Kurzgesagt's 60× zoom scale traversal stays vector-redrawn and sharp throughout; in Vox's desk and whiteboard the "transition" is the camera move itself, with qa jumps 0. G3: for a push-in transition let the old shot keep pushing its own camera instead of enlarging a screenshot — to pass through a circular object the zoom factor must be ≥ 1100/radius, or the last frame jumps.
- How to use it: world canvas plus viewport; never do a zoom transition on an already-rendered bitmap.

**28. The "reveal" frame is the accent.**
- Evidence: G2's kinetic type sets the segment start to "bar line − reveal point × transition duration" so every visual event lands on the same frame as the kick drum. This and item 4 (beat-point impact on both layers) are two cases of one principle.

**29. Static does not mean stuttering; but "one move per shot" and "a slow push per shot" are the same disease.**
- Evidence: in storytime, seven out of ten frames being static is the style (the joke lands on "cut to a reaction close-up with the mouth shut"); in kinetic the letters stop moving once they land and the sense of motion is handed to the camera and background. A Nobel-Prize literature explainer (2026-10-08) with the same voiceover, the same material, and the same 31-shot storyboard: r2 pushed in 7.5% at a constant rate on every shot, plus a fixed rice-paper ground, title bar, and picture frame, and the author said "it feels exactly like a PPT, it is terrible"; r3 switched to full-bleed live footage, dark real environments, and no page frame, and changed the camera to hold → 0.28s push in 18–32% → hold, 0.30s lateral pan at the same zoom, 0.17s slam, and was approved. Fully static frames rose from 16% to 72% and fast-moving frames from 0.7% to 10%. Four things changed at once, so it is impossible to tell which one did the work. After that, "fast push at every voiceover node" was written up as a global rule; a 102-second Nobel-Prize economics short on 2026-10-12 pushed in about 48 times, all inward, and the author said "too many times, and the rhythm is too fast, not smooth at all"; the author rewatched the literature film the same day: "the literature film is pretty ordinary".
- How to use it: qa's "static frame pairs >40% read as stutter" does not apply to explainer, story, or text-led work — holding still is correct there. The root of a PPT feel is "the same move on every shot", whether that move is a slow push or a fast push. Move the camera by "what the viewer should be looking at right now": use slow push, pan, and pull back for transitions (0.6–1.5s), and reserve fast push and slam for accents; after pushing in, there has to be a way back out. For the motion table and for when the number of moves matters, see `camera-language.md`.

**30. Review must check logic and number definitions, not just the picture.**
- Evidence: G3's review caught "the output neuron is connected to the hidden layer, not to pixels", "'rose 9×' should be 'rose to 9× the original'", and "the monthly chart's final ¥268 does not match the daily candle's final ¥286.40" — three cases of perfect picture, wrong content. Hard rules for finance charts: axes must not be truncated in a misleading way (if truncated, state explicitly "vertical axis does not start at 0"), plus units, sources, and an illustrative-data corner label.

**31. One focus per screen; structure first, then data, then label only one thing.**
- Evidence: kinetic — "the key word slams in, the rest rise from a mask"; finance — "axes first, then data, and finally label only one thing"; 3b1b — "one colour per concept, morphing turns the previous concept directly into the next, with almost no cuts" — three grammars independently reaching the same conclusion.

## 8. Characters

**32. Give people to the image-generation model and let code do only compositing — divide the work by "who is better at it", not by "how pure the pipeline is".**
- Evidence: a three-way comparison on the same frame judged the code-drawn chibi "absolutely terrible" and both the G2 frame library and the AI frames repainted in the style "very good"; the most common weak point across the 36 styles is also characters. Code is good at regularity (stroke fields, geometry, camera moves, timing, physics, determinism); the model is good at getting faces and human forms "right".
- How to use it: see doc 10. Ask of every layer "who draws this best", then decide what draws it.

## 9. Plugging into the voiceover pipeline (2026-10-04 night, end-to-end test)

**33. Render clips at the finished film's frame count, taking the window from the finished-film timeline — crossing cuts and speed changes needs no special handling.**
- Evidence: between the two beats to be replaced sat a 3.65-second pause that the rough cut had removed, and the rough cut had also been sped up overall; rendering them as one continuous stretch of finished-film time (119 frames) and swapping it in gave `rate` = 1.0 for that shot after compiling, 119 rendered frames = 119 shot frames, with only 1 chapter (30–57 seconds) re-rendered and the other 7 untouched. Comparing chapter against clip frame by frame, the frames where the picture moves, 28/29 and 127/137, showed offset 0 (the rest is encoding noise, symmetric plus and minus).
- Why: the pipeline's directing layer uses source seconds and the finished film uses finished-film seconds; animation lives only in the finished film. Taking the window from the finished-film timeline sidesteps three conversions: speed change, cut, and "beat end = next start".
- How to use it: in the voiceover pipeline, write a small script wrapping the three steps "draft (take the window from the finished-film timeline, emit a spec draft) → render → verify (check sync frame by frame)", see doc 09, "Clip contract".

**34. Write cues as "which word", not "which second", and convert to frames just before rendering.**
- Evidence: for 5 cues (bar growing, annotation popping, clipping appearing, two highlighter passes) the reveal frame differed from the word start by −0.48 to +0.09 frames, all from frame rounding; when the voiceover changed or the window frame count shifted, render refused outright instead of silently drifting.
- Why: seconds are second-hand numbers copied out of the word list, and every copy can be wrong; the word is the director's real intent (the annotation pops when a certain number is spoken), and the conversion belongs to the script.
- How to use it: `{"word": "7.8", "kind": "highlight"}`; for repeated occurrences of the same word add `nth`, and write `offset` in advance when it needs to lead.

**35. Vertical format with real screenshots: split into two highlighter passes at the half-sentence the voiceover has reached, one keyword each.**
- Evidence: framing the whole passage (width 0.93) left no room for the red circle, the camera could not push in, and the body text was about 20px tall, unreadable on a phone; splitting into frames for two half-sentences, each aimed at one keyword, allowed a 2.4× push-in and about 50px text; when the second frame was off-screen the camera moved over first, then revealed.
- Why: the bottleneck in vertical format is frame width, so one focus can only be half a sentence; Vox is already a "look at this sentence" grammar, and circling along with the voiceover sentence by sentence fits it exactly.
- How to use it: crop screenshots from an unmodified frame (keep a `_source-frame` copy), and render a test still with `--stills` for each rect first — eyeballing is usually off by 20–30%.

**36. Grammars with lettering make room for the subtitle band, instead of making the subtitles make room for the animation.**
- Evidence: t3's vertical-format original layout put the annotation at y≈1460, overlapping the burned-in subtitles (1400–1520); with `safe` added, the chart sits at 300–1430, inside the same safe area as the film's other contain material, with zero occlusion when frames are pulled. The first independent review said "full-screen pure white wedged between dark screenshots is the most obvious brightness jump", so `safe.fill` = the film's base colour was added, the top and bottom bands became the same dark base as the adjacent screenshots, and the chart became a card in the same place.
- Why: subtitles are burned in uniformly at export, and moving them per segment means touching the export chain; the animation is parametric, so moving itself is the cheapest option.
- How to use it: write `safe` in the spec (the pipeline's draft computes it from the ASS and contain_box).

## 9. From demo film to reusable clip

**33. A good demo film ≠ still good after parameterisation; parameterised clips need their own review.**
- Evidence: demo films for all 8 grammars passed independent review, but re-reviewing them after extraction into spec-driven clips left only 3 directly usable: swapping in real data exposed tick-rounding errors, category labels being dropped, and big numbers overrunning the axis head; the subtitle-yield parameter was ignored in 6 of 8; the camera left before a text card finished typing; and the whiteboard's last frame had the pen covering the last character, reversing the meaning. Demo inputs are chosen by the author, clip inputs come from the pipeline.
- How to use it: review parameterised clips with different inputs — negatives, decimals, long titles, vertical format, no screenshots, transparent background, overlong text — feeding at least one "unfriendly" spec per case; the sample material used for acceptance itself also has to be clean (do not use a table-of-contents screenshot as the example).

## 10. Plugging into voiceover video

**34. Render animation segments on "finished-film duration + word-level timing", with keyframes on the key words.**
- Evidence: in a copy of a vertical voiceover film, two segments within one chapter were replaced with animation (t3's finance chart explaining a set of number comparisons, y2's Vox pushing into the official screenshot of the source text), the frame count matched the shot exactly, and 7 key words were off by −0.48 to +0.09 frames.
- Why: animation appears only where screen recording cannot explain it (a number comparison, one official quote), with real footage and screen recording before and after; the visual event reveals only when he reaches that word, as if he were pointing at it while talking.
- How to use it: given a beat → take finished-film duration and word-level timing → generate a spec → render → freeze and write back (interface in doc 09, "Clip contract"). Numbers come only from the source table, and the source is written on the image.

**35. Do not add narrative beats he did not ask for.**
- Lesson: piling decorations onto a character over time steals attention from the scene; narrative beats should be confirmed in a sample first.
- How to use it: what review points out as "missing" is information for his judgement, not authorisation for me to add things outright; to add a structural beat, show it in a sample or a direction note first and wait for his nod.

## 2026-10-05 00:34:23 +0800 · Allocating grammars by explanation task on one voiceover

Practice: real original posts / sample drafts use the Vox desk for line-chasing and highlighting; rules / controlled variables / sound-image relationships use 3b1b's continuous object transformation; fix the voice, subtitles, and timeline first, then replace the visuals. Evidence: one voiceover film's 467.8-second narration and 270 subtitles were reused across a complete visual-style rebuild, and the two final MP4s' raw AAC packet hashes matched the locked mix; no post-publication retention data yet. Why: the picture carries the explanatory action of its paragraph and the material serves legibility; the grammar permits stillness after reading a chart or finishing a derivation, instead of faking motion with small decorative background movement. Applies to: voiceover films alternating real material with mechanism explanation.

## 11. Long-scroll time-travel films (Huashu travelling through famous paintings, 2026-10-05)

**36. One skeleton file plus per-segment parallelism: 24 worlds from 4 groups of agents, assembled on the first try.**
- Evidence (the skeleton and 3 of the segments are in `scripts/engine/demos/long_scroll/`, method in doc 11): `lib/world.js` defines only the segment interface (width, ground line, walk frames, interaction at/dur/frame, back/front/seam), the protagonist's travel, the protagonist cut at boundaries, and the corner label; four groups each wrote 6 segments, and sorting by era assembled a 123.7-second film on the first try with qa determinism ✓ and jumps 0; review checked ground height and protagonist continuity across 23 boundaries and all passed. The key is the whole-film constants (ground line 760, body height 300, walking speed) hard-coded in the skeleton.
- How to use it: for a long film write the skeleton and interface first, then dispatch the groups; in the interface **all events are timed relative to "interaction start"** (`WORLD.actT`, `item.atAct`), never as "second N after entering the segment" — the whole-film walking speed later went from 330 to 560 and not one segment needed a timing change.

**37. Fine-tuning each segment's tempo puts the music boundaries on the first beat of the bar.**
- Evidence: with 24 boundary times fixed, even the best single BPM was off by 112ms; after giving each segment a whole number of beats and trimming tempo within 86–104 BPM segment by segment, all 24 boundaries landed on the first beat of the bar, with a maximum error of 11.7ms and a mean of 3ms.
- How to use it: when the picture is locked first and the music is fitted after, do not insist on a single BPM; the ear cannot hear a ±8% tempo difference between segments, but it can hear an instrument change that misses the downbeat.

**38. The camera only moves forward, never back.**
- Evidence: in v1 the camera moved forward to make space during interactions and pulled back at the end, and 17 of 24 segments showed a 68–256px "rewind" that qa could not measure but review spotted at a glance; after changing to "target position = historical maximum + Gaussian smoothing" there were 0 backward moves in the whole film, and neither stopping nor starting jars.
- How to use it: for a horizontal long scroll tracking the protagonist, make the camera position function monotonic; adding a "camera backward count" check to qa would be better still.
