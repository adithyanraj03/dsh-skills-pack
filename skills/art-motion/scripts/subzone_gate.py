#!/usr/bin/env python3
"""Subtitle-band gate: scan the "no-subtitles" cut and report the timecodes where picture content (text, outlines, rockets, fire) shows up inside the subtitle band.

    python3 subzone_gate.py <no-subtitles.mp4> [--band 920] [--fps 10] [--thresh 150]

qa.py checks text boxes; this script adds a check for graphics entering the subtitle band.
It counts dark pixels with gray <95, so it only suits clean light-background styles (whiteboard, off-white paper, light conference stage).
Textured grounds (Vox's kraft-paper desk) produce plenty of false positives when judged by the dominant colour of the subtitle band: for those styles rely on qa.py's framing checks,
or, as the Vox film does, let the text API register the object it belongs to and then check occlusion.
The threshold is the measured value for that film (>150 pixels once the subtitle band is halved to 960×80); for another style, calibrate first on one known-good and one known-bad frame.
"""
import argparse, subprocess, numpy as np
ap = argparse.ArgumentParser(); ap.add_argument('video'); ap.add_argument('--band', type=int, default=920, help='top edge y of the subtitle band (for a 1080-high frame)')
ap.add_argument('--fps', type=float, default=10); ap.add_argument('--thresh', type=int, default=150)
a = ap.parse_args()
h = 1080 - a.band; W, H = 960, h // 2
cmd = ['ffmpeg', '-v', 'error', '-i', a.video, '-vf', f'fps={a.fps},scale=1920:1080,crop=1920:{h}:0:{a.band},scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'gray', '-']
raw = subprocess.run(cmd, capture_output=True, check=True).stdout
fr = np.frombuffer(raw, np.uint8).reshape(-1, H, W)
bad = []
for i, f in enumerate(fr):
    n = int((f < 95).sum())
    if n > a.thresh: bad.append((i / a.fps, n))
runs = []
for t, n in bad:
    if runs and t - runs[-1][1] <= 1.5 / a.fps: runs[-1][1] = t; runs[-1][2] = max(runs[-1][2], n)
    else: runs.append([t, t, n])
print(f'{len(fr)} frames, {len(bad)} hits')
for t0, t1, n in runs: print(f'  {t0:7.2f}–{t1:7.2f}s  at most {n} pixels')
