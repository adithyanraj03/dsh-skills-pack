// S03 → S04 entry transition (Vox "pull out from a single photo → reveal the whole collage"):
// the old frame turns in place into a halftone photo lying on the desk — at p=0 the photo's inner frame exactly fills the screen (= the old frame as-is), then the camera pulls out on a long ease and the desk, clippings and red thread come into view;
// the old frame is run through a 45° halftone screen and overlaid with old-paper tone every frame, and at p=1 it matches the photo cached in the s04 section pixel for pixel. Both the camera and the halftone screen live in spacex/scenes/s04.js (S04X).
TRANSITIONS.deskPullOut = (c, A, B, p, o) => { c.drawImage(B, 0, 0); S04X.photoLive(c, A, o.lt, p); };
