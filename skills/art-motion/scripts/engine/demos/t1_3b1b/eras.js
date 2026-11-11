// Demo · 3b1b / manim-style explainer "how one layer of a neural network turns pixels into a 'cat'" (8 seconds, three shots). Grammar card: references/animation-grammars/t1_3b1b.md
//   preview index.html?film=demos/t1_3b1b   render render.py --film demos/t1_3b1b --out t1.mp4
// Shot 1→2 has no transition: first frame = last frame of the previous shot, Transform continues (100 pixels become a column of neurons). Shot 2→3 pushes into a hidden-layer neuron to see what it is looking for.
window.PUNCH = 0;
window.SCENE_DIR = 'demos/t1_3b1b';
window.ERAS = [
  { id: 't1_s1', dur: 2.6 },
  { id: 't1_s2', dur: 2.8 },
  // cx,cy = screen position of the target neuron on shot 2's last frame (r = 22×1.1); live: shot 2 keeps pushing the camera during the transition itself (vector redraw)
  { id: 't1_s3', dur: 2.6, transition: { type: 'zoomThrough', dur: 0.75, cx: 850, cy: 391.5, zoom: 48, r0: 24.2, live: true, focus: [640, 585] } },
];
