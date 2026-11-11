# New style demo redo progress (from 2026-10-16, protocol see doc 16)

Old scenes (2026-10-15 version) are backed up in `_archive/scenes_20261016/`. Redone new scenes overwrite `scripts/engine/scenes/<id>.js` directly, same id, same `--film style_studies`.
The original reference works themselves are not checked in (rerun `fetch_reference.py` when needed); overview images and side-by-side images are in `assets/new-styles-v2-evidence/`, so later people can review and score.

Self-scores are for sorting (protocol step 6); taste items go to Huashu (the author).

| id | Style | Status | Self-score | Independent review | Current shortfall (surpass first next round) |
|---|---|---|---|---|---|
| 38 | Giotto | Research recipe (after character redo) | ~70 | ~53 (first round) | three figures' outlines pulled apart (different robe widths), hands changed to palm + fingers, both hands truly support the box during the handoff; still lacks crowd density, plaster too grainy |
| 42 | Guardi | Research recipe (v2 demo done, not independently reviewed) | ~78 | — | tower brushstrokes read as stacked bricks; figures are silhouette only; lacks flickering white dots |
| 46 | Pissarro | Research recipe (v2 demo done, below 80) | ~75 | ~58 | tree crowns like cauliflower, trunks like palms; figures got small hats but faces still simple; the tree blocking the church has been removed |
| 47 | Sisley | Research recipe (v2 demo done, below 80) | ~80 | ~68 | houses like flat boards, windows become black blocks; poplars like seaweed; fixed the left-edge gap, telegraph poles, cargo changed to burlap sacks |
| 48 | Gauguin | Research recipe (after the woman's head was redrawn) | ~74 | — | woman changed to profile + tall white hat crown + white shawl collar, calf given spots; boy still too simple, tree trunk volume too large |
| 50 | Ma Yuan | Research recipe (v2 second round, closest to 80) | ~78 (second-round self-score, not independently reviewed) | ~74 (first round) | axe-cut strokes changed to short wide wedge strokes but still too dense; trunk uses one continuous thick line (segmented read as bamboo joints, polygonal axe-cut read as arrows, two experiments abandoned); signature has only the seal; qa timed out loading due to high machine load, so confirmed via stills at multiple times that there are no errors and there is motion |
| 51 | Persian miniature | Research recipe (after character redo) | ~72 | ~63 (first round) | characters changed to Safavid style: slender, small head, tall turban with a red crown rod, waisted long robe, scattered small flowers; the reader is too small, face expressionless |
| 52 | South Park-style paper cutout | Research recipe (v2 demo done, below 80) | ~75 | ~63 | fixed: single file boarding in order without overlap, station sign no longer blocked, hat color close to Cartman replaced; still an original-series-title-sequence-style subject |
| 39–41, 43, 44 | Piero, Raphael, Michelangelo, Lorenzetti, Cortona | Not redone | old ~35 | — | 39/40/43/44 use the mural channel (but the mural channel currently has only 38 as one example, itself only ~53, do not treat as mature capability); 41 needs sculptural figures |
| 45 | Renoir | Research recipe (after character redo) | ~72 | — | characters changed to slender builds (narrow shoulders, cinched waist, bell skirt, small head, curved arms), foreground couple waltzing in an embrace (woman in front); background crowd still small and lined up too evenly; lacks the original's pastel skin glow |
| 49 | Chagall | Not redone | old ~40 | — | memory space: floating, tilting, emotional color blocks |
| 53 | Pixar | Not redone | old ~55 | — | material and subsurface light; three.js route |
| 54 | Ghibli direction | Not redone | old ~45 | — | clouds, wind, watercolor background density |

"Independent review" comes from a review agent that did not take part in production on 2026-10-16, scoring per the doc 16 rubric (its full report was not saved; the key points are absorbed into the table above and the protocol). Self-score and review differ by 7–17 points; take the lower. **None reached 80, so all are written as "research recipe", not registered as implemented** — this is the protocol's own step-6 rule.

Evidence (overview image, six side-by-side original comparisons): `assets/new-styles-v2-evidence/`.

## How to do the next round (copy the flow that worked this round)

1. `fetch_reference.py` pull 3 original works → look at the contact sheet → write 5 signature points (must have / bonus / taboo).
2. Re-determine the subject per the style's own composition rules; form layer → `lib/medium.js` channel.
3. One frame first → `side_by_side.py` side by side → score. At most two rounds.
4. When done, add to this table, and change the recipe card's "Status" and "Still improvable" to measured conclusions.
| 43 | Lorenzetti | Research recipe (v2 three rounds, after character redo) | ~72 | — | characters changed to slender long robes, 3/4 profile, with a 20-person crowd; still lacks the original's paint-layer thickness and perspective depth; only two different originals |
| 40 | Raphael | Research recipe (v2 one round, characters reuse figure) | ~70 | — | perspective coffered vault and checkerboard floor established, three groups' hands and eyes interlocking; characters still bell-robed, faces identical; lacks the original's skin tone and fabric sheen |
| 41 | Michelangelo | Research recipe (v2 two rounds, red-chalk drawing route) | ~70 | — | S-curve twist, long arms, scapula/latissimus shading established; head still too round, lacks hand detail; paper-white highlights could be stronger |
| 44 | Cortona | Research recipe (v2 three rounds: cloud mass redone) | ~70 | — | frame + gold roundel + central radial golden light + cloud mass + crowd rotation + red and blue drapery bands established; characters still bell-robed, lacks Baroque strong foreshortening and strong chiaroscuro; cloud highlight arcs too cartoonish; only two different originals |
