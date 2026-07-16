# Cottage living-room hotspot outlines

This folder contains the presentation-only outline proof of concept for the
Rosemary Cottage living room.

## Files

- `living-room-outlines.svg` — eight independently selectable silhouettes
  using the room image's `1672 x 941` coordinate system.
- `cottage-hotspot-reference.png` — the user's transparent separation
  reference. Five complete objects are used as SVG alpha-mask sources.
- `cottage-hotspot-outlines.css` — cottage-only outline styling and removal of
  the previous rectangular hover treatment.
- `cottage-hotspot-outlines.js` — loads the SVG and mirrors the existing
  hotspot hover, focus, proximity, touching, and tutorial-highlight states.

## Important behavior

The SVG has `pointer-events: none`. Existing `.physical-object` buttons remain
responsible for hitboxes, clicks, taps, keyboard interaction, proximity,
collision, names, actions, and activity handlers.

Each `data-hotspot-key` in the SVG must exactly match an existing living-room
object name. The script reports missing object/path matches in the browser
console without disabling the original interactions.

## Artwork calibration

The outlines are traced against:

`assets/honeybell-cottage-interior-bedroom-style.png`

The supplied reference crops the Couch and Pet bed at its bottom edge and does
not contain Indoor plants. Those three use complete paths traced against the
live room background. Fireplace, Television, Bookshelf, Armchair, and Coffee
table use separately clipped and transformed alpha silhouettes from the
reference PNG.

If either image is replaced, cropped, or recomposed, update the transforms or
paths in `living-room-outlines.svg` while retaining their `data-hotspot-key`
values.

Serve the project from its normal local web server. Browsers commonly block
`fetch()` for local `file://` pages; if the SVG cannot load, the script fails
open and leaves every original hotspot functional.
