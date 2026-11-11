# 02 · Mechanics: why "Art History Speedrun" looks good

This page covers the mechanics of "speedrun / time-travel" films: one and the same scene, swapping in a different style or era (Art History Speedrun, 100 years of a city, one person from eighteen to eighty). Every subject of this kind can be built on these five layers; explainer films, narrative films and single-style shorts are not built this way — design their composition for the subject.

## The five layers

**1. One fixed scene skeleton.** Across 16 eras, the window, table, cat, person and year plaque barely move (±40px). Only with anchors for the eye can the viewer clearly see that "what changes is the style". Because the positions are fixed, transitions can also use in-frame objects as the origin (the mosaic spreads from the cat's position, the aperture opens out from the cup).
→ How (speedrun/time-travel only): fix this film's composition coordinates first, and align every era to them. In code that is one set of constants, not each segment drawing its own. Other subjects do not inherit this room's coordinates.

**2. Each era is a living painting.** It holds for 0.25–1.4 seconds, but the painting is always moving: one continuous action for the protagonist (raising the cup to drink) + 2–4 small loops **taken from that era's own visual motifs** — cave-painting animals run using "two alternating poses" (this is the animation of how cave paintings show running with multiple legs), the Egyptian scarab pushes the sun disc, the Greek meander band scrolls, the Roman volcano smokes, Gothic gold leaf glints, the Renaissance ornithopter, the ukiyo-e great wave, Van Gogh's swirling starry sky, Bauhaus clock hands, the pop four-panel colour change.
→ How: for each segment list "the 3 most identifiable formal elements of this era" and set them moving. The motion has to be visible within the hold window (short segments need fast rhythms).

**3. A transition = the next era's signature language.** Entering Egypt: stone blocks/tapestry drop; Greece: a pottery-roller turns the face; Rome: mosaic tiles flip over; Gothic: parchment pages turn; Renaissance: divine light; ukiyo-e: the Kanagawa great wave sweeps across; Impressionism: brushstroke dabs fill the frame; Van Gogh: starry-sky vortex; Art Nouveau: gilt organic forms grow; Cubism: geometric shards; Bauhaus: red-yellow-blue geometry rotates and scales up; Pop: lightning + halftone dots; 8-bit: pixelation; ray tracing: green wireframe → rendered row by row; 2026: three-colour concentric aperture rings.
→ How: don't pick a generic transition off a transition shelf — grow it out of "the new style's most identifiable formal element". Add camera impact on each transition's first frame (the scene layer scales to 1.03, back to 1.0 in about 20 frames; the year plaque does not scale) — the jolt on the beat comes from that.

**4. The beat grid accelerates.** 128 BPM stays constant while the number of eighth notes each segment occupies decreases: 6 → 4×5 → 3×4 → 2×3 → 1×3 → the ending stretched to 9+. The tempo hasn't changed, but it sounds and looks more and more urgent; the last segment is stretched to leave room for the punchline. Transition durations shrink along with it (0.4s → 0.13s), and the year roll shrinks too (0.55s → 0.07s).
→ How: first list the duration you want per segment, round it to eighth notes, then adjust the whole set into a regular descent. Every cut point, music onset and sound effect lands on the grid.

**5. One continuous narrative anchor + an ending character gag.** The year counter is the only continuous thing in the film: its value is determined solely by global time, and during a transition the old and new layers show the same rolling number, each in its own typeface (40,000 BC cave-painting hand → 1350 BC reed pen → … → 2026 geometric sans). Give the character a gag at the end (the cat taps the cup three times and pushes it off the table, the girl gasps, the signature writes itself out), and play it out fully with anticipation, squash and stretch, follow-through, secondary action — the first 11 seconds are "look", these 4 seconds are "laugh", and the laugh is what makes people share it.

## Additions (2026-10-04 portability tests A–D)

- **The protagonist's action runs continuously across segments**: the narrative anchor isn't only the counter; the protagonist's action must also follow the film's global time. Redo the action inside each segment and what the viewer sees is "five raises of the cup" instead of "the same instant in five styles".
- **If the counter uses years, the segments must be in chronological order**; if you can't reorder them, swap the corner label for an index or a style name (engine corner labels are pluggable). Hard-cut the old label to the new one at the transition midpoint to avoid double lettering.
- **When the first segment has no transition to borrow from, let the picture "draw itself"** (brushstrokes write it out, colour plates land one by one, pixels light up row by row).
- **The more elaborate the signature transition, the longer it must be**: the original's shapes are simple, so 0.4s is enough; gold leaf, colour bands and ribbons need 0.48–0.5s.

## How to use it when switching subjects

| Layer | This film | As "100 years of a city" it could be |
|---|---|---|
| Skeleton | window/table/cat/person | the same street corner: streetlamp, shop sign, pedestrians, skyline |
| Living painting | small loops of era motifs | each decade's vehicles driving past, sign lettering flickering, things in the sky (kite → plane → drone) |
| Transition | the next era's signature language | the next decade's medium: film burn, TV static, pixels, scanlines |
| Beat | 128 BPM descending | same |
| Anchor + gag | year counter + cat tapping the cup | year counter + the same pigeon stealing food in every decade |

## Where not to go wrong

- Don't treat "16 eras" as a quota. The mechanics of speedrun/time-travel are "the style changes, the skeleton doesn't"; 3 eras works too. It is not the mechanics of every subject.
- Don't reproduce the original pixel for pixel. Reproduction is a means of learning the mechanics; the deliverable is your own understood version (Huashu, the author, chose a blonde girl + an orange-and-white cat, i.e. swapping characters on the original's skeleton).
