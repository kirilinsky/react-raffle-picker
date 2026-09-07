'use client'

import { useMemo, useState } from 'react'
import { RafflePick, useRaffleContext } from 'react-raffle-picker'
import { EntriesPanel, parseEntries } from './entries-panel'
import { COUNTDOWN_DEFAULTS, CountdownControl, CountdownStage } from './countdown-option'
import { ToolShell } from './tool-shell'
import { useToolState } from './use-tool-state'

const DEFAULTS = {
  ...COUNTDOWN_DEFAULTS,
  raw: ['Alice', 'Bob', 'Carol', 'Dmitri', 'Elena'].join('\n'),
}

/** Reads `remaining`/`exhausted` from the root, which only it knows. */
function RoundStatus({
  drawn,
  total,
  onReset,
}: {
  drawn: number
  total: number
  onReset: () => void
}) {
  const { exhausted } = useRaffleContext('RoundStatus')

  if (exhausted || drawn >= total) {
    return (
      <div className="flex flex-col items-center gap-3">
        <p className="font-mono text-sm text-green">Everyone has had a turn.</p>
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-line-2 px-4 py-2 font-mono text-xs text-ink-2 transition-colors hover:bg-bg-2 hover:text-ink"
        >
          Start a new round
        </button>
      </div>
    )
  }

  return (
    <p className="font-mono text-sm text-ink-3">
      {total - drawn} of {total} still to go
    </p>
  )
}

export function OrderTool() {
  const { state, setState, shareUrl } = useToolState('rrp-tool-order', DEFAULTS)
  const [order, setOrder] = useState<string[]>([])
  const [round, setRound] = useState(0)

  const items = useMemo(() => parseEntries(state.raw), [state.raw])
  const enough = items.length >= 2

  const reset = () => {
    setOrder([])
    setRound((r) => r + 1)
  }

  return (
    <ToolShell
      heading="Who's next"
      intro="Draw one person at a time until everyone has had a turn. Standup order, classroom questions, demo slots, podcast rounds — no repeats until the list is done."
      shareUrl={shareUrl}
      stage={
        enough ? (
          <RafflePick
            key={`${items.join('|')}-${round}`}
            items={items}
            autoStart={false}
            inertia
            noRepeat
            interval={70}
            onSelect={(v) => setOrder((o) => [...o, String(v)])}
            className="flex w-full flex-col items-center gap-7 py-4"
          >
            <RafflePick.Value
              animation="roll"
              className="text-center font-display text-[clamp(38px,9vw,96px)] font-bold leading-[1.05] tracking-[-0.02em] text-burgundy"
            />

            <div className="flex items-center justify-center gap-4">
              <RafflePick.Button
                startLabel={order.length === 0 ? 'Draw first' : 'Draw next'}
                stopLabel="Stop"
                waitLabel="…"
                className="rounded-full bg-ink px-8 py-3.5 font-mono text-base text-gold-light transition-colors hover:bg-burgundy disabled:cursor-not-allowed disabled:opacity-40"
              />
              <CountdownStage setting={state} />
            </div>

            <RoundStatus drawn={order.length} total={items.length} onReset={reset} />

            {order.length > 0 && (
              <ol className="flex w-full max-w-[520px] flex-col gap-1.5">
                {order.map((name, i) => (
                  <li
                    key={`${name}-${i}`}
                    className="flex items-center gap-3 rounded-2 bg-bg px-4 py-2.5 text-left"
                  >
                    <span className="font-mono text-xs text-ink-3">{i + 1}</span>
                    <span className="font-medium text-ink">{name}</span>
                  </li>
                ))}
              </ol>
            )}
          </RafflePick>
        ) : (
          <p className="py-11 text-center text-ink-3">Add at least two people to draw an order.</p>
        )
      }
      controls={
        <div className="grid gap-4">
          <EntriesPanel
            value={state.raw}
            onChange={(raw) => {
              setState((s) => ({ ...s, raw }))
              reset()
            }}
            label="People — one per line"
            hint="The list stays put between draws, so the same standup group is ready tomorrow."
          />
          <CountdownControl
            setting={state}
            onChange={(next) => setState((s) => ({ ...s, ...next }))}
          />
        </div>
      }
    />
  )
}
