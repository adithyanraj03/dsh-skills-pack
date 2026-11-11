# 47_sisley · Sisley: air, weather, and coherent landscape

Status: research recipe; the demo was redone on 2026-10-16 under the doc 16 protocol (see "v2 implementation" at the end); neither the self-rating nor the independent review reached 80, so it is not registered as implemented.

## Before you start

Read [Cross-scene style distillation](../15-cross-scene-style-distillation.md) first, then this card. The works are there to compare visual language; figures, objects, composition, and camera are not copied directly. The stable features below are research generalizations, and the implementation and transfer plans are hypotheses pending validation; do not pass them off as official parameters or as measured capability.

## Scope

His landscape language is the main known basis; interiors, close-up characters, and science fiction are transfer experiments, and the artist is not claimed to have mature examples of these.

## Transferable visual language

- Colour and light: sky and weather affect ground, buildings, and water; not every image is sunny blue-green.
- Brushwork: lighter, broken colour touches follow the surface direction, simplified in the distance and still legible up close.
- Space: atmospheric layers are continuous, and structures such as the horizon and roads guide the viewing; it is not just a water backdrop.
- Modelling: small figures and buildings keep landscape scale; large character close-ups need separate validation.

## What changes with the brief

Rivers, bridges, clear weather, or the French countryside are not mandatory; snow, flood, or overcast days can serve as variation controls.

## Difference from neighbouring styles

Distinguished from the close-range colour-light field of Monet's water lilies; it also does not default to Pissarro-style dense activity or to Guardi's looser urban silhouettes.

## Starting point for production (pending validation)

Unify ambient light and depth first, then handle the brushwork of sky, hard surfaces, and organic matter separately. When a new figure is enlarged, redo the structure and the local brush density; do not simply scale up a small dot figure.

Action speed, frame rate, camera, and score are set by this narrative; a quiet mood in the image does not mean slow motion. Engineering integration follows the [style author spec](../08-style-author-spec.md); register an engine id only after a new renderer is implemented.

## Cross-scene validation prompts (not fixed templates)

- A winter industrial park with no river.
- Boarding a bus at a suburban stop after rain.
- Indoor greenhouse maintenance: a transfer stress test beyond the original landscape scope.

Choose tests that differ in subject, spatial scale, and subject type at minimum; there is no need to run the full set every time. Record still-frame and motion acceptance separately, and keep marking uncovered areas as pending validation.

## References and evidence boundaries

- [National Gallery: Sisley collection and biography](https://www.nationalgallery.org.uk/artists/alfred-sisley)
- [*The Watering Place at Marly-le-Roi* and the snow series](https://www.nationalgallery.org.uk/paintings/alfred-sisley-the-watering-place-at-marly-le-roi)
- [National Galleries of Scotland: snow-scene comparison](https://www.nationalgalleries.org/art-and-artists/artists/alfred-sisley)

Primary museum/production material is used to check works and methods; encyclopedia entries only help with orientation. Before starting you still have to actually see several original works or clips from different scenes side by side and record stable features and exceptions; a list of works does not mean a multi-image visual experiment has been completed.

## Feedback after use

Check the latest validated conclusions in this section before use; right now there is a technical check of a 6-second single-scene output; style fidelity and cross-scene visual validation are not complete. Afterwards record only findings that affect results: date, subject, route taken, reference and output paths/hashes, problems, fixes, validation status, and scope. Revise a dead conclusion in place rather than appending a contradictory rule. Upgrade a research hypothesis to an implemented recipe only after cross-scene reproduction; for repeatable engineering problems, fix the tool and test it first. User preferences go into the separate taste profile and do not expand the authorization.


### 2026-10-15 · Single-scene trial feedback

- Scene: a train in snowy fields; event: the train passes through coherent snow and sky; route: code drawing and animation.
- Checks: deterministic re-run, full MP4 decode, and independent frame-extraction review; fast-motion metrics on a short clip are marked yellow under the current gate and cannot be extrapolated to long-form acceptance.
- Boundaries: this only proves the piece runs and can be watched; similarity to the artist/studio style is still limited, and geometry, palette, or texture parameters cannot be treated as the final standard.

## v2 implementation (2026-10-16, self-rated ~80, taste item pending Huashu (花叔, the author))

- Route: `scenes/47_sisley.js`. Three layers, each redrawn and cached: sky (cumulus at width 2600: warm-white body + pale violet-grey shadow side + warm yellow lit side, `MEDIUM.broken` horizontal long strokes), water (sky reflection + mirrored, darkened reflections of houses/trees/poles, horizontal long strokes), and the scene above the water (half-submerged inn, poplars, utility poles, far bank). Motion = slow cloud drift, row-by-row water displacement growing with proximity, a ferry (small canvas → broken → pasted back), wake ripples behind the boat.
- Subject: a village landing after the flood, a ferryman poling a boat loaded with wooden crates.
- Measured: qa determinism ✓, no popping, 14 ms/frame.
- Fixed: `broken` now dilates 14 px before blurring, and the target width of the row-by-row water displacement was widened, removing a row of notched dots along the left edge.
- Still improvable: the roof reads as a flat slab; the boat's reflection is too dark; the figures are only silhouettes.
