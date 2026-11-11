// Raphael (Vatican Stanza della Segnatura fresco): inside a lunette, a barrel-vaulted hall in central perspective, its coffers receding level by level to a patch of sky at the far end; figures stand in groups on a checkered floor, robes saturated (orange/blue/rose/green/lilac), poses answering one another, hands and eyelines stitching a crowd into a single body.
// Subject (new composition, no famous work copied): a library hall — two scholars at the centre argue, pointing at the coffers and a scroll; the left group gathers round a book open on a stand, the right group round a turning astrolabe; figures move on the stairs in the distance.
// Anchored to the originals (fetch_reference.py: The School of Athens, Disputa, Parnassus): ivory-white stone + blue-grey shadow #e6dcc4/#9aa4b4, a patch of sky far off #9cc0e8, robes orange #d2833a, blue #4f72b8, rose #cf7480, green #5f9468, lilac #8a78b8, gold-brown decorative band #b08a40, checkered marble floor.
// Pipeline: form layer (wall frame→perspectival vault coffers→side-wall pilasters and niches→checkered floor→steps) + figures (M.figure) → MEDIUM.fresco → gold lunette band and the grey relief band along the bottom.
SCENES['40_raphael'] = (() => {
  const W = 1920, H = 1080, { clamp, lerp, rng, ss } = U, P = PAINT, M = MEDIUM, TAU = Math.PI * 2;
  const CX = 960, SP = 500, N = 9;                                  // vanishing-point x, arch springing (eye level), number of coffer levels
  const ring = j => { const k = Math.pow(0.17, j / N); return { k, rx: 860 * k, ry: 400 * k, fl: SP + 500 * k }; };
  const ROB = { orange: ['#f4bc7e', '#d2833a', '#8c4a22'], blue: ['#9cb8e6', '#4f72b8', '#2a4278'], rose: ['#f4c0c4', '#cf7480', '#8a3e4c'], green: ['#b0d4a6', '#5f9468', '#2f5a3c'], lilac: ['#d0c6ee', '#8a78b8', '#524478'], ivory: ['#faf3de', '#dccfa8', '#9a8c68'], ochre: ['#ecd592', '#c4a050', '#7c6228'] };
  let plate, built = false, back;
  const P3 = (j, th) => { const r = ring(j); return [CX + r.rx * Math.cos(th), SP - r.ry * Math.sin(th)]; };
  const quad = (g, a, b, c2, d, fill) => { g.fillStyle = fill; g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.lineTo(...c2); g.lineTo(...d); g.closePath(); g.fill(); };
  function build() {
    plate = P.canvas(); const g = plate.getContext('2d'), rn = rng(6);
    // Outer wall: ivory white; outside the lunette is wall face (a gold-brown decorative band follows the arch)
    g.fillStyle = '#e4d8bc'; g.fillRect(0, 0, W, H);
    // Far end: a patch of sky + a smaller archway beyond
    const r8 = ring(N), sg = g.createLinearGradient(0, SP - r8.ry, 0, r8.fl); sg.addColorStop(0, '#7fa8dc'); sg.addColorStop(1, '#cfe0f0');
    g.fillStyle = sg; g.beginPath(); g.ellipse(CX, SP, r8.rx, r8.ry, 0, Math.PI, TAU); g.lineTo(CX + r8.rx, r8.fl); g.lineTo(CX - r8.rx, r8.fl); g.closePath(); g.fill();
    // Receding level by level: draw far to near (near covers far); between levels sit the side walls (pilasters/niches), the vault (coffers), the floor
    for (let j = N - 1; j >= 0; j--) {
      const a = ring(j), b = ring(j + 1), shade = 0.08 * (j % 2);
      // Floor: checkerboard
      for (let i = 0; i < 16; i++) { const x0a = CX + a.rx * (i / 8 - 1), x1a = CX + a.rx * ((i + 1) / 8 - 1), x0b = CX + b.rx * (i / 8 - 1), x1b = CX + b.rx * ((i + 1) / 8 - 1); quad(g, [x0a, a.fl], [x1a, a.fl], [x1b, b.fl], [x0b, b.fl], (i + j) % 2 ? '#e8dcc0' : '#bfb08c'); }
      // Side walls (left and right): ivory stone + pilasters one step darker
      [-1, 1].forEach(sd => { const xa = CX + sd * a.rx, xb = CX + sd * b.rx;
        quad(g, [xa, SP], [xb, SP], [xb, b.fl], [xa, a.fl], sd < 0 ? `rgba(${196 - j * 3},${186 - j * 3},${164 - j * 3},1)` : `rgba(${206 - j * 3},${196 - j * 3},${176 - j * 3},1)`);
        if (j % 3 === 0) { const wa = a.rx * 0.07, wb = b.rx * 0.07; quad(g, [xa, SP], [xa - sd * wa * 0, SP], [xb, SP], [xb, SP], 'rgba(0,0,0,0)'); quad(g, [xa - sd * wa, SP], [xa, SP], [xa, a.fl], [xa - sd * wa, a.fl], 'rgba(120,108,88,.5)'); }
        else if (j % 3 === 1) { // niche: deep recess + ivory statue
          const m = (u, v) => [lerp(xa, xb, u), lerp(lerp(SP, SP, 0), 0, 0) + lerp(lerp(SP + 40 * a.k, SP + 40 * b.k, u), lerp(a.fl - 80 * a.k, b.fl - 80 * b.k, u), v)];
          const p0 = m(0.18, 0), p1 = m(0.82, 0), p2 = m(0.82, 1), p3 = m(0.18, 1); quad(g, p0, p1, p2, p3, '#6c5f4c');
          const cx2 = lerp(xa, xb, 0.5), top = lerp(SP + 40 * a.k, SP + 40 * b.k, 0.5), bot = lerp(a.fl - 80 * a.k, b.fl - 80 * b.k, 0.5), hh = bot - top, ww = Math.abs(xb - xa) * 0.18;
          g.fillStyle = '#f0e8d4'; g.beginPath(); g.ellipse(cx2, top + hh * 0.16, ww * 0.42, hh * 0.09, 0, 0, TAU); g.fill(); g.beginPath(); g.moveTo(cx2 - ww * 0.55, top + hh * 0.24); g.lineTo(cx2 + ww * 0.55, top + hh * 0.24); g.lineTo(cx2 + ww * 0.7, bot); g.lineTo(cx2 - ww * 0.7, bot); g.closePath(); g.fill();
        } });
      // Vault: sliced by angle into coffers, each a lit face + a recessed dark frame
      const nth = 14;
      for (let i = 0; i < nth; i++) { const t0 = i / nth * Math.PI, t1 = (i + 1) / nth * Math.PI, A0 = P3(j, t0), A1 = P3(j, t1), B0 = P3(j + 1, t0), B1 = P3(j + 1, t1); const lit = 0.5 + 0.5 * Math.cos((t0 + t1) / 2 - Math.PI * 0.35);
        quad(g, A0, A1, B1, B0, `rgb(${Math.round(214 - 34 * (1 - lit) - j * 2)},${Math.round(202 - 32 * (1 - lit) - j * 2)},${Math.round(176 - 30 * (1 - lit) - j * 2)})`);
        const m = (p, q, u, v) => [lerp(p[0], q[0], u), lerp(p[1], q[1], u)]; const i0 = [lerp(A0[0], A1[0], 0.2), lerp(A0[1], A1[1], 0.2)], i1 = [lerp(A0[0], A1[0], 0.8), lerp(A0[1], A1[1], 0.8)], i2 = [lerp(B0[0], B1[0], 0.8), lerp(B0[1], B1[1], 0.8)], i3 = [lerp(B0[0], B1[0], 0.2), lerp(B0[1], B1[1], 0.2)];
        const c0 = [lerp(i0[0], i3[0], 0.2), lerp(i0[1], i3[1], 0.2)], c1 = [lerp(i1[0], i2[0], 0.2), lerp(i1[1], i2[1], 0.2)], c2 = [lerp(i1[0], i2[0], 0.8), lerp(i1[1], i2[1], 0.8)], c3 = [lerp(i0[0], i3[0], 0.8), lerp(i0[1], i3[1], 0.8)];
        quad(g, c0, c1, c2, c3, `rgba(110,98,78,${0.35 + 0.1 * (1 - lit)})`); }
      // Arch rings: a bright edge at every junction between levels
      g.strokeStyle = 'rgba(250,244,226,.7)'; g.lineWidth = Math.max(1.5, 6 * a.k); g.beginPath(); g.ellipse(CX, SP, a.rx, a.ry, 0, Math.PI, TAU); g.stroke();
    }
    // Outer frame: the wall beyond the arch — the lunette decorative band (gold-brown + ruby red + ultramarine) runs along the arch
    g.save(); g.beginPath(); g.rect(0, 0, W, H); g.ellipse(CX, SP, 860, 400, 0, 0, TAU); g.clip('evenodd'); g.fillStyle = '#e8dcc2'; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 90; i++) { g.fillStyle = `rgba(${rn() < 0.5 ? '255,248,230' : '120,100,70'},${0.04 + rn() * 0.05})`; g.beginPath(); g.ellipse(rn() * W, rn() * 480, 60 + rn() * 140, 30 + rn() * 60, 0, 0, TAU); g.fill(); }
    g.restore();
    [[900, 430, '#b08a40', 16], [880, 410, '#7a2f3c', 10], [920, 450, '#2f4f8c', 8]].forEach(([rx, ry, col, lw]) => { g.strokeStyle = col; g.lineWidth = lw; g.beginPath(); g.ellipse(CX, SP, rx, ry, 0, Math.PI, TAU); g.stroke(); });
    g.fillStyle = '#d4a85a'; for (let i = 0; i < 38; i++) { const th = Math.PI + (i + 0.5) / 38 * Math.PI, x = CX + 890 * Math.cos(th), y = SP + 420 * Math.sin(th); g.beginPath(); g.arc(x, y, 7, 0, TAU); g.fill(); }
    // Pilaster capitals and wall bases, left and right under the arch
    [[0, 160], [W - 160, 160]].forEach(([x, w]) => { g.fillStyle = '#d8ccb0'; g.fillRect(x, SP, w, H - SP); g.fillStyle = 'rgba(110,96,72,.35)'; g.fillRect(x + (x ? 0 : w - 14), SP, 14, H - SP); });
    // Foreground steps: two risers, running the full width
    quad(g, [0, 960], [W, 960], [W, 1000], [0, 1000], '#efe4c8'); quad(g, [0, 1000], [W, 1000], [W, 1030], [0, 1030], '#b8aa86'); quad(g, [0, 940], [W, 940], [W, 960], [0, 960], '#d8cba8');
    // Grey relief band along the bottom (grisaille): one small relief in each of four panels
    g.fillStyle = '#d2c6aa'; g.fillRect(0, 1030, W, 50); g.fillStyle = '#7b6c50'; g.fillRect(0, 1030, W, 5);
    for (let i = 0; i < 6; i++) { const x = 90 + i * 300; g.fillStyle = '#a89c80'; g.fillRect(x, 1040, 200, 34); g.fillStyle = '#e2d8be'; g.beginPath(); g.ellipse(x + 100, 1060, 26, 10, 0, 0, TAU); g.fill(); g.fillRect(x + 60, 1052, 80, 4); }
    built = true;
  }
  // The open book and the astrolabe on the stand
  function book(g, x, y, t) {
    g.fillStyle = '#c4b48a'; g.fillRect(x - 130, y, 260, 56); g.fillStyle = '#9a8860'; g.fillRect(x - 130, y + 56, 260, 12);
    g.fillStyle = '#f6efd6'; g.beginPath(); g.moveTo(x - 110, y - 12); g.lineTo(x, y - 24); g.lineTo(x + 110, y - 12); g.lineTo(x + 110, y + 6); g.lineTo(x, y - 6); g.lineTo(x - 110, y + 6); g.closePath(); g.fill(); g.strokeStyle = '#6a5a3c'; g.lineWidth = 2; g.stroke();
    g.strokeStyle = 'rgba(80,60,40,.6)'; g.lineWidth = 1.8; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(x - 94, y - 4 + k * 3 - 6 * (1 - k / 4)); g.lineTo(x - 12, y - 14 + k * 3); g.moveTo(x + 12, y - 14 + k * 3); g.lineTo(x + 94, y - 4 + k * 3); g.stroke(); }
  }
  function astrolabe(g, x, y, t) {
    g.fillStyle = '#c4b48a'; g.fillRect(x - 70, y + 150, 140, 18); g.fillRect(x - 12, y + 40, 24, 120);
    g.strokeStyle = '#a6802c'; g.lineWidth = 7; [0, 1, 2].forEach(k => { const a = t * 0.9 + k * 1.0; g.beginPath(); g.ellipse(x, y, 90 - k * 8, 90 * Math.abs(Math.cos(a)) + 6, k * 0.6 - 0.3, 0, TAU); g.stroke(); });
    g.fillStyle = '#4f72b8'; g.beginPath(); g.arc(x, y, 22, 0, TAU); g.fill(); g.strokeStyle = '#2a4278'; g.lineWidth = 3; g.stroke();
  }
  function fig(g, x, y, h, face, rb, mt, extra, t, seed) { M.figure(g, Object.assign({ x, y, h, face, t, seed, halo: false, robe: ROB[rb], mantle: mt ? ROB[mt] : null, under: '#f4ead0', skin: '#e2b48a', hair: '#5b3a22', sway: 0.3 }, extra)); }
  function draw(c, lt) {
    if (!built) build();
    const t = clamp(lt, 0, 6);
    const live = P.scratch('raph_live'), g = live.getContext('2d'); g.reset(); g.drawImage(plate, 0, 0);
    // Tiny figures on the distant stairs: they walk along the floor (very small silhouettes, large near and small far)
    [[0.1, 0, ROB.orange], [0.5, 1, ROB.blue], [0.8, 0, ROB.rose]].forEach(([u0, dir, col], i) => { const u = ((u0 + t * 0.03 * (dir ? -1 : 1)) % 1 + 1) % 1, y = 640 + (i % 2) * 22, x = CX - 90 + u * 180, h = 74; M.figure(g, { x, y, h, face: dir ? -1 : 1, t, seed: 40 + i, robe: col, under: '#f4ead0', skin: '#e2b48a', hair: '#5b3a22', sway: 0.6, lean: 0.02 }); });
    // Left group: the book on the stone stand, three of them gathered round it
    book(g, 560, 772, t);
    fig(g, 410, 945, 330, 1, 'green', 'ochre', { lean: 0.1, bow: 0.8, gaze: [540, 760], hands: [[500, 800], [505, 786]] }, t, 11);
    fig(g, 735, 940, 315, -1, 'lilac', 'rose', { lean: 0.07, bow: 0.6, gaze: [600, 760], hands: [[640, 790 + Math.sin(t * 1.3) * 4], null] }, t, 12);
    fig(g, 250, 950, 300, 1, 'ivory', 'blue', { lean: 0.04, bow: 0.3, gaze: [520, 750], hands: [null, null] }, t, 13);
    // Right group: the astrolabe, two watching, one reaching out to turn a ring
    astrolabe(g, 1400, 660, t);
    fig(g, 1230, 945, 325, -1, 'rose', 'blue', { lean: 0.06, bow: 0.5, gaze: [1380, 660], hands: [[1330, 710 + Math.sin(t * 2) * 6], null] }, t, 21);
    fig(g, 1590, 945, 335, -1, 'orange', 'green', { lean: 0.08, bow: 0.7, gaze: [1440, 670], hands: [[1490, 720], [1480, 690]] }, t, 22);
    fig(g, 1730, 940, 295, -1, 'ochre', null, { lean: 0.03, bow: 0.2, gaze: [1440, 730], hands: [null, null] }, t, 23);
    // The two at the centre: the left one points at the coffers (arm rising and falling), the right one unrolls a scroll, their eyelines locked together
    const pt = Math.sin(t * 1.4) * 0.5;
    fig(g, 870, 990, 385, 1, 'blue', 'orange', { lean: 0.04, bow: 0, gaze: [1000, 580], hands: [[960, 560 - pt * 20], [930, 760]] }, t, 31);
    fig(g, 1070, 990, 365, -1, 'rose', 'green', { lean: 0.05, bow: 0.2, gaze: [930, 600], hands: [[970, 790], [985, 770]] }, t, 32);
    g.strokeStyle = '#6a5a3c'; g.lineWidth = 3; g.fillStyle = '#f6efd6'; g.beginPath(); g.moveTo(950, 745); g.quadraticCurveTo(972, 735, 994, 745); g.lineTo(994, 792); g.quadraticCurveTo(972, 802, 950, 792); g.closePath(); g.fill(); g.stroke();   // scroll
    M.fresco(c, live, { ground: M.plaster('raphael', { base: '#e0d4b8', seed: 15 }), chalk: 0.05, soften: 0.5, plasterAlpha: 0.45, sat: 1.1 });
  }
  return { draw };
})();
