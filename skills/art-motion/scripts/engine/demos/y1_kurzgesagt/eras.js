// Demo · Kurzgesagt-style flat explainer "How AI Learned to Recognize Cats" (8s, three shots). Grammar card: references/animation-grammars/y1_kurzgesagt.md
//   Preview index.html?film=demos/y1_kurzgesagt   Render render.py --film demos/y1_kurzgesagt --out y1.mp4
// Shots are cut to the voiceover, dur in seconds; explainers should not punch on the beat (PUNCH = 0). All camera motion is computed by time inside the scene (CAM); transitions only decide how A and B join.
window.PUNCH = 0;
window.SCENE_LIBS = ['demos/_shared/hero.js', 'demos/y1_kurzgesagt/kurzgesagt.js'];
window.ERAS = [
  { id: 'y1_s1', dur: 2.6 },                                                                         // Night hillside: 5 parallax layers, slow push, the robot scans a cat
  { id: 'y1_s2', dur: 2.7, transition: { type: 'lensReveal', dur: 1.0, lens: t => Y1.lensAt(t) } },  // Into the lens: the camera pushes exponentially into the eye, and the next world is inside it
  { id: 'y1_s3', dur: 2.7, transition: { type: 'matchCut', dur: 0.9 } },                             // Fill then pull out: push all the way into the yellow output node → pull out from the yellow eye
];
