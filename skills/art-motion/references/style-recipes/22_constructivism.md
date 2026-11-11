# 22_constructivism · 1924 Russian Constructivist poster (Rodchenko / Lissitzky)

> Source: transfer test B (implemented by an independent agent with the skill read-only, 2026-10-04). The scene code was later ported into `scripts/engine/scenes/22_constructivism.js`.

At experiment time the file was named `scenes/c1_constructivism.js` (about 175 lines). Median 5ms per frame; frame difference 3.6%.

**Pipeline**
1. Fully cached background plate `cs_bg`: off-white aged paper (`P.texture` `#e9dfc4`, dark `#d9c9a4`) → diagonal black bar on the left (rotate −0.5), red square (rotate 0.26), 5 lines of "body text" black bars → fine diagonal lines on the right, red dot, vertical geometric letters "ЧАЙ" inside a black vertical bar → large black circle behind the figure's head (center (1330,395), r 215) → diagonal red ground (0,905)→(1920,856), with a 12px black line along its top edge → window → black table (red edge, diagonal brace) → black block stool.
2. **Window = photo collage**: first draw a grayscale "photo" offscreen (sky gradient `#5e5e5e→#e8e8e8`, radial white clouds, dark factory silhouette, smokestacks), then halftone it with `halftone()` (cell 7, gain 0.8); draw the Shukhov Tower in crisp black lines on top of the halftone (five hyperboloid sections, each with two sets of 18 straight generatrices, phase difference ±1.1rad, omitting the back-facing ones where sin<−0.2). This is exactly "photo + hand drawing" collage.
3. **Skin = halftone photo**: face, neck, hands are first drawn as grayscale gradients (bright in front, dark behind, `#fafafa→#9c9c9c`) offscreen, then halftoned (cell 4.6, gain 0.74, 45°). Under the halftone is an off-white base; the outer edge is first stroked 7px `#fbf7ea` — that ring is the white border of a cut-out photo. Features are added with crisp black strokes, lips hand-colored red. Clothing is all cut-paper flat fill + 3px black lines; shadows use `shadeDots()`, dropping halftone dots inside the path according to a function.

**Key functions**
- `halftone(c, src, bx,by,bw,bh, cell, col, gain, ang=π/4)`: sample src grayscale on a rotated grid, dot radius = cell·gain·√(1−L), only where alpha>128. **All dots are merged into one path and filled once**. The face has about 3,000 dots and takes <2ms.
- Geometric Cyrillic letters: 5×7 modules, each letter is a set of rectangles or polygons (the diagonal of Й is a quadrilateral, the breve is a small rectangle above). **Each part is filled separately**.

**Motif animation**
- Lissitzky's red wedge piercing the black circle: apex travels back and forth along the 0.34rad axis, `70·(0.5−0.5cos(2π·1.6·lt))`.
- Red dashed ring outside the black circle: dash [46,22], `lineDashOffset = −260·lt`.
- Radio waves from the tower top: 4 red arcs, `r = 18 + ((1.4lt + k/4) mod 1)·230`, α and line width decaying with phase.
- Ground slogan "ПЕЙТЕ ЧАЙ!": stamped letter by letter (the k-th letter starts at 0.045k seconds and shrinks from 1.5× to 1× in 0.12s), then the whole row wave-jumps `−10·max(0, sin(11lt − 0.8k))`; every 4th letter is black.
- The two tails of the headscarf sway gently `sin(9lt)·6`; steam above the cup is three black polylines rising.

**Characters**: Komsomol girl — red headscarf (13 local points on the head, front edge moved back enough to show golden bangs, knotted at the nape with two triangular tails), white shirt + red neckerchief triangle + red cuffs, dark gray long skirt (halftone shadow). Cat in cut-paper orange `#e2741c` + off-white, 10px black stripes, tail outlined with dashes for tabby bands, eyes are vertical square pupils.

**Palette**: paper `#e9dfc4`; red `#c8231c` / `#8f1711`; black `#151311`; off-white `#f4ecd6`; blonde `#e3b03e` / `#a87a1c`; cat orange `#e2741c`.

**Pitfalls**
- The breve of "Й" was first drawn above the letter box (y=−1.7u): in vertical setting it was covered by the previous letter, and in the ground slogan it was covered by the skirt hem, so review read it as "ЧАИ". Changed so the whole letter is drawn within 7 cells (the И part shifted down 1.7 cells), and the slogan was moved above the character (poster type over the figure).
- "А" was first assembled from two opposite diagonal legs + a crossbar in one path; the overlap was canceled by nonzero winding, and in vertical setting it read as "В". Changed to fill part by part.
- The ground slogan's baseline was first at y=1060, cutting off the lower half of the letters. It is now positioned by letter center with `translate(x, 990)`.
- The shadow under the cheekbones was too heavy in the first version; after halftoning it looked like a beard. Shadows in the grayscale source need half the α they would have in a flat fill.

**Still improvable**: More typical of Rodchenko is "figure photo + megaphone-shaped text cone". The steam could be replaced with a cone of red-and-black wedge-shaped letters radiating from the cup mouth.

---
