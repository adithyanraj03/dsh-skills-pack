// Demo · financial chart (The Economist / finance channel) "Shensuan Tech revenue and share price" (8 seconds, three shots; company and data entirely fictional, every shot tagged "illustrative data"). Grammar card: references/animation-grammars/t3_finance_chart.md
//   preview index.html?film=demos/t3_finance_chart   render render.py --film demos/t3_finance_chart --out t3.mp4
// Shot 2→3: the camera pushes in around the newest point on the price line (vector redraw, screen position fixed), entering the last 20 days of candles.
window.PUNCH = 0;
window.SCENE_DIR = 'demos/t3_finance_chart';
window.ERAS = [
  { id: 't3_s1', dur: 2.8 },
  { id: 't3_s2', dur: 2.7, transition: { type: 'slidePush', dur: 0.5, bar: '#E3120B' } },
  { id: 't3_s3', dur: 2.5, transition: { type: 'zoomThrough', dur: 0.6, cx: 1530, cy: 297.65, zoom: 6, live: true, bScale0: 0.6, bg: '#FFFFFF',
      get focus() { return SCENES.t3_s3.focus; } } },                 // focus = the newest candle
];
