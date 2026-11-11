# 49_chagall · Chagall: memory space and emotional colour

Status: research recipe + single-scene engineering trial; established and implemented on 2026-10-15. Ships with `scenes/49_chagall.js`, run with `render.py --film style_studies --solo 49_chagall --from 0 --to 6`; it has not yet passed style fidelity or cross-scene validation, so it cannot be upgraded to a mature style on that basis.

## Before you start

Read [Cross-scene style distillation](../15-cross-scene-style-distillation.md) first, then this card. The works are there to compare visual language; figures, objects, composition, and camera are not copied directly. The stable features below are research generalizations, and the implementation and transfer plans are hypotheses pending validation; do not pass them off as official parameters or as measured capability.

## Scope

Focuses on poetic space in the paintings; early village works, later religious paintings, and the stage/glass media are compared separately, without flattening their differences.

## Transferable visual language

- Space: direction, scale, and adjacency may obey emotion, but the viewer must still be able to read the main action.
- Colour: colour fields and local forms express emotion together; it need not be one fixed set of highly saturated blues and reds.
- Modelling: figures, animals, and objects keep a recognizable character, with exaggeration and distortion that connect to something.
- Narrative: realistic detail and memory images can coexist; the images come from the new story, not from a ready-made symbol list.

## What changes with the brief

Floating lovers, fiddlers, goats, or Russian villages are not mandatory; the spatial and colour relationships can be studied without any flight.

## Difference from neighbouring styles

Distinguished from Gauguin's large planes and contours; distinguished from Dalí's realistic illusion — simply liquefying realistic objects does not make it Chagall.

## Starting point for production (pending validation)

Clarify the real-world relationship and the emotional relationship for this piece first, then decide where to change scale or direction; every distortion keeps character identity and object contact continuous. Action rhythm is decided by the narrative.

Action speed, frame rate, camera, and score are set by this narrative; a quiet mood in the image does not mean slow motion. Engineering integration follows the [style author spec](../08-style-author-spec.md); register an engine id only after a new renderer is implemented.

## Cross-scene validation prompts (not fixed templates)

- Two remote colleagues collaborating across time zones.
- Moving boxes and memories in an empty room.
- A hurried farewell at a railway station: avoid automatically adding flying lovers.

Choose tests that differ in subject, spatial scale, and subject type at minimum; there is no need to run the full set every time. Record still-frame and motion acceptance separately, and keep marking uncovered areas as pending validation.

## References and evidence boundaries

- [MoMA, *I and the Village*](https://www.moma.org/collection/works/78984)
- [MoMA, *Birthday*](https://www.moma.org/collection/works/79360/)
- [Musée national Marc Chagall, France: the boundary of the religious-themed collection](https://www.culture.gouv.fr/rechercher-une-publication-du-ministere-de-la-culture/repertoire-des-informations-publiques/Musees-des-Beaux-arts/musee-national-marc-chagall)

Primary museum/production material is used to check works and methods; encyclopedia entries only help with orientation. Before starting you still have to actually see several original works or clips from different scenes side by side and record stable features and exceptions; a list of works does not mean a multi-image visual experiment has been completed.

## Feedback after use

Check the latest validated conclusions in this section before use; right now there is a technical check of a 6-second single-scene output; style fidelity and cross-scene visual validation are not complete. Afterwards record only findings that affect results: date, subject, route taken, reference and output paths/hashes, problems, fixes, validation status, and scope. Revise a dead conclusion in place rather than appending a contradictory rule. Upgrade a research hypothesis to an implemented recipe only after cross-scene reproduction; for repeatable engineering problems, fix the tool and test it first. User preferences go into the separate taste profile and do not expand the authorization.


### 2026-10-15 · Single-scene trial feedback

- Scene: the memory of moving house; event: an old box opens and flowers and letters fly into an inverted space; route: code drawing and animation.
- Checks: deterministic re-run, full MP4 decode, and independent frame-extraction review; fast-motion metrics on a short clip are marked yellow under the current gate and cannot be extrapolated to long-form acceptance.
- Boundaries: this only proves the piece runs and can be watched; similarity to the artist/studio style is still limited, and geometry, palette, or texture parameters cannot be treated as the final standard.
