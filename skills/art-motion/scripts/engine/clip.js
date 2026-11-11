// Parametric clip runtime: one spec (JSON) → one animation whose duration is exactly spec.duration. Used as the "animation segment" of the voiceover video pipeline.
// The contract is in references/09-video-animation-grammars.md, "clip contract". Difference from engine.js: no section table / transitions, one grammar is one draw(c, t, ctx), and the canvas size comes from the spec (portrait works too).
//
// spec.finish (optional): final-look treatment layer, a preset soft / film / punch / clean or an object, see lib/finish.js; ignored in alpha mode.
// spec = { grammar, duration, fps=30, width=1920, height=1080, safe?: {top,bottom,left,right (px, left free for subtitles/platform UI), fill? (paint the freed edges this color)}, theme?, alpha?, data?, cues: [{at, kind, text?, sub?, data?, image?, frames?, fps?, dur?}] }
// spec.theme: the palette shared by the whole film (lib/palettes.js) — a name (paper poster ink navy bauhaus snow wood chalk), {name, keys to override}, or a complete 6-key {bg, surface, ink, sub, accent, accent2}.
//   Resolved into ctx.pal (complete 6 keys + name) and each grammar colors from it; a wrong name / missing key → boot failure. Omitted → ctx.pal = null and each grammar uses its own default colors.
//   A grammar can declare legacyTheme(theme) → true: that theme is its own legacy spelling (t3's 'light' / 'dark' / old theme object), it is not resolved as a palette and the grammar keeps reading ctx.theme.
// Asset paths (render.py checks that they exist and rewrites them through spec_assets.py): cue.image, cue.frames (frame sequence: a directory or an array of paths), data.image, data.character.frames (the y4 frame library).
// If any single one fails to load → boot failure, refuse to render (never a blank frame). Fetching assets inside a grammar: ctx.still(q) = the still for that cue (the first frame when frames exist), ctx.frame(q, t) = the frame to draw at time t.
// A grammar file clips/<grammar>.js registers CLIPS[grammar] = { init?(ctx), draw(c, t, ctx), safe?: true (write it only once you lay out against ctx.safe / ctx.box, otherwise spec.safe warns) }.
// Alignment convention (CLIP.lt): the cue's "reveal frame" is the frame at at — the element is first visible on frame t = at, and the animation's internal time starts from at − 1 frame.
(() => {
const cv = document.getElementById('c'), c = cv.getContext('2d');
window.__canvas = cv;
window.CLIPS = window.CLIPS || {};
const C = window.CLIP = {};
const fail = msg => { window.__bootFailed = msg; console.error('CLIP BOOT FAILED\n' + msg); };

// ---------- Small helpers for grammar files ----------
// In-clip time: the cue becomes visible on frame at
C.lt = (t, at, fps) => t - at + 1 / fps;
// Progress: 0→1 over dur seconds from at (already >0 on frame at)
C.p = (t, at, dur, fps) => U.clamp(C.lt(t, at, fps) / dur);
// Fit proportionally into a box (contain, no crop): returns {x, y, w, h}
C.fit = (iw, ih, bx, by, bw, bh) => { const s = Math.min(bw / iw, bh / ih); const w = iw * s, h = ih * s; return { x: bx + (bw - w) / 2, y: by + (bh - h) / 2, w, h, s }; };
// Normalized rect [x,y,w,h] (0..1, relative to the image) → screen rect
C.sub = (r, box) => ({ x: box.x + r[0] * box.w, y: box.y + r[1] * box.h, w: r[2] * box.w, h: r[3] * box.h });
C.text = (cue, ...fallback) => (cue && (cue.text ?? cue.data?.text)) ?? fallback.find(v => v != null) ?? '';

async function boot() {
  let spec = window.CLIP_SPEC;
  if (!spec) {                                                           // preview: ?spec=<path relative to engine>
    const u = new URLSearchParams(location.search).get('spec');
    if (!u) return fail('No spec: render.py --spec injects window.CLIP_SPEC; for the preview use clip.html?spec=examples/<name>.json');
    spec = await (await fetch(u)).json();
    const base = u.replace(/[^/]*$/, '');
    const fix = p => p && !/^(data:|https?:|\/)/.test(p) ? base + p : p;   // preview mode: frames must be an array of paths (the browser cannot list a directory), a frame library must be written as {frames: {pose: path}}
    (spec.cues || []).forEach(q => { if (q.image) q.image = fix(q.image); if (Array.isArray(q.frames)) q.frames = q.frames.map(fix); });
    if (spec.data && spec.data.image) spec.data.image = fix(spec.data.image);
    const ch = spec.data && spec.data.character; if (ch && typeof ch === 'object' && ch.frames && typeof ch.frames === 'object') for (const k in ch.frames) ch.frames[k] = fix(ch.frames[k]);
  }
  if (location.search.includes('render=1')) document.body.classList.add('render');
  const W = spec.width || 1920, H = spec.height || 1080, FPS = spec.fps || 30;
  if (!spec.grammar) return fail('spec is missing grammar');
  if (!(spec.duration > 0)) return fail('spec.duration must be > 0');
  cv.width = W; cv.height = H; U.setStage(W, H);
  // grammar file (synchronous XHR + eval with a sourceURL, so errors can be located)
  const x = new XMLHttpRequest(); x.open('GET', `clips/${spec.grammar}.js`, false);
  try { x.send(); } catch (e) { return fail('Failed to request the grammar file ' + e); }
  if (x.status !== 200) return fail(`No such grammar: clips/${spec.grammar}.js (HTTP ${x.status})`);
  try { (0, eval)(x.responseText + `\n//# sourceURL=clips/${spec.grammar}.js`); } catch (e) { return fail(`clips/${spec.grammar}.js threw while executing ${e.stack || e}`); }
  const G = CLIPS[spec.grammar]; if (!G || typeof G.draw !== 'function') return fail(`clips/${spec.grammar}.js did not register CLIPS['${spec.grammar}'] = { draw }`);
  // theme palette: validate it before loading assets, so a typo does not wait for the images for nothing
  let pal = null;
  if (!(G.legacyTheme && G.legacyTheme(spec.theme))) { try { pal = PAL.resolve(spec.theme); } catch (e) { return fail(e.message); } }
  // final-look layer (spec.finish): a wrong preset name should not wait for the images for nothing
  let fin = null; try { fin = FINISH.resolve(spec.finish); } catch (e) { return fail(e.message); }
  // images
  const IMG = {}, urls = new Set();
  for (const q of (spec.cues || [])) {
    if (q.image) urls.add(q.image);
    if (q.frames != null) { if (!Array.isArray(q.frames) || !q.frames.length) return fail(`frames of cue ${q.kind} at=${q.at} must be a non-empty array of paths (render.py expands a directory into an array; preview mode only accepts an array)`); q.frames.forEach(f => urls.add(f)); }
  }
  if (spec.data && spec.data.image) urls.add(spec.data.image);
  const chr = spec.data && spec.data.character;
  if (chr && typeof chr === 'object') { if (!chr.frames || typeof chr.frames !== 'object' || Array.isArray(chr.frames)) return fail('data.character written as an object needs frames: {pose name: image path} (or give a frame-library directory in render.py)');
    Object.values(chr.frames).forEach(f => urls.add(f)); }
  try { await Promise.all([...urls].map(u => new Promise((res, rej) => { const im = new Image(); im.onload = () => { IMG[u] = im; res(); }; im.onerror = () => rej(u); im.src = u; }))); }
  catch (u) { return fail('Image failed to load: ' + u); }
  // fonts + glyph check (missing glyphs for text in the spec only warn: the system-font fallback still renders, but it will look different on another machine)
  for (const f of (window.FONT_FACES || [])) { const ff = new FontFace(f.family, `url(${f.url})`, f.desc || {}); await ff.load(); document.fonts.add(ff); }
  await document.fonts.ready; await U.loadCmaps();
  const cues0 = (spec.cues || []).map((q, i) => ({ ...q, i, at: +q.at || 0 })).sort((a, b) => a.at - b.at || a.i - b.i);
  for (const q of cues0) if (q.at > spec.duration + 1e-9) console.warn(`cue ${q.kind} at=${q.at} is past the clip duration ${spec.duration}s, never visible, dropped (takes no layout space)`);
  const cues = cues0.filter(q => q.at <= spec.duration + 1e-9);   // cues that are never visible do not reach the grammar: otherwise they would still take layout space and still be counted by the progress track
  // each grammar used to read its own caption field for number (t2/t3 read text, y5 reads sub) and a typo silently gave no text. Unified: text and sub are aliases of each other, and data.text counts too
  for (const q of cues) if (q.kind === 'number') { const cap = q.text ?? q.sub ?? (q.data && q.data.text); if (cap != null) { q.text = cap; q.sub = cap; } }
  const safe = { top: 0, bottom: 0, left: 0, right: 0, ...(spec.safe || {}) };   // freed edges (px): the pipeline burns in subtitles and platform UI presses in here, grammars with type do not lay out into it
  const box = { x: safe.left, y: safe.top, w: W - safe.left - safe.right, h: H - safe.top - safe.bottom };   // the content box after freeing, grammar layout uses it (ctx.box)
  const ctx = { spec, data: spec.data || {}, theme: spec.theme || {}, pal, cues, W, H, FPS, u: Math.min(W, H) / 1080, portrait: H > W, alpha: !!spec.alpha, IMG, dur: spec.duration, safe, box,
    of: (...kinds) => cues.filter(q => kinds.includes(q.kind)), lt: (t, at) => C.lt(t, at, FPS), p: (t, at, d) => C.p(t, at, d, FPS),
    // assets: still = the one used to fix the layout (image, or the first frame of frames); frame = which frame to draw at t (frames play from at at q.fps (default 30), stop on the last frame when done, q.loop loops)
    still: q => q && (q.image ? IMG[q.image] : q.frames ? IMG[q.frames[0]] : null),
    frame: (q, t) => !q ? null : q.frames ? MD.frameAt(q.frames.map(f => IMG[f]), t - q.at, q.fps || 30, !!q.loop) : q.image ? IMG[q.image] : null };
  if (G.fonts) { const txt = cues.map(q => [q.text, q.sub, q.data && q.data.text].filter(Boolean).join('')).join('') + JSON.stringify(spec.data || {});
    for (const fam of G.fonts) { const miss = U.missingGlyphs(fam, [...txt].filter(ch => ch.codePointAt(0) >= 0x2E80).join(''));   /* only check Han characters and full-width symbols: Latin/Greek/math symbols have their own fonts per grammar */ if (miss.length) console.warn(`Font "${fam}" is missing glyphs: ${miss.join('')} (falls back to a system font; common characters are already in the GB2312 subset, add rare ones with scripts/font_subset.py --text)`); } }
  if (spec.safe && (safe.top || safe.bottom || safe.left || safe.right) && !G.safe)
    console.warn(`grammar ${spec.grammar} does not handle safe yet (no safe: true on the grammar object), spec.safe ignored: the subtitle band may sit on top of the type`);
  if (G.init) G.init(ctx);
  window.CLIP_CTX = ctx;
  window.__total = spec.duration; window.__fps = FPS; window.__size = [W, H];
  // safe.fill: paint the freed edges this color (a portrait film makes the chart the same "card" as the neighbouring contained asset, with the film's background color outside); not painted in transparent mode
  const band = (safe.fill && !spec.alpha) ? (cc => { cc.fillStyle = safe.fill; const { top: t0, bottom: b0, left: l0, right: r0 } = safe;
    if (t0) cc.fillRect(0, 0, W, t0); if (b0) cc.fillRect(0, H - b0, W, b0); if (l0) cc.fillRect(0, 0, l0, H); if (r0) cc.fillRect(W - r0, 0, r0, H); }) : null;
  window.renderFrame = t => { c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H); c.save(); G.draw(c, t, ctx); c.restore(); if (fin && !spec.alpha) FINISH.apply(c, t, fin, W, H, FPS); if (band) band(c); };
  window.prepare = async () => {};
  window.__ready = true;
  window.renderFrame(0);
  const sc = document.getElementById('scrub'), tt = document.getElementById('tt'); sc.max = spec.duration; sc.step = 1 / FPS;
  sc.oninput = () => { window.renderFrame(+sc.value); tt.textContent = (+sc.value).toFixed(3); };
}
boot().catch(e => fail(String(e && e.stack || e)));
})();
