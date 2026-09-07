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

export function NamePickerTool() {
  const { state, setState, shareUrl } = useToolState('rrp-tool-name-picker', DEFAULTS)
  const [winners, setWinners] = useState<string[]>([])
  const [confettiKey, setConfettiKey] = useState(0)
  const [round, setRound] = useState(0)

  const items = useMemo(() => parseEntries(state.raw), [state.raw])
  const enough = items.length >= 2

  return (
    <ToolShell
      heading="Pick a random name"
      intro="Paste your list, hit draw, get a winner. Keep drawing for runners-up — with no-repeat on, nobody wins twice."
      shareUrl={shareUrl}
      stage={
        <>
          <ConfettiBurst trigger={confettiKey} />
          {enough ? (
            <RafflePick
              key={`${items.join('|')}-${round}`}
              items={items}
              autoStart={false}
              inertia
              noRepeat={state.noRepeat}
              interval={70}
              onSelect={(v) => {
                setWinners((w) => [...w, String(v)])
                setConfettiKey((k) => k + 1)
              }}
              className="flex flex-col items-center gap-8 py-6"
            >
              <RafflePick.Value
                animation="roll"
                className="text-center font-display text-[clamp(44px,11vw,120px)] font-bold leading-[1.05] tracking-[-0.02em] text-burgundy"
              />

              <div className="flex items-center justify-center gap-4">
                <RafflePick.Button
                  startLabel="Draw a name"
                  stopLabel="Stop"
                  waitLabel="…"
                  className="rounded-full bg-ink px-8 py-3.5 font-mono text-base text-gold-light transition-colors hover:bg-burgundy disabled:cursor-not-allowed disabled:opacity-40"
                />
                <CountdownStage setting={state} />
              </div>

              <WinnersList
                winners={winners}
                onReset={() => {
                  setWinners([])
                  setRound((r) => r + 1)
                }}
              />
            </RafflePick>
          ) : (
            <p className="py-11 text-center text-ink-3">Add at least two names to draw.</p>
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
            }}
            label="Names — one per line"
            hint="Paste straight from a chat export, a spreadsheet column, or a sign-up sheet."
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
                setRound((r) => r + 1)
              }}
              className="h-4 w-4 accent-[var(--burgundy)]"
            />
            No repeat winners — each name can only win once per session
          </label>
        </div>
      }
    />
  )
}
