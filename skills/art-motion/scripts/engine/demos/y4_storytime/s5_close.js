// S5 close-up (jump in: cut straight to 1.9x from the same setup): "go where?" — arms spread, inner brows raised, a "?" pops above his head, then holds 0.95s for the laugh.
// Rework: the first version put this line in the wide shot where the face was only 110px tall, the expression could not be read, and the film ended 0.4s after the "?" appeared.
(() => {
const S = STORY;
SCENES['s5_close'] = {
  draw(c, lt, t) {
    const ts = MO.step(t, 24);
    const zoom = 1.9 + 0.08 * MO.quintOut(Math.min(1, lt / 1.5));           // after jumping in, an extremely slow extra 4% push
    CAM.with(c, { x: 870, y: 470, z: zoom }, c => {
      const st = S.poseAt(S.KEYS_END, ts), al = S.alive(ts, 165);
      const info = S.world(c, t, { pose: st.pose, expr: st.expr, mouth: TOON.mouth(t), blink: S.blinkAt(ts, [8.3]), look: S.lookEnd(ts), squash: st.squash * al.breathe, bob: al.bob, tilt: ts >= 7.45 ? -0.07 : 0, browUp: ts >= 7.45 ? 0.04 : 0 });
      // "?": pops out the moment the question ends (30% overshoot), then sways ±3°
      const q = MO.at(t, 7.80, 0.26);
      if (q > 0) { c.save(); c.translate(info.head[0] + 165 * 1.4, info.head[1] - 165 * 0.5); c.rotate(0.14 + 0.05 * Math.sin(t * 6)); TOON.mark(c, '?', 0, 0, q, 120); c.restore(); }
    });
  },
};
})();
