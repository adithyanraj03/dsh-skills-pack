# 18_klimt · Klimt's Golden Phase (1907)

> Source: transfer test A (implemented by an independent agent with the skill read-only, 2026-10-04). The scene code was later ported into `scripts/engine/scenes/18_klimt.js`.

At experiment time the file was named `scenes/02_klimt.js` (223 lines). 0.45↔0.9s is 32.9% (mostly from the light sweep), median adjacent-frame difference 0.40%, but 14 of 48 pairs are nearly static (see ②-2).

**Pipeline**
Gold-leaf wall (cached) → gold-dust four-point star twinkle (lighter) → window "Birch Forest" pointillism → black-and-white checker gold frame → flower-carpet floor → Hoffmann black-and-white checker table → diagonal light sweep (drawn before the characters so they naturally occlude it) → cat → girl's gold robe (pattern layer clipped to the silhouette with source-in) → realistic face and hands → flower crown → gold sleeves, gold cup → golden steam.

**Gold leaf**
- Per pixel: `f = 0.5 + fbm(x·.004)·0.55 + noise(x·.003, y·.08)·0.5 ± 0.05`, interpolating between `[120,78,18]→[196,148,52]→[246,216,128]`.
- Every 96px, draw a very faint square seam to suggest individual sheets of applied gold leaf.
- Wall: gold leaf × a 480×270 fbm image scaled up, multiplied (mottled brown-gold, like the ground of The Kiss), then 9,000 gold and dark dust particles.

**Pattern (gold robe)**
- 150 random points in four categories:
  - concentric-circle triads (30%): red-white-blue, blue-gold-red, purple-white-gold;
  - gold spirals on dark brown (32%), each rotating at ±3rad/s;
  - Horus-style eye motifs (22%), blinking in turn: closed when `sin(2.2t+φ)>0.86`;
  - white dot clusters + red hearts (16%).
- The hem additionally has 60 black-and-white vertical rectangles with gold outlines — the language of the man's robe in The Kiss.
- **Flat ornament against a realistic face**: face and hands use radial gradients for volume (highlight `#fbe8da` → `#f0cfb8` → `#d8a88c` → edge `#b88068`), blurred blush and eye-socket shadows, with only a 1.2px pale contour. The gold robe has a 3px dark outline. That contrast is Klimt.

**Other**
- Window "Birch Forest": 2,600 autumn-leaf-colored elliptical dots, 6 birch trunks with black marks; 14 falling leaves flip as they drop.
- Flower carpet: 260 concentric-circle flowers, larger closer to the viewer (6→20px), nodding by `sin(4.2t+φ)·0.18r`.
- Light sweep: a 520px-wide, α.24 bright band, sheared with `transform(1,0,−0.45,1)`, lighter, sweeping at **constant speed** from −200 to 2300 in 1.15 seconds.
- Gold dust: 420 particles; a four-point star appears when `sin(t·sp+φ)>0.55`. The first version's stars were too large, like Christmas decorations; the radius was changed from `s·(1+2.2a)` to `s·(0.6+1.1a)`.

**Pitfalls**
- Applying `source-in` pattern by pattern erases the others; see ②-7.
- At α.38 the light sweep looked like lens flare; it was reduced to .24.
- The first version had static stretches between adjacent frames: the blinking was intermittent and the sweep was a soft gradient. After adding three things, static frame pairs dropped from 20/36 to 0/36:
  - 34 gold-leaf flakes flipping and drifting down (150px/s, square and round, gold gradient);
  - gold dust floating up at 26px/s;
  - flower nod amplitude increased from 0.18 to 0.35.
- In the first version the cat's gold spirals were also on its face; review said it "looked like a rash", so they were limited to the body and reduced to 46.
