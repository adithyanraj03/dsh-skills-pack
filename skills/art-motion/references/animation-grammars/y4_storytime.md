# y4 · Storytime-style simple-line character animation (YouTube storytime animation)

> One-sentence grammar: **the VO is the lead, and the picture is the "reaction meme" that accompanies it — the character fast-cuts between a few poses (0.1s) and then holds, and the joke lands by cutting to a big reaction close-up and shutting the mouth on that beat.**

Representatives: TheOdd1sOut (James Rallison), Jaiden Animations, Domics. Tools: according to Jaiden's FAQ and secondhand sources, all three used Flash / Adobe Animate early on (no first-hand original text for this one, background only).

---

## ① When to use it

**Use it:**
- First-person telling of an experience, a screw-up, "my first time...": the VO has a setup, a turn and a payoff, and a joke you can pause on.
- The audience wants "this person": the creator's cartoon avatar appears every episode, and they recognize the persona, not the draftsmanship (Pappis's genre study: avatars "are often told apart by hairstyle alone").
- Limited budget, steady weekly output: one character, five or six poses, and three mouths can carry a whole episode.

**Don't use it:**
- High-density tutorials, data explainers → use y5 kinetic type or infographics. The audience will watch the character waiting for a joke and won't remember the numbers.
- Content with no "I" in it (industry news, product comparisons) → the character has no position to perform, and it's just a sticker that opens its mouth.
- When the VO itself isn't funny and has no pauses → this style amplifies the VO, it doesn't rescue it.

## ② Picture construction

**Composition**
- The medium shot (waist up, head 25–35% of frame height) is the default camera; the character sits centered but offset to one side, and the other side is left for "the thing he's talking about" (the laptop, the other person, an object).
- The background only establishes "where": one wall, one desk, one window, 3–5 large color blocks. White or a flat color ground also works perfectly (Pappis: "a white ground or a rough sketch of the scene").
- Reaction shots take the environment away: the face fills the frame (head radius ≈ 1/3 of frame height), and the background becomes flat color plus vignette.
- Joke shots often invert it: cut to a **very wide shot** and the person becomes tiny ("small and helpless" is itself the joke).

**Palette (actual demo film values)**

| Part | Value | Note |
|---|---|---|
| Skin | `#FFE2CC` | light, near-white — TheOdd1sOut's "marshmallow people" are pure white, Jaiden leans warm white |
| Cap / white tee | `#FFFFFF`, cap band `#E4E4E8` | white objects stand up on black outlines |
| Shorts | `#CDBB97` | |
| Character line | `#1B1B1F` | the darkest in the film |
| Wall / desk / floor | `#DCE9EC` / `#E2C29B` / `#E8DCC8` | low saturation, high value: the background is always "lighter" than the character |
| Background line | `#5B6470` 3px | lighter than the character line, less than half as thick |
| Reaction-shot void | `#3D405B` + radial vignette | cool, dark, pressing all the attention onto the face |
| Mouth / tongue / blush | `#6E2430` / `#F07B7B` / `rgba(255,140,120,.35)` | the only saturated color in the mouth; the lips opening and closing read very clearly |

**Line width**: character line = head radius × 0.05 (minimum 4px) — medium shot R=165 → 8px, big close-up R=360 → 12px, wide shot R=95 → 6px. The line thickens and thins with the camera scale (Flash default behavior), while background lines stay fixed at 3px. **Character line ≥ background line × 2** is the root of this style's "the person always pops out".

**Shape language**: all round, all blunt. The head is a slightly flattened circle (width 1.0R × height 0.93R), the body is a bean (width 1.0R × height 1.2R), the whole body 3.2R — **the head is about 58% of body height**. An arm is a tube with round caps at both ends, no elbow, no fingers; the hand is a circle. No right angles, except props.

**Character drawing (Huashu (the author) storytime version)**
- Keep two signatures: the **pure white bucket hat** (rounded-trapezoid crown + wide brim sloping down + light gray band) and the **round black glasses** (frame lines at 1.5× the outline line — the glasses are this face's "eyes"). Everything else from the original design keeps only the white tee, khaki shorts, and black watch (a small black patch on the near wrist).
- The eyes are black dots inside the lenses (0.075R) with one white highlight; "dead fish eyes" shrink the dot to 0.035R and drop the highlight.
- Expression is carried mainly by the **eyebrows** (the short thick line between the brim and the frame): raised = startled, inner ends raised = aggrieved, flat = deadpan. The mouth has only five states: smile arc, flat line, wavy (worried), half open, full open.
- Show a little black hair at the sideburns, so the viewer knows there is hair under the hat and not a bald head.

## ③ Motion paths

**Measured on the source films (this capture, 480p reuploads, first and last 10 seconds removed; method: 160×90 grayscale frame differencing)**

| | TheOdd1sOut "Mom's Punishment" (30fps, 475s) | Jaiden Animations "Being Not Straight" (24fps, 902s) |
|---|---|---|
| Average shot length ASL | **2.43s** (median 1.87s, IQR 1.03–3.07s) | **5.73s** (median 3.21s, IQR 1.67–6.67s) |
| Adjacent frames completely still | **70.7%** | 51.2% |
| Still-segment length | median **0.40s**, p75 0.70s | median 0.08s (= a hold on twos) |
| Motion-segment length | median **100ms** (3 frames) | median 42ms (1 frame) |

Reading: TheOdd1sOut is **fast cut (0.1s) → hold (0.4–0.7s) → fast cut again**, with the picture completely still seventy percent of the time; Jaiden is **on twos, continuously in motion** (12 images/s), with longer shots. In a Toon Boom interview, Hallis Blaney, animation supervisor on Netflix's *Oddballs*, put it best: "TheOdd1sOut is pose-to-pose, very little animation... basically switching between images", and the hardest part of turning it into a series was keeping that snappiness and avoiding "too soft, too slow". The demo film takes the middle: pose fast-cuts like TheOdd1sOut, breathing and lip-sync like Jaiden.

**Demo film parameters**

| Motion | How | Numbers |
|---|---|---|
| Character frame rate | all character motion stepped at 24fps (`MO.step(t,24)`), camera smooth at 60fps | Flash default 24 |
| Pose switch | arm target points interpolated with `expoOut` | **0.10s** (2–3 frames at 24fps) |
| Pose-change rebound | body squashes vertically 7% at the switch, Ebberts spring rebound (volume preserved, opposite horizontally) | `settle(dt, -0.07, freq 3.5, decay 9)`, ≈0.35s to settle |
| Lip-sync | read the VO RMS envelope, **only allowed to change shape once every 1/12 second** (on twos); three mouths | envelope <0.06 closed, <0.22 half open, otherwise full open |
| Talking nod | head sinks when the mouth opens | 0.015R × mouth level |
| Breathing | vertical body scale | ±1.2%, 1.6s period |
| Blink | fixed schedule, intervals 2.4–3.6s | closed 2 frames@24fps (83ms); "deadpan" slow blink 3 frames |
| Gaze | the pupil moves toward the thing being pointed at | 0.09R |
| Camera | the demo film used medium shot, close-up, slow push on a near shot and slow pull on a wide shot (every shot slow-pushed, the old approach); the new films hold by default and change with hard cuts and jump-ins; slam only on the payoff | demo film: medium +3.5%/2.0s; close-up +6%/1.2s; wide 0.53→0.50 (quintOut); near shot 1.90→1.98 |
| Opening | camera 1.04→1.01 settles (0.5s expoOut), replacing "first frame static" | |
| Sweat drop | slides down the side of the face at the temple | 0.9s, expoOut mixed with linear |
| Lens flare | white diagonal band sweeps across both lenses | 0.3s |
| "?" | pops above the head, backOut overshoot 30%, then ±3° wobble | 0.26s |

Entrances/exits: storytime has almost no "entrance animation" — the character is already in place and already talking on the first frame the shot cuts in. Only props and symbols (?!, sweat drops, numbers) use pop-ins (`backOut`, overshoot 15–30%).

## ④ Transitions (5 common ones)

1. **Hard cut (cut)** — the vast majority. One narration line, one shot; cut when the line changes. The demo film's S3→S4 (close-up → wide of the same room) is a hard cut, using the contrast in shot size to make the joke.
2. **Smash cut to a reaction close-up** — the new picture is there on its first frame, shrinking back to 1 from 1.22× on a spring (freq 3, decay 11), with a 55% white flash laid over the first 2 frames and a low "dun". Used for "he says something insane → look at his face". `TRANSITIONS.smash`.
3. **Whip pan** — the camera whips toward "the thing he's looking at", `expoInOut` 0.26s, with 16 offset copies in the middle for horizontal motion blur, plus a whoosh. Used for gaze shifts like "I open the laptop → (screen)". `TRANSITIONS.whip`.
4. **Jump-in push** — cut directly to roughly 2× closer from the same camera, without changing the background. Used for "he repeats it", "he realizes it", "the punchline line". Demo film S4→S5: in the wide shot he says "these...", then at the breath before "where does it go" it hard-cuts to a 1.9× near shot, so the joke face reads clearly. The precondition is that the wide and near shots are **the same world canvas, with only the camera changed** (`world.js`), otherwise the jump exposes the trick.
5. **Over-the-shoulder / POV** — cut to what he sees (screen, phone, the other person), with a piece of the back of his head in the foreground. Demo film S2: Huashu's back — white cap plus band, ear, glasses arm hooked over the ear, short black hair, nape, white tee collar, a ring of cool rim light on the screen side (the first version drew it as a pure black silhouette, and review read it as "another shadow person"); the foreground doesn't push with the camera, only rises with breathing, and there is parallax between it and the screen, so the frame instantly "has space".

## ⑤ Rhythm and text

- **Shots follow the VO sentences, not the music beat**: one line ≈ one shot. The demo film's 5 shots average 1.75s (2.0 / 2.4 / 1.2 / 1.65 / 1.5), inside TheOdd1sOut's measured IQR of 1.03–3.07s.
- **Put transitions in the breath between two lines, and change subtitle and cut point on the same frame**: the first version's whip cut landed on the first two words of "in one breath", and review pointed out "the cut lands mid-sentence"; changed to L1 ending (1.87s) → whip at 2.0s → settle at 2.26s → he speaks at 2.30s.
- **Reaction shots go in the silence between two lines**: demo film S3 is a full 1.3s with no line at all, only crickets — that pause is the joke. In the edit: after saying the insane line ("three thousand lines") **don't go straight to the next line**; leave 0.8–1.5s for the face.
- **Hold ≥0.9s after the payoff**: "?" pops at 7.80s, the film ends at 8.75s, and the SFX tail finishes naturally (the first version left only 0.4s, and review said: "the laugh beat got cut off").
- **Text**: YouTube-native storytime doesn't burn in subtitles (it relies on CC); it only writes in-frame text that "needs to be seen" — text on screens, key numbers (the demo film's "3000 lines" in PuHui Black 230px, `#FFCB6B`, slammed in with 23% overshoot). Chinese platforms need burned-in subtitles: white 50px, black outline 10px, cut in and out per sentence, no animation (moving subtitles fight the character for the eye).
- In-frame numbers align to **the same word** as the VO: the "three thousand" syllable (3.70s) = 3000 slams in = low-frequency thump = screen shake (9Hz, fully decayed in 0.3s).

## ⑥ Implementation notes

> After being brought into the skill (2026-10-04 v0.4): the common functions in the "newly written" section of this card have been unified into `scripts/engine/lib/` (names changed to the unified MO / CAM / DG / TY / CH / UI / CL / TOON), and the demo film's own code is in `scripts/engine/demos/y4_storytime/`. For the library quick reference and "how to pick a grammar for a passage of VO" see `references/09-video-animation-grammars.md`.

- **Reused from the skill**: the engine (section table, off-screen compositing of the old and new sections during a transition, `GLOBAL_OVERLAY`), `render.py`, `PAINT.cached` (the whole room background cached), `U.rng` seeded random (the code waterfall's block layout).
- **Two engine changes (already merged into the skill engine)**: any section in the section table can take `dur` directly (seconds), with no need to fit eighth notes — storytime cuts on the VO, not on the beat; a transition can set `punch: 0` (or film-level `window.PUNCH = 0`) to turn off the engine's default on-beat impact (storytime has no beat).
- **Newly written, now unified into the library** (`lib/toon.js` / `typo.js` / `camera.js` / `motion.js`, transitions in `transitions.js`):
  - `TOON.bean(c, {x, y, s, char, pose, expr, mouth, blink, look, squash, bob, tilt, lw})`: front-facing bean character, fully procedural Path2D, returning the coordinates of both hands and the head (for positioning props and symbols). The bean characters drawn by this code are kept only for the demo film and white-model previews: after watching films made by several models, the author judged that code-drawn little figures look instantly AI (his words: "the human and robot characters in a lot of videos are just too bad"). The parametric clip y4 only accepts your own frame library (`data.character.frames`, AI-generated frames, see doc 10 and `references/character-fidelity.md`); it fails to start without a frame library.
  - `TOON.POSES`: rest / talk / point / type / shrug / stiff, each pose is just the target points for the two hands relative to the shoulders (unit: head radius).
  - `TOON.mouth(t)`: reads `window.VO_ENV` (the 60fps RMS envelope exported by the audio script), quantized to 0/1/2 on twos.
  - `MO.springHz / settle / backOut / expoOut / step`, `CAM.with`, `CAM.drift` (the handheld micro-drift the demo film used; in the new films a hold means a hold, so don't add it), `TOON.sweat`, `TOON.mark`.
  - Transitions `whip`, `smash` (the slam-into-color-block transition y5 used, brought into the library and renamed `fillZoom`, plus `bands / push`).
- **This film's `y4_storytime/story.js`**: `STORY.poseAt(keys, t)` (pose timeline + pose-change rebound), `blinkAt`, `alive` (nod + breathing), subtitle overlay.
- **Audio (`build_y4.py` in the experiment archive, not brought into the skill)**: lay the VO, synthesize SFX (whoosh, keyboard, bloop, thump, "dun", crickets, pip, boing), and export `vo_env.js` at the same time. The VO is a macOS `say` Eddy placeholder — **after swapping in a real human VO for the final film, re-export the envelope and the lip-sync follows automatically**.
- **One room, three shot sizes**: `y4_storytime/world.js` draws the room as a single world canvas (x −1000..2900, y −700..1700, with the static parts cached whole), and S1 (zoom 1.01–1.045), S4 (0.53→0.50), S5 (1.90→1.98) only change `CAM.with`. The bookshelf, plants and pendant lamp that only the wide shot sees were in the world all along. The world must be a ring larger than the widest shot, or camera drift exposes black edges (the first version's three black-edge bugs were all this one cause).
- Key parameters: characters 24fps, lip-sync 12/s, pose change 0.1s + 7% rebound, character line 0.05R.

## ⑦ Representative works and first-hand references

- TheOdd1sOut channel: https://www.youtube.com/@theodd1sout ; the reupload of "Mom's Punishment" measured this time: https://www.bilibili.com/video/BV14s411M7x4
- Jaiden Animations channel: https://www.youtube.com/@JaidenAnimations ; the reupload of "Being Not Straight" measured this time: https://www.bilibili.com/video/BV1xu411r734
- Domics channel: https://www.youtube.com/@Domics
- Toon Boom × Atomic Cartoons, "Oddballs" from YouTube to series ("pose-to-pose, very little animation", "he never did lip-sync on YouTube", "too soft, too slow"): https://www.toonboom.com/atomic-cartoons-on-bringing-oddballs-from-youtube-to-series
- Konstantinos Pappis, *The Odd Ones Out: The Rise of YouTube Storytime Animation* (Animation Studies; genre history and visual grammar: round-faced avatars, white grounds, no frame-by-frame, closer to an animated storyboard): https://journal.animationstudies.org/article/id/135/
- TheOdd1sOut wiki (the "marshmallow people" phrasing): https://en.wikipedia.org/wiki/TheOdd1sOut
- Dan Ebberts' inertia bounce expression (where freq 3 and decay 5 come from): http://www.motionscript.com/articles/bounce-and-overshoot.html
- A maker's experience post, "add a little bounce when changing pose": https://forum.wickeditor.com/t/whoever-wants-to-make-a-storytime-animation/5940

## ⑧ The 3 easiest things to get wrong

1. **Treating it as "full animation", with everything moving.** The life of this style is "fast cut + hold": seventy percent of TheOdd1sOut's frames are completely still. Everything drifting slowly just makes it soft and rhythmless (the "too soft, too slow" the Oddballs team feared most). Pose switches must be as fast as 0.1s, and then **really hold**; continuous micro-motion goes only to breathing, blinking and small background objects, amplitude ≤ 1–2%.
2. **Drawing the background as well as the character.** Background saturation, contrast and line width must all be one step below the character (this film's background line 3px gray vs the character's 8px black). Once the background gets busy, the eye leaves the face and the VO's joke is lost.
3. **Giving the reaction shot no silence.** Cutting straight to the next line after the insane one is telling the joke away. Reaction shots belong in the gaps of the VO, at least 0.8s. Hold the camera, give only one or two small details (a sweat drop, a slow blink, eyebrows collapsing); to push it, jump one size closer on the payoff (hard cut to about 2× near) or slam in over 0.17s — don't fill with a constant-speed slow push.

---

## Demo film

- Finished film: `scripts/engine/demos/y4_storytime/` (render `render.py --film demos/y4_storytime`) (8.75s, 60fps, with temporary VO + SFX); one frame per shot overview: `assets/animation-grammars/y4_storytime_overview.jpg`
- Project: `scripts/engine/demos/y4_storytime/` (`eras.js` section table, `story.js`, `world.js` world canvas, `s1_desk.js / s2_screen.js / s3_react.js / s4_wide.js / s5_close.js`), with the common parts in `scripts/engine/lib/`
- Storyboard: S1 medium shot talking to camera (0–2.0s) → whip → S2 over the shoulder at the screen, code waterfall + "3000 lines" (2.0–4.4s) → smash → S3 big reaction close-up, silence (4.4–5.6s) → hard cut → S4 wide shot of the same room "I ask it: these...", glance at the laptop, point at the laptop (5.6–7.25s) → jump-in → S5 near shot, hands open "where does it go?" + "?", hold (7.25–8.75s)

## Review fixes (independent agent sees only the finished film)

The first version's review had 5 "must fix" items, all handled:
1. Three black-edge exposures (S1 left/top, the smash rebound scaling below 1, S4 camera drifting down) → enlarged the world canvas + clamped the `smash` scale to ≥1. After the fix, scanned all four edges frame by frame: 0 frames showing black.
2. The payoff had no room to breathe → split out the S5 jump-in shot, holding 0.95s after "?".
3. S1 and S4 weren't the same room → changed to a single world canvas with the camera changed.
4. The over-the-shoulder silhouette looked like another person → drew back-of-head recognition points + rim light.
5. Whip cut mid-sentence, second line's subtitle late → moved the whip into the breath, subtitle on the same frame as the cut.
Handled 2 "could be better" items: 0.15s after the second cricket in S3 the eyebrows collapse (before, the SFX was at 5.23s and the expression at 5.38s, which didn't line up); in S4's two pauses added "glance at the laptop → back to camera" and pointing at the laptop while saying "these". Subtitles dropped the space between Chinese and English ("let AI help me", "3000 lines").
Not changed: the lines are uniform-width vector lines with no hand-drawn wobble — that is what TheOdd1sOut/Jaiden's Flash vector lines actually look like, so it stays.

## qa.py numbers (after the fixes, `uv run scripts/qa.py --project scripts/engine --film demos/y4_storytime`)

| Section | Motion % | Static frame pairs % | Jumps | Mean/peak ms | Determinism |
|---|---|---|---|---|---|
| s1_desk | 1.47 | 8.6 | 0 | 9.9/10.4 | ✓ |
| s2_screen | 6.0 | 0.0 | 0 | 1.7/3.8 | ✓ |
| s3_react | 1.73 | 0.0 | 0 | 5.6/6.1 | ✓ |
| s4_wide | 0.77 | 16.2 | 0 | 9.6/9.9 | ✓ |
| s5_close | 3.27 | 3.1 | 0 | 10.9/11.4 | ✓ |

Transition smoke test (whole-frame peaks): whip 47.9ms, smash 10.1ms, cut 15.7 / 20.5ms. The first version reported 1 jump each in s1, s2 and s4 (the opening settle, the 3000 slam, the fast pull at the start of the wide); after the fixes it is 0.
When reading this table, note that qa's empirical threshold "static frame pairs >40% reads as stuck" **does not apply to storytime** — 70.7% of TheOdd1sOut's adjacent frames are completely still, and that is the style, not a stutter. This film's static frame pairs are 0–16%, much "livelier" than the source, a deliberate choice of Jaiden-style continuous breathing; to get closer to TheOdd1sOut, turn off breathing, nodding and the small background loops, keeping only lip-sync and pose fast cuts (static frame pairs would rise a lot; not measured this time).
