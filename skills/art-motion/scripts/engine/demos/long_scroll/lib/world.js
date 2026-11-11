// Film skeleton: one long scroll, N world segments joined end to end, the hero walks from left to right (a horizontal long scroll).
// Each world segment is one file segments/<id>.js that calls WORLD.add({...}); this file handles: the timeline, hero travel, the camera, art-style boundaries, the hero clipped at boundaries, and the collectibles on the hat.
//
// The segment interface (all coordinates are "in-segment world coordinates": x runs from 0 to w, the ground line GROUND=760 is shared by the whole film, so the soles sit at the same height across a boundary):
//   WORLD.add({
//     id: '10_monet', year: 1899, name: 'Monet, Water Lilies',            // corner label: year + name
//     w: 2400,                                                      // segment width (world px), ≥ 1900; includes room for walking and the act
//     hero: { walk: 'monet_walk', mat: 'monet', h: 300 },            // walk frame library (demos/long_scroll/frames/<key>/), material (XING.actor's mat), standing height
//     acts: [ { at: 1100, dur: 1.6, key: 'monet_throw', frame: u => frame index, y: lx => sole y (optional) } ],   // stops at in-segment x=at to perform the act, for dur seconds; frame(u) returns a frame index of that action's library (u = seconds inside the action)
//     ground: lx => y,                                              // optional: ground height function (bridge deck, steps), both ends must return to GROUND
//     back(c, s), front(c, s),                                      // draw background/foreground. s = { camX (in-segment), t (film seconds), lt (seconds since entering the segment), hx (hero's in-segment x), hy, act:{i, u}|null, W:1920, H:1080 }
//                                                                   //   c is already clipped to this segment's band; world coordinate to screen = lx - s.camX
//     seam(c, y, sx, t),                                            // optional: how the boundary entering this segment is drawn (this segment's signature language: deckled paper edge, foam, gold leaf, pixels…), sx = the boundary's x on screen
//     item: { draw(c, x, y, s, t) , gotAt: in-segment seconds }                  // the collectible this segment gives to the hat (drawn in this segment's style); it appears on the hat from gotAt on and then travels with him through all the worlds
//   });
// Preview: index.html?film=demos/long_scroll&only=28_monet,14_8bit lays out only these segments (the world starts at 0); ?from=seconds
(() => {
const W = 1920, H = 1080, { clamp, lerp, ss } = U;
const WD = window.WORLD = { segs: [], GROUND: 760, V: +(new URLSearchParams(location.search).get('v') || 560), HERO_H: 300 };   // walk speed: ?v=560 to try a faster overall pace
WD.add = seg => { WD.segs.push(seg); };
WD.START_X = 320;   // the hero starts at in-segment x=320 (leaving world to the left of the frame)

// Layout: ordered by FILM_ORDER (in demos/long_scroll/eras.js); ?only= filters
WD.layout = () => {
  const q = new URLSearchParams(location.search), only = q.get('only');
  let segs = (window.FILM_ORDER || WD.segs.map(s => s.id)).map(id => WD.segs.find(s => s.id === id)).filter(Boolean);
  if (only) { const set = only.split(','); segs = segs.filter(s => set.includes(s.id)); }
  let x = 0, t = 0; const plan = [];
  for (const s of segs) {
    s.x0 = x; s.x1 = x + s.w;
    // Hero schedule: within a segment, acts cut the run into "walk → stop and perform → walk"
    const acts = (s.acts || []).slice().sort((a, b) => a.at - b.at); let lx = plan.length ? 0 : Math.min(WD.START_X, (acts[0] ? acts[0].at : s.w) - 60);   // the hero starts inside the frame so the whole body is visible at frame 0 (v1 review: the opening showed only half a body)
    s.tIn = t;
    for (const a of acts) { t += (a.at - lx) / (a.v || s.v || WD.V); plan.push({ seg: s, kind: 'walk', t0: t - (a.at - lx) / (a.v || s.v || WD.V), t1: t, x0: x + lx, x1: x + a.at });
      plan.push({ seg: s, kind: 'act', act: a, t0: t, t1: t + a.dur, x0: x + a.at, x1: x + a.at + (a.dx || 0) }); t += a.dur; lx = a.at + (a.dx || 0); }
    const tw = (s.w - lx) / (s.v || WD.V); plan.push({ seg: s, kind: 'walk', t0: t, t1: t + tw, x0: x + lx, x1: x + s.w }); t += tw;
    s.tOut = t; x += s.w;
  }
  WD.plan = plan; WD.total = t + (window.FILM_TAIL || 0); WD.active = segs; return WD;
};
WD.heroAt = t => {
  const p = WD.plan.find(q => t >= q.t0 && t < q.t1) || WD.plan[WD.plan.length - 1];
  const u = clamp((t - p.t0) / Math.max(1e-6, p.t1 - p.t0));
  const x = lerp(p.x0, p.x1, p.kind === 'walk' ? u : (p.act.move ? p.act.move(u) : u));
  return { x, p, u: t - p.t0 };
};
const segAt = x => WD.active.find(s => x >= s.x0 && x < s.x1) || WD.active[WD.active.length - 1];
// Boundary line: a slight wave (each boundary has its own phase)
WD.seamX = (s, y) => s.x0 + 22 * Math.sin(y * 0.011 + s.x0 * 0.001) + 8 * Math.sin(y * 0.047 + s.x0 * 0.003);
const band = (c, a, b, camX) => { c.beginPath();
  for (let y = -10; y <= H + 10; y += 20) c.lineTo(a ? WD.seamX(a, y) - camX : -60, y);
  for (let y = H + 10; y >= -10; y -= 20) c.lineTo(b ? WD.seamX(b, y) - camX : W + 60, y);
  c.closePath(); c.clip(); };

WD.draw = (c, t) => {
  if (!WD.plan) WD.layout();
  const hero = WD.heroAt(t), hs = segAt(hero.x);
  // Camera: the hero sits 38% from the left of the frame; during an act the camera gives ground ahead (act.lead is adjustable), smoothly
  const camX = WD.camAt(t);
  const vis = WD.active.filter(s => s.x1 > camX - 80 && s.x0 < camX + W + 80);
  const ctxFor = s => ({ camX: camX - s.x0, t, lt: t - s.tIn, hx: hero.x - s.x0, act: hero.p.seg === s && hero.p.kind === 'act' ? { a: hero.p.act, u: hero.u } : null, W, H, G: WD.GROUND });
  // Background
  for (const s of vis) { const k = WD.active.indexOf(s), nx = WD.active[k + 1]; c.save(); band(c, k ? s : null, nx, camX); s.back(c, ctxFor(s)); c.restore(); }
  // Hero: clipped at the boundary, each segment using its own art-style frames
  for (const s of vis) {
    if (hero.x < s.x0 - 200 || hero.x > s.x1 + 200) continue;
    const k = WD.active.indexOf(s), nx = WD.active[k + 1], S = ctxFor(s);
    c.save(); band(c, k ? s : null, nx, camX);
    WD.drawHero(c, s, S, hero);
    c.restore();
  }
  // Foreground
  for (const s of vis) { if (!s.front) continue; const k = WD.active.indexOf(s), nx = WD.active[k + 1]; c.save(); band(c, k ? s : null, nx, camX); s.front(c, ctxFor(s)); c.restore(); }
  // The boundary itself (belongs to the segment being entered)
  for (const s of vis) { const k = WD.active.indexOf(s); if (!k) continue; c.save(); for (let y = -10; y < H + 10; y += 6) { const sx = WD.seamX(s, y) - camX; if (sx < -120 || sx > W + 120) break; if (s.seam) s.seam(c, y, sx, t); else { c.fillStyle = '#f4ead2'; c.fillRect(sx - 6, y, 8 + U.hash(y, 3) * 6, 7); } } c.restore(); }
  // Paint burst across boundaries
  for (const s of WD.active) { const k = WD.active.indexOf(s); if (!k) continue; const tc = WD.crossT(s); const a = (t - tc) / 0.5; if (a > 0 && a < 1 && XING.burst) XING.burst(c, s.x0 - camX, WD.GROUND - WD.HERO_H * 0.5, a, 160, s.burst || 'monet', k + 3); }
  // Corner label: year + name (switches with the current segment, fading in on each switch)
  if (window.FILM_LABEL !== false) WD.label(c, hs, t);
};
// Camera: forward only (v1 review: at the end of an act the camera pulled back 68–256px in all 17 segments, which read as "rewinding").
// Target = hero x − 720 + the lead given up during an act (rising only, never falling); take the running maximum to guarantee monotonicity, then Gaussian-smooth it (a monotonic signal convolved with a positive kernel stays monotonic), so stopping and starting never judder.
WD.camAt = t => {
  if (!WD._cam) {
    const R = 120, n = Math.ceil(WD.total * R) + 2, raw = new Float64Array(n), last = WD.active[WD.active.length - 1];
    let mx = -1e9;
    for (let k = 0; k < n; k++) { const tt = k / R, h = WD.heroAt(tt);
      const lead = h.p.kind === 'act' ? (h.p.act.lead ?? 160) * ss(0, 0.6, h.u) : 0;
      mx = Math.max(mx, h.x - 720 + lead); raw[k] = mx; }
    const sig = 0.14 * R, K = Math.ceil(sig * 3), ker = []; let ks = 0; for (let j = -K; j <= K; j++) { const w = Math.exp(-j * j / (2 * sig * sig)); ker.push(w); ks += w; }
    const sm = new Float64Array(n);
    for (let k = 0; k < n; k++) { let a = 0; for (let j = -K; j <= K; j++) a += ker[j + K] * raw[clamp(k + j, 0, n - 1)]; sm[k] = clamp(a / ks, 0, Math.max(0, last.x1 - W)); }
    WD._cam = { R, sm };
  }
  const { R, sm } = WD._cam, f = clamp(t * R, 0, sm.length - 1), k = Math.floor(f), u = f - k;
  return sm[k] + (sm[Math.min(k + 1, sm.length - 1)] - sm[k]) * u;
};
WD.crossT = s => { const p = WD.plan.find(q => q.seg === s); return p ? p.t0 : 0; };
// The film time when act k starts (time in-segment events with this or with s.act.u, never hard-code "the Nth second after entering the segment" — the overall pace is adjusted across the whole film at composite time)
WD.actT = (s, k = 0) => { const ps = WD.plan.filter(q => q.seg === s && q.kind === 'act'); return ps[k] ? ps[k].t0 : s.tIn; };
// Souvenir landing time: item.atAct = seconds after the act starts (recommended); the old form item.gotAt = seconds after entering the segment (misaligns if the walk speed changes)
WD.itemT = g => g.item.atAct != null ? WD.actT(g, g.item.act || 0) + g.item.atAct : g.tIn + (g.item.gotAt ?? (g.tOut - g.tIn) * 0.7);

// Hero: style frames + the collectibles on the hat
WD.drawHero = (c, s, S, hero) => {
  const H0 = s.hero || {}, h = H0.h || WD.HERO_H, lx = hero.x - s.x0;
  const gy = (hero.p.kind === 'act' && hero.p.act.y) ? hero.p.act.y(lx, hero.u) : (s.ground ? s.ground(lx) : WD.GROUND);
  let key = H0.walk, i;
  const walked = WD.plan.filter(q => q.kind === 'walk' && q.t0 <= S.t).reduce((a, q) => a + Math.min(S.t, q.t1) - q.t0, 0);
  if (hero.p.kind === 'act' && hero.p.seg === s) { key = hero.p.act.key || H0.walk; i = hero.p.act.frame ? hero.p.act.frame(hero.u) : 0; }
  else { const n = XING.nFrames(key); i = Math.floor(walked * (H0.fps || 8.5) * WD.V / 330) % n; }   // step rate scales with walk speed      // step rate: 8.5 frames/sec, the same phase across boundaries
  const o = { x: hero.x - S.camX - s.x0 + s.x0 - s.x0, y: gy, h, mat: H0.mat || 'none', t: S.t, wx: hero.x, shadow: H0.shadow ?? 'rgba(0,0,0,.14)', flip: H0.flip };
  o.x = lx - S.camX;
  if (H0.draw) H0.draw(c, key, i, o, S); else XING.actor(c, key, i, o);
  // Collectibles: stacked on the hat top in the order won; each is drawn in the style of the world it came from (the souvenir set)
  // A segment can take over: when s.hideHatItems(S) returns true this draws nothing (the hat is called away or taken off and set on a table, so the segment draws it itself with WD.drawHatStack)
  if (window.FILM_HAT_ITEMS !== true) return;            // hat souvenirs are off by default, keeping the character silhouette clear
  if (s.hideHatItems && s.hideHatItems(S)) return;
  const [tx, ty] = XING.hatTop(key, i, o); WD.drawHatStack(c, tx, ty + 4, h, S.t);
};
// Draw every souvenir won up to time t, bottom-up, at (x, y); returns the stack top's y. Segments call it when they take over the hat (e.g. when the hat flies up, pass the hat's position)
WD.drawHatStack = (c, tx, y, h, t, rot = 0) => {
  c.save(); c.translate(tx, y); c.rotate(rot); y = 0; tx = 0; const S = { t };
  for (const g of WD.active) { if (!g.item) continue; const tg = WD.itemT(g); if (S.t < tg) continue;
    const pop = ss(tg, tg + 0.25, S.t), sc = (g.item.s || 1) * (0.6 + 0.4 * pop) * h / 300;
    const wob = Math.sin(S.t * 6 + g.x0) * 2 * ss(tg, tg + 0.3, S.t);
    c.save(); c.translate(tx + wob, y); g.item.draw(c, 0, 0, sc, S.t); c.restore();
    y -= (g.item.hgt || 26) * sc; }
  c.restore(); return y;
};

WD.label = (c, s, t) => {
  const a = ss(s.tIn, s.tIn + 0.35, t); if (!s.year) return;
  const yr = typeof s.year === 'number' ? (s.year < 0 ? `${-s.year} BC` : String(s.year)) : s.year;
  c.save(); c.globalAlpha = a; c.textAlign = 'right'; c.textBaseline = 'alphabetic';
  c.font = '600 54px "Poppins-700", sans-serif'; const w1 = c.measureText(yr).width;
  c.font = '30px "LXGWWenKai-500", sans-serif'; const w2 = c.measureText(s.name || '').width;
  const bw = Math.max(w1, w2) + 48;                                 // translucent paper backing: the corner label stays legible across worlds (review suggestion)
  c.fillStyle = 'rgba(250,246,236,.78)'; c.beginPath(); c.roundRect(1890 - bw, 50, bw, 118, 14); c.fill();
  c.fillStyle = 'rgba(30,30,40,.88)'; c.font = '600 54px "Poppins-700", sans-serif'; c.fillText(yr, 1866, 108);
  c.font = '30px "LXGWWenKai-500", sans-serif'; c.fillText(s.name || '', 1866, 152); c.restore();
};
})();
