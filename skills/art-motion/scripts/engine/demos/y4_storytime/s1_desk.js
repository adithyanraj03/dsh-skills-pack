// S1 medium shot: Huashu sits behind the desk talking to camera. Voiceover: "The first time I let AI write code for me,"
// Motion: lip sync (voiceover envelope, on twos), talking nods, breathing, settle back after a pose change (talk → point), eyes following the hand, blinking, clouds outside, slow camera push + micro drift.
// Room, desk and laptop all live in world.js (S4/S5 are the same room with a different lens).
(() => {
const S = STORY;
const KEYS = [[0, 'talk', 'happy'], [1.12, 'point', 'talk']];
SCENES['s1_desk'] = {
  draw(c, lt, t) {
    const ts = MO.step(t, 24);                                     // the character runs at 24fps (Flash's default frame rate), the camera stays smooth at 60fps
    const zoom = 1.01 + 0.035 * MO.expoOut(Math.min(1, lt / 2.0)) + 0.03 * (1 - MO.expoOut(Math.min(1, lt / 0.5)));   // opening 1.04→1.01 settle, then a 3.5% slow push
    const [dx, dy] = CAM.drift(t, 4, 1);
    CAM.with(c, { x: 900 + dx, y: 520 + dy, z: zoom }, c => {
      const st = S.poseAt(KEYS, ts), al = S.alive(ts, 165);
      S.world(c, t, { pose: st.pose, expr: st.expr, mouth: TOON.mouth(t), blink: S.blinkAt(ts), look: ts > 1.12 ? [1, 0] : [0, 0], squash: st.squash * al.breathe, bob: al.bob, tilt: ts > 1.12 ? 0.05 : -0.03 });
    });
  },
};
})();
