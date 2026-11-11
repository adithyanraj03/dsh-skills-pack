# 01 · Breakdown: take an animation and, within an hour, break it down far enough to write it as code

The goal is not a write-up of impressions; it is to produce **a spec you can program directly from**: the start and end frame of every segment, transition mechanics and parameters, the in-shot action list, the value curves of counters/subtitles, composition coordinates, and the grid and instrumentation of the audio track. Words are the index; numbers and contact sheets are the body.

First real run: 2026-10-04, breaking down the 15-second "Art History Speedrun" on X (16 art eras, 15 transitions); the whole pipeline took about 1.5 hours (storyboard agent 79 minutes, audio agent 22 minutes, in parallel).

## 1. Probe the physical parameters first (5 minutes)

```sh
ffprobe -v error -show_entries format=duration:stream=codec_type,width,height,r_frame_rate,sample_rate -of default=nw=1 src.mp4
```
For X video, pull the highest tier from the syndication endpoint (pick the highest bitrate in `video_info.variants`); don't screen-record. If the source is 60fps, break it down at 60fps — the frame number is the shared language for every spec after this (seconds = frames/60).

## 2. Three overview images (10 minutes)

1. **Contact sheet**: 4fps × 480 wide, 30 frames per sheet, with timestamps. One look tells you how many segments there are and what each one is.
2. **Keyframe overview**: pick the cleanest full frame from each segment and tile them into 4×5. This is the map for all later work.
3. **Spectrogram**: `ffmpeg -lavfi showspectrumpic=s=1600x400:legend=1`. One look tells you whether the music changes instrumentation per segment, whether there are falling glissandi, shattering transients, or beats. Clean harmonics with a hard cutoff at 16kHz = code-synthesized + AAC.

## 3. Measure transitions and rhythm (15 minutes)

**Frame-by-frame grayscale diff**: downscale to 192×108 grayscale, take the mean absolute difference between adjacent frames. Static segments <2, transition segments 10–37. A threshold of 5 plus a 12-frame debounce finds every transition start in one pass. Save it as `diff.npy` and share it with all agents.

Once you have the starts, **fit the grid**: if the start intervals are integer multiples of a constant, there is a BPM grid (this film: start = 84 + 14.06·n frames, residual < 0.45 frames, = 128 BPM eighth notes). Once the grid is confirmed, write every time in picture and music as "which eighth note".

**One 60fps contact sheet per transition**: begin 2 frames before the start, sample every 2 frames, for 0.5 seconds, 15 cells. The mechanism is only visible here — descriptions like "8 vertical bars fall in sequence and bounce back" or "20px squares flip around the vertical axis and spread outward from the cat's position"; glancing at a 4fps sheet you would only write "square transition".

**Take the reference frame as "the last frame before the transition starts"**, not the frame you think looks good. Take it too early and you mistake the afterglow of the previous transition (rubble) for picture content (hit on the Egypt first version).

## 4. In-shot motion: what is actually moving inside each segment (15 minutes)

Motion heatmap: within each segment's static interval, take the per-pixel maximum frame difference, overlay red on the grayscale plate, and label the "share of moving area".

This film's conclusion overturned the first impression: I assumed "each segment is just one picture", but in fact every segment has 2.5%–34% of its area moving — cave-painting animals alternating two poses at a run, the scarab pushing the sun disc, the meander band scrolling, Vesuvius smoking, gold-leaf highlights sweeping past, the ornithopter flying by, the pop four-panel colour change… **Start production without this step and what you make is "transitions between images", losing the continuous motion inside the scene.**

The heatmap tells you "where it moves"; then go into the 60fps frames to see "how it moves" (period, amplitude, whether it is two-frame alternation or continuous).

## 5. How to write the brief when splitting the work across agents

- Storyboard agent and audio agent in parallel, each getting a complete brief: asset paths, known facts (frame rate, duration, the rough segment table), required deliverables (storyboard.md / spec.json / contact-sheet directory / score-breakdown.md / synthesis script), method requirements (prove it with data, don't go on imagination), reply format (summary + the 3 least certain points).
- Have them **correct your list first**. On this film I mistook the "aperture transition 1993→2026" for a "Memphis era", and the storyboard agent corrected it in its very first bullet.
- Treat what a full-modality model "hears" in the audio track as candidates only: instrument judgements are reliable, but BPM (it reported 120, actual 128), the note count of the motif, and "one whoosh per segment" were all wrong; you must re-check with onset detection.

## 6. Deliverables list (what you should have once the breakdown is done)

| Deliverable | Purpose |
|---|---|
| `storyboard.md` + `spec.json` | start/end frames per segment, transition mechanism parameters, in-shot action, counter curves, composition coordinates |
| `transitions/T*.jpg` (60fps contact sheets) | frame-by-frame reference while writing transition code |
| `in-shot-motion/motion-heatmap.jpg` | what moves in each segment, and how much |
| `ending-action/` (if there is character performance) | per-frame centroid, trajectory, physical parameters (gravity px/frame²) |
| `score-breakdown.md` + `synth.py` (template: `scripts/audio/synth_art_history_speedrun.py`) | BPM grid, eighth-note count per segment, motif, instrumentation, SFX sequence |
| `keyframe-overview.jpg` + `image-gen/ref/*.png` | composition map, reference frame per segment |

Scripts: `scripts/analyze/` (contact sheet, grayscale diff, transition contact sheet, motion heatmap); commands are in each script's docstring.
