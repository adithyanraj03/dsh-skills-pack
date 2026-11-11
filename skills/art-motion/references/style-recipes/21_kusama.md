# 21_kusama · Yayoi Kusama infinite polka dots

> Source: transfer test A (implemented by an independent agent with the skill read-only, 2026-10-04). The scene code was later ported into `scripts/engine/scenes/21_kusama.js`.

At experiment time the file was named `scenes/05_kusama.js` (124 lines). 0.45↔0.9s is 17.3%, median adjacent-frame difference 2.98%, 4–28ms on the JS side.

**Writhing dots**
- All dot radii are multiplied by the same "traveling wave from the cat": `wave = 0.82 + 0.28·sin(dist·0.012 − 6t)`.
- The dots across the whole room swell and shrink in rings from the cat's position, as if breathing. This one function brings the entire screen to life.

**Dot layout**
- Wall: two hexagonal grids, large dots (30px, spacing 104) + small dots (10px, offset), each with ±25–50% jitter. Each dot is a slight ellipse with a random rotation, as if hand-drawn.
- Floor: 9 rows, larger closer (6→28px), sparser, squashed to 0.42 ellipses for perspective.
- Red dress white dots 13px, spacing 52, **crawling down the dress** at 46px/s (clipped to the dress silhouette, y offset modulo).
- Cat: white dots on orange areas, red dots on white areas, each crawling downward.
- A red dot is also painted on each cheek (Kusama's body painting), and a red-ground white-dot bow on the head.

**Infinity mirror room (window)**
- 3D grid lights: 13×7×3, 6 colors. z cycles toward the camera at 0.3/s, perspective projection F150.
- Each light is a small solid core plus a 3.2× glow, composited with lighter.
- Pitfall: in the first version the lights were randomly scattered with huge glows, blurring into bokeh. Only a regular grid + small solid cores gives the sense of mirror-like infinite repetition.

**Yellow pumpkin**
- 5-lobe ellipse, drawn outside → inside.
- Each lobe has rows of black dots: largest in the center column (9.5px), shrinking toward the sides and top/bottom, with dot size also changing with the traveling wave.
- Overall breathing: scale `1 ± 0.025·sin(5t)`, pivoting at the base.

**Ending "self-obliteration"**
- lt 1.0–1.26: a red overlay fades in, and a full-screen 120px hexagonal dot lattice swells in rings from the cat's position to 0.47× spacing. Then for about 0.15s only the lattice breathes gently, giving the ending a resting point (review noted the first version had no hold frame).
- The last frame stops on the red-ground white-dot lattice.
- Pitfall: the first version let the dots grow without limit and ended in a white screen. Radius must be capped, and the ending must stop on the lattice, not on a flat color.
- Pitfall: the dress and wall are both red-ground white dots, so the girl dissolves into the frame. The final version raises the girl's contour to 4.5px and removes the red dots from the cat's white areas, preserving the orange-white boundary.
