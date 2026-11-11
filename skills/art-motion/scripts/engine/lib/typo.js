// Text motion TY: per-character/per-word pop-in, mask rise, pop, type-on, blur-in, highlighter, underline, hero-word slam, keyword emphasis, number counting and tabular figures.
// Conventions: p is 0..1 progress; lt/t are seconds. Fonts use a CSS font string or family name (Chinese defaults to PuHui-*; the open-source build uses Source Han Sans, see lib/fonts.js).
// Readability floor (y5/y1 cards): hero word : support line : label ≈ 3.4 : 1 : 0.4; a support line stays on screen ≥1.2s; slow entrances (0.3–0.4s), fast exits (≈0.18s).
(() => {
const { clamp, lerp } = U;
const TY = window.TY = {};

// ---------- Basics ----------
TY.font = (size, fam = 'PuHui-Black') => `${size}px "${fam}"`;
// Draw a run of text: optional alpha, scale, rotation (about ox,oy), letter spacing track, stroke
TY.text = (c, s, x, y, { size = 120, fam = 'PuHui-Black', color = '#111', align = 'center', base = 'alphabetic', alpha = 1, scale = 1, rot = 0, track = 0, stroke, strokeW = 0, ox = x, oy = y } = {}) => {
  if (alpha <= 0 || scale <= 0) return;
  c.save(); c.globalAlpha *= alpha; c.translate(ox, oy); c.rotate(rot); c.scale(scale, scale); c.translate(-ox, -oy);
  c.font = TY.font(size, fam); c.textAlign = align; c.textBaseline = base; if (track) c.letterSpacing = track + 'px';
  if (stroke && strokeW) { c.lineJoin = 'round'; c.strokeStyle = stroke; c.lineWidth = strokeW; c.strokeText(s, x, y); }
  c.fillStyle = color; c.fillText(s, x, y); c.restore();
};
TY.width = (c, s, size, fam = 'PuHui-Black', track = 0) => { c.save(); c.font = TY.font(size, fam); if (track) c.letterSpacing = track + 'px'; const w = c.measureText(s).width; c.restore(); return w; };
// Wrap: split a run of text into lines by maxW (Chinese breaks per character; English/numbers break per word; no Chinese punctuation at line start). font is a CSS font string
TY.wrap = (c, text, maxW, font) => {
  c.save(); if (font) c.font = font;
  const toks = String(text).match(/[A-Za-z0-9.,%+\-'’]+\s*|\s+|./gu) || [], lines = []; let cur = '';
  for (const tk of toks) {
    if (tk === '\n') { lines.push(cur); cur = ''; continue; }
    if (cur && c.measureText(cur + tk.trimEnd()).width > maxW && !/^[，。、：；！？」』）》,.!?)]$/.test(tk)) { lines.push(cur.trimEnd()); cur = tk.trimStart(); }
    else cur += tk;
  }
  if (cur.trim()) lines.push(cur.trimEnd());
  c.restore(); return lines;
};
// Shrink the font size from size until it actually fits: no more than maxLines lines after wrapping, and every measured line width ≤ maxW (a single long English word/number cannot wrap, so counting lines alone can still overflow). Returns {size, lines, ok}
// Search within [min, 1]× first; if nothing fits, soft:true returns ok:false so the caller can choose another approach (e.g. rewrap to two lines), otherwise keep shrinking (down to 0.2×). balance:true evens out multi-line lengths.
TY.fit = (c, text, maxW, size, fam, { maxLines = 2, min = 0.45, weight = '', soft = false, balance = false } = {}) => {
  const font = s => `${weight}${s}px "${fam}"`, ok = (s, lines) => { c.save(); c.font = font(s); const r = lines.length <= maxLines && lines.every(l => c.measureText(l).width <= maxW + 0.5); c.restore(); return r; };
  let s = size, lines = [String(text)], good = false;
  for (; s >= size * (soft ? min : 0.2) - 1e-9; s *= 0.94) { lines = TY.wrap(c, text, maxW, font(s)); if (ok(s, lines)) { good = true; break; } if (s < size * min && soft) break; }
  if (!good && !soft) s /= 0.94;
  if (good && balance && lines.length > 1) { const n = lines.length; let lo = maxW * 0.4, hi = maxW; for (let k = 0; k < 14; k++) { const m = (lo + hi) / 2; if (TY.wrap(c, text, m, font(s)).length > n) lo = m; else hi = m; } lines = TY.wrap(c, text, hi, font(s)); }
  return { size: s, lines, ok: good };
};

// Floor version of fit: font size never below floor (px). If it fits, behaves like TY.fit; if not, stop at floor, truncate to maxLines and add "…", and trim single overlong words too.
// For places where content length is uncontrolled (node labels, card captions, chart labels): truncate rather than shrink below legibility. Returns {size, lines, ok, cut}
TY.fitFloor = (c, text, maxW, size, fam, { maxLines = 2, floor = size * 0.5, weight = '', balance = false } = {}) => {
  floor = Math.min(floor, size);
  const r = TY.fit(c, text, maxW, size, fam, { maxLines, min: Math.max(0.2, floor / size), weight, soft: true, balance });
  if (r.ok) return { ...r, cut: false };
  const font = `${weight}${floor}px "${fam}"`; c.save(); c.font = font;
  const w = s => c.measureText(s).width, ell = line => { if (w(line) <= maxW) return line; let l = line; while (l.length > 1 && w(l + '…') > maxW) l = l.slice(0, -1); return l + '…'; };
  let lines = TY.wrap(c, text, maxW, font), cut = false;
  if (lines.length > maxLines) { lines = lines.slice(0, maxLines); lines[maxLines - 1] = lines[maxLines - 1] + '…'; cut = true; }
  lines = lines.map(l => { const e = ell(l); if (e !== l) cut = true; return e; });
  c.restore(); return { size: floor, lines, ok: false, cut };
};

// ---------- Entrances ----------
// Staggered per-character entrance: each character takes dur seconds, moves up from dy, alpha 0→1, optional scale; Kurzgesagt titles use 0.5s/char with 45ms stagger. Returns total width.
TY.charsIn = (c, str, x, y, lt, { font, color, dur = 0.35, stagger = 0.04, dy = 24, scale0 = 1, align = 'left', ease = MO.cubicOut, shadow, spacing = 0 } = {}) => {
  c.save(); c.font = font; c.textBaseline = 'alphabetic'; c.fillStyle = color; const A0 = c.globalAlpha;   // multiply the caller's alpha (a wrapper fade is needed for fade-outs to work)
  const chars = [...str]; const ws = chars.map(ch => c.measureText(ch).width + spacing); const tw = ws.reduce((a, b) => a + b, 0) - spacing;
  let cx = align === 'center' ? x - tw / 2 : align === 'right' ? x - tw : x;
  chars.forEach((ch, i) => {
    const q = clamp((lt - i * stagger) / dur); if (q > 0) {
      const e = ease(q); c.save(); c.globalAlpha = A0 * clamp(q * 2.2);
      c.translate(cx + ws[i] / 2, y + dy * (1 - e)); const s = lerp(scale0, 1, e); c.scale(s, s);
      if (shadow) { c.shadowColor = shadow.color; c.shadowOffsetX = shadow.x || 0; c.shadowOffsetY = shadow.y || 0; c.shadowBlur = shadow.blur || 0; }
      c.fillText(ch, -ws[i] / 2 + spacing / 2, 0); c.restore();
    }
    cx += ws[i];
  });
  c.restore(); return tw;
};
// Mask rise: text pushes up out of a "slot" below the baseline (the most common kinetic-type entrance). p 0..1, o.dir=+1 rises up, -1 retracts downward. o same as TY.text
TY.rise = (c, s, x, y, p, o = {}) => {
  const size = o.size || 120, e = MO.expoOut(clamp(p)), w = TY.width(c, s, size, o.fam, o.track), a = o.align || 'left';
  const x0 = a === 'left' ? x : a === 'center' ? x - w / 2 : x - w;
  c.save(); c.beginPath(); c.rect(x0 - 20, y - size * 1.05, w + 40, size * 1.32); c.clip();
  TY.text(c, s, x, y + size * 1.2 * (1 - e) * (o.dir || 1), { ...o, align: a }); c.restore();
};
// Pop: scale from 0 to 1, overshoot with backOut then settle (about the text center). o.over = backOut's s
TY.pop = (c, s, x, y, p, o = {}) => {
  if (p <= 0) return; const size = o.size || 120, sc = MO.backOut(clamp(p), o.over ?? 2.2) * (o.scale || 1);
  TY.text(c, s, x, y, { ...o, scale: sc, ox: x, oy: y - size * 0.36 });
};
// Blur-in (launch-event titles): blur→sharp + move up + transparent→opaque. Uses the caller's font/fillStyle/textAlign.
TY.blurIn = (c, text, x, y, p, { blur = 18, dy = 28, scale = 0 } = {}) => {
  if (p <= 0) return;
  c.save(); c.globalAlpha *= clamp(p * 1.4);
  const b = (1 - p) * blur; if (b > 0.3) c.filter = `blur(${b.toFixed(2)}px)`;
  c.translate(x, y + (1 - p) * dy); if (scale) { const s = 1 + (1 - p) * scale; c.scale(s, s); }
  c.fillText(text, 0, 0); c.restore();
};
// Typing: truncate by character count (p 0..1)
TY.typed = (s, p) => [...s].slice(0, Math.round(clamp(p) * [...s].length)).join('');
// Typewriter: number of characters typed at time t (rate chars/second, optionally stepped by fps; Vox 13 chars/s + 12fps, whiteboard body 16 chars/s)
TY.typedCount = (t, t0, rate, fps = 0) => Math.max(0, Math.floor(((fps ? MO.step(t, fps) : t) - t0) * rate + 1e-6) + 1);

// ---------- Emphasis ----------
// Highlighter: a slanted color block wiped left to right, placed behind the text (kinetic type). For the collage-style rough multiply highlighter see CL.highlight
TY.marker = (c, x, y, w, h, p, color = '#FFE14D', skew = 0.18) => {
  if (p <= 0) return; const e = MO.expoOut(clamp(p)), ww = w * e;
  c.save(); c.fillStyle = color; c.beginPath(); c.moveTo(x + h * skew, y); c.lineTo(x + ww + h * skew, y); c.lineTo(x + ww, y + h); c.lineTo(x, y + h); c.closePath(); c.fill(); c.restore();
};
TY.underline = (c, x, y, w, p, color, lw = 10) => { if (p <= 0) return; c.save(); c.strokeStyle = color; c.lineCap = 'round'; c.lineWidth = lw; c.beginPath(); c.moveTo(x, y); c.lineTo(x + w * MO.expoOut(clamp(p)), y); c.stroke(); c.restore(); };
// Hero word "slams" in: scale from from× to 1 (spring 2.2Hz/10, overshoot ≈8%), alpha 0→1 over the first 0.06s. lt = seconds since this word appeared
TY.slam = (c, s, x, y, lt, o = {}) => {
  if (lt < 0) return; const size = o.size || 340, k = MO.springHz(lt, o.freq || 2.2, o.decay || 10), sc = lerp(o.from || 1.7, 1, k);
  TY.text(c, s, x, y, { size, fam: 'PuHui-Black', align: 'left', ...o, scale: sc * (o.scale || 1), alpha: clamp(lt / 0.06), ox: o.ox ?? x, oy: o.oy ?? y - size * 0.36 });
};
// Keyword: rises from the slot at tIn, then at the "emphasis beat" tHit scales to 1.35× and holds (spring 2.5Hz/9). Returns current scale (so highlighter/underline can scale with it).
// Text and action say the same thing: the beat where "next line" enlarges lands exactly on the Tab press (y5).
TY.keyword = (c, s, x, y, t, tIn, tHit, o) => {
  if (t < tHit) { TY.rise(c, s, x, y, MO.at(t, tIn, 0.35), { ...o, align: 'left' }); return 1; }
  const sc = lerp(1, 1.35, MO.springHz(t - tHit, 2.5, 9));
  TY.text(c, s, x, y, { ...o, align: 'left', scale: sc, ox: x, oy: y });
  return sc;
};
// Highlighter behind the keyword: appears on the same beat and shares the same scale
TY.keywordMarker = (c, x, y, w, size, t, tHit, sc, col) => { if (t < tHit) return; TY.marker(c, x - 8, y - size * 0.98 * sc, (w + 16) * sc, size * 1.18 * sc, MO.at(t, tHit, 0.3), col); };

// ---------- Numbers ----------
// Thousands separators; negative sign uses the true minus "−"
TY.fmt = (v, dec = 0, sep = true) => { const s = Math.abs(v).toFixed(dec); const [i, f] = s.split('.'); const ii = sep ? i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : i; return (v < 0 ? '−' : '') + ii + (f ? '.' + f : ''); };
// Count: roll from a to b within [start, start+dur]; default expoOut (fast then slow, final digit settles). Numbers and animation only change "how it appears", never the measure.
TY.count = (lt, start, dur, a, b, ease = MO.expoOut) => lerp(a, b, ease(clamp((lt - start) / dur)));
// Tabular digit layout: canvas cannot enable tnum, digit widths jitter while rolling, so lay out each digit in an equal-width cell yourself. Uses the caller's font/fillStyle. Returns total width
TY.tabular = (c, str, x, y, { align = 'left', digitW } = {}) => {
  const dw = digitW || c.measureText('0').width;
  const ws = [...str].map(ch => /[0-9]/.test(ch) ? dw : c.measureText(ch).width);
  const total = ws.reduce((s, w) => s + w, 0);
  let cx = align === 'right' ? x - total : align === 'center' ? x - total / 2 : x;
  const ta = c.textAlign; c.textAlign = 'center';
  [...str].forEach((ch, i) => { c.fillText(ch, cx + ws[i] / 2, y); cx += ws[i]; });
  c.textAlign = ta; return total;
};
})();
