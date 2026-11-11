# 46_pissarro · Pissarro: the flow of life and figures within an environment

Status: research recipe; the demo was redone on 2026-10-16 under the doc 16 protocol (see "v2 implementation" at the end); neither the self-rating nor the independent review reached 80, so it is not registered as implemented.

## Before you start

Read [Cross-scene style distillation](../15-cross-scene-style-distillation.md) first, then this card. The works are there to compare visual language; figures, objects, composition, and camera are not copied directly. The stable features below are research generalizations, and the implementation and transfer plans are hypotheses pending validation; do not pass them off as official parameters or as measured capability.

## Scope

Prioritizes his Impressionist urban and rural language; the Neo-Impressionist pointillist phase is labelled separately and not mixed with loose brushwork in the same shot.

## Transferable visual language

- Brushwork: small directional colour touches build roads, buildings, vegetation, and figures; they are not just random noise.
- Colour and light: weather and time of day govern local colour; ambient reflections remain even in light and shade.
- Space: anything from a higher viewpoint down to ground level works, with pedestrians and activity embedded in a credible environment.
- Modelling: figures are usually participants in an event of daily life, with position, scale, and action, rather than scattered decorative dots.

## What changes with the brief

Parisian boulevards, bird's-eye views, carriages, peasants, or rain are not mandatory; each scene sets its own viewpoint again.

## Difference from neighbouring styles

Distinguished from Renoir's soft modelling of figures, and from Sisley's landscapes governed by the large sky/ground relationship; this card focuses on the activity of life happening within the environment.

## Starting point for production (pending validation)

Let brushwork on street/interior surfaces vary with direction and depth, and keep stable seeds and region masks for figure motion; crowding comes from the story, and empty frames are not covered up by adding people.

Action speed, frame rate, camera, and score are set by this narrative; a quiet mood in the image does not mean slow motion. Engineering integration follows the [style author spec](../08-style-author-spec.md); register an engine id only after a new renderer is implemented.

## Cross-scene validation prompts (not fixed templates)

- Several people packing bags in a shared office area.
- Automated sorting in a winter warehouse: equipment activity replaces pedestrians.
- A temporary country clinic opening: changes the street subject and the viewpoint.

Choose tests that differ in subject, spatial scale, and subject type at minimum; there is no need to run the full set every time. Record still-frame and motion acceptance separately, and keep marking uncovered areas as pending validation.

## References and evidence boundaries

- [*The Boulevard Montmartre at Night*: the city and serial observation](https://www.nationalgallery.org.uk/paintings/camille-pissarro-the-boulevard-montmartre-at-night)
- [*The Avenue, Sydenham*: a different urban space](https://www.nationalgallery.org.uk/paintings/camille-pissarro-the-avenue-sydenham)
- [*The Pork Butcher*: a close-range subject of labour](https://www.nationalgallery.org.uk/paintings/camille-pissarro-the-pork-butcher)

Primary museum/production material is used to check works and methods; encyclopedia entries only help with orientation. Before starting you still have to actually see several original works or clips from different scenes side by side and record stable features and exceptions; a list of works does not mean a multi-image visual experiment has been completed.

## Feedback after use

Check the latest validated conclusions in this section before use; right now there is a technical check of a 6-second single-scene output; style fidelity and cross-scene visual validation are not complete. Afterwards record only findings that affect results: date, subject, route taken, reference and output paths/hashes, problems, fixes, validation status, and scope. Revise a dead conclusion in place rather than appending a contradictory rule. Upgrade a research hypothesis to an implemented recipe only after cross-scene reproduction; for repeatable engineering problems, fix the tool and test it first. User preferences go into the separate taste profile and do not expand the authorization.


### 2026-10-15 · Single-scene trial feedback

- Scene: an autumn orchard; event: a figure seen from behind pushing a cart, entering the colour touches of the environment; route: code drawing and animation.
- Checks: deterministic re-run, full MP4 decode, and independent frame-extraction review; fast-motion metrics on a short clip are marked yellow under the current gate and cannot be extrapolated to long-form acceptance.
- Boundaries: this only proves the piece runs and can be watched; similarity to the artist/studio style is still limited, and geometry, palette, or texture parameters cannot be treated as the final standard.

## v2 implementation (2026-10-16, self-rated ~75, taste item pending Huashu (花叔, the author))

- Route: `scenes/46_pissarro.js`. Shape layer (sky / distant church and hills / patchwork fields / path / six trees) → `MEDIUM.broken` (horizontal long strokes for the sky, ground following the terrain direction, multi-directional short strokes for canopies, complementary jitter of warm-light and cool-dark) → cache; motion = drifting clouds, floating leaf strokes on the top canopy layer, pedestrians (small canvas → broken → pasted back) walking closer along the path.
- Subject: a country path on market day, two farm women carrying baskets and one person pushing a cart; the path draws the eye into depth; tree shadows cross the path and the fields.
- Measured: qa determinism ✓, no popping, 18 ms/frame.
- Still improvable: the figures' faces are white blobs; the church is covered by a near tree; canopies read as "fur balls" with no branches showing through; the distinction from Sisley (47) rests mainly on shorter, multi-directional strokes and orange-pink flickers inside the greens, and still needs side-by-side validation.
