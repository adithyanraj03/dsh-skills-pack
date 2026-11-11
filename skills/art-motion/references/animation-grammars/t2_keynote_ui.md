# t2_keynote_ui · keynote-style UI and gradient motion

> One-line grammar: **one thing per screen, the product itself (screenshot, screen recording, physical object) as the hero, nouns and numbers landing exactly when the VO says them; tight letter-spacing, springs with no bounce or a light bounce.** Glow-gradient backgrounds, frosted-glass cards, gradient text, centered blur-in and decorative floating are all optional packaging — use sparingly (see the "before you start" checklist).
>
> Demo film: `scripts/engine/demos/t2_keynote_ui/` (render `render.py --film demos/t2_keynote_ui`) (8s, 3 shots) · overview `assets/animation-grammars/t2_keynote_ui_overview.jpg` · code `scripts/engine/demos/t2_keynote_ui/`

## "Before you start" checklist

1. **This style is the easiest one to read as an AI template.** Glow-gradient background + frosted-glass card + gradient text + centered blur-in + floating cards — put all five together and the audience recognizes the template at a glance. Before starting, ask: do we have real product screenshots, screen recordings, photos of the physical object? If yes, let them run full-frame as the main image and push in to the part being discussed; no glow, no glass card. Pick at most two of the five packaging tricks for one film.
2. **Screenshots must be large.** In any shot with a screenshot, the screenshot is ≥ 80% of the frame width (≥ 90% vertical), and you push in only when the VO reaches the part of it that is not legible (default slow push, about 0.9s; use a 0.28s fast push only when that part is the reveal or a comparison result). Push into one screenshot at most once or twice; after pushing in, pull back to the whole shot or pan to the next region. A small card floating on a vast glow field is the fourth failure mode, "dead background". The parametric t2 clip does exactly this by default: the screenshot runs full-frame (aspect preserved, no crop, padded on all sides with a darkened blurred copy of itself), pushes in at the highlight moment (slow push by default; only `"camera": "snap"` in the spec's top-level `data` makes it a fast push), and pans between two consecutive screenshots at the same scale; the old glass card requires explicitly writing `data.frame: "glass"`. When writing your own shot, use `CAM.track` (camera move table) and `MD.cover` (full-frame + focus + push-in); for which move to pick see `../camera-language.md`.
3. **Count the layouts.** Write out the layout of every screen in the storyboard (title screen, three cards side by side, big number, screenshot card); if the same one appears ≥2 screens in a row, switch to another: screenshot push-in, number slam, before/after comparison. "Title → three feature cards → big number" looping for the whole film is just a slide deck.
4. **Hold after it lands.** No floating cards, no constant slow push to fill the pause; the next action goes at the moment the VO says the noun or number. A number is about what was in the screenshot just shown (the ratio of two timings, this page's conclusion) — write `data.over: true` on the number: the camera pulls back to the whole screenshot, the screenshot dims, the number slams on top of it, instead of cutting to a separate glow-background screen.
5. **Colors follow the product.** Take the background and accent from the product's own brand colors; do not default to a purple-blue-cyan glow. Do not use this dark launch backdrop for bad news, serious events or non-launch subjects.

## ① When to use it

- **Use it**: product/feature launches, version updates, "three new features", price and spec announcements, opening brand films, the "what is this product" section inside a video. Best when the VO is **nouns + numbers** ("Plover 2", "320 millisecond latency", "1 million tokens"): one sentence per screen, the word floats in as the noun appears, the number lands as it is spoken.
- **Use it**: when a UI screenshot has to be explained clearly — screenshot full-frame, push in to the part being discussed; putting it in a glass card or straightening it in 3D is optional packaging, use sparingly.
- **Do not use it**: to explain mechanisms (glass and glow carry no logic — use t1); for data trends (use t3); for serious incidents / bad news in earnings (this language carries a "good news" mood); when the content has no "hero" that can be scaled up (only empty glow shots remain); for non-launch subjects such as explainers, stories and news, do not treat this backdrop as a general-purpose template.

## ② Visual composition

| Item | Value | Source |
|---|---|---|
| Background | near-black: this film `#050508`; Apple `#000/#161617/#1d1d1f`; Linear `#08090a` (one level up `#0f1011/#141516`, body text `#f7f8f8`, stroke `#ffffff14`) | measured from both companies' site CSS |
| Glow (optional, use sparingly) | 4 radial-gradient blobs composited with screen → blur 90px at 1/4 size → scale up to fill → overlay 3.5% static grain to prevent banding. Hues from the Stripe family: purple `(150,90,238)`, blue `(56,104,255)`, cyan `(120,214,255)`, a touch of warm red `(255,96,84)`; then a 38% black radial gradient at the center to give white text contrast | Stripe 2021 gradient `#a960ee #ff333d #90e0ff #ffcb57` |
| Glow motion (optional) | each blob drifts with amplitude 90–260px and period 9.5–13s, **avoiding a 5s period** (HIG: avoid sustained oscillation at ~0.2Hz) | Apple HIG Motion |
| Glass card (optional, use sparingly) | sample the background and blur 40px (Apple nav `saturate(180%) blur(20px)`; NN/g says the bigger the better) + white 7.5% fill + 14% white gradient highlight at the top + 1.5px gradient stroke (bright upper-left, dark lower-right) + large shadow (blur 70–80, y+30–40, α0.5) | apple.com globalheader.css; NN/g Glassmorphism |
| Corner radius | cards 36px; **concentric radii**: the inner icon background radius = 36 − 14 padding = 22 | WWDC25 "child radius = parent radius − padding" |
| Fonts | Inter (the closest open-source face to SF Pro; Linear uses Inter); Chinese in Source Han Sans. Titles weight 600, **tightened letter-spacing at large sizes −0.02 ~ −0.03em** (`T2.track`) | Apple 96px −0.015em, Linear 64px −0.022em, OpenAI 64px −0.03em |
| Text hierarchy | white `#f5f5f7` primary, `rgba(235,235,245,.6)` secondary, `#a7a7b4` eyebrow (letter-spacing +6px); the product name may use a white→light purple→light cyan horizontal gradient (optional, use sparingly: gradient text plus glow together is the template) | Apple site hierarchy conventions |
| Composition | one focus per screen; with a screenshot, the screenshot is full-frame (width ≥80%) and pushes in to the region being discussed; the centered symmetric three-card row (width 480 each, gap 52) is only for feature lists with no screenshot; big numbers take 55%+ of the frame width | — |
| Shape language | rounded rectangles, pills, thin-line icons (rounded caps, uniform stroke width, SF Symbols feel, `UI.icon`) | — |

## ③ Motion

- **Springs (the main tool)**: SwiftUI duration + bounce parameterization, `MO.spring(t,{duration,bounce})`: mass=1, stiffness=(2π/d)², damping=4π(1−bounce)/d → damping ratio ζ=1−bounce. **Default bounce 0** (most general); 0.15 is crisp and almost does not bounce (this film's card entrance d=0.75, bubble d=0.5); 0.3 bounces noticeably; >0.4 is exaggerated for UI. `.smooth/.snappy/.bouncy` all use d=0.5.
- **Curves (non-spring)**: apple.com nav `.32s cubic-bezier(.4,0,.6,1)`; this film's text float-in uses CSS `ease` = `(.25,.1,.25,1)` (`MO.appleOut`); Linear's main ease-out-quad `(.25,.46,.45,.94)` .16s; Stripe recommends <500ms and `(.2,1,.2,1)`. `MO.bezier(x1,y1,x2,y2)` covers everything.
- **Text entrance** (centered blur-in is optional, use sparingly; if every screen in the film floats in like this it becomes the template): blur 18–26px → 0, move up 16–40px → 0, transparent → 1, 0.7–1.0s (`TY.blurIn`). Eyebrow → product name → subtitle staggered 0.2–0.4s each.
- **Card entrance**: from 170px below, rotated ±0.55rad around the Y axis (≈31°, the side cards facing outward), scale 0.9 → the spring settles it; the three cards staggered 0.1s. The 3D uses `UI.persp` (vertical slice perspective, persp 1800px; Stripe uses 600, Linear uses 1000).
- **Camera and holds**: hold once it lands; no decorative floating, no constant slow push to fill the pause. The camera moves only when the VO reaches the part of the screenshot that is hard to read: default slow push of about 0.9s into that region, 0.7s to move to the next; a 0.28s fast push only for a reveal or a two-number comparison; a number or large type slams in over 0.17s (1.55→0.94→1.0); hold as long as the VO takes. After pushing in, pull back to the whole screenshot or move to the next region — do not go shot after shot pushing only inward. The demo film's card float of 7px (`MO.float`) and constant camera push 1→1.045 are old habits; do not copy them in new films.
- **Counting**: starts 0.25s after the card lands, runs 0.9s (the same number is only counted once — after expanding to full screen it keeps "1 million" and does not recount from 0); `easeOutExpo` (CountUp.js default easing) — the last digit settles slowly; numbers are set **tabular** (`TY.tabular`; Canvas cannot enable tnum, and without it the digits jitter).
- **Sheen pass**: a bright band at −20°, 110–140px wide, sweeps across in 0.8–0.9s; use `source-atop` on the offscreen text (lights only the glyphs) and `lighter` on cards; the three cards compute their progress from their own screen position = one single light.

## ④ Transitions (the 5 most used)

1. **Blur push (blurPush)**: the old image shrinks to 0.92 + blur 24px + fades out, the new image comes in from 1.06 with blur and settles to 1.0 sharp, 0.55s, `ease`. **Underneath, first lay a heavily blurred copy of the old image scaled 1.08**, so no black edges show around the shrinking image. This film shot 1→2.
2. **Shared-element expand (expandRect)**: (the new image must be **opaque** in its first frame when it goes into the card — the card is translucent, so any dissolve shows the old and new text layered on top of each other) the selected card (first scaled to 1.06, the side cards receding and dimming to 45%) expands from its own screen rectangle to full screen, corner radius 38→0, spring d=0.55 bounce 0; the new image is already scaled to the card size and mounted inside it from the start. **The selected card stops floating before it expands**, so the transition starts from a stable rectangle. This film shot 2→3.
3. **Match cut**: the same object in the same position across two shots (product name → card title position).
4. **Masked wipe / sheen cut**: change the image behind the bright band as a sheen sweeps across.
5. **Refraction instead of a fade** (Liquid Glass): an element enters by gradually changing its refraction/blur strength rather than dropping opacity (this film's blur-in for text follows that idea).

## ⑤ Pacing and text

- **Shot duration**: a launch keynote screen often runs 5–8s (Jobs' 2007 iPhone: 70 seconds over 9 screens ≈ 7.8s per screen); fast-cut product films 1.5–3s. This film 2.6/3.0/2.4s.
- **One thing per screen**: one noun, one number, one card. After a dense section, put in one empty screen so the audience can breathe (the counterweight from Presentation Zen).
- **Alignment with VO**: the word starts floating in 0.2–0.3s before the noun is spoken (the float itself takes 0.7s, so it is exactly sharp when spoken); the number **lands** at the moment the VO says the value — count start = moment the number is spoken − count duration; the three cards enter in order matching "first, second, third".
- **Text**: title ≤6 characters or one product name; subtitle one sentence ≤16 characters; card: a 4-character title + one line of description + one big number + unit (one size smaller, one step greyer).

## ⑥ Implementation notes

> After being folded into the skill (2026-10-04 v0.4): the generic functions from this card's "newly written" list have been consolidated into `scripts/engine/lib/` (names unified to MO / CAM / DG / TY / CH / UI / CL / TOON); the demo film's own code lives in `scripts/engine/demos/t2_keynote_ui/`. For the library cheat sheet and "how to pick a grammar for a piece of VO", see `references/09-video-animation-grammars.md`.

- Reused from the skill: `engine.js`, `render.py`, `PAINT.cached/hex`, `U.rng`.
- Newly written, now consolidated into `lib/ui.js` (`window.UI`): `mesh` (glow background), `grainTex`, `backdrop` (blurred copy, for frosted-glass sampling), `shadow` (draws only the shadow), `glass` (frosted-glass card), `sheen` (sheen pass, `comp` optional), `persp` (fake 3D around the Y/X axis), `icon`, `rr/rrPath`, `scratch`.
- `lib/motion.js`: `spring/smoothSpring/snappy/bouncy`, `bezier/appleOut/emphasized`, `float`; numbers and text are in `lib/typo.js`: `TY.count/tabular`, `TY.blurIn` (called MO.textIn during the experiment).
- Transitions (in `transitions_info.js` during the experiment, now in `transitions.js`): `blurPush`, `expandRect`.
- Performance: one glow pass (at 1/4 size) plus one blurred background copy per frame, averaging 40–60ms/frame (QA includes a GPU flush); rendering 8 seconds at 60fps takes about 1 minute.
- Pitfalls (already fixed in the library): ① **blur pulls transparent pixels in from outside the canvas**; drawing into an offscreen that is not cleared accumulates it frame by frame and QA reports determinism ✗ — lay an unblurred copy of the original underneath first; ② adjacent perspective slices overlapping by 0.75px leave a stripe on a semi-transparent texture — snap slice boundaries to whole pixels so they meet edge to edge, and draw into an offscreen first, then composite back at alpha; ③ `UI.sheen` sets its own composite mode internally, which overrides the outer `source-atop`, so it is exposed as a parameter.

## ⑦ Representative works and primary references

- Representative works: Apple's iPhone/Apple Intelligence launch films and the apple.com product pages; OpenAI's GPT-4o / o-series launch videos; the Linear website and Linear Release videos; Stripe's 2020–21 site gradients.
- https://developer.apple.com/videos/play/wwdc2023/10158/ (Animate with springs: duration/bounce)
- https://developer.apple.com/videos/play/wwdc2018/803/ (Designing Fluid Interfaces: start from 100% damping)
- https://developer.apple.com/videos/play/wwdc2025/219/ (Meet Liquid Glass)
- https://developer.apple.com/design/human-interface-guidelines/materials , /motion , /typography
- https://www.nngroup.com/articles/glassmorphism/
- https://web.archive.org/web/20211015000000/https://stripe.com/ (gradient color values)
- https://stripe.com/blog/connect-front-end-experience (<500ms, curves)
- https://linear.app/now/how-we-redesigned-the-linear-ui (LCH color, Inter)

## ⑧ The 3 most common mistakes

1. **Nothing behind the glass.** Frosted glass only blurs what is behind it; "glass" on a flat dark background is just a grey rectangle. First draw a colorful, undulating glow field, then sample and blur according to the card's screen position.
2. **Springs too bouncy, too many moves.** bounce defaults to 0; entrances at most 0.15–0.3; >0.4 instantly looks cheap. Move only one group of things at a time.
3. **Big type with no tightened tracking, glow colors gone muddy.** Above 64px use −0.015 to −0.03em; let each glow blob keep its own color in its own area (screen compositing + heavy blur), never average several colors linearly into grey-purple mud.

## QA numbers (skill `scripts/qa.py`, 2026-10-04, before review)

| Shot | Motion % | Static frame pairs % | Jumps | Avg/peak ms | Determinism |
|---|---|---|---|---|---|
| t2_s1 | 0.58 | 35.4 | 0 | 39.8/51.4 | ✓ |
| t2_s2 | 2.62 | 8.5 | 0 | 60.2/65.0 | ✓ |
| t2_s3 | 1.84 | 9.6 | 0 | 44.3/51.0 | ✓ |

Note: t2_s1's "35% static frame pairs" comes from the demo film's glow drift and 4.5% constant push (old habits), with the per-frame change below QA's pixel threshold (>12 levels). Sampling two frames 1 second apart (at 1.6s vs 2.6s of the film), 26.8% of pixels change by more than 12 levels and 78% by more than 4 levels. A high or low static-pair percentage says nothing about quality: long holds are correct in explainer films, while a film that drifts at constant speed can have very low static pairs and still look like flipping slides.

## Revision (independent review → one revision pass, 2026-10-04)

| Review comment | Fix |
|---|---|
| 🔴 Black edges around the transitions at 2.55–2.75s and 5.6–5.85s | Lay a copy of the old image scaled 1.08 and blurred 30px underneath blurPush / expandRect |
| 🔴 When the card expands, "long-term memory" and "1 million" ghost over each other; after expanding it recounts from 0 | The new image is opaque in its first frame inside the card; the full-screen page keeps the same "1 million tokens" figure and does not recount |
| 🔴 At 6.95s the count jumps from 999,023 to 1,000,000 in one frame and "tokens" gets pushed out | Repeated counting removed along with the item above; the unit is laid out from the measured width of all three parts instead of being glued to the digits |
| 🟡 The end card appears for only 0.4s and at y≈1020 is outside the safe area | The end card floats in at 1.2–1.8s, holds 0.6s, y=972; the chat panel moves up 65px as a whole |
| ⚪ The card says "1 million" while the full screen says "1,000,000" — inconsistent | Unified as "1 million" |

QA after revision:

| Shot | Motion % | Static frame pairs % | Jumps | Avg/peak ms | Determinism |
|---|---|---|---|---|---|
| t2_s1 | 0.58 | 35.4 | 0 | 39.5/51.6 | ✓ |
| t2_s2 | 2.62 | 8.5 | 0 | 57.2/59.9 | ✓ |
| t2_s3 | 0.97 | 15.4 | 0 | 43.0/48.7 | ✓ |

(Transition smoke test: blurPush is slowest at about 137ms/frame, including two full-screen blurs.)
