# Palettes: one palette per film

This is the "Palette" line above the storyboard table. Pick a name here, or define 3–6 hex values with the rules at the end. Every parametric clip spec writes the same `"theme"`; scenes use only these colors too (lighter/darker shades and opacity changes are fine — don't introduce new hues).

## The no-go zone first

**Blue-purple gradient backgrounds, deep-purple starfields, neon cyan-purple light, purple frosted glass**: the author's words — "we need to avoid the blue/purple gradient junk palettes; it's very AI slop". These are the default colors AI-made animation falls into most often, and the audience reads "made by AI" instantly.

`deliver.py` measures it: a frame with 30% or more blue-purple (hue 225°–300°, saturation ≥ 0.30) counts as a blue-purple frame; blue-purple frames at 30% or more of the film → red light, no delivery. When the subject itself genuinely needs blue-purple (user-specified cyberpunk purple, a Van Gogh Starry Night style frame…), add `--allow-blue-purple "reason"` at delivery: the light drops to yellow and the reason goes into the facts section of the delivery notes.

Navy flat fill (hue around 210°, see `navy` below) is not in the no-go zone: it's a deliberate single ground, not a gradient and not glowing.

## Eight ready palettes

Each has 6 keys: `bg` ground, `surface` card/paper/panel, `ink` primary text, `sub` secondary text and hairlines, `accent` primary accent, `accent2` secondary accent. In a clip spec write `"theme": "wood"`, or write an object `{"name": "wood", "accent": "#B8452A"}` to override just one key.

| Name | Good for | bg | surface | ink | sub | accent | accent2 |
|---|---|---|---|---|---|---|---|
| `paper` | humanities, history, reading, explaining an idea | #F3EDE2 | #FBF8F2 | #1B1A17 | #6B655B | #C8402F | #2F5D62 |
| `poster` | opinions, conflict, a piece of science that needs one punchy line | #FFD23F | #FFF6D6 | #111111 | #4A4433 | #FF5A36 | #14213D |
| `ink` | technology, night scenes, serious topics | #121417 | #1E2226 | #F2EFE8 | #A39E93 | #F2B33D | #5FB3A1 |
| `navy` | products, data, phones and electronics (flat fill, no gradient) | #0D1B2A | #16293D | #EEF3F6 | #8FA3B3 | #5CC8E0 | #F2A93B |
| `bauhaus` | design, structure, geometry, process | #EFE9DD | #FFFFFF | #111111 | #555555 | #D62828 | #1D4E89 |
| `snow` | winter, medical, cleanliness, laboratories | #E9EEF0 | #FFFFFF | #1F2A30 | #5E6B72 | #D9482B | #3E7C8C |
| `wood` | daily life, kitchens, craft, things at home | #EDE3D1 | #F7F1E6 | #2B2622 | #7A6E62 | #C4552D | #3F5B4B |
| `chalk` | classrooms, derivations, formulas, worked problems | #23302B | #2E3D37 | #F1EFE6 | #A9B3AA | #F4D35E | #E87D5A |

## Defining your own

- 3–6 colors: one ground, one surface, one primary text, one secondary text, one or two accents. An accent points at one thing per shot, no more.
- Decide the ground first: light (paper, snow, wood) or dark (ink, navy, chalk); the film never jumps back and forth between light and dark.
- Keep values out of the blue-purple zone: hues 225°–300° with saturation ≥ 0.30 are not used as ground or in large areas. `storyboard_lint` checks the palette values and flags red when they land in that zone.
- No gradient grounds, no neon outer glow. For depth use paper texture, grain, or two layers of flat fill at different values.
- With real material (screenshots, photos), pull one or two colors out of the material as accents, and keep the ground from this set.

## Self-check

Before delivery, lay the pulled frames in a row: is the ground within the same brightness band from first to last? Are there only those one or two accents? Did any shot suddenly show a white bar chart, a purple starfield, a neon border — "another film's colors"? If so, repaint that shot to the palette.
