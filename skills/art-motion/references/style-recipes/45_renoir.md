# 45_renoir · Renoir: warm and cool interwoven, figures with warmth

Status: research recipe; the demo was redone on 2026-10-16 under the doc 16 protocol (see "v2 implementation" at the end), self-rated ~58, not independently reviewed, not registered as implemented.

## Before you start

Read [Cross-scene style distillation](../15-cross-scene-style-distillation.md) first, then this card. The works are there to compare visual language; figures, objects, composition, and camera are not copied directly. The stable features below are research generalizations, and the implementation and transfer plans are hypotheses pending validation; do not pass them off as official parameters or as measured capability.

## Scope

Prioritizes the Impressionist language of the 1870s to the early 1880s; the more linear turn of the 1880s and the different modelling of the late period must be noted separately, without claiming one unified whole career.

## Transferable visual language

- Brushwork: soft and hard edges convert into each other, colour touches stay visible but do not shatter faces and hands.
- Colour and light: warm skin tones and cool reflections act on each other, shadows keep their colour, and no uniform orange is laid over the whole painting.
- Modelling: rounded, tactile bodies and fabrics; intimacy comes from the relationships between figures, not from a uniform smiling face.
- Space: subject and environment share light and colour while the near/far difference stays clear; interior and exterior are reconfigured to the actual lighting.

## What changes with the brief

Luncheons, straw hats, dappled tree shade, French gardens, pink skin, or a particular group of people are not mandatory; night scenes can also be studied for transfer.

## Difference from neighbouring styles

Compared with Pissarro it puts more weight on figures, skin tone, and soft modelling; compared with Sisley, landscape atmosphere is not the only organizing centre.

## Starting point for production (pending validation)

Build structure with reliable character material first, then work finer skin/hand brushwork and looser environment brushwork by region; unify the light but keep material differences. Use light patches only where the light source and occlusion justify them.

Action speed, frame rate, camera, and score are set by this narrative; a quiet mood in the image does not mean slow motion. Engineering integration follows the [style author spec](../08-style-author-spec.md); register an engine id only after a new renderer is implemented.

## Cross-scene validation prompts (not fixed templates)

- Colleagues of different skin tones tidying equipment in an office.
- An empty breakfast table: recognized by colour and tactility rather than by pretty figures.
- A hurried handover in a small shop at night: avoid warm light meaning slow motion.

Choose tests that differ in subject, spatial scale, and subject type at minimum; there is no need to run the full set every time. Record still-frame and motion acceptance separately, and keep marking uncovered areas as pending validation.

## References and evidence boundaries

- [Phillips Collection, *Luncheon of the Boating Party*](https://www.phillipscollection.org/collection/luncheon-boating-party)
- [Art Institute of Chicago, study of *Two Sisters*](https://publications.artic.edu/api/epub/paintingsanddrawings/135639/print_view)
- [Art Institute of Chicago, *Acrobats at the Cirque Fernando*](https://publications.artic.edu/api/epub/paintingsanddrawings/135637/print_view)

Primary museum/production material is used to check works and methods; encyclopedia entries only help with orientation. Before starting you still have to actually see several original works or clips from different scenes side by side and record stable features and exceptions; a list of works does not mean a multi-image visual experiment has been completed.

## Feedback after use

Check the latest validated conclusions in this section before use; right now there is a technical check of a 6-second single-scene output; style fidelity and cross-scene visual validation are not complete. Afterwards record only findings that affect results: date, subject, route taken, reference and output paths/hashes, problems, fixes, validation status, and scope. Revise a dead conclusion in place rather than appending a contradictory rule. Upgrade a research hypothesis to an implemented recipe only after cross-scene reproduction; for repeatable engineering problems, fix the tool and test it first. User preferences go into the separate taste profile and do not expand the authorization.


### 2026-10-15 · Single-scene trial feedback

- Scene: space-capsule repair; event: arms and local pipe deformation on a generated base plate, with the leak subsiding; route: generated base plate + code-driven local deformation.
- Checks: deterministic re-run, full MP4 decode, and independent frame-extraction review; fast-motion metrics on a short clip are marked yellow under the current gate and cannot be extrapolated to long-form acceptance.
- Boundaries: this only proves the piece runs and can be watched; similarity to the artist/studio style is still limited, and geometry, palette, or texture parameters cannot be treated as the final standard.
- Explicit shortfall: local mesh displacement is not a complete grasp / hand-off / valve-turn performance; complex character interaction needs pose frames or hierarchical rigging, and a good-looking base plate must not hide weak action.

## v2 implementation (2026-10-16, self-rated ~58, not independently reviewed)

- Route: `scenes/45_renoir.js`. The old version was an external bitmap + mesh deformation; it has been replaced with a code-drawn approach and the old version backed up. Shape layer = tree canopy / sky light through the leaves / trunks / sand / table / distant crowd; redrawn with `MEDIUM.broken`: diagonal short strokes for canopy and ground, a separate layer of vertical fine strokes for the crowd (if the crowd shares horizontal strokes with the ground it gets smeared into a lying-down shape); the light-patch layer (warm yellow bright spots / blue-purple shadow) is redrawn into its own cache, two offset copies cross-fade and sway, then land on the figures again at low opacity; the pair of dancers in the foreground is redrawn on a small canvas every frame.
- Lesson: figures and background must be redrawn in separate layers, each with its own stroke direction; the light-patch layer over the figures must drop opacity, or the figures get covered to half their height.
- Still improvable: the figures read as dolls; lacking warm pink skin and fabric highlights; the mid-ground crowd is too orderly.
