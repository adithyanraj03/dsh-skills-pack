# 43_lorenzetti · Ambrogio Lorenzetti: readable social space

Status: research recipe + single-scene project trial; established and implemented on 2026-10-15. `scenes/43_lorenzetti.js` is included; run it with `render.py --film style_studies --solo 43_lorenzetti --from 0 --to 6`; it has not yet passed style fidelity or cross-scene verification, so it cannot be upgraded to a mature style on that basis.

## Before you start

Read [Cross-scene style distillation](../15-cross-scene-style-distillation.md) first, then this card. Works are used to compare visual language; figures, objects, composition, and camera are not copied directly. The stable features below are research generalizations; implementation and transfer plans are hypotheses to be verified; do not falsely present them as official parameters or tested capabilities.

## Scope

Focus on urban narrative, cross-checked against his other spatial works; do not paint every subject as a Sienese civic fresco.

## Transferable visual language

- Space: architecture, roads, doorways, and places connect multiple everyday activities; a local viewpoint can serve readability.
- Form: figures are small but their actions and occupations are clear; buildings have volume, not flat icons.
- Color and light: earth colors, mineral colors, and detailed light and shade stay globally unified; avoid an old-paper filter that darkens all information.
- Narrative: multiple events can coexist, but with hierarchy, paths, and clear causal links.

## What changes with the brief

Long horizontal scrolls, city walls, medieval clothing, or dense crowds are not required; complexity comes from the content at hand.

## Difference from neighboring styles

Different from Persian miniature: space emphasizes the continuity of town fabric and everyday activity; do not build density with all-over geometric patterns.

## Production starting point (to be verified)

Build the world canvas from this site's connectivity, arrange visible paths for figure activity, then draw in layers. Gaze guidance can use local action and camera; do not make a row of unrelated small cards.

Action speed, frame rate, camera, and score are determined by this narrative; do not equate the image's quiet mood with slow motion. Project integration follows the [style author spec](../08-style-author-spec.md); register an engine id only after a new renderer is actually implemented.

## Cross-scene verification prompts (not a fixed template)

- Modern logistics park: unloading, sorting, and delivery are interconnected.
- Single-room clinic: small space still has readable collaboration.
- Unmanned greenhouse pipe network: when there are no figures, use the actual facilities to connect the narrative.

Choose at least tests with different subjects/spatial scales/subject types; you do not need to run the full set every time. Record still-frame and motion acceptance separately; keep uncovered areas marked as to be verified.

## References and evidence boundaries

- [Italian Ministry of Culture: the city and countryside of Good Government](https://catalogo.cultura.gov.it/approfondimento/l-allegoria-del-buon-governo-ambrogio-lorenzetti/il-buon-governo-citta-e-campagna)
- [Uffizi, *Presentation in the Temple*: a different spatial subject](https://www.uffizi.it/opere/presentazione-al-tempio)
- [Complete fresco cycle: comparison of different narrative moods](https://en.wikipedia.org/wiki/The_Allegory_of_Good_and_Bad_Government)

Primary museum/production materials are used to check works and methods; encyclopedia entries only help locate them. Before starting, still look at multiple originals or clips from different scenes and record stable features and exceptions; a list of works does not mean a multi-image visual experiment has been completed.

## Feedback loop after use

Check the latest verified conclusions in this section before use; there is currently a technical check for a 6-second single-scene output; style fidelity and cross-scene visual verification are incomplete. Subsequently record only findings that affect results: date, subject, route used, reference and output paths/hashes, problem, fix, verification status, and scope. Rewrite failed conclusions in place; do not append contradictory rules. Promote a research hypothesis to an implemented recipe only after cross-scene reproduction; for repeatable engineering problems, fix the tool first and test. User preferences go separately into the taste profile and do not expand authorization.


### 2026-10-15 · Single-scene trial feedback

- Scene: cutaway library; event: a red book slides down, lands in a book cart, and departs with the cart; route: code drawing and animation.
- Check: deterministic re-test, full MP4 decode, and independent frame-sampling review; the short film's fast-motion metric was downgraded to yellow under the existing gate, and this cannot be used to infer that a long film passes.
- Boundary: this only proves the project runs and is watchable; artist/studio style similarity remains limited, and geometry, palette, or texture parameters cannot be treated as the final standard.
- Practical fix: removed the book's modulo reset; the book cart stops first to receive the book, and the book is parented to the cart frame before it drives away; re-check no longer shows it flying back to the entrance.

## v2 implementation (2026-10-16, self-review ~72, not registered as implemented)

- Characters redone (user feedback: "the characters still need crazy optimization"): small head, long body, narrow shoulders with an outward-splayed long robe, fold lines, light on the left and dark on the right, front foot emerging below the hem, 3/4 view; 20 people walk in a loop on the street, larger near and smaller far.

- Original anchoring: *Effects of Good Government in the City*, *Allegory of Good Government* (only two different works). Signatures: buildings stacked one on another occupy the upper half, rows of small arched windows in pink/gray/ochre walls, crenellated towers, ground-floor arcades cut open to reveal workshops, a band of small figures on the street each doing their own thing, dark brown border band.
- Route: `scenes/43_lorenzetti.js`. Form layer (sky → low midground buildings → left and right main buildings → cut-open cobbler workshop → street → steps) → `MEDIUM.fresco`; small figures drawn after each frame (circle dance, pack mule, scaffold hoisting stone, cobbler, flag).
- Second round fixed: blank stucco showing in the middle, people with outstretched arms looking cartoonish, the mule overlapping the circle dance.
- Still improvable: street foot traffic needs to multiply several times; walls need a paint layer; small figures need more natural proportions and drapery; add a street receding in perspective.
