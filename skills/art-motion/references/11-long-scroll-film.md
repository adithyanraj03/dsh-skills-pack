# 11 · Long-scroll travel film: one person walks left to right, through painting after painting

The method behind *Huashu Travels Through Famous Paintings* (2026-10-05, 123.7 seconds, 24 worlds). Unlike the Art History Speedrun (one room, changing styles), this is **a single horizontal long scroll**: each world is a horizontally extended painting, joined end to end; the protagonist keeps walking right, and at the moment he crosses a boundary his style changes together with the world.

Demo: `scripts/engine/demos/long_scroll/`, 3 segments included (Egyptian mural → Monet's *Japanese Bridge* → 8-bit pixel), about 15.6 seconds.

```sh
uv run --with playwright python scripts/engine/render.py --film demos/long_scroll --stills 1,5,9 --out test-render   # three stills
uv run --with playwright python scripts/engine/render.py --film demos/long_scroll --out long_scroll.mp4             # the whole segment
```

Browser preview: start a static server in `scripts/engine/` and open `index.html?film=demos/long_scroll`; `&only=28_monet,14_8bit` schedules only those segments, `&v=330` tries a different walking speed.

## Files

| File | What it controls |
|---|---|
| `eras.js` | Film entry point: loads libraries, `FILM_ORDER` (segment order), registers frame libs, generates a segment with `dur = WORLD.total` |
| `lib/world.js` | The `WORLD` skeleton: timeline (walk → stop to interact → walk), protagonist travel, camera, protagonist split at the boundary, boundaries, corner label. **Read its header comment first** |
| `lib/crossing.js` | `XING`: reads frame libs, draws character frames (`XING.actor`), brushstroke material, the Monet world |
| `lib/acts.js` | `ACT`: small-script utilities (trajectory of a stone skipping on water, etc.) |
| `lib/xing2_*.js` | Small utilities shared by a few segments, loaded on demand at the top of segment files |
| `segments/<id>.js` | One file per world, calling `WORLD.add({...})` |
| `frames/<key>/` | Character frame lib: 8 transparent PNGs plus `meta.json` (per frame: foot-sole anchor `ax/ay`, size, `air` for off the ground; `ref_h` is standing height in pixels) |

## Adding a segment

1. Create `<id>.js` under `segments/` and call `WORLD.add({ id, year, name, w, hero, acts, back, front, seam })`; the interface is in the header comment of `lib/world.js`. Draw the world itself in code, preferring to convert the existing style scene in `scenes/<id>.js` into a horizontally extended version (segment width 2000–2800).
2. Generate character frames: one "8 walking frames" set per world, plus an "8 interaction frames" set where there is an interaction; have the image model redraw them in that style, green-screen them, slice the frames (`scripts/key_split.py`; method in doc 10), put them in `frames/<key>/`, and write `meta.json`.
3. Add `<id>` to `FILM_ORDER` in `eras.js`.
4. Render stills to check both sides of the boundary, then run `qa.py --project scripts/engine --film demos/long_scroll`; determinism must be ✓.

## Key conventions (film-wide, hard-coded in the skeleton)

- **Ground line `WORLD.GROUND = 760`, protagonist standing height 300, protagonist at 720px across the frame.** At both ends of a segment (±150px around x=0 and x=w) the ground must return to 760, and the horizon should fall within 480–560 as far as possible, so the two sides meet when you cross the boundary. In between there can be bridges and steps (`ground: lx => y`).
- **Every event is timed relative to "interaction start".** Use `WORLD.actT(segment)` to get the film-wide moment when the interaction starts, `r = S.t - WORLD.actT(ME)`; never write "the nth second after entering the segment". When the film's walking speed later went from 330 to 560, segments written this way needed no changes at all.
- **The camera only moves forward.** Camera target = protagonist x − 720 + the `lead` conceded forward during an interaction; take the historical maximum, then Gaussian-smooth it, so it is monotonic throughout and neither stopping nor starting jerks. If an interaction should hold the camera still, write `lead: 0`.
- **Each segment's boundary is drawn in that segment's signature language** (`seam`: paper edge, pixel checkerboard, color-block divider line…), the long-scroll version of the speedrun film's rule that "a transition = the next style's signature language".
- **The protagonist's walk frame rate scales with walking speed** (`hero.fps`), 8 frames per gait cycle; if it needs another pass of that style's material, write `hero.draw(c, key, i, o, S)` in the segment and composite it yourself — don't change the shared library.
- **Score**: picture first, music after. Give each segment a whole number of beats and fine-tune the tempo per segment within 86–104 BPM so every boundary lands on the first beat of a bar (measured: max error 11.7ms across 24 boundaries); the human ear cannot hear a ±8% per-segment tempo difference.
- **Don't add bits the protagonist wasn't asked for.** The skeleton has a "stack souvenirs on the hat" feature (`FILM_HAT_ITEMS`) that easily competes with the scene for visual attention; it is off by default.

More evidence and numbers in `07-proven-practices.md`, items 36–38.
