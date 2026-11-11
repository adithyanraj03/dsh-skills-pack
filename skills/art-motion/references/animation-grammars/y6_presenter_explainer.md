# Y6 · Presenter-style financial explainer

A cartoon presenter strings information together across paper, charts and keywords. Good for business history, product mechanics, and knowledge explainers with an emotional reaction. Reference code is in `scripts/engine/reference_films/spacex/spacex_lin/`; this is the 9th grammar card, currently with no standalone parametric clip and no character sprite attached.

## Before you start

- Storyboard the layouts first: side-on presenting, full-frame numbers, side-by-side comparison, the character entering the chart, reaction close-up. Don't fix person-left/chart-right for the whole film.
- Frame generation should prepare at least two shot sizes, full body and bust; sitting and leaning need the real corresponding frames.
- The first `cast` keyframe of each section gives `x` and `s` explicitly, preventing regression from cross-section inheritance.
- Nested drawing uses `*=` for opacity, preserving the outer fade.
- The top-bar year, subtitles and section titles read the same time source.
- Run `qa.py` text framing checks on the first version; run `subzone_gate.py` again on a light-ground film with no subtitles.

## Frames and motion

The character uses AI-generated frames, with code controlling the foot anchor, position, size and frame swapping. Pose cuts are hard with a slight pop, avoiding the dissolve of different silhouettes into a double image. Talking and closed mouth switch on the VO timing; the mouth stops during pauses, and walking uses full gait frames. Pose heights are aligned by the median; reaction close-ups use bust material, rather than blowing up a whole-frame screenshot.

Numbers settle when the VO says them. During the count, don't pre-empt with assertions like "over" or "+"; the emphasis circle appears after the number settles. Leave the pause after the highlight in the script and VO stage.

## Reference implementation

`common.js` provides `presenterFrame`, `drawFigure`, `hud`, `yearAt`, `popK` and `L.cast`. `prep_presenter.py` demonstrates frame swapping and the foot anchor. The transition `transitions/lin_page.js` only turns the page; the presenter and top bar can continue across pages.

Known limits: the figure covering text, and the character being cropped by a push, still need eyeball review; the whole-frame bitmap push in the reference code crops easily, so new films should prefer the scene camera. Material and VO have to be supplied by you; this card can't be used directly as a complete film template.
