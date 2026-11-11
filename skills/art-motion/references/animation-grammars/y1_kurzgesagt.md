# Y1 · Kurzgesagt flat-science explainer: video animation grammar card

One line: draw an abstract concept as one concrete object, put it inside a glowing world that can scale without limit, and let the camera travel between scales; the environment layer (stars, particles) can keep drifting gently the whole time, the subject and the information change on VO beats, and once they land, they hold.

Demo film: `scripts/engine/demos/y1_kurzgesagt/` (render `render.py --film demos/y1_kurzgesagt`) (8s, 3 shots, 2 transitions), overview: `assets/animation-grammars/y1_kurzgesagt_overview.jpg`
Basis: the research behind this style (the original research and per-frame data stay in the experiment archive and are not bundled into the skill; the numbers used are excerpted into this card) (two 2025 flagship films plus measured 2014 "The Immune System", verbatim transcript of the official Skillshare course). Numbers marked [measured] and [first-hand] come from there; those marked [this film] are the parameters actually used in the demo film.

## Before you start

1. **First write the visual metaphor for this passage: what object is the abstract concept drawn as** (a cell, a gear, a pipe, a city, a drop of water...). If you can't name the object in a line, don't just drop a glowing sphere with a few label pills.
2. **The orange center planet in the demo film and in the samples is one way of drawing it, not the signature of this grammar.** Change the center object's shape and color to suit the subject. The parametric clip y1 sets the center object from the spec: `data.center_style` (color, shape, whether it has orbit rings) or `data.image` (crop a real image into the center object); if unset it generates a neutral style from the name, no longer that orange planet. It only draws "center object + satellite nodes", good for a layered "what's inside" telling; if the subject isn't that structure, write your own shots (`demos/y1_kurzgesagt/` and `CAM`, `TOON` in `lib/`), or switch grammar.
3. **At least one state change per line of narration** (pop out, deform, drill in, pull back). Count them line by line: if two consecutive lines have an unchanged picture, add an event, rather than padding with float and slow push.
4. **Once the subject lands, hold.** The environment layer (twinkling stars, drifting particles, distant clouds) can keep moving gently; the subject and labels get no float, no breathing, and no constant-speed slow push to fill pauses.
5. **Pause before drilling in.** Before a scale transition, let the object you're about to drill into hold for 0.3 seconds or more and light up, so the viewer knows which one is next; scale with logarithmic interpolation (`CAM.zlerp`).

---

## ① When to use it

**Use it:**
- Content about scale, about "what's inside": from a cell to a galaxy, from one pixel to a model, or "zoom in and you'll find...". Scale transitions are standard for this style.
- Mechanisms and systems: neural networks, the immune system, energy flow. Best suited to drawing invisible processes as glowing particles and links.
- The VO is a calm, measured science tone. Kurzgesagt runs about 168 words/min, and one hard-cut shot carries roughly 2 sentences [measured].
- When you need a "serious but cute" tone, a mascot or a flock of birds can come out and carry the joke.

**Don't use it:**
- Real people, real events, archival evidence: flat cartoon dilutes credibility, so use Y2 collage for that.
- Steps and chains of reasoning: easier to understand written out one step at a time, so use Y3 whiteboard.
- When the production budget is small. This style's quality rests entirely on "something is moving in every frame"; an official film takes over 1200 hours [first-hand]. A corner-cutting Kurzgesagt looks like a cheap PPT.

## ② Picture construction

- **Choose the era first.** 2025 is the dark scheme: dark pixels make up 61–68% of the frame, median saturation 0.84–0.89. 2014 is a light gray-white ground, low saturation. The two cannot be mixed [measured]. The demo film's first two shots use the 2025 dark scheme, and the third uses a bright daytime scheme, imitating their habit of "changing the section means changing the whole palette temperature".
- **Palette** (2025 dark scheme, colors sampled):
  - Ground: `#05020F` / `#0E0631` / `#25155E`
  - Secondary ground: `#191670`, `#3826A3`, `#5F58DB`
  - Cyan accent: `#32BAEE`, `#7DD3DC`
  - Orange-yellow accent (glowing bodies): `#F48301`, `#E07919`, `#FACC12`, glow core `#F9EF93`
  - Magenta: `#BE3A95`, `#C83C7F`
  - Highlights and white type: `#E7DFE1`, `#F9FCFB`
  - Rule: one dark ground plus 2–3 high-saturation accent colors, the accents contrasting with each other (orange-yellow against indigo-violet, cyan against magenta) [measured + generalized]
  - **The deep purple ground set above is only a breakdown record; don't copy it into the finished film.** The author has watched many AI-made films; his words: "we need to avoid that garbage blue-purple gradient palette — it's very AI slop"; the deep purple starfield ground is exactly the most common instantly-AI-looking scheme in films like these, and `deliver.py` measures the blue-purple ground and turns the light red. If you want a dark scheme, use `ink` (deep ink) or `navy` (flat navy) from `references/palettes.md`, keeping the "one dark ground plus 2–3 high-saturation accents" rule; for the parametric clip y1 just write `"theme"`, and when unset it defaults to flat deep ink.
- **Shape language**:
  - No outlines. Shadow is a block one step darker in the same hue; highlight is a white ellipse or a single arc [generalized].
  - Rounded corners everywhere. Biology is blobby organic form, character heads are round, limbs are round-capped tubes.
  - Glowing bodies always carry a radial glow. The whole point of the dark ground is to make the glow work.
- **[this film] Two-tone faceting**: `flat(c, path, base, shadow, highlight, v, w)`. Two offsets inside the shape: a shadow band at the lower right, a thin highlight edge at the upper left. v≈(10,12)px, w≈(4,5)px. Every part of Huashu (the author) goes through it too, so he is drawn the same way as the scene rather than looking pasted on.
- **Composition**: subject on the lower third line, slightly below center, with sky left above for stars and annotations. Scenes use 5–6 parallax layers: starfield d=0.05, moon 0.12, far hills 0.3, near slope 0.65, subject 1.0, foreground leaves 1.5 (near layers soft and dark). The official layer count isn't published; measured is 2–5 [generalized].
- **Characters**:
  - Kurzgesagt birds: egg-shaped body, big white eyes, small black pupils set forward, orange triangular beak. Wings are leaf shapes one step darker than the body, and each bird gets a different color [first-hand + generalized].
  - [this film] The cat is a teardrop body with a round head, triangular ears with magenta inner ears, big white eyes; the robot is a rounded shell with a dark screen face and one glowing lens eye; Huashu uses `HUASHU.build`'s point pose, and every part goes through the two-tone faceting.

## ③ Motion paths

- **Official easing** [first-hand, Skillshare]:
  - Standard moves 50 frames (0.83s at 60fps). For snappiness use 30/20/10 frames; pops take 5–10 frames.
  - Loops use Easy Ease 33.3%, roughly `cubic-bezier(.333,0,.667,1)`.
  - Other moves use 75% influence, roughly `cubic-bezier(.75,0,.25,1)`: very soft start, fast middle, very soft land.
- **Pop** [measured]: a card grows to 90% within 0.25s, overshoots to 108% at frame 20 (the detector card is 114%), and returns to 100% in about 0.5s.
  - [this film] Identification labels use `backOut(q, 1.1)`, 0.5s long.
- **Stagger**: same-kind elements stagger 10–20 frames, limbs stagger 3–4 frames, and moves pause 20 frames between them [first-hand].
  - [this film] Title letters stagger 45ms, each 0.5s cubicOut. The pixel cat's 144 blocks stagger 35ms per grid cell by distance to center, each flying in from the four sides with 0.5s backOut(1.4). The neural network lights layer by layer at 0.32s intervals, each node popping 0.35s.
- **Ambient micro-motion and subject holds**: in the 2025 films, stretches with nothing moving at all for 0.5s make up only 0.3% [measured], and what moves is mainly the environment layer (twinkle, particle drift, glow) and the thing currently being talked about.
  - Explainer shots: subject and information elements hold still once they land; motion goes on VO beats (pop, deform, push, drill in).
  - Pure atmosphere shots (openings, the breathers at section changes) can keep slight ambient motion: twinkling stars, drifting particles, slow distant drift.
  - Blink: 5 frames closed, 10 frames open, irregular intervals, **eyes never shrink to 0** [first-hand].
  - [this film] 170 stars, each twinkling at its own phase 1–3.5 rad/s. Foreground leaves `blur(7px)` out of focus for depth. The robot bobs ±12px, jet light jitters with a 23/37Hz dual sine. Cat tail swings in two bezier segments. Grass blades swing at 2.1 rad/s. Firefly particles drift at layers 0.8–1.3. Signal pulses cycle continuously along the links.
- **Camera** [measured]:
  - In the 2025 films about 1/3 of the time is zooming, about 10% panning, about 5% rotating, and pull-backs outnumber pushes. Most zooms are scale travel and reveals, not pause-filling.
  - The new films' call-out shot: hold → slow push in for about 0.9s → hold; move to the next node over 0.7s; only the reveal gets a 0.28s fast push or a 0.17s slam; how long to hold follows the VO; after pushing in, come back with a pull back (④ fast pull-back reveal). Scale travel has its own durations in ④.
  - [this film] Shot 1 used a 2.6s constant-speed push 1.00→1.10; that's the old approach, and the new films don't copy it.

## ④ Transitions (6 common ones)

1. **Push through → the object's color floods the frame → new scene** (the standard scale transition).
   - Measured: Immune 1:48, about 1.4s, accelerate then decelerate, peak in the middle.
   - [this film] Transition B:
     - Camera log-interpolates into the lit output node (0.45s, cubicIn), until the screen is full yellow.
     - At the midpoint ±3 frames, dissolve to the robot's yellow-glowing eye. Both highlights sit upper-left, so the cut is invisible.
     - Then a cubicInOut pull back for 1.45s (42→1), landing in the new daytime palette.
     - Don't use expoOut: its initial slope is too steep, and the first frame throws away most of the scale.
2. **Drill into the object, and inside it is the next world** (a variant of the travel).
   - [this film] Transition A, 1.0s: the camera log-pushes into the robot lens on `bezier(.75,0,.25,1)` (1.1→60). The next shot is visible only inside the "lens circle", which grows with the push until it covers the screen, with a ring of cyan halo on its edge. The next shot simultaneously floats up from 0.42× expoOut.
3. **Fast pull-back reveal**: 0.2–2s, fast start, long-tailed finish (measured: per 0.2s, scale 1.074→1.040→…→1.0006). Used to connect the micro and the macro.
4. **Light or a flash floods the frame**: use a light source in the frame as a white field, about 0.5s.
5. **Sweep wipe**: an object or light band sweeps diagonally across the frame with speed lines, about 0.4s.
6. **Duplicate and multiply to fill**: for "so many that...", 3–6s.

Two more points [measured]:
- Hard cuts are rare, about 5 per minute, following narration sentence starts and landing 0–0.2s before them.
- Most other picture changes are 0.3–0.6s designed transitions, once every 4.6–6.7s.

## ⑤ Rhythm and text

- **Shot length** [measured]:
  - Hard-cut shots: median 7–9s, mean about 11.5s.
  - But the "visual unit" changes every 4.6–6.7s, via designed transitions.
  - At least one state change per line of narration: pop a label, swap an annotation, deform, or cut.
- **Aligning with the VO**: use the narration sentence timestamps as the skeleton, and put hard cuts 0–0.2s before the new sentence start [measured]. The score is composed after the film is cut (Epic Mountain) [first-hand].
- **Text**:
  - An annotation first draws a thin white leader line, then types the text letter by letter at about 40 characters/s; one annotation per line of narration, holding about 3s, then wiped letter by letter [measured].
  - Chapter title cards every 2–3 minutes, full screen, word by word, blurred background.
  - Label pills are heavily rounded, filled with saturated solid color, bold sans-serif inside.
- **[this film]**:
  - 3 shots in 8s, about 3× normal density, only so the whole grammar can be seen in a demo. For a real film, one shot per 7–9s.
  - Title in PuHui-Heavy 76px, floating up letter by letter.
  - Layer labels in PuHui-Medium 40px, with an underline extending out.

## ⑥ Implementation notes

> After being brought into the skill (2026-10-04 v0.4): the common functions in the "newly written" section of this card have been unified into `scripts/engine/lib/` (names changed to the unified MO / CAM / DG / TY / CH / UI / CL / TOON), and the demo film's own code is in `scripts/engine/demos/y1_kurzgesagt/`. For the library quick reference and "how to pick a grammar for a passage of VO" see `references/09-video-animation-grammars.md`.

- Reused from the skill:
  - `PAINT.cached`, `U.rng`: determinism
  - `RIG.smooth`: smooth a point list into a Path2D, draw the cat, hills, leaves
  - `HUASHU.build/pose/details`: Huashu
  - `PAINT.noise`
  - the engine's section table, transition interface, off-screen A/B buffers
- Newly written, now unified into the library (`lib/camera.js` / `motion.js` / `typo.js`):
  - `CAM.at(keys, t)`: keyframed camera, with log interpolation for scale. `CAM.zlerp` makes every frame scale by the same factor, so a scale transition travels at constant speed. The new films' holds and call-outs use `CAM.track` (slow push by default, glide when changing node, pull for pull-back, punch/slam only on accents, hold the rest of the time); the parametric clip y1's highlight defaults to a slow push, and only `"camera": "snap"` in the spec's top-level `data` gives a fast push.
  - `CAM.anchor`: smoothly move the target point to frame center while scaling.
  - `MO.bezier(x1,y1,x2,y2)`: ports AE/CSS bezier easing into code, solved by Newton's method.
  - `MO.*`: sine, quint, expo, back, elastic, etc.
  - `TY.charsIn`: per-character entrance.
- The demo film's own (`demos/y1_kurzgesagt/kurzgesagt.js`; `flat` is now in the library as `TOON.flat`, `layer` as `CAM.layer`):
  - `flat()`: two-tone faceting.
  - `layer(c, cam, d, fn)`: parallax layer. Offset is linear in d, scale follows `z^d`, so in a deep push the far layers barely move.
  - `Y1.cat`, `Y1.bot`, `Y1.bird`: three characters.
  - `Y1.lensAt(t)`: lens-circle screen coordinates used by transition A.
- **Key architecture**:
  - The camera is decided only by film-wide time. During a transition window, the engine keeps drawing the previous shot into the A buffer as usual, and the previous shot computes its own "drill in" camera.
  - So a scale transition is always a vector redraw, never a 1920 bitmap blown up 60× into mush.
  - Transition functions (`lensReveal`, `matchCut` in `transitions.js`) only handle "how A and B combine".
- Engine changes (only this experiment's copy was changed):
  - Any section in `eras.js` can take `dur` (seconds).
  - On-beat camera impact is now off by default, and only `transition.punch:true` turns it on. Explainer films shouldn't have on-beat stutter.

## ⑦ Representative works and first-hand references

- Sample films:
  - How Are Memories Stored Inside Your Brain? (2025) https://www.youtube.com/watch?v=PqtggjVAi8M
  - Why Humanity Will Never Leave The Solar System (2025) https://www.youtube.com/watch?v=Cyl3X88KEgg
  - The Immune System Explained I (2014) https://www.youtube.com/watch?v=zQGOcOUBi6s
- Official course (verbatim transcripts on easing, loops, birds, character motion):
  - Skillshare "Motion Graphics with Kurzgesagt" Part 1 https://www.skillshare.com/en/classes/motion-graphics-with-kurzgesagt-part-1/631970755
  - Part 3 https://www.skillshare.com/en/classes/motion-graphics-with-kurzgesagt-part-3/140140401
- Official behind the scenes:
  - 1200 hours per film: https://www.youtube.com/watch?v=uFk0mgljtns
  - Official self-description: https://kurzgesagt.org/what-we-do?visit=videos
- Score: Epic Mountain https://www.epic-mountain.com

## ⑧ The 3 easiest things to get wrong

1. **Turning "always moving" into everyone breathing.** In the 2025 films measured, still stretches are only 0.3%, but what moves is the environment layer and the thing currently being talked about, not every element floating. Explainer shots: the subject holds once it lands, and motion goes on VO beats; pure atmosphere shots keep light ambient motion like twinkle and particle drift. Motion padded in with everyone floating and a constant-speed slow push still reads as a PPT.
2. **Linear interpolation for zoom, or scaling up a bitmap.**
   - Linear z is slow at first then violent, and the travel feeling breaks. Use log interpolation.
   - Blowing up the previous shot's screenshot 20× turns it into mush. The scene must redraw itself at the larger z.
3. **Bright, busy palettes, or outlining things.**
   - 2025 Kurzgesagt is "dark ground + 2–3 glowing accents", carried by glow.
   - Adding black outlines or using a mid-brightness ground slides toward children's picture book or corporate flat illustration.
   - Shadows in the same hue one step darker, never gray.

---

## Review and revision (independent agent sees only the finished film, 7/10)

Review notes and how this round handled them:
- "The cat, the grass and the hills are outlined, like a children's illustration": grass blades changed from lines to filled thin triangles; the bright edge on the hilltops pushed down to only one step away from the base color.
- "The black block in the lower left looks like dirt": foreground leaves got `blur(7px)` for depth, color raised from near-black to `#0E0631`.
- "The title vanishes for a frame": changed to a 0.55s sineInOut fade out.
- "The cat turns from orange to black in shot 3 with no setup": the orange cat stays at Huashu's feet as "the one we know"; above the black cat a leader line and small type "a cat we've never seen" appear first, then the identification label pops.
- "At 7.8s the bird overlaps the robot": bird height moved to 175/225px.
- "7.1–8.0 at the end is nearly static": at the time the demo film added a 4%/s slow push. The current approach: put an event at the end (fast pull back to see the whole, or drill into the next layer), then hold.
- "3.03–3.10s the pixel cat is half cropped by the lens circle": not changed. That is the normal state of the "drill into the lens" reveal.

## QA (skill `scripts/qa.py`, 2026-10-04, final version after revision)

| Shot | Window measured (seconds within shot) | Motion area % mean/peak | Static frame pairs % | Jump frames | Per-frame time mean/peak ms | Determinism |
|---|---|---|---|---|---|---|
| y1_s1 | 0.0–2.58 | 1.57 / 2.58 | 0.0 | 0 | 32.9 / 34.6 | ✓ per-pixel identical |
| y1_s2 | 1–2.68 | 3.36 / 4.42 | 0.0 | 0 | 6.1 / 7.2 | ✓ per-pixel identical |
| y1_s3 | 0.9–2.68 | 17.94 / 91.88 | 0.0 | 8 (continuous, 1.04–1.28s) | 11.2 / 16.0 | ✓ per-pixel identical |

Transition smoke test (each transition rendered once, slowest frame): y1_s2 (k_lens) 48.3ms; y1_s3 (k_fill) 36ms

How to read it:
- **Shot 3's 8 jump frames** fall in 1.04–1.28s, one continuous stretch — exactly the middle of the 42×→1× pull-out from the robot's eye, with the whole screen scaling, hence the 92% peak motion area. This is a designed scale transition, not a single-frame glitch.
  - The first version used expoOut; the initial slope was too steep, jumping from 42× to 15× in the first frame, and both review and qa reported it.
  - Changed to cubicInOut, with the peak in the middle, matching the measured shape of Kurzgesagt's "travel push".
- **Shot 1 at 33ms per frame**: foreground leaves added `filter: blur(7px)` for depth, slower than 9ms before the blur, and still far below the 150ms ceiling.
- Motion area 1.6–3.4% looks low because Kurzgesagt's micro-motion is "many small things each moving": stars, particles, tails, bobbing, pulses. In the 2025 films measured, completely still stretches are only 0.3%, and here all three shots' static frame pairs are 0%, which matches; but 0% static frame pairs only says the environment layer is moving, not that it's told well — you still have to check whether the sampled frames flip like turning pages.

Rerun: `uv run scripts/qa.py --project scripts/engine --film demos/y1_kurzgesagt --out <dir>` (the table above holds the numbers from the experiment; for the rerun after being brought into the skill see the regression table in doc 09).
