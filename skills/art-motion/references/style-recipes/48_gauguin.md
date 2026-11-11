# 48_gauguin · Gauguin: flat planes, contours, and symbolic colour

Status: research recipe; the demo was redone on 2026-10-16 under the doc 16 protocol (see "v2 implementation" at the end); neither the self-rating nor the independent review reached 80, so it is not registered as implemented.

## Before you start

Read [Cross-scene style distillation](../15-cross-scene-style-distillation.md) first, then this card. The works are there to compare visual language; figures, objects, composition, and camera are not copied directly. The stable features below are research generalizations, and the implementation and transfer plans are hypotheses pending validation; do not pass them off as official parameters or as measured capability.

## Scope

Focuses on Synthetism and the language of flat symbolic colour; Brittany, Tahiti, and different media are not treated as one fixed set of subjects.

## Transferable visual language

- Colour: large colour fields carry emotion and structure, without mechanically copying natural colour; colour needs a thematic basis.
- Modelling: simplified forms and firmer contours support each other, while a new subject stays recognizable.
- Space: depth can be compressed, the ground viewpoint raised, or the scene organized by stacking relationships, but not everything is flat.
- Surface: large colour planes keep subtle internal variation and must not degrade into uniform black-outlined vector fills.

## What changes with the brief

Tropical plants, brown skin, specific clothing, or "exotic" ornament are not mandatory; cultural subject matter comes from the user's brief and is not a shortcut to the style.

## Difference from neighbouring styles

Distinguished from ordinary flat illustration: the colour planes carry emotional and symbolic relationships; distinguished from Chagall: it need not invert, float, or shatter spatial logic.

## Starting point for production (pending validation)

Place the psychological centre of gravity of the new scene with a few large colour planes first, then refine contours, layering, and material. Action can be fast or slow, colour fields stay consistent with their objects, and random whole-frame colour changes are forbidden.

Action speed, frame rate, camera, and score are set by this narrative; a quiet mood in the image does not mean slow motion. Engineering integration follows the [style author spec](../08-style-author-spec.md); register an engine id only after a new renderer is implemented.

## Cross-scene validation prompts (not fixed templates)

- A modern convenience store on the night shift.
- A set of repair tools with no figures.
- A handover during an office argument: recognizable without tropical subject matter.

Choose tests that differ in subject, spatial scale, and subject type at minimum; there is no need to run the full set every time. Record still-frame and motion acceptance separately, and keep marking uncovered areas as pending validation.

## References and evidence boundaries

- [Met: Gauguin feature on cross-media work and Symbolism](https://www.metmuseum.org/essays/paul-gauguin-1848-1903)
- [*The Siesta*: figures and flat space](https://www.metmuseum.org/art/collection/search/436449)
- [Gauguin exhibition of the New York collection: differences between painting, sculpture, and print](https://www.metmuseum.org/exhibitions/listings/2002/gauguin)

Primary museum/production material is used to check works and methods; encyclopedia entries only help with orientation. Before starting you still have to actually see several original works or clips from different scenes side by side and record stable features and exceptions; a list of works does not mean a multi-image visual experiment has been completed.

## Feedback after use

Check the latest validated conclusions in this section before use; right now there is a technical check of a 6-second single-scene output; style fidelity and cross-scene visual validation are not complete. Afterwards record only findings that affect results: date, subject, route taken, reference and output paths/hashes, problems, fixes, validation status, and scope. Revise a dead conclusion in place rather than appending a contradictory rule. Upgrade a research hypothesis to an implemented recipe only after cross-scene reproduction; for repeatable engineering problems, fix the tool and test it first. User preferences go into the separate taste profile and do not expand the authorization.


### 2026-10-15 · Single-scene trial feedback

- Scene: a dye yard at dusk; event: wind fills the fabrics and the symbolic colour planes support each other; route: code drawing and animation.
- Checks: deterministic re-run, full MP4 decode, and independent frame-extraction review; fast-motion metrics on a short clip are marked yellow under the current gate and cannot be extrapolated to long-form acceptance.
- Boundaries: this only proves the piece runs and can be watched; similarity to the artist/studio style is still limited, and geometry, palette, or texture parameters cannot be treated as the final standard.

## v2 implementation (2026-10-16, self-rated ~65, taste item pending Huashu (花叔, the author))

- Route: `scenes/48_gauguin.js`. Every shape goes through `MEDIUM.flat` (short dashes along the stroke direction inside the colour block + deep ultramarine contour, width 5–8 px); a vermilion field, a yellow-ochre slope, and a purple-brown diagonal trunk split the image, three white-hatted women in the foreground are cropped by the frame, and a boy leading a goat is shrunk into the distance (the shrinking is so the naive modelling is not enlarged).
- Measured: qa determinism ✓, no popping, 8 ms/frame.
- Key lesson: polyline figures read as emoji, so always use smooth closed curves (`smooth()` inside the scene); hat brims must be drawn behind the face, and the face must not be covered.
- Still improvable: the boy and goat still look naive; the trunk is too straight; lacking Gauguin's large areas of purple-brown shadow and symbolic small animals.
