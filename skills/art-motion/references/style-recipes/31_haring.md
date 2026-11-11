# 31_haring · 1982 Keith Haring

> Source: transfer test C (an independent agent working from the skill read-only, 2026-10-04). The scene code was ported into `scripts/engine/scenes/31_haring.js` after consolidation.

File name at experiment time: `scenes/k5_haring.js` (109 lines). About 4ms per frame, frame delta 11.5%.

**Technique**
- Flat color grounds: yellow wall `#ffd51c`, green floor `#16a54a`, a 14px black horizon line.
- Everything is a 13px round-capped black line + flat fill, drawn part by part with `X.girl / X.cat` as "fill→stroke".
- **Dancing figures**: capsules from the corrected `X.limb` build 7 limb segments + round heads; **stroke everything with 2×LW black first, then fill the color all at once**, giving a union outline. 4 poses (local key points, origin at the soles) **hard-cut at 8fps with no interpolation** — that is how Haring dances; action arcs are added beside the hands.
- **Radiating motion lines**: n short straight lines on an ellipse around the object (length 22–34, line width 7–9), changing angle at 8fps. Used on the cat, the girl's head, the cup, the teapot, the red heart and the figure on the right.
- **Everything bounces on the beat**: `bounce=|sin(t·128/60·π)|^0.6`. The girl gets dy=−12·bb; the cat is half a beat behind. The table squash-and-stretches around its feet (sy 1−0.07(1−bb), sx 1+0.05(1−bb)) and its legs bend; the teapot hops 26px; the window frame rocks ±0.025rad; the length of the "jump" horizontal line on the floor changes with the beat.

**Motif animation**:
- The radiant baby in the window: a white union silhouette, crawling on two alternating frames; 14 rays, alternating long and short at 8fps.
- 3 dancing figures on the wall (red/blue/pink, different phases, one mirrored).
- The red heart above the table beats and carries radiating lines.

**Character**: an 80s New York girl. Oversized red sweater (one rib line at the hem), denim-blue long skirt, white high-top sneakers. The face keeps only an eye dot and a red lip line (Haring's figures have no features at all; these are kept so she can be recognized). The thick black circle on the ear looks like a Walkman headphone, which happens to fit the era.
**Pitfalls**: the reversed end cap of `RIG.limb` leaves a hole at the joint under a thick outline (see ②-1). The window crossbar must be drawn below the baby. RIG's hairLines are thin lines, which violates "equal-width lines" in Haring, and they crossed the face when the head tilts back to drink, so they were removed.

---
