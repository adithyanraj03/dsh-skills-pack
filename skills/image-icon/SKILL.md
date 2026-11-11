---
name: image-icon
description: "Turn one image into a dsh plugin/app icon: frame on the subject, square-crop, downscale, flatten onto the backdrop, rounded alpha mask, PNG under dsh's 256 KiB cap. USE FOR: plugin icon, app icon, assets/icon.png, dsh icon, rounded icon, 512 icon, 36px icon, make_icon, icon too small to read. DO NOT USE FOR: generating or editing artwork, watermark removal, cropping for composition, upscaling, background removal of arbitrary subjects, or inpainting over detailed texture."
license: MIT
metadata:
  author: adithyanraj03
  version: "1.1.0"
---

# image-icon

One dsh tool, one job: take an image you already have and write it as a
plugin/app icon. Prefer the tool; use the CLI when the harness is not running or
you are scripting outside a chat.

| Tool | Use it for |
|---|---|
| `make_icon` | Image → icon: frame on the subject, square-crop, downscale, flatten onto the backdrop colour, rounded alpha mask, PNG under the cap. |

Nothing here generates or retouches the picture — no prompts, no providers, no
inpainting. If the image is wrong, get a better image and run the tool again.

## Plugin icon recipe

dsh reads **`icon`** from the *installed* package.json: a relative path inside the
package, `.png`/`.svg`/`.jpg`/`.webp`, **≤ 256 KiB**, regular file. It renders at
36 px in Settings → Installed plugins, so detail dies — judge the icon at 36 px,
not at 512.

1. `make_icon` with `output: <plugin>/assets/icon.png`, default size 512.
   It frames on the **subject** by default — at 36 px a studio render's object is
   otherwise a smudge in its own backdrop. If the subject crowds the rounded
   corners, raise `margin` from its 0.10 default.
2. Add `"icon": "assets/icon.png"` to package.json, and `"assets/icon.png"` to `files`.
3. Confirm under the cap. The tool enforces it: pixels are shed before colours,
   so a busy render comes back at 448 or 320 px rather than banded at 512. A flat
   vector lands at 10–70 KiB, a photographic render at 180–255 KiB. The JSON line
   says which path it took as `encoding`.
4. dsh reads icons **at boot** and base64-embeds them — a restart is required,
   and a new release is required for anyone who already installed it.

Do not hand-edit the manifest without checking `ConvertFrom-Json` parses it: a
trailing comma silently breaks the plugin list.

## Framing

`fit` (default on) zooms onto the subject. Detection is a **colour** distance from
the corner-sampled backdrop with a 3 px median filter — not luminance, which
trips on a backdrop gradient, and not a low threshold, which lets the contact
shadow count as subject and drags the box back out to nearly full frame. Two
earlier attempts failed exactly that way.

`margin` (default 0.10) is breathing room around the subject; raise it when the
subject reaches the rounded corners. `radius` defaults to 0.21875 of the edge.

## CLI

```sh
python scripts/icon.py icon in.jpg out.png --size 512 --radius 0.21875
python scripts/icon.py icon in.jpg out.png --no-fit      # keep the full frame
```

Prints one JSON line: `size`, `radius`, `fit`, `encoding`, `bytes`.

Requirements: Python with Pillow. No numpy. If `python` is not on PATH, set
`IMAGE_ICON_PYTHON` or the plugin's `python` config.

## Script location

`~/.dsh/plugins/image-icon/scripts/icon.py`

## History

v1.0.0 also removed the corner sparkle Gemini baked into its images — a second
tool, `strip_watermark`, plus a strip step inside the icon pipeline that ran by
default and blurred a 22% corner even on images without a mark. Both are retired
as of v1.1.0. The frozen 1.0.0 plugin, watermark code included, is kept at
`~/.dsh/backups/image-icon-v1.0.0-watermark/`.
