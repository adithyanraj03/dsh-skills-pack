# y5 · Kinetic text layout / infographic motion (kinetic typography)

> One-line grammar: **the words are the actors — every keyword slams in on a beat, the main word is big enough to read in one glance, the rest rise out of "slots" to line up with the ear; there is always only one focus in the frame, the camera and the background texture keep moving, and the words hold still once they land.**

Lineage: Saul Bass's *North by Northwest* (1959) title sequence is widely regarded as the first large-scale use of dynamic type in a feature film; after 2008, lyric and quote kinetic type on YouTube (the After Effects generation) turned it into the standard grammar for explainer videos, lists, quotes, and data openings.

## Before you start

1. **First confirm this segment should let the words be the lead.** Use it only for lists, quote cards, numbers, chapter cards; if a whole segment runs 30–60 seconds of nothing but words, change grammar, or insert a page of image or evidence object (screenshot, code card, chat bubble) every 2 pages.
2. **Count the characters.** Main word ≤4 characters, supporting line ≤14 characters; only one thing enters at a time. If it overflows, split the page, do not shrink the type and cram.
3. **The same page type is not used more than 3 pages in a row.** "Big type + supporting line + top-left label" flipped for 4 pages in a row is a slide deck; insert a page of number slam, a page of evidence object, or a transition that rushes into a colour block.
4. **Write every landing as a beat number or as a word in the VO.** A landing that is neither on the beat grid nor on a word gets deleted or moved up.
5. **Once the words land, they do not move.** Give the motion to the beat bump, page changes, and evidence objects entering; the main word does not drift and does not breathe.

---

## ① When to use it

**Use it:**
- Openings and chapter cards for explainers / lists / "X stages" / "3 reasons": the information is **structure** (how many, which one, from what to what), not image.
- Quotes, one-liners, one-sentence conclusions: making the audience "read while watching" sticks better than "remember while hearing".
- Number explainers: one number per shot, the number itself is the lead.
- When the VO has clear stressed words ("not writing code, **stating the requirement**").

**Don't use:**
- Storytelling, emotional arcs → there are no faces, and the audience finds it hard to empathise (use y4 characters).
- Long explanatory VO with a screen full of words → the audience only reads and does not listen, and cannot keep up with the reading either. More than 30–60 seconds of nothing but kinetic type in one film tires people out; just use it for openings, chapter cards, and conclusion cards.
- Wordy lists (>5 items) → change to a static infographic and explain it slowly.

## ② Frame composition

**Composition**: one main word per screen. The main word is left-aligned and sits on the left 1/3–1/2 of the frame (or mirrored to the right), the supporting line sits tight under the main word, and on the other side is an "evidence object" (code card, chat bubble, list). A small label ("Stage 01") and a progress rail go in the top corner. Leave at least 130px margin on all four sides.

**Type scale (demo film)**: main word 340px (PuHui 115 Black): supporting line 96px (105 Heavy): label 40px (85 Bold, tracking 6px) ≈ **3.4 : 1 : 0.4**. The main word has to be read in 0.3s, so the main word gets only 2 characters.

**Palette**: one full-frame ground colour per chapter; changing chapter = changing ground colour (the colour itself is the chapter number).

| Shot | Ground | Main word | Accent |
|---|---|---|---|
| Title | yellow `#FFD23F` | ink `#111111` | white "3" inside a coral circle `#FF5A36` |
| 01 completion | coral `#FF5A36` | white | yellow highlighter `#FFD23F` |
| 02 dialogue | navy `#14213D` | yellow | yellow highlighter, blue bubble `#3A86FF` |
| 03 agent | off-white `#F4EFE6` | ink | coral underline, green check `#2BB673` |

Four ground colours in the whole film + ink + white, and there is always only one accent colour.

**Shape language**: type is the largest shape; supporting shapes are only rounded rectangles (card r=26, bubble r=30, keycap r=22), true circles (number grounds), and slanted colour blocks (highlighter, slope 0.18). The background is a 64px-spaced dot grid (6–10% opacity). No outlined type, no drop-shadowed type (the only shadow is the 8–18% offset shadow under the cards).

## ③ Motion paths

**Entrances (chosen by "importance")**

| Element | Method | Curve and duration |
|---|---|---|
| Main word | **Slam**: scale from 1.7× to 1, opacity 0→1 in the first 0.06s | underdamped spring `1−e^(−10t)·cos(2π·2.2t)`, about 8% overshoot, settles in ≈0.35s |
| Title first word | Slam + rotation correcting from −8°→0 | same as above |
| Supporting line, labels | **Rise out of the slot**: text pushed from +1.2× its height to 0 inside a mask below the baseline | `expoOut`, 0.30–0.35s |
| Numbers / icons / bubbles / keycaps | **Pop in**: scale 0→1 | `backOut`, s=2.6–3.0 (17–20% overshoot), 0.30–0.42s |
| Cards | **Slide in**: from +700px or +260px below, with a 3.4° rotation correcting | `expoOut` 0.40s |
| Typing | truncate by character | 13 characters in 0.5s (26 characters/s), cursor blinks at 2Hz |
| Code completion | grey text flashes in over **0 frames** (completion appears instantly after all) → solid colour on Tab | keycap presses down 14%, `e^(−18t)` rebound |
| Highlighter / underline | sweep out left to right | `expoOut` 0.30s, sweeps 1–3 eighth notes after the word appears |
| Keyword scale-up | on the accent beat scale to 1.35× and pin, the highlighter scales with it | spring freq 2.5 / decay 9, on the same beat as the paired action (Tab, checkmark) |
| Giant stage number | 900px, opacity 5–13%, pressed into the lower right, falling from 1.35× to 1 then drifting diagonally at 14/10 px/s | spring freq 2 / decay 8 |
| Checkmark | the check stroke is drawn out by arc length, the box goes 1→1.25→1 at the same time | 0.22s; the strikethrough draws 0.08s later |

**Exits**: faster than entrances, with accelerating curves (`expoIn`), duration 0.18s, elements staggered 0.03s, while scaling to 0.6, dropping 60px, and going transparent. **Exits are faster than entrances** — the audience's attention has already left before the exit begins. The demo film's last beat in the title segment: everything except the "3" exits, leaving only one shape to rush into.

**Stagger**: words on the same line are staggered by one eighth note (0.25s at 120 BPM); a group of small elements (three checks) is also one eighth note apart.

**Continuous motion (words hold still; something else moves)**
- Camera micro-drift: two sine paths, amplitude 5px, periods about 7s / 2.7s; extremely slow rotation ±0.5°.
- Beat bump: every quarter note the whole frame scales 1.2%, `e^(−25t)` decay (≈0.12s) — the image "breathes" with the kick drum.
- Background dot grid pans diagonally at 36px/s.
- Final beat: the camera pulls back 6% (`expoOut` 0.5s), everything shrinks a little = "closing".

**Comparison with source films (two YouTube lyric kinetic-type reposts captured this time, 30fps)**: frames completely static next to each other account for only 10.3% (DISCORD) / 21.2% (Charlie Puth); the image is moving seven or eight tenths of the time — exactly the reverse of storytime's 71% static; large visual events (peaks where the whole frame changes >1.5%) come every 0.66s / 0.83s on average, close to **one per beat** (the two tracks are about 105 / 99 BPM, one beat = 0.57 / 0.60s). The demo film's large-event density is one per eighth note (0.25s), twice as dense as the lyric films — an explainer opening can be that dense, a long film should drop to one per beat.

## ④ Transitions (3 in the demo film + 2 common)

1. **Zoom through**: the camera rushes into a shape on the previous screen (the coral circle of the "3"); the shape's colour = the next screen's ground colour, and after it fills the frame the next screen falls from 1.25× back to 1. The first 55% of the time `expoIn` scales to 30×, the last 45% `expoOut` settles. `TRANSITIONS.fillZoom` (called zoomThrough at experiment time, renamed when collected into the library so it would not collide with 3b1b's camera zoom-through), parameters `cx, cy, k, maxZoom, fill`.
2. **Colour band wipe (bands)**: three slanted colour bands (yellow→white→navy) relay from left to right, staggered 12%, the last band is the new screen's ground colour, and the new screen is revealed behind the bands. 0.5s `expoInOut`. `TRANSITIONS.bands`.
3. **Push**: old and new pan together, like sliding to the next block on one long canvas. 0.35s `expoInOut`. `TRANSITIONS.push`.
4. **Mask wipe**: a shape (circle, rectangle bar, the character itself) acts as a mask growing from small to reveal the new screen. The skill's existing `iris` can be used.
5. **Type morph / type as transition**: one character on the previous screen scales up into a full-frame colour block, or a character whips out of frame and takes the old screen with it.

**Sync trick (the most valuable one this time)**: in the engine the transition starts from the new segment's `t0`, so the frame where "the new screen is revealed" must land exactly on the bar line; segment start = **bar line − transition's reveal point × transition duration**. Demo film: fillZoom reveal point p=0.55, duration 0.45 → start 1.75 (reveal at 2.00); bands reveal point ≈0.6, 0.5s → start 3.70; push uses expoInOut, and the eye's "arrival" is the moment of 90% displacement (p≈0.58), not p=1 → start 5.80 (the first version computed the start at 5.65 from p=1, and the review measured "the push finishes 8 frames before the downbeat"). All in-shot landings are also written as beat numbers `KT.b(n)`, not seconds.

## ⑤ Rhythm and text

- **120 BPM, 4 bars + 1 beat ending (8.5s), one shot per bar** (title / stage one / stage two / stage three); in each shot: beat 1 main word slam (+ giant background stage number), beat 1.5 evidence object, beat 2 supporting line, beat 3 evidence-object action, beat 3.5 keyword scale-up + highlight, beat 4 empty or exit; the last, 16th beat (8.0s) is the closing downbeat, then 0.5s of stillness. The four shots use the same beat positions, only swapping the side and the content — from the second shot on the audience "knows where the next hit comes", and that is exactly where the sense of rhythm comes from.
- **The main word lands on the strong beat (first beat of each bar)**, with a low-frequency impact; small elements land on eighth notes, with a pop; 0.3s before a transition a stretch of rising noise carries the ear into the next bar.
- Every visual landing has a sound, and every accent has an image — the demo film's sound-effect table is in `build_y5.py` in the experiment archive (not collected into the skill), matching the beat numbers in `scenes/*.js` one to one.
- **Hold long enough to read**: the lower bound given by English video text guidelines is 13 characters/s (SSW); no first-hand standard was found for Chinese, so use the subtitling industry's rule-of-thumb ceiling of 7–9 characters/s (unverified, use as a rule of thumb). A 2-character main word holds at least 0.5s; a 7–8 character supporting line holds at least 1.0s.
- When syncing to the VO: the main word = the stressed word in the VO, **the image should be early rather than late, at most 1 frame early** — people are far more sensitive to "sound earlier than image" than to "sound later than image" (the EBU R37 sound-image sync tolerance is sound leading by ≤40ms and lagging by ≤60ms).

## ⑥ Implementation notes

> After collection into the skill (2026-10-04 v0.4): the general functions in this card's "new" section have been unified into `scripts/engine/lib/` (names changed to the unified MO / CAM / DG / TY / CH / UI / CL / TOON), and the demo film's own code is in `scripts/engine/demos/y5_kinetic_type/`. For the library quick reference and "how to choose a grammar for a piece of VO", see `references/09-video-animation-grammars.md`.

- **Reused from the skill**: the engine (segment table, old and new transition layers, `renderFrame`), `render.py`, `U.clamp / lerp / rng`; `PAINT` is not needed (this style uses no textures).
- **engine changes (already merged into the skill engine)**: `window.BPM` is configurable (default 128, this film 120); any segment can set `dur` in seconds; a transition can turn `punch:0` off (this film uses its own beat bump, punching on the beat, not on the transition start).
- **New, now unified into the library** (`lib/motion.js` / `typo.js` / `camera.js`, transitions into `transitions.js`):
  - easing: `expoOut / expoIn / expoInOut / quintOut / backOut(p, s) / spring(t, freq, decay) / settle(t, amp, freq, decay)`.
  - type: `TY.text` (scale and rotate about any pivot, outline, tracking), `TY.width`, `TY.rise` (mask rise), `TY.pop` (pop in), `TY.typed` (typing), `TY.marker` (slanted highlighter block), `TY.underline`.
  - camera: `CAM.with(c, {x, y, z, r}, fn)`, `CAM.drift`.
  - transitions: `fillZoom`, `bands`, `push`.
- **This film's `y5_kinetic_type/kinetic.js`**: `KT.b(n)` beat numbers, `KT.SZ` type scale, `KT.bump` beat bump, `KT.slam` main-word slam, `KT.dots` dot grid, progress rail (drawn on the `GLOBAL_OVERLAY` fixed layer, its value determined only by the film's global time — the usage of "continuous narrative anchor" in skill doc 02; the first version drew it per segment and it jumped with the page on a push), `KT.key / keyMarker` (the keyword rises first, then scales up and pins on the accent beat), `KT.bigNum` (giant background stage number), `KT.cam`.
- **Chinese fonts**: the demo film uses Alibaba PuHuiTi 3.0 in four weights (Black/Heavy/Bold/Medium); the open-source version, because of font licensing, is swapped to Noto Sans SC 900/800/700/500, keeping the family names `PuHui-*`, with the full GB2312 subset (`scripts/font_subset.py --gb2312`); changing the topic generally does not require redoing it.
- **Music (`build_y5.py` in the experiment archive, not collected into the skill)**: numpy-synthesised drums (kick on every beat, clap on 2/4, hat on the offbeat) + bass (eighth notes on one root per bar) + event sounds (main word = boom, small elements = pop, typing = click, checkmark = rising pop, before transitions = riser).

## ⑦ Representative works and primary references

- Saul Bass title-sequence archive (Art of the Title): https://www.artofthetitle.com/designer/saul-bass/
- Wikipedia "Kinetic typography" (two categories: motion typography / fluid typography; Bass is the feature-film pioneer): https://en.wikipedia.org/wiki/Kinetic_typography
- School of Motion "Kinetic Typography in After Effects" Part 2 (frame counts: small words slide in over 4 frames, the main word whips in over 6 frames + 2 frames of overshoot correction, camera push 6 frames + 2 frames pull back; "the camera should move a little late, as if pushed by the sound"): https://www.schoolofmotion.com/blog/kinetic-typography-after-effects-part-2
- School of Motion Part 3 (falling should accelerate, not ease to a stop; on impact the whole comp scales up then returns to 100%): https://schoolofmotion.com/blog/kinetic-typography-after-effects-part-3
- Dan Ebberts inertia rebound expression (`amp·sin(2πft)/e^(decay·t)`, defaults freq 3 / decay 5): http://www.motionscript.com/articles/bounce-and-overshoot.html
- Lee, Forlizzi, Hudson, "The Kinetic Typography Engine" (UIST 2002, dynamic type expressing emotion and tone): https://dl.acm.org/doi/10.1145/571985.571997
- Video text hold time: https://www.ssw.com.au/rules/post-production-do-you-give-enough-time-to-read-texts-in-your-videos
- The two reposts measured this time: DISCORD [Kinetic Typography] https://www.bilibili.com/video/BV1ts411S7Xa ; Charlie Puth – We Don't Talk Anymore (Kinetic Typography) https://www.bilibili.com/video/BV1by4y1r74Y

## ⑧ The 3 easiest things to get wrong

1. **All type the same size, all moving together.** Without hierarchy there is no focus, and the audience does not know what to read first. Main word to supporting line at least 3:1, and only one thing enters at a time; everything else stays still.
2. **The type keeps drifting.** Type must not move while it is being read (it cannot be read then). Give continuous motion to camera micro-drift, the beat bump, and the background dot grid; the type pins 0.35s after it slams in.
3. **Animation not on the beat, or landing on the transition start.** The transition's first frame is not the accent; the frame where "the new screen is revealed" is. Move the segment start back by "reveal point × duration", then write every in-shot landing as a beat number; every landing outside the beat grid scatters the film a little more.

---

## Demo film

- Final film: `scripts/engine/demos/y5_kinetic_type/` (render `render.py --film demos/y5_kinetic_type`) (8.5s, 60fps, synthesised score at 120 BPM); one overview frame per shot: `assets/animation-grammars/y5_kinetic_type_overview.jpg`
- Project: `scripts/engine/demos/y5_kinetic_type/` (`eras.js`, `kinetic.js`, `k1_title.js / k2_complete.js / k3_chat.js / k4_agent.js`), the general parts in `scripts/engine/lib/`
- Storyboard: K1 title "The ③ stages of AI writing code" → zoom through → K2 "Completion" (code card + grey-text completion + Tab) → colour band wipe → K3 "Dialogue" (you say one line, it writes a whole paragraph) → push → K4 "Agent" (three TODOs check themselves off) + progress rail full

## Review rework (independent agent sees only the final film)

Review conclusion: "The opening 0–2s is standard kinetic type; the '3' circle rushing into the lens and becoming the next segment's ground colour is the best design in the film" "Sound-image sync is almost perfect, every visual event lands on the 120BPM grid, on the same frame as the kick drum". 5 "must fix" items, handled as follows:
1. **Supporting line holds too short** (0.6–0.9s) → supporting lines come out one beat earlier and are trimmed to 6–7 characters ("it completes the next line", "one sentence becomes a whole paragraph", "you only say what you want"), readable time 1.0–1.5s (stage 2 is still tight, but with a VO in the final film it is enough); 0.5s added to the whole film.
2. **Stage 2's supporting line almost hits the AI panel** (14px) → supporting line shortened, right-aligned, spacing >180px.
3. **The push page was 8 frames early, the progress rail jumped with it** → segment start recomputed from 90% displacement (5.80); the progress rail moved to the `GLOBAL_OVERLAY` fixed layer, its colour changing on the reveal frame.
4. **The stage segments are not kinetic enough** (the stage numbers too small, keywords only highlighted not scaled) → added giant background stage numbers 1/2/3; keywords scale to 1.35× on the accent beat.
5. **The ending has no closing hit, and everything goes grey after the checks** → added a 16th-beat closing downbeat (camera pulls back 6% + 3.5% impact + low frequency + high bell), checked-off words turn green instead of grey, content moves down 70px overall to fill the empty bottom.
Also: the code card switched to a monospace font (Menlo).
Not adopted: "extend each segment to 2.5–3s, whole film 10–11s" — the demo film is required to be about 8 seconds, so compress the word count instead of extending the duration.

## qa.py numbers (after rework, `uv run scripts/qa.py --project scripts/engine --film demos/y5_kinetic_type`)

| Segment | Motion % | Static frame pairs % | Jumps | Mean/peak ms | Determinism |
|---|---|---|---|---|---|
| k1_title | 2.37 | 0.0 | 1 (t=1.63, title exit) | 1.0/1.6 | ✓ |
| k2_complete | 2.39 | 0.0 | 0 | 1.5/3.2 | ✓ |
| k3_chat | 2.59 | 0.0 | 1 (t=4.54, AI bubble grows) | 1.6/2.2 | ✓ |
| k4_agent | 2.88 | 0.0 | 3 (t=6.29 Agent + task cards; t=8.00/8.04 closing downbeat) | 1.6/2.0 | ✓ |

Transition smoke test (whole-frame peak): fillZoom 6.8ms, bands 4.8ms, push 3.8ms. All 5 jumps were inspected frame by frame, and every one is an intentional beat accent (qa doc: "an intentional beat flash does not count as an error"). Kinetic jumps should land on the beat — you can check the jump times against the beat grid, and only the ones that do not line up are bugs.
After the rework, all four edges were scanned frame by frame: 0 frames showing black.
