# Full-VO film and lessons feedback

This page collects the general methods for making a full-VO film; it does not contain the author's private feedback archive. Segment interface still in doc 09, characters in doc 10, long-scroll demo in doc 11.

## From voiceover to picture

Confirm the script, the voiceover, and the word-level timings first, then build the style table and the highlight list. Hang actions on keywords (like `TM.cue` in the reference code) rather than hard-coding every time. The camera moves with the content's framing box; the subtitle area is a constraint on camera space, and the camera must keep clear of it even when pushing in.

The whiteboard accumulates on one large canvas, and the first stroke of a block is synchronized with the camera arriving; inside a block, write to the pace of speech. After setting up the board with `const B = DG.board(...)`, call `B.line(points, {smooth:false})` for rectangles so the smoothing spline doesn't bow them into ellipses. The reading time for a complete list counts from when the last item finishes appearing; drawing time must not be counted as readable hold.

Vox collage: establish the objects, their relationships, and the camera first, then add paper texture and decoration. Presenter-led films: plan different layouts and shot sizes up front; moving the person around in post cannot rescue monotonous storyboarding.

## Acceptance and freeze

`qa.py` provides signals on determinism, efficiency, motion, smoothness, and text framing. The framing check can detect clipped text, overlapping text, the subtitle area, and near-blank frames; decorative large type can trigger false positives, so look at the frame in question. For films on light backgrounds, use `subzone_gate.py` to additionally check whether graphics enter the subtitle band; that dark-pixel threshold does not apply to textured backgrounds.

Before delivery, an agent that took no part in production reviews the film independently; for long films, at least two. Each issue records timecode, root cause, change, and re-check; regressions of old issues are kept separate from newly found ones. Accept on the basis of specific issues; don't chase an overall score. If the same class of issue survives three consecutive rounds and two attempted fixes both fail, go back to the material or the engine's capabilities; an upstream script problem goes back to the script.

Once the user has chosen, freeze the code, timeline, mix, and subtitles together. Keep candidate cuts and the frozen version inside the project, and don't overwrite them without confirmation.

## How lessons go back into the skill

Each round records phenomenon → root cause → fix → verification → destination. Style-specific problems go into the matching grammar card, cross-style methods into doc 09, character methods into doc 10, and anything machine-measurable into QA. Recurring pitfalls get distilled into the "before you start" checklist, and once they become engine capability they need fewer written rules. After a change, have an independent agent verify it and write it into the CHANGELOG.

A project's private feedback, personal-appearance prompts, and unreleased material stay inside the project; the public skill takes only reusable methods and the necessary evidence.
