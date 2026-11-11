// t2 · shot 3 (2.4s; the first 0.6s is the middle card "expanding to fullscreen" shared-element transition):
// we have "stepped inside the long-term memory card" — the base is the same frosted glass; a huge number (same figure as the card, not recounted); below it a chat panel tilted back, bubbles popping up in turn; finally the product lockup.
(() => {
const { clamp, lerp } = U;
const W = 1920, H = 1080;
const PW = 1180, PH = 360;
SCENES['t2_s3'] = {
  draw(c, lt, t) {
    t += T2.PHASE;
    const bgc = UI.scratch('t2bg3', W, H), bgx = bgc.getContext('2d');
    T2.bg(bgx, t, { dim: 0.25 });
    const bd = UI.backdrop(bgc, { blur: 40, key: 't2bd3' });
    // fullscreen frosted glass = the card's material scaled to full frame (the same material as the card expanding in the transition)
    c.drawImage(bd, 0, 0, W, H); c.fillStyle = 'rgba(255,255,255,0.075)'; c.fillRect(0, 0, W, H);
    const tg = c.createLinearGradient(0, 0, 0, H * 0.5); tg.addColorStop(0, 'rgba(255,255,255,0.10)'); tg.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = tg; c.fillRect(0, 0, W, H * 0.5);
    // keep the card header at top-left (it sat exactly here on the card before expanding, so viewers know where they are)
    c.fillStyle = 'rgba(255,255,255,0.09)'; c.beginPath(); c.roundRect(120, 96, 84, 84, 20); c.fill();
    UI.icon(c, 'memory', 162, 138, 52, '#f2f2f7', t);
    c.font = `600 44px ${T2.ZH}`; c.fillStyle = '#f5f5f7'; c.textBaseline = 'alphabetic'; c.textAlign = 'left'; c.fillText('Long-term memory', 232, 154);
    // huge number: same figure as on the card ("1M"), never recounted (the card just counted it; counting from 0 again after the expansion stutters the narrative) — the card's number blown up to become the hero
    const pin = MO.appleOut(MO.seg(lt, 0.0, 0.5));
    c.save(); c.textBaseline = 'alphabetic'; c.textAlign = 'left';
    c.font = `600 230px ${T2.SANS}`; T2.track(c, 230, -0.03); const w1 = c.measureText('1').width;
    c.letterSpacing = '0px'; c.font = `600 150px ${T2.ZH}`; const w2 = c.measureText('M').width;
    c.font = `500 56px ${T2.SANS}`; const w3 = c.measureText('tokens').width;
    const x0 = W / 2 - (w1 + w2 + w3 + 34) / 2, by = 400 - (1 - pin) * 20;
    c.font = `600 230px ${T2.SANS}`; T2.track(c, 230, -0.03); c.fillStyle = '#ffffff'; c.fillText('1', x0, by);
    c.letterSpacing = '0px'; c.font = `600 150px ${T2.ZH}`; c.fillText('M', x0 + w1 + 6, by);
    c.font = `500 56px ${T2.SANS}`; c.fillStyle = 'rgba(235,235,245,0.7)'; c.fillText('tokens', x0 + w1 + w2 + 34, by);
    c.restore();
    c.font = `400 34px ${T2.ZH}`; c.fillStyle = 'rgba(235,235,245,0.6)'; c.textAlign = 'center';
    TY.blurIn(c, 'Context window — a whole year of conversation, remembered', W / 2, 478, MO.appleOut(MO.seg(lt, 0.35, 0.95)), { blur: 8, dy: 14 });
    // chat panel (texture → tilted back around X), bubbles pop in on springs one after another; the panel drifts up slowly as a whole
    const tex = UI.scratch('t2panel', PW, PH), g = tex.getContext('2d'); g.reset();
    g.fillStyle = 'rgba(12,12,20,0.55)'; g.beginPath(); g.roundRect(0, 0, PW, PH, 30); g.fill();
    g.strokeStyle = 'rgba(255,255,255,0.16)'; g.lineWidth = 2; g.stroke();
    const bubble = (k, text, right, y, t0) => {
      const s = MO.spring(lt - t0, { duration: 0.5, bounce: 0.15 }); if (lt <= t0) return;
      g.save(); g.globalAlpha = clamp((lt - t0) / 0.2); g.font = `400 34px ${T2.ZH}`;
      const tw = g.measureText(text).width, bw = tw + 64, bh = 74, bx = right ? PW - 48 - bw : 48, by = y + (1 - s) * 40;
      g.translate(bx + (right ? bw : 0), by + bh); g.scale(lerp(0.85, 1, s), lerp(0.85, 1, s)); g.translate(-(bx + (right ? bw : 0)), -(by + bh));
      g.fillStyle = right ? '#3d6bff' : 'rgba(255,255,255,0.14)'; g.beginPath(); g.roundRect(bx, by, bw, bh, 37); g.fill();
      g.fillStyle = '#fff'; g.textBaseline = 'middle'; g.fillText(text, bx + 32, by + bh / 2 + 2); g.restore();
      void k;
    };
    bubble(0, 'Do you remember the trip I mentioned last month?', true, 36, 0.45);
    bubble(1, 'Yes: Kyoto in May, 20,000 budget, no red-eye flights.', false, 134, 0.8);
    bubble(2, 'Then book it for me.', true, 232, 1.15);
    // typing indicator blinking (a constant small motion)
    if (lt > 1.35) { g.fillStyle = `rgba(255,255,255,${0.35 + 0.35 * Math.sin(lt * 9)})`; for (let k = 0; k < 3; k++) { g.beginPath(); g.arc(90 + k * 26, 330, 7, 0, Math.PI * 2); g.fill(); } }
    const pp = MO.spring(lt - 0.3, { duration: 0.8, bounce: 0 });
    c.save(); c.globalAlpha = clamp((lt - 0.3) / 0.3);
    UI.persp(c, tex, { cx: W / 2, cy: 725 + (1 - pp) * 120 - 8 * MO.smooth(clamp(lt / 2.4)), w: PW, h: PH, rx: lerp(0.55, 0.32, pp), persp: 1500, strip: 2 });
    c.restore();
    // lockup: brand name + availability
    c.textAlign = 'center'; c.font = `600 40px ${T2.SANS}`; T2.track(c, 40, -0.01); c.fillStyle = '#ffffff';
    TY.blurIn(c, 'Plover 2 · available today', W / 2, 972, MO.appleOut(MO.seg(lt, 1.2, 1.8)), { blur: 10, dy: 12 });   // settles at 1.8s, holds 0.6s; y=972 sits inside the title-safe area
    c.letterSpacing = '0px';
  },
};
})();
