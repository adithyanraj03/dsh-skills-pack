# SpaceX voiceover animation reference code

Contains scene-code snapshots for four modes of expression: hybrid style, whiteboard, Vox collage, and presenter. It is for learning and transferring camera, keyword timing anchors, and layout methods; it is not a complete, render-ready demo, and it does not represent the complete project behind the latest public film.

- `spacex/tm.js`: `TM.cue(segment, 'script substring')` attaches an action to a voiceover keyword; `timing.js` is the timing data for this example and must be replaced for a new subject.
- `spacex_wb/common.js`: content framing `fit/declip/shot`, stroke scheduling `build`, stroke-order reveal `so/soAt`.
- `spacex_vox/common.js`: cumulative desktop `item/drawWorld/camEnd`, insert shots, occlusion registration.
- `spacex_lin/common.js`: presenter frame swapping, foot anchors, cross-segment poses, and the top bar; `tools/prep_presenter.py` demonstrates green-screen frame extraction.
- `eras_*.js`: four segment tables; `transitions/`: matching transitions.

## Usage boundaries

1. First copy the parent `scripts/engine/` into your own project, then place the selected film directories, segment tables, and transitions from here in the corresponding locations at the project root. Keep the whiteboard segment table's filename as `eras_wbx.js`; all actual asset paths are under `spacex_wb/`.
2. The presenter sprite, hybrid-version character frames, source image-generation prompts, and voiceover audio are not distributed with this snapshot. `presenter_meta.js` only provides the frame-table structure; regenerate assets and metadata with your own character. An existing frame table does not mean the assets exist.
3. Fonts use the parent project's `lib/fonts.js` and bundled fonts; the Vox body text and typewriter numerals have already been switched to the bundled LXGW WenKai and CMU respectively, so no extra fonts are missing. The preprocessing scripts require `numpy` and `Pillow`; to run `make_hand.py`, first prepare your own `hand_raw_1.png` through `hand_raw_3.png` in its directory.
4. The example text and numbers here are historical creative material, not up-to-date SpaceX factual material that can be cited directly. New work must independently verify the script and rebuild the voiceover timeline.
5. If you only want to run a complete demo first, use the parent `demos/` or `clips/`; do not start from this directory.

## Third-party stroke-order data

`spacex_wb/assets/strokes.js` is taken from the stroke medians of hanzi-writer-data 2.0.1 / Make Me a Hanzi; only the `medians` arrays for the characters used in the example are kept and wrapped as browser variables, and the original glyph outlines are not included. This derived data remains under the Arphic Public License; the license text is in `ARPHICPL.TXT` in the same directory, and it is outside this repository's MIT license.

Upstream: https://github.com/chanind/hanzi-writer-data/tree/v2.0.1
Original data project: https://github.com/skishore/makemeahanzi
License text: https://github.com/chanind/hanzi-writer-data/blob/master/ARPHICPL.TXT
