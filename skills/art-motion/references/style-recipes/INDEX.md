# Style master index (36 existing implemented styles + 16 research recipes, updated 2026-10-15)

> **Read this sentence first: the 35 sample films share one composition** (window upper left, cat lower left, girl at right holding a cup; `assets/all-styles-overview.jpg` too). That is the mechanism of the Art History Speedrun film — the style changes, the scene does not — not the composition of these styles. For a new subject, re-compose for the subject: the renderer, brushwork, color logic, and motif motion from a card can be taken; the coordinates, characters, and furniture in the room should not be carried over.

When choosing a style, look at the status and category tables below first, then open the corresponding card. "Quality" is the current implementation level (★★★ recognizable at a glance, directly usable; ★★ recognizable but with obvious shortfalls; ★ needs redoing), not the difficulty of the style itself. The shortfall is exactly what to surpass first the next time you do this style.

Styles are layered in two. **Material layer**: the treatment of brushwork, material, light, and color, which can cover any subject (product, data, story all work). **Era specimen**: the current samples make the era or artist motif very prominent; direct borrowing suits speedruns, time travel, homage; moving to a new subject should re-distill the visual language and composition, not treat the sample's limits as the artist's own limits. When unsure, put it in the material layer; when one style touches both (e.g. Hopper's hard-edged light blocks are a transferable lighting treatment), judge by how you use it.

## First look at status and migration scope

New research cards come with a single-scene engineering trial (`--film style_studies`), watchable, but they have not passed style-fidelity and cross-scene validation; the star ratings of the existing cards below do not apply to them. For first cross-subject use read the [doc 15 method](../15-cross-scene-style-distillation.md). Material layer / era specimen is the organizing mode of the existing samples, not a permanent limit on the subjects an artist's overall style can carry; whether it transfers is validated by the new scene. Content and fixed coordinates in famous works do not enter the style definition.

## New research recipes (17; redone one by one per the doc 16 protocol since 2026-10-16)

**Redo status**: 38 Giotto, 42 Guardi, 45 Renoir, 46 Pissarro, 47 Sisley, 48 Gauguin, 50 Ma Yuan (马远), 51 Persian miniature, 52 South Park have been redone per the [doc 16 protocol](../16-style-demo-95-protocol.md) (original-work anchoring + `lib/medium.js` medium channel). Self-score 65–82, independent review 53–74 (42, 45 not reviewed), **none reached 80, so all still count as "research recipes", not implemented**, taste items await Huashu (the author)'s review; the other 8 are still the old 10-15 trials (quality about 35–55, do not treat as usable implementations). Progress and each one's shortfalls are in [_redo-progress](_redo-progress.md). Old versions are backed up in the skill root `_archive/scenes_20261016/`.

| Card | Research scope | Implementation status |
|---|---|---|
| [38_giotto](38_giotto.md) | Giotto: mass and narrative relationship | Research recipe; single-scene prototype exists |
| [39_piero](39_piero.md) | Piero: geometric order and clear volume | Research recipe; single-scene prototype exists |
| [40_raphael](40_raphael.md) | Raphael: harmonious organization and natural connection | Research recipe; single-scene prototype exists |
| [41_michelangelo](41_michelangelo.md) | Michelangelo: sculptural quality and pose tension | Research recipe; single-scene prototype exists |
| [42_guardi](42_guardi.md) | Guardi: air, broken light, and loose edges | Research recipe; single-scene prototype exists |
| [43_lorenzetti](43_lorenzetti.md) | Ambrogio Lorenzetti: readable social space | Research recipe; single-scene prototype exists |
| [44_cortona](44_cortona.md) | Pietro da Cortona: Baroque mass and flowing groups | Research recipe; single-scene prototype exists |
| [45_renoir](45_renoir.md) | Renoir: interwoven warm and cool, figures with warmth | Research recipe; single-scene prototype exists |
| [46_pissarro](46_pissarro.md) | Pissarro: the flow of life and figures within the environment | Research recipe; single-scene prototype exists |
| [47_sisley](47_sisley.md) | Sisley: air, weather, and coherent landscape | Research recipe; single-scene prototype exists |
| [48_gauguin](48_gauguin.md) | Gauguin: flatness, contour, and symbolic color | Research recipe; single-scene prototype exists |
| [49_chagall](49_chagall.md) | Chagall: memory space and emotional color | Research recipe; single-scene prototype exists |
| [50_ma_yuan](50_ma_yuan.md) | Ma Yuan: offset center of gravity, negative space, refined brushwork | Research recipe; single-scene prototype exists |
| [51_persian_miniature](51_persian_miniature.md) | Persian miniature: layered space and precise narrative | Research recipe; single-scene prototype exists |
| [52_south_park](52_south_park.md) | South Park: digital paper cutout and limited performance | Research recipe; single-scene prototype exists |
| [53_pixar](53_pixar.md) | Pixar: a style family of form, material, and performance | Research recipe; single-scene prototype exists |
| [55_dunhuang](55_dunhuang.md) | Dunhuang (敦煌) mural (Northern Dynasties): mineral colors and flying lines on a dry mud wall | Research recipe; single-scene prototype exists (v1, ~72) |

Ghibli is not a new count: [25_ghibli](25_ghibli.md) keeps the original watercolor-background implementation and adds overall visual and performance research; the latter cannot borrow the old scene's measured results.

## Material layer (can cover any subject)

| id | Style | Core renderer / method | Motif motion (how the picture comes alive) | Signature transition (entering it) | Quality | Current shortfall |
|---|---|---|---|---|---|---|
| 09_postimp | Van Gogh | flow-field brushstrokes in three passes (wall vertical-long / ground perspective / the rest) + regional palette + outline; prop layer; visibleLines supplementary lines | starry-sky vortex, lamp halo ring expanding outward, direction field flickering like flames, vortex cat | starry-sky vortex pulling in | ★★★ (benchmark) | heaviest at 120ms per frame |
| 08_impressionism | Impressionism | regional pastel palette short strokes (fixed positions), fine brushwork for the window scene | light spots drift and flicker, poppies sway, clouds move, ribbons flutter | brushstroke color dots tile the whole screen | ★★ | face and hands broken up by strokes |
| 29_seurat | Seurat pointillism | optical color mixing: 21-color pure palette juxtaposed by ratio, complementary-color dots, equal-size dots | light bleeding, dots breathing | the picture crystallizes into round dots | ★★ | too static; grid too regular |
| 25_ghibli | Ghibli (existing watercolor background + overall language research) | watercolor wash (transparent layered color + water-mark edges), cel crescent shadow | gauze curtain billowing in the wind, grass blades swaying in sheets, tree-shadow light spots | wet paper blooming | ★★ | characters weaker than the background |
| 17_ink | Chinese ink xieyi | brush-tip flying white, ink-bleed blur spreading, negative space, seal stamp | opening strokes write themselves, ink bleed spreads, shrimp antennae move | (opening in the speedrun) | ★★ | characters not xieyi enough (review 6/10) |
| 13_pop | Lichtenstein pop | Ben-Day dots via createPattern, thick black outline | Warhol four-panel color swap, thought dots blinking, cat wiggling its hips, onomatopoeia box shaking | lightning + halftone | ★★★ | — |
| 14_8bit | 8-bit pixel | 240×135 per-pixel, 14-color palette, 1px black edge on parts | tail, HUD heart blinking, question block bumping out coins (15–30fps stepping) | pixel blocks zoom in and out | ★★★ | cat head pressed against the windowsill |
| 26_vaporwave | Vaporwave / cyber neon | neon two-color glow, perspective grid, VHS channel-separation post, path-drawn neon-tube kana | sunset bars moving up, grid rolling forward, sign blinking, tracking noise band | VHS tearing + rolling up | ★★★ | part seams glow too |
| 35_shinkai | Shinkai light and shadow | cumulonimbus, Tyndall light shafts, cel hard shadow bands, glow | light particles drifting, clouds moving | diagonal light sweep | ★★ | interior background density insufficient |
| 32_rembrandt | Rembrandt chiaroscuro | lighting map multiplied over the whole frame, window light + candlelight | dust motes in the light shafts, cloud shadows dimming the window light | old-film iris in and out | ★ | characters flat (review 5/10), most in need of redo |
| 11_cubism | Analytical Cubism | translucent gradient planes stacking space, facet cutter (triangles not clipped), Picasso-style two-viewpoint face | CAFÉ letters jumping/swapping, window-pane facets sliding, newspaper trembling | geometric fragments misaligned and reassembled | ★★ | too bright, dark brown large planes insufficient |
| 30_matisse | Matisse paper cutout | irregular scissor edges, pinned-paper shadow, saturated flat fill | paper pieces fluttering, seaweed swaying | blue paper with pinned cutouts sweeps across | ★★★ | gouache brush marks too heavy |
| 16_2026 | Contemporary flat illustration | grain stipple density function, no-outline color blocks | character performance (jump / clink cup / shatter / gasp / sign), damped secondary motion | three-color concentric ring aperture | ★★★ | — |
| 22_constructivism | Russian Constructivism (narrow use) | grayscale photo halftone (variable dot size 45°), red wedge black circle, path-drawn Cyrillic block letters | slogan stamped letter by letter then waving/jumping | (B film opening) | ★★★ | lacks a megaphone-shaped text cone |
| 12_bauhaus | Bauhaus (narrow use) | pure geometric composition, Schlemmer figure joint discs | pointer rod rotating steeply, Mondrian grid color swap, cat batting a ball | red-yellow-blue geometry rotating and enlarging | ★★★ | cat head off the skeleton position |
| 04_roman | Pompeii mosaic (narrow use) | distance field placing stones along contours, weighted L∞ Voronoi mortar, layout computed once with color flowing through each frame | wave-pattern border flowing clockwise, Vesuvius smoking and spitting sparks | mosaic tiles flipping over and spreading from the cat | ★★★ | few facial details at small scale |
| 15_raytrace | Early ray-traced CGI (narrow use) | uniform plastic shading, per-pixel checkerboard reflection, chrome ball environment mapping | purple ring rotating, lens flare, cat eyes glowing green | green wireframe → scanline render | ★★ | cat legs straight columns, face like a mask |

## Era specimens (suitable for speedrun, time travel, homage)

| id | Style | Core renderer / method | Motif motion (how the picture comes alive) | Signature transition (entering it) | Quality | Current shortfall |
|---|---|---|---|---|---|---|
| 01_cave | Cave rock art | noise relief rock wall + charcoal-dot fuzzy edges + ochre soaking into the rock face | animals running with two alternating poses, firelight flickering, embers | (opening) | ★★★ | human figure too cartoonish, not primitive enough |
| 02_egypt | Egyptian tomb mural | profile face with frontal eye convention, flat fill with fine outlines, 24 hand-written hieroglyphs | scarab pushing the sun, Aten rays' small hands opening and closing, hieroglyphs rewritten stroke by stroke | tapestry vertical strips falling and bouncing back | ★★★ | elbow holding the cup a bit stiff |
| 03_greek | Attic black-figure | black silhouette + terracotta incised lines + purple-red band with white dots | meander band scrolling in reverse, boat rocking and dolphins leaping, lyre swaying | pottery vase roller turning the face | ★★★ | skirt hem too thick |
| 05_gothic | Gothic illuminated manuscript | per-pixel gold leaf (brushed + embossed 1px offset bright lines), goldness mask highlights | diagonal highlight sweeping across the gold leaf, vines swaying, snail crawling, mouse running | parchment page turn | ★★★ | blonde hair looks like a hood |
| 06_renaissance | Renaissance sfumato | whole-layer light blur + high-opacity sharp layer, craquelure / canvas weave / yellow varnish | da Vinci ornithopter flying past, broken light on the river, floating dust | divine light from the window | ★★ | cat too cartoonish; overall too static |
| 10_nouveau | Mucha Art Nouveau | variable-width paths (thick outside, thin inside), misaligned silhouette underlay | sun rising, halo rotating, flowers swaying, S-shaped heat, wavy curls | gold-edged organic shape growing | ★★★ | cat pose stiff |
| 18_klimt | Klimt Golden Phase | reuses Gothic gold leaf, spiral/eye motifs, realistic face with flat gold robe | eye motifs on the robe blinking in turn, gold flakes drifting | gold leaf spreading in a spiral from the head | ★★★ | hand on the table doesn't connect to the sleeve |
| 19_munch | Munch Expressionism | long curved streamline brush (20–30 steps along the flow field), per-row sine warp of the whole world | the whole painting writhing, blood-red sky flowing | Scream color band pressing down from the top | ★★ | wall once read as Van Gogh |
| 20_dunhuang | Dunhuang mural | earth-red ground mineral colors, peeling spots (background only), saturation fading | apsara ribbons, ceiling streamers, lamp flames | ribbon sweeping past, old painting peeling and falling | ★★ | apsara figures crude |
| 21_kusama | Kusama polka dots | hand-drawn irregular circles, hexagonal grid modulo the real period | dots expanding and contracting ring by ring from the cat, pumpkins, infinity mirror room | dots growing out of clip onto a new picture | ★★★ | figures same color as the wall, held only by the outline |
| 23_dali | Dalí surrealism | melting clock deformation, long shadow shear affine | clocks flowing down, long-legged elephants walking, ants circling the watch, shadows lengthening | new picture flowing down with round-headed droplets | ★★ | figures lean vector illustration |
| 24_hopper | Hopper American realism | two-version light/shadow cutout (bright/dark version clipped by light blocks), hard-edged light patches | light patches slowly moving across the face, figures' shadows on the wall drinking tea in sync | hard-edged sunlight sweeping across | ★★★ | cat in shadow the whole time |
| 27_kirby | Marvel Kirby cosmic era | four-color halftone, misregistered color, black-block shadows with feathered hatching, krackle energy dots | onomatopoeia lettering, paneled cat-eye close-up, energy dots | (C film opening) | ★★ | more like Lichtenstein, lacks Kirby perspective and block hands |
| 28_monet | Monet water lilies and Japanese bridge | short-stroke water reflections, light trembling on the water | water lilies drifting, willow shadows swaying, ripples spreading | water waves rippling outward | ★★ | wall is pond water, floor is wood — awkward space |
| 31_haring | Keith Haring | thick black uniform-width lines, radiating action lines | figures dancing in 8fps hard cuts, everything bouncing to the BPM | dancing figure enlarging, new picture inside the body | ★★★ | girl not Haring enough |
| 33_rubberhose | 1930 rubber-hose cartoon | pie-cut eyes, noodle arms, white gloves, 12fps stepping, film scratches and flicker | everything bouncing to the beat | (old film before the backstage lamp lights) | ★★★ | most of the motion is film noise |
| 34_shadowpuppet | Chinese shadow puppet | translucent ox-hide openwork, rivet joints, 10fps stepping, backstage oil lamp | rods operating stiff joints, wrist flicking | backstage lamp lighting up | ★★★ | overlaps multiply and go black; 121ms a bit slow |
| 36_picasso_blue | Picasso Blue Period | monochrome blue tonality, broad brushstrokes, Prussian blue thick outline, elongated bodies | slow breathing | colors drained to blue then a broad brush sweeping across | ★★ | forms not melancholy enough |
| 37_rick_morty | [Rick & Morty](37_rick_morty.md) | SVG rounded dark-gray thin outlines, flat fill, mottled background | holding the cup, blinking, gaze, tail swaying | determined per narrative | ★★ | independent SVG preview/render, not in the old 35 Canvas gallery; no walking rig |

## Quality distribution of the 36 existing implementations and next steps

- ★★★ 20, ★★ 15, ★ 1.
- **The most common shortfall is characters**: backgrounds pass through the style renderer and look like that style, characters only use vector skeleton flat fills and look pasted on (positive experience item 8). The next quality round should start with "characters also pass through the same renderer / are reshaped per that style": Rembrandt, Picasso Blue, ink, Ghibli, Dalí, Marvel.
- Transition collection: `_transition-migration-test.md` (A–D, 19 new) + notes inside each card.
