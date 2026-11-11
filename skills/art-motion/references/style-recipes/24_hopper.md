# 24_hopper · 1942 Hopper American Realism (hard light, blocked planes)

> Source: transfer test B (implemented by an independent agent with the skill read-only, 2026-10-04). The scene code was later ported into `scripts/engine/scenes/24_hopper.js`.

At experiment time the file was named `scenes/c3_hopper.js` (about 150 lines). Median 13ms per frame (first frame 54ms); frame difference 6.0%.

**Core technique "two-version matte"**: the same `room(g, K)` function is drawn into two caches with two palettes — the shadow version `SH` (cool green wall `#5d8679`, dark floor `#5b3d2b`) and the lit version `LT` (warm yellow wall `#efcf8f`, bright floor `#c98b52`). Each frame first draws the shadow version, then clips the lit version into a moving light-patch polygon; the light edge is naturally hard and the whole patch can be translated. Characters and furniture work the same way: `girl(c, K, G)` is drawn once in shadow colors, then clipped into the diagonal light band and drawn again in lit colors.

**Light-patch geometry** (dx = 30 − 95·easeInOut(lt/1.25), moving left about 95px over 1.2s)
- Wall patch WP: (1420+dx, 250) → (1920, 470) → (1920, 730) → (1420+dx, 730)
- Floor patch FP: continues below the wall patch, spreading to the lower right
- Character light band OP: left edge from (1345+dx, 0) to (1185+dx, 1080). The light edge sweeps across the girl's face in this segment, from half the face in shadow to the whole face lit.
- Window-mullion shadows: 24px vertical bars + one diagonal bar parallel to the upper edge of the light patch
- **The person's shadow on the wall** = the character silhouette translated by (+150, +18), drawn offscreen, `source-in` filled into the shadow plate, then drawn back into the light-patch area. The effect is the shadow wall showing through the light patch, in sync with the character's pose.

**Motif animation**: the light patch moves slowly (the core); across the street outside the window, the barber pole on the red-brick building (a nod to Early Sunday Morning) has red-and-blue diagonal stripes moving upward at 60px/s; the roller-shade pull cord sways gently `sin(4.2lt)·0.07rad`; 26 dust motes float in the light band (visible only to the right of the light edge); steam.

**Texture**: oil-paint drag strokes use vertically stretched fbm (x·0.06, y·0.006) as the main component and diagonal as a secondary, generated at 1/4 resolution then upscaled, `soft-light` α 0.2. Outside the window, each window opening has a 10px hard shadow on its right side, and the roller shades are pulled to different heights (0.25–0.7) — these are Hopper's details.

**Palette**: shadow wall `#5d8679`, wainscot `#4b6d63`, floor `#5b3d2b`; lit wall `#efcf8f`, wainscot `#d8ad68`, floor `#c98b52`; dress shadow `#7a2c2a` / lit `#cc4a3c`; blonde hair shadow `#a8893f` / lit `#f3d67e`; brick `#b4553a`.

**Pitfalls**
- The brushstrokes in the first version used horizontal fbm at α 0.35, and the wall looked like watered marble. Hopper's walls are flat; brush marks should be barely there.
- While editing the code, a comment was inserted into the middle of a line, commenting out the rest of that same line (watch out when doing batch replacements in Python).

**Characters**: The first version had a bun + long red dress, and review said "she reads as an adult woman, not 17". Changed to shoulder-length loose hair (`hair:'long'`) + a blue headband, and she became younger. The cat's white chest uses a smooth ellipse, shadow white `#dcd6c8` (the first version's `#c4bdac` read as a gray-white cat).

**Still improvable**: the cat stays in shadow the whole time and is a bit dark (a trade-off for the loneliness). It could also be given a small patch of light coming from the back window.

---
