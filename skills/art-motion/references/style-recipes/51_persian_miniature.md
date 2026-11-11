# 51_persian_miniature · Persian miniature: layered space and precise narrative

Status: research recipe; the demo was redone on 2026-10-16 under the doc 16 protocol (see "v2 implementation" at the end); neither the self-rating nor the independent review reached 80, so it is not registered as implemented.

## Before you start

Read [Cross-scene style distillation](../15-cross-scene-style-distillation.md) first, then this card. The works are there to compare visual language; figures, objects, composition, and camera are not copied directly. The stable features below are research generalizations, and the implementation and transfer plans are hypotheses pending validation; do not pass them off as official parameters or as measured capability.

## Scope

Not a single artist or a single period. The initial focus is late Timurid Herat and early Safavid Tabriz book painting; choose one scope before production and do not mix all Persian/Mughal painting together.

## Transferable visual language

- Space: raise the viewpoint, unfold the buildings, and layer the scenery so several events can be read at once; do not force single-point perspective onto it.
- Modelling: fine lines, clear gestures, and precise small objects tell the story together; figures are not pattern filler.
- Colour: mineral-rich saturated colour fields and fine patterns restrain each other; gold is used on the appropriate material layer.
- Composition: text areas, borders, and the image can echo one another, and the organizing logic can be kept in a new scene that has no text.

## What changes with the brief

Gardens, palaces, carpets, Persian script, borders, or mounted figures are not mandatory; do not patch together patterns from different regions and pass them off as historical accuracy.

## Difference from neighbouring styles

Distinguished from the fine observational studies of the Mughal natural-observation card, and from Lorenzetti's continuous space of solid urban fabric; do not lump the three together as "exquisite Oriental painting".

## Starting point for production (pending validation)

Rebuild a multi-level place and action routes for the new subject, keeping subject layering separate from pattern layering; patterns follow the surface and must not drift when it moves. Script needs actual content and reliable letterforms; otherwise do not fake calligraphy.

Action speed, frame rate, camera, and score are set by this narrative; a quiet mood in the image does not mean slow motion. Engineering integration follows the [style author spec](../08-style-author-spec.md); register an engine id only after a new renderer is implemented.

## Cross-scene validation prompts (not fixed templates)

- The flow of books through a multi-level city library.
- A complete collaborative process in a modern food factory.
- Layered servicing of a single machine: validating transfer without a garden or a palace.

Choose tests that differ in subject, spatial scale, and subject type at minimum; there is no need to run the full set every time. Record still-frame and motion acceptance separately, and keep marking uncovered areas as pending validation.

## References and evidence boundaries

- [Met: study of the Shah Tahmasp *Shahnama*](https://www.metmuseum.org/essays/the-shahnama-of-shah-tahmasp)
- [Met: collection note on the *Shahnama* across periods](https://www.metmuseum.org/art/collection/search/446551)
- [Met court-art teaching material: comparing different page paintings](https://www.metmuseum.org/learn/educators/curriculum-resources/~/media/Files/Learn/For%20Educators/Publications%20for%20Educators/Islamic%20Teacher%20Resource/Unit5.pdf)

Primary museum/production material is used to check works and methods; encyclopedia entries only help with orientation. Before starting you still have to actually see several original works or clips from different scenes side by side and record stable features and exceptions; a list of works does not mean a multi-image visual experiment has been completed.

## Feedback after use

Check the latest validated conclusions in this section before use; right now there is a technical check of a 6-second single-scene output; style fidelity and cross-scene visual validation are not complete. Afterwards record only findings that affect results: date, subject, route taken, reference and output paths/hashes, problems, fixes, validation status, and scope. Revise a dead conclusion in place rather than appending a contradictory rule. Upgrade a research hypothesis to an implemented recipe only after cross-scene reproduction; for repeatable engineering problems, fix the tool and test it first. User preferences go into the separate taste profile and do not expand the authorization.


### 2026-10-15 · Single-scene trial feedback

- Scene: a waterworks courtyard; event: a water wheel and water flow inside layered space; route: code drawing and animation.
- Checks: deterministic re-run, full MP4 decode, and independent frame-extraction review; fast-motion metrics on a short clip are marked yellow under the current gate and cannot be extrapolated to long-form acceptance.
- Boundaries: this only proves the piece runs and can be watched; similarity to the artist/studio style is still limited, and geometry, palette, or texture parameters cannot be treated as the final standard.

## v2 implementation (2026-10-16, self-rated ~80, taste item pending Huashu (花叔, the author))

- Anchored to originals: the Herat *Yusuf and Zulaykha*, the garden bathing-women page, and a page from the Shah Tahmasp *Shahnama*. Signature: the ground stands up like a hanging carpet (flat overhead view), buildings cut open to reveal inner rooms, geometric tile covering everything, gold edging + lapis-lazuli blue borders, text blocks entering the image, small figures turned in profile with large turbans.
- Route: `scenes/51_persian_miniature.js`, flat fills with dark-brown contours throughout; star tiles tiled by periodic modulo; octagonal pool, zigzag water channel (gold edge + celadon), canopy leaves as dots; motion = water-lifting wheel turning, gold ripples flowing along the zigzag channel, goldfish circling the pool, petals drifting, a gardener rocking a pole, a reader breathing.
- Measured: qa determinism ✓, no popping, 3 ms/frame.
- Still improvable: the figures are too small and too simple; the text blocks are fake joined-up script; the ground lacks layering.
