# 23_dali · 1931 Dalí Surrealism (The Persistence of Memory)

> Source: transfer test B (implemented by an independent agent with the skill read-only, 2026-10-04). The scene code was later ported into `scripts/engine/scenes/23_dali.js`.

At experiment time the file was named `scenes/c2_dali.js` (about 235 lines). Median 47ms per frame (first frame 84ms); frame difference 4.6%.

**Pipeline**
1. The background plate is split into three caches because the shadows must sit between them: `dali_bg` (sky, sea, rocks, ground) → draw shadows each frame → `dali_wall` (broken wall fragment with an open window + dead branch) → `dali_block` (stone-block table + stool) → soft clocks → characters.
2. **Volume fill `vol(c, path, x0,y0,x1,y1, a, b, occl, blur)`**: linear gradient fill, then stroke a dark edge inside the clip with shadowBlur for an inner shadow. No outlines anywhere; the academic roundness comes entirely from this.
3. **Long shadows**: project each object's silhouette onto the ground with a shear affine, `setTransform(1, 0, −kx, ky, kx·yg, yg·(1−ky))`, where yg is the object's ground line (wall 700, table/cat 905, person 930). All silhouettes are first drawn into one offscreen (pure black), then composited as a whole at α 0.55, blur 1.5px, avoiding darkening where shadows overlap. Use clip to keep only the ground part (y > 594). `kx = 0.85 + 0.6·easeInOut(lt/1.2)`; shadows visibly lengthen over 1.2s.
4. **Soft clock `softMap(o, sag)`**: disc local coordinates (u,v) → screen. The part with v ≤ fold lies on the tabletop (y compressed to 0.28–0.32); the part with v > fold hangs down: `X = cx + u·(1 − flare·q)`, `Y = … + d·(0.62 + 0.3·sag) + central sag Gaussian + sin ripple`. The outer frame, dial, 12 ticks, two hands (sampled as soft lines along the mapping), and the fold highlight **all use the same mapping**.

**Key parameters**: `flare = −0.12`; a negative value lets the hanging part spread outward like soft cloth with a rounded lower edge; a positive value pinches into an ice-cream cone. drip 0.18–0.4. sag goes from 0.1 → 1.4 over 1.2s: the first version was 0.35→1.0, and review said "the clock isn't visibly melting". Three clocks: windowsill R72, table edge R88, dead branch R64 (fold −34, mostly hanging). Hand rotation speed 4.5–6.5 rad/s.

**Motif animation**: the three soft clocks keep sagging, hands turn at different speeds; the stilt-legged elephant on the horizon (four thin legs stepping alternately with a π/2 phase difference, knees slightly bent at 0.52 height, body bobbing at 14Hz, carrying an obelisk on its back) moves left at 70px/s; 9 ants crawl in ellipses around an orange pocket watch; the long shadows lengthen; the cat's tail softens and droops (tip y + q²·34).

**Characters**: Spanish girl, pale blue long dress + white collar, blonde bun, no outlines, volume from gradients + inner shadows, features in thin dark brown lines. Cat in gradient orange, stripes with a blur 2px semi-transparent brush (soft), eyes with radial gradients; the white chest uses a smooth ellipse (606,768) 40×92 instead of `K.white`.

**Palette**: sky `#22407c → #5f88bd → #e9dcae`; sea `#8aa6b8 → #4f6f86`; rocks `#e8c27a / #9a6a34`; ground `#d2ad70 → #7a5129`; wall `#f4ead2 → #cdbf9f`; clock gold `#f0d27c / #9a7426`, dial `#f6efd6`.

**Pitfalls**
- The shadows in the first version were cast toward the viewer (ky>0, downward) and were all eaten by the bottom edge of the frame. The sun needs to be low in the front-left, with shadows falling back to the right (y′ = yg − ky·(yg − y)).
- Shadows are cast on the ground and must be drawn beneath the wall and table, so the background plate has to be split into layers, not one cache.
- Soft clock flare>0 plus more drip = ice-cream cone.
- The counter's background is deep blue sky; the originally set dark brown text was invisible, so it was changed to off-white text + dark drop shadow.

**Still improvable**: the figure is still a bit vector-illustration; finer highlights and reflected light in the shadows could be added; the reclining soft "self-portrait" creature from The Persistence of Memory could be a fourth motif.

---
