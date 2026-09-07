import {
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ElementType,
} from 'react'
import { useNumberCycle } from '../../hooks/useNumberCycle'
import { useRafflePhase } from '../../hooks/useRafflePhase'
import { joinClassNames } from '../../utils/class-names'
import { getInertiaMultiplier, type RafflePickPhase } from '../../utils/inertia'
import type { RafflePickRootProps, RafflePickValue } from '../../types'
import { RaffleContext, type RaffleContextValue } from './context'

export function RafflePickRoot({
  items,
  min = 1,
  max = 100,
  interval = 100,
  random = true,
  inertia = false,
  autoStart = true,
  noRepeat = true,
  initialValue,
  finalValue,
  onSelect,
  onExhausted,
  as = 'div',
  className,
  style,
  children,
}: RafflePickRootProps) {
  const itemCount = items?.length ?? 0
  const hasItems = itemCount > 0
  const cycleMin = hasItems ? 0 : min
  const cycleMax = hasItems ? itemCount - 1 : max
  const totalCandidates = cycleMax - cycleMin + 1

  const initialPhase: RafflePickPhase = autoStart ? (inertia ? 'starting' : 'running') : 'idle'

  const itemsRef = useRef(items)
  useEffect(() => {
    itemsRef.current = items
  }, [items])

  const displayValue = useCallback((index: number): RafflePickValue => {
    const its = itemsRef.current
    return its && its.length > 0 ? its[index] : index
  }, [])

  const valueAt = useCallback(
    (position: number): RafflePickValue => {
      const its = itemsRef.current
      if (its && its.length > 0) return its[position]
      return cycleMin + position
    },
    [cycleMin]
  )

  const valueToIndex = useCallback((value: RafflePickValue | undefined): number | undefined => {
    if (value === undefined) return undefined
    const its = itemsRef.current
    if (its && its.length > 0) {
      const i = its.indexOf(String(value))
      return i >= 0 ? i : undefined
    }
    return typeof value === 'number' ? value : undefined
  }, [])

  const initialIndex = useMemo(() => {
    if (initialValue === undefined) return cycleMin
    if (items && items.length > 0) {
      const i = items.indexOf(String(initialValue))
      return i >= 0 ? i : cycleMin
    }
    return typeof initialValue === 'number' ? initialValue : cycleMin
  }, [initialValue, items, cycleMin])

  const [displayed, setDisplayed] = useState<RafflePickValue>(() => {
    if (initialValue !== undefined) {
      const its = items
      if (its && its.length > 0) {
        const i = its.indexOf(String(initialValue))
        if (i >= 0) return its[i]
      } else if (typeof initialValue === 'number') {
        return initialValue
      }
    }
    return items && items.length > 0 ? items[cycleMin] : cycleMin
  })

  const subscribersRef = useRef<Set<(value: number) => void>>(new Set())
  const subscribe = useCallback((fn: (value: number) => void) => {
    subscribersRef.current.add(fn)
    return () => {
      subscribersRef.current.delete(fn)
    }
  }, [])

  const onTick = useCallback((value: number) => {
    const subs = subscribersRef.current
    subs.forEach((fn) => fn(value))
  }, [])

  const valueRef = useRef<number>(initialIndex)

  const finalValueRef = useRef(finalValue)
  useEffect(() => {
    finalValueRef.current = finalValue
  }, [finalValue])

  // `noRepeat` history: which indices/values have already been frozen on.
  // Lives in a ref (mutated only inside callbacks/effects, never read during
  // render) plus a mirrored counter in state so render can derive
  // `exhausted` without touching the ref directly.
  const drawnRef = useRef<Set<number>>(new Set())
  const [drawnCount, setDrawnCount] = useState(0)

  const onExhaustedRef = useRef(onExhausted)
  useEffect(() => {
    onExhaustedRef.current = onExhausted
  }, [onExhausted])

  const onSettle = useCallback(() => {
    const forced = valueToIndex(finalValueRef.current)
    if (forced !== undefined) {
      valueRef.current = forced
    }
    if (noRepeat) {
      drawnRef.current.add(valueRef.current)
      setDrawnCount(drawnRef.current.size)
    }
    const v = displayValue(valueRef.current)
    setDisplayed(v)
    onSelect?.(v)
  }, [displayValue, onSelect, valueToIndex, noRepeat])

  const { phase, step, start, freeze, reset } = useRafflePhase(inertia, initialPhase, onSettle)

  const exhausted = noRepeat && drawnCount >= totalCandidates

  const guardedStart = useCallback(() => {
    if (noRepeat && drawnRef.current.size >= totalCandidates) {
      onExhaustedRef.current?.()
      return
    }
    start()
  }, [start, noRepeat, totalCandidates])

  const resetHistory = useCallback(() => {
    drawnRef.current.clear()
    setDrawnCount(0)
  }, [])

  // Keep valueRef in sync if `initialValue` changes while idle (e.g.
  // consumer picks a different pre-selected entry before a round starts).
  // `displayed` itself is derived below rather than set here, to avoid a
  // setState-in-effect render cascade.
  useEffect(() => {
    if (phase !== 'idle') return
    valueRef.current = initialIndex
  }, [phase, initialIndex])

  // Mirrors displayValue(), but reads the `items` prop directly instead of
  // itemsRef — ref reads aren't allowed during render.
  const displayedValue =
    phase === 'idle'
      ? items && items.length > 0
        ? (items[initialIndex] ?? items[cycleMin])
        : initialIndex
      : displayed

  const multiplier = getInertiaMultiplier(phase, step, inertia)
  const safeInterval = Math.max(50, interval)
  const cycleInterval = Math.round(safeInterval * multiplier)
  const running = phase === 'starting' || phase === 'running' || phase === 'settling'

  useNumberCycle({
    min: cycleMin,
    max: cycleMax,
    interval: cycleInterval,
    random,
    running,
    valueRef,
    excludedRef: noRepeat ? drawnRef : undefined,
    onTick,
  })

  const remaining = noRepeat ? Math.max(0, totalCandidates - drawnCount) : totalCandidates

  const ctxValue: RaffleContextValue = useMemo(
    () => ({
      phase,
      step,
      displayed: displayedValue,
      cycleInterval,
      inertia,
      hasItems,
      initialIndex,
      initialValue,
      finalValue,
      noRepeat,
      exhausted,
      remaining,
      total: totalCandidates,
      valueRef,
      displayValue,
      valueAt,
      subscribe,
      start: guardedStart,
      freeze,
      reset,
      resetHistory,
    }),
    [
      phase,
      step,
      displayedValue,
      cycleInterval,
      inertia,
      hasItems,
      initialIndex,
      initialValue,
      finalValue,
      noRepeat,
      exhausted,
      remaining,
      totalCandidates,
      displayValue,
      valueAt,
      subscribe,
      guardedStart,
      freeze,
      reset,
      resetHistory,
    ]
  )

  const selectionState = phase === 'idle' ? 'idle' : phase === 'frozen' ? 'frozen' : 'running'

  return createElement(
    as as ElementType,
    {
      className: joinClassNames('rrp', className),
      'data-state': selectionState,
      'data-phase': phase,
      'data-inertia-step': step,
      'data-inertia': inertia ? '' : undefined,
      style,
    },
    <RaffleContext.Provider value={ctxValue}>{children}</RaffleContext.Provider>
  )
}
