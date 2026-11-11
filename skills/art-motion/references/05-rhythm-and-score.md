# 05 · Rhythm and score

Breakdown method and reusable rules: `style-recipes/_score-art-history-speedrun.md` (section 5, "reusable rules", can be copied directly); synthesis script template (original demo score): `scripts/audio/synth_art_history_speedrun.py`.

## Key points

1. **Fix the BPM grid first; picture and music both land on the grid.** 128 BPM, eighth note 0.234s, suits speedrun/montage. `eighths` in `eras.js` is how many eighths each segment occupies.
2. **Acceleration comes from each segment getting shorter, not from a faster tempo.** 6 → 4×5 → 3×4 → 2×3 → 1×3 → the ending stretched out.
3. **One three-note motif, each segment switching to that style's representative instrument, transposed with the chord.** A four-chord harmonic loop is enough.
4. **Hard onsets between segments, no crossfades, no whooshes.**
5. **Ending sound effects: stop — suspend — slam — reaction — close out** (ding → falling slide whistle → shatter → cat meow → low plucked note), with the timings aligned to the picture-event frames.
6. **Loudness**: match the reference film's integrated LUFS and true peak; compare the relative differences segment by segment.
7. Treat what a full-modality model hears as candidates only: instruments are reliable, but BPM, motif note count and sound-effect timing must all be re-checked with onset detection.

## Counterpoint with the picture

- Transition start = grid point; the camera impact (scene layer 1.03 → 1.0, 20 frames) lands on the same point, so the audible "click" and the visual jolt are the same beat.
- The ending performance's action frames (cup tap 3, the cup hitting the floor) align to audio onsets within 3 frames.
- Without a reference film: write the segment table first (how many eighths each), then generate the picture timeline and the score together; afterwards change the rhythm in one place only, `eighths`.
