# 41_michelangelo · Michelangelo: sculptural form and tension of pose

Status: research recipe + single-scene project trial; established and implemented on 2026-10-15. `scenes/41_michelangelo.js` is included; run it with `render.py --film style_studies --solo 41_michelangelo --from 0 --to 6`; it has not yet passed style fidelity or cross-scene verification, so it cannot be upgraded to a mature style on that basis.

## Before you start

Read [Cross-scene style distillation](../15-cross-scene-style-distillation.md) first, then this card. Works are used to compare visual language; figures, objects, composition, and camera are not copied directly. The stable features below are research generalizations; implementation and transfer plans are hypotheses to be verified; do not falsely present them as official parameters or tested capabilities.

## Scope

Center on the sculptural modeling shared by painting and drawing; the Sistine ceiling is one reference — do not conflate the materials of sculpture, fresco, and late works.

## Transferable visual language

- Form: skeleton, force, torsion, and compression shape volume; power comes from pose, not from adding muscle to every character.
- Contour: overlaps and foreshortening are clear; the subject reads as a solid occupying real space.
- Color and light: use light and shade to build large volumes; ceiling paintings can inform clear color blocks, while drawing studies inform structure and are not directly a combined palette.
- Space: strong subjects and negative shapes pull against each other; this can work from an ordinary viewpoint — a ceiling's upward angle is not mandatory.

## What changes with the brief

Do not default to nudity, classical gods, the touching fingertip, or fixed muscle proportions; modern clothing and non-human subjects must work equally well.

## Difference from neighboring styles

Different from Cortona: the focus is the force of volume and pose, not exuberant groups, ceiling illusion, and decorative density.

## Production starting point (to be verified)

First verify the force-bearing silhouette and foreshortening, then handle volume, clothing, and light. Design performance from the action's cause; code handles layering and transforms — do not pass off a few ellipses as an anatomically designed body.

Action speed, frame rate, camera, and score are determined by this narrative; do not equate the image's quiet mood with slow motion. Project integration follows the [style author spec](../08-style-author-spec.md); register an engine id only after a new renderer is actually implemented.

## Cross-scene verification prompts (not a fixed template)

- Rescue workers pulling open a deformed door: force is visible even through uniforms.
- A folding robotic arm extending and retracting: check non-human volumes.
- A person quietly tying a shoelace: small actions can also carry structural tension.

Choose at least tests with different subjects/spatial scales/subject types; you do not need to run the full set every time. Record still-frame and motion acceptance separately; keep uncovered areas marked as to be verified.

## References and evidence boundaries

- [The Met's Michelangelo galleries: drawings, sculpture, and design](https://www.metmuseum.org/exhibitions/listings/2017/michelangelo/exhibition-galleries)
- [Official Sistine ceiling materials](https://www.museivaticani.va/content/museivaticani/en/collezioni/musei/cappella-sistina/volta.html)

Primary museum/production materials are used to check works and methods; encyclopedia entries only help locate them. Before starting, still look at multiple originals or clips from different scenes and record stable features and exceptions; a list of works does not mean a multi-image visual experiment has been completed.

## Feedback loop after use

Check the latest verified conclusions in this section before use; there is currently a technical check for a 6-second single-scene output; style fidelity and cross-scene visual verification are incomplete. Subsequently record only findings that affect results: date, subject, route used, reference and output paths/hashes, problem, fix, verification status, and scope. Rewrite failed conclusions in place; do not append contradictory rules. Promote a research hypothesis to an implemented recipe only after cross-scene reproduction; for repeatable engineering problems, fix the tool first and test. User preferences go separately into the taste profile and do not expand authorization.


### 2026-10-15 · Single-scene trial feedback

- Scene: stone jib crane; event: mechanical joints turning with sculptural force; route: code drawing and animation.
- Check: deterministic re-test, full MP4 decode, and independent frame-sampling review; the short film's fast-motion metric was downgraded to yellow under the existing gate, and this cannot be used to infer that a long film passes.
- Boundary: this only proves the project runs and is watchable; artist/studio style similarity remains limited, and geometry, palette, or texture parameters cannot be treated as the final standard.

## v2 implementation (2026-10-16, self-review ~65, not registered as implemented)

- Original anchoring: *Atlas Slave* (the unfinished statue trapped in rough stone), *Study for the Libyan Sibyl* (red chalk, back view), *The Creation of Adam*. The old version was a robotic arm plus a ball, unrelated to Michelangelo's spirit, and has been discarded.
- Route: `scenes/41_michelangelo.js`. Grayscale form map (ellipse light-dark layers build the shoulder blades, spinal groove, and latissimus dorsi; light from upper left) → generate deterministic hatching from light-dark + gradient (mostly 50° diagonals, cross-hatching in shadows) → use overall silhouette boundary pixels to thicken and break the chalk-grain contour on the backlit side → cache; at runtime reveal from top to bottom by y, with the chalk sweeping along. On the right is the same figure flipped and reduced as an old study; the paper has torn edges, mold spots, fibers, and a few lines of illegible notes.
- Key point: seams between parts must not be outlined (use the overall silhouette, otherwise it looks like "doll assembly"); the lower end fading out represents "unfinished".
- Still improvable: head too round, upper arm too short, no real torso torsion; the contrast of fully exposed paper in the highlights could be stronger.
