# Camera language: how to use the camera

The expansion of SKILL.md's "The director's demand: how to use the camera". Every number on this page states **when it applies and when to ignore it**. The numbers come from measurements of reference films and from films the author has endorsed; they are starting points, not quotas. If you have a better shot design, do it, then watch it once at normal speed and compare it side by side with the reference.

## 1. Ask three questions before moving the camera

1. **Where should the audience look right now, and is it readable at the current shot size?** If it's readable, don't move. If the frame is moving on its own (live footage, a line being drawn, a curve growing, water being poured), all the more reason not to move — moving the camera steals the show.
2. **Is this move a transition or an accent?** Carrying the eye to the next place, establishing a relationship, laying in mood — that's a transition, use the slow ones. A reveal, a reversal, a key number landing, a punchline — that's an accent, and only then use the fast ones.
3. **What was the move in the previous shot?** If you pushed in, look for a chance to pull out or pan away; don't push inward shot after shot. Use the same move three times in a row and the audience starts hearing a metronome.

## 2. Move table

| Move | What it's for | Reference numbers | Where the numbers come from | When to ignore this number | Engine |
|---|---|---|---|---|---|
| hold | The audience is reading text, the frame is moving on its own, the silence after a joke | How long to hold follows the voiceover; no upper or lower limit | Vox dwell segments frame-diff 0.0–0.1; 3b1b's wait is static | — | no action written |
| slow push | Carry the eye to the next detail, push the emotion one step forward | 0.6–1.5s, sineInOut; push until the thing to look at is readable, typically 10–40% | Vox measured: push into photos 1.0–1.5s, finding a card 0.5–0.9s; 3b1b native push ~1s; Heer & Robertson 2007 recommend ~1s with ease-in-out for data transitions in statistical charts (that's about chart transitions, borrowed here as an analogy) | When the push distance is large (2× or more) it can go to 2s; when following musical beats, follow the beat | `push` (default 0.9s) and `to` on `CAM.track` |
| pull back | Return to the whole, establish "where it is", close a section, endings | 0.8–2s, fast start, long tail settling | Vox pull-out ~1s; Kurzgesagt fast pull-back reveals 0.2–2s, long tail | For scale travel (pulling from a cell to Earth), use the duration of "④" on the y1 card | `pull` (default 1.1s, `MO.longTail`) |
| pan / find the next thing | Walking from one thing to the next on the same wall or the same desk; following something that moves | 0.5–0.9s, sineInOut; tracing along a red line 1.3–1.8s, long tail | Vox measured | When following a moving object, speed follows the object | `glide` (default 0.7s) |
| fast push | Accent: reveals, reversals, key numbers | 0.25–0.35s, push in 18–32%, then hold | The numbers used when the Nobel literature film r3 was accepted (doc 07 item 29; the material and background color changed at the same time); School of Motion kinetic type "camera push 6 frames + 2-frame pull back" | In kinetic type (y5) the fast push is the main grammar and follows the accents; in other grammars it's the minority | `punch`, `to` with `dur: MO.PULSE.punch` |
| quick move / whip | Sudden eye transfer ("I open the laptop → (the screen)"), comic timing | 0.26–0.30s, with motion blur | y4 whip measured at 0.26s expoInOut | — | `pan`, `TRANSITIONS.whip` |
| slam | Big type, numbers, stamps, the moment a new frame lands | 0.17s, 1.55→0.94→1.0 | Implemented in an accepted film | At most once per shot; don't slam on every cut | `slam`, `MO.slam` |
| hard cut / jump-in | Change shot size without a camera move: reaction close-up, jump one step closer | 0 frames | y4 storytime: hold + jump-in; jokes land on the cut | — | `cut` |
| slow drift, constant slow push | Mood shots, art-style frames where "the painting stays alive", lyrical MV sections, emotional long takes over 5s | 1–4%/s as a starting point | No accepted-film measurement: these are numbers from the y1 and y2 demo films (4%/s, 1%/s); used on explainer shots it was judged an old practice; used on mood shots it has never been rejected — after finishing, compare side by side with the reference | **In an explainer, a slow push of a few percent on every shot is a PPT** (the film in doc 07 item 29); this one use is not allowed | `CAM.drift`, `CAM.at` |

All duration constants live in `MO.PULSE`; `CAM.track` without a kind is a slow push; a `pull` without `k` exactly cancels one default slow push, and the surest way back to the whole is to write `z: base.z`. For parametric clips (t2, y1, y2) the highlight defaults to a slow push; write `"camera": "snap"` inside the spec's top-level `data` (`{"data": {"camera": "snap"}}` — writing it directly at the spec top level (alongside grammar) or inside a cue's data has no effect and raises no error) to switch to a fast push. It turns the entire clip into fast pushes, so write it only on the segment that needs the accent.

## 3. Count and density: when it applies, when it doesn't

**Principle**: accent moves are like bold in prose — bold everything and there is no emphasis left. Push-ins must come and go.

| Situation | Applies? | How to judge |
|---|---|---|
| Explainers, science popularization, finance, whiteboard, Vox-style films | Yes | Fast push + slam + whip together under one third of the shot count (lint ⑯); never three push-ins in a row (lint ⑮); in the finished film, if film_gate's "push-in count" exceeds 8 per minute it reports yellow — watch it once at normal speed |
| The first 3-second hook of a Douyin / WeChat Channels film | Density doesn't apply | The hook may be dense; after 3s return to normal rhythm |
| Kinetic type (y5), beat-synced passages | Fast-push count doesn't apply | The camera follows beats and accents; the rhythm comes from the music |
| Story, comedy (y4) | Pushes apply, cuts don't | Relies mainly on holds + hard-cut jump-ins; very few push-ins |
| MV, mood films | Follow the emotion | The author (2026-10-11): "The camera moves and transitions all feel monotonous and dry — no variety, no emotional expression." Slow pushes and slow drifts in the verses, speed up only in the chorus, pull back in the instrumental break, land transition peaks on the beat |
| Art History Speedrun, time-travel pieces | Push-ins don't apply; "is the painting alive" does | One main action per act + 2 looping motifs; the camera may drift slowly throughout |
| 3b1b (t1) | Yes | The camera follows the object under discussion: one smooth push of about 1s, static during wait; fast push only when a conclusion lands |
| Launches, screenshot tutorials (t2) | Yes | Full-bleed screenshots; slow-push only into the region being discussed that can't be read at full size, one or two pushes per image, then pull back to the whole or pan to the next region |
| Finance charts (t3) | Yes | Hold while the chart grows itself; slow-push ~1s when calling out a data point; fast push only for the one or two most critical numbers in the film |
| Kurzgesagt (y1) | Pushes apply, ambient layers don't | Ambient layers may move gently throughout; slow-push at named nodes; dive-in and pull-out follow scale-travel durations |
| Vox desk (y2), whiteboard (y3) | Pushes apply, pans are free | One world canvas; panning between items is the main grammar and may run consecutively; push in for the line to be read, pull out once it's read |

**Counter-example yardstick**: on 2026-10-12 a vertical Nobel economics short ran 102 seconds, 44 shots, with about 48 push-ins in the code (one every 2.1 seconds on average), all inward, each 0.28s pushing in 10–26%, with almost no pull-backs or pans. The author: "There are very, very many zoom-in camera moves. Too many, and the rhythm is too fast — not smooth at all." film_gate measured about 12 push-ins per minute on this film (this is a floor: half of the push-ins over live footage can't be measured).

## 4. When real material is full-bleed: the easiest trap to fall into

When a shot is one full-bleed photo or clip, the only thing the camera can do is push in, and the whole film becomes "cut to one, push, cut to one, push". That Nobel short was exactly this. Remedies:

- **If the live footage is already moving, hold.** People walking, hands moving inside the footage — stack a push-in on top and the audience feels wobble.
- **At most one or two pushes per image**, and only when "this spot can't be read at full size". Pushing every time the voiceover names a noun is putting a metronome under the VO.
- **Vary the entrance**: pull out from a close view to reveal the whole; pan in from one side; hard-cut from the previous shot's landing point at the same shot size.
- **When several pieces of material are discussed in sequence, lay them into one world canvas** (`MD.print` photographic prints on the Vox desk, see the y2 card); the camera pans between items, so push-ins and pans alternate and naturally come and go.
- **A cut does not mean pushing again.** Starting every shot from 1.0 stacks up into a push-push zoom in.
- **The Vox desk is not material shrunk down and parked.** When the camera holds on an item, it should fill 80–90% of the frame (y2 card); large areas of bare desk should appear only mid-move and in the closing pull-back. In the 2026-10-12 A/B, the film under the new rules switched to the Vox desk and push-ins dropped from 15 to 8, but when it held, the photo filled only half the frame width and too much beige desk showed.
- **For a landscape illustration in a vertical frame, crop first, then place.** A full 16:9 illustration dropped into 9:16 leaves only a middle strip with empty space above and below; crop to a vertical composition around the part the VO is discussing, then make it a print or full-bleed; save the whole image for the closing pull-back. Two independent agents hit this same rule on the same day.

## 5. Self-check

- Storyboard stage: `storyboard_lint.py` checks three consecutive shots with the same move (hold doesn't count), three consecutive push-ins, accents over one third, and a table with no moves at all.
- Finished-film stage: a yellow light on `film_gate.py`'s "push-in count" means too much pushing — go look; a red light on "fast-motion frame share" means the film barely moves. Note: a slow push of ~20% over ~1s scores about the same on this metric as a 0.28s fast push (measured on three frames of the Nobel short on 2026-10-12: a 0.28s push spans 3 frames, a 1.0s push 4–7 frames, a 2.0s push 3–10 frames counted as fast motion), so you don't need to speed up shots just to pass the gate.
- **Whether camera moves are smooth cannot be seen from extracted frames.** Stills contact sheets show composition only; for shot rhythm you must watch the finished film start to finish at normal speed, at least the densest 30 seconds.

## 6. Sources and history

| Date | Film | What happened | Where it landed on this page |
|---|---|---|---|
| 2026-10-08 | A Nobel literature explainer r2 → r3 | r2 pushed in at a constant 7.5% on every shot, with a fixed beige background, a title bar and photo frames, and was judged "feels exactly like a PPT playback"; r3 changed four things at once: full-bleed live-action footage, a dark real environment, page frame removed, hold → 0.28s fast push → hold — "much better now, ship it when done" | The "not allowed" use in the slow-drift row, and the source of the fast-push row. Four things changed together, so it's unclear which one did the work; yet later only "fast push at every VO node" was written down as a rule, which just re-skinned the "same move every shot" disease at a different speed. Reviewing on 2026-10-12 the author said "the literature film is mediocre, the physics one is decent" |
| 2026-10-10 | "A Day of Claude" opening r4 | "Very good, keep going at this rhythm": slam, a 0.35s yank open into a cutaway panorama, a paper-plane pan, floating dust added to stills | What was accepted was a mixed set of moves — the yank-open and the pan were both in it |
| 2026-10-05 | SpaceX whiteboard | The author picked r6; r17 had 5 more push-ins than r6 (unconfirmed whether that was what won the author over) | To be confirmed |
| 2026-10-11 | Qi Li Xiang Monet MV | "The camera moves and transitions all feel monotonous and dry — no variety, no emotional expression." | The MV row in section 3 |
| 2026-10-12 | Nobel economics short | "There are very, very many zoom-in camera moves. Too many, and the rhythm is too fast — not smooth at all." | The counter-example yardstick in section 3, and section 4 |
