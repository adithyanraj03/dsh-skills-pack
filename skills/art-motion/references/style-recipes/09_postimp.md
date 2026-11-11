# 09_postimp · 1889 Van Gogh (benchmark implementation)

File: `scripts/engine/scenes/09_postimp.js`, about 110ms per frame (three full-frame passes of brushstrokes). Other eras are written following its structure.

## Pipeline
Flat-filled underpainting (large areas of wall / floor / window / bed) → flow-field brushstroke repaint (regional palette) → prop layer (table, chairs, vase, picture frame, pendant lamp, as separate small strokes with source-atop) → environment line art (deep blue 4.5px, 8fps boil) → characters (flat fill → fine strokes with source-atop → line and facial-feature cleanup) → moving highlights (dashed rings around the lamp halo expanding outward, stars twinkling, heat shimmer).

## Key parameters
- Direction field: wall vertical −π/2 ± 0.22·noise; floor along the perspective lines toward the vanishing point (960,330); starry sky along the nearest swirl's tangent + 0.3t rotation; lamp halo around the circumference; headboard vertical, bedsheet near horizontal.
- Three stroke passes: non-wall non-floor cell10 len22 w6.5; wall cell14 len64 w8; floor cell12 len46 w8. Stroke outline 0.8–0.9, mixed with 40–45% deep blue. Reseed at 8fps.
- Regional palettes (`P.swatch`, mixBase 0.3–0.45): wall `#7f9be6 #5f7fd8 #a7bbf2 #6c6fd2 #8ad0e6 #c3cbf6 #4f6cc8 #9a8fe0`; starry sky `#22339a #2f4fb8 #5c86dc #8fb6ee #1b2a78 #3c6bd0`; floor `#c0573c #a8453a #d7774a #8e3b30 #5f8f6a #c96a52 #e08a5c`.
- 7 rings of orange / pale-orange spiral stripes on the cat (clipped to the body, rotating at 0.6rad/s) — the original film's "swirl cat".

## Pitfalls
- The same parameters over the whole image blur into a carpet: wall, floor, and the rest must be three separate passes.
- Small props get smashed by the large strokes: always split them into a prop layer.
- Colour jitter alone produces "noise in the same blue"; the Van Gogh feeling comes from the dozen or so hues in the regional palettes.
