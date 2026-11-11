# 33_rubberhose · 1930 rubber-hose cartoon

> Source: transfer test D (an independent agent working from the skill read-only, 2026-10-04). The scene code was ported into `scripts/engine/scenes/33_rubberhose.js` after consolidation.

File name at experiment time: `scenes/r2_rubberhose.js`, about 20ms per frame.

**Pipeline**: monochrome paper-color ground (vertical wallpaper stripes + diamond dots, floor tile seams, watercolor darkening in the corners, cached) → sky outside the window (sun with a face, clouds, trees) → window frame and polka-dot curtains → chair → table (curved legs + dancing flower) → girl → cat → `saturation` desaturation + multiply #f2e8d2 for the faded look → film layer.

**Key parameters**
- Beat bounce: `bnc(tq, ph) = |sin(π(tq/BEAT + ph))|`, BEAT = 60/128. Each object bounces amp pixels around its own contact point: on landing it squashes sx=1+0.09k, sy=1−0.09k; in the air it stretches about 5%. Object phases are offset by 0.25 beat: table 0.5, girl 0.25, cat 0.75, sun 0; the bow 0.05, slightly behind the body, reading as follow-through.
- Stepping: all characters and motifs use `tq = floor(t·12)/12` (on twos); the cup lift also steps at 12fps; the film layer uses floor(t·24).
- How the character is drawn: the rig supplies anchor points only.
  - Head: a large round face of radius 82 around headC.
  - Pie-cut eyes: white eye sockets + black pupils, with a wedge cut out of each pupil using arc(−1.45..−0.85); 3 lashes above.
  - Arms: rubber hose = a single quadratic Bézier from shoulder to hand, constant thickness, black edge +10px.
  - White gloves: 4 fingers, flared cuff, 3 lines on the back of the hand.
  - Polka-dot skirt down to the ankles (the modest cut).
- Cat: body via `RIG.smooth(K.bodyPts)`, mid-gray #a39a84 (= orange), tabby stripes #5e574b, white chest and paws #fbf7ec; the tail is a wavy rubber hose `sin(7q − 9tq)·26q`.
- Film layer:
  - Gate weave ±1.5/±2px.
  - Flicker: composite white at α0.02–0.09 per frame, then black at 0–0.06.
  - Scratches: 3 vertical lines, repositioned by floor(t·6), so one scratch survives several frames.
  - 14 dust specks per frame + an occasional hair.
  - The grain layer is randomly offset ±20px per frame.
  - Rounded gate: roundRect r60, plus a vignette.

**Motif animation**: everything bounces on the beat, the sun face's rays rotate 1.6rad/s and the face nods on the beat, the dancing flower (stem ±0.35rad side to side, leaves waving like hands, petals turning), one smoke ring per beat, curtain hems swinging on the beat, film flicker and scratches. Motion area 40%, but most of it is film noise (see ② item 5).

**Pitfalls**
- The rig's cat body is a polyline; straight edges give themselves away instantly in a cartoon, so it must be smoothed.
- To flatten the whole frame to monochrome, the saturation desaturation must be done once after the characters are drawn, otherwise the gloves and the cup keep warm color.
