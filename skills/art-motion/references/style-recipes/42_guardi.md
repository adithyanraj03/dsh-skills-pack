# 42_guardi · Guardi: atmosphere, broken light, and loose edges

Status: research recipe; the demo was redone on 2026-10-16 under the doc 16 protocol (see "v2 implementation" at the end); neither self-review nor independent review reached 80, so it is not registered as implemented.

## Before you start

Read [Cross-scene style distillation](../15-cross-scene-style-distillation.md) first, then this card. Works are used to compare visual language; figures, objects, composition, and camera are not copied directly. The stable features below are research generalizations; implementation and transfer plans are hypotheses to be verified; do not falsely present them as official parameters or tested capabilities.

## Scope

Focus on the atmosphere and brushwork in city views and capricci; avoid generalizing all his periods from a single Venetian image.

## Transferable visual language

- Brushwork: short, loose, dappled bright strokes; contours are broken, but key structure remains legible.
- Color and light: retain local bright color within silver-gray or warm gray; atmosphere links buildings, figures, and distance.
- Space: near-far layering and small-scale figures establish environmental volume; accurate surveying is not the only goal.
- Material: architecture, water, and sky each have different stroke directions; do not cover the whole screen with one kind of grain.

## What changes with the brief

Venice, gondolas, canals, and ruins are not necessary conditions of the style; do not force water into every scene.

## Difference from neighboring styles

Different from Canaletto's clear, survey-like precision; different from Sisley — do not merely switch to a generic Impressionism of sunny blue-green tones.

## Production starting point (to be verified)

First establish a readable urban/interior/industrial space, then let edges and bright strokes loosen with depth. Bind texture to world or object coordinates; during motion, do not re-randomize the whole screen.

Action speed, frame rate, camera, and score are determined by this narrative; do not equate the image's quiet mood with slow motion. Project integration follows the [style author spec](../08-style-author-spec.md); register an engine id only after a new renderer is actually implemented.

## Cross-scene verification prompts (not a fixed template)

- Passenger flow at an elevated station after rain.
- Opening an inspection door in a dry hangar: there is still atmosphere without water.
- A market in a community square in winter: change season and subject scale.

Choose at least tests with different subjects/spatial scales/subject types; you do not need to run the full set every time. Record still-frame and motion acceptance separately; keep uncovered areas marked as to be verified.

## References and evidence boundaries

- [*A Caprice with a Ruined Arch*](https://www.nationalgallery.org.uk/paintings/francesco-guardi-a-caprice-with-a-ruined-arch)
- [National Gallery of Art Guardi collection](https://www.nga.gov/artists/1363-francesco-guardi/artworks)
- [*Lagoon Capriccio*](https://www.nationalgalleries.org/art-and-artists/13736/lagoon-capriccio)

Primary museum/production materials are used to check works and methods; encyclopedia entries only help locate them. Before starting, still look at multiple originals or clips from different scenes and record stable features and exceptions; a list of works does not mean a multi-image visual experiment has been completed.

## Feedback loop after use

Check the latest verified conclusions in this section before use; there is currently a technical check for a 6-second single-scene output; style fidelity and cross-scene visual verification are incomplete. Subsequently record only findings that affect results: date, subject, route used, reference and output paths/hashes, problem, fix, verification status, and scope. Rewrite failed conclusions in place; do not append contradictory rules. Promote a research hypothesis to an implemented recipe only after cross-scene reproduction; for repeatable engineering problems, fix the tool first and test. User preferences go separately into the taste profile and do not expand authorization.


### 2026-10-15 · Single-scene trial feedback

- Scene: old harbor sailboat; event: a sailboat crosses broken light and loose building edges; route: code drawing and animation.
- Check: deterministic re-test, full MP4 decode, and independent frame-sampling review; the short film's fast-motion metric was downgraded to yellow under the existing gate, and this cannot be used to infer that a long film passes.
- Boundary: this only proves the project runs and is watchable; artist/studio style similarity remains limited, and geometry, palette, or texture parameters cannot be treated as the final standard.

## v2 implementation (2026-10-16, self-review ~78, taste items pending Huashu)

- Original anchoring: *The Venetian Lagoon*, *The Grand Canal with the Rialto Bridge*. Note: modern photos (the Salute church) were mixed into the search results and discarded. Signatures: low horizon, huge silver-gray-green atmosphere, slender gondolas, people reduced to black bodies plus one or two points of white and red, dry fast brushwork, loose edges.
- Route: `scenes/42_guardi.js`. Sky (broad cumulus, warm light/cool shadow) / island tower / water (bands of sky light + tower reflections) each pass through `MEDIUM.broken` (slender dry strokes, low saturation); the gondola and poleman are repainted on a small canvas, then stretched and darkened for reflections; water surface displaced row by row; clouds drift; birds.
- Still improvable: the tower's brushwork leans toward stacked bricks; figures are silhouette-only; missing Guardi's characteristic sparkling white dots.
