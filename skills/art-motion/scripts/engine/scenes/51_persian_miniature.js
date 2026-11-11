// Persian miniature (Herat / Safavid): no perspective convergence, the ground is like a tapestry stood upright; buildings are cut open so the inside is visible; every inch carries pattern; gold, lapis blue, vermilion, peacock green; blocks of text set into the picture.
// Subject (new composition): a water wheel in a courtyard — a gardener turns the wheel, water runs along a channel into an octagonal pool, two men read under a pavilion; a page-like block of text above.
// Anchored to the originals (fetch_reference.py: the Herat Bustan (Yusuf and Zulaykha), the garden-bath page, a Shah Tahmasp Shahnama page):
//   paper/vellum #d9bf88, lapis #1f4f8f, vermilion #b7372b, peacock green #2a8a7a, gold #d6a93c, rose pink #d98a7a; brick red / blue-green tiles covering every surface;
//   trees = flat trunk + dotted leaf masses + blossom; people = small, in profile, big turbans, faint patterns on the robes; the ground is always "laid out flat, seen from above", distance comes from stacking upward rather than shrinking.
// Pipeline: paper ground (cached) → gold border line + blue band → text block → cut-away building faces (brick + tiles everywhere) → flat courtyard ground (grass + flower dots) → pool (octagonal, geometric tile edging)
//      → trees → motion: wheel turning, water running along the channel, figures moving, petals drifting, ripples → a very thin paper-fibre multiply pass.
SCENES['51_persian_miniature'] = (() => {
  const W = 1920, H = 1080, { clamp, lerp, rng, ss } = U, P = PAINT, M = MEDIUM, TAU = Math.PI * 2;
  const C = { paper: '#dcc38c', lapis: '#1f4f8f', lapis2: '#2f6fb0', red: '#b7372b', teal: '#2a8a7a', gold: '#d6a93c', rose: '#d98a7a', brick: '#c0643f', cream: '#efe0b4', green: '#6f9a4a', dgreen: '#3f6e3a', ink: '#2b2118' };
  let layer;
  const poly = (pts, close = true) => { const p = new Path2D(); pts.forEach((q, i) => i ? p.lineTo(q[0], q[1]) : p.moveTo(q[0], q[1])); if (close) p.closePath(); return p; };
  const fillPoly = (g, pts, col, o = {}) => { g.fillStyle = col; g.fill(poly(pts)); if (o.line !== false) { g.strokeStyle = o.line || C.ink; g.lineWidth = o.lw || 2.4; g.stroke(poly(pts)); } };
  // All-over geometry: star / cross tiles, periodic modulo, alternating two colours
  function tiles(g, x, y, w, h, size, a, b, c2, seed = 1) {
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.fillStyle = a; g.fillRect(x, y, w, h);
    const r = rng(seed);
    for (let j = 0; y + j * size < y + h + size; j++) for (let i = 0; x + i * size < x + w + size; i++) {
      const cx = x + i * size + size / 2, cy = y + j * size + size / 2, k = (i + j) % 2;
      g.fillStyle = k ? b : c2; g.beginPath(); for (let q = 0; q < 8; q++) { const ang = q / 8 * TAU + Math.PI / 8, rr = q % 2 ? size * 0.2 : size * 0.38; g.lineTo(cx + Math.cos(ang) * rr, cy + Math.sin(ang) * rr); } g.closePath(); g.fill();
      g.fillStyle = k ? c2 : b; g.beginPath(); g.arc(cx, cy, size * 0.1, 0, TAU); g.fill();
    }
    g.strokeStyle = 'rgba(30,24,16,.5)'; g.lineWidth = 1.4; for (let i = 0; i <= w / size + 1; i++) { g.beginPath(); g.moveTo(x + i * size, y); g.lineTo(x + i * size, y + h); g.stroke(); } for (let j = 0; j <= h / size + 1; j++) { g.beginPath(); g.moveTo(x, y + j * size); g.lineTo(x + w, y + j * size); g.stroke(); }
    g.restore();
  }
  function border(g) {                 // gold line + lapis band + fine gold flower
    g.fillStyle = C.lapis; g.fillRect(0, 0, W, H); g.fillStyle = C.gold; g.fillRect(22, 22, W - 44, H - 44); g.fillStyle = C.paper; g.fillRect(30, 30, W - 60, H - 60);
    g.fillStyle = C.lapis; g.fillRect(44, 44, W - 88, H - 88); g.fillStyle = C.gold; g.fillRect(52, 52, W - 104, H - 104); g.fillStyle = C.paper; g.fillRect(58, 58, W - 116, H - 116);
    g.fillStyle = 'rgba(214,169,60,.9)'; for (let x = 70; x < W - 70; x += 38) { [34, H - 34].forEach(y => { g.beginPath(); g.arc(x, y, 6, 0, TAU); g.fill(); }); } for (let y = 70; y < H - 70; y += 38) { [34, W - 34].forEach(x => { g.beginPath(); g.arc(x, y, 6, 0, TAU); g.fill(); }); }
  }
  function textBlock(g, x, y, w, h) {  // calligraphy block: rows of "joined strokes" inside a vermilion frame with gold edging — simulated with polyline strokes, no actual letters written
    fillPoly(g, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], '#efe3bd', { lw: 3, line: C.gold });
    const r = rng(7); g.strokeStyle = C.ink; g.lineCap = 'round'; g.lineWidth = 2.4;
    for (let row = 0; row < Math.floor(h / 34); row++) { const yy = y + 28 + row * 34; let xx = x + w - 20; g.beginPath(); g.moveTo(xx, yy); while (xx > x + 24) { const st = 8 + r() * 18; xx -= st; g.quadraticCurveTo(xx + st / 2, yy - 8 - r() * 10, xx, yy + (r() - .5) * 6); if (r() < 0.12) { g.moveTo(xx - 10, yy); xx -= 10; } } g.stroke();
      g.fillStyle = C.red; if (row % 3 === 0) { g.beginPath(); g.arc(x + w - 14, yy - 6, 4, 0, TAU); g.fill(); } }
  }
  function build() {
    layer = P.canvas(); const g = layer.getContext('2d');
    g.fillStyle = C.paper; g.fillRect(0, 0, W, H); border(g);
    // Top: cut-away building face (sliced open so the people inside show through)
    g.save(); g.beginPath(); g.rect(60, 60, W - 120, H - 120); g.clip();
    // Outer wall, big face: brick red + a tile band; blue-glazed lintel
    fillPoly(g, [[900, 60], [1860, 60], [1860, 520], [900, 520]], C.brick, { lw: 3 });
    for (let y = 80; y < 500; y += 26) { g.strokeStyle = 'rgba(80,30,20,.35)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(900, y); g.lineTo(1860, y); g.stroke(); for (let x = 900 + ((y / 26) % 2) * 20; x < 1860; x += 40) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 26); g.stroke(); } }
    tiles(g, 900, 60, 960, 90, 30, C.lapis, C.cream, C.teal, 3);
    // The cut-open room: a pavilion (arched opening), with a carpet and two readers inside
    const arch = new Path2D(); arch.moveTo(1040, 520); arch.lineTo(1040, 250); arch.quadraticCurveTo(1040, 170, 1260, 170); arch.quadraticCurveTo(1480, 170, 1480, 250); arch.lineTo(1480, 520); arch.closePath();
    g.fillStyle = C.gold; g.fill(arch); g.save(); g.translate(0, 0); g.scale(1, 1); g.restore();
    const inner = new Path2D(); inner.moveTo(1060, 520); inner.lineTo(1060, 256); inner.quadraticCurveTo(1060, 192, 1260, 192); inner.quadraticCurveTo(1460, 192, 1460, 256); inner.lineTo(1460, 520); inner.closePath();
    g.save(); g.clip(inner); tiles(g, 1060, 180, 400, 340, 36, '#e7d6a6', C.lapis2, C.red, 5);
    // Carpet: red field, border band, a big octagonal lozenge at the centre
    fillPoly(g, [[1060, 420], [1460, 420], [1460, 520], [1060, 520]], C.red, { lw: 2.4 });
    for (let x = 1076; x < 1460; x += 34) { g.fillStyle = C.gold; g.beginPath(); g.moveTo(x, 470); g.lineTo(x + 12, 456); g.lineTo(x + 24, 470); g.lineTo(x + 12, 484); g.fill(); }
    g.restore(); g.strokeStyle = C.ink; g.lineWidth = 3; g.stroke(arch);
    // Tower block on the left + windows; small window grid on the right
    fillPoly(g, [[1520, 150], [1840, 150], [1840, 500], [1520, 500]], C.cream, { lw: 3 }); tiles(g, 1520, 150, 320, 350, 32, C.cream, C.teal, C.lapis, 9);
    [[1560, 200], [1700, 200], [1560, 340], [1700, 340]].forEach(([x, y]) => { fillPoly(g, [[x, y + 100], [x, y + 40], [x + 20, y], [x + 60, y], [x + 80, y + 40], [x + 80, y + 100]], C.lapis, { lw: 3, line: C.gold }); });
    g.restore();
    textBlock(g, 120, 120, 640, 200); textBlock(g, 120, 340, 640, 120);
    // Lower half: the courtyard ground laid out flat (a tapestry stood on end)
    g.save(); g.beginPath(); g.rect(60, 520, W - 120, H - 580); g.clip();
    fillPoly(g, [[60, 520], [W - 60, 520], [W - 60, H - 60], [60, H - 60]], C.green, { line: false });
    const r = rng(11); for (let i = 0; i < 1400; i++) { const x = 70 + r() * (W - 140), y = 530 + r() * (H - 600), k = r(); g.fillStyle = k < 0.5 ? '#86b05a' : k < 0.8 ? '#4d7c3a' : (r() < 0.5 ? '#f0e6c8' : C.rose); g.beginPath(); g.ellipse(x, y, 3 + r() * 5, 2 + r() * 3, r(), 0, TAU); g.fill(); }
    // Channel: runs from the water-wheel base at the upper left to the octagonal pool, tiled in blue-green, geometric edging
    g.lineCap = 'butt'; g.lineJoin = 'round'; [['#2b2118', 78], [C.gold, 72], [C.teal, 58]].forEach(([col, w]) => { g.strokeStyle = col; g.lineWidth = w; g.beginPath(); g.moveTo(260, 670); g.lineTo(790, 670); g.lineTo(930, 800); g.stroke(); });
    // Octagonal pool: right of centre
    const cx = 1160, cy = 790, R = 230, oct = Array.from({ length: 8 }, (_, k) => [cx + Math.cos(k / 8 * TAU + Math.PI / 8) * R * 1.08, cy + Math.sin(k / 8 * TAU + Math.PI / 8) * R * 0.74]);
    fillPoly(g, oct.map(p => [cx + (p[0] - cx) * 1.14, cy + (p[1] - cy) * 1.2]), C.gold, { lw: 3 });
    fillPoly(g, oct.map(p => [cx + (p[0] - cx) * 1.06, cy + (p[1] - cy) * 1.1]), C.lapis, { lw: 3, line: C.gold });
    fillPoly(g, oct, '#2c7e8a', { lw: 3, line: C.gold });
    // Paths laid around it: cream lozenges
    for (let i = 0; i < 16; i++) { const x = 300 + i * 36, y = 760 + (i % 2) * 14; g.fillStyle = C.cream; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 14, y - 10); g.lineTo(x + 28, y); g.lineTo(x + 14, y + 10); g.fill(); }
    g.restore();
    // Trees: one each side, straight trunk + round leaf masses + blossom dots + fruit (the crown pushes up past the edge of the picture, as miniatures often do)
    function tree(x, y, hgt, seed, bloom) {
      g.fillStyle = '#7a4a2a'; g.fillRect(x - 11, y - hgt, 22, hgt); g.strokeStyle = C.ink; g.lineWidth = 2.4; g.strokeRect(x - 11, y - hgt, 22, hgt);
      const rr = rng(seed); for (let k = 0; k < 9; k++) { const a = rr() * TAU, d = rr() * 70, cx2 = x + Math.cos(a) * d, cy2 = y - hgt - 30 + Math.sin(a) * d * 0.7; g.fillStyle = k % 2 ? C.dgreen : '#4f8a3f'; g.beginPath(); g.ellipse(cx2, cy2, 58, 46, 0, 0, TAU); g.fill(); g.strokeStyle = C.ink; g.lineWidth = 1.8; g.stroke(); }
      for (let k = 0; k < 40; k++) { const a = rr() * TAU, d = rr() * 100; g.fillStyle = bloom; g.beginPath(); g.arc(x + Math.cos(a) * d, y - hgt - 30 + Math.sin(a) * d * 0.6, 5, 0, TAU); g.fill(); }
    }
    tree(140, 720, 220, 31, '#f4d3d0'); tree(1790, 760, 240, 32, '#f4e6a0'); tree(700, 560, 120, 33, '#f4d3d0');
  }
  // Water wheel: it turns; the buckets cycle by modulo; water runs along the channel
  function wheel(c, t) {
    const cx = 340, cy = 580, R = 120, a0 = t * 0.8;
    c.save(); c.translate(cx, cy);
    c.strokeStyle = C.ink; c.lineWidth = 3; c.fillStyle = '#9a6a3a'; c.beginPath(); c.arc(0, 0, R, 0, TAU); c.arc(0, 0, R - 14, 0, TAU, true); c.fill('evenodd'); c.stroke(); c.beginPath(); c.arc(0, 0, R - 14, 0, TAU); c.stroke();
    for (let k = 0; k < 12; k++) { const a = a0 + k / 12 * TAU; c.save(); c.rotate(a); c.fillStyle = '#7a4a2a'; c.fillRect(-4, 0, 8, R - 14); c.strokeRect(-4, 0, 8, R - 14); c.fillStyle = C.gold; c.fillRect(-14, R - 6, 28, 16); c.strokeRect(-14, R - 6, 28, 16); c.restore(); }
    c.fillStyle = C.red; c.beginPath(); c.arc(0, 0, 18, 0, TAU); c.fill(); c.stroke();
    c.restore();
  }
  function water(c, t) {
    // Channel water: little gold waves along the polyline (260,670)→(790,670)→(930,800), flowing down to the right
    const seg = [[260, 670, 790, 670], [790, 670, 930, 800]], Ls = seg.map(q => Math.hypot(q[2] - q[0], q[3] - q[1])), tot = Ls[0] + Ls[1];
    for (let i = 0; i < 16; i++) { let d = ((i * tot / 16 + t * 90) % tot), k = d < Ls[0] ? 0 : 1; if (k) d -= Ls[0]; const q = seg[k], u = d / Ls[k], x = lerp(q[0], q[2], u), y = lerp(q[1], q[3], u) + ((i % 3) - 1) * 12;
      c.strokeStyle = 'rgba(244,224,160,.85)'; c.lineWidth = 2.4; c.beginPath(); c.moveTo(x - 12, y); c.quadraticCurveTo(x, y - 7, x + 12, y); c.stroke(); }
    // Pool: concentric ripples + goldfish
    const cx = 1160, cy = 790;
    c.save(); c.beginPath(); for (let k = 0; k < 8; k++) { const ang = k / 8 * TAU + Math.PI / 8; c.lineTo(cx + Math.cos(ang) * 230 * 1.08, cy + Math.sin(ang) * 230 * 0.74); } c.closePath(); c.clip();
    for (let i = 0; i < 6; i++) { const q = ((t * 0.35 + i / 6) % 1); c.strokeStyle = `rgba(244,230,180,${(1 - q) * 0.8})`; c.lineWidth = 2.6; c.beginPath(); c.ellipse(cx - 130 + Math.sin(i) * 40, cy - 20, 20 + q * 150, 8 + q * 50, 0, 0, TAU); c.stroke(); }
    [[0, 1.0, C.red], [2.2, -0.8, C.gold], [4.1, 0.7, C.cream]].forEach(([ph, dir, col], i) => { const a = t * 0.6 * dir + ph, x = cx + Math.cos(a) * 140, y = cy + Math.sin(a) * 70 + 10, ang = Math.atan2(Math.cos(a) * 70 * dir, -Math.sin(a) * 140 * dir);
      c.save(); c.translate(x, y); c.rotate(ang); c.fillStyle = col; c.strokeStyle = C.ink; c.lineWidth = 2; c.beginPath(); c.ellipse(0, 0, 30, 12, 0, 0, TAU); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-28, 0); c.lineTo(-48, -12 + Math.sin(t * 8 + i) * 4); c.lineTo(-48, 12 + Math.sin(t * 8 + i) * 4); c.closePath(); c.fill(); c.stroke(); c.fillStyle = C.ink; c.beginPath(); c.arc(16, -3, 2.4, 0, TAU); c.fill(); c.restore(); });
    c.restore();
  }
  // Figure (Safavid type): slender, small head, tall turban + red crown rod, waisted robe flaring at the hem, one end of the sash hanging down, pointed shoes; flat fills + heavy outline, small scattered flowers on the robe.
  function person(c, x, y, s, face, col, turban, t, o = {}) {
    c.save(); c.translate(x, y); c.scale(s * face, s); c.lineJoin = 'round'; c.lineCap = 'round'; c.strokeStyle = C.ink; c.lineWidth = 2.6 / s;
    const bob = o.bob || 0, sw = Math.sin(t * 1.7 + (o.ph || 0)) * 3;
    // Shoes: pointed toes
    c.fillStyle = C.red; [[-14, 0], [16, 0]].forEach(([dx]) => { c.beginPath(); c.moveTo(dx - 9, -4); c.quadraticCurveTo(dx + 10, -10, dx + 24, -2); c.quadraticCurveTo(dx + 12, 5, dx - 9, 4); c.closePath(); c.fill(); c.stroke(); });
    // Robe: narrow shoulders → cinched waist → flared hem, the front closure crossed by a line
    c.fillStyle = col; c.beginPath(); c.moveTo(-20, -152 + bob); c.quadraticCurveTo(-26, -118, -18, -96 + bob); c.quadraticCurveTo(-34, -52, -52 + sw, -6); c.quadraticCurveTo(0, 3, 52 + sw, -6); c.quadraticCurveTo(34, -52, 18, -96 + bob); c.quadraticCurveTo(26, -118, 20, -152 + bob); c.closePath(); c.fill(); c.stroke();
    c.save(); c.clip(); c.fillStyle = 'rgba(244,224,160,.8)'; for (let k = 0; k < 24; k++) { const px = -44 + (k % 6) * 17 + (Math.floor(k / 6) % 2) * 8, py = -140 + Math.floor(k / 6) * 34; c.beginPath(); for (let q = 0; q < 5; q++) { const aa = q / 5 * TAU; c.moveTo(px, py); c.arc(px + Math.cos(aa) * 4.4, py + Math.sin(aa) * 4.4, 2.6, 0, TAU); } c.fill(); }
    c.strokeStyle = 'rgba(43,33,24,.55)'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(4, -148 + bob); c.quadraticCurveTo(10, -80, 30 + sw, -6); c.stroke(); c.restore();
    c.strokeStyle = C.ink; c.lineWidth = 2.6 / s; c.strokeStyle = C.gold; c.lineWidth = 4; c.beginPath(); c.moveTo(-52 + sw, -6); c.quadraticCurveTo(0, 3, 52 + sw, -6); c.stroke(); c.strokeStyle = C.ink; c.lineWidth = 2.6 / s;
    // Sash + hanging end
    c.fillStyle = C.gold; c.fillRect(-19, -100 + bob * 0.5, 38, 9); c.strokeRect(-19, -100 + bob * 0.5, 38, 9);
    c.fillStyle = C.cream; c.beginPath(); c.moveTo(10, -92 + bob * 0.5); c.lineTo(22, -60 + sw * 0.4); c.lineTo(10, -64 + sw * 0.4); c.closePath(); c.fill(); c.stroke();
    // Arms: by default one sleeve hangs, the other is raised to the chest holding something
    if (o.arm) o.arm(c, bob); else { c.strokeStyle = col; c.lineWidth = 11; c.beginPath(); c.moveTo(16, -144 + bob); c.lineTo(34, -108 + bob); c.lineTo(22, -90 + bob); c.stroke(); c.strokeStyle = C.ink; c.lineWidth = 2.6 / s; c.fillStyle = '#e8c298'; c.beginPath(); c.arc(22, -88 + bob, 5, 0, TAU); c.fill(); c.stroke(); }
    // Neck and head: small, 3/4, brows joined into one curve, almond eyes, a single line of beard
    c.fillStyle = '#e8c298'; c.fillRect(-4, -160 + bob, 9, 12);
    c.beginPath(); c.ellipse(3, -172 + bob, 15, 18, 0, 0, TAU); c.fill(); c.stroke();
    c.fillStyle = C.ink; c.beginPath(); c.ellipse(10, -174 + bob, 3.8, 2.4, 0, 0, TAU); c.fill();
    c.beginPath(); c.moveTo(-1, -181 + bob); c.quadraticCurveTo(7, -186 + bob, 17, -180 + bob); c.stroke();
    c.beginPath(); c.moveTo(6, -161 + bob); c.quadraticCurveTo(13, -159 + bob, 17, -163 + bob); c.stroke();
    // Turban: white wrap + tall red crown rod (tilting slightly forward), a small tuft of feather at the top
    c.fillStyle = turban; c.beginPath(); c.ellipse(1, -188 + bob, 22, 11, 0, 0, TAU); c.fill(); c.stroke();
    c.fillStyle = C.red; c.beginPath(); c.moveTo(-9, -192 + bob); c.quadraticCurveTo(-4, -226 + bob, 6 + sw * 0.3, -246 + bob); c.lineTo(12 + sw * 0.3, -244 + bob); c.quadraticCurveTo(12, -216 + bob, 14, -192 + bob); c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = C.gold; c.lineWidth = 3; c.beginPath(); c.moveTo(-8, -202 + bob); c.lineTo(13, -202 + bob); c.stroke(); c.strokeStyle = C.ink; c.lineWidth = 2.6 / s;
    c.fillStyle = C.cream; c.beginPath(); c.ellipse(9 + sw * 0.3, -250 + bob, 4, 9, 0.4, 0, TAU); c.fill(); c.stroke();
    c.restore();
  }
  function draw(c, lt) {
    if (!layer) build();
    const t = clamp(lt, 0, 6);
    c.drawImage(layer, 0, 0);
    wheel(c, t); water(c, t);
    // Gardener: standing beside the water wheel working the crank
    const crank = Math.sin(t * 0.8 * 3.0);
    person(c, 530, 706, 1.05, 1, C.lapis2, C.cream, t, { bob: Math.sin(t * 2.4) * 2, arm: (cc, bob) => { const hx = -70 - crank * 20, hy = -104 - crank * 14; cc.strokeStyle = C.ink; cc.lineWidth = 14; cc.beginPath(); cc.moveTo(14, -144 + bob); cc.lineTo(-24 - crank * 8, -118 + bob); cc.lineTo(hx, hy); cc.stroke(); cc.strokeStyle = C.lapis2; cc.lineWidth = 10; cc.beginPath(); cc.moveTo(14, -144 + bob); cc.lineTo(-24 - crank * 8, -118 + bob); cc.lineTo(hx, hy); cc.stroke(); cc.strokeStyle = C.ink; cc.lineWidth = 2.6; cc.fillStyle = '#e8c298'; cc.beginPath(); cc.arc(hx, hy, 5.5, 0, TAU); cc.fill(); cc.stroke(); } });
    // Readers under the pavilion (inside the cut-away building): two seated facing each other, one turning a page
    person(c, 1180, 520, 0.92, 1, C.red, C.cream, t, { ph: 0, bob: Math.sin(t * 1.4) * 1.5 });
    person(c, 1370, 520, 0.92, -1, C.teal, C.cream, t, { ph: 2, bob: Math.sin(t * 1.4 + 2) * 1.5 });
    // Petals and falling leaves: drifting from the tree crowns down onto the pool
    const r = rng(3); for (let i = 0; i < 22; i++) { const ph = r() * 6, sp = 0.4 + r() * 0.4, x0 = 160 + r() * 1600, q = ((t * sp * 0.2 + ph) % 1), x = x0 + Math.sin(t * 1.4 + i) * 24 + q * 80, y = 560 + q * 480; c.fillStyle = i % 2 ? '#f4d3d0' : '#f4e6a0'; c.strokeStyle = 'rgba(43,33,24,.5)'; c.lineWidth = 1.2; c.beginPath(); c.ellipse(x, y, 7, 4, t + i, 0, TAU); c.fill(); c.stroke(); }
    c.save(); c.globalCompositeOperation = 'multiply'; c.globalAlpha = 0.28; c.drawImage(P.texture('paper_pm', '#d6bf8a', { scale: 0.004, amt: 14, grain: 6, seed: 9 }), 0, 0); c.restore();
  }
  return { draw };
})();
