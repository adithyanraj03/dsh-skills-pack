// Shared utilities (loaded first; used by both the transitions library and the engine)
(() => {
// ---------- Utilities ----------
window.U = {
  TAU: Math.PI * 2,
  clamp: (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)),
  lerp: (a, b, p) => a + (b - a) * p,
  // smoothstep: x moves smoothly from 0 to 1 within [a,b] (used for intro write-ons, fades, and within-segment pacing)
  ss: (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); },
  // linearly remap p's [a,b] segment to 0..1 (used for transition phases)
  seg: (p, a, b) => Math.max(0, Math.min(1, (p - a) / (b - a))),
  // step frame rate: quantize continuous time into fps steps — the "stutter" is itself the flavor of many styles:
  // rubber-hose cartoon 12fps (on twos), shadow-puppet rod work 10fps, Haring dancing figures 8fps hard cuts, hand-drawn line boil 8–12fps, film layer 24fps.
  stepTime: (t, fps) => Math.floor(t * fps) / fps,
  ease: {
    linear: p => p,
    inOut: p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2,
    out: p => 1 - Math.pow(1 - p, 3),
    in: p => p * p * p,
    outBack: p => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); },
  },
  // seeded random: mulberry32
  rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; },
  hash(i, j = 0) { let h = (i * 374761393 + j * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; },
  // point list → Path2D (polyline)
  poly(pts, closed = true) { const p = new Path2D(); pts.forEach((q, i) => i ? p.lineTo(q[0], q[1]) : p.moveTo(q[0], q[1])); if (closed) p.closePath(); return p; },
};

// ---------- Canvas size ----------
// Default 1920×1080. Vertical clips (clip.html, spec.width/height) and vertical full films (index.html?w=1080&h=1920, or window.FILM_SIZE = [1080, 1920] in eras.js)
// call U.setStage(w, h) once at startup. Libraries that use screen size (PAINT / BRUSH / RENDER / POST / KIT / TOON / CAM / UI / CH / DG / CL / MD, transitions.js, engine.js)
// register with U.onStage and everything follows when the size changes; registration calls back immediately with the current size, so later-loaded libraries get it too.
// The 35 art-style scenes (scenes/) are drawn for 1920×1080; in vertical only the explainer grammar, transitions, and the engine itself are guaranteed.
const stageHooks = [];
window.STAGE = { W: 1920, H: 1080 };
U.onStage = f => { stageHooks.push(f); f(window.STAGE.W, window.STAGE.H); };
U.setStage = (w, h) => { w = Math.round(+w); h = Math.round(+h); if (!(w > 0 && h > 0)) throw new Error(`U.setStage: invalid size ${w}×${h}`); window.STAGE = { W: w, H: h }; stageHooks.forEach(f => f(w, h)); };

// ---------- Glyph checks ----------
// When a font file lacks a character the browser silently falls back to a system font: measureText does not error and the width even looks right, but another machine renders differently (migration tests B, D hit full-width letters, ▶, and the hanzi for "play" and "blue").
// Approach: at startup (engine boot, after fonts load) read the cmap table of every font file in FONT_FACES (WOFF1 decompresses zlib with DecompressionStream), then look up whether the character exists.
// Do not compare measureText against a fallback font: on macOS Chromium's per-character fallback picks a system font based on the preferred font, so the two approaches land on different fonts and missing glyphs still go undetected (misjudged in testing).
// font can be a family name ('LXGWWenKai-500') or a CSS font string ('80px "LXGWWenKai-500"'). A family not in FONT_FACES → treated as entirely missing.
const famOf = font => { const m = /"([^"]+)"/.exec(font) || /'([^']+)'/.exec(font); return m ? m[1] : String(font).replace(/^(italic\s+|bold\s+|\d+\s+)*[\d.]+px\s+/, '').trim(); };
const CMAPS = {};
const inflate = async (buf) => new Uint8Array(await new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream('deflate'))).arrayBuffer());
async function readCmap(url) {
  const ab = await (await fetch(url)).arrayBuffer(), dv = new DataView(ab), sig = dv.getUint32(0);
  let tab = null;
  if (sig === 0x774F4646) {                                            // 'wOFF'
    const n = dv.getUint16(12);
    for (let i = 0; i < n; i++) { const o = 44 + i * 20; if (dv.getUint32(o) !== 0x636D6170) continue;   // 'cmap'
      const off = dv.getUint32(o + 4), comp = dv.getUint32(o + 8), orig = dv.getUint32(o + 12), raw = new Uint8Array(ab, off, comp);
      tab = comp < orig ? await inflate(raw) : raw.slice(); }
  } else {                                                             // bare TTF/OTF
    const n = dv.getUint16(4);
    for (let i = 0; i < n; i++) { const o = 12 + i * 16; if (dv.getUint32(o) === 0x636D6170) tab = new Uint8Array(ab, dv.getUint32(o + 8), dv.getUint32(o + 12)).slice(); }
  }
  if (!tab) throw new Error('no cmap table');
  const t = new DataView(tab.buffer, tab.byteOffset, tab.byteLength), set = new Set(), nt = t.getUint16(2);
  for (let i = 0; i < nt; i++) {
    const so = t.getUint32(4 + i * 8 + 4), fmt = t.getUint16(so);
    if (fmt === 4) { const segX2 = t.getUint16(so + 6), ends = so + 14, starts = ends + segX2 + 2, deltas = starts + segX2, ros = deltas + segX2;
      for (let k = 0; k < segX2 / 2; k++) { const e = t.getUint16(ends + k * 2), s = t.getUint16(starts + k * 2), d = t.getInt16(deltas + k * 2), ro = t.getUint16(ros + k * 2);
        for (let ch = s; ch <= e && ch !== 0xFFFF; ch++) { let g; if (!ro) g = (ch + d) & 0xFFFF; else { g = t.getUint16(ros + k * 2 + ro + (ch - s) * 2); if (g) g = (g + d) & 0xFFFF; } if (g) set.add(ch); } } }
    else if (fmt === 12 || fmt === 13) { const ng = t.getUint32(so + 12); for (let k = 0; k < ng; k++) { const o = so + 16 + k * 12, s = t.getUint32(o), e = t.getUint32(o + 4), g = t.getUint32(o + 8);
      for (let ch = s; ch <= e; ch++) if (fmt === 13 ? g : g + ch - s) set.add(ch); } }
    else if (fmt === 0) { for (let ch = 0; ch < 256; ch++) if (t.getUint8(so + 6 + ch)) set.add(ch); }
    else if (fmt === 6) { const first = t.getUint16(so + 6), cnt = t.getUint16(so + 8); for (let k = 0; k < cnt; k++) if (t.getUint16(so + 10 + k * 2)) set.add(first + k); }
  }
  return set;
}
// Called once in engine boot (after fonts load). Fonts that fail to read log console.error and do not block startup.
U.loadCmaps = async (faces = window.FONT_FACES || []) => {
  await Promise.all(faces.map(async f => { try { CMAPS[f.family] = await readCmap(f.url); } catch (e) { console.error(`cannot read cmap for font ${f.family}: ${e}`); } }));
};
U.missingGlyphs = (font, text) => {
  const fam = famOf(font), cm = CMAPS[fam];
  const chars = [...new Set([...String(text)])].filter(ch => !/\s/.test(ch));
  if (!cm) return chars;
  return chars.filter(ch => !cm.has(ch.codePointAt(0)));
};
// console.error on missing glyphs (qa.py / render.py treat page console.error as failure). Returns true = all present.
U.assertGlyphs = (font, text, where = '') => {
  const fam = famOf(font), miss = U.missingGlyphs(font, text);
  if (miss.length) console.error(!CMAPS[fam] ? `Font "${fam}" is not registered or its cmap was not read (FONT_FACES in lib/fonts.js)${where ? ' (' + where + ')' : ''}`
    : `Missing glyphs: font "${fam}" has no "${miss.join('')}"${where ? ' (' + where + ')' : ''} — it will silently fall back to a system font. Add them with scripts/font_subset.py, or draw them as paths.`);
  return miss.length === 0;
};
U.fontFamily = famOf;

})();
