'use client'

import { useMemo, useState } from 'react'
import { RafflePick } from 'react-raffle-picker'
import { ConfettiBurst } from '../hero/confetti-burst'
import { EntriesPanel, WinnersList, parseEntries } from './entries-panel'
import { COUNTDOWN_DEFAULTS, CountdownControl, CountdownStage } from './countdown-option'
import { ToolShell } from './tool-shell'
import { useToolState } from './use-tool-state'

const DEFAULTS = {
  ...COUNTDOWN_DEFAULTS,
  raw: ['Alice', 'Bob', 'Carol', 'Dmitri', 'Elena', 'Finn'].join('\n'),
  noRepeat: true,
}

const WHEEL_COLORS = ['#cf2436', '#2f3540', '#e5a33c', '#8f1523', '#5b6673', '#c5842b']

export function WheelTool() {
  const { state, setState, shareUrl } = useToolState('rrp-tool-wheel', DEFAULTS)
  const [winners, setWinners] = useState<string[]>([])
  const [winner, setWinner] = useState<string | null>(null)
  const [confettiKey, setConfettiKey] = useState(0)
  const [round, setRound] = useState(0)

  // The root commits the winner the moment it freezes, but the wheel is still
  // coasting to that segment for another few seconds. Reveal on the wheel's
  // `onResult` instead, or the result lands before the wheel does.
  const [landing, setLanding] = useState(false)

  const items = useMemo(() => parseEntries(state.raw), [state.raw])
  const enough = items.length >= 2

  return (
    <ToolShell
      heading="Spin the wheel"
      intro="Put your entries in, spin, and land on a winner. Nothing to install, nothing to sign up for — and with no-repeat on you can keep spinning for second and third place."
      shareUrl={shareUrl}
      stage={
        <>
          <ConfettiBurst trigger={confettiKey} />
          {enough ? (
            <RafflePick
              key={`${items.join('|')}-${round}`}
              items={items}
              autoStart={false}
              noRepeat={state.noRepeat}
              interval={60}
              onSelect={() => {
                setLanding(true)
                setWinner(null)
              }}
              className="flex w-full flex-col items-center gap-7"
            >
              <div className="w-full max-w-[340px] text-ink">
                <RafflePick.Wheel
                  size={340}
                  colors={WHEEL_COLORS}
                  spinDuration={4200}
                  turns={5}
                  onResult={(v) => {
                    setLanding(false)
                    setWinner(String(v))
                    setWinners((w) => [...w, String(v)])
                    setConfettiKey((k) => k + 1)
                  }}
                />
              </div>

              <p
                aria-live="polite"
                className="min-h-[1.4em] font-display text-[clamp(26px,5vw,44px)] font-bold text-ink"
              >
                {landing ? '' : (winner ?? '')}
              </p>

              <div className="flex items-center justify-center gap-4">
                <RafflePick.Button
                  startLabel="Spin"
                  stopLabel="Stop"
                  waitLabel="…"
                  disabled={landing}
                  className="rounded-full bg-ink px-8 py-3.5 font-mono text-base text-gold-light transition-colors hover:bg-burgundy disabled:cursor-not-allowed disabled:opacity-40"
                />
                <CountdownStage setting={state} />
              </div>

              <WinnersList
                winners={winners}
                onReset={() => {
                  setWinners([])
                  setWinner(null)
                  setRound((r) => r + 1)
                }}
              />
            </RafflePick>
          ) : (
            <p className="py-11 text-center text-ink-3">Add at least two entries to spin.</p>
          )}
        </>
      }
      controls={
        <div className="grid gap-4">
          <EntriesPanel
            value={state.raw}
            onChange={(raw) => {
              setState((s) => ({ ...s, raw }))
              setWinners([])
              setWinner(null)
            }}
            hint="Anything works as an entry — names, usernames, ticket numbers, prizes."
          />
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
                setWinner(null)
                setRound((r) => r + 1)
              }}
              className="h-4 w-4 accent-[var(--burgundy)]"
            />
            No repeat winners — each entry can only win once per session
          </label>
        </div>
      }
    />
  )
}
