# 03 · First frame first, then make it move: four routes

Whenever image generation or character images are involved, first use the [image capabilities guide](images.md) to choose a currently available tool or import existing material; private character material and platform choice are not defaults for every user.

The method Huashu (the author) wanted: design a single frame with artistic quality first, then make that frame move as required. In one 2026-10-04 project all four routes were actually run, each with its own fit.

| Route | Who draws the picture | Who does the motion | Measured | When to choose |
|---|---|---|---|---|
| **A pure code** | Canvas procedural drawing + style renderer | code (choreography curves, IK, particles, boil lines) | the Art History reproduction mainline (Huashu's choice) | when you must prove "a model can produce art animation straight from code"; when you need precise control of every element's motion; when you need dozens of styles (swap the renderer, swap the style); when it must align frame-accurately with the VO |
| **B AI layered assets + code motion** | the image model draws per layer (green screen, original frame coordinates kept) | code (translation, arcs, squash, physics, effects) | the 2026 ending segment, 11 assets composited in a single pass | when image quality must be highest and the character needs complex performance; when the style is realistic/illustrative and code can't draw it |
| **C video model first/last frame** | the image model draws one frame | Seedance first/last frame (the same image at both ends) | Lovart Seedance 2.0 Van Gogh test: the girl sets the cup down and picks it up again, the starry sky turns, the cat flicks its tail, composition holds all the way through | when you want the organic feel of "the whole painting flowing" without precise control; demo/atmosphere shots |
| **D hybrid** | background with B/C, characters with A, or the reverse | code orchestrates the timeline uniformly | — | big productions: the background needs texture, the characters need control |

## The shared first step: a one-frame design still

Whichever route you take, first get one "correct frame":
- **With a reference film**: feed that segment's "last frame before the transition starts" to gpt-image as the reference image, with the prompt "keep the reference's composition, camera, the position and size of every object, the palette and brushwork exactly as they are; change only two things: …". Measured, a 50% overlay with the original nearly coincides pixel for pixel; composition lock comes from the reference image, not from writing coordinates in text.
- **Without a reference film**: design the composition for the subject first (what the subject is, where it sits in frame, where the camera moves), then render a block-out screenshot as the reference image. Only speedrun/time-travel films fix a fixed scene skeleton (standard composition coordinates) up front, with every segment aligned to it.
- **Three-direction hard gate**: produce three character interpretations on the same frame for a human to choose from (this film: period women's dress / the same person time-travelling / the original with a swapped head). Choosing the frame where the original's character is male gives the widest spread.

Pitfalls of the design still (all of them hit):
- Writing an underage character (17 years old) plus any mention of "short skirt" gets flagged as sexual and the whole image rejected. Always write long garments and add "modest clothing".
- Write fur colour down to the body part: "orange-and-white cat (orange tabby on the head, back and tail; white on muzzle, chest, belly and all four paws)". Writing only "orange cat" gets you an all-orange body.
- Writing an action in the description ("raising the cup to drink") overrides the reference image's pose. To keep the original pose, write only "keep the gesture in the reference image".
- Text that has to move (years, titles): tell the model to "remove it and leave a clean background" and let code draw it; decorative text inside the picture goes into the prompt word for word.
- Run batch image generation serially; the evidence for a generation source is the actual tool-call record, the input/output linkage and human visual checking; PNG metadata cannot prove which model generated an image. For asset intake see the [image capabilities guide](images.md).

## Route B's key: green-screen assets keep the original frame coordinates

Use the design frame as the reference image, prompt: "draw only the XX in the reference image… everything else is flat pure #00FF00, with no shadow, ground or text. Position, size and orientation exactly as in the reference image." What comes out is a character already standing on the original frame's coordinates. When keying, **don't crop to the subject's bounding box and throw the coordinates away** — `scripts/key_green.py` writes the top-left corner into sprites.json as it crops, and compositing pastes back at the original coordinates, aligned in one pass.

## Route C's key: the same frame at both ends

Seedance 2.5/2.0 supports frames2video. Give the same design still as the first and last frame → things inside the painting move and come back to the original composition, and the clip's ends can cut seamlessly into transitions. Prompt structure: ① the camera is completely fixed (no push, pull, pan, zoom or shake) ② hold composition/style/palette throughout, no realism, no adding or removing objects, no new text ③ list item by item "what moves in the painting, and how" (from the breakdown's motion list). Generate 5 seconds, take the best second or so, and change speed to the rhythm.
Channel: any Seedance integration that supports first/last frame (frames2video) will do; the point is in the prompt itself; video generation is billed per run, so test one short clip first.

## Route A's key

See `04-code-drawing.md`. In one sentence (speedrun/time-travel): the same scene skeleton × shared choreography × one renderer per style × characters on their own layer, drawn afterwards × lines added last. For other subjects, replace the first two items with composition and action designed for the subject.
