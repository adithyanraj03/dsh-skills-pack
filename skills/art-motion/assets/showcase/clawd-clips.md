# Clawd: Night at the Museum · GIF Clips

Cut directly from the 98-second finished film *Clawd: Night at the Museum* v2. The complete film (MP4, with score) is in Releases. This directory does not include that film's project.

- `clawd-vangogh.gif`: 00:28.40–00:33.40, 5 seconds, 720×405, 15fps. Jumps into Van Gogh's *Wheat Field with Cypresses* → an impasto Clawd runs through the wheat.
- `clawd-trex.gif`: 01:20.50–01:24.50, 4 seconds, 640×360. A T. rex skeleton chases a flashlight spot the way a cat chases a laser dot.
- `clawd-dawn.gif`: 01:34.00–01:38.00, 4 seconds, 640×360. Dawn breaks, the guard sets down the coffee, and Clawd in a picture frame blinks once.

Export settings are the same as the Mario set: original speed, 20fps, silent, infinite loop, an independent 192-color palette per clip, Bayer dithering, then `gifsicle -O3` optimization. The Van Gogh clip's impasto brushstrokes are too dense: with these settings it came to 12.5MB, so it was changed to 15fps, 160 colors, and `gifsicle --lossy=40`, bringing it down to 7.7MB.

## What the film uses

- Style: charcoal night scenes on dark brown paper, with color appearing only where the flashlight falls; when entering a painting, the style changes to that painter's own brushwork.
- The five paintings Clawd enters: Van Gogh's *Wheat Field with Cypresses* (Met 436535), Seurat's *Circus Sideshow* (437654), Vermeer's *Young Woman with a Water Pitcher* (437881), Rembrandt's *Aristotle with a Bust of Homer* (437394), and Leutze's *Washington Crossing the Delaware* (11417). All are from The Metropolitan Museum of Art's Open Access collection, `isPublicDomain: true` (CC0).
- The dinosaurs and elephant herd are charcoal line drawings based on real skeletons and anatomy; the guard appears only as hands and a shadow, and the code does not draw a face.

## Copyright

Clawd is the Claude Code mascot of Anthropic, and rights to the character belong to Anthropic. This film is an unofficial fan demo and is not affiliated with Anthropic; the GIFs and the finished film are only for showing what this skill can do and are not covered by the repository's MIT license.
