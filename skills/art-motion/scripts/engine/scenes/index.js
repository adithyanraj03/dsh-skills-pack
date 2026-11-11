// Loads scenes/<id>.js by id; auto-loads transitions/<type>.js by transition.type (synchronous XHR, so everything is registered before the engine starts).
// If a scene is missing its file, has a syntax error, fails to register, or a transition name is in neither TRANSITIONS nor transitions/ → record it in window.__bootErrors,
// the engine refuses to start, and render.py/qa.py report the error and exit.
// (Migration test B hit this: a missing scene used to draw a "to be implemented" placeholder and render normally, 1.2 seconds of gray, only caught by a 0.0% frame diff; a mistyped transition name silently degraded to a crossfade.)
(() => {
  window.SCENES = window.SCENES || {}; window.__bootErrors = [];
  const load = (url) => { const x = new XMLHttpRequest(); x.open('GET', url, false); try { x.send(); } catch (err) { return { err: `request failed ${err}` }; }
    if (x.status !== 200) return { err: `${url} does not exist (HTTP ${x.status})` };
    try { (0, eval)(x.responseText + `\n//# sourceURL=${url}`); } catch (err) { return { err: `${url} threw while running ${err && err.stack || err}` }; } return {}; };
  // A film can load its own shared scripts first (window.SCENE_LIBS, in order); the scene-file directory is window.SCENE_DIR (default scenes).
  // A shared script that already registered SCENES[id] is not looked up as a separate scene file (that is how the demos/ sample films are organised).
  for (const f of window.SCENE_LIBS || []) { const r = load(f); if (r.err) __bootErrors.push(`shared script ${r.err}`); }
  const dir = window.SCENE_DIR || 'scenes';
  for (const e of ERAS) {
    if (!e.draw) {                                          // an era that inlines draw needs no file
      const r = SCENES[e.id] ? {} : load(`${dir}/${e.id}.js`);
      if (r.err) { __bootErrors.push(`${e.id}: ${r.err}`); continue; }
      const sc = SCENES[e.id];
      if (!sc || typeof sc.draw !== 'function') { __bootErrors.push(`${e.id}: the file has no SCENES['${e.id}'] = { draw(c, lt, t) }`); continue; }
      e.draw = sc.draw; if (sc.init) e.init = sc.init;
    }
    const ty = e.transition && e.transition.type;
    if (ty && !TRANSITIONS[ty]) {                            // the project's own transition: put it in transitions/<type>.js and hang a same-named function on TRANSITIONS
      const r = load(`transitions/${ty}.js`);
      if (r.err || !TRANSITIONS[ty]) __bootErrors.push(`${e.id}: transition "${ty}" is not in transitions.js, and there is no transitions/${ty}.js (${r.err || 'the file did not register TRANSITIONS.' + ty})`);
    }
  }
})();
