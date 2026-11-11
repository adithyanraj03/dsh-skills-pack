# 08_impressionism · 1874 Impressionism (Monet)

65–76ms per frame (median 69ms). The main cost is two full-screen P.strokes passes plus one character-stroke pass.

## Pipeline (following the 09_postimp benchmark)
1. Flat-color underpainting `impBase`, repainted every frame, because the poppies, clouds, bouquet, potted plant and curtains all move:
   - Pink-purple wall (#d8bede→#f0c8cc→#f2c4d4), with a warm-yellow sunlight radial gradient of r=900 overlaid at the upper right.
   - Garden outside the window: sky, woods, red-roofed house, lawn, 70 poppies (stem bases fixed, flower heads swaying `sin(t·3.2+ph+x·.02)·(6+r·.6)`), a woman with a parasol plus a child (a nod to Poppy Field), flower beds.
   - White window frame, pale-lilac curtains, Impression, Sunrise on the wall, round table with a white-purple cloth, vase, teapot, potted plant on the right (the whole leaf mass sways with `sin(t·1.9)·8`).
2. Stroke repaint, **two passes**:
   - Main image: cell 11, len 20, width 7, outline 0, jitterCol 26, using a mask to exclude the window view and the small painting on the wall.
   - Window view and Sunrise: cell 6, len 11, width 4.5, drawn only inside the mask.
   - The first version had only one coarse pass; the houses and parasol woman outside the window were all smeared away, and Sunrise was brushed into a single slash. Splitting it into two passes and changing Sunrise to horizontal water-ripple strokes made everything legible.
   - Prime the canvas with #f2e6ee so the light base shows through the gaps between strokes.
3. Direction field: wall diagonally up-right (sunlight area −0.95 radians, elsewhere −0.55, plus ±0.55 noise); ground nearly horizontal; curtains and tablecloth vertical; potted plant radiating outward from the pot mouth; sky in the window horizontal.
4. Region palette `P.swatch` (mixBase 0.3–0.45): wall 9 colors of pink-purple-yellow; sunlit wall 7 cream-yellow; ground 7 rose-orange-violet; sky, grass green, curtain pale lilac, tablecloth blue-purple each get a set. The white window frame is detected by `col > (240,236,225)` and mixed back to white, otherwise it gets brushed into the wall color and the frame disappears. Poppy red returns null, keeping the underpainting's original color.
5. Characters: first flat-fill with `RIG.drawCat` / `RIG.drawGirl` in fill mode, then run one P.strokes pass on the character layer with `source-atop` (cell 7, len 13), so strokes appear only inside the character. The white dress samples four colors: white, pale lilac, cream. After that only the features are added, in fine pale-lilac lines; Impressionism does not outline.
   - The straw hat, blue ribbon and belt ribbons all flutter.
   - `pal.line` must be set to the hair gold: drawGirl's locks and lid parts draw with pal.line even when lw=0, and the default dark blue leaves black streaks beside the face. Same for the cat: set `line`/`whisker`.

## Motif animation
- **Sunlight dapples flickering and hopping**: 26 patches (6 on the tabletop, 20 on the ground). Each patch's intensity is `0.5+0.5·sin(t·sp+ph)·sin(t·sp·0.53+2ph)`, clamped, so the on/off rhythm is irregular. Patches drift sideways ±10px slowly. Each patch is 40 short bright yellow-white strokes, boiling with a new seed at 8fps. The first version used screen blending at α0.75 and was nearly invisible on the pink ground; source-over at α0.95 made it bright enough.
- The sunlit wall area has 60 diagonal bright strokes, flickering with a new seed at 6fps.
- Cat fur sparkle: 60 candidate points, restricted with `isPointInPath` to the left half of the cat's body and head (the lit side), blinking with `sin(t·7+h·30)`.
- The whole painting boils at 8fps; the steam is white.

## Performance
Two full-screen stroke passes plus one character-stroke pass, about 69ms. During a transition the engine draws both eras at once; 08→09 totals about 69+110ms, which exceeds 150ms, but only for the dozen-odd transition frames.

## v2 rework (review: the whole screen's strokes reshuffle every 7–8 frames, frame difference 18)
- All stroke positions are now fixed: `boil: 0`. **Fixing the seed alone is not enough**: P.strokes' random numbers are one sequential stream, and when palette returns null the jitter consumes 3 extra numbers; whether it returns null or not depends on the underpainting color, so one poppy sway or plant wobble reshuffles every subsequent cell's strokes. `stable(palette)` wraps it so each cell consumes exactly 1 number and never returns null.
- Character strokes no longer use alphaMask (lifting the cup changes the skipped cells and reshuffles the whole layer); instead a hand-written loop uses `U.hash(i,j)` per cell. This also brought the frame time back down from 115ms to 72ms.
- "Aliveness" is now carried by local motion: dapples drift ±44px and flicker at 5–11; poppy sway increased to 10+; clouds drift at 45px/s; curtains and plant sway; the window-view grass strokes rotate ±0.22rad with the wind direction; the cat swishes its tail (×2.2) and turns its head (look).
- Static-segment frame difference (480×270, counter masked, transition frames at segment end removed): v1 mean 4.14, peak 20.5 — strobing; v2 mean 0.57, peak 1.9. Original 0.77.
