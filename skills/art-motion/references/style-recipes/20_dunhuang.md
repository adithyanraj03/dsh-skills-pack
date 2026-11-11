# 20_dunhuang · Dunhuang (敦煌) murals (Mogao Caves · High Tang)

> Source: transfer test A (implemented by an independent agent with the skill read-only, 2026-10-04). The scene code was later ported into `scripts/engine/scenes/20_dunhuang.js`.

At experiment time the file was named `scenes/04_dunhuang.js` (215 lines). 0.45↔0.9s is 6.6%, median adjacent-frame difference 1.98%.

**Pipeline**
Earthen-red ground (cached): `P.texture #a5452f`, dark `#7a3020`, plus sparse faded rosettes, a scrolling-vine border at the top + triangular valance (alternating blue-green, white, and red + gold beads) → window = azurite sky: auspicious clouds, apsaras → scrolling-vine window frame → lotus-brick floor (cached) → low altar table with a niche-shaped apron, oil lamp → cat → girl (Tang-period donor) → steam curls → ceiling flowers → aging overlay.

**Line and color**
- Iron-wire line: uniform 2.6px, color `#5a2414`. The face uses a redder `#8a3a24`.
- Mineral colors: earth red `#a5452f`, malachite `#3f8f6e / #6ab08e`, azurite `#2f5f8f / #5a86b0`, white `#ecdfc4`, gold `#d8b05a`.

**Tang dress**
- Intercolor skirt: red ground, diagonal trapezoid green stripes every 44px, fanning outward with x as they go down.
- Azurite short jacket, white cross collar, high-waist red sash.
- High bun: stack two ellipses above headTop, add a gold hairpin and three hairpin flowers.
- Face makeup: huadian (four-petal red flower on the forehead), xiehong (a red arc at each temple), lip dot, moth eyebrows.
- The tea bowl is Yue ware celadon.

**Shawl `shawl(pts,w)`**
- Traveling-wave point list → ribbon, with a white dashed floral outline and red dots.
- Back segment: `x = back + 230q + 64q·sin(4.2q − 5.5t)`, the last 30% lifts upward.
- Front segment loops around the arm and hangs down.
- Pitfall: the first version's lateral swing was only 18–34px and almost vertical, so it looked like the vertical bar of a chair. Lateral displacement needs to exceed 200px, plus the upward tip, before it reads as silk lifting in the air.

**Apsara**
- Lying horizontally facing left, 1.35×, flying past the window at 300px/s.
- Three ribbons travel in waves; one arcs from the shoulder over the head and then flings behind — that big arc is the apsara's most recognizable shape.
- Halo, hair bun, flower tray.
- Auspicious clouds are round clusters + tapering tails, drifting at 40–76px/s.

**Aging overlay**
- Overall `saturation` blend at α.3 to desaturate, then multiply a layer of pale earth texture at α.5.
- Per-pixel flaking: where `fbm(x·.0032)+0.12·noise(x·.03) > 0.3`, expose the white-gray ground `#d8c6a2`; 0.28–0.3 is the dark line at the flaking edge.
- The area around both faces is set as a protected zone, not flaked.
- 500 random-walk cracks, plus a smoked gradient over the top 380px.
- Pitfalls:
  - With flake-noise frequency at .006, the result was sesame spots across the whole screen, like stains. Only after lowering it to .0032 and raising the threshold did it become patchy flaking.
  - The final version sets both the cat (380–720, 530–920) and the girl (1070–1530, 240–950) as protected zones, flaking only the background.
  - Xiehong α reduced to .32, otherwise it looks like a scar.
  - The apsara's halo was a solid green circle in the first version, reading as a "swim ring"; changed to α.28 translucent with a fine line.
  - With the cat at `#c8843a`, the desaturation overlay turned it brown-yellow; changed to `#e08a3a`; also added a head turn `look: sin(2.6t)` and increased breathing 2.5×, otherwise only the tail moved for the whole segment.

**Motif animation**
- Ceiling flowers: 30 four-petal flowers, rotating and flipping as they fall.
- Oil lamp: flame flickers `1+0.12sin(17t)+0.08sin(29t)`, plus a glow.
- Paint flakes: 10 flakes detach from flaking edges, flip, and fall along parabolas.
- The cat's collar bell swings.
