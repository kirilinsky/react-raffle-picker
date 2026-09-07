---
'react-raffle-picker': patch
---

Make `<RafflePick.Wheel>` shrink to fit. `size` now acts as a maximum rather
than a fixed box (`max-width: 100%` plus a square aspect ratio), and the pointer
is drawn as its own scaling SVG instead of a fixed-pixel CSS triangle. A
`size={340}` wheel no longer forces sideways scrolling on a 320px screen.

Also stops the wheel from widening the page while it spins: a rotating square
SVG reports a layout box up to `side * sqrt(2)` wide, so the disc is now clipped
to its inscribed circle — the drawn wheel is unchanged, only the empty corners
go.
