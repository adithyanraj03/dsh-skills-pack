# Migration test new transitions (A–D)

<!-- From migration test A -->
## Transitions (new block at the end of `transitions.js`)

| Transition | Enters | Method and parameters |
|---|---|---|
| `goldLeaf` 0.5s | Klimt | 72px squares. Order key = distance from the girl's head (1300,380) × 0.78 + azimuth × 0.12 + random × 0.08, so the gold leaf spreads in a spiral. For each tile q = (1.32p−key)/0.32: when q<0.5 a gold leaf drops into place from 1.3× with rotation, the gold gradient highlight moves with q, pressing spiral, eye-shaped, or concentric dark patterns; when 0.5<q<1 B shows through and the gold leaf fades out. |
| `screamWarp` 0.5s | Munch | The old picture is sine-warped per row, amplitude 70e. Wave front `y = lerp(−180, H+220, e) + 80sin(x·.0055 + 7p)` pushes from top to bottom, above the front is the new picture (warp amplitude 60(1−e) gradually settling). The front presses 4 bands of 26px: `#b82a1e #e2541c #f08a24 #f4c03a`. |
| `apsara` 0.5s | Dunhuang | Front `x = lerp(W+260, −300, e) + 110sin(y·.006 + 5p)` sweeps from right to left, the right side is the new picture. On the front, 3 ribbons (malachite green, earth red, azurite blue, widths 44/38/32, traveling wave, white dashed floral outlines). Left of the front, fragments of the old picture (pixel blocks taken directly from A) flip and fall along parabolas — that is "the old painting peeling". |
| `dotBloom` 0.48s | Kusama | 58px hexagonal grid, dots grow in order by distance from the cat (540,760) (outBack, up to 0.74× the spacing, exactly filling), inside the dots the new picture is clipped. Dots not yet grown have white outlines that gradually fade. |

---

<!-- From migration test B -->
## Transitions `transitions_b.js`

| Enters | Name | Method | Parameters | Per frame |
|---|---|---|---|---|
| Dalí | `melt` | The old picture sags per 4px vertical column (`sag = 0.22·edge·e`, and stretched 0.3); the new picture sits above the liquid line edge(x), where edge = overall falling line (−160 → H+40, easeInOut) + 26 round-headed droplets (width 10–32, length 60–280, profile `(1−u²)^0.3`, each with its own starting phase) + sin wave; the liquid line gets a dark edge (blur 3) + highlight | 0.36s | 86ms |
| Hopper | `sunShaft` | The old picture `multiply` cold green `rgba(70,120,110, 0.7·min(1,2p))` sinks into shadow; a diagonal light block (slope 260px) sweeps its right edge across the full screen, inside is the new picture + `screen` warm light (0.45 → 0 fading out over p 0.6–1) + a diagonal window-mullion shadow that travels with it; a bright edge at the front | 0.34s | 76ms |
| Ghibli | `bleed` | 5 color blooms open in t0 order (the window opens first), radius `q·1400·k`, q=easeInOut(seg(p,t0,t0+0.66)), boundary `R·(1 + 0.28·fbm(angle) + 0.05·sin 9a)`; outside, a 70px blur 18 bright halo (the water arrives first), inside is the new picture, edge 5px `multiply` brown water marks. Both the bright halo and the water marks α are multiplied by (1−q) | 0.38s | 127ms |
| Vaporwave | `vhs` | First half old, second half new; in the p 0.38–0.62 stretch, "field sync loss" rolls the whole frame up + a 40px black bar; tear bands of random height 6–54px taken from A/B (probability of taking B = p), horizontally offset ±130·sin(πp); magenta/cyan single-channel copies offset ±14 with `screen`; 160 snow lines | 0.30s | 88ms |

Common point: every transition is "the physical process of the new style", not a generic wipe — melting is liquid, Hopper is light, watercolor is water, VHS is magnetic tape. When designing, first ask: "In what physical way would this style's picture appear?"

---

<!-- From migration test C -->
## Transitions (`transitions_c.js`)

| Enters | Name | Method and parameters |
|---|---|---|
| Monet | `ripple` | (distance denominator 1700, fade-in starts at p>.7 to ensure the corners are clear at p≈.85) the old picture's 6px row strips are horizontally sine-offset, `dx=sin(0.045y−26p)·46·sin(π·min(1,1.2p))·(0.4+|y−cy|/H)`, as if the reflection were being stirred. The new picture is revealed by a clip made of 3600 **short horizontal brush ellipses** (length 40–110, height 9–17), rippling outward ring by ring by elliptical distance (y×1.9) to the cup (1000,600). At the front, 3 rings of light dashed ellipses, dashOffset following p; in the middle, 140 horizontal water-light lines flash. p>.85 adds a fade-in layer. |
| Seurat | `pointill` | Grid pitch 14: dots grow from 0 to r=6.4 (first 30%), the old picture under the dots fades to paper color. Each dot's color-switch time `0.5·(0.6x/W+0.4y/H)+0.25·hash+0.15`, top-left first, with randomness; at the instant of switching the dot scales 1.35× and "jumps". p>.6 the new picture develops under the dots, p>.7 the dots retract. Each frame needs one getImageData each for A and B. |
| Matisse | `cutouts` | A 1100px-wide cobalt blue paper (left and right edges are sin-irregular cut edges) sweeps from right to left, shadow (14,10) blur 12. On the paper are 260 gouache brush marks, pinned white/yellow seaweed (stem + 7 fingers), yellow/pink 6-point stars (rotating with p), red discs, each with a shadow. Right of the paper's right edge is already the new picture. |
| Haring | `radiant` | A V-posing dancing figure, scale `s=0.15·320^easeInOut(p)`, enlarging with the cup as origin. First "30px black stroke + black fill" draws the outer contour, then offscreen the limbs are filled white and `source-in` new picture, giving the new picture inside the body; the outer ring's 16 radiating lines jump at 8fps; p>.82 starts a fade-in. The first version's exponent was too slow (`0.08·40^…`, only 300px tall for the first 80% of the time, then a hard cut); the second version `0.15·120^…` still had a gap at the end, fixable only by an ~1-frame fade-in, and was judged a flash frame in review; the final uses `s=0.15·320^easeInOut(p)`. |

**General transition experience**:
- Transitions that need pixels (pointillism, water ripples) do getImageData on A/B every frame, about 10ms each time, acceptable.
- For "the new picture hidden inside a shape" transitions, once the shape is a union of multiple segments, do not `clip(union Path2D)`: inconsistent subpath winding cancels out into holes. Instead fill white offscreen, then `source-in`.

<!-- From migration test D -->
## Transitions (D section at the end of `transitions.js`)

| Transition | Signature of the new style | Method and parameters |
|---|---|---|
| `irisFilm` Rembrandt → rubber hose | 1930s cartoon iris in and out + old film | ①p<0.5: the old picture progressively gains `sepia(q) grayscale(0.7q) contrast(1+0.3q)`, the black iris closes to the cup rim (1236,420), R = R0·(1 − easeIn(q)), R0 = distance to the farthest corner ②p≥0.5: the new picture springs open per R0·outBack(q) ③the circumference in 48 segments, ±1.5% hand shake at 12fps ④film flicker, scratches, dust layered throughout |
| `lampGlow` rubber hose → shadow puppet | backstage lamp lighting up | ①old picture multiply rgba(70,34,12, min(1, 2.2p)), darkening as if the lamp went out ②new picture revealed with a destination-in radial mask (solid inside 0.55R, transparent at the outer edge), R = 1500·inOut(seg(p, .12, 1)), with lamp-flame jitter ±7% ③lighter warm halo sin(πp) plus a small flame |
| `flareSweep` shadow puppet → Shinkai | light leak, light sweep | A diagonal (k=0.35) dividing line sweeps from −500 to W+700 (inOut). Left is the new picture, right is the old. On the dividing line, 3 layers of lighter light bands: width 520 α0.55 warm, 160 α0.85 white, 60 α0.6 cyan. Also horizontal threads, 40 light particles, 3 hexagonal light spots |
| `blueBrush` Shinkai → Blue Period | color drained away + broad dry brush | ①old picture `color` blend with rgba(45,90,148, min(1, 2.2p)), only blue remains; then multiply to darken ②6 broad strokes (each H/6+90 tall) alternately tilted ±18, brushing from left to right in sequence, start times staggered by 0.07. The brush head is a quadratic curve, top and bottom edges with 6–7px sine jitter ③within 80–280px behind the brush head, 26 dark/light gradient bristle lines (the paint is not yet brushed even) |

General steps for transition design (suggest writing into doc 02 layer 3): find the physical process in the new style that would "appear, light up, sweep across" → use it to first "contaminate" the old picture → the new picture emerges from the shape of that process → overlay a brief highlight or overshoot at the beat.
