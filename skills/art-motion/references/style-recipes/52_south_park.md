# 52_south_park · South Park: digital cutout and limited performance

Status: research recipe; the demo was redone on 2026-10-16 under the doc 16 protocol (see "v2 implementation" at the end); neither self-review nor independent review reached 80, so it is not registered as implemented.

## Before you start

Read [Cross-scene style distillation](../15-cross-scene-style-distillation.md) first, then this card. Works are used to compare visual language; figures, objects, composition, and camera are not copied directly. The stable features below are research generalizations; implementation and transfer plans are hypotheses to be verified; do not falsely present them as official parameters or tested capabilities.

## Scope

Study the series' main digital-cutout visual and performance language; the realistic, anime, and other styles of special episodes are not part of the default. The official 2013 FAQ documents the digitally rebuilt cutout approach, but it is not used to claim the current software version.

## Transferable visual language

- Form: geometric, clearly readable large silhouettes and a few key facial features; new characters have their own proportions and costume recognition points.
- Material: flat paper-piece layers, restrained texture, and occlusion; this must not automatically escalate into smooth 3D or heavy paper sculpture.
- Space: the background provides location and contact for the action; figures and props share a flat scale.
- Performance: mouth shapes, eye direction, pose changes, and pauses carry information; limited movement does not mean the characters slide around like puppets for the whole film.

## What changes with the brief

Do not copy the four leads, the snow town, the school bus, or the dialogue; studying the visuals does not mean offensive jokes must be included.

## Difference from neighboring styles

Different from Rick & Morty's fine outlines and more flexible line-based characters; different from shadow puppetry's translucent material and rod joints.

## Production starting point (to be verified)

When this style is explicitly chosen, write `Style: 52_south_park South Park-style digital cutout` and `Characters: original semantic SVG` in the shot table; you may use original semantic SVG paper characters, organized by part/pivot/expression state; this is a narrow flat-cartoon exception and does not extend to live-action or other styles. Paper texture is bound to part coordinates; footsteps and contacts have states, rather than only translating the whole group. When frame generation is needed, doc 10 can still be used.

Action speed, frame rate, camera, and score are determined by this narrative; do not equate the image's quiet mood with slow motion. Project integration follows the [style author spec](../08-style-author-spec.md); register an engine id only after a new renderer is actually implemented.

## Cross-scene verification prompts (not a fixed template)

- A newly designed adult property manager discusses a leak.
- A vending machine jams with no characters present: limited movement must still read clearly.
- A fast multi-person evacuation: check whether the constrained design remains readable.

Choose at least tests with different subjects/spatial scales/subject types; you do not need to run the full set every time. Record still-frame and motion acceptance separately; keep uncovered areas marked as to be verified.

## References and evidence boundaries

- [South Park Studios: official FAQ on digitally rebuilt cutout animation](https://southpark.cc.com/news/712d55/faq-do-you-still-use-construction-paper-to-animate-the-show)
- [Official episode portal: compare clips that choose different locations and actions during production](https://southpark.cc.com/)

Primary museum/production materials are used to check works and methods; encyclopedia entries only help locate them. Before starting, still look at multiple originals or clips from different scenes and record stable features and exceptions; a list of works does not mean a multi-image visual experiment has been completed.

## Feedback loop after use

Check the latest verified conclusions in this section before use; there is currently a technical check for a 6-second single-scene output; style fidelity and cross-scene visual verification are incomplete. Subsequently record only findings that affect results: date, subject, route used, reference and output paths/hashes, problem, fix, verification status, and scope. Rewrite failed conclusions in place; do not append contradictory rules. Promote a research hypothesis to an implemented recipe only after cross-scene reproduction; for repeatable engineering problems, fix the tool first and test. User preferences go separately into the taste profile and do not expand authorization.


### 2026-10-15 · Single-scene trial feedback

- Scene: laundromat accident; event: an original adult character presses a button, socks fly out, surprised reaction; route: code drawing and animation.
- Check: deterministic re-test, full MP4 decode, and independent frame-sampling review; the short film's fast-motion metric was downgraded to yellow under the existing gate, and this cannot be used to infer that a long film passes.
- Boundary: this only proves the project runs and is watchable; artist/studio style similarity remains limited, and geometry, palette, or texture parameters cannot be treated as the final standard.

## v2 implementation (2026-10-16, self-review ~75, taste items pending Huashu, the author)

- Signature: cutout feel (jittery edges, paper fibers), two white ovals with black dots for eyes stuck onto the face, trapezoidal body, short black column legs, flat fill + thin black outline, whole-piece translation/pivot rotation.
- Route: `scenes/52_south_park.js`. Each shape uses `P.cut` to cut a jittery edge; `kid()` animates around neck/shoulder pivots; the mouth is a black half-oval that opens and closes; falling snow steps at 12fps. The subject is changed to a bus stop: the school bus slides in, the door snaps open, children line up and jump aboard. Costume colors avoid the named characters' combinations.
- Measured: qa determinism ✓, no jumps, 6ms/frame, motion 5.3%.
- Still improvable: the children are all from the same mold; boarding is only translation plus a hop; mouth shapes lack matched dialogue.
