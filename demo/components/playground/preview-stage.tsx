'use client'

import { useState } from 'react'
import { RafflePick } from 'react-raffle-picker'
import { normalizeRange, type PlaygroundState } from './types'

const parseItems = (raw: string) =>
  raw
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

export function PreviewStage({ state }: { state: PlaygroundState }) {
  const [last, setLast] = useState<string | number | null>(null)

  const items = parseItems(state.itemsRaw)
  const safeItems = items.length > 0 ? items : ['—']
  const range = normalizeRange(state.min, state.max)
  const modeProps =
    state.mode === 'range' ? { min: range.min, max: range.max } : { items: safeItems }

  // Only remount when the value domain (mode/range/items) or autoStart
  // (mount-only config) changes. interval/inertia/animation/countdown are
  // reactive props on the library side — keying on the full state here would
  // remount on every slider-drag tick and freeze the display mid-drag.
  const domainKey =
    state.mode === 'range'
      ? `range:${range.min}-${range.max}:${state.autoStart}`
      : `items:${safeItems.join('|')}:${state.autoStart}`

  return (
    <div className="flex min-h-[480px] flex-col items-center justify-center gap-6 rounded-3 border border-line bg-bg-card bg-[radial-gradient(circle_at_50%_30%,rgba(207,36,54,0.04),transparent_60%)] p-10">
      <RafflePick
        key={domainKey}
        {...modeProps}
        interval={state.interval}
        inertia={state.inertia}
        autoStart={state.autoStart}
        onSelect={(v) => setLast(v)}
        className="flex flex-col items-center gap-2"
      >
        <RafflePick.Value
          {...(state.animation !== 'none' ? { animation: state.animation } : {})}
          className="font-display text-[clamp(80px,16vw,160px)] leading-none tabular-nums text-burgundy"
        />
        {state.countdown > 0 && (
          <RafflePick.Countdown seconds={state.countdown} className="mt-2 font-mono text-ink-2" />
        )}
        <RafflePick.Button
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-3 border-2 border-gold bg-gradient-to-b from-burgundy-light via-burgundy to-burgundy-deep px-6 py-3 font-display text-base uppercase tracking-wider text-gold-light shadow-[0_4px_0_var(--burgundy-deep),0_8px_20px_rgba(0,0,0,0.2)] hover:brightness-105 active:translate-y-px"
          startLabel="Spin"
          stopLabel="Stop"
        />
      </RafflePick>

      <p className="font-mono text-xs text-ink-3">last → {last == null ? '—' : String(last)}</p>
    </div>
  )
}
