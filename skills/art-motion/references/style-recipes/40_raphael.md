# 40_raphael · Raphael: harmonious organization and natural connection

Status: research recipe + single-scene project trial; established and implemented on 2026-10-15. `scenes/40_raphael.js` is included; run it with `render.py --film style_studies --solo 40_raphael --from 0 --to 6`; it has not yet passed style fidelity or cross-scene verification, so it cannot be upgraded to a mature style on that basis.

## Before you start

Read [Cross-scene style distillation](../15-cross-scene-style-distillation.md) first, then this card. Works are used to compare visual language; figures, objects, composition, and camera are not copied directly. The stable features below are research generalizations; implementation and transfer plans are hypotheses to be verified; do not falsely present them as official parameters or tested capabilities.

## Scope

Focus on the forms, figure relationships, and clear space of the mature period; do not force the early Perugino influence and the later stronger drama into one averaged style.

## Transferable visual language

- Form: continuous contours, rounded modeling of bodies and drapery; figures are idealized but have clear actions.
- Space: primary and secondary groups, gazes, and gestures connect to one another; triangular organization is an optional method, not a fixed layout.
- Color and light: layered red-blue and neutral relationships, readable skin tones, and soft volume; re-establish the dominant colors for each new scene.
- Detail: visual information has priority; architecture, props, and figures together support the main event.

## What changes with the brief

Do not require *The School of Athens*'s archway, two central figures, Madonna and Child, or period costume; do not arrange every shot as a central triangle.

## Difference from neighboring styles

Different from Piero's sense of measure: here organic connection matters more; different from Michelangelo: do not intensify every body into a tense sculpture.

## Production starting point (to be verified)

First draw a relationship map of people and objects, then choose the composition for this action; unify character and environment in color blocks, light direction, and soft/hard edges. Even without the original painting's subject matter, it should still look clear, rounded, and organized.

Action speed, frame rate, camera, and score are determined by this narrative; do not equate the image's quiet mood with slow motion. Project integration follows the [style author spec](../08-style-author-spec.md); register an engine id only after a new renderer is actually implemented.

## Cross-scene verification prompts (not a fixed template)

- Community repair class: several people each doing one related thing.
- Product workbench: even an empty shot must have hierarchy and formal connections.
- Two-person collaboration in a narrow kitchen: test a non-monumental architectural scene.

Choose at least tests with different subjects/spatial scales/subject types; you do not need to run the full set every time. Record still-frame and motion acceptance separately; keep uncovered areas marked as to be verified.

## References and evidence boundaries

- [National Gallery Raphael collection: different periods and subjects](https://www.nationalgallery.org.uk/artists/raphael)
- [*The Madonna of the Pinks*: intimate gesture](https://www.nationalgallery.org.uk/paintings/raphael-the-madonna-of-the-pinks-la-madonna-dei-garofani)
- [*The School of Athens*: group comparison](https://en.wikipedia.org/wiki/The_School_of_Athens)

Primary museum/production materials are used to check works and methods; encyclopedia entries only help locate them. Before starting, still look at multiple originals or clips from different scenes and record stable features and exceptions; a list of works does not mean a multi-image visual experiment has been completed.

## Feedback loop after use

Check the latest verified conclusions in this section before use; there is currently a technical check for a 6-second single-scene output; style fidelity and cross-scene visual verification are incomplete. Subsequently record only findings that affect results: date, subject, route used, reference and output paths/hashes, problem, fix, verification status, and scope. Rewrite failed conclusions in place; do not append contradictory rules. Promote a research hypothesis to an implemented recipe only after cross-scene reproduction; for repeatable engineering problems, fix the tool first and test. User preferences go separately into the taste profile and do not expand authorization.


### 2026-10-15 · Single-scene trial feedback

- Scene: gardening workbench; event: watering can pouring and red-blue fabric organization; route: code drawing and animation.
- Check: deterministic re-test, full MP4 decode, and independent frame-sampling review; the short film's fast-motion metric was downgraded to yellow under the existing gate, and this cannot be used to infer that a long film passes.
- Boundary: this only proves the project runs and is watchable; artist/studio style similarity remains limited, and geometry, palette, or texture parameters cannot be treated as the final standard.

## v2 implementation (2026-10-16, self-review ~70, not registered as implemented)

- Original anchoring: *The School of Athens*, *Disputation of the Holy Sacrament*, *Parnassus*. Signatures: semicircular lunette + gold-brown/red/ultramarine decorative bands, central-perspective barrel vault with coffers, a patch of sky at the far end, checkerboard floor, niche statues, saturated robe colors in conversing groups.
- Route: `scenes/40_raphael.js`. The vault recedes toward the vanishing point in a geometric series with N=9 levels; each level is divided into coffer cells by angle; side walls alternate pilasters/niches; the floor is drawn as a checkerboard by level and column; figures use `MEDIUM.figure` and point at one another by hand and eye (book, astrolabe, scroll); three small figures walk along the ground in the distance.
- Still improvable: figures' bell-shaped robes and similar faces; niche statues look like candles; missing sheen on skin and fabric.
