# t3_finance_chart · financial data chart animation

> One-line grammar: **build the axes first, then let the data "grow" out, and finally annotate only one thing; one color tells the story, everything else goes grey; values are always honest (bars start at 0, units and source printed on the chart) — animation decides only "how it appears", never "how much it is".**
>
> Demo film: `scripts/engine/demos/t3_finance_chart/` (render `render.py --film demos/t3_finance_chart`) (8s, 3 shots, all data fictional, "illustrative data" in the bottom-right corner of every shot) · overview `assets/animation-grammars/t3_finance_chart_overview.jpg` · code `scripts/engine/demos/t3_finance_chart/`

## "Before you start" checklist

1. **For every chart, first write its "one thing".** The title is that conclusion and the annotation annotates only that; if you cannot write the sentence, do not make the chart — use one big number instead or switch grammar.
2. **The numbers must reconcile.** The multiple in the title has to be computable from the numbers on the chart (write a ÷ b in the annotation); the same number must match across two shots; distinguish "grew to" from "grew by".
3. **The moment the data grows must match the word in the VO.** For bar charts write several bar cues, each with `data.index`, so every bar only grows when it is spoken; do not put the title up at second 0 and then grow everything in one go.
4. **Hold after it lands.** After the numbers settle, hold at least 0.5 seconds, with no constant slow push; if a detail needs to be seen, slow push into it when the VO points there (about 1s; Heer & Robertson: about 1s per step, ease in and out), and use the 0.28s fast push only for the single most important number; or push into that point with `zoomThrough`.
5. **Never use the same layout more than 3 times in a row.** Three charts in a row with the thin red line + title + chart is flipping through a report; insert a push into a detail, a slammed big number, or a cut back to real material.
6. **Keep the chart inside the film's world.** The background of a chart shot should match the shots around it: for a dark film write `theme: "dark"`, or put the film's background color into `safe.fill` (the chart background follows it automatically, switching to light text on dark); white-background report styling is only for films that are already about white paper or web pages. Better still, draw the chart on an object inside the film's world: `--alpha` outputs a transparent clip to place on a screen, a blackboard, or a sheet of paper that exists in the shot. If a night-scene film suddenly cuts to a white-background line chart with a fixed title line on top, review will say it "disconnects from the whole film".

## ① When to use it

- **Use it**: revenue/profit/user growth, stock price trends, market share ranking changes (bar chart race), regional comparison (map shading), the turning point before and after an event. When the VO contains **specific numbers, times, comparisons** ("grew 8.7× in five years", "after March 2023").
- **Use it**: for sections that need to be "credible" — the audience will screenshot and share them, and will check them.
- **Do not use it**: when there is only one number (use a big number card, i.e. t2's counting); when the data itself is unreliable or you are unwilling to cite a source (better to make no chart at all); to explain mechanisms (use t1).

## ② Visual composition

| Item | Value | Source |
|---|---|---|
| Background | white `#FFFFFF` (The Economist web charts); or FT salmon `#FFF1E5`; for dark films use `theme: "dark"` (`#0E1116` background, light text, cyan main bars) | Economist 2017 chart style guide; FT o-colors source |
| Layout | **thin red line at the top (8px) + small red flag at upper left (96×22) + bold title (one-sentence conclusion) + subtitle (metric, unit) + source at lower left** | Economist style guide layout examples |
| Main palette | ECON RED `#E3120B`, blue `#006BA2`, cyan `#3EBCD2`, green `#379A8B`, yellow `#EBB434`, grey `#758D99`, black `#0C0C0C` | Economist chart palette |
| Emphasis | **one color for the hero, everything else to pale grey** (this film: the last bar stays blue, the rest transition to `#C6D2D8`) | Datawrapper, "use grey to suppress secondary data" |
| Grid | horizontal grid only, thin grey (this film α0.13, 1.5px); **only the zero baseline is a solid black line** (3px); y-axis tick values sit above the gridline at the right | Economist style guide |
| Fonts | The Economist uses Econ Sans (Cnd); this film uses Roboto Condensed (numbers) + Source Han Sans (Chinese). Title 700, subtitle/axes 400; axis type smallest, source smallest and lightest (75% black) | same as above |
| Up/down colors | **mainland China A-shares: red up, green down** (this film); Hong Kong and the West: green up, red down. For a Chinese-speaking audience you must state "red up, green down" on the chart; colorblind-friendly alternative: blue/orange + ▲▼ symbols | Jiang et al. 2014 (JBDM); Bloomberg terminal colorblind mode |
| Stroke width | main data line 5px (this film), moving average 4px; callout leader 2px | — |
| Shape language | rectangular bars, polylines + end dot, candle bodies + wicks, small dots + leader-line callouts | — |

## ③ Motion

- **Staging**: layout 0–0.5s → grid lines drawn one by one left to right (lag 0.12, easeOutQuint) → x-axis labels fade in and rise in sequence → data → emphasis color change → annotation. Each stage about 0.5–1.3s. Heer & Robertson 2007: complex changes should be staged, always ease in and out, and a single step takes "as long as it needs", about 1s; axes before data is an industry convention (no empirical study, but it lets the audience know the "ruler" before seeing the "quantity").
- **Bars**: grow from the 0 baseline, easeOutQuint, staggered in sequence (lag 0.22, 1.3s total); the value label follows the top of the bar and counts in sync (`CH.bars`).
- **Lines**: drawn by advancing in **x (time)**, not by arc length — time flows at a constant rate, so steep sections naturally draw faster and read as a "surge"; a 9px dot at the head plus a price label follows (tabular figures); the area gradient goes α0.14→0. This film 1.5s, smooth (the final price "lands" on its point). The official D3 example is 5000ms linear, fine for a standalone chart; in video compress it to 1.5–2s.
- **Callouts**: triggered at the moment the line head **passes** the event point (`tHit` computed from the inverse of the easing function) — the dot pops out (spring d0.45 bounce0.25) plus a pulse ring → 0.12s later the leader line is drawn → 0.3s later the text fades in. **One shot annotates only one thing.**
- **Candles**: appear one by one (lag 0.06, 0.2–1.3s), the body grows from open to close and the wicks extend afterwards; volume bars in sync; the price at upper right rolls with "the candle that just appeared", colored by the move relative to the start of the interval.
- **Numbers**: count-up uses easeOutExpo (CountUp.js default 2s; 0.9–1.3s in video); all rolling numbers are set tabular to prevent jitter.
- **Camera**: the camera holds once the chart settles, with no constant slow push; camera moves are placed at the moment the VO points at some data: a slow push of about 1s, or 0.7s to move to the next data group; only the one or two most important numbers in the film get a 0.28s fast push; during a push-in transition the camera keeps pushing as vectors (no bitmap scaling). The demo film's constant 1→1.03 push in every shot is an old habit; do not copy it in new films.
- **Rank race (not used in this film)**: the official D3 bar chart race uses 250ms per keyframe, linearly interpolates 10 frames between them, and shows 12 bars; a rank swap takes about 0.5s; stagger rank changes so all bars do not jump up and down at the same time.

## ④ Transitions (the 5 most used)

1. **Panel slide push (slidePush)**: the new panel pushes in from the right, the old panel pushes out to the left, a brand-red vertical bar leads the way between them, 0.5s, `cubic-bezier(.7,0,.2,1)`. This film shot 1→2. The new panel starts building its layout during the push (the red line grows, the title floats in).
2. **Push into a detail (zoomThrough, live + bScale0)**: the camera pushes 6× around the latest data point (the old shot redraws itself as vectors), the new image (the last 20 days of candles) dissolves in from 0.6×, and the subject (the newest candle) is aligned to the push point. This film shot 2→3. When there is no circular aperture you must set `bScale0`, otherwise the new image looks like a small card floating in the middle.
3. **Morph between charts**: the same data in a different form (bars→dots→lines), move into position first, then morph (Heer & Robertson: scatter→bar first shifts horizontally then morphs; stacked→grouped first changes width then drops). **Do not morph between different metrics** (revenue bars turning into a stock price line implies the two share a unit).
4. **Axis rescale**: when the data range changes, change the ticks first (old ticks fade out, new ones fade in), then move the data.
5. **Hard cut with the layout unchanged**: a new chart in the same layout, red line and title position unchanged, only the content changes — the most common move in Economist videos.

## ⑤ Pacing and text

- **Shot duration**: one chart 2.5–6s; this film's 2.8/2.7/2.5s is a compressed version (in real use one chart carries one or two VO sentences). Narrative structure: setup (Establisher) → initiator → peak (Peak) → release (Amini et al. 2015, 50 professional data videos).
- **Alignment with VO**: the number **lands exactly as it is spoken** — the moment the bar finishes growing and the label stops at 107.9 matches "10.79 billion"; the callout pops when the line head passes the event, matching "after the large model launch in March 2023". So fix the VO time points first, then work backwards to the animation start times.
- **Text**: the title states the conclusion ("revenue grew to almost 9× in five years" — **"grew to" is not "grew by"**: 8.7× means it grew to 8.7× the original = it grew by 7.7×; review has caught this before), the subtitle states the metric and unit ("annual revenue, ¥100M"); the multiple must be computable from the numbers on the chart (107.9÷12.4=8.70); if the axis does not start at 0, say so in the subtitle ("y-axis does not start at 0"); source in one line at lower left; the "illustrative data" badge at lower right for fictional data in every shot.

## ⑥ Implementation notes

> After being folded into the skill (2026-10-04 v0.4): the generic functions from this card's "newly written" list have been consolidated into `scripts/engine/lib/` (names unified to MO / CAM / DG / TY / CH / UI / CL / TOON); the demo film's own code lives in `scripts/engine/demos/t3_finance_chart/`. For the library cheat sheet and "how to pick a grammar for a piece of VO", see `references/09-video-animation-grammars.md`.

- Reused from the skill: `engine.js`, `render.py`, `U.rng` (all fictional data is seed-generated and reproducible), `PAINT.hex`.
- Newly written `lib/chart.js` (`window.CH`): `lin` (scale, with `inv`), `ticks` (1/2/2.5/5×10ᵏ ticks), `grid` (grid drawn line by line, zero line thickened, tick values right-aligned), `xLabels`, `bars` (grow from 0 + synced counting + highlight/greying), `line` (advance by x, head dot, area), `yAt`, `candles` (candles one by one, up/down colors configurable), `callout` (dot → leader → text), `tag` (red flag), `demoBadge` (illustrative-data badge), `mixHex`.
- `lib/motion.js`: `lagged`, `quintOut/expoOut` (called easeOutQuint/easeOutExpo during the experiment), `spring` (callout dots); `TY.count/tabular/fmt`.
- Transitions (already in `transitions.js`): `slidePush`, `zoomThrough` (live, bScale0, focus).
- Event trigger time: `tHit = start + duration × smooth⁻¹(event x fraction)` (inverse found by bisection), so the callout is always in sync with the line head and changing the line's duration needs no manual adjustment.

## ⑦ Representative works and primary references

- Representative works: The Economist's web charts and videos; FT charts; the data segments of Bloomberg Originals / Quicktake; Flourish's bar chart race.
- Economist chart style guide 2017 (mirror): https://sa.ipaa.org.au/wp-content/uploads/2026/02/Economist-CHARTstyleguide_20170505.pdf
- FT palette source: https://unpkg.com/@financial-times/o-colors/src/scss/_palette.scss
- Heer & Robertson 2007, Animated Transitions in Statistical Data Graphics: https://idl.cs.washington.edu/files/2007-AnimatedTransitions-InfoVis.pdf
- D3 bar chart race: https://observablehq.com/@d3/bar-chart-race-explained
- Correll et al. 2020 (the exaggeration effect of truncated axes — even a broken-axis marker does not save it): https://arxiv.org/abs/1907.02035
- Datawrapper: bars from zero https://www.datawrapper.de/academy/why-our-column-and-bar-charts-start-at-zero ; dual axis https://www.datawrapper.de/blog/dualaxis ; colorblindness https://www.datawrapper.de/blog/colorblindness-part2
- The cultural difference in red-up/green-down: https://onlinelibrary.wiley.com/doi/10.1002/bdm.1800
- CountUp.js (easeOutExpo, 2s): https://github.com/inorganik/countUp.js

## ⑧ The 3 most common mistakes

1. **Truncated axes.** Bar charts always start at 0; lines and candles may not, but it must be stated on the chart. Tufte's Lie Factor (effect shown on the chart ÷ effect in the data) outside 0.95–1.05 counts as distortion.
2. **Too many colors, everything is the hero.** One color tells the story, the rest go grey; state clearly who the red/green convention is for (A-shares red up, the West red down).
3. **Animation so flashy the numbers cannot be read.** No bouncing bars, 3D bars or spinning pie charts; stage it, ease in and out, about 1s per step; after the numbers settle hold at least 0.5s so people can read them.

## QA numbers (skill `scripts/qa.py`, 2026-10-04, before review)

| Shot | Motion % | Static frame pairs % | Jumps | Avg/peak ms | Determinism |
|---|---|---|---|---|---|
| t3_s1 | 1.39 | 0.0 | 3 | 1.3/1.9 | ✓ |
| t3_s2 | 2.37 | 4.7 | 0 | 1.9/2.8 | ✓ |
| t3_s3 | 0.96 | 0.0 | 0 | 1.6/2.3 | ✓ |

Note: t3_s1's 3 "jumps" are at lt 2.10/2.20/2.27s, exactly the frames where four bars turn from blue to grey at once (highlighting the hero) and the callout pops — intentional large-area changes, not glitches.

## Revision (independent review → one revision pass, 2026-10-04)

| Review comment | Fix |
|---|---|
| 🔴 The title "grew nearly 9×" conflicts with the 8.7× annotation (it should be "grew to") | Changed to "revenue grew to almost 9× in five years"; the share price page uses the same form, "grew to 7.5×" |
| 🔴 The monthly line's endpoint ¥268 does not match the daily candle's 286.40 (the push-in lands exactly on this point) | The monthly line's last point = latest price 286.4, the second-to-last month's close = the daily candles' starting point 242; **numbers between two shots must be derivable from each other** |
| 🟡 At 5.6s the "¥268" and the still-counting price ghost as two large red numbers | The price head label is retracted within 0.2s of the push-in transition starting |
| 🟡 "Volume" sits on top of the candles and the volume bars touch the 240 gridline | The label moved to the empty area at lower right; volume bars normalized to the max volume, leaving a 6px gap |
| 🟡 The daily-candle page cannot be read in 2 seconds | Removed the 5-day moving average; candles finish in 1.3s, the parenthetical note settles at 1.75s, hold 0.75s |
| ⚪ Red-up/green-down clashes with the brand red | Kept (for an A-share audience), with the subtitle reading "red up, green down (A-share convention)"; for an overseas version switch to green-up or blue/orange |

QA after revision:

| Shot | Motion % | Static frame pairs % | Jumps | Avg/peak ms | Determinism |
|---|---|---|---|---|---|
| t3_s1 | 1.44 | 0.0 | 3 | 1.3/1.7 | ✓ |
| t3_s2 | 2.45 | 4.7 | 0 | 1.9/2.6 | ✓ |
| t3_s3 | 0.91 | 0.0 | 0 | 1.7/2.9 | ✓ |
