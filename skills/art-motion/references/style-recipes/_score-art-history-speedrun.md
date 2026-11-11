# Soundtrack method · code-synthesized score for the speedrun film (deconstruction method + original example)

This page is a method sedimented from one deconstruction: the reference film is a 15-second "Art History Speedrun" by X user Tak (@cherry_mx_reds), whose score is itself code-synthesized. Only **how to deconstruct, how to write, how to mix** is kept here, not a note-by-note transcription of the original track.

Companion script: `scripts/audio/synth_art_history_speedrun.py`. The score is an **original example** (D minor, harmony Dm–B♭–F–C), its section structure matching the picture's `scripts/engine/eras.js`; the instrument library and mixing chain can be reused directly, just swap in your own score.

---

## 0. One-sentence conclusion

The score for a speedrun-type short can be **a programmatic arrangement on a strict BPM grid**: 17 eras laid out by "number of eighth notes" (6,4,4,4,4,4,3,3,3,3,2,2,2,1,1,1,9), each later section shorter, using "shorter sections" to create the sense of acceleration while the tempo itself does not change. Each section swaps in a set of representative instruments for that era, and one three-note motif transposed with the chords runs through the whole film. After the music stops on the grid, a string of cartoon sound effects (ding, slide whistle falling, shatter, meow, closing pluck) delivers the ending punchline.

---

## 1. How to deconstruct a reference score

| What to measure | Method | Precision / reliability |
|---|---|---|
| Tempo and grid | superflux-style spectral flux on the STFT (hop 2.5ms), peaks as onsets, then least-squares fit `t = t0 + n·E` (28 onsets in total) | E = 0.23431s (eighth note) → **128.04 BPM**, grid zero t0 = 0.028s. All residuals within ±4ms, impossible for human performance, so it can be concluded that it is code-scheduled |
| Era boundaries | three-way cross-check: ① grid position; ② peaks of the MFCC novelty curve (distance from the mean of ±0.2s); ③ peaks of the per-frame video difference | audio boundaries (grid) vs MFCC peaks differ by ≤20ms. Picture transitions lag the audio by 0–0.2s (the picture uses 0.1–0.2s wipe/morph transitions) |
| Pitch | ① Spotify basic-pitch polyphonic transcription (ONNX, Python 3.11 temp environment); ② take 85ms FFT peaks on the 16th-note grid, gain >6dB before/after the onset marks a new note; ③ self-written CQT semitone energy map read by hand | melody main notes high confidence (both methods agree). Inner harmonic voices, ukiyo-e and Van Gogh sections medium confidence |
| Timbre | for each melody note take harmonic amplitudes 20–220ms after onset (H1–H8, ±1.5% narrow band), then measure the narrow-band envelope's onset time and decay (+50/100/200ms relative to peak) | polyphony mixes in other voices, harmonic ratios can only be read as tendencies |
| Percussion | per 16th note measure energy jumps in >6kHz (noise-type) and <150Hz (drum-type) | high |
| Sound effects | for 13–15s use 20ms-step FFT peak tracking to trace frequency trajectories, aligned with the 2.1s picture contact sheet (one frame every 0.1s) | high |
| Loudness | ffmpeg ebur128; per-segment BS.1770 K-weighted mean square without gating | overall **-14.3 LUFS, LRA 0.9 LU, true peak -2.4 dBTP** (the often-heard "average -16.6dB" is the RMS mean, a different convention) |
| Omni-modal model "listening" | listen to the whole film once with an omni-modal model, ask custom questions from a composer's perspective | treat as candidates only, verify each item against measurement, see section 4 |


---


Two more lessons: judging timbre by "harmonic amplitudes 20–220ms after onset + narrow-band envelope decay" is the most reliable; judging "is it code-synthesized" comes down to three things — are time residuals within ±5ms, are the timbres all textbook building blocks like sine/square/saw/exponential decay, is there recording noise floor in the silences.

---

## 2. Original example score (the `era()` blocks in the script)

The time unit is the eighth note, start = `t0 + n·E`. The motif ♪♪♩ is marked "motif".

| # | Era | Length | Instrumentation | Notes written in the example |
|---|---|---|---|---|
| 1 | Cave | 6 | bone flute + hand drum + off-beat strikes | descending augmented version A4–G4–D4 |
| 2 | Egypt | 4 | harp + sistrum | Dm→B♭ arpeggio; motif F5–G5–D5 |
| 3 | Greek black-figure | 4 | lyre + double-reed aulos | B♭ chord; D5 → F5 |
| 4 | Rome | 4 | horn + war drum | motif C5–D5–A4, F→C→Dm |
| 5 | Gothic | 4 | pipe organ | Dm → Gm/D, D2 pedal |
| 6 | Renaissance | 4 | harpsichord + bass viol | motif B♭5–C6–G5, Gm→F |
| 7 | Ukiyo-e | 3 | koto + taiko + hyoshigi | 16th-note pizzicato in the D miyako-bushi scale (D–E♭–G–A–B♭) |
| 8 | Impressionism | 3 | soft piano | motif variant A5–C6–G5, Fmaj7 → B♭ → Dm9 |
| 9 | Van Gogh | 3 | bright pizzicato + wind sound | D2 bass pulse, scattered A5/F5/D6/E5 up high |
| 10 | Art Nouveau | 3 | celesta | motif D5–E5–A4, B♭→C→Dm |
| 11 | Cubism | 2 | piano-style struck strings | deliberately dissonant: D–G♯–C♯ → E♭–A–B♭–E |
| 12 | Bauhaus | 2 | marimba-like short notes + mechanical ticking | D five-octave stack → F/A → D |
| 13 | Pop | 2 | drum machine + cartoon short notes | kick, off-beat claps, D/F short notes |
| 14 | Pixel | 1 | square wave | F major 32nd-note arpeggio |
| 15 | Raytrace | 1 | supersaw | B♭ chord |
| 16 | Memphis | 1 | supersaw sustained chord + kick + upward glide (cat jumps onto the table) | C major sus held through the section end |
| 17 | 2026 | 9 | 128BPM house: four-on-floor kick, off-beat open hats, saw bass, square-wave-family plucks, pad | modulates to D major add9: F♯5 A5 D6 E6 F♯6 E6 D6 B5 A5 |

When writing your own score: first fix a harmonic loop and a three-note motif, then fill in each section's "representative instruments + transposed motif" per the section table; "outlier" sections (exotic, avant-garde) only change mode or add a tritone, rhythm and grid stay put.

---

## 3. Ending sound effects (as "stop—suspend—impact—react—close")

| Event | Synthesis method (functions in the script) |
|---|---|
| Music stops | bass decays quickly over ~150ms, no hard cut |
| Paw taps cup "ding" | several non-harmonic 5–7kHz rings + a bit of 1.5kHz (`tink`), simultaneously a high-frequency swoosh (`swipe`) |
| Cup falling | pure sine exponential glide ~1550→325Hz, 0.35s (`slide_whistle`) |
| Landing shatter | muted hit around 80Hz + broadband noise (centroid 5–7kHz, ~0.45s decay) + ceramic non-harmonic overtones + a few small shard collisions (`crash`) |
| Meow | harmonic synthesis of a linear broken-line pitch (up then down) + two formants, the loudest in the whole segment (`meow`) |
| Signature appears | two soft ~90Hz "pops" with a bit of brightness (`end_thump`) |
| Close | a low pizzicato landing on the tonic |

All time points are aligned to picture events from the picture contact sheet (one frame every 0.1s).

---

## 4. Mixing method (second half of the script, usable as is)

1. 0.5s small-room reverb, 12ms pre-delay, 9% wet
2. per-section low-frequency warm bed: lay a "triangle wave + octave-down sine, 250Hz low-pass" on the section's chord root (`BED_ROOT`), level auto-computed from the relative value of "floor vs section loudness", sections already sufficient get none
3. per-section 2–6kHz dynamic EQ (`MID_ORIG`)
4. per-section added >6kHz air noise (`HF_ORIG`)
5. per-section K-weighted loudness alignment to `target`, 4 iterations, 10ms smoothed gain to prevent zipper noise
6. optional: 15.8kHz steep low-pass, simulating streaming AAC
7. overall LUFS alignment, then look-ahead peak limiting

With a reference film, fill `target / MID_ORIG / HF_ORIG / LOW_FLOOR_ORIG` with values measured per section from the reference (using the methods in section 1); without a reference film, the example's "uniform relative values" are enough.

On softening onsets: the pluck model's 2ms hard onset sounds too "pointy"; change to a 10ms linear onset, later onsets for higher harmonics (×1.6 per harmonic step, capped at 35ms), halve the onset noise and add a 7kHz low-pass, and it becomes much more coherent.

Example output: 48k stereo, 15.06s, -14.0 LUFS, true peak -1.5 dBTP.

```
uv run --with numpy --with scipy --with soundfile python scripts/audio/synth_art_history_speedrun.py
```

---

## 5. Reusable pattern: making a code-synthesized score for any animation

These can be copied directly.

1. **First fix a BPM grid, and align everything to it**. 128 BPM (eighth note 0.234s) suits "speedrun, montage" rhythms; cut points, music onsets, sound-effect landings all take `t0 + n·E`. The benefit is that however the picture is cut, the music never sounds messy. The reference's time residual is only ±4ms; this "machine-like accuracy" is itself part of the style.
2. **Use "decreasing eighth-note count per section" for acceleration, do not raise the tempo**. This film is 6 → 4×5 → 3×4 → 2×3 → 1×3, with the last section lengthened (9) to let the audience breathe and leave room for the punchline. Tempo unchanged, yet it feels increasingly urgent; and every section lands on the grid, naturally synced with the picture cuts. Method: first list each picture section's duration, round to eighth notes, then fine-tune globally so the decrease becomes regular.
3. **One three-note motif, repeated with changing instruments and transposed with the chords**. Pick a short, rhythmically distinct cell (the example score is ♪♪♩ "step up, then leap down"), have each scene play it on that era's or style's representative instrument, the pitch following that section's chords. A four-chord loop (the example is Dm–B♭–F–C) is enough for the harmonic skeleton; sections wanting an "outlier feel" (exotic, avant-garde) only change mode or add a tritone, rhythm and grid unchanged. The opening can use the motif's inversion or augmented version (the example's cave section is a descending dotted quarter) to establish itself first.
4. **No crossfade between sections**. A new section onsets hard on the grid, the previous section's notes keep their natural tails (plucks 30–300ms, sustained notes about a 150ms release); you can let a low sustained note carry across sections to "stitch" the two. This way every scene change has a clear "click" without breaking. No need to add a whoosh transition to every section (the reference has none).
5. **Design ending sound effects as "stop—suspend—impact—react—close"**:
   - stop: music stops on the grid, with about a 150ms fast decay, no hard cut
   - suspend: a small "ding" as a lead-in, then the falling whistle (pure sine exponential sweep, about 0.35s, over 2 octaves)
   - impact: muted hit + broadband noise + non-harmonic overtones + a few small shard collisions, fully decayed in about 0.45s
   - react: a character vocalization, e.g. a "meow" with a linear broken-line pitch, placed about 0.5s after the impact, the loudest in the whole segment
   - close: one or two soft "pops" with the signature, the last a low pizzicato landing on the tonic or dominant
   All aligned to event time points from the picture contact sheet (one frame every 0.1s).
6. **Loudness alignment method**:
   1. first measure the reference's overall values (ffmpeg ebur128: integrated LUFS, LRA, true peak)
   2. then per section measure K-weighted loudness, plus the differences of 2–6kHz, >6kHz, 40–220Hz floor relative to the section loudness
   3. after synthesis, in order: per-section low-frequency warm bed → per-section mid-high dynamic EQ → per-section air noise → per-section loudness iterative alignment (3–4 times, 10ms smoothed gain, preventing zipper noise)
   4. if the reference is AAC, add a 16kHz low-pass
   5. finally overall LUFS alignment and look-ahead peak limiting
   Use "relative to section loudness" differences throughout, not absolute values, so swapping material or overall loudness needs no re-calibration.
7. **How to turn synth.py into a general template** (structure unchanged, only four data blocks swapped):
   - `T0, E`: grid zero and eighth-note duration (BPM → `E = 60 / BPM / 2`)
   - `edges / target / MID_ORIG / HF_ORIG / LOW_FLOOR_ORIG / BED_ROOT`: section boundaries and per-section reference values; without a reference film, fill `target` with one value (e.g. -14) and the other three with "no compensation"
   - the `era(n0, items)` score blocks: one list per section, elements are `(relative eighth position, instrument function, gain, pan)`. The instrument function library (`pluck` pluck family, `additive` sustained family, `kick / clap / hat / taiko` drum family, `chip / supersaw` synth family) can be reused directly; a new style generally only needs to tune `pluck`'s harmonic table and decay parameters
   - sound-effect block: call `tink / slide_whistle / crash / meow / end_thump` at event times, parameters (frequency, duration) measured from the reference film or set by yourself per the templates in item 5
   The mixing chain in the second half (warm bed → EQ → air → loudness iteration → low-pass → limiting) is kept as is.
8. **Order of the analysis flow**:
   1. onset flux grid fit, get BPM and t0 first
   2. per-cell FFT new-note detection on the 16th-note grid, then cross-validate with basic-pitch polyphonic transcription
   3. judge timbre with narrow-band harmonic ratios and envelopes
   4. judge percussion with high-/low-frequency energy jumps
   5. omni-modal models only as candidates, verify item by item. Measured: it is reliable on instrument identification, but wrong on tempo (said 120, measured 128), motif note count, "transition whoosh", and sound-effect timing
