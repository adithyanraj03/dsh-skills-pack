# 04 · Pure code drawing: paint an artful picture with Canvas and bring it to life

This page takes pure-code drawing as its mainline: scenes and objects are realised through programs and style renderers; people, anthropomorphic characters and robots are not drawn into the final film with code — see doc 10 for the generated-frame approach, and `character-fidelity.md` for the delivery line. This page summarises the method after finishing 16 styles for the first time; the specific parameters for each style are in `style-recipes/<id>.md`.

## 1. Project skeleton (`scripts/engine/`, copy it once and you can start a new film)

```
index.html      load order: lib/fonts → lib/util → lib/paint → lib/rig → eras → transitions → scenes/index → engine
eras.js         segment table: id, how many eighth notes it occupies (eighths), transition {type,dur,delay,cx,cy}, year-plaque style
scenes/<id>.js  one file per segment: SCENES['<id>'] = { draw(c, lt, t) }   ← most of the work lives here
transitions.js  transition library: (c, A old, B new, p, o) → draw one frame
engine.js       beat grid → t0/t1 per segment; during a transition the old and new segments each draw into offscreen, then go to the transition; camera impact on the beat; year counter (value determined only by global t)
lib/paint.js    noise, textures, hand-drawn boil lines, style renderers, region palettes swatch, shared choreography choreo, heat haze, particles
lib/rig.js      character skeleton: RIG.girl / RIG.cat → per-part Path2D + anchors; drawGirl/drawCat (mode: fill/line); ik2, smooth, taper
render.py       headless Chromium calls renderFrame(t) per frame → PNG pipe → ffmpeg 60fps, can mux the audio track; --solo <id> previews one segment, --stills outputs stills
compare.py      original | reproduction, side by side at the same instant
```

Render speed: a full 15-second 60fps film takes about 90 seconds (M-series Mac). Most segments run 5–40ms per frame; the heaviest, Van Gogh, 110ms.

## 2. How to draw one style (five layers, benchmark `scenes/09_postimp.js`)

> The five layers are the default order for oil-painting/printmaking styles, not universal: **ink wash** runs in reverse (paper is the base, ink only adds on top, large areas left empty, don't fill first); **pattern styles** (Kusama, Bauhaus) are "flat fill with pattern scattered on top", where the pattern itself is the renderer; **chiaroscuro** is "paint the lit version first, then multiply by a light map".

1. **Flat underdrawing**: large areas (wall, floor, sky, outside the window) painted first in flat colour/gradient with the right position and value. This layer decides the composition; the style isn't there yet.
2. **The style renderer repaints it**: use the underdrawing as a colour source and repaint the whole frame in that style's brushwork — Van Gogh flow-field long strokes, Impressionist short dabs, mosaic stones, ukiyo-e misregistered colour plates + patterns, Cubist facets, Pop halftone dots, 8-bit low-resolution per-pixel, ray-traced per-pixel reflection… the renderer decides "whose painting this is".
3. **Small objects on their own layer**: if small things like tables, chairs, vases and picture frames go through the renderer together with the large areas, they get smashed into a mush. Draw them separately with finer parameters, `source-atop` so they are only drawn on themselves.
4. **Characters**: speedrun/time-travel films use the same skeleton (RIG) and the same choreography with a different way of painting (other subjects design characters for the subject) — flat fill, then that style's fine texture on top, then clear outlines and facial features added last. Characters are where the viewer's gaze lands; it must be readable who they are.
5. **Highlights that move**: the small loops of era motifs (see doc 02). Continuous motion uses continuous time; hand-drawn lines switch seed at 8–12fps to "boil", which gives the handmade feel.

## 3. Style renderer quick reference (all in `lib/paint.js` or written inside each scene)

| Renderer | Suits | Key |
|---|---|---|
| `strokes` flow-field strokes | Van Gogh, Expressionism, oil painting | write the direction field per region (wall vertical, floor along the perspective, starry sky along the vortex); **region palettes** matter more than colour jitter; each stroke needs a dark outline to feel thick |
| `dabs` colour dabs | Impressionism | short ellipses with warm-cool offset; **not pointillism** (no pure palette, dabs of unequal size — what comes out is Impressionism) |
| optical-mixing pointillism (29_seurat) | Seurat, Neo-Impressionism | pure palette juxtaposed in proportion, equal-sized dots, complementary-colour dots, light bleed at the value boundary |
| mosaic (04_roman, hand-written) | mosaic, stained glass | layout computed once, colour flows through the stones every frame; stones laid along contours (distance-field isolines); stones 8–28% larger than half the spacing so the bisectors cut the grout |
| colour plates + patterns (07_ukiyoe) | ukiyo-e, woodcut, screen print | fill offset from the ink line by (3,2)px; patterns as CanvasPattern; horizontal brush streaks for shading |
| `facets` | Cubism, low-poly | semi-transparent gradient planes stacked into space; don't clip the triangles, so outlines become straight edges |
| `halftone` dots | Pop, old print | small tiles via `createPattern` are 10× faster than drawing dot by dot; 45° grid |
| low-resolution per-pixel (14_8bit) | pixel art, retro games | draw at 240×135, then nearest-neighbour upscale; 14-colour palette; 1px black outline per part |
| per-pixel shading (15_raytrace) | early CGI, plastic, metal | unified plastic shading (base colour + radial dark edge + environment reflection + hard specular); ground reflection mirrored |
| gold leaf (05_gothic) | illumination, icons, ornament | per-pixel burnish texture + embossed dark line offset 1px from the bright line; highlights land only on the "goldness" mask |
| sfumato (06_renaissance) | classical oil painting | light blur over the whole layer + a semi-transparent sharp layer; craquelure + canvas weave + vignette + yellow varnish |
| variable-width paths (10_nouveau) | Art Nouveau, calligraphic line, printmaking | offset both sides of the point list by width into polygons; a dark misregistered silhouette underneath = thick outside, thin inside |
| grainy stipple (16_2026) | contemporary flat illustration | scatter dots inside shapes, density as a function of position; everything static goes into a cache |
| brush dry-brush + ink bleed (17_ink) | ink wash, calligraphy, Eastern freehand | brush entry and exit, sample at equal arc length for dry brush; `filter='blur()'` to bleed (deterministic under Chromium); paper is the base, ink only adds on top |
| long curved streamer strokes + per-row warp (19_munch) | Expressionism, sense of flow | 20–30-step long strokes following the flow field; displace the whole frame by row with a sine (margin ≥ max displacement to avoid exposed seams) |
| watercolour wash (25_ghibli) | Ghibli backgrounds, watercolour | transparent glaze layers + water-mark edges; the water-mark stroke fades in α as it expands |
| grayscale photo halftone (22_constructivism) | Constructivism, old newspaper, photo collage | dot radius from luminance, 45° grid, batch into one path and fill once |
| two-version light/dark clipping + sheared long shadows (24_hopper, 23_dali) | Hopper, surrealism, strong-light scenes | paint the lit and dark versions separately, clip by light patches; shadows by sheared affine |
| VHS channel-separation post (26_vaporwave) | vaporwave, retro video | RGB misregistration, scanlines, tracking-noise bands, as a post overlay |
| whole-frame multiply by light map (32_rembrandt) | chiaroscuro, night, candlelight | paint the lit version first, then multiply by a light map (window light + candlelight radial) |
| cel hard shadow bands (35_shinkai) | Japanese animation, Makoto Shinkai | part minus its translated self = hard shadow band; bright edge on the lit side |
| stepped frame rate `stepTime(t,fps)` (33_rubberhose, 34_shadowpuppet) | old animation, shadow puppetry, stop motion | 12fps/10fps stepping is half the style, not stutter |

## 4. Characters: one skeleton, a dozen ways to draw it

- Don't invent skeleton coordinates: put a 20px grid over an AI design still (or any reference image), read the key points part by part, and smooth into Path2D with Catmull-Rom (`RIG.smooth`). The first hand-written version of the girl looked like a boy; after measuring points she read as a 17-year-old blonde in a single round.
- Sitting hides the legs inside a long skirt most naturally; holding the cup uses two-bone IK (upper arm 165 / forearm 122), with the elbow fixed pointing down.
- Anchors `G.A` (top of head, forehead, neck, chest, waist, knee, hand…) give each style its costume: Egyptian broad collar, Gothic halo, ukiyo-e shimada hairstyle, Bauhaus joint discs, Pop big waves.
- Each style may stylise the skeleton (Egyptian profile with a frontal eye, black-figure silhouette, Cubist half-blue face, pixelation), but stance and action rhythm must match the skeleton — that is the source of "the same two characters travelling through time".
- Big ending performance moves (jumping, lying down, extending claws, gasping) don't have to be crammed into the generic skeleton: 16_2026 builds its own pose library (a set of local key points per pose, interpolated numerically), with squash and stretch pivoting on the soles and the flip at the flattest frame.

## 5. Making the picture "alive": action list and how to measure it

- Per segment at minimum: one continuous action for the protagonist (choreo.cup, raising the cup) + 2–4 motif small loops. Short segments (<0.5s) need the rhythm stepped fast, 15–30fps.
- Self-check the amount of motion: render two frames (**avoiding the camera impact in the 0.35s after a transition**, otherwise the whole screen counts as moving) and take the frame difference. First-pass numbers (0.45↔0.9s after the scale-in ends): cave 2.8%, Egypt 3.4%, Rome 6.4%, Greece 9.9%; the original's heatmap for the same segments: 6.9%, 6.2%, 17.3%, 11.6%. Too static → add motif action.
- Whatever moves must sit at the focus of attention (in the speedrun demo that's the person, the cat, the window; for a new subject, set the focus by your composition).

## 6. Pitfalls hit

- **Composite modes**: `source-in` on each pattern in turn clears the others (Klimt's gold robe vanished entirely) — draw the pattern out on a scratch first, then `source-in` once by the silhouette; doing `destination-out` on a segment canvas digs a transparent hole, which goes black in video — dig it offscreen first, then paste; for laying paper texture/grain over characters you can't use `source-atop` (the paper colour covers them and the figure goes pale) — cut the texture layer by the silhouette with `destination-in`, then overlay it with `multiply`.
- Self-drawn glyphs: two counter-wound strokes in the same path cancel into a hole under the nonzero rule — fill each part separately.
- "Melting" transitions: let the new picture flow down as round-headed droplets (profile `(1-u²)^0.3`); dragging the old painting down gives spikes, not droplets.
- Set transition duration by "the visible part": with inOut easing the two ends barely change, so a complex signature transition at 0.34s only reads for 0.2s and gets read as an ordinary wipe — give it 0.48–0.5s.
- Translucent layered pieces like shadow puppetry/paper cut-outs go dark where they overlap from multiplication; tune the layering order and opacity to the material.

- `putImageData` straight to the target canvas bypasses the engine's camera-impact scale and transition clipping — write into offscreen first, then `drawImage`.
- Use `{willReadFrequently:true}` for offscreen contexts you read pixels from; call `g.reset()` every frame, or last frame's lineJoin/state lingers and frame one differs from everything after.
- Stacking `drawGirl(mode:'line')` on top draws hidden parts' outlines through (the far sleeve through the torso, the back half of the hat brim through the hair). Use `RIG.visibleLines(key, (g, lineColor) => draw it fully, real line colour, box)`: draw the same thing twice with the line colour switched to white as a sentinel, and the pixels that differ between the two passes are the lines not covered (facial-feature lines included). Work in the order "fill → style texture → visibleLines to add lines".
- **Camera impact must hit both the old and the new layer**: with only the new layer impacted, the new layer hasn't appeared yet at the start of the transition, so the frame on the beat doesn't move and it sounds as if "the sound arrives before the picture" (v1 review measured a lag of 0.1–0.17s).
- **Reseeding full-screen brushwork at 8fps = flicker, not life**: review measured whole-screen jump frame-diffs of 18–20, larger than a transition. Keep brush positions fixed and let the direction field change continuously with time (swaying like a flame); leave boiling to line art only.
- Don't give moving areas their own parameters (stone size, stroke density) — when it stops it's just a patch.
- In coarse-grain styles like mosaic/pixel, lettering must use bold monospaced strokes (each stroke ≥2 grains wide); thin typefaces break up.
- Make small things bigger than you think: ukiyo-e wave claws at 22–50px don't read; 44–74px is what makes "The Great Wave off Kanagawa".
- Determinism: seed every random; the same t rendered twice must be pixel-identical, or it flickers during the render.

## 7. Division of work (multiple agents drawing in parallel)

Write `era-author-spec.md` first (interface, available libraries, benchmark, hard requirements, reference files, self-check commands, delivery notes), then dispatch agents in groups of 4 eras. State plainly in the spec: "don't modify lib/ or other people's files". Each group hands back in 30–35 minutes and its notes settle straight into `style-recipes/`. All 16 segments passed first time, mainly thanks to the spec + benchmark implementation.
