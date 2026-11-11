#!/usr/bin/env python3
# /// script
# dependencies = ["playwright", "numpy", "pillow"]
# ///
"""One-command acceptance for a code-animation project: stability, efficiency, motion, smoothness — numbers plus contact sheets. Always run it before delivery and put the numbers in the delivery notes.

    uv run qa.py --project <code project dir> [--film gallery] [--ids 01_cave,09_postimp] [--fps 30] [--out <dir>]
    uv run qa.py --spec <clip clip.json> [--out <dir>]      # parametric clip (the animation segment of the voiceover pipeline): the whole clip counts as one segment, portrait is fine; transitions are not measured
                                                            # the asset fields are the same set as render.py (engine/spec_assets.py): image, frames, data.image, data.character

Per segment (each id in eras.js) it does four things:
  1. Stability: a failed scene load exits immediately (engine __bootErrors); the same instant is rendered cold and hot and compared pixel by pixel (determinism).
  2. Efficiency: per-frame time — the timer includes one getImageData(1×1) to force the GPU to finish (timing only the JS sync work reports a fake 1ms; migration test B hit this).
  3. Motion: after skipping the 0.35s camera impact at the start of each segment, sample frames continuously in the still part at --fps and report the mean motion area (share of pixels whose change between adjacent frames is >12),
     plus the share of "still pairs" (adjacent frames almost unchanged, <0.05% — migration test A found that comparing only first and last misses frame-by-frame stutter).
  4. Smoothness: peak / median of the adjacent-frame difference. >6 with a peak >3% is recorded as a "jump" (whole-screen brush strokes re-shuffled at 8fps, a one-frame break, flicker — all show up here).
     Camera moves (fast push 0.28s, pan 0.30s, slam 0.17s, slow push 0.9s, find the next object 0.7s, pull back 1.1s) are not jumps; they are recorded separately as "camera events": from the jump frame expand both ways until the frame difference falls back,
     the run must be at least 2 frame pairs and no longer than 2s (+1 frame), and its last frame must be the farthest from the first (it pushes in and stays there, rather than flashing and coming back); runs longer than 0.35s must also stay smooth,
     with no single-frame spike in the middle more than 2.5× its neighbours. Before 2026-10-12 only runs within 0.35s were accepted, so a slow push was recorded as a whole run of jumps, which in effect pushed the model into making camera moves faster.
     One or two isolated frames (a break, a white flash, a whole-screen re-shuffle), a flash that goes away and comes back, or a continuous run that drags on longer are still recorded as jumps. Only pixels are read, never the camera action table,
     so a hand-written push counts the same as CAM.track; the price is that a monotone, smooth large change (say the whole screen swaps to another image and then keeps pushing) is also taken for a camera event.
It also runs a transition smoke test: every segment with a transition renders full frames (renderFrame) at p=.25/.5/.75, and errors count as page errors — in-segment frames use renderSolo,
so the transition code never runs and a broken transition can still be all green (hit while porting the all-styles sample film).
The thresholds are empirical, not rules: motion between 0.5 and 8% looks good for most segments; still pairs >40% reads as stuck; jumps >0 — look at the frames before judging (an intentional beat flash is not a bug).
  5. Framing:
     From page load on, every fillText/strokeText screen box is recorded, and reported only when it persists ≥0.3s —
     half-cut text (text partly cut off by the frame edge), overlapping text (two different strings sitting on top of each other), in subtitle band (text falls into the subtitle band and burned-in subtitles will cover it);
     also "near-blank" (almost nothing on screen: a full-screen white flash, a black frame). All of these are "go look at this frame" leads, not errors, and they never make qa fail.
     Boxes follow the canvas: text drawn into an offscreen buffer / sprite cache (including caches pre-drawn at startup) and then composited with drawImage, and text behind a bitmap push, are all measured.
     Subtitle band: y>920/1080 for a full film by default (--sub-band changes it, 0 turns it off); for a --spec clip it reads the spec's safe.bottom and checks nothing when absent.
     Blind spots: (1) sampling starts at max(--skip, transition duration) of each segment, so problems at the start of a segment or inside a transition are not seen; a blank first frame that still holds a pen or a hand (>0.3% of the frame) is not counted as near-blank.
     (2) Text drawn inside a clip (rolling numbers, revealed stroke by stroke) is checked only for half-cut text and the subtitle band, not for overlapping text. (3) Text hidden behind non-text objects (photos, paper clips, the presenter, cards that pop in later) cannot be checked,
     and when both strings are covered the overlap check also false-positives. (4) Graphics (fire, spaceships) entering the subtitle band cannot be checked; for light-background styles run scripts/subzone_gate.py on the finished film.
     (5) Hand-written text is reported per character, so you have to look at the frame to locate it; decorative large type deliberately over the subtitle band or outside the frame (such as y5's giant watermark digits) will be reported — look at it, then let it pass.

Output: <out>/qa.json (all the numbers), <out>/qa.md (table), <out>/<id>.jpg (4-frame contact sheet + motion heat map).
"""
import argparse, base64, functools, http.server, io, json, socketserver, sys, threading, urllib.parse
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent / 'engine'))
import spec_assets
import numpy as np
from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright

ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
ap.add_argument('--project'); ap.add_argument('--spec', help='parametric clip spec (goes through clip.html, the same set as render.py --spec)'); ap.add_argument('--ids'); ap.add_argument('--fps', type=float, default=30)
ap.add_argument('--out'); ap.add_argument('--film', default='', help='film name: reads eras_<name>.js'); ap.add_argument('--skip', type=float, default=0.35, help='seconds to skip at the start of each segment (camera impact)')
ap.add_argument('--sub-band', type=float, default=None, help='top edge of the subtitle band (share of frame height); 0.852 (920/1080) by default for a full film, --spec reads safe.bottom by default; write 0 to turn off the "in subtitle band" check')
a = ap.parse_args()
if not (a.project or a.spec): ap.error('pick one of --project or --spec')
spec, ALLOWED = None, set()
if a.spec:                                                 # same set as render.py: local assets (image / frames / character frame library) only serve the files named in the spec
    sp = Path(a.spec).resolve(); spec = json.loads(sp.read_text(encoding='utf-8'))
    try: spec_assets.localize(spec, sp.parent, ALLOWED)
    except FileNotFoundError as e: raise SystemExit(str(e))
root = Path(a.project).resolve() if a.project else Path(__file__).resolve().parent / 'engine'
out = Path(a.out) if a.out else (Path(a.spec).resolve().parent / 'qa' if a.spec else root.parent / 'qa'); out.mkdir(parents=True, exist_ok=True)
VW, VH = (spec.get('width', 1920), spec.get('height', 1080)) if spec else (1920, 1080)
if a.sub_band is None:   # clips are for the pipeline: subtitle clearance is written in the spec's safe.bottom; absent means no burned-in subtitles
    sb = ((spec or {}).get('safe') or {}).get('bottom', 0) if spec else None
    a.sub_band = 0.852 if sb is None else (1 - sb / VH if sb else 0)

class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *x): pass
    def translate_path(self, path):
        if path.startswith('/__file__/'):
            f = urllib.parse.unquote(path[len('/__file__/'):].split('?')[0])
            return f if f in ALLOWED else '/nonexistent'
        return super().translate_path(path)
# Chromium may open idle connections while loading scripts in parallel.
class LocalServer(socketserver.ThreadingTCPServer):
    request_queue_size = 128
    daemon_threads = True

srv = LocalServer(('127.0.0.1', 0), functools.partial(Q, directory=str(root))); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()

# Framing check: wrap fillText/strokeText and record the screen box of text drawn on a "full-frame-sized canvas" (through the current transform)
TEXT_HOOK = '''(() => {
  // A text box is recorded on the canvas it was drawn onto; when that canvas is later composited elsewhere with drawImage, the box transforms with it.
  // That way text first drawn into an offscreen buffer and then pushed as a whole (the presenter film's bitmap push), or drawn into a sprite cache and pasted onto the desk (Vox's paper cut-outs), is measured too.
  const P = CanvasRenderingContext2D.prototype;
  const sv = P.save, rs = P.restore, cl = P.clip, di = P.drawImage, cr = P.clearRect, fr = P.fillRect;
  // Remember whether a clip is currently active: rolling numbers and text revealed stroke by stroke are drawn inside a clip, so their boxes are bigger than what is visible and are not used for the overlapping-text check
  P.save = function () { (this.__cs || (this.__cs = [])).push(!!this.__clip); return sv.apply(this, arguments); };
  P.restore = function () { if (this.__cs && this.__cs.length) this.__clip = this.__cs.pop(); return rs.apply(this, arguments); };
  P.clip = function () { this.__clip = true; return cl.apply(this, arguments); };
  // When "the whole canvas is covered" clear that canvas's box records, otherwise after a cached canvas is redrawn the previous segment's text is still in the records (whiteboard s03's "rocket" false-positived into s04)
  const full = (ctx, x, y, w, h) => {                        // does this rectangle cover the whole canvas after the current transform (only non-rotated transforms are recognized)
    const T = ctx.getTransform(); if (T.b !== 0 || T.c !== 0) return false;
    const xs = [T.a * x + T.e, T.a * (x + w) + T.e], ys = [T.d * y + T.f, T.d * (y + h) + T.f];
    return Math.min(...xs) <= 0 && Math.min(...ys) <= 0 && Math.max(...xs) >= ctx.canvas.width && Math.max(...ys) >= ctx.canvas.height;
  };
  const opaque = ctx => { const f = ctx.fillStyle; if (typeof f !== 'string') return false; const m = f.match(/^(rgba|hsla)\\(([^)]*)\\)/); return !m || +m[2].split(/[ ,\\/]+/).filter(Boolean)[3] >= 1; };
  P.clearRect = function (x, y, w, h) { if (full(this, x, y, w, h)) this.canvas.__tb = []; return cr.apply(this, arguments); };
  P.fillRect = function (x, y, w, h) { if (this.globalAlpha >= 1 && (this.globalCompositeOperation === 'copy' || (this.globalCompositeOperation === 'source-over' && opaque(this))) && full(this, x, y, w, h)) this.canvas.__tb = []; return fr.apply(this, arguments); };
  if (P.reset) { const rz = P.reset; P.reset = function () { this.canvas.__tb = []; this.__cs = []; this.__clip = false; return rz.apply(this, arguments); }; }
  const pid = P.putImageData;
  P.putImageData = function (im, x, y) { if (x <= 0 && y <= 0 && x + im.width >= this.canvas.width && y + im.height >= this.canvas.height) this.canvas.__tb = []; return pid.apply(this, arguments); };
  for (const k of ['width', 'height']) {                       // resizing a canvas clears it, so clear the boxes too
    const d = Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype, k);
    Object.defineProperty(HTMLCanvasElement.prototype, k, { get: d.get, set(v) { this.__tb = []; d.set.call(this, v); }, configurable: true });
  }
  const push = (ctx, rec) => { const L = ctx.canvas.__tb || (ctx.canvas.__tb = []); L.push(rec); if (L.length > 6000) L.splice(0, 3000); };   // a canvas that is only partly cleared and redrawn over and over keeps accumulating records, so keep the most recent ones
  for (const fn of ['fillText', 'strokeText']) {
    const orig = P[fn];
    P[fn] = function (text, x, y, maxW) {
      if (this.globalAlpha > 0.15 && String(text).trim()) {     // record from load time on: text pre-drawn into a cache at startup (Vox's prewarm) must have boxes too
        const m = this.measureText(text), T = this.getTransform();
        let x0 = x - m.actualBoundingBoxLeft, x1 = x + m.actualBoundingBoxRight;
        if (maxW && x1 - x0 > maxW) x1 = x0 + maxW;
        const y0 = y - m.actualBoundingBoxAscent, y1 = y + m.actualBoundingBoxDescent;
        const xs = [], ys = [];
        for (const [px, py] of [[x0, y0], [x1, y0], [x0, y1], [x1, y1]]) { xs.push(T.a * px + T.c * py + T.e); ys.push(T.b * px + T.d * py + T.f); }
        push(this, [String(text).slice(0, 24), xs, ys, !!this.__clip]);
      }
      return orig.apply(this, arguments);
    };
  }
  P.drawImage = function (src, ...a) {
    if (this.globalCompositeOperation === 'copy') this.canvas.__tb = [];
    const L = src && src.__tb;
    if (L && L.length && src !== this.canvas && this.globalAlpha > 0.5) {   // ≤0.5 is mostly motion afterimage / trail overlays, so it is not propagated (whiteboard whip-pan afterimages stack up false overlapping text across the whole screen)
      let sx = 0, sy = 0, sw = src.width, sh = src.height, dx, dy, dw = sw, dh = sh;
      if (a.length === 2) [dx, dy] = a; else if (a.length === 4) [dx, dy, dw, dh] = a; else [sx, sy, sw, sh, dx, dy, dw, dh] = a;
      const T = this.getTransform(), kx = dw / sw, ky = dh / sh, clip = !!this.__clip || a.length === 8;
      for (const [txt, xs, ys, c0] of L) {
        if (Math.max(...xs) < sx || Math.min(...xs) > sx + sw || Math.max(...ys) < sy || Math.min(...ys) > sy + sh) continue;
        const X = [], Y = [];
        for (let k = 0; k < 4; k++) { const u = dx + (xs[k] - sx) * kx, v = dy + (ys[k] - sy) * ky; X.push(T.a * u + T.c * v + T.e); Y.push(T.b * u + T.d * v + T.f); }
        push(this, [txt, X, Y, c0 || clip]);
      }
    }
    return di.call(this, src, ...a);
  };
})();'''
GRAB = '''async ([id, lt, full]) => {
  window.__tb = true; window.__canvas.__tb = [];
  const s = performance.now();
  if (full) { await window.prepare(lt); window.renderFrame(lt); } else window.renderSolo(id, lt);
  window.__canvas.getContext('2d').getImageData(0, 0, 1, 1);           // force the GPU to finish before stopping the clock
  const ms = performance.now() - s;
  const M = window.__canvas, tb = (M.__tb || []).map(([t, xs, ys, c]) => [t, xs.map(v => v / M.width), ys.map(v => v / M.height), c]); window.__tb = null;
  return [ms, window.__canvas.toDataURL('image/png').split(',')[1], tb];
}'''

def frame_issues(tb, band):
    """Framing problems in one frame: [(kind, text)]. All coordinates are shares of the frame."""
    out, vis = [], []
    for txt, cxs, cys, clipped in tb:
        x0, y0, x1, y1 = min(cxs), min(cys), max(cxs), max(cys)
        ang = float(np.arctan2((cys[1] - cys[0]) * VH, (cxs[1] - cxs[0]) * VW))
        w, h = x1 - x0, y1 - y0
        if w <= 0 or h <= 0 or h < 0.008: continue                 # ignore tiny text (<9px)
        ix0, iy0, ix1, iy1 = max(x0, 0), max(y0, 0), min(x1, 1), min(y1, 1)
        if ix1 <= ix0 or iy1 <= iy0: continue                      # entirely outside the frame: the camera never captured it, so it does not count
        frac = (ix1 - ix0) * (iy1 - iy0) / (w * h)
        if frac < 0.9 and frac > 0.1: out.append(('half-cut text', txt))
        if band and iy1 > band + 0.004 and frac > 0.1: out.append(('in subtitle band', txt))
        if not clipped: vis.append((txt, ang, cxs, cys))
    def box(v, ang):                                                    # rotate into the ang coordinate system before taking the box: the two lines of a slanted label do not "overlap" just because their bounding boxes grow
        c, s_ = np.cos(-ang), np.sin(-ang)
        u = [x * c - y * s_ * VH / VW for x, y in zip(v[2], v[3])]; w = [x * s_ * VW / VH + y * c for x, y in zip(v[2], v[3])]
        return min(u), min(w), max(u), max(w)
    for i in range(len(vis)):
        for j in range(i + 1, len(vis)):
            a, b = vis[i], vis[j]
            if a[0] == b[0]: continue                                   # the same string drawn twice (stroke + fill, a drop shadow)
            same = abs(a[1] - b[1]) < 0.02; ang = a[1] if same else 0.0
            A, B = box(a, ang), box(b, ang)
            if not same:                                                # different angles (hand-written text jitters per character): the bounding box grows a little, so inset each by 12% before comparing
                A, B = [(r[0] + (r[2] - r[0]) * .12, r[1] + (r[3] - r[1]) * .12, r[2] - (r[2] - r[0]) * .12, r[3] - (r[3] - r[1]) * .12) for r in (A, B)]
            ow = min(A[2], B[2]) - max(A[0], B[0]); oh = min(A[3], B[3]) - max(A[1], B[1])
            if ow <= 0 or oh <= 0: continue
            small = min((A[2] - A[0]) * (A[3] - A[1]), (B[2] - B[0]) * (B[3] - B[1]))
            if ow * oh / small > 0.3: out.append(('overlapping text', a[0] + ' | ' + b[0]))
    return out

def persistent(ts, per_frame, min_s=0.3):
    """Report an issue only after it persists for ≥min_s seconds (the few frames of half-cut text while the camera pans past are normal)."""
    runs, open_ = [], {}
    for k, t in enumerate(ts):
        cur = set(per_frame[k])
        for key in list(open_):
            if key not in cur:
                t0, t1 = open_.pop(key)
                if t1 - t0 >= min_s: runs.append((key, t0, t1))
        for key in cur:
            if key in open_: open_[key] = (open_[key][0], t)
            else: open_[key] = (t, t)
    runs += [(key, t0, t1) for key, (t0, t1) in open_.items() if t1 - t0 >= min_s]
    return sorted(runs, key=lambda r: r[1])

def merge_runs(runs):
    """Text typed out character by character yields one record per character: merge same-kind, time-overlapping runs into one and join the characters."""
    out = []
    for (kind, txt), t0, t1 in sorted(runs, key=lambda r: (r[0][0], r[1])):
        if out and out[-1][0] == kind and t0 <= out[-1][3] + 0.05:
            o = out[-1]; o[3] = max(o[3], t1)
            if txt and txt not in o[1].split(' | ') and len(o[1]) < 60: o[1] = (o[1] + ' | ' + txt).strip(' |')
        else: out.append([kind, txt, t0, t1])
    return sorted(out, key=lambda r: r[2])

def near_blank(f):
    """A share of pixels differing from the frame's dominant color by >24 below 0.3% reads as "almost nothing there"."""
    med = np.median(f.reshape(-1, 3), axis=0)
    return float((np.abs(f - med).max(axis=2) > 24).mean()) < 0.003
def img(b64, w=480): return np.asarray(Image.open(io.BytesIO(base64.b64decode(b64))).convert('RGB').resize((w, round(w * VH / VW)))).astype(np.int16)   # scale by frame aspect so portrait is not squashed

def camera_events(frames, diffs, idx, fps, max_s=2.0):
    """Pick the camera moves (push/pull, pan, slam) out of the jumps (criteria in item 4 of the file header). idx: indices of the frame pairs where jumps occur. Returns (indices that are still jumps, camera events [(l, r)])."""
    keep, events = [], []
    for i in idx:
        if any(l <= i <= r for l, r in events): continue
        thr = max(0.5, 0.1 * diffs[i]); l = r = i
        while l > 0 and diffs[l - 1] > thr: l -= 1
        while r < len(diffs) - 1 and diffs[r + 1] > thr: r += 1
        n = r - l + 1
        far = [float(np.abs(frames[k] - frames[l]).mean()) for k in range(l + 1, r + 2)]   # how far each frame in the run is from the first frame
        smooth = n <= 0.35 * fps + 1 or all(diffs[k] <= 2.5 * max(diffs[k - 1], diffs[k + 1]) + 0.5 for k in range(l + 1, r))   # runs longer than 0.35s must stay smooth, with no single-frame spike in the middle
        if 2 <= n <= max_s * fps + 1 and far[-1] >= 0.8 * max(far) and smooth: events.append((l, r))
        else: keep.append(i)
    return [i for i in keep if not any(l <= i <= r for l, r in events)], events

report = {'project': str(root), 'spec': str(Path(a.spec).resolve()) if a.spec else None, 'segments': []}
errors = []
with sync_playwright() as p:
    br = p.chromium.launch(args=['--enable-gpu-rasterization', '--ignore-gpu-blocklist'])
    pg = br.new_page(viewport={'width': VW, 'height': VH})
    pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.on('console', lambda m: errors.append('console.error: ' + m.text) if m.type == 'error' else None)   # missing glyphs and the like are reported through console.error
    pg.add_init_script(TEXT_HOOK)
    if spec:
        pg.add_init_script('window.CLIP_SPEC = ' + json.dumps(spec, ensure_ascii=False) + ';')
        pg.goto(f'http://127.0.0.1:{port}/clip.html?render=1')
    else:
        pg.goto(f'http://127.0.0.1:{port}/index.html?render=1' + (f'&film={a.film}' if a.film else ''))
    pg.wait_for_function('window.__ready === true || !!window.__bootFailed', timeout=180000)
    bf = pg.evaluate('window.__bootFailed || null')
    if bf: raise SystemExit('❌ scene load failed:\n' + bf)
    segs = [{'id': Path(a.spec).resolve().parent.name, 't0': 0, 't1': spec['duration'], 'tr': 0}] if spec else \
        pg.evaluate('ERAS.map(e => ({id: e.id, t0: e.t0, t1: Math.min(e.t1, window.__total), tr: e.transition ? e.transition.dur + (e.transition.delay || 0) : 0}))')
    want = set(a.ids.split(',')) if a.ids else None
    for s in segs:
        if want and s['id'] not in want: continue
        dur = s['t1'] - s['t0']; lt0 = max(a.skip, s['tr']) if s['t0'] > 0 else 0.0
        lt1 = max(lt0 + 0.2, dur - 0.02)
        n = max(4, int((lt1 - lt0) * a.fps))
        ts = [lt0 + (lt1 - lt0) * i / (n - 1) for i in range(n)]
        full = bool(spec)                                   # clips have no renderSolo, so full frames are rendered
        cold_ms, cold, _ = pg.evaluate(GRAB, [s['id'], ts[-1], full])
        frames, ms, tbs = [], [], []
        for t in ts:
            m, b64, tb = pg.evaluate(GRAB, [s['id'], t, full]); ms.append(m); frames.append(img(b64)); tbs.append(tb or [])
        _, again, _ = pg.evaluate(GRAB, [s['id'], ts[-1], full])
        det = int(np.abs(img(again) - frames[-1]).max()); det_cold = int(np.abs(img(cold) - frames[-1]).max())
        diffs = np.array([(np.abs(frames[i + 1] - frames[i]).max(axis=2) > 12).mean() * 100 for i in range(len(frames) - 1)])
        med = float(np.median(diffs)) if len(diffs) else 0
        if spec:   # clips are mostly "move once, hold": the whole-segment median is ≈0, so a continuous push/slide would be recorded as a whole run of jumps. A clip only counts isolated jumps: 6× the median of the 3 pairs before and after
            loc = lambda i: float(np.median(np.r_[diffs[max(0, i - 3):i], diffs[i + 1:i + 4]])) if len(diffs) > 1 else 0
            sidx = [i for i, d in enumerate(diffs) if d > 3 and d > 6 * max(loc(i), 0.05)]
        else:
            sidx = [i for i, d in enumerate(diffs) if d > 3 and d > 6 * max(med, 0.05)]
        sidx, cams = camera_events(frames, diffs, sidx, a.fps)
        spikes = [round(ts[i + 1], 3) for i in sidx]
        still = float((diffs < 0.05).mean() * 100)
        heat = np.zeros(frames[0].shape[:2]); [heat.__iadd__((np.abs(frames[i + 1] - frames[i]).max(axis=2) > 12)) for i in range(len(frames) - 1)]
        rec = {'id': s['id'], 'window_lt': [round(lt0, 3), round(lt1, 3)], 'frames': n,
               'ms_mean': round(float(np.mean(ms)), 1), 'ms_max': round(float(np.max(ms)), 1), 'ms_cold': round(cold_ms, 1),
               'deterministic': det == 0 and det_cold == 0, 'det_maxdiff': max(det, det_cold),
               'motion_pct': round(float(diffs.mean()), 2), 'motion_max': round(float(diffs.max()), 2), 'still_pairs_pct': round(still, 1),
               'spike_ratio': round(float(diffs.max() / max(med, 0.05)), 1), 'spikes_at_lt': spikes,
               'camera_events_lt': [[round(ts[l], 3), round(ts[r + 1], 3)] for l, r in cams]}
        frame_runs = merge_runs(persistent(ts, [frame_issues(tb, a.sub_band) for tb in tbs]) +
                                persistent(ts, [[('near-blank', '')] if near_blank(f) else [] for f in frames]))
        rec['framing'] = [{'kind': k, 'text': txt, 'lt': [round(t0, 2), round(t1, 2)], 't': [round(s['t0'] + t0, 2), round(s['t0'] + t1, 2)]} for k, txt, t0, t1 in frame_runs]
        rec['text_tracked'] = sum(map(len, tbs))
        report['segments'].append(rec)
        # contact sheet: 4 frames + heat map
        pick = [frames[int(k)] for k in np.linspace(0, n - 1, 4)]
        H_, W_ = frames[0].shape[:2]; S = Image.new('RGB', (W_ * 5, H_ + 20), 'white'); dr = ImageDraw.Draw(S)
        for k, f in enumerate(pick): S.paste(Image.fromarray(f.astype(np.uint8)), (k * W_, 20))
        hm = np.clip(heat / max(1, heat.max()) * 255, 0, 255).astype(np.uint8)
        base = Image.fromarray(pick[0].astype(np.uint8)).convert('L').convert('RGB'); red = np.zeros((H_, W_, 3), np.uint8); red[..., 0] = hm
        S.paste(Image.blend(base, Image.fromarray(red), 0.6), (4 * W_, 20))
        dr.text((4, 4), f"{s['id']}  motion {rec['motion_pct']}%  still pairs {rec['still_pairs_pct']}%  jumps {len(spikes)}  camera events {len(cams)}  {rec['ms_mean']}/{rec['ms_max']}ms  deterministic {'✓' if rec['deterministic'] else '✗'}", fill='black')
        S.save(out / f"{s['id']}.jpg", quality=85)
        print(f"{s['id']:<18} motion {rec['motion_pct']:>5}%  still pairs {rec['still_pairs_pct']:>5}%  jumps {len(spikes)}  camera events {len(cams)}  {rec['ms_mean']:>6}/{rec['ms_max']:>6}ms  deterministic {'✓' if rec['deterministic'] else '✗ ' + str(rec['det_maxdiff'])}  framing {len(rec['framing'])}")
        for r in rec['framing']: print(f"    {r['kind']}  {r['t'][0]:.2f}–{r['t'][1]:.2f}s  {r['text']}")
    # transition smoke test: only checks that it renders and how long it takes, not part of the motion/smoothness criteria
    report['transitions'] = []
    for s in ([] if spec else pg.evaluate('ERAS.map(e => ({id: e.id, t0: e.t0, tr: e.transition ? {type: e.transition.type, dur: e.transition.dur, delay: e.transition.delay || 0} : null}))')):
        if not s['tr'] or (want and s['id'] not in want): continue
        ms_tr = []
        for p in (0.25, 0.5, 0.75):
            t = s['t0'] + s['tr']['delay'] + s['tr']['dur'] * p
            try:
                m, *_ = pg.evaluate(GRAB, [s['id'], t, True]); ms_tr.append(m)
            except Exception as ex:
                errors.append(f"transition {s['tr']['type']} (into {s['id']}) p={p}: {str(ex).splitlines()[0]}")
        report['transitions'].append({'id': s['id'], 'type': s['tr']['type'], 'ms_max': round(max(ms_tr), 1) if ms_tr else None})
    if report['transitions']: print('transition smoke test', len(report['transitions']), 'transitions, slowest', max((r['ms_max'] or 0, r['type']) for r in report['transitions']))
    br.close()
srv.shutdown()
srv.server_close()
report['page_errors'] = errors
json.dump(report, open(out / 'qa.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
rows = ['| segment | motion% | still pairs% | jumps | camera events | mean/peak ms | cold start ms | deterministic | framing |', '|---|---|---|---|---|---|---|---|---|']
for r in report['segments']:
    rows.append(f"| {r['id']} | {r['motion_pct']} | {r['still_pairs_pct']} | {len(r['spikes_at_lt'])} {r['spikes_at_lt'][:3]} | {len(r['camera_events_lt'])} | {r['ms_mean']}/{r['ms_max']} | {r['ms_cold']} | {'✓' if r['deterministic'] else '✗'} | {len(r['framing'])} |")
fr = [(r['id'], x) for r in report['segments'] for x in r['framing']]
if fr: rows += ['', 'framing leads (film seconds, persisted ≥0.3s; look at the frame before judging):'] + [f"- {x['kind']} {x['t'][0]:.2f}–{x['t'][1]:.2f}s ({i}) {x['text']}" for i, x in fr]
if report.get('transitions'): rows += ['', 'transition smoke test (full frames, peak ms): ' + ', '.join(f"{r['type']}→{r['id']} {r['ms_max']}" for r in report['transitions'])]
(out / 'qa.md').write_text('\n'.join(rows) + ('\n\npage errors:\n' + '\n'.join(errors) if errors else '') + '\n')
print('->', out / 'qa.md')
if not spec and root != Path(__file__).resolve().parent / 'engine':   # feedback fallback (section 1 of ref 12): qa is mandatory before delivery, so remind here, but never let qa fail
    import re, time
    draft = next((d / 'feedback-draft.md' for d in (root.parent, root.parent.parent) if (d / 'feedback-draft.md').exists()), None)
    if not draft: print(f'feedback reminder: the project root ({root.parent.name}) has no feedback-draft.md yet. Append a few entries after each round; the format is in the feedback section of references/12-full-vo-film-and-feedback.md.')
    else:
        txt = draft.read_text(encoding='utf-8'); age = (time.time() - draft.stat().st_mtime) / 60
        tail = txt.rsplit('> waterline', 1)[-1] if '> waterline' in txt else txt     # below the waterline = not yet written back into the skill
        n = len(re.findall(r'^### \[', tail, re.M))
        print(f'feedback reminder: feedback-draft.md was last written {age:.0f} minutes ago; {n} entries are not yet written back into the skill (merge them per the destination table when closing out, then add a "> waterline <time>" line at the end of the draft).')
if errors: raise SystemExit('❌ page runtime errors: %d, see qa.md' % len(errors))
