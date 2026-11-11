# 35_shinkai · 2016 Makoto Shinkai light

> Source: transfer test D (an independent agent working from the skill read-only, 2026-10-04). The scene code was ported into `scripts/engine/scenes/35_shinkai.js` after consolidation.

File name at experiment time: `scenes/r4_shinkai.js`, about 71ms per frame.

**Pipeline**: realistic interior (warm-cool wall gradient, wood-floor perspective seams, aluminum-framed window, wall calendar, desk; cached) → sky + cumulonimbus + utility pole and wires + distant rooftops + airplane contrail + birds → water droplets on the glass → white gauze curtain → window-shaped light patches on the floor and wall (the curtain's shadow sways inside the wall patch) → potted plant → cat, girl (cel) → heat haze → Tyndall light shafts + light dust → lens flare → bloom → soft-light warm-cool separation.

**Key parameters**
- Cel function `cel(c, p, base, shade, rim, {sd, rw, lx, ly})`:
  - Shadow = clip(p) ∩ ¬(p translated by (lx·sd, ly·sd)). Implemented with evenodd: a large rectangle + the translated p, used as the clip.
  - Rim light = clip(p) ∩ ¬(p translated the opposite way by rw).
  - Light comes from the window, lx=−1, ly=−0.55, so shadows fall to the lower right. sd: large parts 22–30, face 10, small parts 8; rw 3–9.
  - Line color #6a4632, line width 2.2. Drawing part by part in the order "fill → shadow → rim → line" makes occlusion automatically correct, so visibleLines is not needed.
- The cat under the window is backlit: lx=0.5, ly=1, the dark side is underneath, plus a ring of warm rim light in lighter mode rgba(255,220,160,.55) on the head and back.
- Colors: skin #ffe8dc/#f2b6a8; blonde #f8d681/#d8a050; white school uniform #fbfbfe/#b9c3dc; navy #2c3a66/#1b2446. Angel ring: a 9px bright arc behind the head rgba(255,250,226,.85).
- Animated eyes: white 8×12, iris with a vertical gradient #1f3f7a → #3f7fd0 → #9fd4ff, two highlights, upper lid 3.4px plus one lash at the outer corner.
- Cumulonimbus: 70+12 puffs. ① Draw all puffs as blue-gray silhouettes (linear gradient #b7c6e6 → #8297c6) ② on each puff, draw a 0.82r white radial highlight ball offset toward the sun (+0.22r, −0.3r) ③ blur the whole layer 3px, then composite a 55% sharp layer. Each puff's radius breathes by 0.05·sin(1.3t); the mass drifts at 10px/s.
- Flare:
  - Sun core: r130.
  - 10 star rays: length 90/170, rotating at 0.25rad/s.
  - Horizontal streak: 840×4.
  - 5 hexagonal ghosts: placed at 0.45/0.75/1.25/1.6/2.0 times along the line from the sun through the frame center, α 0.04–0.12.
- Tyndall shafts: 3 wedges, cached after an 18px blur, screen, α 0.75 + 0.25·sin(3.4t). 60 light-dust motes, radial gradients, twinkling.
- Bloom: draw the whole frame into a small 480×270 canvas → blur 6px, brightness 1.1 → scale back up and composite with screen at α0.28.

**Motif animation**: the cloud mass churning and drifting, the airplane contrail, birds flapping, one water droplet sliding down the glass (with a trail), the gauze curtain and its shadow cast on the wall swaying, potted-plant leaves swaying, hair strands blown by the wind, star rays rotating, light shafts brightening and dimming, light dust. Motion area 3.0%.

**Pitfalls**
- With the sun placed at a corner of the window frame, the flare spills onto the wall and looks like a lamp hanging there. The sun must sit inside the glass, with flare radius ≤130.
- The first clouds gave each puff a radial gradient and then stroked a ring of "lit arcs", which read as a pile of soap bubbles. You need "silhouette + offset highlight ball + blurred/sharp layers".
- The full-width horizontal streak started at 1800px long and looked like a bug line. Shortened to 840px near the sun, α0.35.
- A water droplet drawn as a solid circle looks like a bubble floating in the sky. Draw only the lower-edge arc, an α0.22 transparent body and one highlight dot.
- A variable-name collision (two `const cg`) made the whole scene fail to load, and it was silently replaced by a placeholder frame (see ② item 1).
