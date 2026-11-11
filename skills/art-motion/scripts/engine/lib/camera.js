// World camera CAM: an explainer film is not "a series of drawings + transitions" but "one continuous world canvas + one camera".
// Iron rule: the camera is computed only from whole-film time (or this segment's time), and the scene is redrawn from the camera vector every frame — zoom transitions stay crisp, never a 1920 bitmap blown up 20× into mush;
//       the engine keeps drawing the previous segment at t into buffer A during the transition window, so "the previous shot's camera keeps pushing" comes for free (live push).
// cam = { x, y, z, r }: world point (x,y) sits at frame center, zoom z (>1 pushes in), rotation about the center r (radians). Defaults x=960, y=540, z=1, r=0.
(() => {
let W = 1920, H = 1080; U.onStage((w, h) => { W = w; H = h; });   // canvas size follows U.setStage (default 1920×1080)
const { clamp, lerp } = U;
const CAM = window.CAM = {};
const n = cam => ({ x: cam.x ?? W / 2, y: cam.y ?? H / 2, z: cam.z ?? 1, r: cam.r || 0 });

// Apply the camera transform to c (no save/restore — the caller owns that)
CAM.apply = (c, cam) => { const k = n(cam); c.translate(W / 2, H / 2); if (k.r) c.rotate(k.r); c.scale(k.z, k.z); c.translate(-k.x, -k.y); };
// Draw fn(c) under the camera, with automatic save/restore
CAM.with = (c, cam, fn) => { c.save(); CAM.apply(c, cam); fn(c); c.restore(); };
// World → screen / screen → world
CAM.toScreen = (cam, x, y) => { const k = n(cam); let dx = (x - k.x) * k.z, dy = (y - k.y) * k.z; if (k.r) { const cs = Math.cos(k.r), sn = Math.sin(k.r); [dx, dy] = [dx * cs - dy * sn, dx * sn + dy * cs]; } return [W / 2 + dx, H / 2 + dy]; };
CAM.toWorld = (cam, sx, sy) => { const k = n(cam); let dx = sx - W / 2, dy = sy - H / 2; if (k.r) { const cs = Math.cos(-k.r), sn = Math.sin(-k.r); [dx, dy] = [dx * cs - dy * sn, dx * sn + dy * cs]; } return [k.x + dx / k.z, k.y + dy / k.z]; };

// ---------- Zoom ----------
// Log interpolation: z0→z1 magnifies by the same factor every frame, so the viewer feels a constant-rate traversal of scale; linear interpolation starts slow and ends with a jolt. Every push/pull zoom uses it.
CAM.zlerp = (z0, z1, e) => z0 * Math.pow(z1 / z0, e);
// The minimum zoom needed to "fly through a circular opening of radius r that must fill the frame before the transition ends" = distance from the opening's center to the farthest screen corner / r.
// With the opening at frame center this is ≈ 1101/r (the card's "zoom ≥ 1100/radius"). Too low and the opening doesn't cover the frame on the final frame, which pops.
CAM.coverZoom = (r, cx = W / 2, cy = H / 2) => Math.max(Math.hypot(cx, cy), Math.hypot(W - cx, cy), Math.hypot(cx, H - cy), Math.hypot(W - cx, H - cy)) / r;
// Make world point (wx,wy) appear at screen (sx,sy) under zoom z: returns a camera. This is what smoothly carries something to frame center while pushing in.
CAM.anchor = (wx, wy, z, sx, sy) => ({ x: wx - (sx - W / 2) / z, y: wy - (sy - H / 2) / z, z });
// Push onto a world point: from the base camera, zoom log-interpolates to Z (progress e); that point moves on screen from its original position toward frame center (progress k, default = e; k=0 = push in place around it).
// Used for the "dive into the shot" (y1), "fill the frame with the photo then hard cut" (y2), "push onto the newest data point" (t3, k=0).
CAM.pushTo = (base, wx, wy, Z, e, k = e, to = [W / 2, H / 2]) => {
  const s0 = CAM.toScreen(base, wx, wy), z = CAM.zlerp(n(base).z, Z, e);
  return CAM.anchor(wx, wy, z, lerp(s0[0], to[0], k), lerp(s0[1], to[1], k));
};

// ---------- Keyframes ----------
// keys = [{t, x, y, z, r, ease}]; ease applies "from the previous key to this key", default cubicInOut; z uses log interpolation.
// Traveling along a path (Vox desktop, pans/whip-pans across a whiteboard) is just a run of keyframes: smooth movement uses sineInOut, long jumps use cubicInOut + motion blur, following a line uses MO.longTail.
CAM.at = (keys, t) => {
  if (t <= keys[0].t) return { ...keys[0] };
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i];
    if (t <= b.t) { const e = (b.ease || MO.cubicInOut)(MO.seg(t, a.t, b.t));
      return { x: lerp(a.x, b.x, e), y: lerp(a.y, b.y, e), z: CAM.zlerp(a.z, b.z, e), r: lerp(a.r || 0, b.r || 0, e), v: e }; }
  }
  return { ...keys[keys.length - 1] };
};

// ---------- Shot move table (explainers use this; when to use which is in references/camera-language.md) ----------
// The defaults are transitional moves: slow push push, glide to the next thing, pull back pull (0.6–1.5s, sineInOut / long tail); accents: fast push punch, fast move pan, slam-in slam,
// reserved for reveals, numbers, reversals. Durations live in MO.PULSE. Pushing in must have a way back within one film: after pushing in, leave via pull, glide or a hard cut — don't push in shot after shot.
// CAM.track(base, events, t) → cam: base is the starting camera {x, y, z}; events are time-ordered shot moves, and the camera is computed from t alone (deterministic, frame-skippable).
// Each move starts from "the camera at the end of the previous move" and settles at at + dur; when two moves overlap (the next begins before the previous finished), the next continues from where the previous is at that moment.
//   {at, kind: 'push', k?, x?, y?, dur?}    slow push (the default when kind is omitted): z times (1+k) (k defaults to 0.2), 0.9s sineInOut; pass x, y to bring that world point to frame center at the same time.
//   {at, kind: 'pull', k?, x?, y?, z?, dur?} pull back: z times (1+k) (k defaults to -1/6, exactly canceling one default slow push; z: base.z is the surest way back to the whole view), 1.1s long tail. Use it to return to the full view and close a section after pushing in.
//   {at, kind: 'glide', x, y, dur?}         next thing: zoom unchanged, frame center slides smoothly to world point (x, y), 0.7s sineInOut. Moving from one item to the next on the same wall.
//   {at, kind: 'to', x?, y?, z?, dur?, ease?} push to a given camera (pushing onto a patch of a screenshot: compute z with MD.zoomFor); default 0.9s sineInOut, pass dur: MO.PULSE.punch for an accent.
//   {at, kind: 'punch', k?, x?, y?, dur?}   fast push (accent): 0.28s cubicInOut, k defaults to 0.25 (0.18–0.32). k may be negative (a fast pull).
//   {at, kind: 'pan', x, y, dur?}            fast move (accent): same magnitude, 0.30s. For a sudden shift of gaze or comic timing.
//   {at, kind: 'slam', dur?, from?}          full-frame slam-in: z additionally times MO.slamK (1.55→0.94→1.0, 0.17s). For the frame where big type, a number or a stamp lands.
//   {at, kind: 'shake', amp?, dur?}          camera shake: jitter up and down by amp pixels (default 14) within dur (default 4 frames ≈ 0.13s); use on the same frame as a slam or stamp, no more than twice per film.
//   {at, kind: 'cut', x?, y?, z?}            hard cut to that camera (no transition). A new shot size need not be a move; jumping one size up is a hard cut.
// The returned cam carries moving: true/false (whether it is moving at this instant), for motion blur and label visibility.
CAM.track = (base, events, t) => {
  let cam = { x: base.x ?? W / 2, y: base.y ?? H / 2, z: base.z ?? 1 }, zMul = 1, dy = 0, moving = false;
  const evs = [...events].sort((a, b) => a.at - b.at);
  for (const e of evs) {
    if (t < e.at) break;
    const P = MO.PULSE, kind = e.kind || 'push';
    if (kind === 'cut') { cam = { x: e.x ?? cam.x, y: e.y ?? cam.y, z: e.z ?? cam.z }; continue; }
    if (kind === 'slam') { const d = e.dur || P.slam, k = (t - e.at) / d; if (k < 1) { zMul *= MO.slamK(k, e.from); moving = true; } continue; }
    if (kind === 'shake') { const d = e.dur || 4 / 30, k = (t - e.at) / d; if (k < 1) { dy += (e.amp ?? 14) * Math.sin(k * Math.PI * 4) * (1 - k) / cam.z; moving = true; } continue; }
    const D = { pan: P.pan, punch: P.punch, glide: P.glide, pull: P.pull, push: P.push, to: P.push }[kind] ?? P.push;
    const E = kind === 'punch' || kind === 'pan' || (e.dur && e.dur <= 0.35) ? MO.cubicInOut : kind === 'pull' ? MO.longTail : MO.sineInOut;   // a 'to' given an accent-length dur also uses the fast-push curve
    const d = e.dur || D, p = (e.ease || E)(clamp((t - e.at) / d));
    let to;
    if (kind === 'pan' || kind === 'glide') to = { x: e.x ?? cam.x, y: e.y ?? cam.y, z: cam.z };
    else if (kind === 'to') to = { x: e.x ?? cam.x, y: e.y ?? cam.y, z: e.z ?? cam.z };
    else if (kind === 'pull') to = { x: e.x ?? cam.x, y: e.y ?? cam.y, z: e.z ?? cam.z * (1 + (e.k ?? -1 / 6)) };   // default ×5/6, exactly canceling one default slow push (×1.2)
    else to = { x: e.x ?? cam.x, y: e.y ?? cam.y, z: cam.z * (1 + (e.k ?? (kind === 'push' ? 0.2 : P.k))) };
    if (p < 1) moving = true;
    cam = { x: lerp(cam.x, to.x, p), y: lerp(cam.y, to.y, p), z: CAM.zlerp(cam.z, to.z, p) };
  }
  return { x: cam.x, y: cam.y + dy, z: cam.z * zMul, moving };
};

// ---------- Parallax ----------
// d=1 is the subject plane, d<1 is far, d>1 is near. Far layers displace linearly in d and scale as z^d: on a deep push the background barely moves, and that is the feel of depth (Kurzgesagt's 5-layer parallax).
CAM.layer = (c, cam, d, fn) => { const k = n(cam); c.save(); CAM.apply(c, { x: lerp(W / 2, k.x, d), y: lerp(H / 2, k.y, d), z: Math.pow(k.z, d) }); fn(c); c.restore(); };

// ---------- Motion ----------
// The camera's instantaneous on-screen velocity (px/frame at 60fps): camFn(t) → cam. Used by motionBlur.
CAM.velocity = (camFn, t, dt = 1 / 60) => { const a = camFn(t), b = camFn(t - dt); const z = n(a).z; return [(n(a).x - n(b).x) * z, (n(a).y - n(b).y) * z]; };
// Motion blur: stack the whole frame n times along the velocity direction (for fast pans / whip-pans; below 1.5px it degrades to a single draw). Blur length should be shorter than the camera displacement (PremiumBeat).
CAM.motionBlur = (c, src, vx, vy, k = 7) => {
  const sp = Math.hypot(vx, vy); if (sp < 1.5) { c.drawImage(src, 0, 0); return; }
  c.save(); for (let i = 0; i < k; i++) { const q = i / (k - 1) - 0.5; c.globalAlpha = i === 0 ? 1 : 1 / (i + 1); c.drawImage(src, -vx * q, -vy * q); } c.restore();
};
// Handheld micro-drift: two sines of different periods (continuous in time, no flicker), returning [dx, dy] in pixels. Only for art-style frames and pure mood shots; when an explainer shot holds still, it holds still — no drift
CAM.drift = (t, amp = 6, seed = 0) => [amp * Math.sin(t * 0.9 + seed) + amp * 0.4 * Math.sin(t * 2.3 + seed * 2), amp * 0.7 * Math.sin(t * 1.1 + seed * 3)];
})();
