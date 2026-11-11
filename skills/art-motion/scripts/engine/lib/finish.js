// Final-film texture layer (spec.finish): post applied to the whole frame once a frame is drawn. Shared by every grammar; off by default (clean).
// spec.finish = preset name | { vignette, bloom, grain, contrast, saturate, warm } (keys in the object override the preset).
//   soft  : light vignette + very faint bloom + fine grain — never looks dirty on dark or light grounds; the recommended default for most voiceover films
//   film  : heavier vignette + bloom + visible grain + a touch of warmth — narrative, story type
//   punch : contrast + saturation each raised a little + light vignette — launches, finance, passages that must grab the eye
//   clean : does nothing (same as omitting it)
// Key meanings: vignette strength 0–0.6; bloom strength 0–0.4; grain strength 0–0.12 (stepped at 24fps, deterministic); contrast/saturate 1 = unchanged; warm 0–0.12 warm colour wash.
// In alpha mode (transparent background) never applied: the post would tint the transparent areas black.
// Determinism: grain depends only on the frame index, so rendering the same moment twice is pixel-identical.
(() => {
const { clamp } = U;
const PRESETS = {
  clean: {},
  soft: { vignette: 0.2, bloom: 0.1, grain: 0.035 },
  film: { vignette: 0.34, bloom: 0.12, grain: 0.07, warm: 0.04 },
  punch: { vignette: 0.16, bloom: 0.08, contrast: 1.07, saturate: 1.1 },
};
const cache = {};
const scratch = (k, w, h) => { let c = cache[k]; if (!c || c.width !== w || c.height !== h) { c = cache[k] = document.createElement('canvas'); c.width = w; c.height = h; } return c; };
// Grain tile: three 256×256 grayscale noise tiles, fixed seed
function grainTiles() {
  if (cache.__grain) return cache.__grain;
  const r = U.rng(20261016), tiles = [];
  for (let k = 0; k < 3; k++) { const cv = document.createElement('canvas'); cv.width = cv.height = 256; const g = cv.getContext('2d'), im = g.createImageData(256, 256);
    for (let i = 0; i < 256 * 256; i++) { const v = 128 + (r() + r() + r() - 1.5) * 90; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; }
    g.putImageData(im, 0, 0); tiles.push(cv); }
  return (cache.__grain = tiles);
}
const FINISH = window.FINISH = {
  PRESETS,
  // Parse spec.finish: return the full parameter object, or null (not applied). A misspelled preset name → throw (clip.js turns it into a startup failure)
  resolve(f) {
    if (f == null || f === false || f === 'clean') return null;
    let o = typeof f === 'string' ? PRESETS[f] : { ...(PRESETS[f.preset] || {}), ...f };
    if (!o) throw new Error(`spec.finish "${f}" is not a preset: ${Object.keys(PRESETS).join(' / ')} (or write an object {vignette, bloom, grain, contrast, saturate, warm})`);
    const bad = Object.keys(o).filter(k => !['vignette', 'bloom', 'grain', 'contrast', 'saturate', 'warm', 'preset'].includes(k));
    if (bad.length) throw new Error(`spec.finish has no such keys: ${bad.join(', ')} (available: vignette bloom grain contrast saturate warm)`);
    return Object.keys(o).length ? o : null;
  },
  apply(c, t, o, W, H, fps = 30) {
    if (!o) return;
    const cv = c.canvas;
    // Contrast/saturation: run the whole frame through a CSS filter once
    if ((o.contrast && o.contrast !== 1) || (o.saturate && o.saturate !== 1)) {
      const s = scratch('fin_cs', W, H), g = s.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H); g.drawImage(cv, 0, 0);
      c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.filter = `contrast(${o.contrast || 1}) saturate(${o.saturate || 1})`; c.drawImage(s, 0, 0); c.restore();
    }
    // Bloom: downscale, blur, then screen it back on (highlights bleed a little)
    if (o.bloom > 0) {
      const sw = Math.max(64, Math.round(W / 6)), sh = Math.max(64, Math.round(H / 6)), s = scratch('fin_bloom', sw, sh), g = s.getContext('2d');
      g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, sw, sh); g.filter = 'blur(5px) brightness(1.15)'; g.drawImage(cv, 0, 0, sw, sh); g.filter = 'none';
      c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'screen'; c.globalAlpha = clamp(o.bloom, 0, 0.5); c.imageSmoothingQuality = 'high'; c.drawImage(s, 0, 0, W, H); c.restore();
    }
    // Warm colour wash
    if (o.warm > 0) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'soft-light'; c.fillStyle = `rgba(255,190,120,${clamp(o.warm, 0, 0.2) * 2})`; c.fillRect(0, 0, W, H); c.restore(); }
    // Grain: steps at 24fps with a random offset; overlays grayscale noise
    if (o.grain > 0) {
      const tiles = grainTiles(), f = Math.floor(t * 24 + 1e-6), tile = tiles[f % 3], r = U.rng(f * 7919 + 13), ox = Math.floor(r() * 256), oy = Math.floor(r() * 256);
      c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'overlay'; c.globalAlpha = clamp(o.grain, 0, 0.2) * 3.2;
      c.fillStyle = c.createPattern(tile, 'repeat'); c.translate(-ox, -oy); c.fillRect(ox, oy, W, H); c.restore();
    }
    // Vignette
    if (o.vignette > 0) {
      const R = Math.hypot(W, H) / 2, g = c.createRadialGradient(W / 2, H / 2, R * 0.45, W / 2, H / 2, R);
      g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${clamp(o.vignette, 0, 0.7)})`);
      c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = g; c.fillRect(0, 0, W, H); c.restore();
    }
  },
};
})();
