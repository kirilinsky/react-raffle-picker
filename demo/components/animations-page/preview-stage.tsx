'use client'

import { useState } from 'react'
import { RafflePick } from 'react-raffle-picker'
import { ANIMATION_KINDS, parseItems, type AnimationsState } from './types'

export function AnimationsPreviewStage({ state }: { state: AnimationsState }) {
  const [last, setLast] = useState<string | number | null>(null)

  const items = parseItems(state.itemsRaw)
  const safeItems = items.length > 0 ? items : ['—']
  const modeProps = state.mode === 'range' ? { min: state.min, max: state.max } : { items: safeItems }

  // Only remount on domain change — interval/inertia/countdown are reactive
  // props on the library side (see playground/preview-stage.tsx for why
  // keying on the full state would freeze mid slider-drag).
  const domainKey = state.mode === 'range' ? `range:${state.min}-${state.max}` : `items:${safeItems.join('|')}`

  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center gap-8 rounded-3 border border-line bg-bg-card bg-[radial-gradient(circle_at_50%_30%,rgba(212,160,74,0.06),transparent_60%)] p-10">
      <RafflePick
        key={domainKey}
        {...modeProps}
        interval={state.interval}
        inertia={state.inertia}
        autoStart={false}
        onSelect={(v) => setLast(v)}
        className="flex flex-col items-center gap-8"
      >
        <div className="grid w-full grid-cols-2 gap-4 sm:gap-6">
          {ANIMATION_KINDS.map((kind) => (
            <div
              key={kind}
              className="flex flex-col items-center gap-2 rounded-2 border border-line bg-bg p-6"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
                {kind}
              </span>
              <RafflePick.Value
                animation={kind}
                className="font-display text-[clamp(27px,3.4vw,40px)] leading-none tabular-nums text-burgundy"
              />
            </div>
          ))}
        </div>

        {state.countdown > 0 && <RafflePick.Countdown seconds={state.countdown} className="countdown-ring" />}

        <RafflePick.Button
          className="inline-flex items-center justify-center gap-2 rounded-3 border-2 border-gold bg-gradient-to-b from-burgundy-light via-burgundy to-burgundy-deep px-6 py-3 font-display text-base uppercase tracking-wider text-gold-light shadow-[0_4px_0_var(--burgundy-deep),0_8px_20px_rgba(0,0,0,0.2)] hover:brightness-105 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
          startLabel="Spin all"
          stopLabel="Stop"
          waitLabel="…"
        />
      </RafflePick>

      <p className="font-mono text-xs text-ink-3">last → {last == null ? '—' : String(last)}</p>
    </div>
  )
}
