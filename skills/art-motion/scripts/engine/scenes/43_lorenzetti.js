// Lorenzetti (Siena town hall, the city panel of The Effects of Good Government): buildings fill the upper half, one stacked on another, pink/grey/ochre walls, rows of small windows, crenellated towers; the ground-floor arcade is cut open like a stage to reveal the workshops; the street is a ribbon of tiny figures, each barely a tenth of a building's height, every one at their own work.
// Subject (new composition, no famous work copied): a corner of the piazza — a ring dance, a mule train crossing, a hoist lifting stone, a shoemaker in the arcade, steps climbing to the right.
// Anchored to the originals (fetch_reference.py: The Effects of Good Government in the City, Allegory of Good Government; the third search hit was the same panel as the first, de-duplicated and dropped, so only two different works, see "known pitfalls" in protocol 16):
//   walls pink #c98f86 / grey-blue #8f98a4 / ochre #b39f8c, street sandy #b9a37c, only a thread of ultramarine sky left at the very top, windows = small dark-brown arches, people = earth red / indigo / mustard / white, deep-brown border.
// Pipeline: clean form layer (sky→rear buildings→main building with the cut-open workshop→street→steps) → MEDIUM.fresco → tiny figures drawn each frame after fresco, then lightly blurred (they are too small to be worth repainting).
SCENES['43_lorenzetti'] = (() => {
  const W = 1920, H = 1080, { clamp, lerp, rng, ss } = U, P = PAINT, M = MEDIUM, TAU = Math.PI * 2;
  let plate, built = false;
  const GROUND = () => M.plaster('lorenz', { base: '#dccfb2', seed: 13, seams: [[[0, 420], [500, 430], [1000, 414], [1500, 426], [1920, 418]]] });
  const quad = (g, p, fill) => { g.fillStyle = fill; g.beginPath(); p.forEach((q, i) => i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1])); g.closePath(); g.fill(); };
  const line = (g, p, col = '#5a463a', a = 0.7) => M.outline(g, p, { w: [1.6, 2.6, 1.6], col, a });
  // Small window (dark brown arch)
  const win = (g, x, y, w = 20, h = 34, col = '#4a3a30') => { g.fillStyle = 'rgba(255,240,215,.45)'; g.beginPath(); g.moveTo(x - 3, y + h); g.lineTo(x - 3, y + w / 2); g.arc(x + w / 2, y + w / 2, w / 2 + 3, Math.PI, 0); g.lineTo(x + w + 3, y + h); g.fill(); g.fillStyle = col; g.beginPath(); g.moveTo(x, y + h); g.lineTo(x, y + w / 2); g.arc(x + w / 2, y + w / 2, w / 2, Math.PI, 0); g.lineTo(x + w, y + h); g.fill(); };
  function block(g, x, y, w, h, c0, c1, rows, cols, o = {}) {
    const gr = g.createLinearGradient(x, y, x + w, y + h); gr.addColorStop(0, c0); gr.addColorStop(1, c1); g.fillStyle = gr; g.fillRect(x, y, w, h);
    { const rr = rng((x + y) | 0); g.save(); g.filter = 'blur(10px)'; for (let i = 0; i < 26; i++) { g.fillStyle = rr() < 0.5 ? 'rgba(255,240,220,.07)' : 'rgba(70,40,40,.06)'; g.beginPath(); g.ellipse(x + rr() * w, y + rr() * h, 50 + rr() * 110, 30 + rr() * 60, (rr() - .5) * 0.5, 0, TAU); g.fill(); } g.restore();
      g.strokeStyle = 'rgba(80,50,44,.16)'; g.lineWidth = 1.4; for (let yy = y + 20; yy < y + h; yy += 36) { g.beginPath(); g.moveTo(x, yy); g.lineTo(x + w, yy + (rr() - .5) * 3); g.stroke(); }
      g.fillStyle = 'rgba(40,24,24,.22)'; g.fillRect(x, y + h - 14, w, 14); g.fillStyle = 'rgba(255,240,210,.35)'; g.fillRect(x, y, w, 5); }
    if (o.side) quad(g, [[x + w, y], [x + w + o.side, y - 26], [x + w + o.side, y + h - 30], [x + w, y + h]], o.sideCol || c1);
    for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) win(g, x + 24 + k * ((w - 48) / cols), y + 34 + r * ((h - 90) / rows), 20, 34);
    if (o.cren) for (let k = 0; k < Math.floor(w / 44); k++) { g.fillStyle = c0; g.fillRect(x + 6 + k * 44, y - 26, 28, 28); }
    line(g, [[x, y + h], [x, y], [x + w, y], [x + w, y + h]]);
  }
  function build() {
    plate = P.canvas(); const g = plate.getContext('2d'), r = rng(8);
    // Sky: only a thread of ultramarine left along the top
    const sg = g.createLinearGradient(0, 0, 0, 440); sg.addColorStop(0, '#34569e'); sg.addColorStop(0.35, '#8aa2cc'); sg.addColorStop(1, '#d6cdb8'); g.fillStyle = sg; g.fillRect(0, 0, W, 440);
    // Rear row: distant towers and roofs, colours a little paler (air)
    block(g, 560, 70, 150, 470, '#a9a7ae', '#8a8890', 6, 3, { cren: true });
    block(g, 330, 190, 250, 360, '#cfa59c', '#b88478', 4, 5);
    block(g, 740, 150, 330, 400, '#bdb09a', '#a09078', 5, 6, { cren: true });
    block(g, 1100, 120, 260, 430, '#c99a8f', '#a8766a', 5, 4);
    // Roof tiles (rear row): ochre-red slopes
    [[330, 190, 250], [1100, 120, 260]].forEach(([x, y, w]) => { quad(g, [[x - 14, y], [x + 40, y - 46], [x + w - 40, y - 46], [x + w + 14, y]], '#a85a44'); line(g, [[x - 14, y], [x + 40, y - 46], [x + w - 40, y - 46], [x + w + 14, y]]); });
    // Middle distance: a whole row of low buildings and city wall receding (filling the centre, the air even paler), then closing in toward the street
    const far = g.createLinearGradient(0, 430, 0, 760); far.addColorStop(0, '#d6cdb8'); far.addColorStop(1, '#bfae96'); g.fillStyle = far; g.fillRect(560, 430, 800, 330);
    block(g, 600, 400, 210, 360, '#c8a89a', '#a88a7c', 4, 4);
    block(g, 830, 470, 250, 290, '#c2b6a2', '#a6987f', 3, 5, { cren: true });
    block(g, 1090, 440, 170, 320, '#bd9c90', '#9c7c70', 4, 3);
    quad(g, [[586, 400], [640, 360], [790, 360], [826, 400]], '#a85a44'); quad(g, [[1076, 440], [1110, 404], [1230, 404], [1274, 440]], '#9c503c');
    g.fillStyle = 'rgba(70,50,40,.22)'; g.fillRect(560, 700, 800, 60);                                   // dark band at the foot of the buildings
    // Main building, left: the big pink block, ground-floor arcade cut open (a stage)
    block(g, 0, 120, 560, 640, '#d6a199', '#b87d72', 5, 6, { side: 70, sideCol: '#9c6a60', cren: true });
    // Main building, right: ochre-grey with balconies
    block(g, 1340, 90, 580, 680, '#b7b3b6', '#8f8c94', 5, 6, { cren: true });
    g.fillStyle = '#8a4a3c'; for (let k = 0; k < 4; k++) g.fillRect(1380 + k * 130, 330 + (k % 2) * 140, 74, 10);        // balconies
    // Arcade (the cut-open workshop): ground floor of the left block
    const ax = 70, ay = 500, aw = 360, ah = 260;
    g.fillStyle = '#3d2f28'; g.beginPath(); g.moveTo(ax, ay + ah); g.lineTo(ax, ay + 70); g.arc(ax + aw / 2, ay + 70, aw / 2, Math.PI, 0); g.lineTo(ax + aw, ay + ah); g.fill();
    const ig = g.createLinearGradient(0, ay, 0, ay + ah); ig.addColorStop(0, '#9a7d5e'); ig.addColorStop(1, '#c4a97c'); g.fillStyle = ig;
    g.beginPath(); g.moveTo(ax + 14, ay + ah); g.lineTo(ax + 14, ay + 70); g.arc(ax + aw / 2, ay + 70, aw / 2 - 14, Math.PI, 0); g.lineTo(ax + aw - 14, ay + ah); g.fill();
    g.fillStyle = '#6a4a34'; g.fillRect(ax + 40, ay + 170, 150, 14); g.fillRect(ax + 50, ay + 184, 10, 76); g.fillRect(ax + 170, ay + 184, 10, 76);      // workbench
    g.fillStyle = '#b8402e'; [[ax + 230, ay + 120], [ax + 270, ay + 140], [ax + 300, ay + 110]].forEach(([x, y]) => { g.beginPath(); g.ellipse(x, y, 16, 10, 0, 0, TAU); g.fill(); });  // shoes on the shelf
    g.strokeStyle = '#e4cf8f'; g.lineWidth = 7; g.beginPath(); g.arc(ax + aw / 2, ay + 70, aw / 2 + 4, Math.PI, 0); g.stroke();
    // Right block, ground floor: open colonnade + bolts of cloth
    for (let k = 0; k < 4; k++) { const x = 1360 + k * 140; g.fillStyle = '#e1d2b4'; g.fillRect(x, 560, 26, 200); g.fillStyle = '#4a3a30'; g.beginPath(); g.moveTo(x + 26, 760); g.lineTo(x + 26, 620); g.arc(x + 83, 620, 57, Math.PI, 0); g.lineTo(x + 140, 760); g.fill(); }
    [['#b8402e', 1400], ['#2f5d94', 1540], ['#d9b04a', 1680]].forEach(([c, x]) => { quad(g, [[x, 640], [x + 60, 640], [x + 66, 740], [x - 6, 740]], c); });
    // Scaffolding: a row of posts and cross-beams on the left side of the right block
    g.strokeStyle = '#6a4a34'; g.lineWidth = 7; [1250, 1320].forEach(x => { g.beginPath(); g.moveTo(x, 770); g.lineTo(x, 190); g.stroke(); }); [260, 400, 540, 680].forEach(y => { g.beginPath(); g.moveTo(1240, y); g.lineTo(1330, y); g.stroke(); });
    // Street: sandy, oblique perspective, dark in the foreground and bright in the distance
    const gr = g.createLinearGradient(0, 740, 0, H); gr.addColorStop(0, '#c9b58a'); gr.addColorStop(0.6, '#b49c70'); gr.addColorStop(1, '#8c7650'); g.fillStyle = gr; g.fillRect(0, 740, W, H - 740);
    for (let i = 0; i < 380; i++) { g.fillStyle = `rgba(${r() < 0.5 ? '90,70,44' : '224,206,158'},${0.1 + r() * 0.16})`; g.fillRect(r() * W, 760 + r() * 300, 6 + r() * 40, 2 + r() * 2); }
    // Steps (climbing to the right): a red brick stair
    for (let k = 0; k < 7; k++) { const x = 1080 + k * 40, y = 790 - k * 18; quad(g, [[x, y], [x + 40, y], [x + 40, 800], [x, 800]], k % 2 ? '#a8645a' : '#b8786a'); line(g, [[x, y], [x + 40, y]], '#5a3a30', 0.5); }
    quad(g, [[0, 760], [560, 760], [420, 1004], [0, 1004]], 'rgba(60,44,60,.18)');             // shadow of the left block falling across the street
    // Deep brown band along the bottom edge + "inscription" (one row of fake strokes, never set as real letters)
    g.fillStyle = '#e8dcc0'; g.fillRect(0, 1010, W, 70); g.fillStyle = '#4a3a30'; g.fillRect(0, 1004, W, 8); g.fillRect(0, 1076, W, 4);
    for (let x = 60; x < W - 60; x += 16 + (r() * 30 | 0)) { g.fillRect(x, 1030 + (r() * 4 | 0), 6 + r() * 8, 20); }
    built = true;
  }
  // Tiny figure (the tall Sienese type): small head and long body, robe flaring out at the hem with folds, narrow shoulders, three-quarter view, robe lit on the left and dark on the right; the hem swings as they walk and the front foot shows
  function tiny(g, x, y, s, o) {
    const { robe = '#b8402e', hat = null, skin = '#e2b48a', face = 1, arm = 0, walk = 0, hair = '#4a3322', under = null, carry = null } = o;
    s *= 0.95;
    const dk = M.css(M.mix(robe, '#1c1428', 0.38)), lt = M.css(M.mix(robe, '#fff4dc', 0.3)), mid = M.css(robe);
    g.fillStyle = 'rgba(60,40,24,.26)'; g.beginPath(); g.ellipse(x, y + 2, 21 * s, 5 * s, 0, 0, TAU); g.fill();
    g.save(); g.translate(x, y); g.scale(s * face, s);
    const sw = Math.sin(walk), bob = Math.abs(sw) * 1.6, H0 = -104 - bob;
    // front foot poking out from under the hem
    g.fillStyle = '#3d2a24'; g.beginPath(); g.ellipse(7 + sw * 7, -2, 7, 3.2, 0, 0, TAU); g.ellipse(-6 - sw * 7, -2, 7, 3.2, 0, 0, TAU); g.fill();
    // Robe: narrow shoulders → waist → flared hem, the hem swinging left and right with each step
    const hem = 18, fl = sw * 4;
    const gr = g.createLinearGradient(-hem, 0, hem, 0); gr.addColorStop(0, lt); gr.addColorStop(0.45, mid); gr.addColorStop(1, dk); g.fillStyle = gr;
    g.beginPath(); g.moveTo(-8, H0 + 22); g.quadraticCurveTo(-10, -62, -13 + fl * 0.3, -34); g.quadraticCurveTo(-hem - 2 + fl, -14, -hem + fl, -4);
    g.quadraticCurveTo(0, 2, hem + fl, -4); g.quadraticCurveTo(hem - 1 + fl, -16, 12 + fl * 0.3, -34); g.quadraticCurveTo(10, -62, 8, H0 + 22); g.closePath(); g.fill();
    // Folds: three arcs running from top to bottom, deepened at the hem
    g.strokeStyle = dk; g.globalAlpha = 0.5; g.lineWidth = 1.6; g.lineCap = 'round';
    [[-4, -2], [2, 4], [8, 9]].forEach(([u, v]) => { g.beginPath(); g.moveTo(u * 0.5, -66); g.quadraticCurveTo(u + v * 0.3, -36, u * 1.8 + fl, -5); g.stroke(); }); g.globalAlpha = 1;
    // Belt + hem trim
    g.fillStyle = 'rgba(30,20,20,.35)'; g.fillRect(-10, -66, 20, 3.5);
    g.strokeStyle = under || lt; g.lineWidth = 2.2; g.beginPath(); g.moveTo(-hem + fl, -4); g.quadraticCurveTo(0, 2, hem + fl, -4); g.stroke();
    // Sleeves and hands: upper arm along the body, forearm raised with arm (holding hands / carrying something)
    const ax = 9, ay = H0 + 26, ex = 13 + arm * 7, ey = -64 + arm * 8, hx = 14 + arm * 11, hy = -52 - arm * 22;
    g.strokeStyle = mid; g.lineWidth = 6.5; g.beginPath(); g.moveTo(-ax, ay); g.lineTo(-ex, ey); g.lineTo(-hx, hy); g.moveTo(ax, ay); g.lineTo(ex, ey); g.lineTo(hx, hy); g.stroke();
    g.fillStyle = skin; g.beginPath(); g.arc(-hx, hy, 3, 0, TAU); g.arc(hx, hy, 3, 0, TAU); g.fill();
    // Neck, head (small, 3/4: face turned to one side, a clump of hair behind the ear)
    g.fillStyle = skin; g.fillRect(-2.6, H0 + 12, 5.2, 7);
    g.beginPath(); g.ellipse(0.8, H0 + 5, 6.4, 7.6, 0, 0, TAU); g.fill();
    g.fillStyle = 'rgba(120,60,40,.25)'; g.beginPath(); g.ellipse(-2.8, H0 + 5, 3.2, 6.8, 0, 0, TAU); g.fill();
    g.fillStyle = hair; g.beginPath(); g.ellipse(-2.4, H0 + 1.5, 6.2, 6.4, 0, Math.PI * 0.55, Math.PI * 1.9); g.fill();
    g.fillStyle = '#3a2a22'; g.fillRect(3.6, H0 + 4, 1.8, 1.8);
    if (hat) { g.fillStyle = M.css(hat); g.beginPath(); g.ellipse(-0.6, H0 - 1.5, 7.8, 4.2, 0, Math.PI, TAU); g.fill(); g.fillRect(-7.4, H0 - 3, 14.6, 3); g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(-7.4, H0 - 0.5, 14.6, 1.6); }
    if (carry) { g.fillStyle = carry; g.beginPath(); g.ellipse(hx + 6, hy - 6, 9, 7, 0, 0, TAU); g.fill(); }
    g.restore();
  }
  const COL = [['#b8402e', null], ['#2f5d94', '#2f5d94'], ['#d9b04a', null], ['#f1ead6', '#b8402e'], ['#6e8a52', null], ['#8c3d5a', '#8c3d5a']];
  function draw(c, lt) {
    if (!built) build();
    const t = clamp(lt, 0, 6);
    const live = P.scratch('lorenz_live'), g = live.getContext('2d'); g.reset(); g.drawImage(plate, 0, 0);
    // Ring dance: six people around an ellipse, holding hands, sorted front to back by y
    const cx = 760, cy = 850, rx = 150, ry = 36, rot = t * 0.9, ring = [];
    for (let i = 0; i < 6; i++) { const a = rot + i / 6 * TAU; ring.push({ x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry, i, a }); }
    g.strokeStyle = '#3d2f28'; g.lineWidth = 3; g.beginPath(); ring.slice().sort((a, b) => a.i - b.i).forEach((p, k, arr) => { const q = arr[(k + 1) % 6]; g.moveTo(p.x, p.y - 44); g.lineTo(q.x, q.y - 44); }); g.stroke();
    ring.sort((p, q) => p.y - q.y).forEach(p => { tiny(g, p.x, p.y, 1.15, { robe: COL[p.i][0], hat: COL[p.i][1], face: Math.sin(p.a) > 0 ? 1 : -1, arm: 0.5 + Math.sin(t * 4 + p.i) * 0.12, walk: t * 6 + p.i }); });
    // Crowd filling the street: a dozen walkers, each going at their own speed and direction (looping), bigger near and smaller far by y; two or three abreast, one of them carrying goods
    const WALK = [[0,830,.07,'#b8402e','#2f5d94'],[0,842,.07,'#f1ead6',null],[0,990,.05,'#2f5d94',null],[0,1002,.05,'#8c3d5a','#b8402e'],[0,880,.04,'#6e8a52','#d9b04a'],
      [1,900,.045,'#d9b04a',null],[1,914,.045,'#b8402e','#2f5d94'],[1,928,.045,'#6e8a52','#8c3d5a'],[0,950,.06,'#f1ead6','#8c3d5a'],[0,800,.035,'#2f5d94','#b8402e'],[1,812,.035,'#d9b04a',null],[1,972,.055,'#6e8a52',null],[0,860,.03,'#8c3d5a',null],
      [1,820,.04,'#b8402e',null],[1,834,.04,'#f1ead6','#2f5d94'],[0,918,.05,'#2f5d94','#d9b04a'],[0,932,.05,'#d9b04a',null],[1,1000,.03,'#8c3d5a','#2f5d94'],[0,792,.05,'#6e8a52',null],[1,968,.06,'#b8402e','#8c3d5a']];
    const people = WALK.map((w, i) => { const dir = w[0] ? -1 : 1, u = ((i * 0.137 + t * w[2] * dir) % 1 + 1) % 1; return { x: -60 + u * 2040, y: w[1], s: 0.82 + (w[1] - 790) / 400, dir, c: w[3], h: w[4], ph: t * 6 * (0.6 + w[2] * 8) + i * 1.9, i }; });
    people.sort((a, b) => a.y - b.y).forEach(q => { if (q.x > 1040 && q.x < 1400 && q.y < 830) return; if (Math.abs(q.x - cx) < rx + 60 && Math.abs(q.y - cy) < ry + 70) return; tiny(g, q.x, q.y, q.s, { robe: q.c, hat: q.h, face: q.dir, walk: q.ph, arm: 0.1, carry: q.i % 5 === 2 ? '#d6c79a' : null }); });
    // Mule train crossing: left→right, carrying two sacks, the driver out in front
    const mu = lerp(-300, 1900, ss(0, 6, t)), my = 1002;
    g.save(); g.translate(mu, my); g.scale(0.85, 0.85); g.fillStyle = '#7a6a5a'; g.beginPath(); g.ellipse(0, -54, 70, 30, 0, 0, TAU); g.fill(); g.fillRect(48, -86, 30, 40); g.beginPath(); g.ellipse(86, -86, 22, 14, -0.3, 0, TAU); g.fill();
    for (let l = 0; l < 4; l++) { const sw = Math.sin(t * 7 + l * 1.6) * 6; g.fillRect(-50 + l * 32 + sw * (l % 2 ? 1 : -1), -30, 10, 34); }
    g.fillStyle = '#d6c79a'; g.beginPath(); g.ellipse(-20, -90, 30, 24, 0, 0, TAU); g.ellipse(26, -92, 28, 22, 0, 0, TAU); g.fill(); g.restore();
    tiny(g, mu + 150, my + 6, 1.3, { robe: '#d9b04a', hat: '#2f5d94', walk: t * 7 });
    // Shoemaker in the workshop: hammer up, hammer down
    const hm = Math.abs(Math.sin(t * 6));
    tiny(g, 190, 688, 1.7, { robe: '#2f5d94', hat: '#b8402e', arm: 0.2 + hm * 0.8 });
    g.strokeStyle = '#4a3a30'; g.lineWidth = 5; g.beginPath(); g.moveTo(224, 646 - hm * 22); g.lineTo(246, 622 - hm * 30); g.stroke();
    // Scaffolding: hoisting stone (rope down from the top beam), a man up there hauling it
    const up = ss(0.4, 5.6, t), sy = lerp(740, 330, up);
    g.strokeStyle = '#6a4a34'; g.lineWidth = 3; g.beginPath(); g.moveTo(1285, 260); g.lineTo(1285, sy - 8); g.stroke();
    g.fillStyle = '#9a9488'; g.beginPath(); g.moveTo(1262, sy); g.lineTo(1308, sy); g.lineTo(1304, sy + 36); g.lineTo(1266, sy + 38); g.closePath(); g.fill();
    tiny(g, 1290, 262, 1.3, { robe: '#d9b04a', hat: '#8c3d5a', arm: 0.6 + Math.sin(t * 5) * 0.2, face: -1 });
    tiny(g, 1180, 786, 1.5, { robe: '#b8402e', hat: '#2f5d94', arm: 0.5 + Math.sin(t * 5) * 0.25 });                            // the man hauling the rope on the ground
    // a few walkers up and down the steps
    [[1130, 744, '#6e8a52'], [1250, 672, '#f1ead6']].forEach(([x, y, col], i) => tiny(g, x + Math.sin(t * 0.8 + i) * 8, y, 1.4, { robe: col, hat: i ? '#b8402e' : null, walk: t * 5 + i, face: -1 }));
    // little flag on top of the tower
    g.fillStyle = '#b8402e'; g.beginPath(); g.moveTo(635, 38); g.lineTo(700 + Math.sin(t * 5) * 6, 52); g.lineTo(635, 70); g.fill(); g.strokeStyle = '#4a3a30'; g.lineWidth = 3; g.beginPath(); g.moveTo(635, 30); g.lineTo(635, 80); g.stroke();
    M.fresco(c, live, { ground: GROUND(), chalk: 0.06, soften: 0.6, plasterAlpha: 0.5, sat: 1.1 });
  }
  return { draw };
})();
