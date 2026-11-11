// Small tools shared by a group of segments (in the full film 06_renaissance / 32_rembrandt / 07_ukiyoe / 28_monet / 29_seurat / 09_postimp share it; this demo only uses 28_monet).
// Not part of index.html: each segment file loads it synchronously at the top (if (!window.YI) …), so any segment can load first.
//   YI.S(key)                         frame library (makes sure XING has already computed imgs/hat)
//   YI.actor(c, key, i, o, mat)       draws frame i, mat = { name, fn(img)->canvas(may carry a pad), atop(g, o, box) }:
//                                     fn is the per-frame cached material (filters, pointillist repaint…); atop is composited source-atop on the sprite every frame (candlelight, light patches)
//   YI.toScreen(key, i, o, [px,py])   in-frame pixel coordinates → screen coordinates (hand position, prop alignment)
//   YI.hand(key, i, o, tbl)           tbl[i] = [px,py] (in-frame pixels) → screen coordinates
//   YI.fly(c, from, to, q, draw, o)   souvenir flies onto the hat: parabola + scale up + spin (the hat-landing moment is caught by pop in world.js)
(() => {
const W = 1920, H = 1080, TAU = Math.PI * 2;
const { clamp, lerp, ss } = U;
const P = window.PAINT, X = window.XING;
const Y = window.YI = {};

// Is the frame library there (reads the directory listing, no 404 request — render.py records 404s as page errors)
let LIST = null;
Y.has = k => { if (LIST == null) { const x = new XMLHttpRequest(); x.open('GET', 'demos/long_scroll/frames/', false); x.send(); LIST = x.status === 200 ? x.responseText : ''; } return LIST.includes(`"${k}/"`); };
// Hat-top correction: an arm raised overhead fools XING's "topmost opaque pixel row", so override with the white hat top measured frame by frame (in-frame pixels [x,y])
Y.HATFIX = {};
Y.fixHat = (key, arr) => { Y.HATFIX[key] = arr; };
Y.S = key => { X.hatTop(key, 0, { x: 0, y: 0, h: 1 }); const S = X.SPR[key]; if (Y.HATFIX[key] && !S._yiFixed) { Y.HATFIX[key].forEach((p, i) => { if (p) S.hat[i] = p; }); S._yiFixed = true; } return S; };
Y.hatTop = (key, i, o) => { Y.S(key); return X.hatTop(key, i, o); };
const PROC = {};
Y.proc = (key, i, mat) => {
  const k = key + '|' + mat.name + '|' + i; if (PROC[k]) return PROC[k];
  const S = Y.S(key), im = S.imgs[i]; const out = mat.fn(im); if (out.pad == null) out.pad = 0; return PROC[k] = out;
};
Y.geom = (key, i, o) => { const S = Y.S(key), f = S.meta.frames[i], s = o.h / S.meta.ref_h * (o.scale || 1); return { S, f, s }; };
Y.toScreen = (key, i, o, p) => { const { f, s } = Y.geom(key, i, o), fx = o.flip ? -1 : 1; return [o.x + (p[0] - f.ax) * s * fx, o.y + (p[1] - f.ay) * s]; };
Y.hand = (key, i, o, tbl) => Y.toScreen(key, i, o, tbl[i] || tbl[0]);

Y.actor = (c, key, i, o, mat) => {
  const { S, f, s } = Y.geom(key, i, o);
  const im = mat && mat.fn ? Y.proc(key, i, mat) : S.imgs[i], pad = im.pad || 0, fx = o.flip ? -1 : 1;
  const dw = im.width * s, dh = im.height * s, x0 = o.x - (f.ax + pad) * s * fx, y0 = o.y - (f.ay + pad) * s;
  const left = o.flip ? x0 - dw : x0;
  c.save(); if (o.alpha != null) c.globalAlpha *= o.alpha;
  if (o.shadow) { c.fillStyle = o.shadow; c.beginPath(); c.ellipse(o.x, o.y + 2, o.h * 0.2, o.h * 0.035, 0, 0, TAU); c.fill(); }
  if (mat && mat.atop) {
    const Sc = P.scratch('yiActor'), g = Sc.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0);
    const bw = Math.ceil(dw) + 4, bh = Math.ceil(dh) + 4; g.clearRect(0, 0, bw + 4, bh + 4);
    g.save(); g.translate(2, 2); if (o.flip) { g.translate(dw, 0); g.scale(-1, 1); } g.drawImage(im, 0, 0, dw, dh); g.restore();
    g.save(); g.globalCompositeOperation = 'source-atop'; g.translate(2 - left, 2 - y0); mat.atop(g, o, { x: left, y: y0, w: dw, h: dh }); g.restore();
    c.drawImage(Sc, 0, 0, bw, bh, left - 2, y0 - 2, bw, bh);
  } else {
    if (o.flip) { c.translate(left + dw, y0); c.scale(-1, 1); c.drawImage(im, 0, 0, dw, dh); }
    else c.drawImage(im, left, y0, dw, dh);
  }
  c.restore();
};

// Image generation likes to render the white hat and white tee as cream or light gray: pull low-saturation brights back to white (the hat's rule is pure white). lo = brightness where the pull starts
Y.whiten = (g, w, h, lo = 185, r = 251, gg = 249, b = 242, chroma = 52) => { const d = g.getImageData(0, 0, w, h), q = d.data;
  for (let k = 0; k < q.length; k += 4) { const mx = Math.max(q[k], q[k + 1], q[k + 2]), mn = Math.min(q[k], q[k + 1], q[k + 2]); if (q[k + 3] > 0 && mx > lo && mx - mn < chroma) { const f = Math.min(1, (mx - lo) / (255 - lo) * 1.15); q[k] = lerp(q[k], r, f); q[k + 1] = lerp(q[k + 1], gg, f); q[k + 2] = lerp(q[k + 2], b, f); } }
  g.putImageData(d, 0, 0); };
// Pad the segment ends: art-style boundaries are wavy lines (±30px) that extend past the segment's [0,w] — stretch the outermost 2px of the world canvas out over 80px so no black shows
Y.edge = (c, cv, camX, w) => { c.drawImage(cv, 0, 0, 2, cv.height, -camX - 80, 0, 82, cv.height); c.drawImage(cv, w - 2, 0, 2, cv.height, w - camX, 0, 80, cv.height); };
// The landing point when a souvenir flies onto the hat = the top of the current stack (not the hat top): drawHatStack once invisibly on a scratch canvas to get that height
Y.stackTop = (key, i, o, t) => { const [hx, hy] = Y.hatTop(key, i, o), g = P.scratch('yiStackProbe').getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 0; const top = WORLD.drawHatStack(g, hx, hy + 4, o.h || 300, t); g.globalAlpha = 1; return [hx, hy + 4 + top]; };
// Pull the hat back to pure white: edits the original frames in the library directly (only the low-saturation brights in the top fraction of the hat), so afterwards all XING materials start from a white hat
Y.whitenHat = (key, { frac = 0.42, lo = 150, chroma = 110 } = {}) => { const S = Y.S(key); if (S._yiWhite) return; S.imgs = S.imgs.map(im => { const cv = P.canvas(im.width, im.height), g = cv.getContext('2d', { willReadFrequently: true }); g.drawImage(im, 0, 0);
  const hh = Math.round(im.height * frac); const d = g.getImageData(0, 0, im.width, hh), q = d.data;
  for (let k = 0; k < q.length; k += 4) { const mx = Math.max(q[k], q[k + 1], q[k + 2]), mn = Math.min(q[k], q[k + 1], q[k + 2]); if (q[k + 3] > 0 && mx > lo && mx - mn < chroma && q[k + 2] >= q[k] - 20) { const f = Math.min(1, (mx - lo) / (255 - lo) * 1.3); q[k] = lerp(q[k], 252, f); q[k + 1] = lerp(q[k + 1], 251, f); q[k + 2] = lerp(q[k + 2], 248, f); } }
  g.putImageData(d, 0, 0); return cv; }); S._yiWhite = true; };
// Souvenir flies onto the hat: from/to are screen coordinates; q 0..1; draw(c, x, y, scale, rot)
Y.fly = (c, from, to, q, draw, { arc = 160, grow = 0.8, spin = 0, s0 = 1, s1 = 1 } = {}) => {
  const e = U.ease ? q : q; const x = lerp(from[0], to[0], e), y = lerp(from[1], to[1], e) - Math.sin(e * Math.PI) * arc;
  const sc = lerp(s0, s1, e) * (1 + grow * Math.sin(e * Math.PI)); draw(c, x, y, sc, spin * e);
};

// Simple sprite-pixel tool: returns the sprite's ImageData (cached)
const DATA = {};
Y.data = (key, i) => { const k = key + i; if (DATA[k]) return DATA[k]; const im = Y.S(key).imgs[i], cv = P.canvas(im.width, im.height), g = cv.getContext('2d', { willReadFrequently: true }); g.drawImage(im, 0, 0); return DATA[k] = { w: im.width, h: im.height, d: g.getImageData(0, 0, im.width, im.height).data }; };

// Candle flame (shared by the Rembrandt segment's souvenir and its in-scene props): x,y = base of the wick; s scale; t time. Draws only the flame + inner flame + wick
Y.flame = (c, x, y, s, t, seed = 0) => {
  const fl = 0.5 * P.noise(t * 2.2 + seed, 3.1) + 0.25 * P.noise(t * 6.5 + seed, 7.7), lean = fl * 0.5, hgt = (30 + 8 * P.noise(t * 5 + seed, 1.3)) * s;
  c.save(); c.translate(x, y);
  const outer = new Path2D(); outer.moveTo(-7 * s, 0); outer.bezierCurveTo(-9 * s, -hgt * 0.45, lean * hgt * 0.6 - 2 * s, -hgt * 0.75, lean * hgt, -hgt); outer.bezierCurveTo(lean * hgt * 0.6 + 2 * s, -hgt * 0.75, 9 * s, -hgt * 0.45, 7 * s, 0); outer.closePath();
  const g1 = c.createRadialGradient(0, -hgt * 0.3, 1, 0, -hgt * 0.3, hgt * 0.9); g1.addColorStop(0, 'rgba(255,250,215,1)'); g1.addColorStop(0.5, 'rgba(255,200,90,.95)'); g1.addColorStop(1, 'rgba(230,110,30,.7)');
  c.fillStyle = g1; c.fill(outer);
  c.fillStyle = 'rgba(255,255,240,.95)'; c.beginPath(); c.ellipse(lean * hgt * 0.25, -hgt * 0.3, 2.6 * s, hgt * 0.22, lean * 0.3, 0, TAU); c.fill();
  c.fillStyle = 'rgba(90,110,200,.55)'; c.beginPath(); c.ellipse(0, -2 * s, 3.5 * s, 3 * s, 0, 0, TAU); c.fill();
  c.strokeStyle = '#2a1a10'; c.lineWidth = 1.6 * s; c.beginPath(); c.moveTo(0, 2 * s); c.lineTo(lean * 3 * s, -5 * s); c.stroke();
  c.restore();
};
// Candle glow (lighter)
Y.glow = (c, x, y, r, a, col = '255,190,100') => { c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(0.4, `rgba(${col},${a * 0.4})`); g.addColorStop(1, `rgba(${col},0)`); c.fillStyle = g; c.fillRect(x - r, y - r, 2 * r, 2 * r); c.restore(); };
Y.flick = (t, seed = 0) => 0.5 + 0.5 * (0.6 * P.noise(t * 2.2 + seed, 5.5) + 0.4 * P.noise(t * 7 + seed, 9.1));

// ---------- Pointillism (Seurat): the "world-coordinate version" of P.pointillism — the grid is anchored to the world (dots do not swim when the camera pans), any canvas size, and dots can be laid only where the source is opaque ----------
// src's x=0 corresponds to world x = gx0; with alphaMin>0 dots go only where src is opaque (dynamic object layers); rect=[x0,y0,x1,y1] limits the range (src coordinates)
const PICK = new Map();
Y.dots = (c, src, { pal, comp = {}, pitch = 10, rad = 4.5, posJitter = 2.4, colorJitter = 40, compRate = 0.08, flicker = 0.07, fps = 6, t = 0, shimmer, white = 12, dark = 0, bleed = 45, gx0 = 0, alphaMin = 0, rect, palKey = 'p' } = {}) => {
  const PAL = pal.map(v => typeof v === 'string' ? P.hex(v) : v);
  let cache = PICK.get(palKey); if (!cache) { cache = new Map(); PICK.set(palKey, cache); }
  const pick = (r, g, b) => { const key = (r >> 3) << 10 | (g >> 3) << 5 | (b >> 3); let v = cache.get(key); if (v) return v;
    let best = 1e18, bi = 0, bj = 0, bw = 1;
    for (let i = 0; i < PAL.length; i++) for (let j = i + 1; j < PAL.length; j++) { const pi = PAL[i], pj = PAL[j], ex = pi[0] - pj[0], ey = pi[1] - pj[1], ez = pi[2] - pj[2];
      const w = clamp(((r - pj[0]) * ex + (g - pj[1]) * ey + (b - pj[2]) * ez) / (ex * ex + ey * ey + ez * ez + 1e-6), 0.2, 0.8);
      const dr = pj[0] + w * ex - r, dg = pj[1] + w * ey - g, db = pj[2] + w * ez - b, d = dr * dr * 0.9 + dg * dg * 1.2 + db * db * 0.8 + (ex * ex + ey * ey + ez * ez) * 0.004;
      if (d < best) { best = d; bi = i; bj = j; bw = w; } }
    v = [bi, bj, bw]; cache.set(key, v); return v; };
  const sw = src.width, sh = src.height, [rx0, ry0, rx1, ry1] = rect || [0, 0, sw, sh];
  const sd = src.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, sw, sh).data;
  const at = (x, y) => (clamp(y | 0, 0, sh - 1) * sw + clamp(x | 0, 0, sw - 1)) * 4;
  const L = (x, y) => { const k = at(x, y); return sd[k] * 0.3 + sd[k + 1] * 0.59 + sd[k + 2] * 0.11; };
  const paths = PAL.map(() => new Path2D()), st = Math.floor(t * fps), ROWH = pitch * 0.866, hj = posJitter / 2;
  for (let j = Math.max(0, Math.floor(ry0 / ROWH) - 1), y = j * ROWH; y < ry1 + ROWH; j++, y += ROWH) {
    const off = (j % 2) * pitch / 2, i0 = Math.floor((gx0 + rx0 - off) / pitch) - 1, i1 = Math.ceil((gx0 + rx1 - off) / pitch) + 1;
    for (let i = i0; i <= i1; i++) {
      const jx = (U.hash(i, j * 7 + 1) - 0.5) * 2 * hj, jy = (U.hash(i * 3, j + 5) - 0.5) * 2 * hj, px = i * pitch + off + jx - gx0, py = y + jy;
      if (px < rx0 - pitch || px > rx1 + pitch) continue;
      const k = at(px, py); if (alphaMin && sd[k + 3] < alphaMin) continue;
      const dj = (U.hash(i * 7 + 3, j * 11) - 0.5) * colorJitter;
      const [a, bb, w] = pick(clamp(sd[k] + dj, 0, 255), clamp(sd[k + 1] + dj * 0.8, 0, 255), clamp(sd[k + 2] - dj * 0.6, 0, 255));
      const hseed = shimmer && shimmer(px, py) ? U.hash(i + st * 977, j) : U.hash(i, j);
      let idx = hseed < w ? a : bb; const h2 = U.hash(i * 5 + 2, j * 3 + 9);
      if (h2 < compRate && comp[idx] != null) idx = comp[idx];
      else if (U.hash(i * 13 + st * 31, j * 17) < flicker) idx = (U.hash(i, j + st) < w) ? bb : a;
      else if (!alphaMin) { const dl = L(px, py) - L(px + 14, py + 6); if (Math.abs(dl) > bleed && h2 < 0.45) idx = dl > 0 ? white : dark; }
      paths[idx].moveTo(px + rad, py); paths[idx].arc(px, py, rad, 0, TAU);
    } }
  paths.forEach((p, k) => { c.fillStyle = P.rgb(PAL[k]); c.fill(p); });
};
// Sprite → dot field (for scatter/regather): samples opaque pixels at pitch, returns [{x,y,col,r1,r2,r3}] (in-frame pixel coordinates)
const DOTS = {};
Y.spriteDots = (key, i, pitch, procCanvas) => { const k = key + i + '|' + pitch; if (DOTS[k]) return DOTS[k];
  const im = procCanvas || Y.S(key).imgs[i], cv = P.canvas(im.width, im.height), g = cv.getContext('2d', { willReadFrequently: true }); g.drawImage(im, 0, 0); const d = g.getImageData(0, 0, im.width, im.height).data, out = [];
  for (let y = 0, j = 0; y < im.height; y += pitch * 0.866, j++) for (let x = (j % 2) * pitch / 2; x < im.width; x += pitch) { const q = ((y | 0) * im.width + (x | 0)) * 4; if (d[q + 3] < 140) continue;
    out.push({ x, y, col: `rgb(${d[q]},${d[q + 1]},${d[q + 2]})`, r1: U.hash(x | 0, y | 0), r2: U.hash(y | 0, (x | 0) + 7), r3: U.hash((x | 0) + 3, (y | 0) * 3) }); }
  return DOTS[k] = out; };
})();
