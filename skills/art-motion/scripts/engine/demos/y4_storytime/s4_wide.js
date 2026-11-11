// S4 wide shot (the same room pulled back to 0.5x): tiny Huashu sitting in a big room. Voiceover: "I asked it: these…"
// The wide shot makes him look small and helpless — the long shot is the setup for the punchline. Rework: in the two pauses he glances at the laptop then back to camera, and says "these" while pointing at it.
// Motion: lip sync, eyes (glance at the laptop at 6.2 → back to camera at 6.6), settle back after a pose change (talk → point), lamp swing, clouds, screen flicker, extremely slow pull-back.
(() => {
const S = STORY;
SCENES['s4_wide'] = {
  draw(c, lt, t) {
    const ts = MO.step(t, 24);
    const zoom = 0.53 - 0.03 * MO.quintOut(Math.min(1, lt / 1.65));          // 0.53 → 0.50
    CAM.with(c, { x: 900, y: 470, z: zoom }, c => {
      const st = S.poseAt(S.KEYS_END, ts), al = S.alive(ts, 165);
      S.world(c, t, { pose: st.pose, expr: st.expr, mouth: TOON.mouth(t), blink: S.blinkAt(ts), look: S.lookEnd(ts), squash: st.squash * al.breathe, bob: al.bob, lw: 10 });
    });
  },
};
})();
