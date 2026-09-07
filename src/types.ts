import type { CSSProperties, ElementType, ReactNode } from 'react'

export type AnimationType = 'roll' | 'fade' | 'blur' | 'reel'
export type RafflePickValue = number | string

export interface RafflePickRootProps {
  /**
   * Item pool to cycle through (names, tickets, anything). Switches the
   * component to "items mode" — `min`/`max` are ignored. An empty array
   * (`[]`, as opposed to `undefined`) is treated as "no items" and falls
   * back to the numeric `min`/`max` range.
   */
  items?: string[]
  /** Range start in numeric mode. Ignored when `items` is set. */
  min?: number
  /** Range end in numeric mode. Ignored when `items` is set. */
  max?: number
  /** Tick speed in ms. Clamped to a minimum of 50. */
  interval?: number
  /** Pick the next tick value at random instead of incrementing sequentially. */
  random?: boolean
  /** Soft-start / soft-stop ramp (`starting`/`settling` phases) instead of an instant flip. */
  inertia?: boolean
  /** Begin cycling on mount. Set `false` to wait for `<RafflePick.Button>`/`start()`. */
  autoStart?: boolean
  /**
   * Exclude previously frozen values from future rounds within this mounted
   * instance — no duplicate winners across sequential draws. Default `true`.
   * Set `false` to allow the same value/entry to be picked again. History is
   * cleared on unmount (or via `resetHistory()` from `useRaffleContext()`) —
   * remount with a new `key` for a fresh no-repeat pool.
   */
  noRepeat?: boolean
  /** Value shown before first run. Number in min/max mode, string in items mode. */
  initialValue?: RafflePickValue
  /** When set, settle always lands on this value while cycle still appears random. */
  finalValue?: RafflePickValue
  /** Fires once per round, when the phase settles to `frozen`. */
  onSelect?: (value: RafflePickValue) => void
  /** Fires when `start()`/`<RafflePick.Button>` is used but `noRepeat` has exhausted the pool. */
  onExhausted?: () => void
  /** Wrapper element/component. Default `'div'`. */
  as?: ElementType
  /** Wrapper class. */
  className?: string
  /** Wrapper inline style. */
  style?: CSSProperties
  /** Compound sub-components: `<RafflePick.Value>`, `.Button`, `.Countdown`, `.Slots`. */
  children?: ReactNode
}

export interface RafflePickValueProps {
  animation?: AnimationType
  className?: string
  style?: CSSProperties
  as?: ElementType
}

export interface RafflePickButtonProps {
  className?: string
  style?: CSSProperties
  /** Fallback label across all states. */
  children?: ReactNode
  /** Label for idle / frozen (click starts a round). */
  startLabel?: ReactNode
  /** Label while running (click stops). */
  stopLabel?: ReactNode
  /** Label while settling (button disabled). */
  waitLabel?: ReactNode
  /** External disable (e.g. form not valid). Always disabled while settling regardless. */
  disabled?: boolean
}

export interface RafflePickSlotsProps {
  /** Number of slots. */
  length?: number
  /** Character pool each slot picks from. */
  chars?: string
  /** Tick interval per slot, ms. Clamped ≥ 50. */
  spinInterval?: number
  /** Delay between consecutive slot stops on settle, ms. */
  staggerMs?: number
  className?: string
  slotClassName?: string
  style?: CSSProperties
  slotStyle?: CSSProperties
  /** Fires when last slot stops with joined result. */
  onResult?: (result: string) => void
}

export interface RafflePickCountdownProps {
  /** Seconds before auto-freeze. Required. */
  seconds: number
  className?: string
  style?: CSSProperties
  /** Render-prop for fully custom output. Receives remaining seconds. */
  children?: (remaining: number) => ReactNode
}

export interface RafflePickWheelProps {
  /**
   * Segment labels. Defaults to the root's pool — `items`, or the `min`/`max`
   * range. Pass this only to relabel segments; the winner is still chosen by
   * the root, and label `i` maps to pool position `i`.
   */
  segments?: string[]
  /** Outer diameter in px. Default `320`. */
  size?: number
  /**
   * Segment fill colors, cycled across segments. Defaults to a built-in
   * 6-color palette. Adjacent segments never share a color as long as the
   * palette length and segment count are not both even multiples.
   */
  colors?: string[]
  /** Label text color. Default `'#fff'`. */
  labelColor?: string
  /**
   * Hide labels above this segment count — past it they overlap into noise.
   * Colors and the landing still work. Default `40`. Set `Infinity` to force.
   */
  maxLabels?: number
  /** Landing animation duration in ms, from freeze to rest. Default `4200`. */
  spinDuration?: number
  /** Full turns added before the landing angle, for a longer spin. Default `4`. */
  turns?: number
  /** Idle/running rotation speed in ms per full turn. Default `1800`. */
  spinInterval?: number
  /** Pointer position on the rim. Default `'top'`. */
  pointer?: 'top' | 'right'
  /** Hide the built-in pointer triangle to render your own. */
  hidePointer?: boolean
  className?: string
  style?: CSSProperties
  /**
   * Fires when the wheel physically comes to rest, with the winning value.
   *
   * Prefer this over the root's `onSelect` for anything the audience sees —
   * a result banner, confetti, a sound. `onSelect` fires when the value is
   * *committed*, which is the moment the landing animation **starts**, so
   * reacting to it reveals the winner `spinDuration` ms before the wheel gets
   * there.
   */
  onResult?: (value: RafflePickValue) => void
}
