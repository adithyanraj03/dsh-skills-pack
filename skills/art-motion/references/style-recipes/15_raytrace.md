# 15_raytrace · 1993 early ray-traced CGI

No 3D engine — it fakes renderer output with 2D Canvas "shading conventions".

## Plastic shading (every part goes through it)
`plastic(c, path, base, hx, hy, R)`:
1. Fill the base color;
2. radial gradient centered on the highlight point (hx,hy) with radius R: 0→white .55, 0.28→white .06, 0.62→transparent, 1→dark purple `rgba(10,0,30,.42)` (edge darkening = volume);
3. environment reflection: `lighter` a ring of `rgba(70,150,150,.28)` stroke, width 0.18R, offset 0.04R to the left — the wall is teal-green, so the reflection is teal-green;
4. a hard-edged white elliptical specular highlight (0.16R × 0.09R, opacity .85). That one stroke is the most 90s-Phong thing about it.

Limbs use `cyl()`: the gradient runs across the limb's normal direction (dark .25 → white .5 as a narrow band at 22% → dark .45), then a thin white highlight line along 20%–75%.
The girl uses RIG.girl's Path2D (long hair), with the dress replaced by blue plastic cylindrical legs + spherical knee joints, and spherical shoulder joints added — the jointed feel of a "toy figure".
RIG's cat body is a polyline and plastic shading exposes the facets: `RIG.smooth(K.bodyPts)` first, then shade. Tabby markings are drawn with `filter: blur(2px)` as soft stripes "printed under the plastic".

## Scene
- Wall: radial gradient `#7dbcb9 → #64a6a6 → #3f8285`, light source at the window's position; the window's shadow `blur(10px)` offset to the lower right.
- Outside the window: pink-purple gradient sky (`#a24cc4 → #df62ae → #f5a08a → #f8c070`), two mountain layers, with a 28×26 pink wireframe grid laid over the mountain bodies (early CG wireframe terrain), snow caps as jagged triangles.
- **Ground**: per-pixel perspective checkerboard, vanishing point (960,480), `X=(x-960)/dy, Z=1/dy`, cell TX=0.27, TZ=0.00029, 2×2 supersampled antialiasing, 35% fog within 140px of the wall. Cached; cold start for the whole scene 53ms.
- **Reflections**: the object layer (chair/table/girl/cat) is drawn to an offscreen layer, mirrored with `translate(0, 2*906); scale(1,-1)`, drawn into the floor clip region at `globalAlpha .34`; props mirror about their own ground lines (cone 780, purple ring 846, chrome ball 800), and **must be drawn to a separate layer first and then made semi-transparent as a whole** — otherwise the purple ring's 140 small balls each composite at .34 and turn opaque.
- Glass table: translucent green ellipse + thick edge + white stroke, with a diagonal reflection sliding 260px per second.

## Small loops (must be visible within 0.23s)
- Purple ring: 140 balls arranged along a torus, spinning about the vertical axis at 7 rad/s, tilted 0.35, drawn depth-sorted (first a dark purple base layer so the balls read as a tube, then per-ball radial highlights). In 0.23s it turns 1.6 rad, from front-facing to side-on — very obvious.
- Chrome ball: per-pixel environment mapping every frame (reflection vector downward → checkerboard, upward → pink-purple sky + one window light), checkerboard u coordinate translating with `t*4.5` = spinning; Fresnel edge brightening. 104px diameter, <2ms per frame.
- Lens flare (`lighter`): sun-core glow 170px pulsing ±8% at 23 rad/s; 12 star streaks rotating at 1.6 rad/s; horizontal streak light 960px; 5 ghosts (circles + hexagons) arranged along the "sun→frame center" line, sliding with `sin(t*5)*0.03`.
- Cat-eye green glow: `lighter` radial gradient radius 46px, pulsing ±25% at 18 rad/s.
- Cup hold (choreo.cup), tail swish, blinking and steam as usual.

## Pitfalls
- The transition wireframe computes and caches its edges from the frame where the new image first appears (`once('edges')`), so the frame at lt≈0 must be complete — do not leave a blank or fade-in at lt=0.
- Performance: hot frame 23ms, cold start 53ms.
