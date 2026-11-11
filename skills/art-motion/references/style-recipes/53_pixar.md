# 53_pixar · Pixar: a style family of form, material, and performance

Status: research recipe + single-scene project trial; established and implemented on 2026-10-15. `scenes/53_pixar.js` is included; run it with `render.py --film style_studies --solo 53_pixar --from 0 --to 6`; it has not yet passed style fidelity or cross-scene verification, so it cannot be upgraded to a mature style on that basis.

## Before you start

Read [Cross-scene style distillation](../15-cross-scene-style-distillation.md) first, then this card. Works are used to compare visual language; figures, objects, composition, and camera are not copied directly. The stable features below are research generalizations; implementation and transfer plans are hypotheses to be verified; do not falsely present them as official parameters or tested capabilities.

## Scope

Pixar is not a single style. First choose one film-level art range for the brief; *Luca*'s graphic, painterly feel and *Soul*'s real-world New York and abstract soul world, among others, cannot be merged without explanation.

## Transferable visual language

- Form: design a recognizable silhouette and scale relationships first, then surface detail; big eyes, round faces, and glossy plastic are not universal definitions.
- Material: materials carry story and personality; cloth, skin, and metal must be distinct; reflections do not override the art direction.
- Light and color: light guides the narrative focus and may stylize physical rules; it is not a fixed golden rim light or blue-purple background.
- Performance: pose, center of gravity, eyeline, and anticipation/follow-through are coherent; emotion comes from cause and effect in the action, not from randomly swapping expression textures.

## What changes with the brief

Do not give every object a face by default or apply the same cute face to everything; do not copy existing characters or require Pixar software.

## Difference from neighboring styles

Different from the uniform plastic and reflective spheres of early ray-traced CGI; this card designs form, different materials, and performance together. Boundaries between different films must also be clarified.

## Production starting point (to be verified)

Scenes with faceless objects may use 3D modeling and physics/keyframes; characters and anthropomorphic characters currently follow doc 10's frame lib/compositing route. Full 3D character modeling and rigging is still a capability to be built; it must not bypass the entry character rules or claim that it is supported; a branch can be called valid only after visual validation. A pure-code requirement must not be faked with a simple ball-and-cylinder person or a single AI background; first expose the gaps in modeling, rigging, and lighting capability.

Action speed, frame rate, camera, and score are determined by this narrative; do not equate the image's quiet mood with slow motion. Project integration follows the [style author spec](../08-style-author-spec.md); register an engine id only after a new renderer is actually implemented.

## Cross-scene verification prompts (not a fixed template)

- An original adult repairer diagnoses a machine fault.
- An unbalanced washing machine in an empty laundromat: there is an event without adding a face.
- A newly designed animal character carries objects on a slippery floor: check volume, contact, and material.

Choose at least tests with different subjects/spatial scales/subject types; you do not need to run the full set every time. Record still-frame and motion acceptance separately; keep uncovered areas marked as to be verified.

## References and evidence boundaries

- [Pixar RenderMan: stylization runs through form, material, light, and effects](https://prod.renderman.pixar.com/stories/stylization-at-pixar)
- [Pixar *Luca*: film-level art range](https://www.pixar.com/luca)
- [Pixar *Soul*: real-world environment branch](https://www.pixar.com/soul)
- [Pixar RenderMan: cinematography, materials, and light in *Soul*](https://renderman.pixar.com/stories/cinematography-with-soul)

Primary museum/production materials are used to check works and methods; encyclopedia entries only help locate them. Before starting, still look at multiple originals or clips from different scenes and record stable features and exceptions; a list of works does not mean a multi-image visual experiment has been completed.

## Feedback loop after use

Check the latest verified conclusions in this section before use; there is currently a technical check for a 6-second single-scene output; style fidelity and cross-scene visual verification are incomplete. Subsequently record only findings that affect results: date, subject, route used, reference and output paths/hashes, problem, fix, verification status, and scope. Rewrite failed conclusions in place; do not append contradictory rules. Promote a research hypothesis to an implemented recipe only after cross-scene reproduction; for repeatable engineering problems, fix the tool first and test. User preferences go separately into the taste profile and do not expand authorization.


### 2026-10-15 · Single-scene trial feedback

- Scene: faceless washing machine; event: the drum jams, the body shakes, and laundry falls out after the door opens; route: procedural 3D.
- Check: deterministic re-test, full MP4 decode, and independent frame-sampling review; the short film's fast-motion metric was downgraded to yellow under the existing gate, and this cannot be used to infer that a long film passes.
- Boundary: this only proves the project runs and is watchable; artist/studio style similarity remains limited, and geometry, palette, or texture parameters cannot be treated as the final standard.
- Concrete fix: the door opens before the laundry is released, and the cloth endpoints are constrained to the floor-tile height; independent review cleared the original timing and ground-contact issues. This is an analytic mesh, not a physics cloth simulation.
