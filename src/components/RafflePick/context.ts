import { createContext, useContext, type RefObject } from 'react'
import type { RafflePickValue } from '../../types'
import type { RafflePickPhase } from '../../utils/inertia'

export interface RaffleContextValue {
  phase: RafflePickPhase
  step: number
  displayed: RafflePickValue
  cycleInterval: number
  inertia: boolean
  hasItems: boolean
  initialIndex: number
  initialValue?: RafflePickValue
  finalValue?: RafflePickValue

  /** Whether `noRepeat` is enabled for this round. */
  noRepeat: boolean
  /** `noRepeat` pool has no candidates left — `start()` is a no-op until `resetHistory()`. */
  exhausted: boolean
  /** Candidates left to draw. Equals the full pool size when `noRepeat` is off. */
  remaining: number

  /** Size of the draw pool: item count in items mode, `max - min + 1` in numeric mode. */
  total: number

  valueRef: RefObject<number>
  displayValue: (index: number) => RafflePickValue
  /**
   * Pool entry at a 0-based position, regardless of mode. `valueAt(0)` is the
   * first item / `min`. Lets custom UIs enumerate the pool without knowing
   * whether the root runs in items or numeric mode.
   */
  valueAt: (position: number) => RafflePickValue

  subscribe: (fn: (value: number) => void) => () => void

  start: () => void
  freeze: () => void
  reset: () => void
  /** Clears the `noRepeat` history so previously drawn values can appear again. */
  resetHistory: () => void
}

export const RaffleContext = createContext<RaffleContextValue | null>(null)

export const useRaffleContext = (componentName: string): RaffleContextValue => {
  const ctx = useContext(RaffleContext)
  if (!ctx) {
    throw new Error(`<${componentName}> must be rendered inside <RafflePick>.`)
  }
  return ctx
}
