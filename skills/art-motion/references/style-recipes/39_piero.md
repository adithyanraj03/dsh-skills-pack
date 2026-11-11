# 39_piero · Piero: geometric order and clear volume

Status: research recipe + single-scene project trial; established and implemented on 2026-10-15. `scenes/39_piero.js` is included; run it with `render.py --film style_studies --solo 39_piero --from 0 --to 6`; it has not yet passed style fidelity or cross-scene verification, so it cannot be upgraded to a mature style on that basis.

## Before you start

Read [Cross-scene style distillation](../15-cross-scene-style-distillation.md) first, then this card. Works are used to compare visual language; figures, objects, composition, and camera are not copied directly. The stable features below are research generalizations; implementation and transfer plans are hypotheses to be verified; do not falsely present them as official parameters or tested capabilities.

## Scope

Focus on Piero della Francesca's proportions, volume, and light relationships; preserve the material distinction between egg tempera and oil painting.

## Transferable visual language

- Form: large shapes are established first; head-to-body ratio, drapery, and new props all have concise, complete volume.
- Space: proportion, interval, perspective, and negative shape constrain one another; being ordered does not mean forced central symmetry.
- Color and light: clear, even light and restrained warm-cool contrasts; saturation varies with work and medium — do not fix a cream filter.
- Edges: major form boundaries are clear; detail obeys overall measure; avoid aimless broken brushwork.

## What changes with the brief

Colonnades, biblical figures, and static poses are not required; "quiet" must not force actions to slow down.

## Difference from neighboring styles

Different from Raphael's soft groupings and gaze connections: here look first at form intervals, geometric proportion, and even light.

## Production starting point (to be verified)

First block in the new scene's proportions and negative shapes with low-detail volumes; after checking perspective, model and color. Even when figures move quickly, forms must not fall apart and occlusion must stay readable; pure code starts from geometry and lighting, while characters still follow the character rules.

Action speed, frame rate, camera, and score are determined by this narrative; do not equate the image's quiet mood with slow motion. Project integration follows the [style author spec](../08-style-author-spec.md); register an engine id only after a new renderer is actually implemented.

## Cross-scene verification prompts (not a fixed template)

- One person chasing a train in a subway station: fast action does not mean breaking proportional order.
- Different-shaped appliances on a dining table: check volume relationships without relying on classical subject matter for recognition.
- Maintenance activity in a space greenhouse: do not reuse the original colonnade; check light and space.

Choose at least tests with different subjects/spatial scales/subject types; you do not need to run the full set every time. Record still-frame and motion acceptance separately; keep uncovered areas marked as to be verified.

## References and evidence boundaries

- [*The Baptism of Christ*: egg tempera and geometric relationships](https://www.nationalgallery.org.uk/paintings/piero-della-francesca-the-baptism-of-christ)
- [*The Nativity*: oil color and narrative](https://www.nationalgallery.org.uk/paintings/piero-della-francesca-the-nativity)
- [*The Flagellation of Christ*: foreground-background spatial comparison](https://en.wikipedia.org/wiki/The_Flagellation_of_Christ_(Piero_della_Francesca))

Primary museum/production materials are used to check works and methods; encyclopedia entries only help locate them. Before starting, still look at multiple originals or clips from different scenes and record stable features and exceptions; a list of works does not mean a multi-image visual experiment has been completed.

## Feedback loop after use

Check the latest verified conclusions in this section before use; there is currently a technical check for a 6-second single-scene output; style fidelity and cross-scene visual verification are incomplete. Subsequently record only findings that affect results: date, subject, route used, reference and output paths/hashes, problem, fix, verification status, and scope. Rewrite failed conclusions in place; do not append contradictory rules. Promote a research hypothesis to an implemented recipe only after cross-scene reproduction; for repeatable engineering problems, fix the tool first and test. User preferences go separately into the taste profile and do not expand authorization.


### 2026-10-15 · Single-scene trial feedback

- Scene: astronomy workshop; event: instrument rings rotate with geometric order; route: code drawing and animation.
- Check: deterministic re-test, full MP4 decode, and independent frame-sampling review; the short film's fast-motion metric was downgraded to yellow under the existing gate, and this cannot be used to infer that a long film passes.
- Boundary: this only proves the project runs and is watchable; artist/studio style similarity remains limited, and geometry, palette, or texture parameters cannot be treated as the final standard.
