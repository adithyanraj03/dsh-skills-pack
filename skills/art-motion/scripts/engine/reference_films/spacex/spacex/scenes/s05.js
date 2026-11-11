// S05 · 3Blue1Brown physics explainer (t1_3b1b grammar) — "They wanted to fly the rocket's first stage back and reuse it. In December 2015 a Falcon 9 first stage came down upright onto the ground — a first for an orbital rocket; in 2017 a recovered booster flew again."
// Pure black, manim palette (×1.5 saturation), colour = concept and unchanged for the whole segment: white = the vehicle, grey = the ascent track, blue = the booster's return trajectory, yellow = thrust (the vector arrow and the "a first" emphasis), teal = the landing zone.
// One continuous scene, almost no cuts: ascent → separation → flip (boostback burn) → entry burn → landing burn, legs deploy, upright touchdown in the landing zone → Indicate "a first"
//   → 2017: the same booster Transforms back to the pad, grows its second stage, lifts off again (flight no. 2). Stage labels are Written on, following the voiceover cues.
// The vehicle is redrawn to the Falcon 9 proportions in spacex/rockets.js (manim-style white stroke + black fill); the landing legs follow the real structure: hinged at the base, swinging down and out, feet below the engine.
(() => {
const W = 1920, H = 1080, { clamp, lerp } = U, seg = MO.seg, sm = MO.smooth, TAU = Math.PI * 2;
const ID = 's05';
ERAS.find(e => e.id === ID).transition = { type: 'matchCut', dur: 0.6, at: 0.62, width: 0.16 };   // the previous segment pushes into the black label → this segment grows out of the black
const DUR = TM.dur(ID), cue = k => TM.cue(ID, k);
const M = DG.MANIM, ZH = 'PuHui-Medium';
const T = { title: 'Fly the booster back. Reuse it.', sep: 'STAGE SEP', flip: 'FLIP', thrust: 'THRUST', entry: 'ENTRY', land: 'LANDING', y15: '2015.12', first: 'ORBITAL ROCKET · A FIRST', y17: '2017', second: 'FLIGHT NO. 2', lz: 'LANDING ZONE' };

// ---------- moments (all hung off cues) ----------
const tTitle = cue('it wanted to'), tLift = 0.55, tSep = cue('first stage back') + 0.05;
const tFlip = [tSep + 0.1, tSep + 0.75], tBoost = [tSep + 0.6, 3.35], tUpright = [3.35, 4.05], tFins = [3.3, 3.7];
const tY15 = cue('December 2015'), tEntry = [cue('Falcon 9') - 0.3, cue('Falcon 9') + 0.25];
const tLand = cue('came down'), tLburn = [tLand - 0.75, tLand], tLegs = [tLand - 0.6, tLand - 0.08];
const tInd = cue('orbital rocket'), tFirst = cue('a first');
const t17 = cue('2017'), tRetract = [t17 + 0.08, t17 + 0.45], tMove = [t17 + 0.35, t17 + 1.05], tStack = [t17 + 0.8, t17 + 1.3];
const tSecond = cue('recovered booster'), tRelift = cue('flew again') - 0.45;

// ---------- geometry (px; 1 m = K px, proportions from RK.falcon9: first stage 41 m, second stage 13 m, fairing 13 m, diameter 3.7 m) ----------
const K = 4.2, GROUND = 800, PAD = 420, LZ = 700;
const LEGTIP = 3.6;                                   // once deployed the feet sit 3.6 m below the engine plane
const BASE_ON_GROUND = GROUND - 1.0 * K, BASE_ON_LEGS = GROUND - LEGTIP * K;
const HALF = 20.5;                                    // distance from the booster center to its base (m)
const bez = (a, b, c2, d, u) => { const v = 1 - u; return [v * v * v * a[0] + 3 * v * v * u * b[0] + 3 * v * u * u * c2[0] + u * u * u * d[0], v * v * v * a[1] + 3 * v * v * u * b[1] + 3 * v * u * u * c2[1] + u * u * u * d[1]]; };
const ASC = [[PAD, BASE_ON_GROUND], [PAD, 560], [800, 470], [1060, 300]];          // ascent track (vehicle base)
const ascAt = u => bez(...ASC, u);
const ascRot = u => { const a = ascAt(Math.max(0, u - 0.002)), b = ascAt(Math.min(1, u + 0.002)); return Math.atan2(b[0] - a[0], -(b[1] - a[1])); };
const ROT_SEP = ascRot(1), DIR = [Math.sin(ROT_SEP), -Math.cos(ROT_SEP)];
const SEP_BASE = ascAt(1), B0 = [SEP_BASE[0] + DIR[0] * HALF * K, SEP_BASE[1] + DIR[1] * HALF * K];
const LAND_C = [LZ, BASE_ON_LEGS - HALF * K], PAD_C = [PAD, BASE_ON_GROUND - HALF * K];
// booster return trajectory (center point): bursts up-right → boostback flip → comes back down into the landing zone
const RET = (() => { const o = [];
  const P = [B0, [1300, 120], [1090, 60], [910, 200]], Q = [[910, 200], [730, 340], [LZ + 8, 520], LAND_C];
  for (let i = 0; i <= 80; i++) o.push(bez(...P, i / 80)); for (let i = 1; i <= 80; i++) o.push(bez(...Q, i / 80)); return o; })();
const RET_L = DG.cum(RET), RET_LEN = RET_L[RET_L.length - 1];
// time → arc length: the boostback leg (up to just past the top of the flip arc) runs out at its initial speed, the descent leg speeds up first and reaches zero on the landing burn
const L1 = RET_L[80], tCurl = 3.75, e1 = MO.bezier(0.25, 0.35, 0.65, 0.8), e2 = MO.bezier(0.35, 0.25, 0.3, 1);
const retS = t => t < tCurl ? L1 * e1(seg(t, tSep, tCurl)) : L1 + (RET_LEN - L1) * e2(seg(t, tCurl, tLand));
// camera (manim MovingCamera): push into the landing zone before touchdown, pull back to the wide shot for 2017; the title and years sit fixed on screen and do not move with the camera
const CAMK = [
  { t: 0, x: 960, y: 540, z: 1 }, { t: 4.3, x: 960, y: 540, z: 1.02, ease: MO.sineInOut },
  { t: 5.2, x: 760, y: 620, z: 1.3, ease: MO.smooth }, { t: t17, x: 760, y: 620, z: 1.36, ease: MO.sineInOut },
  { t: t17 + 0.8, x: 960, y: 540, z: 1.0, ease: MO.smooth }, { t: DUR + 1, x: 960, y: 535, z: 1.025, ease: MO.linear }];

// ---------- vehicle (metric paths, origin = center of the engine plane, up is −y) ----------
const P2D = () => new Path2D();
const bell = (p, w0, w1, y0, y1) => { p.moveTo(-w0 / 2, y0); p.lineTo(w0 / 2, y0); p.lineTo(w1 / 2, y1); p.lineTo(-w1 / 2, y1); p.closePath(); };
const D = 3.7, H1 = 41;
function boosterPaths(fins, legs) {
  const body = P2D(); body.rect(-D / 2, -H1, D, H1);
  const inter = P2D(); inter.rect(-D / 2, -H1, D, 4.2);
  const eng = P2D(); bell(eng, 1.5, 2.6, 0, 1.0);
  const fn = P2D(), fl = 0.6 + fins * 1.3; fn.rect(-D / 2 - fl, -H1 + 0.7, fl, 1.3); fn.rect(D / 2, -H1 + 0.7, fl, 1.3);
  const lg = P2D(), a = legs * 2.1, L = 9.5;               // hinged at the base: stowed flat against the body pointing up, deployed swinging down and out 120°
  for (const s of [-1, 1]) { const hx = s * D / 2, hy = -1.2, tx = hx + s * Math.sin(a) * L, ty = hy - Math.cos(a) * L;
    lg.moveTo(hx, hy); lg.lineTo(tx, ty); if (legs > 0.05) { const mx = lerp(hx, tx, 0.55), my = lerp(hy, ty, 0.55); lg.moveTo(hx, -8.5); lg.lineTo(mx, my); lg.moveTo(tx - s * 0.9 * legs, ty); lg.lineTo(tx + s * 0.6 * legs, ty); } }
  return { body, inter, eng, fn, lg };
}
const upperPaths = (() => { const s2 = P2D(); s2.rect(-D / 2, -H1 - 13, D, 13);
  const fair = P2D(); fair.rect(-2.6, -H1 - 19.5, 5.2, 6.5);
  const og = RK.ogive(5.2, 6.5, -H1 - 19.5);
  return { s2, fair, og }; })();
const LW = 2.6 / K;
// draw at (x, y), rotated rot (0 = upright); anchor = how many meters above the vehicle base that screen point corresponds to; opt: fins, legs, upper(0..1 second stage grows in), tint(0..1 tinted yellow), s(scale)
function rocket(c, x, y, rot, anchor, { fins = 0, legs = 0, upper = 0, tint = 0, s = 1, alpha = 1, only } = {}) {
  const P = boosterPaths(fins, legs), stroke = tint > 0 ? DG.mix('#ffffff', M.YELLOW, tint) : '#ffffff';
  c.save(); c.globalAlpha *= alpha; c.translate(x, y); c.rotate(rot); c.scale(K * s, K * s); c.translate(0, anchor);
  c.lineJoin = 'round'; c.lineCap = 'round'; c.lineWidth = LW / s; c.strokeStyle = stroke;
  if (only !== 'upper') {
    c.fillStyle = '#000'; c.fill(P.body); c.fillStyle = M.GREY_D; c.fill(P.inter); c.fill(P.eng);
    c.stroke(P.body); c.stroke(P.eng); c.stroke(P.lg); c.fillStyle = '#000'; c.fill(P.fn); c.stroke(P.fn);
  }
  if (upper > 0) {
    c.save(); const top = -H1 - (19.5 + 6.6) * upper; c.beginPath(); c.rect(-4, top, 8, -H1 - top + 0.01); c.clip();
    c.fillStyle = '#000'; c.fill(upperPaths.s2); c.fill(upperPaths.fair); c.fill(upperPaths.og);
    c.stroke(upperPaths.s2); c.stroke(upperPaths.fair); c.stroke(upperPaths.og); c.restore();
  }
  c.restore();
}
// plume: sprays back along the vehicle axis (no glow, two flat manim-style layers), len in pixels
function plume(c, x, y, rot, anchor, len, t, k = 1) {
  if (len <= 0) return;
  c.save(); c.translate(x, y); c.rotate(rot); c.translate(0, anchor * K + 1.0 * K);
  const f = len * (1 + 0.08 * Math.sin(t * 41) + 0.05 * Math.sin(t * 67 + 1)) * k, w = 2.3 * K;
  const lay = (sc, col) => { c.fillStyle = col; c.beginPath(); c.moveTo(-w * sc / 2, 0); c.quadraticCurveTo(-w * sc * 0.6, f * sc * 0.45, 0, f * sc); c.quadraticCurveTo(w * sc * 0.6, f * sc * 0.45, w * sc / 2, 0); c.closePath(); c.fill(); };
  lay(1, DG.rgba(M.GOLD_C, 0.9)); lay(0.55, M.YELLOW);
  c.restore();
}
// vector arrow (manim Arrow: line + solid triangular head)
function arrow(c, x0, y0, x1, y1, col, lw = 6, head = 24) {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy); if (L < 2) return;
  const ux = dx / L, uy = dy / L, hb = Math.min(head, L * 0.5);
  c.save(); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = lw; c.lineCap = 'round';
  c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1 - ux * hb * 0.7, y1 - uy * hb * 0.7); c.stroke();
  c.beginPath(); c.moveTo(x1, y1); c.lineTo(x1 - ux * hb - uy * hb * 0.42, y1 - uy * hb + ux * hb * 0.42); c.lineTo(x1 - ux * hb + uy * hb * 0.42, y1 - uy * hb - ux * hb * 0.42); c.closePath(); c.fill(); c.restore();
}
// Write: the type is set in PuHui (DG.write's default Source Han Serif subset lacks this film's characters); numbers still go through CMU (the LaTeX font)
const wr = (c, text, x, y, size, p, opt = {}) => { if (p <= 0) return; const z = DG.FONT.zh; DG.FONT.zh = ZH; DG.write(c, text, x, y, size, p, opt); DG.FONT.zh = z; };
const line = (c, pts, col, lw, alpha = 1, dash) => { if (pts.length < 2) return; c.save(); c.globalAlpha *= alpha; c.strokeStyle = col; c.lineWidth = lw; c.lineCap = 'round'; c.lineJoin = 'round'; if (dash) c.setLineDash(dash); c.beginPath(); pts.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.stroke(); c.restore(); };
const dot = (c, x, y, a) => { if (a <= 0) return; c.save(); c.globalAlpha *= a; c.fillStyle = '#fff'; c.beginPath(); c.arc(x, y, 6, 0, TAU); c.fill(); c.restore(); };

// ---------- booster state (position, attitude, legs, grid fins, thrust) ----------
function booster(t) {
  if (t < tSep) return null;
  if (t < t17) {
    const p = DG.pointAt(RET, RET_L, retS(t));
    let rot = ROT_SEP;
    rot = lerp(rot, -1.35, sm(seg(t, ...tFlip)));                  // flip: rotate until the nose points back (left)
    rot = lerp(rot, 0, sm(seg(t, ...tUpright)));                    // after the boostback, straighten up and re-enter engine-first
    if (t > tUpright[1] && t < tLand) rot += 0.025 * Math.sin((t - tUpright[1]) * 5.5) * (1 - seg(t, tLburn[0], tLand));
    return { x: p[0], y: p[1], rot, legs: sm(seg(t, ...tLegs)), fins: sm(seg(t, ...tFins)) };
  }
  // 2017: legs stow → Transform back to the pad → second stage grows in → lifts off again
  const m = sm(seg(t, ...tMove)), legs = 1 - sm(seg(t, ...tRetract));
  let x = lerp(LAND_C[0], PAD_C[0], m), y = lerp(LAND_C[1], PAD_C[1], m);
  let rot = 0;
  if (t > tRelift) {                                                // flies again: follows the first ascent track, and past separation keeps going along the tangent out to the upper right (clearing the title)
    const q = (t - tRelift) / 1.0, u = Math.min(1, Math.pow(q, 1.5)), extra = q > 1 ? 900 * (q - 1) + 600 * (q - 1) ** 2 : 0;
    const b = ascAt(u), r = ascRot(u), bx = b[0] + DIR[0] * extra, by = b[1] + DIR[1] * extra;
    rot = r; x = bx + Math.sin(r) * HALF * K; y = by - Math.cos(r) * HALF * K;
  }
  return { x, y, rot, legs, fins: 1 - sm(seg(t, ...tMove)), upper: sm(seg(t, ...tStack)) };
}

SCENES[ID] = {
  init() { U.assertGlyphs(ZH, Object.values(T).filter(s => /[^\x00-\x7f]/.test(s)).join('').replace(/[\x00-\x7f]/g, ''), ID); U.assertGlyphs('CMU-rm', '2015.122017', ID); },
  draw(c, lt) {
    const t = lt;
    c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
    const cam = CAM.at(CAMK, t);
    // —— title (Write, question first then demo), year corner mark: screen coords ——
    wr(c, T.title, 140, 128, 54, seg(t, tTitle, tTitle + 1.0), { align: 'left' });
    { const out = sm(seg(t, t17, t17 + 0.35)); c.save(); c.globalAlpha = 1 - out; c.translate(0, -40 * out); wr(c, T.y15, 1780, 128, 72, seg(t, tY15, tY15 + 0.8), { align: 'right' }); c.restore(); }
    wr(c, T.y17, 1780, 128, 72, seg(t, t17 + 0.2, t17 + 0.8), { align: 'right' });
    c.save(); CAM.apply(c, cam);
    const fade17 = 1 - sm(seg(t, t17, t17 + 0.45));                     // 2017: the old ascent track and the "a first" label fade away
    const dim17 = lerp(1, 0.3, sm(seg(t, t17, t17 + 0.5)));              // the return trajectory and stage labels stay as "history", dimmed

    // —— ground, launch pad, landing zone (Create) ——
    const gq = sm(seg(t, 0.0, 0.42));                                  // by the time the transition reveals (about 0.32s) the horizon, the pad and the rocket are already in the picture
    if (gq > 0) line(c, [[140, GROUND], [lerp(140, 1780, gq), GROUND]], M.GREY_B, 3);
    const pq = sm(seg(t, 0.08, 0.45));
    if (pq > 0) { c.save(); c.globalAlpha = pq; c.strokeStyle = M.GREY_B; c.lineWidth = 3; c.strokeRect(PAD - 34, GROUND, 68, 12); c.restore();
      c.save(); c.strokeStyle = M.TEAL_C; c.lineWidth = 4; c.beginPath(); c.ellipse(LZ, GROUND + 2, 62, 13, 0, Math.PI * (1 - pq), Math.PI * (1 + pq * 2) ); c.stroke(); c.restore();
      c.save(); c.globalAlpha = pq; c.fillStyle = M.TEAL_C; c.font = `34px "${ZH}"`; c.textAlign = 'center'; c.fillText(T.lz, LZ, GROUND + 66); c.restore(); }


    // —— tracks: ascent (grey), second stage carrying on (grey dashed), booster return (blue) ——
    const ua = Math.pow(seg(t, tLift, tSep), 1.5);
    if (t > tLift) { const pts = []; for (let i = 0; i <= 60; i++) pts.push(ascAt(ua * i / 60)); line(c, pts, M.GREY_B, 2.5, fade17); }
    const d2 = t > tSep ? 300 * (t - tSep) + 260 * (t - tSep) ** 2 : 0;
    const U0 = [SEP_BASE[0] + DIR[0] * H1 * K, SEP_BASE[1] + DIR[1] * H1 * K];
    if (d2 > 0) line(c, [U0, [U0[0] + DIR[0] * d2, U0[1] + DIR[1] * d2]], M.GREY_B, 2.5, 0.8 * (1 - sm(seg(t, 4.35, 4.9))), [10, 12]);
    if (t > tRelift) { const u2 = Math.min(1, Math.pow((t - tRelift) / 1.0, 1.5)), pts = []; for (let i = 0; i <= 60; i++) pts.push(ascAt(u2 * i / 60)); line(c, pts, M.GREY_B, 2.5); }
    const bs = t > tSep ? (t < t17 ? retS(t) : RET_LEN) : 0;
    if (bs > 0) { const pts = []; for (let i = 0; i < RET.length && RET_L[i] <= bs; i++) pts.push(RET[i]); pts.push(DG.pointAt(RET, RET_L, bs)); line(c, pts, M.BLUE_C, 4, dim17); }

    // —— stage labels (Write) + dots on the track ——
    const P_FLIP = DG.pointAt(RET, RET_L, retS(tFlip[1])), P_ENTRY = DG.pointAt(RET, RET_L, retS(tEntry[0]));
    // "STAGE SEP" and "FLIP" fade out as the camera pushes into the landing zone (so they do not collide with the year fixed on screen), and return at the historical dimness when 2017 pulls back to the wide shot
    const histA = t < t17 ? 1 - sm(seg(t, 4.35, 4.9)) : 0.3 * sm(seg(t, t17, t17 + 0.5));
    c.save(); c.globalAlpha = histA;
    dot(c, B0[0], B0[1], sm(seg(t, tSep, tSep + 0.2))); wr(c, T.sep, B0[0] + 40, B0[1] + 92, 44, seg(t, tSep + 0.05, tSep + 0.6), { align: 'left' });
    dot(c, P_FLIP[0], P_FLIP[1], sm(seg(t, tFlip[1], tFlip[1] + 0.2))); wr(c, T.flip, 1000, 92, 44, seg(t, tFlip[0] + 0.15, tFlip[0] + 0.7), { align: 'right' });
    c.restore();
    c.save(); c.globalAlpha = dim17;
    dot(c, P_ENTRY[0], P_ENTRY[1], sm(seg(t, tEntry[0], tEntry[0] + 0.2))); wr(c, T.entry, P_ENTRY[0] + 34, P_ENTRY[1] + 16, 44, seg(t, tEntry[0], tEntry[0] + 0.55), { align: 'left' });
    wr(c, T.land, 560, 768, 44, seg(t, tLburn[0] + 0.1, tLburn[0] + 0.65), { align: 'center' });
    c.restore();

    // —— the vehicle ——
    if (t < tSep) {                                                    // full stack: on the pad → liftoff
      const u = t > tLift ? ua : 0, p = ascAt(u), r = ascRot(u), on = sm(seg(t, 0.0, 0.3));
      c.save(); c.globalAlpha = on; c.translate(0, 30 * (1 - on));       // FadeIn(shift=UP)
      if (t > tLift - 0.1) plume(c, p[0], p[1], r, 0, 70 * sm(seg(t, tLift - 0.1, tLift + 0.15)), t);
      rocket(c, p[0], p[1], r, 0, { upper: 1 }); c.restore();
    } else {
      // second stage: keeps flying away along the separation direction (with plume), out of frame
      if (d2 < 1500) { const ux = U0[0] + DIR[0] * d2, uy = U0[1] + DIR[1] * d2; plume(c, ux, uy, ROT_SEP, 0, 60, t); rocket(c, ux, uy, ROT_SEP, H1, { upper: 1, only: 'upper' }); }
      const b = booster(t);
      // thrust: three burns — boostback, entry, landing (the 2017 liftoff burns too)
      const burn = Math.max(sm(seg(t, tBoost[0], tBoost[0] + 0.15)) * (1 - sm(seg(t, tBoost[1] - 0.15, tBoost[1]))),
        sm(seg(t, tEntry[0], tEntry[0] + 0.12)) * (1 - sm(seg(t, tEntry[1] - 0.12, tEntry[1]))),
        sm(seg(t, tLburn[0], tLburn[0] + 0.12)) * (1 - sm(seg(t, tLand - 0.05, tLand + 0.05))),
        sm(seg(t, tRelift - 0.15, tRelift + 0.1)));
      if (b) {
        const ind = DG.indicate(seg(t, tInd, tInd + 0.9));
        if (burn > 0) plume(c, b.x, b.y, b.rot, HALF, 70, t, burn);
        // after 2017 it is the same booster; when the second stage grows in it pivots on the vehicle base (base anchor = center + 20.5 m)
        rocket(c, b.x, b.y, b.rot, HALF, { fins: b.fins, legs: b.legs, upper: b.upper || 0, tint: ind.k, s: t < t17 ? ind.s : 1 });
        // thrust vector (yellow): sticks out from ahead of the nose along the thrust direction — toward the launch site after the flip, upward during entry and landing
        if (burn > 0 && t < t17) {
          const dx = Math.sin(b.rot), dy = -Math.cos(b.rot), r0 = (HALF + 2) * K, L = 120 * burn;
          const x0 = b.x + dx * r0, y0 = b.y + dy * r0; arrow(c, x0, y0, x0 + dx * L, y0 + dy * L, M.YELLOW);
          const tq = seg(t, tBoost[0] + 0.1, tBoost[0] + 0.5) * (1 - seg(t, tBoost[1] - 0.2, tBoost[1]));
          if (tq > 0) { c.save(); c.globalAlpha = Math.min(1, tq * 3); c.fillStyle = M.YELLOW; c.font = `36px "${ZH}"`; c.textAlign = 'center'; c.fillText(T.thrust, x0 + dx * (L + 52), y0 + dy * (L + 52) + 12); c.restore(); }
        }
      }
      // the touchdown: two dust arcs
      const dq = seg(t, tLand, tLand + 0.7);
      if (dq > 0 && dq < 1) { c.save(); c.strokeStyle = M.GREY_B; c.globalAlpha = 1 - dq; c.lineWidth = 3; for (const s of [-1, 1]) { c.beginPath(); c.arc(LZ + s * (40 + 70 * MO.cubicOut(dq)), GROUND - 4, 16 + 20 * dq, Math.PI * (s > 0 ? 1.1 : 1.6), Math.PI * (s > 0 ? 1.4 : 1.9)); c.stroke(); } c.restore(); }
    }

    // —— "a first for an orbital rocket": Circumscribe in yellow + yellow type ——
    DG.circumscribe(c, LZ - 62, LAND_C[1] - HALF * K - 18, 124, (H1 + LEGTIP) * K + 36, seg(t, tFirst - 0.25, tFirst + 0.75), { col: M.YELLOW, lw: 4 });
    c.save(); c.globalAlpha = fade17; wr(c, T.first, 790, 668, 46, seg(t, tFirst, tFirst + 0.8), { align: 'left', col: M.YELLOW }); c.restore();
    // —— 2017: flight no. 2 ——
    wr(c, T.second, 362, 610, 46, seg(t, tSecond, tSecond + 0.8), { align: 'right' });
    c.restore();
  },
};
})();
