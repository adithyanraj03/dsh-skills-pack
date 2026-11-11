// Launch-event UI: gradient blob backdrop (mesh-gradient approximation), frosted-glass cards, pseudo-3D perspective (slicing), sheen sweep, shadow-only drop shadows, line icons.
// Conventions: coordinates are 1920×1080 screen coordinates; the caller computes and passes all animation parameters, this library never reads the clock.
// Card expansion to fullscreen and blur push are transitions (transitions.js expandRect / blurPush).
// Trap: blur pulls transparent pixels in from outside the canvas — drawing into an uncleared offscreen accumulates frame by frame (qa determinism ✗), so lay down the original image first, then composite the blurred version;
//     perspective slices use integer-pixel edges that meet exactly; don't use "overlap 0.75px to hide seams", which produces vertical banding at overlaps under alpha.
(() => {
let W = 1920, H = 1080; U.onStage((w, h) => { W = w; H = h; });   // canvas size follows U.setStage (default 1920×1080)
const { clamp, lerp } = U;
const UI = window.UI = {};
const cvs = {};
const scratch = (k, w, h) => { let c = cvs[k]; if (!c || c.width !== w || c.height !== h) { c = cvs[k] = document.createElement('canvas'); c.width = w; c.height = h; } return c; };
UI.scratch = scratch;

UI.rr = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, r); };
UI.rrPath = (x, y, w, h, r) => { const p = new Path2D(); p.roundRect(x, y, w, h, r); return p; };

// ---------- Gradient blob backdrop (cheap mesh-gradient approximation) ----------
// Draw several radial-gradient blobs on a small canvas (screen compositing) → blur on the small canvas → upscale to fill → overlay static grain to prevent banding.
// blobs: [{x,y,r,col:[r,g,b],a, ax,ay,period,ph}]  positions in screen pixels, ax/ay drift amplitude, period in seconds
UI.mesh = (c, t, { base = '#05060a', blobs = [], blur = 40, scale = 0.25, grain = 0.04, key = 'mesh' } = {}) => {
  const sw = Math.round(W * scale), sh = Math.round(H * scale);
  const a = scratch(key + 'a', sw, sh), g = a.getContext('2d');
  g.globalCompositeOperation = 'source-over'; g.fillStyle = base; g.fillRect(0, 0, sw, sh);
  g.globalCompositeOperation = 'screen';
  for (const b of blobs) {
    const w = 2 * Math.PI / (b.period || 10), ph = b.ph || 0;
    const x = (b.x + (b.ax || 0) * Math.sin(w * t + ph)) * scale, y = (b.y + (b.ay || 0) * Math.cos(w * t * 0.83 + ph)) * scale, r = b.r * scale * (1 + 0.06 * Math.sin(w * t * 1.3 + ph));
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    const [R, G, B] = b.col, A = b.a == null ? 1 : b.a;
    gr.addColorStop(0, `rgba(${R},${G},${B},${A})`); gr.addColorStop(0.45, `rgba(${R},${G},${B},${A * 0.45})`); gr.addColorStop(1, `rgba(${R},${G},${B},0)`);
    g.fillStyle = gr; g.fillRect(0, 0, sw, sh);
  }
  const bb = scratch(key + 'b', sw, sh), gb = bb.getContext('2d');
  // Lay down the unblurred original first, then the blurred version: blur pulls transparent pixels in from outside the canvas, edges go semi-transparent — an uncleared offscreen accumulates frame by frame (that is where the qa determinism ✗ comes from)
  gb.clearRect(0, 0, sw, sh); gb.drawImage(a, 0, 0); gb.filter = `blur(${blur * scale}px)`; gb.drawImage(a, 0, 0); gb.filter = 'none';
  c.save(); c.imageSmoothingQuality = 'high'; c.drawImage(bb, 0, 0, W, H);
  if (grain) { c.globalAlpha = grain; c.drawImage(UI.grainTex(), 0, 0); }
  c.restore();
};
// Static grain (fixed seed): fights banding in large gradients under 8-bit video encoding
UI.grainTex = () => PAINT.cached('gl_grain' + W + 'x' + H, W, H, (g) => {
  const r = U.rng(77), im = g.createImageData(W, H), d = im.data;
  for (let i = 0; i < d.length; i += 4) { const v = r() * 255; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
  g.putImageData(im, 0, 0);
});

// ---------- Blurred copy of the background (for frosted-glass sampling) ----------
UI.backdrop = (src, { scale = 0.25, blur = 28, key = 'bd' } = {}) => {
  const sw = Math.round(W * scale), sh = Math.round(H * scale);
  const a = scratch(key, sw, sh), g = a.getContext('2d');
  g.clearRect(0, 0, sw, sh); g.drawImage(src, 0, 0, sw, sh); g.filter = `blur(${blur * scale}px)`; g.drawImage(src, 0, 0, sw, sh); g.filter = 'none';   // as above: lay down the original first to prevent transparent edges
  return a;
};

// ---------- Shadows (draw only the shadow, not the shape: move the shape offscreen, offset the shadow back) ----------
UI.shadow = (c, x, y, w, h, r, { blur = 60, oy = 28, alpha = 0.45 } = {}) => {
  c.save(); c.shadowColor = `rgba(0,0,0,${alpha})`; c.shadowBlur = blur; c.shadowOffsetX = 4000; c.shadowOffsetY = oy;
  c.fillStyle = '#000'; UI.rr(c, x - 4000, y, w, h, r); c.fill(); c.restore();
};

// ---------- Frosted-glass cards ----------
// bd = result of UI.backdrop(...); sample = screen rectangle to sample (defaults to the card's position; pass screen coordinates when the card is drawn into an offscreen texture)
UI.glass = (c, { x, y, w, h, r = 28, bd, sample, tint = 0.07, stroke = 0.22, light = 0.16, shadow = true }) => {
  if (shadow) UI.shadow(c, x, y, w, h, r, { blur: 70, oy: 30, alpha: 0.5 });
  c.save(); UI.rr(c, x, y, w, h, r); c.clip();
  if (bd) { const s = bd.width / W, S = sample || { x, y, w, h }; c.drawImage(bd, S.x * s, S.y * s, S.w * s, S.h * s, x, y, w, h); }
  c.fillStyle = `rgba(255,255,255,${tint})`; c.fillRect(x, y, w, h);
  // top light: a soft bright band along the upper edge (gives the glass thickness)
  const g = c.createLinearGradient(0, y, 0, y + h * 0.5); g.addColorStop(0, `rgba(255,255,255,${light})`); g.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = g; c.fillRect(x, y, w, h * 0.5);
  c.restore();
  // 1px border: bright at upper left, dark at lower right (light from upper left)
  c.save(); const sg = c.createLinearGradient(x, y, x + w, y + h);
  sg.addColorStop(0, `rgba(255,255,255,${stroke * 1.8})`); sg.addColorStop(0.5, `rgba(255,255,255,${stroke * 0.5})`); sg.addColorStop(1, `rgba(255,255,255,${stroke})`);
  c.strokeStyle = sg; c.lineWidth = 1.5; UI.rr(c, x + 0.75, y + 0.75, w - 1.5, h - 1.5, r); c.stroke(); c.restore();
};

// ---------- Sheen sweep ----------
// Sweep a slanted bright band left to right inside the clip region; p∈[0,1]; band width = width; angle in radians
// comp: default 'lighter' (over the frame); on a text-only offscreen use 'source-atop' (light lands only on the glyphs)
UI.sheen = (c, clipPath, p, { x0 = 0, x1 = W, width = 260, angle = -0.35, alpha = 0.32, col = '255,255,255', comp = 'lighter' } = {}) => {
  if (p <= 0 || p >= 1) return;
  const cx = lerp(x0 - width * 2, x1 + width * 2, p);
  c.save(); if (clipPath) c.clip(clipPath);
  c.globalCompositeOperation = comp;
  c.translate(cx, H / 2); c.rotate(angle);
  const g = c.createLinearGradient(-width, 0, width, 0);
  g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(0.5, `rgba(${col},${alpha})`); g.addColorStop(1, `rgba(${col},0)`);
  c.fillStyle = g; c.fillRect(-width, -H * 1.5, width * 2, H * 3);
  c.restore();
};

// ---------- Pseudo-3D: rotate a texture about the Y axis (vertical slices) or X axis (horizontal slices) ----------
// tex: card texture (any resolution), screen center cx,cy, screen size w×h (unrotated), ry/rx radians, persp perspective distance (px)
// far side darkens by shade (0..1) to simulate side light. Slice width strip px.
// Slice edges snap to integer pixels and meet exactly (no overlap, no gap): the old "overlap 0.75px to hide seams" trick stacks alpha at overlaps with translucent textures/alpha drawing, producing vertical/horizontal bands.
// Also draw into an offscreen first and composite it back at alpha, so fading the whole card in/out produces no banding.
UI.persp = (c0, tex, { cx, cy, w, h, ry = 0, rx = 0, persp = 1600, strip = 3, shade = 0.35, alpha = 1 }) => {
  const sc = scratch('persp', W, H), c = sc.getContext('2d'); c.reset();
  c.save();
  const tw = tex.width, th = tex.height;
  if (Math.abs(ry) >= Math.abs(rx)) {
    const n = Math.max(8, Math.ceil(w / strip)), cs = Math.cos(ry), sn = Math.sin(ry);
    const P = u => { const X = (u - 0.5) * w, z = X * sn, s = persp / (persp + z); return [cx + X * cs * s, s]; };
    for (let i = 0; i < n; i++) {
      const u0 = i / n, u1 = (i + 1) / n, [x0, s0] = P(u0), [x1, s1] = P(u1), s = (s0 + s1) / 2;
      const hh = h * s, xa = Math.round(Math.min(x0, x1)), xb = Math.round(Math.max(x0, x1)); if (xb > xa) c.drawImage(tex, u0 * tw, 0, (u1 - u0) * tw, th, xa, cy - hh / 2, xb - xa, hh);
    }
    if (shade && ry) { // darken the side rotating away from the viewer
      const [xa] = P(0), [xb] = P(1), g = c.createLinearGradient(xa, 0, xb, 0), k = Math.min(1, Math.abs(Math.sin(ry)) * 2) * shade;
      g.addColorStop(0, `rgba(0,0,0,${ry > 0 ? 0 : k})`); g.addColorStop(1, `rgba(0,0,0,${ry > 0 ? k : 0})`);
      c.globalCompositeOperation = 'source-atop'; c.fillStyle = g; c.fillRect(Math.min(xa, xb), cy - h, Math.abs(xb - xa), h * 2);
    }
  } else {
    const n = Math.max(8, Math.ceil(h / strip)), cs = Math.cos(rx), sn = Math.sin(rx);
    const P = v => { const Y = (v - 0.5) * h, z = -Y * sn, s = persp / (persp + z); return [cy + Y * cs * s, s]; };
    for (let i = 0; i < n; i++) {
      const v0 = i / n, v1 = (i + 1) / n, [y0, s0] = P(v0), [y1, s1] = P(v1), s = (s0 + s1) / 2;
      const ww = w * s, ya = Math.round(Math.min(y0, y1)), yb = Math.round(Math.max(y0, y1)); if (yb > ya) c.drawImage(tex, 0, v0 * th, tw, (v1 - v0) * th, cx - ww / 2, ya, ww, yb - ya);
    }
  }
  c.restore();
  c0.save(); c0.globalAlpha *= alpha; c0.drawImage(sc, 0, 0); c0.restore();
};

// ---------- Line icons (SF Symbols feel: round caps, uniform stroke width) ----------
UI.icon = (c, kind, x, y, s, col, t = 0, lw = 0.075) => {
  c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = lw; c.lineCap = 'round'; c.lineJoin = 'round';
  if (kind === 'wave') {                    // voice: 5 bouncing bars
    const hs = [0.35, 0.7, 1, 0.6, 0.3];
    hs.forEach((h0, i) => { const h = h0 * (0.75 + 0.25 * Math.sin(t * 7 + i * 1.3)); const xx = -0.4 + i * 0.2; c.beginPath(); c.moveTo(xx, -h * 0.45); c.lineTo(xx, h * 0.45); c.stroke(); });
  } else if (kind === 'memory') {           // memory: three stacked plates
    for (let k = 0; k < 3; k++) { const yy = -0.28 + k * 0.24 + 0.02 * Math.sin(t * 2 + k); c.beginPath(); c.moveTo(-0.45, yy); c.lineTo(0, yy - 0.18); c.lineTo(0.45, yy); c.lineTo(0, yy + 0.18); c.closePath(); c.globalAlpha = k === 0 ? 1 : 0.6; c.stroke(); }
  } else if (kind === 'agent') {            // agent: four-point star + small star
    const r = 0.42 * (1 + 0.05 * Math.sin(t * 3));
    c.beginPath(); c.moveTo(0, -r); c.quadraticCurveTo(0, 0, r, 0); c.quadraticCurveTo(0, 0, 0, r); c.quadraticCurveTo(0, 0, -r, 0); c.quadraticCurveTo(0, 0, 0, -r); c.fill();
    const r2 = 0.16; c.translate(0.36, -0.36); c.beginPath(); c.moveTo(0, -r2); c.quadraticCurveTo(0, 0, r2, 0); c.quadraticCurveTo(0, 0, 0, r2); c.quadraticCurveTo(0, 0, -r2, 0); c.quadraticCurveTo(0, 0, 0, -r2); c.globalAlpha = 0.7; c.fill();
  }
  c.restore();
};
})();
