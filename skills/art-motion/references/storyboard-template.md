# Storyboard template: storyboard first, then build

Step 1 of the rail tier. The open tier is also advised to write one first; lint is optional there.

A storyboard is the film's shot list: lock one style, then one row per shot, stating exactly **what object is in frame, what it is doing, how the camera moves, how many tokens of text are on screen, and what the shot is made with**. If you can write this table, the film won't turn into a slide deck that grows page by page, nor into a collage that changes style every shot; if a row won't come out, that shot isn't thought through yet — don't write code for it.

## How to write it

Copy this block to `<project>/storyboard.md`, fill the three lines above the table first, then row by row:

```markdown
Style: (one sentence: one style card or one drawing method; the whole film uses only this one)
Palette: (a name from references/palettes.md, or 3–6 #hex values)
Characters: (none / hands and back only / frame lib <path>)

| Time | Object | Action | Camera | On-screen text | How |
|---|---|---|---|---|---|
| 0–3 | (noun: a person, an object) | (verb: what it is doing) | hold / slow push / pull back / pan / fast push / slam / cut | (≤ 8 tokens, may be empty) | (y4 clip shot01.json / scenes/xxx.js / material photo) |
```

| Column | Write | Don't write |
|---|---|---|
| Time | `0–3`, `3–7.5` or `0:03–0:07`; one shot's end is the next shot's start | |
| Object | A noun — something in frame you can point at and say "that one": a slice of bread, a spore, the protagonist's hand | title, bullet points, text, list, label, caption, card, background, screen, icon; empty shot, flat color, black frame, gradient background (the protagonist is off-screen) |
| Action | A verb — this object's own action: drifts in, cracks open, burrows in, gets cut off | appears, shows, displays, fades in, appears one by one |
| Camera | This shot's main move, chosen by "where should the audience look now": hold / slow push / pull back / pan / fast push / slam / cut. Fast push and slam are accents — only for reveals, reversals, key numbers; after pushing in there must be give and take. Usage and durations per action: `references/camera-language.md` | pushing in on every shot; uniform slow push on every shot |
| On-screen text | ≤ 8 tokens per shot, may be empty; the spoken words go to subtitles | a full sentence of narration, three lines of bullet points |
| How | What makes it: which grammar's parametric clip (write the spec filename), `scenes/<id>.js` code drawing, real material full-frame | a different grammar every shot |
| Tags (optional column) | Small labels pinned next to objects in this shot, comma-separated | more than 3 in one shot; a row of glowing pills |

The three lines above the table (the style lock):

- **Style**: one sentence stating the film's single drawing method, e.g. "warm wood-tone paper illustration, flat fill with fine pencil lines, kitchen afternoon side light". Scenes may change; the style may not: cartoon person, dark code screen, starfield icon, white bar chart, paper, web screenshot taking turns — each shot fine on its own, the film a collage.
- **Palette**: one set from `references/palettes.md`, or 3–6 hex values. Every clip spec writes the same `"theme"`; scenes use only these colours. No blue-purple gradients, deep-purple starfields, neon cyan-purple. Only when the user explicitly asks for blue-purple (cyberpunk purple, Van Gogh's Starry Night) add a line `Blue-purple OK: reason`.
- **Characters**: if people or anthropomorphic characters appear, first read `references/character-fidelity.md`. With image generation, use AI frames and write `frame lib <path>`; without, write `hands and back only` or `none` and tell it with hands, backs, silhouettes and objects. Code-drawn chibi figures, white-cased robots, and coins or balls with faces are retired.

Five requirements — check them one by one when done:

1. **The first 3 seconds are one concrete small scene, and the ending lands on an action of the protagonist or main object**: the opening is a person or an object doing something tied to the topic — not a title, not "today we're going to talk about"; the ending is an action like into the pocket, book closes, pull back to reveal — text may live on an object in frame, not on a centered quote card.
2. **One example runs through the whole film, one style to the end**: the same slice of bread, the same pair of hands, the same machine from first shot to last; every shot is about what happens to it, and every shot lives in the style written on the lock line.
3. **A shot is 2–6 seconds**: a few may run to 8.
4. **Text-led shots ≤ 30%**: a shot counts as text-led when its Object column is a title/text, when it carries 7+ text tokens, or when it is made with y5 kinetic type.
5. **Adjacent shots must not repeat the composition**: this one is a full-frame close-up, the next switches to a pan, to another object, to a different shot size. What changes is composition and camera — never the style.

Two hard lines for the How column (also step 3 of the rail tier): **a single parametric clip carries at most 8 seconds** (one .json totals ≤ 8 s across the table); **a film uses at most 2 clip grammars**, every spec writes the same `theme`, and the other shots use scenes on that same palette, or real material full-frame.

## Checking

```sh
uv run <skill>/scripts/storyboard_lint.py <project>/storyboard.md --script <project>/script.txt   # add --script when there's a voiceover script
```

It gives red/yellow/green per shot with the fix, and exits non-zero on red. On red: fix the storyboard, rerun — **no code until red clears**. Yellow may proceed; write a reason for each in the delivery notes. What lint checks: whether the three lock lines (Style, Palette, Characters) are written; whether the palette has blue-purple values; whether Characters says code-drawn figures, whether Object has a robot/stick figure/chibi while Characters isn't a frame lib, whether y4 is used without a frame lib, whether coins/balls were given faces; Object must not be empty, must not be only layout words, must not be an empty shot/flat color/black frame; Action must be an action; on-screen text ≤ 8; neither first nor last shot may be text-led; text-led ≤ 30%; with `--script`, numbers in the on-screen text (percentages, years, values with units) must appear in the script (spelled-out words count too); with a Tags column, more than 3 tags in one shot is yellow; a shot 2–6 s (6–8 s yellow, over 8 s red); three consecutive shots with the same camera move is yellow (hold and pan exempt), three consecutive inward pushes is yellow, fast push/slam/whip beyond a third of the shots is yellow; in the How column one clip over 8 s total, or more than 2 clip grammars, is red. "One example throughout", "every shot really in the same style", "adjacent shots differ in composition" can't be machine-checked — check those yourself.

## Example: why bread goes moldy (54 seconds, landscape)

This is a writing demonstration: don't carry its subject, objects or shot order into your film. What runs through it is the same bag of toast and the hands of its owner, Xiaoman; no face ever enters frame.

Style: warm wood-tone paper illustration, flat fill with fine pencil lines, one kitchen afternoon side light across all shots
Palette: wood
Characters: hands only (Xiaoman's hands, no face)

| Time | Object | Action | Camera | On-screen text | How |
|---|---|---|---|---|---|
| 0–3 | Xiaoman's hands and a bag of toast | the hands tear the bag open and a fingertip stops on a blue-green spot | hold | | scenes/kitchen.js |
| 3–6 | that green spot | a ring of white fuzz spreads outward from the edge like a map | slow push | not three days ago | material moldy-bread photo full-frame |
| 6–10 | a spore | the spore drifts in through the window crack and tumbles onto the bread | pan | spore | scenes/spore.js |
| 10–14 | that spore | its shell cracks open and a white thread drives into the bread | fast push | | scenes/spore.js |
| 14–18 | the pores in the bread's cut face | white threads fork along the pores and drill down like roots | pull back | hyphae | scenes/hyphae.js |
| 18–22 | starch grains inside the bread | enzyme jets from the thread tips cut the starch into grains of sugar | slow push | starch → sugar | scenes/hyphae.js |
| 22–26 | the thermometer on the kitchen wall | the needle slides from 15°C to 28°C and water beads on the bag's inner wall | cut | 28°C | scenes/kitchen.js |
| 26–31 | two mold-area curves | the counter line charges up while the fridge line crawls along the floor | hold | far slower in the fridge | t3 clip shot08.json |
| 31–35 | little pillars on the mold surface | the pillars lift black spore balls and the balls burst | slam | | scenes/hyphae.js |
| 35–39 | a cloud of spores | the cloud drifts across the table toward the steamed buns nearby | pan | next stop | scenes/spore.js |
| 39–43 | Xiaoman's hands and a bread knife | the tip lines up with the green corner, ready to cut it off and eat the rest | hold | just cut it off? | scenes/kitchen.js |
| 43–47 | the cut face of the sliced bread | a cutaway peels back layer by layer; unseen hyphae already fill half the slice | fast push | what you can't see | scenes/hyphae.js |
| 47–51 | Xiaoman's hands and the bin | the hands drop the whole bag in and close the lid | cut | | scenes/kitchen.js |
| 51–54 | Xiaoman's hands and a fresh bag of toast | the hands push the new toast into the freezer; the door closes and frost crawls up the bag | pull back | cold, dry, sealed | scenes/kitchen.js |

Why this table passes: one style and one palette are locked above it, and people appear only as hands; the opening is a pair of hands tearing the bag and finding the spot — not a title; the ending returns to the same hands pushing the new toast into the freezer, with three tokens written into the picture, not on a quote card; the same bag of toast runs from first to last; not one of the 14 shots is text-led; the only parametric clip is the t3 curve in shot 8, whose spec writes `"theme": "wood"` to match the scenes' palette; the camera follows "where should the audience look now": slow push when a detail must be read (the spot, the starch grains), pan when following a moving thing (the spore, the spore cloud), pull back for the whole picture (hyphae drilling down; the freezer door closing), hold when the frame is moving on its own (the curves growing, the knife tip measuring); fast push and slam are used three times only, saved for the three "oh, that's it" moments (the shell cracking, the spore balls bursting, the cutaway revealing); after every push there is a pull back, a pan, a hold or a hard cut — never three pushing in a row. The curve in shot 8 is illustrative; the finished film must label it "illustrative data".
