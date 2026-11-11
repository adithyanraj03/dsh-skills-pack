# 44_cortona · Pietro da Cortona: Baroque volume and flowing groups

Status: research recipe + single-scene engineering trial; established and implemented on 2026-10-15. Ships with `scenes/44_cortona.js`, run with `render.py --film style_studies --solo 44_cortona --from 0 --to 6`; it has not yet passed style fidelity or cross-scene validation, so it cannot be upgraded to a mature style on that basis.

## Before you start

Read [Cross-scene style distillation](../15-cross-scene-style-distillation.md) first, then this card. The works are there to compare visual language; figures, objects, composition, and camera are not copied directly. The stable features below are research generalizations, and the implementation and transfer plans are hypotheses pending validation; do not pass them off as official parameters or as measured capability.

## Scope

Focuses on group organization, colour and light, and space in grand decorative and narrative painting; ceiling effects are an application branch.

## Transferable visual language

- Form: full-bodied figures, drapery, and environmental masses form groups that push and pull against one another.
- Space: diagonal links, front-to-back interleaving, and local frame-breaking create continuity; the composition is regenerated for the new event.
- Colour and light: rich warms and cools support each other, and light against dark splits dense content into readable layers.
- Material: architecture, painting, and ornament can connect, but each keeps its own boundary and physical touch.

## What changes with the brief

Angels, cloud banks, emblems, gilded edges, low angles, or spirals filling the frame are not mandatory; an everyday scene must still have a clear event first.

## Difference from neighbouring styles

Distinguished from Michelangelo's single-figure tension; distinguished from Pozzo's route built mainly on architectural perspective illusion.

## Starting point for production (pending validation)

Draw three layers of large groups and their light relationships first, controlling density with occlusion and colour and light; then add detail. If doing frame-breaking and ceilings, test the viewing point, and do not let ornament cover the action.

Action speed, frame rate, camera, and score are set by this narrative; a quiet mood in the image does not mean slow motion. Engineering integration follows the [style author spec](../08-style-author-spec.md); register an engine id only after a new renderer is implemented.

## Cross-scene validation prompts (not fixed templates)

- A large theatre changing sets backstage all at once: use real activity to form the groups.
- A repair shop hoisting equipment: primary and secondary mass, and diagonal relationships.
- A two-person dining table: after scaling down, there is still abundant but restrained organization.

Choose tests that differ in subject, spatial scale, and subject type at minimum; there is no need to run the full set every time. Record still-frame and motion acceptance separately, and keep marking uncovered areas as pending validation.

## References and evidence boundaries

- [Uffizi: the Stove Room frescoes of the Four Ages at Palazzo Pitti, cross-checked against the ceiling works](https://www.uffizi.it/en/artworks/stove-room)
- [Museum With No Frontiers: Barberini ceiling collection entry](https://baroqueart.museumwnf.org/database_item.php?id=monument%3BBAR%3Bit%3BMon11%3B18%3Bit&pageT=N)
- [Painter and works catalogue: keep comparing non-ceiling works](https://en.wikipedia.org/wiki/Pietro_da_Cortona)

Primary museum/production material is used to check works and methods; encyclopedia entries only help with orientation. Before starting you still have to actually see several original works or clips from different scenes side by side and record stable features and exceptions; a list of works does not mean a multi-image visual experiment has been completed.

## Feedback after use

Check the latest validated conclusions in this section before use; right now there is a technical check of a 6-second single-scene output; style fidelity and cross-scene visual validation are not complete. Afterwards record only findings that affect results: date, subject, route taken, reference and output paths/hashes, problems, fixes, validation status, and scope. Revise a dead conclusion in place rather than appending a contradictory rule. Upgrade a research hypothesis to an implemented recipe only after cross-scene reproduction; for repeatable engineering problems, fix the tool and test it first. User preferences go into the separate taste profile and do not expand the authorization.


### 2026-10-15 · Single-scene trial feedback

- Scene: a theatre changeover; event: suspended props and layered curtains moving; route: code drawing and animation.
- Checks: deterministic re-run, full MP4 decode, and independent frame-extraction review; fast-motion metrics on a short clip are marked yellow under the current gate and cannot be extrapolated to long-form acceptance.
- Boundaries: this only proves the piece runs and can be watched; similarity to the artist/studio style is still limited, and geometry, palette, or texture parameters cannot be treated as the final standard.

## v2 implementation (2026-10-16, self-rated ~70, not registered as implemented)

- Anchored to originals: the Barberini ceiling *Allegory of Divine Providence* and *The Rape of the Sabine Women* (only two distinct works; a third was deduplicated and dropped because it is the same painting as the first). Signature: stucco frames with gilded medallions, warm gold radial light at the centre, cloud banks building volume, crowds rotating around the centre, ribbons and figures spilling past the frame.
- Route: `scenes/44_cortona.js`. Three stucco bands + egg-and-dart + gilded medallions at the four corners → an opening sky gradient with radial light → cloud banks (one bumpy silhouette overall, lit along the direction toward the centre, outer arcs outlining the masses) → crowds (`M.figure` rotating around the centre) + red and blue ribbons unfurling along the ellipse normal → a white-robed figure at the centre with breathing gold light → `MEDIUM.fresco`.
- Lesson: stacking clouds as individual spherical radial gradients reads as soap bubbles; clouds must first become one bumpy whole, then be lit along the light direction. Ribbon width has to be expanded along the path normal; a fixed angle turns them into hairs.
- Still improvable: figures are still bell-shaped robes; lacking strong foreshortening and strong chiaroscuro; the highlight arcs are too cartoonish.
