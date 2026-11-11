# 15 · Moving an artistic language to a new scene

When to read: when adding an art style, applying an existing style to a different subject, separating neighbouring styles, or when the user gives only an artist's or studio's name. If you just need one existing render parameter, read the relevant implemented card directly. This page studies artistic language; it does not replace the user's new story, scene, and characters.

## Separate four things first

- **Style language**: brushwork and material, color relationships, lighting, form, spatial organization. These should stay identifiable after the subject changes.
- **Compositional tendencies**: e.g. off-center weight, connections between groups, scale contrast. Solve them fresh for the new frame and the new event — they are not fixed coordinates or the same layout in every shot.
- **Content and motifs**: the figures, clothes, bridges, boats, gardens, and deities in the famous painting. Unless this piece needs them, they do not enter a new work just because the style does.
- **Narrative and action**: who wants what, what resistance they meet, how the action changes the situation. Speed, camera moves, and rhythm are decided by content; a serene style can depict fast action, and limited animation can carry complex events.

Choosing an artist is not choosing the template of one famous painting. When a studio is named, first locate the art scope — film/director/period: neither Ghibli nor Pixar uses one single way of drawing across its whole output. Narrow the scope using the user's examples and the subject; when there really are several equally valid directions, fold them into the existing three-direction design sheet for the user to choose, rather than adding another round of formal approval.

## Distilling across works

When first establishing a scope, usually look at at least 3 original works or 3 official clips from different scenes side by side, covering different subjects, scales, or lighting where possible. Consecutive frames, crop details of one painting, and recolors of one composition do not count as independent samples. If the material is thin, state the gaps clearly; don't pad the count and don't claim to have looked. A mature card that already has evidence gets checked only as needed; there is no requirement to re-research it every time.

Write a short "style brief" and put it before or beside the project's shot table:

1. Scope and where the original works come from; verify attribution, medium, and period first.
2. 3–5 observable stable features, each noting which references support it and which references don't apply.
3. Two points that separate it from its nearest neighbours. Renoir, Pissarro, and Sisley, for instance, are not finished just by sharing one broken-brushstroke filter.
4. This piece's new subject, event, space, and frame; rebuild them to the requirement — don't casually lift them from the references.
5. Visual relationships to keep, content that may change, technical approaches still to be verified.

Record "what appears in the painting" separately from "how the painter put it there". A palette should state the dominant color relationships and the organization of light and dark; don't claim a particular set of hex values is the artist's fixed standard colors, and 3–6 dominant colors does not mean every pixel may only use those colors. Texture, color mixing, shadow, and reflections should obey the dominant color relationships. Existing color preferences and gates still apply; if an exception is genuinely needed, note the subject-based reason through the existing process — don't quietly switch the check off.

## Validate on a new scene before making it a capability

Produce a design sheet for this piece's subject first, still following the existing three-direction mechanism. The form, edges, light, and material of characters, animals, props, and background must be handled together; you cannot just apply a filter to the background. Choose the render route according to current capability, and state which parts use code, existing material, a character frame lib, or other approved tools.

The first time a research card is upgraded to a transferable recipe, stress-test it on different scenes, usually including a scene of characters in action, an empty/object scene, and a scene that clearly changes scale or environment. Subjects may be inspired by the card's examples, but those examples must not become a new fixed template. Whether a landscape painter can handle a character close-up is in the to-be-proven range; don't promise in advance that every subject fits.

Check stills first: with the artist's name and the famous work's landmarks removed, are form, color and light, brushwork, and space still identifiable? Put side by side with the nearest neighbour, is there a real difference? Then check motion: action contact, occlusion, texture coordinates, character identity, material consistency, and viewing at normal speed. A good-looking still does not prove smooth animation; a sensible written plan does not prove the picture works.

## Be honest about status

- **Research recipe**: has sources and an explicit visual hypothesis and can guide an attempt; has no dedicated implementation or picture validation. You cannot call `render.py --solo <id>` just because a Markdown card with that name exists.
- **Single-scene implemented**: has an implementation, output, and check records, covering that scene only. Record the reference parameters and the failure boundaries.
- **Cross-scene validated**: different new scenes pass independent picture review, with the covered range recorded; animation validation is written up separately. Procedural scenes are registered per doc 08, and engine QA and delivery gates are unchanged.

One branch of a studio passing does not mean the whole family passes. A new card does not borrow an old sample's star rating, performance, or acceptance conclusions. Same-room parameters in an old card are historical implementation evidence and are only worth consulting for a matching scene.

## Lessons feedback

Before use, read the card's scope, weaknesses, and latest measurements. After finishing, record in the card the date, task and scene, sources, implementation/output evidence, observations, fixes, validation status, and boundaries. If new evidence overturns an old conclusion, fix the original wording and check the related routing; if a fault reproduces reliably, fix the tool first and test it. User choices are recorded in the taste archive; a one-off work's features do not get promoted into rules for all works.

Source of this process: the October 2026 style-library expansion, where the user explicitly asked to focus on an artist's overall style and adapt it to different creative scenes. Source research and implementation hypotheses are kept separate; entries with insufficient evidence stay in research state.
