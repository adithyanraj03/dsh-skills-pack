#!/usr/bin/env python3
"""Render frame by frame: start a local http server → open index.html in headless Chromium → call window.renderFrame(t)
per frame → read the canvas pixels → pipe them into ffmpeg for a 60fps mp4, then mix in the audio track.

uv run --with playwright python render.py --out ../renders/film.mp4 [--audio ../renders/score.wav] [--from 0 --to <film length>] [--fps 60]
    [--film gallery] (reads eras_gallery.js) [--solo <id> --stills 0.2,0.6 --no-counter] [--width 1080 --height 1920] (vertical full film: passed to index.html?w=&h=;
    the engine, transitions, camera and every library compute against this canvas; omit it to use window.FILM_SIZE from eras.js, and 1920×1080 if that is missing too)
uv run --with playwright python render.py --spec clip.json --out shot01.mp4 [--alpha] [--stills 0.5,2]
    Parametric clip (the "animation segment" of the voiceover pipeline; contract in references/09): duration is exactly spec.duration (frame count round(duration×fps)),
    width/height/fps come from the spec; by default silent H.264 yuv420p with one keyframe per second (GOP=fps, so the pipeline renderer can seek by second); --alpha gives ProRes 4444 with alpha (.mov). Image paths in the spec are relative to the spec file.
A pageerror or console.error on the page (scene error, missing glyph) → non-zero exit after rendering.
"""
import argparse, base64, http.server, json, socketserver, subprocess, sys, threading, functools, time, urllib.parse
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
import spec_assets
from playwright.sync_api import sync_playwright

ap = argparse.ArgumentParser()
ap.add_argument('--out', help='output file (optional with --audit)')
ap.add_argument('--audio')
ap.add_argument('--fps', type=int, default=60)
ap.add_argument('--from', dest='t0', type=float, default=0)
ap.add_argument('--to', dest='t1', type=float, default=None, help='default = the film length window.__total computed from the segment table')
ap.add_argument('--stills', help='comma-separated seconds: export only the pngs at those moments into the --out directory')
ap.add_argument('--solo', help='render only one era (time is local to that segment); use with --stills or --from/--to')
ap.add_argument('--film', default='', help='film name: reads eras_<name>.js (default eras.js)')
ap.add_argument('--no-counter', action='store_true', help="don't draw the corner label with --solo")
ap.add_argument('--crf', type=int, default=14)
ap.add_argument('--spec', help='parametric clip spec.json (goes through clip.html, does not read the segment table)')
ap.add_argument('--alpha', action='store_true', help='with --spec, output ProRes 4444 with alpha (background not drawn)')
ap.add_argument('--width', type=int, help='canvas width in full-film mode (1080 for vertical); with --spec, width/height come from the spec and this overrides the spec')
ap.add_argument('--height', type=int, help='canvas height in full-film mode (1920 for vertical)')
ap.add_argument('--audit', nargs='?', const='-', help='layout audit (only with --spec): no video; sample a frame every 0.25 s, record the position/size/alpha of every fillText on the main canvas and flag text out of frame, text too small and text overlapping text; may be followed by a JSON output path')
a = ap.parse_args()
if not a.out and not a.audit: ap.error('--out is required (unless --audit)')

root = Path(__file__).parent
spec, ALLOWED = None, set()
if a.spec:
    sp = Path(a.spec).resolve(); spec = json.loads(sp.read_text(encoding='utf-8'))
    try: spec_assets.localize(spec, sp.parent, ALLOWED)   # local paths in image / frames / data.character → /__file__/<absolute path> (only files named in the spec are served)
    except FileNotFoundError as e: raise SystemExit(str(e))
    if a.alpha: spec['alpha'] = True
    if a.width or a.height: spec['width'], spec['height'] = a.width or spec.get('width', 1920), a.height or spec.get('height', 1080)
# A single parametric clip stretched too long reads as one PowerPoint slide (one layout to the end, bullets piling up). Warn only, never fail: the pipeline has legitimate long clips.
LONG_CLIP = None
if spec and float(spec.get('duration', 0)) > 8:
    LONG_CLIP = ('\n' + '!' * 72 + f'\n!! WARNING: this clip has duration = {spec["duration"]} s, over 8 seconds.\n'
                 '!! One clip stretched that long reads as a single PowerPoint slide: one layout to the end, bullets piling up, the background dead the whole way.\n'
                 '!! Split it into shots: 2–6 seconds each, change the grammar or the approach (scenes, real footage), then concatenate (SKILL.md track, steps 3–4).\n'
                 '!! If the voiceover pipeline genuinely needs one long clip, you can ignore this.\n' + '!' * 72 + '\n')
    print(LONG_CLIP, file=sys.stderr, flush=True)

AUDIT_JS = r"""
(() => {
  window.__AUDIT = []; window.__auditT = 0;
  const P = CanvasRenderingContext2D.prototype;
  for (const fn of ['fillText', 'strokeText']) {
    const orig = P[fn];
    P[fn] = function (text, x, y) {
      try {
        if (fn === 'fillText' && this.canvas === window.__canvas && String(text).trim()) {
          const m = this.measureText(String(text)), tf = this.getTransform(), l = m.actualBoundingBoxLeft, r = m.actualBoundingBoxRight, as = m.actualBoundingBoxAscent, ds = m.actualBoundingBoxDescent;
          const pts = [[x - l, y - as], [x + r, y - as], [x + r, y + ds], [x - l, y + ds]].map(q => [tf.a * q[0] + tf.c * q[1] + tf.e, tf.b * q[0] + tf.d * q[1] + tf.f]);
          const xs = pts.map(q => q[0]), ys = pts.map(q => q[1]), px = parseFloat(this.font) * Math.hypot(tf.a, tf.b);
          window.__AUDIT.push({ t: window.__auditT, text: String(text), x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys), px, a: this.globalAlpha });
        }
      } catch (e) {}
      return orig.apply(this, arguments);
    };
  }
})();
"""

class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *x): pass
    def translate_path(self, path):
        if path.startswith('/__file__/'):
            f = urllib.parse.unquote(path[len('/__file__/'):].split('?')[0])
            return f if spec and f in ALLOWED else '/nonexistent'
        return super().translate_path(path)
# Chromium may open idle connections while loading scripts in parallel.
class LocalServer(socketserver.ThreadingTCPServer):
    request_queue_size = 128
    daemon_threads = True

srv = LocalServer(('127.0.0.1', 0), functools.partial(Q, directory=str(root)))
port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()

with sync_playwright() as p:
    b = p.chromium.launch(args=['--disable-web-security', '--enable-gpu-rasterization', '--ignore-gpu-blocklist'])
    pg = b.new_page(viewport={'width': 1920, 'height': 1080}, device_scale_factor=1)
    errors = []
    def on_console(m):
        if m.type in ('error', 'warning'): print('[page]', m.text)
        if m.type == 'error': errors.append(m.text)
    pg.on('console', on_console)
    pg.on('pageerror', lambda e: (print('[pageerror]', e), errors.append(str(e))))
    if spec:
        pg.set_viewport_size({'width': spec.get('width', 1920), 'height': spec.get('height', 1080)})
        pg.add_init_script('window.CLIP_SPEC = ' + json.dumps(spec, ensure_ascii=False) + ';')
        if a.audit: pg.add_init_script(AUDIT_JS)
        pg.goto(f'http://127.0.0.1:{port}/clip.html?render=1')
    else:
        if a.width or a.height:
            if not (a.width and a.height): raise SystemExit('--width and --height must be given together')
            pg.set_viewport_size({'width': a.width, 'height': a.height})
        pg.goto(f'http://127.0.0.1:{port}/index.html?render=1' + (f'&film={a.film}' if a.film else '') + (f'&w={a.width}&h={a.height}' if a.width else ''))
    pg.wait_for_function('window.__ready === true || !!window.__bootFailed', timeout=120000)
    bf = pg.evaluate('window.__bootFailed || null')
    if bf: raise SystemExit('Scene failed to load, refusing to render:\n' + bf)
    if a.t1 is None: a.t1 = pg.evaluate('window.__total')
    if spec: a.fps = spec.get('fps', 30); a.t0 = 0; a.t1 = spec['duration']
    grab = '''async (t)=>{ await window.prepare(t); window.renderFrame(t); return window.__canvas.toDataURL('image/png').split(',')[1]; }'''

    if a.audit:
        if not spec: raise SystemExit('--audit only works with --spec')
        import audit_clip
        rep = audit_clip.run(pg, spec, grab)
        if a.audit != '-': Path(a.audit).write_text(json.dumps(rep, ensure_ascii=False, indent=1))
        b.close(); srv.shutdown(); srv.server_close()
        sys.exit(1 if rep['red'] else 0)
    if a.solo:
        grab = '''async (t)=>{ window.renderSolo(%s, t, {counter: %s}); return window.__canvas.toDataURL('image/png').split(',')[1]; }''' % (repr(a.solo), 'false' if a.no_counter else 'true')
    if a.stills:
        out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
        for s in a.stills.split(','):
            (out / f't{float(s):06.2f}.png').write_bytes(base64.b64decode(pg.evaluate(grab, float(s))))
        print('stills ->', out)
    else:
        Path(a.out).parent.mkdir(parents=True, exist_ok=True)
        vid = a.out if not a.audio else a.out + '.noaudio.mp4'
        enc = ['-c:v', 'prores_ks', '-profile:v', '4444', '-pix_fmt', 'yuva444p10le', '-alpha_bits', '16'] if (spec and a.alpha) else \
              ['-c:v', 'libx264', '-preset', 'slow', '-crf', str(a.crf), '-pix_fmt', 'yuv420p', '-movflags', '+faststart'] + \
              (['-g', str(a.fps), '-keyint_min', str(a.fps), '-sc_threshold', '0'] if spec else [])   # the pipeline renderer seeks clips by the second: one keyframe per second, otherwise frozen frames
        if spec and a.alpha and not vid.endswith('.mov'): print('Note: ProRes 4444 usually uses a .mov container')
        ff = subprocess.Popen(['ffmpeg', '-y', '-v', 'error', '-f', 'image2pipe', '-framerate', str(a.fps), '-c:v', 'png', '-i', '-'] + enc + [vid],
                              stdin=subprocess.PIPE)
        n0, n1 = round(a.t0 * a.fps), round(a.t1 * a.fps)
        st = time.time()
        for i in range(n0, n1):
            ff.stdin.write(base64.b64decode(pg.evaluate(grab, i / a.fps)))
            if (i - n0) % 60 == 0:
                print(f'{i}/{n1}  {time.time()-st:.0f}s', flush=True)
        ff.stdin.close(); ff.wait()
        if a.audio:
            subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', vid, '-ss', str(a.t0), '-t', str(a.t1 - a.t0), '-i', a.audio,
                            '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-shortest', a.out], check=True)
            Path(vid).unlink()
        print('done ->', a.out)
    b.close()
srv.shutdown()
srv.server_close()
if LONG_CLIP: print(LONG_CLIP, file=sys.stderr)   # repeat it after rendering so the progress lines do not bury it
if errors: raise SystemExit(f'❌ {len(errors)} page error(s) (see [page]/[pageerror] above)')
