# 19_munch · Munch's The Scream-style Expressionism (1893)

> Source: transfer test A (implemented by an independent agent with the skill read-only, 2026-10-04). The scene code was later ported into `scripts/engine/scenes/19_munch.js`.

At experiment time the file was named `scenes/03_munch.js` (about 160 lines). Final version: median adjacent-frame difference 2.27%, roughly 90–140ms per frame on the JS side.

**Flow-line renderer `flowLines` (new)**
- Seeds: 24px jittered grid, about 3,600. Each seed is assigned a region (sky, fjord, mountain, wall, floor).
- Integrate along "a direction field that twists over time"; per-region params [steps, step, width, α]:
  - Final: sky [32,7,10,.78], fjord [26,6,9,.78], wall [42,7,13,.5], ground [32,8,12,.55], plus a random 0–8 extra steps per line.
  - One stroke travels 200–300px.
  - History: version two was [26,6,7,.85], and independent review still judged it "looks like Van Gogh at first glance", so the strokes had to be lengthened, widened, and made more transparent.
- Stop when leaving the region, so region boundaries are clean.
- **No outlines, translucent layered color**: Munch is thin paint and long strokes. The first version copied Van Gogh's "dark outlines", and the wall became segmented caterpillar-short strokes, instantly Van Gogh. It only worked after removing the outlines and increasing steps from 10 to 26.
- Lay a flat fill in the same color family underneath first (wall gradient from `#a8401e` to `#5a1a14`); what shows through the gaps is the same color, not black.

**Direction field**
- Sky: `0.55·sin(x·.011 + y·.018 − 2.4t)`;
- Fjord: tangent around (620,470);
- Wall: vertical ±0.5 sine twist;
- Ground: pointing at vanishing point (1000,640).

**Blood-red sky**
- Seeds choose color bands by "waved y": `yy = y + 22·sin(x·.014 − 2.2t)`, band width 28px.
- 7-color cycle: `#e2541c #f08a24 #f4c03a #c8301e #e8743a #f6a63a #b82a1e`.
- The bands themselves also twist — that is "the sky flowing".

**The whole world flows**
Finally displace the whole painting by row `9·sin(y·.012 + 4.2t) + 4·sin(y·.031 − 6t)`, then by column `6·sin(x·.009 − 3.6t)`, band width 4px, using `KIT.warpRows / warpCols`. The person, cat, and table all wobble together, far cheaper than drawing individual wobbling lines.

**Motifs**
- In the window: diagonal bridge planks, three railing lines (twisting with the world), two distant figures in hats.
- The screamer: skull face, hands pressed to cheeks, mouth opening/closing `7+2sin(9t)`, body swaying `sin(3.2t)·0.12`.
- Table and chair legs are jittering wavy lines.
- Girl: 1890s Norwegian dark long dress + white collar, yellow-green face shadow (blur 8 `rgba(120,150,70,.4)`), 9 strands of long blonde hair traveling in waves `sin(9q − 7t)`.
- Cat's mouth slightly open, as if infected by the scream off-screen.

**Corner label**: text drawn offscreen, then row-warped with a sine. Do not use comic handwriting fonts like Kalam (review said it broke the spell); use IMFellEnglish.

**Pitfalls**
- After whole-image row/column displacement, dark gaps appear at the left and right edges. `KIT.warpRows/warpCols` added a margin parameter: each row is stretched by an extra 2×margin pixels, and margin must be at least the maximum displacement.
- In line-art mode, the torso line cuts through the raised arm holding the cup; overpaint it with `KIT.nearArm` (see ②-16).
