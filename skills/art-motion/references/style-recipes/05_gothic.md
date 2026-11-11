# 05_gothic · 1290 Gothic illuminated manuscript

11–22ms per frame (median 12ms). The static layer + gold-leaf mask are built once inside `init()`.

## Pipeline
1. Static layer `goth_static` (cached): parchment → gold leaf → diamond-lattice embossing → gable, pinnacles, side columns → pointed-arch window and stained glass → table, throne → Latin text column → marginal knight.
2. Gold-leaf mask `goth_mask`: for every pixel of the static layer compute "goldness" `clamp((r-b-70)/50)·clamp((g-b-30)/40)·clamp((r-140)/40)` and use the result as alpha. Parchment (236,223,194) has r−b of only 42, so it is excluded; the pink band has a high b value and is excluded too. **There is no need to redraw the gold shapes as a mask** — every gold area gets swept by the highlight automatically: background, illuminated initial, gold orb, gable finial.
3. Each frame, draw in order: stained-glass twinkle → diagonal highlight → four-point stars appearing where the highlight passes → vine ornament → snail → running mouse → cat → girl → grain.

## Gold-leaf texture (the "fine texture + highlight" the spec calls for)
- Per-pixel shading: `f = 0.52 + fbm(x·.0035)·0.42 + horizontal polish grain noise(x·.004, y·.09)·0.5 + upper-left light + grain ±0.05`, then interpolate between the three colors goldLo #9c6a1a / gold #d9a63a / goldHi #f8de86. The polish grain's y frequency is more than 20× its x frequency, so it reads as horizontal brushed metal.
- Diamond lattice: 46px pitch, two families of diagonals (x+y and x−y each constant). Each line is drawn twice: once as a dark line, once as a bright line offset 1.2px, so it looks incised into the gold. Each diamond center is embossed with 4 dots, bright at upper left, dark at lower right.
- Every 118×125px draw a very faint square seam, imitating sheets of gold leaf applied one by one.
- Diagonal highlight: first draw a linear gradient band on a 920px-wide scratch, slope K=0.45 (the "/" direction). Multiply in the mask with `destination-in`, then composite back with `lighter`, α0.62. **Move at constant speed** `x = lerp(150,1650,(lt-0.08)/1.15)`. The first version used inOut easing, and by 0.9s the highlight had already swept out of the gold region, so nothing was visible on the girl; with constant speed it reaches the window at 0.3s and passes exactly over the girl at 0.9s. The halo and the 11 fixed points are tested with `|u − sweepX| < 70` and emit a four-point star flash as the highlight passes.

## Motif animation (all visible within the 0.25–1.4s window)
- Vines: two stems of about 120 points each, every point given a `sin(t·2.1+i·.09)·2.5` sway. Every 3–5 points hang a three-lobed ivy leaf (cycling blue/red/gold) or a gold orb with 3 tendrils. Leaves swing around the attachment point by `sin(t·3.1+k·1.7)·0.28`. The first version used 0.85 for leaf scale — too small and too sparse; only after changing to 1.05–1.45 did the density approach the original.
- Stained glass: 26 random points; when `sin(t·5+h·40) > 0.6`, light a blob of white radial light.
- The cat lifts one front paw holding the mouse by the tail; the mouse swings like a pendulum `0.32·sin(t·5.5)`, its little legs kicking. The snail crawls left at 62px/s, antennae wobbling; the mouse under the text column runs 360px in 0.12–1.17s, legs swinging 40 radians per second.
- Following the shared choreography, the girl raises the gold cup; a four-point star twinkles on the rim, and the steam above the cup is drawn with fine ink lines.

## Characters
- For the girl, take `RIG.girl`'s Path2D directly and draw it yourself in order; **do not call `RIG.drawGirl`**, for two reasons: drawGirl always draws a mug with a handle; and the cloak and halo must be inserted between specific layers. Draw order: halo (centered on headC offset (16,−22), r=114, red ring plus 36 embossed dots) → wavy long golden hair → red robe (fine gold vertical stripes every 20px, a gold hem along the skirt) → blue cloak (anchored on nape/back, with gold edging) → head → gold chalice.
- The cat is made into the manuscript's "human-faced cat": the face is a cream ellipse, almond eyes with pupils squeezed to the right giving the girl a sidelong glare, thickened upper lids, raised brows, downturned mouth corners, flushed cheeks. Only `legs[0]` is used; the other front leg is drawn by hand with `RIG.limb` in a raised pose.
- Latin body text uses UnifrakturMaguntia 44px. At 50px it would push "cum poculo suo" off the right edge of the frame. The sentence-initial Cattus/Nemo/Mus are vermilion — the medieval rubrication practice.

## Pitfalls
- The scratchpad is shared with the other era authors, and `check.py` was once overwritten by someone else. Put self-check scripts in your own subdirectory.
- If the motion difference image uses lt=0 as the baseline, it gets polluted by the engine's camera impact in the first 20 frames (1.03 scale). Take the baseline at lt≥0.35.

## v2 tweaks
Vine swing ×2, leaf swing 0.42; stained-glass sparkle points 40; gold-leaf highlight α0.85, highlight band widened. Static-segment frame difference 1.10 → 1.32 (original 1.64).
