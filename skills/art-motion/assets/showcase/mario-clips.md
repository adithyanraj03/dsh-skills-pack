# Huashu (the author): Super Mario Playthrough · GIF Clips

Cut directly from the 65.02-second finished film *Huashu's Super Mario Playthrough*, preserving the CRT look. This directory only collects showcase GIFs; it does not include the project for that level or the complete video.

- `mario-claude.gif`: 00:06.30–00:11.80, 5.5 seconds, 800×450. Subscription choice → Claude starburst → grows larger.
- `mario-combo.gif`: 00:28.60–00:32.60, 4 seconds, 640×360. Stomp an enemy → kick its curled-up form into another character → headbutt a brick apart.
- `mario-pipe.gif`: 00:17.00–00:24.70, 7.7 seconds, 640×360. Enter a pipe → coin chamber → whip back to the surface.

All three clips keep the original speed, 20fps, silent, and loop infinitely; each clip gets an independent 192-color palette, Bayer dithering controls file size, and `gifsicle -O3` performs lossless optimization. The loop returns to the beginning after the clip ends; it is not a seamless loop.

Export example (requires ffmpeg and your own source video):

```sh
ffmpeg -ss 6.3 -t 5.5 -i input.mp4 -filter_complex "fps=20,scale=800:-1:flags=lanczos,split[a][b];[a]palettegen=stats_mode=diff:max_colors=192[p];[b][p]paletteuse=dither=bayer:bayer_scale=3:diff_mode=rectangle" -loop 0 mario-claude.gif
```

Use of Huashu's likeness in the GIFs follows the demo-use restrictions in the repository README.
