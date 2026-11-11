// Medium layer: runs the "clean shapes" through a real drawing material instead of laying noise over flat vectors. Added 2026-10-16, used by the new style demos (38–54).
//   MEDIUM.figure(c, o)            a clothed figure with volume: bell-shaped robe + mantle folds + sleeves + hands + simplified face (the gaze is the protagonist). Only for styles where this is a deliberate choice — original flat design, fresco, miniature painting
//   MEDIUM.plaster(key, o)         plaster wall ground: low-frequency wet/dry colour variation + grain + pinholes + seams (fresco day's-work boundaries), cached
//   MEDIUM.fresco(c, plate, o)     fresco pass: pigment eaten into the lime (gentle blur + chalk white veil) + plaster multiply + pinholes lifted + seams
//   MEDIUM.silk(key, o)            silk/paper ground: warp and weft grain + yellowed vignette, cached
//   MEDIUM.outline(c, path, o)     outline: variable line width, off colours allowed (ochre brown, ultramarine, ink), never pure black
//   MEDIUM.flat(c, path, fill, o)  cloisonné-style flat fill: short strokes along the brush direction inside each colour block + a thick, uneven deep-ultramarine outline (Gauguin)
//   MEDIUM.broken(src, o)          broken-colour repaint: repaint the clean canvas stroke by stroke as impressionism (lights bias warm, darks bias cool, complementary jitter), returns a new canvas for the caller to cache
//   MEDIUM.hatchFill(c, path, o)   hatch inside the path along a direction (woodcut/copperplate/miniature shadows)
// Convention: all randomness is seeded; plate is a finished 1920×1080 offscreen canvas; the pass functions never modify plate.
(() => {
let W = 1920, H = 1080; U.onStage((w, h) => { W = w; H = h; });
const P = window.PAINT, { clamp, lerp, rng, ss } = U, TAU = Math.PI * 2;
const M = window.MEDIUM = {};

const hex = h => P.hex(h);
const mixc = (a, b, t) => P.mix(typeof a === 'string' ? hex(a) : a, typeof b === 'string' ? hex(b) : b, t);
const css = (c, a = 1) => P.rgb(typeof c === 'string' ? hex(c) : c, a);
M.css = css; M.mix = mixc;

// ---------- Plaster ----------
// A fresco is not paper: the lime layer has low-frequency wet/dry colour variation, fine grain and pinholes, and between one day's work (giornata) and the next there is a seam you can barely see.
M.plaster = (key, { base = '#d9cdb4', seams = [], seed = 7, pits = 1400, mottle = 0.07 } = {}) => P.cached('plaster_' + key, W, H, (g) => {
  const r = rng(seed), im = g.createImageData(W, H), d = im.data, b = hex(base);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4;
    const m = P.fbm(x * 0.0035 + seed, y * 0.0035, 4) * mottle * 255 + P.fbm(x * 0.02, y * 0.02 + seed, 3) * 0.035 * 255;
    const f = (r() - 0.5) * 16;                                   // fine grain
    d[i] = clamp(b[0] + m + f, 0, 255); d[i + 1] = clamp(b[1] + m + f, 0, 255); d[i + 2] = clamp(b[2] + m * 0.9 + f, 0, 255); d[i + 3] = 255;
  }
  g.putImageData(im, 0, 0);
  for (let i = 0; i < pits; i++) {                                // pinholes: a dark dot with a lit edge on the lower-right side
    const x = r() * W, y = r() * H, s = 0.6 + r() * 1.9;
    g.fillStyle = `rgba(70,55,40,${0.12 + r() * 0.22})`; g.beginPath(); g.arc(x, y, s, 0, TAU); g.fill();
    g.fillStyle = 'rgba(255,250,235,.28)'; g.beginPath(); g.arc(x + s * 0.7, y + s * 0.7, s * 0.55, 0, TAU); g.fill();
  }
  g.lineCap = 'round';
  for (const sm of seams) {                                       // seams: [[x,y],...] polylines; a bright ridge plus a dark line, with the ground slightly different on either side
    g.strokeStyle = 'rgba(80,62,45,.22)'; g.lineWidth = 1.6; g.beginPath(); sm.forEach((p, k) => k ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.stroke();
    g.strokeStyle = 'rgba(255,248,230,.34)'; g.lineWidth = 1.4; g.beginPath(); sm.forEach((p, k) => k ? g.lineTo(p[0], p[1] + 2) : g.moveTo(p[0], p[1] + 2)); g.stroke();
  }
});

// Fresco pass: plate (clean shapes) → the frame.
// ① gentle blur (pigment eaten into wet plaster, edges not sharp) ② lime chalk white veil (low-alpha screen: everything chalky and matte) ③ plaster multiply (ground variation, grain) ④ pinholes and seams lifted
M.fresco = (c, plate, { ground, chalk = 0.10, soften = 0.8, plasterAlpha = 0.55, sat = 0.9, tone = null } = {}) => {
  c.save();
  c.filter = `blur(${soften}px) saturate(${sat})`; c.drawImage(plate, 0, 0); c.filter = 'none';
  c.globalCompositeOperation = 'screen'; c.fillStyle = `rgba(236,226,206,${chalk})`; c.fillRect(0, 0, W, H);
  c.globalCompositeOperation = 'multiply'; c.globalAlpha = plasterAlpha; c.drawImage(ground, 0, 0);
  c.globalCompositeOperation = 'soft-light'; c.globalAlpha = 0.5; c.drawImage(ground, 0, 0);
  if (tone) { c.globalCompositeOperation = 'multiply'; c.globalAlpha = 1; c.fillStyle = tone; c.fillRect(0, 0, W, H); }
  c.restore();
};

// ---------- Silk / paper ground ----------
M.silk = (key, { base = '#c9a85e', seed = 3, warp = 0.5, vig = 0.5, fleck = 1800 } = {}) => P.cached('silk_' + key, W, H, (g) => {
  const r = rng(seed), b = hex(base);
  const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, css(mixc(b, [255, 240, 200], 0.18))); gr.addColorStop(1, css(mixc(b, [120, 80, 30], 0.12)));
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.globalAlpha = 0.5; g.drawImage(P.texture('silk' + key, base, { scale: 0.003, amt: 14, grain: 5, seed }), 0, 0); g.globalAlpha = 1;
  for (let x = 0; x < W; x += 3) { g.fillStyle = `rgba(90,60,20,${(0.02 + r() * 0.045) * warp})`; g.fillRect(x, 0, 1, H); }       // warp threads
  for (let y = 0; y < H; y += 3) { g.fillStyle = `rgba(255,236,170,${(0.015 + r() * 0.04) * warp})`; g.fillRect(0, y, W, 1); }     // weft threads
  for (let i = 0; i < fleck; i++) { g.fillStyle = r() < 0.5 ? 'rgba(80,55,25,.10)' : 'rgba(255,240,200,.14)'; g.fillRect(r() * W, r() * H, 1 + r() * 4, 1); }
  const v = g.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, W * 0.75); v.addColorStop(0, 'rgba(80,50,15,0)'); v.addColorStop(1, `rgba(80,50,15,${vig * 0.5})`);
  g.fillStyle = v; g.fillRect(0, 0, W, H);
});

// ---------- Lines ----------
// Draw a varying-width line along pts: w is [start, middle, end] width, col the colour. Never pure black — use red chalk / ultramarine / ink for drawing.
M.outline = (c, pts, { w = [1, 3, 1], col = '#4a3322', a = 0.9, closed = false, jitter = 0, seed = 1 } = {}) => {
  const r = rng(seed), n = pts.length;
  c.save(); c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = typeof col === 'string' ? col : css(col, a); c.globalAlpha = a;
  const seg = closed ? n : n - 1;
  for (let i = 0; i < seg; i++) {
    const A = pts[i], B = pts[(i + 1) % n], q = i / Math.max(1, seg - 1);
    c.lineWidth = q < 0.5 ? lerp(w[0], w[1], q * 2) : lerp(w[1], w[2], (q - 0.5) * 2);
    c.beginPath(); c.moveTo(A[0] + (r() - .5) * jitter, A[1] + (r() - .5) * jitter); c.lineTo(B[0] + (r() - .5) * jitter, B[1] + (r() - .5) * jitter); c.stroke();
  }
  c.restore();
};

M.hatchFill = (c, path, { ang = 0.9, gap = 5, col = 'rgba(40,30,20,.35)', lw = 1, bounds = [0, 0, W, H], seed = 1 } = {}) => {
  const r = rng(seed); c.save(); c.clip(path); c.strokeStyle = col; c.lineWidth = lw; c.beginPath();
  const [bx, by, bw, bh] = bounds, R = Math.hypot(bw, bh), cx = bx + bw / 2, cy = by + bh / 2, ca = Math.cos(ang), sa = Math.sin(ang);
  for (let k = -R; k < R; k += gap) { const j = (r() - .5) * 1.2; c.moveTo(cx + ca * -R - sa * (k + j), cy + sa * -R + ca * (k + j)); c.lineTo(cx + ca * R - sa * (k + j), cy + sa * R + ca * (k + j)); }
  c.stroke(); c.restore();
};

// ---------- Cloisonné-style flat fill (Gauguin / synthetism) ----------
// path: Path2D; fill: colour; o.streak: brush direction (radians), o.vari: amount of colour variation; o.line: outline colour (deep ultramarine / violet-black, not pure black), o.lw: outline width
// Flat fill does not mean flat: inside one colour block there are short light-and-dark strokes along the brush direction (you can see the brush), and the outline is thick and uneven. Each block fixes its strokes with o.seed, deterministically.
M.flat = (c, path, fill, { streak = 0.7, vari = 18, line = '#1d2a52', lw = 6, seed = 1, bounds = [0, 0, W, H], n = 46, la = 0.95 } = {}) => {
  const r = rng(seed * 131), f = typeof fill === 'string' ? hex(fill) : fill;
  c.save(); c.fillStyle = css(f); c.fill(path); c.clip(path);
  const [bx, by, bw, bh] = bounds;
  c.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const x = bx + r() * bw, y = by + r() * bh, L = 40 + r() * 120, a = streak + (r() - .5) * 0.25, d = (r() - .5) * 2 * vari;
    c.strokeStyle = css([f[0] + d, f[1] + d * 0.8, f[2] + d * 0.7], 0.55); c.lineWidth = 8 + r() * 22;
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); c.stroke();
  }
  c.restore();
  if (lw) { c.save(); c.strokeStyle = line; c.globalAlpha = la; c.lineWidth = lw; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke(path); c.restore(); }
};

// ---------- Broken-colour repaint (impressionism: Pissarro / Sisley / Guardi / Renoir) ----------
// src: a finished clean canvas (may be wider than the stage, e.g. a dragged sky); returns a new canvas (the caller caches it).
// One small stroke per sample point: a curved stroke, pointed at both ends, along angleFn(x,y), its colour that pixel's colour jittered by "value + warm/cool complement" —
// lights bias toward warm yellow/pink, darks toward cool violet/blue (not plain luminance noise); some points are skipped at random so the ground shows through; stroke order is deterministically shuffled, so thick strokes overpaint thin ones.
// o: cell sampling spacing, len stroke length, wid stroke width, passes number of passes (the second is smaller and more broken up), angle(x,y)→radians, seed, warm/cool complementary jitter colours, sat saturation gain
M.broken = (src, { cell = 9, len = 26, wid = 8, passes = 2, angle = () => 0, seed = 1, warm = [255, 226, 160], cool = [120, 120, 190], jit = 22, skip = 0.1, sat = 1.06, base = true } = {}) => {
  const w = src.width, h = src.height, out = P.canvas(w, h), g = out.getContext('2d');
  const sg = src.getContext('2d', { willReadFrequently: true }), d = sg.getImageData(0, 0, w, h).data, r = rng(seed * 977);
  if (base) { g.filter = 'blur(6px)'; g.drawImage(src, -14, -14, w + 28, h + 28); g.filter = 'none'; }   // expand by 14px, then blur: no semi-transparent halo left at the edges (the row of notched dots on the left edge comes from exactly this)
  g.lineCap = 'round';
  for (let pass = 0; pass < passes; pass++) {
    const cs = cell * (pass ? 0.62 : 1), L = len * (pass ? 0.6 : 1), Wd = wid * (pass ? 0.6 : 1), pts = [];
    for (let y = 0; y < h + cs; y += cs) for (let x = 0; x < w + cs; x += cs) pts.push([x + (r() - .5) * cs, y + (r() - .5) * cs]);
    for (let i = pts.length - 1; i > 0; i--) { const j = (r() * (i + 1)) | 0; [pts[i], pts[j]] = [pts[j], pts[i]]; }
    for (const [x, y] of pts) {
      if (r() < skip) continue;
      const xi = clamp(x | 0, 0, w - 1), yi = clamp(y | 0, 0, h - 1), k = (yi * w + xi) * 4;
      if (d[k + 3] < 8) continue;
      let R = d[k], G = d[k + 1], B = d[k + 2];
      const lum = (R * 0.3 + G * 0.59 + B * 0.11) / 255, t2 = (r() - 0.5) * 2;
      const tint = lum > 0.55 ? warm : cool, tm = Math.abs(t2) * 0.22 * (lum > 0.55 ? lum : 1 - lum);
      R = lerp(R, tint[0], tm) + t2 * jit * 0.5; G = lerp(G, tint[1], tm) + t2 * jit * 0.45; B = lerp(B, tint[2], tm) + t2 * jit * 0.4;
      const mx = (R + G + B) / 3; R = mx + (R - mx) * sat; G = mx + (G - mx) * sat; B = mx + (B - mx) * sat;
      const a = angle(x, y) + (r() - .5) * 0.35, l = L * (0.6 + r() * 0.8), wd = Wd * (0.6 + r() * 0.7), bend = (r() - .5) * 0.5 * l;
      const cx = Math.cos(a), sx = Math.sin(a);
      g.strokeStyle = `rgb(${clamp(R, 0, 255) | 0},${clamp(G, 0, 255) | 0},${clamp(B, 0, 255) | 0})`; g.globalAlpha = 0.9; g.lineWidth = wd;
      g.beginPath(); g.moveTo(x - cx * l / 2, y - sx * l / 2); g.quadraticCurveTo(x - sx * bend, y + cx * bend, x + cx * l / 2, y + sx * l / 2); g.stroke();
    }
  }
  g.globalAlpha = 1; return out;
};

// ---------- Clothed figure with volume ----------
// o: x,y (centre of the feet), h (full height), robe:[light,mid,dark], under (colour showing of the undergarment), mantle (mantle colour set or null), skin, hair,
//    face (-1 facing left / 1 facing right), lean (forward tilt above the hips, radians, positive toward face), bow (head lowered 0..1), gaze:[x,y] (where it looks; draws the pupils),
//    hands:[[x,y],[x,y]] (target points for the two hands, null = hanging naturally), sway (hem swing 0..1), halo (golden halo, none by default), line (outline colour)
// How it is drawn: robe = bell-shaped polygon + light/shade gradient across the width + a few fold lines (dark line plus a bright line beside it); sleeve = two-segment (shoulder→elbow→hand) tapering band; head = ellipse + hair + eyes (the gaze).
// No facial detail: Ghibli-style big eyes and Giotto's sidelong "almond eyes" both express the relationship purely through the pupils leaning toward gaze.
M.figure = (c, o) => {
  const { x, y, h, face = 1, lean = 0, bow = 0, sway = 0, hands = [null, null], gaze = null, halo = false } = o;
  const robe = (o.robe || ['#d98a78', '#b85a4c', '#7a3a34']).map(hex), under = hex(o.under || '#e7d9b0'), skin = hex(o.skin || '#e0b48c'), hairC = hex(o.hair || '#5a3a24'), line = o.line || '#4a2f22';
  const mantle = o.mantle ? o.mantle.map(hex) : null, seed = o.seed || 1, r = rng(seed * 97);
  const hipY = y - h * 0.42, sh = h * 0.2;
  const cs = Math.cos(lean * face), sn = Math.sin(lean * face);
  const up = (dx, dy) => [x + dx * cs - dy * sn * face, hipY + dx * sn * face + dy * cs];          // hip as origin, tilting forward around the hip
  const shL = up(-h * 0.15, -h * 0.30), shR = up(h * 0.15, -h * 0.30), neck = up(0, -h * 0.335);
  const head = [neck[0] + face * h * 0.014 * bow, neck[1] - h * 0.088 + h * 0.025 * bow];
  const hw = h * 0.078, hh = h * 0.094;
  c.save(); c.lineJoin = 'round'; c.lineCap = 'round';

  // Ground shadow
  c.fillStyle = 'rgba(40,28,18,.22)'; c.beginPath(); c.ellipse(x + face * h * 0.03, y + 3, h * 0.22, h * 0.03, 0, 0, TAU); c.fill();

  // --- Robe body ---
  const hemW = h * (0.25 * (o.hemK || 1) + 0.012 * sway), waistW = h * 0.115, sw = Math.sin(o.t * 2.3 + seed) * sway * h * 0.012 || 0;
  const body = new Path2D();
  body.moveTo(shL[0], shL[1]); body.lineTo(neck[0] - h * 0.03, neck[1] + 4); body.lineTo(neck[0] + h * 0.03, neck[1] + 4); body.lineTo(shR[0], shR[1]);
  body.quadraticCurveTo(shR[0] + h * 0.02, hipY - h * 0.1, x + waistW, hipY + h * 0.05);
  body.quadraticCurveTo(x + hemW * 0.9 + sw, y - h * 0.18, x + hemW + sw, y);
  body.quadraticCurveTo(x, y + h * 0.018, x - hemW + sw, y);
  body.quadraticCurveTo(x - hemW * 0.9 + sw, y - h * 0.18, x - waistW, hipY + h * 0.05);
  body.quadraticCurveTo(shL[0] - h * 0.02, hipY - h * 0.1, shL[0], shL[1]); body.closePath();
  const lx = x - face * h * 0.2, gr = c.createLinearGradient(lx, 0, x + face * h * 0.26, 0);               // light comes from the far side: bright on the -face side
  gr.addColorStop(0, css(robe[0])); gr.addColorStop(0.3, css(robe[0])); gr.addColorStop(0.52, css(robe[1])); gr.addColorStop(0.82, css(robe[2])); gr.addColorStop(1, css(robe[2]));
  c.fillStyle = gr; c.fill(body);
  // Folds: first lay in soft broad light-and-shade masses (blurred), then press in one fine hard crease — Giotto's drapery is "broad gradient + a few hard edges", not hatching
  const nF = 5, folds = [];
  for (let i = 0; i < nF; i++) { const q = (i + 0.5) / nF - 0.5; folds.push({ x0: x + q * h * 0.22 + (r() - .5) * h * 0.02, x1: x + q * hemW * 2 * 0.92 + sw * (0.4 + Math.abs(q)), cy: y - h * (0.22 + r() * 0.12), k: 0.7 + r() * 0.6 }); }
  c.save(); c.clip(body);
  c.filter = `blur(${Math.max(2, h * 0.012)}px)`;
  for (const f of folds) { c.strokeStyle = css(robe[2], 0.34 * f.k); c.lineWidth = h * 0.05 * f.k; c.beginPath(); c.moveTo(f.x0, hipY - h * 0.1); c.quadraticCurveTo(f.x0 + (f.x1 - f.x0) * 0.2 + face * h * 0.015, f.cy, f.x1, y - h * 0.01); c.stroke();
    c.strokeStyle = css(robe[0], 0.3 * f.k); c.lineWidth = h * 0.035 * f.k; c.beginPath(); c.moveTo(f.x0 - face * h * 0.04, hipY - h * 0.1); c.quadraticCurveTo(f.x0 + (f.x1 - f.x0) * 0.2 - face * h * 0.03, f.cy, f.x1 - face * h * 0.045, y - h * 0.01); c.stroke(); }
  c.filter = 'none';
  for (const f of folds) { c.strokeStyle = css(robe[2], 0.5); c.lineWidth = h * 0.0065; c.beginPath(); c.moveTo(f.x0, hipY - h * 0.1); c.quadraticCurveTo(f.x0 + (f.x1 - f.x0) * 0.2 + face * h * 0.015, f.cy, f.x1, y - h * 0.01); c.stroke(); }
  // Knee/waist strain: two arc-shaped shadows where the cloth is pushed out
  c.filter = `blur(${h * 0.02}px)`; c.fillStyle = css(robe[2], 0.22); c.beginPath(); c.ellipse(x + face * h * 0.04, hipY + h * 0.12, h * 0.07, h * 0.16, 0.2 * face, 0, TAU); c.fill(); c.filter = 'none';
  // Belt / undergarment hem
  c.fillStyle = css(under, 0.95); c.beginPath(); c.moveTo(x - hemW * 0.5 + sw, y); c.quadraticCurveTo(x + sw, y - h * 0.05, x + hemW * 0.5 + sw, y); c.quadraticCurveTo(x + sw, y + h * 0.015, x - hemW * 0.5 + sw, y); c.fill();
  c.restore();
  c.strokeStyle = line; c.globalAlpha = 0.75; c.lineWidth = Math.max(1.6, h * 0.007); c.stroke(body); c.globalAlpha = 1;

  // --- Mantle: from the shoulder on the back side diagonally across the body to the opposite hip, in heavy broad folds ---
  if (mantle) {
    const back = face > 0 ? shL : shR, front = face > 0 ? shR : shL, sideX = face;
    const mp = new Path2D();
    mp.moveTo(back[0] - sideX * h * 0.03, back[1] - h * 0.03);
    mp.quadraticCurveTo(neck[0], neck[1] - h * 0.015, front[0] + sideX * h * 0.015, front[1] + h * 0.02);
    mp.quadraticCurveTo(front[0] - sideX * h * 0.02, hipY, x - sideX * hemW * 0.05 + sw, y - h * 0.01);
    mp.quadraticCurveTo(x - sideX * hemW * 0.5 + sw, y + h * 0.022, x - sideX * hemW * 1.02 + sw, y);
    mp.quadraticCurveTo(back[0] - sideX * h * 0.16, hipY, back[0] - sideX * h * 0.03, back[1] - h * 0.03); mp.closePath();
    const mg = c.createLinearGradient(x - h * 0.2, 0, x + h * 0.26, 0); mg.addColorStop(0, css(mantle[0])); mg.addColorStop(0.5, css(mantle[1])); mg.addColorStop(1, css(mantle[2]));
    c.fillStyle = mg; c.fill(mp);
    c.save(); c.clip(mp);
    for (let i = 0; i < 5; i++) {
      const q = i / 4, sx = lerp(back[0], front[0], q), ex = x + (q - 0.45) * hemW * 1.8 + sw;
      c.strokeStyle = css(mantle[2], 0.5); c.lineWidth = h * 0.011; c.beginPath(); c.moveTo(sx, lerp(back[1], front[1], q) + h * 0.03); c.quadraticCurveTo(sx + sideX * h * 0.03, hipY + h * 0.03, ex, y - h * 0.01); c.stroke();
      c.strokeStyle = css(mantle[0], 0.4); c.lineWidth = h * 0.006; c.beginPath(); c.moveTo(sx - sideX * h * 0.012, lerp(back[1], front[1], q) + h * 0.03); c.quadraticCurveTo(sx + sideX * h * 0.02, hipY + h * 0.03, ex - sideX * h * 0.014, y - h * 0.01); c.stroke();
    }
    c.restore(); c.strokeStyle = line; c.globalAlpha = 0.7; c.lineWidth = Math.max(1.6, h * 0.007); c.stroke(mp); c.globalAlpha = 1;
  }

  // --- Sleeves and hands: shoulder→elbow→hand, the elbow bending "out and down" ---
  const sleeveCol = mantle ? mantle : robe;
  const arm = (S, T, k) => {
    if (!T) T = [S[0] + (k ? 1 : -1) * h * 0.05, S[1] + h * 0.26];
    const L1 = h * 0.17, L2 = h * 0.16, dx = T[0] - S[0], dy = T[1] - S[1], dist = Math.min(Math.hypot(dx, dy), L1 + L2 - 1), a = Math.atan2(dy, dx);
    const ca = Math.acos(clamp((L1 * L1 + dist * dist - L2 * L2) / (2 * L1 * dist), -1, 1)), side = (T[0] > x ? 1 : -1) * (k ? 1 : -1) || 1;
    const el = [S[0] + Math.cos(a + ca * -side) * L1, S[1] + Math.sin(a + ca * -side) * L1];
    const hd = [S[0] + Math.cos(a) * dist, S[1] + Math.sin(a) * dist];
    const w0 = h * 0.078, w1 = h * 0.058, w2 = h * 0.04;
    const pts = [S, el, hd], nx = i => { const A = pts[Math.max(0, i - 1)], B = pts[Math.min(2, i + 1)], d = Math.hypot(B[0] - A[0], B[1] - A[1]) || 1; return [-(B[1] - A[1]) / d, (B[0] - A[0]) / d]; };
    const W3 = [w0, w1, w2], L = [], R = [];
    for (let i = 0; i < 3; i++) { const n = nx(i); L.push([pts[i][0] + n[0] * W3[i] / 2, pts[i][1] + n[1] * W3[i] / 2]); R.push([pts[i][0] - n[0] * W3[i] / 2, pts[i][1] - n[1] * W3[i] / 2]); }
    const sp = new Path2D(); sp.moveTo(...L[0]); sp.quadraticCurveTo(...L[1], ...L[2]); sp.lineTo(...R[2]); sp.quadraticCurveTo(...R[1], ...R[0]); sp.closePath();
    const sg = c.createLinearGradient(S[0] - h * 0.05, S[1], hd[0] + h * 0.05, hd[1]); sg.addColorStop(0, css(sleeveCol[0])); sg.addColorStop(1, css(sleeveCol[1]));
    c.fillStyle = sg; c.fill(sp); c.strokeStyle = line; c.globalAlpha = 0.7; c.lineWidth = Math.max(1.4, h * 0.006); c.stroke(sp); c.globalAlpha = 1;
    c.strokeStyle = css(sleeveCol[2], 0.4); c.lineWidth = h * 0.007; c.beginPath(); c.moveTo(el[0], el[1]); c.quadraticCurveTo(el[0] + h * 0.01, el[1] + h * 0.03, hd[0] - h * 0.005, hd[1] - h * 0.04); c.stroke();
    c.fillStyle = css(skin); c.strokeStyle = line; c.globalAlpha = 0.8; c.lineWidth = Math.max(1.2, h * 0.005);
    // Hand: palm + thumb + three closed fingers, oriented along the forearm (holding something it reads as a hand, not a disc)
    c.save(); c.translate(hd[0], hd[1]); c.rotate(a);
    c.beginPath(); c.ellipse(h * 0.012, 0, h * 0.028, h * 0.022, 0, 0, TAU); c.fill(); c.stroke();
    c.beginPath(); c.ellipse(h * 0.04, h * 0.002, h * 0.026, h * 0.012, 0.08, 0, TAU); c.fill(); c.stroke();
    c.beginPath(); c.ellipse(h * 0.012, -h * 0.022 * (k ? 1 : -1), h * 0.016, h * 0.008, 0.5 * (k ? 1 : -1), 0, TAU); c.fill(); c.stroke();
    c.restore(); c.globalAlpha = 1;
  };
  arm(face > 0 ? shL : shR, hands[0], 0); arm(face > 0 ? shR : shL, hands[1], 1);

  // --- Head ---
  if (halo) { c.fillStyle = 'rgba(214,170,70,.95)'; c.beginPath(); c.arc(head[0], head[1], hh * 1.55, 0, TAU); c.fill(); c.strokeStyle = 'rgba(120,80,30,.8)'; c.lineWidth = 2; c.stroke(); }
  c.fillStyle = css(hairC); c.beginPath(); c.ellipse(head[0] - face * hw * 0.1, head[1] - hh * 0.12, hw * 1.12, hh * 1.06, 0, 0, TAU); c.fill();
  const fg = c.createLinearGradient(head[0] - hw, head[1], head[0] + hw, head[1]); fg.addColorStop(0, css(mixc(skin, [255, 235, 205], 0.25))); fg.addColorStop(1, css(mixc(skin, [90, 50, 30], 0.35)));
  c.fillStyle = fg; c.beginPath(); c.ellipse(head[0] + face * hw * 0.1, head[1] + hh * 0.1 + h * 0.008 * bow, hw * 0.92, hh * 0.92, 0, 0, TAU); c.fill();
  c.strokeStyle = line; c.globalAlpha = 0.65; c.lineWidth = Math.max(1.2, h * 0.005); c.stroke(); c.globalAlpha = 1;
  // Eyes: almond shaped, the pupils leaning toward gaze; nose: a dark line; mouth: a short line
  const ey = head[1] + hh * 0.12 + h * 0.01 * bow, ex = head[0] + face * hw * 0.22;
  let gx = 0, gy = 0; if (gaze) { const dd = Math.hypot(gaze[0] - ex, gaze[1] - ey) || 1; gx = (gaze[0] - ex) / dd; gy = (gaze[1] - ey) / dd; }
  [-1, 1].forEach(sd => {
    const px = ex + sd * hw * 0.38 * (face > 0 ? 1 : 1) - 0, ew = hw * 0.26;
    c.fillStyle = '#f4ead4'; c.beginPath(); c.ellipse(px, ey, ew, ew * 0.5, 0, 0, TAU); c.fill();
    c.fillStyle = '#2a1c14'; c.beginPath(); c.arc(px + gx * ew * 0.45, ey + gy * ew * 0.25, ew * 0.42, 0, TAU); c.fill();
    c.strokeStyle = line; c.lineWidth = Math.max(1, h * 0.0045); c.beginPath(); c.ellipse(px, ey, ew, ew * 0.5, 0, Math.PI * 1.05, Math.PI * 1.95); c.stroke();
  });
  c.strokeStyle = css(hairC, 0.85); c.lineWidth = Math.max(1.4, h * 0.006); [-1, 1].forEach(sd => { const px = ex + sd * hw * 0.38; c.beginPath(); c.moveTo(px - hw * 0.26, ey - hh * 0.2 + (sd * face > 0 ? 1 : 0) * 2); c.quadraticCurveTo(px, ey - hh * 0.34, px + hw * 0.26, ey - hh * 0.18); c.stroke(); });
  c.fillStyle = css(mixc(skin, [90, 40, 25], 0.28), 0.5); c.beginPath(); c.ellipse(head[0] + face * hw * 0.5, head[1] + hh * 0.55, hw * 0.3, hh * 0.2, 0, 0, TAU); c.fill();      // cheek blush / shadow
  c.fillStyle = css(skin); c.beginPath(); c.ellipse(head[0] - face * hw * 0.82, head[1] + hh * 0.2, hw * 0.14, hh * 0.24, 0, 0, TAU); c.fill();
  if (o.beard) { c.fillStyle = css(mixc(hairC, [190, 180, 165], 0.45), 0.96); c.beginPath(); c.moveTo(head[0] - hw * 0.8, head[1] + hh * 0.28); c.quadraticCurveTo(head[0] - hw * 0.7, head[1] + hh * 1.35, head[0], head[1] + hh * 1.55); c.quadraticCurveTo(head[0] + hw * 0.7, head[1] + hh * 1.35, head[0] + hw * 0.8, head[1] + hh * 0.28); c.quadraticCurveTo(head[0] + hw * 0.35, head[1] + hh * 0.62, head[0], head[1] + hh * 0.6); c.quadraticCurveTo(head[0] - hw * 0.35, head[1] + hh * 0.62, head[0] - hw * 0.8, head[1] + hh * 0.28); c.fill(); }
  c.strokeStyle = css(mixc(skin, [60, 30, 20], 0.5), 0.8); c.lineWidth = Math.max(1, h * 0.0045);
  c.beginPath(); c.moveTo(ex + face * hw * 0.04, ey + hh * 0.08); c.lineTo(ex + face * hw * 0.08, ey + hh * 0.42); c.lineTo(ex - face * hw * 0.05, ey + hh * 0.46); c.stroke();
  c.beginPath(); c.moveTo(ex - hw * 0.14, ey + hh * 0.7); c.quadraticCurveTo(ex, ey + hh * 0.74, ex + hw * 0.14, ey + hh * 0.68); c.stroke();
  c.restore();
};
})();
