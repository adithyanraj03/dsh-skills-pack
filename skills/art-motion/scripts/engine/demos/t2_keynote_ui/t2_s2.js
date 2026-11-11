// t2 · shot 2 (3.0s): three frosted-glass feature cards enter in 3D space (spring, bounce 0.15, staggered 0.1s) and rotate upright around Y;
// the numbers on the cards count up; the group keeps floating; light sweeps across the three cards; at the end the middle card is "selected" (scales up, the others recede and dim), handing off to the shared-element expansion.
(() => {
const { clamp, lerp } = U;
const W = 1920, H = 1080;
const CW = 480, CH_ = 580, GAP = 52, CY = 560, R = 36;
const CARDS = [
  { icon: 'wave', title: 'Live voice', desc: 'Natural, like a phone call', num: 320, dec: 0, unit: 'ms', label: 'End-to-end latency' },
  { icon: 'memory', title: 'Long-term memory', desc: 'Remembers every preference', num: 1, dec: 0, unit: 'M', label: 'tokens of context' },
  { icon: 'agent', title: 'Autonomy', desc: 'Breaks down tasks, calls tools', num: 87, dec: 0, unit: '%', label: 'Tasks done in one pass' },
];
const DUR = 3.0, FOCUS = 2.15;                         // the middle card is selected from 2.15s
// each card's state at lt (screen centre, rotation, scale, opacity); the transition also needs the middle card's final rect
const state = (i, lt, t) => {
  const t0 = 0.05 + i * 0.1;                           // stagger 0.1s
  const sp = MO.spring(lt - t0, { duration: 0.75, bounce: 0.15 });
  const f = MO.smooth(MO.seg(lt, FOCUS, FOCUS + 0.6));
  const floatAmp = lerp(1, i === 1 ? 0 : 0.6, f);      // the selected card stops floating so the transition can expand from a stable rect
  const cx = 960 + (i - 1) * (CW + GAP) + (i - 1) * 40 * f;
  const cy = CY + (1 - sp) * 170 + MO.float(t, 7, 3.4 + i * 0.45, i * 2) * floatAmp;
  const ry = (1 - sp) * (i - 1 || 0.001) * -0.55 + 0.06 * Math.sin(t * 0.9 + i) * floatAmp + (i - 1) * 0.12 * f;
  const sc = (0.9 + 0.1 * sp) * (i === 1 ? lerp(1, 1.06, f) : lerp(1, 0.94, f));
  const a = clamp((lt - t0) / 0.25) * (i === 1 ? 1 : lerp(1, 0.45, f));
  return { cx, cy, ry, sc, a, t0 };
};
const cardRectAt = (lt, t) => { const s = state(1, lt, t); return { x: s.cx - CW * s.sc / 2, y: s.cy - CH_ * s.sc / 2, w: CW * s.sc, h: CH_ * s.sc }; };

SCENES['t2_s2'] = {
  cardRectAt, CW, CH: CH_,
  draw(c, lt, t) {
    t += T2.PHASE;
    const bgc = UI.scratch('t2bg', W, H), bgx = bgc.getContext('2d');
    T2.bg(bgx, t); c.drawImage(bgc, 0, 0);
    const bd = UI.backdrop(bgc, { blur: 40, key: 't2bd' });
    // draw the sides first, then the middle (the middle card sits on top)
    [0, 2, 1].forEach(i => {
      const S = state(i, lt, t); if (S.a <= 0) return;
      const d = CARDS[i], cw = CW * S.sc, ch = CH_ * S.sc;
      // card texture: frosted glass (samples the background at the card's screen position) + content
      const tex = UI.scratch('t2card' + i, CW + 120, CH_ + 120), g = tex.getContext('2d'); g.reset();
      const ox = 60, oy = 60;
      UI.glass(g, { x: ox, y: oy, w: CW, h: CH_, r: R, bd, sample: { x: S.cx - cw / 2, y: S.cy - ch / 2, w: cw, h: ch }, tint: 0.075, stroke: 0.2, light: 0.14, shadow: false });
      g.save(); g.translate(ox, oy);
      // icon plate: concentric radii (child radius = parent radius − padding)
      const pad = 44; g.fillStyle = 'rgba(255,255,255,0.09)'; g.beginPath(); g.roundRect(pad, pad, 96, 96, R - 14); g.fill();
      UI.icon(g, d.icon, pad + 48, pad + 48, 60, '#f2f2f7', t);
      g.textBaseline = 'alphabetic'; g.textAlign = 'left';
      g.font = `600 50px ${T2.ZH}`; g.fillStyle = '#f5f5f7'; g.fillText(d.title, pad, 230);
      g.font = `400 28px ${T2.ZH}`; g.fillStyle = 'rgba(235,235,245,0.62)'; g.fillText(d.desc, pad, 278);
      // divider
      g.fillStyle = 'rgba(255,255,255,0.12)'; g.fillRect(pad, 330, CW - pad * 2, 1.5);
      // big number: counts for 0.9s starting 0.25s after the card settles (easeOutExpo, the last digit eases in), tabular so nothing jitters
      const v = TY.count(lt, S.t0 + 0.35, 0.9, 0, d.num);
      g.font = `600 132px ${T2.SANS}`; T2.track(g, 132, -0.03); g.fillStyle = '#ffffff';
      const nw = TY.tabular(g, TY.fmt(v, d.dec), pad, 488);
      g.letterSpacing = '0px'; g.font = `500 52px ${T2.SANS}`; g.fillStyle = 'rgba(235,235,245,0.7)'; g.fillText(d.unit, pad + nw + 10, 488);
      g.font = `400 28px ${T2.ZH}`; g.fillStyle = 'rgba(235,235,245,0.55)'; g.fillText(d.label, pad, 535);
      g.restore();
      // light sweep: crosses the whole group left to right over 1.2–2.0s (each card computes progress from its own screen position, so it reads as one beam)
      const sp = MO.seg(lt, 1.15, 2.05), gx = lerp(-200, W + 200, sp), lx = (gx - (S.cx - cw / 2)) / cw;
      if (sp > 0 && sp < 1) UI.sheen(g, UI.rrPath(ox, oy, CW, CH_, R), clamp((lx + 0.35) / 1.7), { x0: ox, x1: ox + CW, width: 110, angle: -0.35, alpha: 0.22 });
      // shadow (at the on-screen projected size) + perspective blit
      c.save(); c.globalAlpha = S.a;
      UI.shadow(c, S.cx - cw / 2 + 10, S.cy - ch / 2 + 20, cw - 20, ch - 20, R, { blur: 80, oy: 40, alpha: 0.55 });
      UI.persp(c, tex, { cx: S.cx, cy: S.cy, w: (CW + 120) * S.sc, h: (CH_ + 120) * S.sc, ry: S.ry, persp: 1800, strip: 3, shade: 0.4 });
      c.restore();
    });
  },
};
})();
