# 50_ma_yuan · Ma Yuan (马远): offset centre of gravity, negative space, and distilled brushwork

Status: research recipe; the demo was redone on 2026-10-16 under the doc 16 protocol (see "v2 implementation" at the end); neither the self-rating nor the independent review reached 80, so it is not registered as implemented.

## Before you start

Read [Cross-scene style distillation](../15-cross-scene-style-distillation.md) first, then this card. The works are there to compare visual language; figures, objects, composition, and camera are not copied directly. The stable features below are research generalizations, and the implementation and transfer plans are hypotheses pending validation; do not pass them off as official parameters or as measured capability.

## Scope

The research scope is Ma Yuan's Southern Song landscapes and poetic small scenes; "Ma's corner" is an organizing tendency, not a fixed lower-left-corner template, and it is not equivalent to all Chinese ink painting.

## Transferable visual language

- Space: the painted scene and the unpainted space establish scale, direction, and situation for each other; blank areas are not backgrounds waiting to be filled.
- Brush and ink: bony contours, texture strokes, and tonal variation build foreground texture, while the distance is more distilled.
- Composition: an offset centre of gravity and branches/rocks extending out of the frame create guidance; direction, proportion, and subject can all be changed.
- Colour and light: ink works together with restrained colour; this is not desaturating the whole image, blurring it, or adding xuan-paper texture.

## What changes with the brief

Ancient figures, landscapes, one particular corner, a lone boat, plum blossom, or a large empty area of screen are not mandatory; negative space in a modern scene must also express space and event.

## Difference from neighbouring styles

Distinguished from Fan Kuan's monumental masses and dense texture dots; distinguished from generic ink-and-wash freehand, which does not rely on ink diffusion as its only identifying feature.

## Starting point for production (pending validation)

Arrange the new event with solids and negative shapes first, then explain structure with directional brush tips, wet and dry, and near/far tonal values. Motion inside the negative space may only reveal what the story needs; do not add particles to "fill the blank".

Action speed, frame rate, camera, and score are set by this narrative; a quiet mood in the image does not mean slow motion. Engineering integration follows the [style author spec](../08-style-author-spec.md); register an engine id only after a new renderer is implemented.

## Cross-scene validation prompts (not fixed templates)

- One person waiting for a train on a winter-night platform.
- A folding tool opened on an empty workbench.
- Two people quickly passing an umbrella at a doorway: tests the relationship between action change and negative space.

Choose tests that differ in subject, spatial scale, and subject type at minimum; there is no need to run the full set every time. Record still-frame and motion acceptance separately, and keep marking uncovered areas as pending validation.

## References and evidence boundaries

- [Met, *Plum Blossoms by Moonlight*: visual poetry and situation](https://www.metmuseum.org/art/collection/search/44638)
- [National Palace Museum, *Spring Walk on a Mountain Path*, collection display](https://south.npm.gov.tw/SelectionsDetailC004100.aspx?Cond=c693cd84-df8f-4e6f-8724-d7025ac43c20)
- [Met, *Peach Blossom Spring* catalogue: keep cross-checking different bird-and-flower and landscape works](https://resources.metmuseum.org/resources/metpublications/pdf/Peach_Blossom_Spring_Gardens_and_Flowers_in_Chinese_Painting.pdf)

Primary museum/production material is used to check works and methods; encyclopedia entries only help with orientation. Before starting you still have to actually see several original works or clips from different scenes side by side and record stable features and exceptions; a list of works does not mean a multi-image visual experiment has been completed.

## Feedback after use

Check the latest validated conclusions in this section before use; right now there is a technical check of a 6-second single-scene output; style fidelity and cross-scene visual validation are not complete. Afterwards record only findings that affect results: date, subject, route taken, reference and output paths/hashes, problems, fixes, validation status, and scope. Revise a dead conclusion in place rather than appending a contradictory rule. Upgrade a research hypothesis to an implemented recipe only after cross-scene reproduction; for repeatable engineering problems, fix the tool and test it first. User preferences go into the separate taste profile and do not expand the authorization.


### 2026-10-15 · Single-scene trial feedback

- Scene: a rain shelter at the cliff edge; event: a paper umbrella is carried by the wind across the negative space; route: code drawing and animation.
- Checks: deterministic re-run, full MP4 decode, and independent frame-extraction review; fast-motion metrics on a short clip are marked yellow under the current gate and cannot be extrapolated to long-form acceptance.
- Boundaries: this only proves the piece runs and can be watched; similarity to the artist/studio style is still limited, and geometry, palette, or texture parameters cannot be treated as the final standard.

## v2 implementation (2026-10-16, second-round self-rating ~78, first-round independent review 74, taste item pending Huashu (花叔, the author))

- Anchored to originals: *Treading on Songs*, *Plum, Rock, and Ducks by a Stream*, and *Spring Walk on a Mountain Path*. Signature: silk ground tinted golden brown, corner composition, axe-cut texture strokes (broad flat side-brush), long weeping-willow branches, tiny figures looking into emptiness, pale ink washed distant mountains without contours.
- Route: `scenes/50_ma_yuan.js`. `MEDIUM.silk` ground (warp and weft lines + bleeding edge) → distant mountains rendered with blur → rocks (polygon clipping + broad flat `P.brush` axe-cut strokes + fine hard texture strokes + broken contour) → old willow trunk (thick strokes with pauses) → motion: hanging strands (clustered, curved, of varied length, `P.brush` per strand, swaying in the wind), a scholar (back view, robe folds in one stroke, silk left unpainted, sleeve raised pointing into the distance), a boat, birds, water ripples → silk texture multiplied over the top.
- Measured: qa determinism ✓, no popping, 8 ms/frame.
- Lesson: evenly spaced vertical strands read as a fence; leaving figures unfilled with a back view + robe folds is the most stable; use radial gradients for mist bands, because rectangular gradients show seams at the edges.
- Second-round experiments: widening the trunk in segments read as bamboo joints, and changing axe-cut strokes to polygonal wedges read as arrows; both were reverted. Now using one continuous thick line plus short bark strokes, and short broad brush axe-cut strokes.
- Still improvable: the axe-cut strokes on the rocks are still too dense; the trunk's finishing stroke is too blunt; the signature has only a seal and no characters.
