# 38_giotto · Giotto: volume and narrative relationships

Status: research recipe; the demo was redone on 2026-10-16 under the doc 16 protocol (see "v2 implementation" at the end); neither self-review nor independent review reached 80, so it is not registered as implemented.

## Before you start

Read [Cross-scene style distillation](../15-cross-scene-style-distillation.md) first, then this card. Works are used to compare visual language; figures, objects, composition, and camera are not copied directly. The stable features below are research generalizations; implementation and transfer plans are hypotheses to be verified; do not falsely present them as official parameters or tested capabilities.

## Scope

Focus on the narrative fresco language of Giotto's mature period; panel paintings are used to check figure volume; do not call every work a fresco.

## Transferable visual language

- Form: bodies are simple, weighty volumes; drapery explains force and volume; faces and hands can convey relationships.
- Space: figures can stand and touch; architecture and rock masses organize events, without pursuing later photographic perspective.
- Color and light: relatively complete local color fields and graded modeling; light and shade serve volume; background and subject belong to the same world.
- Material: for the fresco direction, use matte surfaces, fine grain, and soft color layers; gold-ground panel painting is another medium — do not layer gold over the whole image.

## What changes with the brief

Saints and mourning poses are not required; golden halos, ultramarine skies, and decorative borders are the shared signature of the three Scrovegni originals, and the v2 demo kept them (the halo went to the porter — a joke and also recognizability); cracks and fading are conservation state, not the core of the style.

## Difference from neighboring styles

Different from Piero: prioritize the readability of gestures and figure relationships; do not let geometric order become the protagonist. Different from Raphael: keep the more austere, heavy volumes.

## Production starting point (to be verified)

First draw the new scene as readable silhouettes and volumes, layer by contact relationships, then add matte color fields and drapery; do not substitute surface craquelure for modeling. Characters follow the doc 10 route, and material treatment must cover the characters.

Action speed, frame rate, camera, and score are determined by this narrative; do not equate the image's quiet mood with slow motion. Project integration follows the [style author spec](../08-style-author-spec.md); register an engine id only after a new renderer is actually implemented.

## Cross-scene verification prompts (not a fixed template)

- Two people handing over a large box at a courier station: check gesture and weight.
- A disassembled machine in a repair room: there should still be a sense of volume without classical figures.
- A night-shift waiting room: after changing lighting and the number of figures, check whether space and color fields remain unified.

Choose at least tests with different subjects/spatial scales/subject types; you do not need to run the full set every time. Record still-frame and motion acceptance separately; keep uncovered areas marked as to be verified.

## References and evidence boundaries

- [Giotto, *Adoration of the Magi*: volume and upward-looking architecture](https://www.metmuseum.org/art/collection/search/436504)
- [Giotto, *Ognissanti Madonna*: panel-painting medium comparison](https://www.uffizi.it/en/artworks/virgin-and-child-enthroned-surrounded-by-angels-and-saints-ognissanti-maesta)
- [*Lamentation*: narrative fresco comparison](https://en.wikipedia.org/wiki/Lamentation_(The_Mourning_of_Christ))

Primary museum/production materials are used to check works and methods; encyclopedia entries only help locate them. Before starting, still look at multiple originals or clips from different scenes and record stable features and exceptions; a list of works does not mean a multi-image visual experiment has been completed.

## Feedback loop after use

Check the latest verified conclusions in this section before use; there is currently a technical check for a 6-second single-scene output; style fidelity and cross-scene visual verification are incomplete. Subsequently record only findings that affect results: date, subject, route used, reference and output paths/hashes, problem, fix, verification status, and scope. Rewrite failed conclusions in place; do not append contradictory rules. Promote a research hypothesis to an implemented recipe only after cross-scene reproduction; for repeatable engineering problems, fix the tool first and test. User preferences go separately into the taste profile and do not expand authorization.


### 2026-10-15 · Single-scene trial feedback

- Scene: watermill courtyard; event: the waterwheel catches water and turns, and the clay jars and courtyard show heavy volume; route: code drawing and animation.
- Check: deterministic re-test, full MP4 decode, and independent frame-sampling review; the short film's fast-motion metric was downgraded to yellow under the existing gate, and this cannot be used to infer that a long film passes.
- Boundary: this only proves the project runs and is watchable; artist/studio style similarity remains limited, and geometry, palette, or texture parameters cannot be treated as the final standard.

## v2 implementation (2026-10-16, self-review ~65, taste items pending Huashu)

- Original anchoring: Scrovegni Chapel *Lamentation*, *Meeting at the Golden Gate*, *Flight into Egypt* (`fetch_reference.py`). Stable signatures: ultramarine sky with golden stars, earth-red/ochre/olive-green robes, weighty bell-shaped drapery, figures' gazes interlocking, oblique gray-pink architectural masses, a red-gold decorative band inside the frame.
- Route: `scenes/38_giotto.js`. Form layer = sky (ultramarine soft mottling) → rocky slope → architecture (crenellations + red-and-white lozenge band under the eaves + archway) → ground → three `MEDIUM.figure` figures (robes, half-cloaks, thick sleeves, large heads, almond eyes + gaze) → wooden box; medium layer = `MEDIUM.fresco` (light blur + lime wash + stucco multiply + pinhole seams) + decorative border.
- Subject: two porters hand over a wooden box at a dock warehouse door, while a third looks down at the box corner; motion = the box's handover arc, slight hem sway, landing dust, a bird crossing the sky.
- Measured: qa determinism ✓, no jumps, 36 ms/frame; still-frame comparison 27% (frescoes are inherently still; motion is concentrated in the handover).
- Still improvable: faces and hands remain simple; missing halos, angels, and crowd density; drapery light-and-shade layering falls short of the original's multi-layer glazing; grass clumps are too uniform.
