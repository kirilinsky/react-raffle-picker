---
'react-raffle-picker': minor
---

Add `<RafflePick.Wheel>` — a spinning wheel that lands on the winner the root
picks. Segments come from `items` or the `min`/`max` range (override with
`segments`), and `pointer`, `colors`, `turns`, `spinDuration` and `size` control
the look and the throw. It needs no stylesheet: geometry is inline, rotation is
driven by rAF, and the landing is a single transition, so nothing re-renders
mid-spin. Honours `prefers-reduced-motion` by jumping straight to the result.

Also exposes `total` and `valueAt(position)` on the raffle context, so custom UIs
can enumerate the draw pool without knowing whether the root is in items or
numeric mode. Both are additive.
