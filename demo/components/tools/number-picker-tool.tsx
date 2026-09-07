'use client'

import { useState } from 'react'
import { RafflePick } from 'react-raffle-picker'
import { ConfettiBurst } from '../hero/confetti-burst'
import { WinnersList } from './entries-panel'
import { COUNTDOWN_DEFAULTS, CountdownControl, CountdownStage } from './countdown-option'
import { ToolShell } from './tool-shell'
import { useToolState } from './use-tool-state'

const DEFAULTS = { ...COUNTDOWN_DEFAULTS, min: 1, max: 100, noRepeat: false }

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <label className="flex flex-1 flex-col gap-1.5">
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value)
          if (Number.isFinite(n)) onChange(Math.trunc(n))
        }}
        className="w-full rounded-2 border border-line bg-bg px-3 py-2.5 font-mono text-sm text-ink focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/20"
      />
    </label>
  )
}

export function NumberPickerTool() {
  const { state, setState, shareUrl } = useToolState('rrp-tool-number-picker', DEFAULTS)
  const [winners, setWinners] = useState<string[]>([])
  const [confettiKey, setConfettiKey] = useState(0)
  const [round, setRound] = useState(0)

  // A reversed range would give the engine an empty pool.
  const lo = Math.min(state.min, state.max)
  const hi = Math.max(state.min, state.max)
  const span = hi - lo + 1

  return (
    <ToolShell
      heading="Pick a random number"
      intro="Set the range and roll. Ticket draws, seat numbers, prize slots, door numbers — anything where the winner is a number rather than a name."
      shareUrl={shareUrl}
      stage={
        <>
          <ConfettiBurst trigger={confettiKey} />
          <RafflePick
            key={`${lo}-${hi}-${state.noRepeat}-${round}`}
            min={lo}
            max={hi}
            autoStart={false}
            inertia
            noRepeat={state.noRepeat}
            interval={55}
            onSelect={(v) => {
              setWinners((w) => [...w, String(v)])
              setConfettiKey((k) => k + 1)
            }}
            className="flex flex-col items-center gap-8 py-6"
          >
            <RafflePick.Value
              animation="roll"
              className="font-display text-[clamp(64px,17vw,180px)] font-bold leading-none tracking-[-0.03em] text-burgundy tabular-nums"
            />

            <div className="flex items-center justify-center gap-4">
              <RafflePick.Button
                startLabel="Roll"
                stopLabel="Stop"
                waitLabel="…"
                className="rounded-full bg-ink px-8 py-3.5 font-mono text-base text-gold-light transition-colors hover:bg-burgundy disabled:cursor-not-allowed disabled:opacity-40"
              />
              <CountdownStage setting={state} />
            </div>

            <WinnersList
              winners={winners}
              label="Rolled"
              onReset={() => {
                setWinners([])
                setRound((r) => r + 1)
              }}
            />
          </RafflePick>
        </>
      }
      controls={
        <div className="grid gap-4 rounded-4 border border-line bg-bg-card p-5">
          <div className="flex gap-4">
            <NumberField
              label="From"
              value={state.min}
              onChange={(min) => {
                setState((s) => ({ ...s, min }))
                setWinners([])
              }}
            />
            <NumberField
              label="To"
              value={state.max}
              onChange={(max) => {
                setState((s) => ({ ...s, max }))
                setWinners([])
              }}
            />
          </div>
          <p className="font-mono text-xs text-ink-3">
            {span} number{span === 1 ? '' : 's'} in play ({lo}–{hi})
          </p>
          <CountdownControl
            setting={state}
            onChange={(next) => setState((s) => ({ ...s, ...next }))}
          />
          <label className="flex items-center gap-3 text-sm text-ink-2">
            <input
              type="checkbox"
              checked={state.noRepeat}
              onChange={(e) => {
                setState((s) => ({ ...s, noRepeat: e.target.checked }))
                setWinners([])
                setRound((r) => r + 1)
              }}
              className="h-4 w-4 accent-[var(--burgundy)]"
            />
            Never roll the same number twice — for drawing several winners
          </label>
        </div>
      }
    />
  )
}
