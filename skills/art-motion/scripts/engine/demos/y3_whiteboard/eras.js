// Demo · Whiteboard hand-drawn explainer (RSA Animate type) "How AI Learned to Recognize Cats" (8s, three shots). Grammar card: references/animation-grammars/y3_whiteboard.md
//   Preview index.html?film=demos/y3_whiteboard   Render render.py --film demos/y3_whiteboard --out y3.mp4
// One big whiteboard = the world, the camera travels across it; all three segments are the same frame function (DG.board's stroke timeline), the segments exist only to split qa coverage.
window.PUNCH = 0;
window.SCENE_LIBS = ['demos/_shared/hero.js', 'demos/y3_whiteboard/whiteboard.js'];
window.ERAS = [
  { id: 'y3_s1', dur: 2.5 },                                                  // Draw the cat, write "Cat?", write the question
  { id: 'y3_s2', dur: 2.25, transition: { type: 'same', dur: 0.8 } },         // Whip pan (0.8s with motion blur, the pen never leaves the board)
  { id: 'y3_s3', dur: 3.25, transition: { type: 'same', dur: 0.85 } },        // Smooth move across the board → draw Huashu, "It's a cat!" → pull back for the full picture
];
