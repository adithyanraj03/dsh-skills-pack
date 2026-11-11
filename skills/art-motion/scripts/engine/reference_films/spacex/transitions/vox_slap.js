// The Vox collage desk (vox film) "paper slap" beat: the next card is slapped down on the desk like a fresh sheet — it swings in from off-frame at a tilt and flattens as it lands, covering the previous shot (12fps stepped).
TRANSITIONS.vox_slap = (c, A, B, p, o) => {
  const n = Math.max(1, Math.round(o.dur * 12)), q = Math.floor(p * n + 1e-6) / n, e = MO.quartOut(q), W = o.W, H = o.H;
  c.drawImage(A, 0, 0);
  c.save(); c.fillStyle = `rgba(30,20,10,${0.18 * e})`; c.fillRect(0, 0, W, H); c.restore();
  c.save(); c.translate(W / 2 + (1 - e) * W * 1.08, H / 2 + (1 - e) * 120); c.rotate((1 - e) * 0.16); const s = 1 + 0.03 * (1 - e); c.scale(s, s);
  c.shadowColor = 'rgba(40,30,20,.45)'; c.shadowBlur = 40 * (1 - e) + 6; c.shadowOffsetX = 10; c.shadowOffsetY = 18; c.drawImage(B, -W / 2, -H / 2); c.restore();
};
