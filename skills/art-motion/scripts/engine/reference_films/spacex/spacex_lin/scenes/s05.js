// S05 · Booster recovery (slow push segment, three facts): ① Falcon 9 cutaway: "2nd stage" and "1st stage" labels, the 1st stage glows, separates, flies back to the ground along a U-shaped dashed arrow, a "reuse" loop arrow
// ② Dec 2015: the first stage drops out of the sky, deploys its landing legs, ignites to slow down, lands upright on the landing pad, dust + "a first among orbital rockets"
// ③ 2017: the same first stage gets a "reused" round badge and lifts off again. Transition: diagonal yellow-blue bands sweep across (lin_wipe).
(() => {
const ID = 's05', L = LIN, { C, TAU } = L, { clamp, lerp } = U;
let Q = null;
const q = () => Q || (Q = { jz: TM.cue(ID, '接着呢'), yj: L.cueN(ID, '一级', 0), fhl: TM.cue(ID, '飞回来'), cfy: TM.cue(ID, '重复用'), y15: TM.cue(ID, '2015年12月'),
  lyh: TM.cue(ID, '猎鹰9号'), szh: TM.cue(ID, '竖着'), dm: TM.cue(ID, '地面'), dmE: TM.end(ID, '地面'), gd: TM.cue(ID, '轨道火箭'), tyh: TM.cue(ID, '头一回'), y17: TM.cue(ID, '2017年'),
  hs: TM.cue(ID, '回收的'), yyc: TM.cue(ID, '又一次'), fst: TM.cue(ID, '飞上了天') });

const SX = 1.75, SXA = 2.5;   // the cutaway is a bit fatter                                   // Falcon 9 widened horizontally (icon-ized)
function recycle(g, lt, s) {                        // recycle arrow icon
  g.save(); g.scale(s, s); g.rotate(lt * 1.2); g.lineCap = 'round'; g.lineJoin = 'round';
  for (let i = 0; i < 3; i++) { g.save(); g.rotate(i * TAU / 3);
    g.strokeStyle = C.ink; g.lineWidth = 22; g.beginPath(); g.arc(0, 0, 60, -0.95, 0.75); g.stroke(); g.strokeStyle = C.teal; g.lineWidth = 13; g.stroke();
    g.fillStyle = C.teal; g.strokeStyle = C.ink; g.lineWidth = 4; const a = 0.75, x = Math.cos(a) * 60, y = Math.sin(a) * 60;
    g.beginPath(); g.moveTo(x + Math.cos(a) * 24, y + Math.sin(a) * 24); g.lineTo(x - Math.cos(a) * 24, y - Math.sin(a) * 24); g.lineTo(x - Math.sin(a) * 30, y + Math.cos(a) * 30); g.closePath(); g.fill(); g.stroke();
    g.restore(); }
  g.restore();
}
function pageA(g, lt) {
  const Qv = q(), x = 900, base = 860, pxm = 8.4;
  const sep = clamp((lt - Qv.fhl + 0.05) / 0.35);                     // first stage separation
  const glow = clamp((lt - Qv.yj) / 0.2);
  // 2nd stage (upper half): keeps flying up and away after separation
  const up = sep > 0 ? Math.pow(Math.max(0, lt - Qv.fhl), 2) * 900 : 0;
  g.save(); g.beginPath(); g.rect(0, 0, 1920, base - 41 * pxm - 2 + 0); g.clip();
  L.rocket(g, RK.falcon9({ payload: 'fairing' }), x, base - up, pxm, { sx: SXA, flame: sep > 0 ? 0.8 : 0, lt });
  g.restore();
  // 1st stage: after separation it holds and glows first, then flips back along the U-shaped arrow (the frame only draws the trajectory arrow, with a small rocket travelling along it)
  g.save(); g.beginPath(); g.rect(0, base - 41 * pxm - 2, 1920, 1080); g.clip();
  const fuA = MO.sineInOut(clamp((lt - Qv.fhl - 0.25) / 0.9));   // the 1st stage "becomes" the small rocket flying along the arrow: the one in place fades out at the same time
  g.globalAlpha *= 1 - clamp(fuA * 2.5);
  if (glow > 0) { g.save(); g.shadowColor = 'rgba(255,212,71,0.95)'; g.shadowBlur = 40 * glow; L.rocket(g, F9B(), x, base, pxm, { sx: SXA, pal: { body: glow > 0.5 ? '#FFF2C2' : C.white } }); g.restore(); }
  else L.rocket(g, F9B(), x, base, pxm, { sx: SXA });
  g.restore();
  // labels
  const kl = L.popK(lt, Qv.jz + 0.4, 0.4, 2);
  if (kl > 0) { L.at(g, x - 200, base - 470, kl, h => L.kw(h, '2ND STAGE', 0, 0, { size: 38, fill: C.white, col: C.ink })); L.arrow(g, lt, x - 140, base - 470, x - 40, base - 440, kl, { seed: 4, bend: -10, lw: 5, head: 18 }); }
  const k1 = L.popK(lt, Qv.yj - 0.05, 0.4, 2.6);
  if (k1 > 0) { L.at(g, x - 210, base - 200, k1, h => L.kw(h, '1ST STAGE', 0, 0, { size: 48, fill: C.yel, col: C.ink })); L.arrow(g, lt, x - 140, base - 200, x - 40, base - 210, k1, { seed: 5, bend: 10, lw: 5, head: 18 }); }
  // the 2nd stage carries on up: a dashed arc leads to the small satellite in the top-right corner (orbit insertion), setting up the contrast with the 1st stage "turning around and flying back"
  const up2 = MO.cubicOut(clamp((lt - Qv.fhl - 0.1) / 0.7));
  if (up2 > 0) { L.arrow(g, lt, x + 40, base - 600, 1240, 190, up2, { seed: 13, bend: 90, lw: 6, dash: [14, 12], head: 22 }); if (up2 > 0.9) L.sat(g, 1290, 170, 1.4, 0, 0); }
  // U-shaped "fly back" arrow: arches from the top of the 1st stage over to the landing pad on the right
  const ap = MO.cubicOut(clamp((lt - Qv.fhl) / 0.55));
  L.arrow(g, lt, x + 60, base - 380, 1420, base - 60, ap, { seed: 6, bend: -260, lw: 8, dash: [18, 14] });
  // the little 1st stage flies back along the arrow (same arc formula as arrow())
  const fu = MO.sineInOut(clamp((lt - Qv.fhl - 0.25) / 0.9));
  if (fu > 0 && fu < 1) { const x0 = x + 60, y0 = base - 380, x1 = 1420, y1 = base - 60, dx = x1 - x0, dy = y1 - y0, Ln = Math.hypot(dx, dy), nx = -dy / Ln, ny = dx / Ln;
    const P = u => [x0 + dx * u + nx * Math.sin(Math.PI * u) * -260, y0 + dy * u + ny * Math.sin(Math.PI * u) * -260], [px, py] = P(fu), [qx, qy] = P(Math.min(1, fu + 0.02));
    L.rocket(g, F9B(fu > 0.7 ? 1 : 0, 1), px, py, 3.2, { sx: SX, rot: Math.atan2(qy - py, qx - px) - Math.PI / 2, flame: fu > 0.75 ? 0.8 : 0, lt }); }
  if (ap > 0) L.at(g, 1420, base + 14, ap, h => { h.lineWidth = 4.5; h.strokeStyle = C.ink; h.fillStyle = C.steelD; h.beginPath(); h.ellipse(0, 0, 110, 22, 0, 0, TAU); h.fill(); h.stroke(); });
  const kr = L.popK(lt, Qv.cfy - 0.05, 0.45, 2.2);
  if (kr > 0) L.at(g, 1520, 360, kr, h => { recycle(h, lt, 0.9); L.kw(h, 'REUSE', 0, 130, { size: 50, fill: C.teal }); });
}
const F9B = (legs = 0, fins = 0) => RK.falcon9({ legs, fins, stage: 'booster' });
// ② landing ③ reflight: the same first stage
const LX = 1180, GY = 820, PXM = 9.2;
function boosterAt(lt) {
  const Qv = q(), tA = Qv.y15 - 0.1, tD = Qv.dm + 0.05;           // tD = touchdown
  if (lt < tD) { const u = clamp((lt - tA) / (tD - tA)), e = 1 - Math.pow(1 - u, 2.2); return { a: clamp(u / 0.15), y: lerp(520, GY, e), legs: clamp((lt - (tD - 0.9)) / 0.6), flame: lt > tD - 1.2 ? 1 : 0.25, fins: 1, rot: 0.25 * (1 - MO.smooth(clamp(u * 1.4))) }; }
  const tL = Qv.fst - 0.35;
  if (lt < tL) return { y: GY, legs: lt > Qv.hs ? 1 - clamp((lt - Qv.yyc) / 0.4) : 1, flame: lt < tD + 0.15 ? 1 : 0, fins: 1, rot: 0 };
  const k = lt - tL; return { y: GY - k * k * 900, legs: 0, flame: 1.3, fins: 0, rot: 0 };
}
function pageB(g, lt) {
  const Qv = q(); if (lt < Qv.y15 - 0.4) return;
  // ground + landing pad
  g.save(); g.lineWidth = 5; g.strokeStyle = C.ink; g.fillStyle = '#EADFCB'; g.beginPath(); g.rect(0, GY + 12, 1920, 300); g.fill();   // the ground spans the full width so the presenter stands on it too
  g.beginPath(); g.moveTo(0, GY + 12); g.lineTo(1920, GY + 12); g.stroke();
  g.fillStyle = C.steelD; g.beginPath(); g.ellipse(LX, GY + 14, 150, 24, 0, 0, TAU); g.fill(); g.stroke(); g.restore();
  // return trajectory: a dashed line sweeping down from high on the left (the 1st stage flies back along it)
  const tp = MO.cubicOut(clamp((lt - Qv.y15 + 0.1) / 1.2));
  if (tp > 0 && lt < Qv.y17) { g.save(); g.setLineDash([16, 14]); g.lineDashOffset = -lt * 50; g.lineWidth = 5; g.strokeStyle = C.ink; g.globalAlpha = 0.4; g.lineCap = 'round';
    g.beginPath(); for (let i = 0; i <= 30; i++) { const u = i / 30 * tp, x = lerp(640, LX, u) , y = lerp(140, GY - 420, Math.pow(u, 0.6)); i ? g.lineTo(x - (1 - u) * (1 - u) * 0, y) : g.moveTo(x, y); } g.stroke(); g.restore(); }
  const b = boosterAt(lt), Bs = RK.falcon9({ legs: b.legs, fins: b.fins, stage: 'booster' });
  // the one that flies again in 2017 is not the one that landed in 2015 (verified: SES-10 used another recovered booster): the 2015 one slides out of frame and another "recovered stage" is hoisted onto the pad
  const sw = Qv.y17 - 0.05, so = MO.cubicIn(clamp((lt - sw) / 0.4)), si = MO.cubicOut(clamp((lt - sw - 0.25) / 0.45));
  if (lt < sw + 0.4) { g.save(); g.globalAlpha *= (b.a ?? 1) * clamp((b.y - 420) / 160) * (1 - so); L.rocket(g, RK.falcon9({ legs: lt < sw ? b.legs : 1, fins: 1, stage: 'booster' }), LX - 700 * so, lt < sw ? b.y : GY, PXM, { sx: SX, flame: lt < sw ? b.flame : 0, lt, rot: lt < sw ? b.rot : 0 }); g.restore(); }
  if (lt > sw + 0.25) { const yIn = lt < sw + 0.7 ? lerp(GY - 300, GY, si) : b.y; g.save(); g.globalAlpha *= clamp((lt - sw - 0.25) / 0.2) * clamp((yIn - 420) / 160);
    L.rocket(g, RK.falcon9({ legs: lt < sw + 0.7 ? 1 : b.legs, fins: b.fins, stage: 'booster' }), LX, yIn, PXM, { sx: SX, flame: lt < sw + 0.7 ? 0 : b.flame, lt, rot: 0, pal: { body: '#ECE6DA' } });   // body yellowed and worn: a stage that has flown
    g.restore(); }
  // touchdown dust + radiating lines
  const kd = lt - (Qv.dm + 0.05);
  L.dust(g, LX, GY + 6, kd, { spread: 280, seed: 77 });
  L.burstLines(g, LX, GY - 200, 300, 380, clamp(kd / 0.5), { n: 12, col: C.ink, lw: 6 });
  // labels
  const kn = L.popK(lt, Qv.lyh - 0.05, 0.4, 2);
  if (kn > 0 && lt < Qv.y17) L.at(g, LX - 330, 380, kn, h => L.kw(h, 'FALCON 9 STAGE 1', 0, 0, { size: 40, fill: C.white, col: C.ink }));
  const ks = L.popK(lt, Qv.szh, 0.38, 2.4);
  if (ks > 0 && lt < Qv.y17) L.at(g, LX + 330, 520, ks, h => { h.lineCap = 'round'; h.strokeStyle = C.ink; h.lineWidth = 8; h.beginPath(); h.moveTo(0, -110); h.lineTo(0, 110); h.stroke();
      for (const d of [-1, 1]) { h.beginPath(); h.moveTo(-20, d * 86); h.lineTo(0, d * 112); h.lineTo(20, d * 86); h.stroke(); }
      L.kw(h, 'LANDS UPRIGHT', 80, 0, { size: 40, fill: C.yel, col: C.ink, align: 'left' }); });
  const kt = L.popK(lt, Qv.tyh - 0.05, 0.42, 2.6);
  if (kt > 0 && lt < Qv.y17 + 0.2) { g.save(); g.globalAlpha = 1 - L.outK(lt, Qv.y17 - 0.1, 0.25);
    L.at(g, 1580, 300, kt, h => { L.txt(h, 'OF ORBITAL ROCKETS', 0, -70, 38, { align: 'center', col: C.sub }); L.kw(h, 'A FIRST!', 0, 0, { size: 64, fill: C.red }); }, -0.05);
    L.twinkles(g, lt, [[1390, 230], [1780, 240], [1760, 390]], { r: 20 }); g.restore(); }
  // ③ 2017: stick on the "reused" round badge and fly once more
  const kh = L.popK(lt, Qv.hs - 0.05, 0.36, 2.8);
  if (kh > 0 && b.y > 300) L.at(g, LX + 70, b.y - 250, kh, h => { h.lineWidth = 5; h.strokeStyle = C.ink; h.beginPath(); h.arc(0, 0, 58, 0, TAU); h.fillStyle = C.teal; h.fill(); h.stroke();
      L.txt(h, 'REUSED', 0, 3, 34, { col: C.white, align: 'center', base: 'middle' }); }, 0.15);
  const kq = L.popK(lt, Qv.fst - 0.15, 0.4, 2.2);   // after the rocket leaves, a small card stays on the pad
  if (kq > 0) L.at(g, LX, GY - 150, kq, h => { L.kw(h, 'REUSED STAGE · FLIES AGAIN', 0, 0, { size: 48, fill: C.white, col: C.ink }); }, -0.03);
  const ky = L.popK(lt, Qv.yyc - 0.05, 0.4, 2.4);
  if (ky > 0) L.at(g, 1580, 330, ky, h => L.kw(h, 'FLIES AGAIN', 0, 0, { size: 54, fill: C.blue }), 0.04);
}

SCENES[ID] = {
  init() { U.assertGlyphs('PuHui-Heavy', '2ND STAGE 1ST STAGE REUSE DEC 2015 FALCON 9 STAGE 1 LANDS UPRIGHT OF ORBITAL ROCKETS A FIRST! 2017 REUSED STAGE · FLIES AGAIN', ID); },
  draw(c, lt) {
    L.CUR_T = L.T0(ID) + lt;
    const Qv = q();
    L.bg(c, lt, { seed: 2615 });
    // in-page switch: when "Dec 2015" is spoken the paper rolls up (the content only travels up/down to the right of the presenter and never sweeps across him); the page header doesn't roll, it swaps in place
    const sw = MO.cubicInOut(clamp((lt - (Qv.y15 - 0.4)) / 0.5));
    if (sw < 1) { c.save(); c.globalAlpha = Math.max(0, 1 - 2 * sw); c.translate(0, -1080 * sw); pageA(c, lt); c.restore(); }
    if (sw > 0) { c.save(); c.translate(0, 1080 * (1 - sw)); pageB(c, lt); c.restore(); }
    if (lt < Qv.y15 - 0.15) L.pageTitle(c, lt, 'BOOSTER RECOVERY', Qv.jz, { col: C.teal, size: 42 });
    else if (lt < Qv.y17 - 0.05) L.pageTitle(c, lt, 'DEC 2015', Qv.y15 - 0.1, { col: C.red, size: 44 }); else L.pageTitle(c, lt, '2017', Qv.y17 - 0.05, { col: C.red, size: 46 });
  },
};
ERAS.find(e => e.id === ID).transition = { type: 'lin_wipe', dur: 0.6, cols: [C.yel, C.blue] };
L.cast(ID, [
  { t: 0.05, pose: 'think', fr: 'talk' },
  { t: TM.cue(ID, '2015年12月') - 0.1, pose: 'stick', fr: 'talk', x: 560, walk: 0.8 },   // walk up to the landing pad to explain
  { t: TM.cue(ID, '地面') + 0.05, pose: 'wow', fr: 'bounce' },
  { t: TM.cue(ID, '2017年') - 0.05, pose: 'point', fr: 'talk' },
  { t: TM.cue(ID, '飞上了天') - 0.2, pose: 'cheer', fr: 'bounce' },
  { t: TM.dur(ID) - 0.32, pose: 'walk', fr: 'walk', x: -260, walk: 0.32 },   // only at the end of the segment does he hurry out of frame, and the next segment enters from the right straight away
]);
L.year(ID, [[TM.cue(ID, '2015年12月'), 2015], [TM.cue(ID, '2017年'), 2017]]);
})();
