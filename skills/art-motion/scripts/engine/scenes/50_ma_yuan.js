// Ma Yuan (Southern Song academy, "one corner" composition): gold-tinged silk, the weight pressed into the lower-left corner, axe-cut texture strokes + large areas of blank silk, long hanging willow branches, a tiny figure looking into emptiness.
// Subject (new composition): after rain, a scholar stands at the corner of the bank beneath an old willow, the wind carries the branches out over the water, a small boat lies far off in the mist.
// Anchored to the originals (fetch_reference.py actually pulled and confirmed three different Ma Yuan works: Walking on a Mountain Path in Spring, Appreciating Plum Blossoms under the Moon, Banquet by Lantern Light): silk #c9a65a, leaning golden-brown; ink in five tones (scorched/dense/heavy/pale/clear),
//   rocks = short side-brush axe cuts (broad flat strokes, hard edges, wet faces), branches = halting lines, hanging strands = fine long pale-ink lines, distant hills = clear-ink wash with no outline, people = very small, one stroke for the drapery.
// Pipeline: silk (cached) → distant-hill wash (cached) → axe-cut rocks (cached) → old trunk (cached) → motion: willow strands swaying (brush stroke by stroke), scholar, boat, bird, ripples → one multiply pass of the silk weave.
SCENES['50_ma_yuan'] = (() => {
  const W = 1920, H = 1080, { clamp, lerp, rng, ss } = U, P = PAINT, M = MEDIUM, TAU = Math.PI * 2;
  const INK = [22, 24, 22];
  let layer;
  const silk = () => M.silk('mayuan', { base: '#bfa46c', seed: 4, warp: 0.55, vig: 0.62, fleck: 2400 });

  function wash(g, poly, a0, a1, y0, y1, blur) {            // clear-ink wash: a gradient plane dense above and pale below, no outline, blurred edges
    g.save(); g.filter = `blur(${blur}px)`; const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, `rgba(60,62,56,${a0})`); gr.addColorStop(1, `rgba(60,62,56,${a1})`);
    g.fillStyle = gr; g.beginPath(); poly.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); g.fill(); g.restore();
  }
  function mountains(g) {
    wash(g, [[1020, 560], [1130, 440], [1210, 480], [1330, 360], [1440, 470], [1560, 410], [1700, 520], [1920, 470], [1920, 640], [1020, 640]], 0.26, 0.0, 360, 620, 9);
    wash(g, [[1250, 600], [1380, 520], [1470, 560], [1600, 500], [1760, 580], [1920, 560], [1920, 680], [1250, 680]], 0.16, 0.0, 500, 680, 7);
    g.save(); g.translate(1420, 610); g.scale(1, 0.16); const mg = g.createRadialGradient(0, 0, 0, 0, 0, 760); mg.addColorStop(0, 'rgba(226,210,160,.55)'); mg.addColorStop(1, 'rgba(226,210,160,0)'); g.fillStyle = mg; g.beginPath(); g.arc(0, 0, 760, 0, TAU); g.fill(); g.restore();       // a band of mist pressing down on the foot of the hills
  }
  // Axe-cut rock: clip to a polygon outline, then lay broad flat side-brush strokes inside along the lie of the rock; wash first, texture strokes after, hard edge last
  function rock(g, poly, { seed = 1, ang = 0.95, n = 90, wmin = 12, wmax = 30, wash0 = 0.34 } = {}) {
    const r = rng(seed), xs = poly.map(p => p[0]), ys = poly.map(p => p[1]), bx = Math.min(...xs), by = Math.min(...ys), bw = Math.max(...xs) - bx, bh = Math.max(...ys) - by;
    const path = new Path2D(); poly.forEach((p, i) => i ? path.lineTo(p[0], p[1]) : path.moveTo(p[0], p[1])); path.closePath();
    g.save(); g.clip(path);
    const gr = g.createLinearGradient(0, by, 0, by + bh); gr.addColorStop(0, `rgba(70,66,52,${wash0})`); gr.addColorStop(0.6, `rgba(60,58,46,${wash0 * 0.7})`); gr.addColorStop(1, `rgba(36,36,30,${wash0 * 1.5})`); g.fillStyle = gr; g.fillRect(bx, by, bw, bh);
    for (let i = 0; i < n; i++) {                              // axe cut: short, broad, heavy at the start and flying-white at the end, along ang (uses the brush library; wedge polygons read as arrowheads — tried, dropped)
      const x = bx + r() * bw, y = by + r() * bh, L = 40 + r() * 90, a = ang + (r() - .5) * 0.35, w = lerp(wmin, wmax, r()) * 0.55;
      const q = (y - by) / bh;
      P.brush(g, [[x, y], [x + Math.cos(a) * L * 0.5, y + Math.sin(a) * L * 0.5 + (r() - .5) * 8], [x + Math.cos(a) * L, y + Math.sin(a) * L]], { w, tone: 0.1 + q * 0.26 + r() * 0.08, dry: 0.85, seed: seed * 100 + i, bristles: 12, head: 0.05, tail: 0.5, col: INK });
    }
    for (let i = 0; i < n * 0.8; i++) {                       // hard texture strokes: fine, straight, halting, drawing out the edges of the axe cuts
      const x = bx + r() * bw, y = by + r() * bh, L = 26 + r() * 60, a = ang + (r() - .5) * 0.25;
      P.brush(g, [[x, y], [x + Math.cos(a) * L, y + Math.sin(a) * L]], { w: 2.6 + r() * 3, tone: 0.5 + r() * 0.3, dry: 0.5, seed: seed * 77 + i, bristles: 3, head: 0.05, tail: 0.5, col: INK });
    }
    g.restore();
    // Contour: only the lit ridges and the waterline, broken, one pause per stroke
    for (let i = 0; i < poly.length; i++) { const A = poly[i], B = poly[(i + 1) % poly.length]; if (r() < 0.25) continue;
      P.brush(g, [A, [lerp(A[0], B[0], .5) + (r() - .5) * 8, lerp(A[1], B[1], .5) + (r() - .5) * 8], B], { w: 6 + r() * 6, tone: 0.62, dry: 0.5, seed: seed * 31 + i, bristles: 6, head: 0.1, tail: 0.3, col: INK }); }
  }
  // Trunk: rises obliquely from the corner of the bank, two bends, forking
  const TRUNK = [[250, 1000], [210, 820], [260, 640], [350, 500], [470, 410], [610, 340]];
  const LIMBS = [   // anchor of each long branch (the i-th point along the trunk) and its direction: to the right, hanging down
    { a: [350, 500], p: [[350, 500], [520, 440], [720, 470], [890, 560]], tw: 12, ph: 0.0 },
    { a: [470, 410], p: [[470, 410], [650, 350], [880, 380], [1080, 480]], tw: 15, ph: 1.4 },
    { a: [610, 340], p: [[610, 340], [790, 300], [1010, 330], [1200, 420]], tw: 14, ph: 2.6 },
    { a: [260, 640], p: [[260, 640], [400, 620], [560, 670], [690, 760]], tw: 9, ph: 3.7 },
  ];
  function build() {
    layer = P.canvas(); const g = layer.getContext('2d');
    g.drawImage(silk(), 0, 0); mountains(g);
    // Near-bank rocks: the lower-left corner, two or three blocks, high in front and low behind, staggered
    rock(g, [[0, 1080], [0, 700], [90, 640], [210, 690], [330, 800], [470, 860], [620, 940], [800, 1010], [900, 1080]], { seed: 3, ang: 1.0, n: 130, wmin: 14, wmax: 34 });
    rock(g, [[420, 880], [520, 820], [640, 850], [760, 930], [980, 1000], [1120, 1080], [700, 1080]], { seed: 8, ang: 0.8, n: 70, wmin: 10, wmax: 24, wash0: 0.28 });
    rock(g, [[1480, 1080], [1560, 1010], [1700, 990], [1860, 1040], [1920, 1080]], { seed: 15, ang: 2.2, n: 40, wmin: 8, wmax: 18, wash0: 0.22 });     // a clump on the far bank (lower right, for balance)
    // Old trunk: one continuous thick line (drawn in segments it read as bamboo joints — tried, dropped), then halting short strokes for the bark
    P.brush(g, TRUNK, { w: 54, tone: 0.84, dry: 0.5, seed: 21, bristles: 16, head: 0.04, tail: 0.5, col: INK });
    P.brush(g, TRUNK.map(p => [p[0] + 14, p[1] + 4]), { w: 20, tone: 0.55, dry: 0.8, seed: 22, bristles: 8, col: INK });
    for (let i = 0; i < 40; i++) { const r = rng(40 + i), q = r(), y = lerp(990, 420, q), x = lerp(236, 480, 1 - q) + (r() - .5) * 46, h = 20 + r() * 40;
      P.brush(g, [[x - 5, y], [x + 2, y + h * 0.5], [x + 6, y + h]], { w: 5 + r() * 5, tone: 0.3 + r() * 0.3, dry: 0.8, seed: 50 + i, bristles: 4, col: INK }); }
    // Seal
    g.fillStyle = 'rgba(176,40,34,.88)'; g.fillRect(1760, 880, 46, 46); g.fillStyle = 'rgba(201,168,94,.9)'; g.fillRect(1768, 888, 14, 14); g.fillRect(1786, 906, 14, 14); g.fillRect(1768, 910, 8, 10);
  }
  function willow(c, t) {
    LIMBS.forEach((L, li) => {
      const sw = (k) => Math.sin(t * 1.5 + L.ph + k * 1.1) * (10 + k * 14) + Math.sin(t * 3.1 + L.ph * 2) * 3 * k;
      const pts = L.p.map((p, k) => [p[0] + (k ? sw(k) * 0.6 : 0), p[1] + (k ? Math.sin(t * 1.7 + L.ph + k) * 6 * k : 0)]);
      P.brush(c, pts, { w: L.tw, tone: 0.8, dry: 0.5, seed: 90 + li, bristles: 8, head: 0.04, tail: 0.5, col: INK });
      // Hanging strands: sample points along the branch, each strand hangs down, its tip carried right by the wind
      const D = KIT.resample(KIT.densify(pts, 5), 34), n = D.length;
      for (let k = 2; k < n; k++) {
        const [x, y] = D[k], r = rng(li * 500 + k * 13);
        if (r() < 0.3) continue;                                    // in clusters: strands randomly left out, keeping gaps that let the air through
        const cnt = 1 + (r() * 3 | 0);
        for (let m = 0; m < cnt; m++) {
          const x0 = x + (r() - .5) * 22, len = 40 + Math.pow(r(), 1.6) * 250, ph = r() * 6, wind = (Math.sin(t * 1.7 + ph + k * 0.35) * 0.5 + 0.5) * 38 + 8;
          const bend = (r() - 0.3) * 40, tw = [[x0, y], [x0 + wind * 0.15 + bend * 0.3, y + len * 0.35], [x0 + wind * 0.5 + bend, y + len * 0.7], [x0 + wind + bend * 0.8, y + len]];
          P.brush(c, tw, { w: 1.8 + r() * 1.8, tone: 0.18 + r() * 0.34, dry: 0.5, seed: li * 700 + k * 5 + m, bristles: 3, head: 0.05, tail: 0.65, col: INK });
          if (r() < 0.35) P.leaf(c, tw[3][0], tw[3][1], 1.35 + Math.sin(t * 2.2 + ph) * 0.2, 14 + r() * 10, 4, 0.45, INK);
        }
      }
    });
  }
  function scholar(c, t) {                                      // standing at the corner of the bank, looking into emptiness: seen from behind, wide sleeves, tall cap; one stroke for the drapery, the robe not filled in (bare silk left)
    const x = 760, y = 972, bob = Math.sin(t * 1.3) * 1.0, fl = Math.sin(t * 2.1) * 5, look = ss(0.5, 3.5, t);
    c.save(); c.translate(x, y + bob);
    c.fillStyle = 'rgba(236,224,184,.5)';
    c.beginPath(); c.moveTo(-14, -128); c.quadraticCurveTo(-34, -60, -30, 0); c.lineTo(26, 0); c.quadraticCurveTo(28 + fl * 0.4, -64, 14, -128); c.closePath(); c.fill();
    P.brush(c, [[-16, -126], [-34, -56], [-30, 0]], { w: 4, tone: 0.85, dry: 0.2, seed: 201, bristles: 4, col: INK });
    P.brush(c, [[14, -126], [28, -60], [26 + fl * 0.5, 0]], { w: 3.4, tone: 0.75, dry: 0.3, seed: 202, bristles: 4, col: INK });
    P.brush(c, [[-30, 2], [-2, 8], [26, 2]], { w: 3.6, tone: 0.6, dry: 0.3, seed: 203, bristles: 3, col: INK });
    P.brush(c, [[-4, -120], [-8, -70], [0, -20]], { w: 2.6, tone: 0.5, dry: 0.5, seed: 204, bristles: 3, col: INK });
    // right sleeve lifts to point into the distance (rising with look)
    const ah = lerp(-30, -96, look);
    c.fillStyle = 'rgba(236,224,184,.5)'; c.beginPath(); c.moveTo(14, -118); c.quadraticCurveTo(52, ah + 10, 72 + fl * 0.4, ah); c.quadraticCurveTo(54, ah + 30, 20, -88); c.closePath(); c.fill();
    P.brush(c, [[14, -118], [52, ah + 8], [72 + fl * 0.4, ah]], { w: 3.4, tone: 0.8, dry: 0.3, seed: 205, bristles: 4, col: INK });
    P.brush(c, [[20, -88], [54, ah + 30], [72 + fl * 0.4, ah]], { w: 2.6, tone: 0.6, dry: 0.3, seed: 206, bristles: 3, col: INK });
    c.fillStyle = 'rgba(40,38,34,.95)'; c.beginPath(); c.ellipse(-2, -142, 14, 15, 0, 0, TAU); c.fill();                // head
    c.beginPath(); c.moveTo(-14, -150); c.lineTo(-10, -178); c.lineTo(10, -178); c.lineTo(14, -150); c.closePath(); c.fill();   // tall cap
    P.brush(c, [[8, -168], [34 + fl, -164], [52 + fl * 1.4, -140]], { w: 3.6, tone: 0.8, dry: 0.3, seed: 207, bristles: 3, col: INK });  // cap ribbon in the wind
    c.restore();
  }
  function boat(c, t) {                                          // distant boat: one stroke for the hull + one for the figure in a straw cape, rocking gently on the water
    const x = lerp(1620, 1420, ss(0, 6, t)), y = 790 + Math.sin(t * 1.1) * 4, r2 = Math.sin(t * 1.1) * 0.02;
    c.save(); c.translate(x, y); c.rotate(r2); c.globalAlpha = 0.9;
    P.brush(c, [[-60, 0], [-20, 12], [30, 10], [74, -6]], { w: 11, tone: 0.78, dry: 0.45, seed: 301, bristles: 6, head: 0.1, tail: 0.3, col: INK });
    c.fillStyle = 'rgba(40,40,34,.85)'; c.beginPath(); c.moveTo(-6, -4); c.quadraticCurveTo(-6, -40, 4, -48); c.quadraticCurveTo(14, -40, 12, -4); c.fill();
    P.brush(c, [[-18, -44], [4, -56], [26, -44]], { w: 6, tone: 0.8, dry: 0.3, seed: 302, bristles: 4, col: INK });
    P.brush(c, [[14, -30], [40, -10], [66, 22]], { w: 2.4, tone: 0.7, dry: 0.2, seed: 303, bristles: 2, col: INK });       // pole
    c.restore();
    c.save(); c.globalAlpha = 0.28; P.brush(c, [[x - 70, y + 22], [x - 10, y + 26], [x + 80, y + 22]], { w: 4, tone: 0.5, dry: 0.8, seed: 304, bristles: 3, col: INK }); c.restore();
  }
  function bird(c, t) {
    const u = ss(0.3, 5.7, t), x = lerp(1860, 1180, u), y = 250 + Math.sin(u * 7) * 26 - u * 40, f = Math.sin(t * 9) * 12;
    c.save(); c.translate(x, y); P.brush(c, [[-22, -f * 0.4], [-6, -8 - f], [0, 0]], { w: 5, tone: 0.8, dry: 0.2, seed: 401, bristles: 3, col: INK }); P.brush(c, [[22, -f * 0.4], [6, -8 - f], [0, 0]], { w: 5, tone: 0.8, dry: 0.2, seed: 402, bristles: 3, col: INK });
    c.fillStyle = 'rgba(30,30,28,.85)'; c.beginPath(); c.ellipse(0, 2, 7, 4, 0, 0, TAU); c.fill(); c.restore();
  }
  function ripples(c, t) {                                       // only a few extremely faint horizontal lines on the water, plus ripples at the bank
    c.save(); for (let i = 0; i < 9; i++) { const y = 700 + i * 36, x0 = 980 + (i % 3) * 170 + Math.sin(t * 0.6 + i) * 18; c.strokeStyle = `rgba(58,60,52,${0.05 + i * 0.008})`; c.lineWidth = 1.4; c.beginPath(); c.moveTo(x0, y); c.bezierCurveTo(x0 + 60, y - 2, x0 + 150, y + 2, x0 + 230, y); c.stroke(); }
    for (let k = 0; k < 3; k++) { const q = ((t * 0.28 + k / 3) % 1); c.strokeStyle = `rgba(58,60,52,${(1 - q) * 0.2})`; c.lineWidth = 1.4; c.beginPath(); c.ellipse(1010, 905, 24 + q * 150, 3 + q * 15, 0, 0, TAU); c.stroke(); }
    c.restore();
  }
  function draw(c, lt) {
    if (!layer) build();
    const t = clamp(lt, 0, 6);
    c.drawImage(layer, 0, 0);
    ripples(c, t); boat(c, t); bird(c, t); willow(c, t); scholar(c, t);
    c.save(); c.globalCompositeOperation = 'multiply'; c.globalAlpha = 0.35; c.drawImage(silk(), 0, 0); c.restore();     // silk weave laid over the ink: the ink has soaked into the silk
  }
  return { draw };
})();
