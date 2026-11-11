# 10 · Characters: humans get AI-generated frames, code handles compositing

Whenever image generation or character images are involved, first use the [image capabilities guide](images.md) to pick a currently available tool or import existing material; private character assets and platform choices are not defaults for every user.

## Choosing how to implement a character

The same character can be implemented three ways (for a side-by-side of A and B see `assets/characters/huashu-likeness-comparison.jpg`; for C's result see the Kurzgesagt and whiteboard demo films):
- **A Drawn in code**: only for motion blockouts, previz, and purely geometric symbols (blocks, terminal windows — things that are geometric to begin with). Humans, anthropomorphic characters, robots, and objects with faces are not drawn in code for a finished film; see `references/character-fidelity.md`.
- **B Paste frames from an already-locked frame lib**: easy to keep the character consistent, but you have to reconcile the frame lib's style with the scene's.
- **C Generate motion frames in the film's style, then composite**: use reference images to hold identity; after green-screen keying, hand motion and material treatment to code.

Live-action and anthropomorphic characters use only B or C, and must pass the delivery line in `references/character-fidelity.md` when done; without image-generation capability, show only hands and back, or no humans at all. The style cards record the known weaknesses of each kind of character.

## B: Paste an already-locked frame lib

- Frame lib: character frames you have already finalized (waving, dragging, etc., 8 transparent PNGs per action; generic action frames you prepare yourself; the three sets of character frames shipped with the long-scroll demo are in `scripts/engine/demos/long_scroll/frames/`).
- Loaded as image assets when the engine starts; rendering swaps frames per `floor(t*9)%8` — limited animation, no tweening.
- Placed with the center of the foot sole as the anchor; `face=-1` flips horizontally.
- Apply the film's material treatment to the frames (Vox adds a white paper-cut border and a drop shadow; brushstroke styles can lay another pass of fine brushstrokes over the frame with source-atop).

## C: Generate a version in the drawing style

1. **Image generation**: use an image model that accepts reference images, such as gpt-image (for prompt style see [huashu-gpt-image](https://github.com/alchaincyf/huashu-gpt-image)); for batches, run serially. ref = a three-view character design sheet or the master from an already-locked frame lib; state clearly in the prompt:
   - The style's **shape grammar** (not just "in the style of X"): Kurzgesagt flat color blocks with no outlines, shadows one step darker in the same hue; Vox black-and-white halftone newspaper-cutout photos plus a white paper-cut border; whiteboard black marker line art plus orange hatching; Monet short brushstrokes and patches of light…
   - **Pose aligned with the camera blocking** ("side-on, facing right, arm extended pointing right"); if it has to move, generate a multi-frame sprite in one image (4×2, eight frames; put the frame count at the start, lock consistency with "the same character", give only the key poses and let the model fill the in-betweens, "each frame standing centered at the bottom of its cell, all the same size").
   - Green screen `#00B140` (a white hat and white T-shirt rule out a white background).
   - Fixed rules (using Huashu's look as the example): a **pure white** bucket hat (models love to render it light gray — hard-code it), round black glasses, white T-shirt, khaki shorts, white Crocs, a black watch on the left wrist, big head and small body.
2. **Verify provenance**: rely on actual tool-call records, input/output linkage, and human visual checks; PNG metadata cannot prove which model generated something. For bringing assets in, see the [image capabilities guide](images.md).
3. **Key and slice frames**: `scripts/key_split.py` (removes green spill, slices poses by column; for whiteboard line art use `--white` to crop only, no keying, then composite with multiply); when you need to keep the source frame's coordinates, use `scripts/key_green.py`.
4. **Composite**: code decides only position, size, orientation, frame-swap timing, and material; interactive objects such as pebbles, ripples, and props are still drawn in code and aligned to the hand's position.

## When drawing in code is still fine

In a finished film: silhouettes, backs, hands (drawn properly in the style at hand), and things that are geometric to begin with (blocks, terminal windows). Robots, chibi figures, stick figures acting out stories, and giving objects faces are all retired — the reasons and the substitutes are in `references/character-fidelity.md`. The girl/cat rigs in `lib/rig.js` plus `rig_huashu.js` and `lib/toon.js` stay: for motion reference (where the hands are, where the feet are — to set anchors for AI frames), blockout previz, and characters already finalized in style demos such as the Art History Speedrun.
