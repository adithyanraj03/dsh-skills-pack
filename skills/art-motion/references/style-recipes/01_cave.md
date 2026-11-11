# 01_cave · 40,000 BC cave rock art (pure code)

File: `scenes/01_cave.js` (about 330 lines). Final performance: warm max 22ms / mean 21.1ms, cold (building caches) done at engine boot; determinism passed; 0.2↔0.7s motion difference 3.9% of pixels.

## Pipeline
1. **Rock wall (all cached, `cave_relief`/`cave_bg`)**
   - half-resolution 960×540 height field: `fbm(x·0.0022,4oct)·1.0 + fbm(x·0.011,3oct)·0.16 + noise(x·0.05)·0.03` (coordinates use full-resolution pixels).
   - finite difference ×52 for normals, light source L=(-0.55,-0.62,0.56) (upper left), `shade = clamp(0.5+(dot-0.56)·0.9)`; base color mixed between `#ce925a` (bright ochre)/`#6e4426` (dark)/`#b6643a` (red patch) with two low-frequency fbm layers, then ×(0.72+shade·0.55). Upscaled to full screen with smooth interpolation → soft undulation.
   - overlay two `P.grain` layers (dark 0.22 density α0.32, light 0.10 α0.28) for grain; 10 random-walk cracks (turn angle ±0.45rad per step, step 14–40px, 12% chance to branch), with a +1.6px offset bright line under the dark line → incised feel.
   - vignette: radial gradient r 260→1180, outer α0.8; central static warm light with lighter (α0.36) lighting only the rock wall.
   - **Pitfall: when the relief's mid-frequency term coefficient is large (0.35, ×60 normals) the whole wall becomes camouflage/dunes, and figures look like camo clothing once the texture is laid over them**. Only after mid-frequency drops to 0.16 and normals to ×52 does it look like rock.
2. **"Paint soaking into the rock"**
   - all shapes use one uniform drawing method `shape()`: first stroke once with the **fuzz pattern** (sparse charcoal dots, width 2lw+7) → then stroke with the **ink pattern** (charcoal black, 7% random holes + large holes where noise >0.58, width 2lw) → finally flat-fill to cover the inner half ring. Effect = solid charcoal line + sprayed fuzzy edge, and painter order naturally handles occlusion (the arm covering the coat's line).
   - charcoal "boil": two 256 patterns randomly translated once every 1/9 s via `pattern.setTransform`, geometry static, grain jumping; cheaper than jittering paths and no deformation.
   - after the whole paint layer is drawn, `source-atop` a `cave_figtex` overlay: rock shadow→black α(0.5-v)·150, lit areas→warm white α(v-0.5)·50, dark/light grain, low-frequency wet/dry patches α≤70. **The paint layer gets only one full-screen composite**, hence 19ms.
   - fills are all opaque flat fills, colors get "dirty" from the texture; do not stack paint with multiply — chalk (the cat's white) would disappear.
3. **Negative handprints/pawprints**: 320² temp canvas gaussian spray (σ46·s 3200 dots α0.15–0.6 + σ28 1400 dots), then `destination-out` a solid hand-shape mask, finally fill `#f6e2bc` at mask α0.3. **The hand shape must be filled into the mask piece by piece**: adding the palm ellipse and finger capsules into one Path2D via addPath and filling once, subpaths with opposite winding cancel under nonzero and gaps appear (hit at r4).
4. **Firelight**: one radial gradient per frame, center (1000+40·noise(t·3.1), 540+26·noise(t·2.3)), intensity `0.13+0.09·noise(t·8.5)+0.04·sin(21t)`, **composited with overlay** (α=intensity×2.6). Outside, another vignette layer breathing inversely with the firelight. Pitfall: initially used lighter, and the girl's blonde hair and animal skin washed out to pinkish white, losing ochre saturation; after switching to overlay the colors came back.
5. **Embers**: `P.particles` three groups (left 0–360 ×11, right 1540–1920 ×12, middle ×5), y drifting from 1110 to 120, life 5.5s; bright core r 2.2–4.6 + 3.2× halo, `|sin(6t+1.9i)|` flicker, `sin(q·π)` fade in/out at both ends, lighter compositing.

## Motif animation
- **Bison/horse two poses**: `ph = floor(t·60/7)%2` (switch every 7 frames), two sets of leg endpoint coordinates (extended/tucked), head ±0.07rad around the neck point, whole y alternating -3/+1px; horse and bison in opposite phase. Legs use charcoal lines only (the original does too), the body is a filled silhouette + a 22px dark wash along the spine (Lascaux-style modeling).
- **Holding the cup**: did not use RIG's cup trajectory (table→mouth, with the table point on the girl's chest, unlike the original's "arm extended holding it in midair"). Custom: `hold=(1084,506)` → `mouth=HP(1224,380)`, progress `k = choreo(max(0,lt-0.95)).cup` (the choreo curve shifted 0.95s overall, matching the original's frame 58 raising of the cup), arm uses `RIG.ik2(G.A.shoulder, cup+(34,10), 170,128,-1)`; `RIG.girl({cup:k})` still handles head tilt-back and the slight tilt while drinking. k goes from lt≈1.85 (end of the T01 transition) to 1.
- **Steam**: three charcoal lines `x0 + sin(13q − 11t + 1.3j)·6`, height 58px, following the cup.
- **Cat**: RIG.cat's head/eyes/nose/earInner/stripes/tailPts anchors + self-drawn pear-shaped body, white chest, white front legs, thigh arcs; tail = fuzz/ink/orange three-layer stroke + a stripe every 4 sample points; blinking from choreo.blink.
- **Cat size (review rework)**: at RIG.cat's original size the ear tip is at y≈535, pushing into the mural frame's bottom edge (550). The whole cat is scaled 0.86 with a canvas transform anchored at the sole (540,905) (translate→scale→translate, RIG.cat itself still s=1), the ear tip lands at y≈582, leaving about 30px from the frame bottom, soles unmoved. Line widths scale ×0.86 accordingly, no visible difference.
- **Title**: `Kalam-700` 78px letterSpacing 7, horizontally scaled to 930px wide, `#9b2a18`, drawn into the paint layer (also soaking up the rock texture). α = t<0.933 ? 1 : 1-(t-0.933)/0.2.

## Motion rework (review convention: static segment frames 21–84, 480×270 per-frame mean frame difference)
Replica 0.62 vs original 0.86, too static. Only add local motion, no full-screen flicker:
- Firelight: intensity `0.14+0.11·noise(9.5t)+0.04·sin23t+0.03·sin37t`, center wandering ±60/±36px (original ±40/±26). Tried larger (±0.16, ±90px) and it shot to 1.22 with the picture wobbling; reverted.
- Embers 28→49 (left 20, right 20, middle 9), bright core r 2.6–5.4, halo α0.32, 3.6×, flicker `0.3+0.7|sin|`.
- Handprints flickering: each handprint overlaid with an r=105 warm radial gradient (lighter), α=0.2·clamp(0.5+0.9·noise(7t+3.7k)), independent phases.
- Bison/horse bobbing ±3→ up-down 9px, left-right ±3px, head sway ±0.12rad.
- Cat head small motion (against original frames 65–81): lt 1.08–1.35 with a `sin(πq)` envelope, around neck point (596,680) the head lifts and turns −0.16rad, RIG.cat look pushed 1.5, ears 60Hz micro-jitter ±0.06rad.
- Result: **0.62 → 1.06** (original 0.86); per-frame max 22ms.

## Period-styling the girl
Red ochre `#9c3520` silhouette (face/neck/arms/lower legs), the profile keeps only one almond eye (beige sclera + black pupil + one eyelash, the blink becomes an arc) — this stroke is the key to "girlishness"; blonde hair filled with yellow ochre `#cf8f2c` + 6 `#6e3c0e` wavy strands (amplitude growing with length), the contour also wavy; the lower half of the strands gradually stops following head rotation (HB function), avoiding the whole hair mass swinging when she tilts her head to drink. Knee-length animal-skin coat = G.torso + self-drawn hem (a ±16px zigzag fur edge every 15px), `#b06a2c` + 26 leopard spots of "round patch + 7 small dots" + 18 short fur lines, seams covered by "stroke both pieces' edges first, then fill together".

## Palette
Wall `#ce925a/#6e4426/#b6643a`; charcoal `#21150d`; red ochre `#9c3520`/dark `#74261a`; yellow ochre (cat) `#c9772f`; blonde `#cf8f2c`/`#6e3c0e`; animal skin `#b06a2c`/spots `#4e2610`; chalk `#f0dfbf`; bison `#8c3d22`/head `#76301a`; horse `#cf8236`; stone `#c98c50`/`#c08048`; tabletop `#d49a5a`; handprints `#8e2a1a`; embers `#ffe082`.

## Still improvable
- The girl's body is RIG's realistic curve, "too smooth" compared to real rock-art figures; the more primitive approach is to downsample the contour points to 12–16 and add large hand-drawn jitter.
- The rock relief is static, firelight only changes brightness and not shadow direction; to really have "the rock face undulating under flickering firelight" you need two shade maps with different light directions interpolated by the firelight (+1 full-screen composite).
