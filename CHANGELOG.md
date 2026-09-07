# react-raffle-picker

## 0.4.0

### Minor Changes

- 285d263: Add `<RafflePick.Wheel>` — a spinning wheel that lands on the winner the root
  picks. Segments come from `items` or the `min`/`max` range (override with
  `segments`), and `pointer`, `colors`, `turns`, `spinDuration` and `size` control
  the look and the throw. It needs no stylesheet: geometry is inline, rotation is
  driven by rAF, and the landing is a single transition, so nothing re-renders
  mid-spin. Honours `prefers-reduced-motion` by jumping straight to the result.

  Also exposes `total` and `valueAt(position)` on the raffle context, so custom UIs
  can enumerate the draw pool without knowing whether the root is in items or
  numeric mode. Both are additive.

## 0.3.2

### Patch Changes

- 34f9f6d: Rewrite the npm description and keywords.

## 0.3.1

### Patch Changes

- 3ed1ad7: ### Fix: `roll`/`fade` per-tick jitter at large font sizes

  The previous pass on these animations added a `scale()` + overshoot keyframe on
  top of the opacity dip. At small sizes (hero-scale text) it read as a nice
  snap; at large display sizes (e.g. a `clamp(80px,16vw,160px)` value in a
  playground/demo) the combined scale + vertical offset, replaying every tick,
  made the text visibly wobble/jitter instead of read as a clean spin.

  Dropped the `scale()` and overshoot stop from both keyframes, keeping the
  eased timing-function but reverting to a simpler translateY/opacity motion —
  same idea as before this pass, no wobble at any font size.

- 5e1ac40: ### Livelier default animations, freeze "settle" pop, slot reel bounce-stop

  `styles.css` (and the auto-injected `<RafflePick.Slots>` stylesheet) got a
  visual pass:
  - `roll` and `fade` (`<RafflePick.Value animation="...">`) now use eased,
    multi-stage keyframes instead of flat `linear` — noticeably snappier per
    tick.
  - New: every animation type gets a shared "settle" pop on freeze
    (`[data-phase='frozen']`) — previously freezing had zero animation at all,
    the value just stopped in place.
  - `<RafflePick.Slots>` reels now decelerate into a small overshoot bounce on
    stop instead of snapping instantly to rest.
  - Fixed: the `prefers-reduced-motion` override didn't have enough CSS
    specificity to beat the (new) settle/stop animations — it's `!important`
    now, so it reliably wins regardless of what other animation rules exist.
  - Fixed: the auto-injected runtime stylesheet for `<RafflePick.Slots>` had no
    `prefers-reduced-motion` guard at all (only the statically-imported
    `styles.css` did) — consumers relying on the auto-injected CSS got no
    reduced-motion protection for the slot reel.

## 0.3.0

### Minor Changes

- 0389ab7: ### `noRepeat` — no duplicate winners across draws

  `<RafflePick>` now excludes previously frozen values from later rounds by
  default, so sequential draws from the same `items`/numeric pool never repeat
  a winner within one mounted instance.

  **Behavior change:** this is `true` by default. Apps that relied on the same
  value being drawable twice in a row should pass `noRepeat={false}` to keep
  the old behavior.
  - New root prop `noRepeat?: boolean` (default `true`).
  - New root prop `onExhausted?: () => void` — fires when `start()` runs after
    every candidate has already been drawn.
  - `<RafflePick.Button>` auto-disables once the pool is exhausted (on top of
    its existing `disabled` prop and settling auto-disable).
  - `useRaffleContext()` exposes `noRepeat`, `exhausted`, `remaining`, and
    `resetHistory()` (clears draw history without unmounting — or remount with
    a new `key` for the same effect).
  - Fixed: the random-mode tick could in principle spin forever trying to land
    on a non-excluded value under a degenerate RNG; it's now bounded with a
    deterministic fallback scan.

- 6c8618a: ### Accessibility, DX, and small correctness fixes
  - `<RafflePick.Value>` now announces the frozen result to screen readers once
    per round via a hidden `aria-live="polite"` region (the visual node is
    `aria-hidden` and no longer silent on freeze). Cycling ticks are not
    announced.
  - `<RafflePick.Countdown>` no longer fully `aria-hidden`s its output — it adds
    a one-time sr-only announcement that a countdown started, instead of hiding
    the whole thing from assistive tech.
  - `styles.css` now respects `prefers-reduced-motion: reduce` for both the
    value animations and the slot reel.
  - `<RafflePick.Button>` accepts a new `disabled` prop for external disabling
    (e.g. form not valid), on top of the existing auto-disable during
    `settling`.
  - Fixed: `<RafflePick.Slots>` injected its base stylesheet as a render
    side-effect; moved into `useEffect`.
  - Fixed: changing `initialValue` while idle no longer leaves the internal
    cycle ref out of sync with the displayed value.
  - `RaffleContextValue` and `RafflePickPhase` types are now exported from the
    package root, for consumers building custom sub-components on top of
    `useRaffleContext`.
  - Added JSDoc to all `<RafflePick>` root props for editor tooltips.

## 0.2.2

### Patch Changes

- 5d9a085: ### Slot reel layout fix

  Reel cells now correctly center the current value vertically and horizontally regardless of font metrics or external CSS.

## 0.2.1

### Patch Changes

- 6119c99: ### Slots: `initialValue` / `finalValue` support + `autoStart={false}` fix
  - `<RafflePick.Slots>` now respects root `initialValue` (seeds reels char-by-char) and `finalValue` (forces final reel result while cycle stays random).
  - Fixed: idle phase no longer leaves reel column animating when `autoStart={false}`.

## 0.2.0

### Minor Changes

- 0bfc1cb: ### Slot reel base styles bundled
  - Reel CSS auto-injects on `<RafflePick.Slots>` mount — animates out of the box.
  - New `react-raffle-picker/styles.css` export for SSR / strict CSP setups.
  - Stylesheet also provides opt-in keyframes for `<RafflePick.Value animation="roll|fade|blur|reel">`.

  ### New `<RafflePick>` props
  - `initialValue` — sets displayed value before first run (numeric or items mode).
  - `finalValue` — rigs settle to land on this value while cycle still appears random.
