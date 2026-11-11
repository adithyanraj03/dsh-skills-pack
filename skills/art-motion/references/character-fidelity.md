# Character Fidelity: Either Draw It Well, or Don't Show the Face

Read this page before starting whenever the frame contains a person, an anthropomorphic character, a mascot, a robot, or anything with a face. The author has watched films made by several models; his exact words were:

- "The little people and robot characters used in many videos are just too bad. We should define some of the fidelity and effort requirements ourselves."
- "The colors and the human character designs are a bit AI slop." "The interface with the gold coins and little figures is a bit AI slop."

**A crude character is worse than no character.** When viewers see a round-headed little figure with dot eyes, their first reaction is "AI made this," and no matter how good the explanation is afterward, that first glance drags it down.

## Choose a path first: three general routes and the narrow exception for two flat-cartoon cards

The "Characters" line before the storyboard table records which path was chosen here:

| Characters line says | When to use it | How to do it |
|---|---|---|
| `frame lib <path>` | Image-generation capability is available (the current session has an image tool, or the user supplied character images) | Build an AI frame library by method B/C in `references/10-characters.md`, then pass the "delivery line" below |
| `hands and back only` | No image-generation capability, but the story needs a person | Draw only hands (gripping an object, pointing at an object, putting an object in a pocket), back views, silhouettes, over-the-shoulder; no face in frame |
| `none` | The story can be told with objects alone | Make the object itself the protagonist: a battery, a bag of bread, a book—tell it through shape, color, and motion; do not give it a face |

**Flat-cartoon exception for docs 37/52.** When the Rick & Morty or South Park direction is explicitly chosen, you may design original semantic SVG characters according to the corresponding card. In the storyboard, write `Style: 37_rick_morty …` or `Style: 52_south_park …`, and for characters write `Characters: original semantic SVG …`. This is an exception in method, not an exemption from review: check silhouette, identity, part hierarchy, contact, expression, and action; judge flat fills and simplified joints according to that style, and do not impose the realistic structure, two-layer shading, and three material details from items 2/4/5 below. It does not apply to live-action/realistic or other styles; writing only "SVG" does not enable the exception. The South Park research card already has a single-scene prototype; new characters and new subjects still need to be designed and verified. `y4` still accepts only a frame library; the SVG exception cannot bypass its input contract.

**Retired** (code-drawn versions look AI-made; lint and review will both block them):

- Generic chibi figure: round head, dot eyes, blush, no neck, body is a rounded rectangle.
- White-shell robot: white round shell, blue visor, one antenna, hovering or firing thrusters.
- Things with faces: smiling gold coins, frowning lithium ions, little balls with eyes, meme-style batteries.
- Stick figures and Keith Haring-style figures when used to act out a story (drawing a schematic symbol in whiteboard grammar does not count as acting out a story).

**Exception: the whole film's protagonist is an object character.** A dancing paintbrush or a desk lamp as the protagonist of an entire film may have a face and expressions if its design has gone through the "three-direction hard gate" and the user has chosen it: when the author made a promotional film, a faceless paintbrush was judged "too formal, too boring," and only a cartoon paintbrush with a face passed. The difference is effort: the protagonist is designed (identity prop, body structure, performance) and passes the delivery line below; what is retired is the meme face casually added to a coin, a ball, or an ion.

`y4` clips accept only a frame library (`data.character.frames`); startup fails without one. Code-drawn characters in the engine (`lib/toon.js`'s neutral/bun/author) are no longer used for final films.

## Delivery line: frame-library characters must pass these eight checks

Once made, take a character close-up (enlarged to 2×), check off each item below, and write it into the delivery notes. If it fails, go back to the image-generation step and redo it, or switch to "hands and back only."

1. **Recognizable silhouette**: fill the character with solid black—can you still tell who it is and what it is doing? A person assembled from a circle plus rounded rectangles is not recognizable.
2. **Proportions have a skeleton**: neck, shoulders, elbows, wrists; head-to-body ratio is set by the style and stays constant for the same character throughout the film.
3. **Hands are hands**: you can see fingers or the shape of a glove, and they can actually grip an object (the object is in the hand, not pasted beside it).
4. **At least two layers of light and shade**: base color + shadow, plus a highlight or rim light; the light direction matches the scene.
5. **At least three material details**: clothing folds, stitching, hair strands grouped, fabric texture, shoelaces, watch strap… choose the ones this character should have.
6. **Performance is specific**: each appearance has an expression + pose that matches the content of that shot (frowning at a phone, sighing with relief and putting the phone in a pocket), not just blinking or bobbing up and down.
7. **Same system as the style**: the character's linework, coloring, and palette use the same drawing method as the background—not a sticker pasted onto another painting.
8. **Consistent across shots**: the same character's facial features, hairstyle, clothing, and palette stay consistent in every shot.

## No faces on objects: how to make an object "act"

Bringing a concept to life does not require drawing a face on it.

- **Use shape and motion**: lithium ions huddle together and move slowly when cold; they spread out and move fast when hot. The battery bar shrinks one segment at a time in the cold wind.
- **Use scale**: an object goes from palm-sized to filling the frame.
- **Use contrast**: the same object twice, left and right—one frozen, one normal.
- **Use real objects**: a real battery cross-section, real frost texture, a real screenshot.

## Self-check

Before delivery, pull 6 frames containing a character or object, view them side by side, and ask three questions:

1. Is there anything that looks at a glance like a "default AI little person" or a "white-shell robot"? If so, change paths.
2. Did you put a face on something that should not have one? If so, remove the face and tell it through motion instead.
3. Are the character and background drawn the same way? If not, redo the character in the style, or show only hands.
