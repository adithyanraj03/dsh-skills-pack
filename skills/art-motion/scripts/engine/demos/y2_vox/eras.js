// Demo · Vox-style collage explainer "How AI Learned to Recognize Cats" (8s, three shots). Grammar card: references/animation-grammars/y2_vox.md
//   Preview index.html?film=demos/y2_vox   Render render.py --film demos/y2_vox --out y2.mp4
// One big desk = the world; the camera pushes and pans smoothly at 60fps, while the paper scraps / highlighters / red pen / typing on the desk step at 12fps.
window.PUNCH = 0;
window.SCENE_LIBS = ['demos/_shared/hero.js', 'demos/y2_vox/vox.js'];
window.ERAS = [
  { id: 'y2_s1', dur: 2.6 },                                                 // Clipping + halftone photo: highlighter sweeps the lines, red pen circles a word, camera slow push
  { id: 'y2_s2', dur: 3.3, transition: { type: 'same', dur: 1.1 } },         // Pan along the red string to the investigation wall (same desk, camera moves continuously)
  { id: 'y2_s3', dur: 2.1, transition: { type: 'cut', dur: 1 / 60 } },       // Push into the small photo → hard cut to a large scan of the same image, then pull out to reveal the black-background collage
];
