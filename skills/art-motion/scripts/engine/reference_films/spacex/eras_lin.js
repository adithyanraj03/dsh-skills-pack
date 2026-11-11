// SpaceX: these 24 years · single-style version (lin). Segment lengths come from spacex/timing.js (the same voiceover as the mixed-style version) — do not hand-edit them.
// Each segment's entrance transition is written by that segment's scene file: ERAS.find(e => e.id === 'sXX').transition = { type, dur } (single-style films often use same = the camera move on one continuous canvas is the transition).
window.PUNCH = 0;
window.SCENE_LIBS = ['spacex/timing.js', 'spacex/tm.js', 'spacex/rockets.js', 'transitions/lin_page.js', 'spacex_lin/presenter_meta.js', 'spacex_lin/common.js'];   // shared by this film: page-flip transition, presenter frame sheet, LIN library (presenter + top bar live in GLOBAL_OVERLAY)
window.SCENE_DIR = 'spacex_lin/scenes';
window.ERAS = ['s01','s02','s03','s04','s05','s06','s07','s08','s09','s10','s11','s12'].map(id => ({ id, get dur() { return TIMING.seg[id].dur; } }));
