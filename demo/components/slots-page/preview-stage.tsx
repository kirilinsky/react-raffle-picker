'use client'

import { useState } from 'react'
import { RafflePick } from 'react-raffle-picker'
import { resolveChars, type SlotsState } from './types'

export function SlotsPreviewStage({ state }: { state: SlotsState }) {
  const [last, setLast] = useState<string | null>(null)
  const chars = resolveChars(state) || '0'

  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center gap-6 rounded-3 border border-line bg-bg-card bg-[radial-gradient(circle_at_50%_30%,rgba(207,36,54,0.04),transparent_60%)] p-10">
      <RafflePick
        key={JSON.stringify(state)}
        inertia={state.inertia}
        autoStart={false}
        className="relative inline-block rounded-[24px] border-[4px] border-ink bg-gradient-to-b from-burgundy-light via-burgundy to-burgundy-deep px-6 py-6 shadow-[0_14px_36px_rgba(21,22,26,0.28),inset_0_2px_0_rgba(255,255,255,0.15),inset_0_-4px_10px_rgba(0,0,0,0.25)] before:pointer-events-none before:absolute before:inset-3 before:rounded-2 before:border-4 before:border-gold before:content-['']"
      >
        <div className="overflow-x-auto">
          <RafflePick.Slots
            length={state.length}
            chars={chars}
            spinInterval={state.spinInterval}
            staggerMs={state.staggerMs}
            onResult={setLast}
            className="relative z-10 flex gap-1.5 rounded-2 bg-gradient-to-b from-bg-card to-[#f2f2ef] p-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.18),0_0_0_2px_var(--gold-deep)]"
            slotClassName="relative inline-block h-[1.25em] w-[clamp(52px,9vw,84px)] overflow-hidden rounded-1 border border-[#e7e7e3] bg-bg-card font-display text-[clamp(30px,6vw,52px)] font-bold leading-none tabular-nums text-burgundy shadow-[inset_0_2px_4px_rgba(0,0,0,0.2),inset_0_-2px_4px_rgba(0,0,0,0.1)] transition-[border-color] duration-300 data-[stopped]:border-green"
          />
        </div>

        <RafflePick.Button
          className="relative z-10 mt-5 w-full rounded-2 border-2 border-gold bg-gradient-to-b from-burgundy-light via-burgundy to-burgundy-deep px-6 py-2.5 font-display text-sm uppercase tracking-wider text-gold-light shadow-[0_3px_0_var(--burgundy-deep)] hover:brightness-105 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
          startLabel="Spin"
          stopLabel="Stop"
          waitLabel="…"
        />
      </RafflePick>

      <p className="font-mono text-xs text-ink-3">last result → {last ?? '—'}</p>
    </div>
  )
}
