// Demo · keynote style (Apple keynote / product-launch UI) "three features of Plover 2" (8 seconds, three shots; product and numbers are fictional). Grammar card: references/animation-grammars/t2_keynote_ui.md
//   preview index.html?film=demos/t2_keynote_ui   render render.py --film demos/t2_keynote_ui --out t2.mp4
// The light-blob backdrop depends only on film time t, so the three shots join seamlessly; card → fullscreen is a shared-element expansion (rect = the middle card's screen rect on shot 2's last frame).
window.PUNCH = 0;
window.SCENE_DIR = 'demos/t2_keynote_ui';
window.ERAS = [
  { id: 't2_s1', dur: 2.6 },
  { id: 't2_s2', dur: 3.0, transition: { type: 'blurPush', dur: 0.55 } },
  { id: 't2_s3', dur: 2.4, transition: { type: 'expandRect', dur: 0.6, rect: { x: 705.6, y: 252.6, w: 508.8, h: 614.8 }, r: 38 } },
];
