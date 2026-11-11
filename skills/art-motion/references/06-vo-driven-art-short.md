# 06 · VO-driven art short (method draft, awaiting validation on a first real film)

Goal: from a voiceover, produce an animation whose shots and images stay coherent, in a chosen era's or artist's style. For the latest full-film method see `12-full-vo-film-and-feedback.md`.

> ⚠️ This page is a plan derived from the Art History Speedrun engine, **and has not yet been run on a real voiceover**. When the first film is finished, delete this line and write the measured results back in.

## Differences from the speedrun film

| | Speedrun film | VO short |
|---|---|---|
| Timeline | BPM grid | VO word-level timestamps (from your transcription tool, e.g. word-level timestamps from something like Whisper) |
| Style | style changes every segment | **one style throughout** (one artist / one era) |
| Camera | fixed camera | needs camera language: push/pull, pan, shot-size changes, follow |
| Narrative | skeleton fixed, style changes | style fixed, content changes with the VO |

## Process

1. **VO → storyboard**: cut by sentence; for each sentence decide "what is on screen for this line" (concrete object / metaphor / character action / text), and mark the shot type (wide / medium / close-up / push / pan) and duration (from word-level timestamps). Show Huashu (the author) 5–10 lines of the storyboard before you start work.
2. **Defining the style = renderer + palette + line**: pick the closest card in `style-recipes/` as a starting point; for a style that isn't there, write a new renderer per doc 04 section 3. Produce one frame first (three-direction hard gate: the same frame of the same VO line, three style interpretations for Huashu to choose from).
3. **A world, not a picture**: a VO film cuts between shots, so build the scene as a "world canvas" larger than the frame (e.g. 5760×3240), with each element in world coordinates; the camera = the viewport (centre, zoom, rotation). The renderer acts on the frame the viewport renders out, and brush size is set in screen pixels, so brushstrokes don't get thicker as you push in — this is the key to "the painting is moving" rather than "the image is zooming".
4. **Flow between shots**:
   - Within the same scene: interpolate the viewport (push/pull/pan), with ease in/out.
   - Changing scene: transition in that style's own language (Van Gogh is a vortex of brushstrokes sweeping it away, ukiyo-e is a wave, ink wash is a bleed) — doc 02 layer 3 mechanics.
   - Match cut: the shape in the previous shot matches the shape in the next (cup rim → moon).
5. **Text and VO**: keywords can be written into the picture in that style's typeface/brushwork (mosaic letters, calligraphy, neon), not as generic subtitle bars; subtitles are handed to the editing project on a separate track.
6. **Music**: use doc 05's grid method as is, only the grid gives way to the VO rhythm (put transitions and musical accents in the pauses between sentences).
7. **Acceptance**: watch side by side with the VO — is the picture saying the same thing as each line; is every shot moving; is the style recognisable at a glance.

## Division of labour with the video pipeline

Transcription, timeline, mixing and delivery of the VO go through your video pipeline; this skill is responsible only for the "art animation picture" track, producing a silent MP4 or ProRes as the picture track for the editing project.
