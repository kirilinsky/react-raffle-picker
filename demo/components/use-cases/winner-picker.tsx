'use client'

import { useState } from 'react'
import { RafflePick, useRaffleContext } from 'react-raffle-picker'
import { ConfettiBurst } from '../hero/confetti-burst'
import { NameListInput, parseNames } from './name-list-input'

const DEFAULT_NAMES = 'Alice\nBob\nCarol\nDmitri\nElena\nFinn'

const buttonCls =
  'rounded-2 bg-ink px-5 py-2.5 font-mono text-sm text-gold-light transition-colors hover:bg-burgundy disabled:cursor-not-allowed disabled:opacity-40'

function WinnersBar({ winners }: { winners: string[] }) {
  const { exhausted, resetHistory } = useRaffleContext('WinnerPicker')
  if (winners.length === 0) return null
  return (
    <div className="flex w-full flex-wrap items-center gap-2 border-t border-line pt-4">
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">Won:</span>
      {winners.map((w, i) => (
        <span key={i} className="rounded-full bg-green/15 px-2.5 py-1 font-mono text-xs text-green">
          {w}
        </span>
      ))}
      {exhausted && (
        <button
          type="button"
          onClick={resetHistory}
          className="ml-auto font-mono text-xs text-burgundy underline underline-offset-2 hover:no-underline"
        >
          reset
        </button>
      )}
    </div>
  )
}

export function WinnerPicker() {
  const [raw, setRaw] = useState(DEFAULT_NAMES)
  const [winners, setWinners] = useState<string[]>([])
  const [confettiKey, setConfettiKey] = useState(0)
  const items = parseNames(raw)

  return (
    <div className="flex flex-col gap-5">
      <ConfettiBurst trigger={confettiKey} />
      <NameListInput
        value={raw}
        onChange={(v) => {
          setRaw(v)
          setWinners([])
        }}
      />
      {items.length > 0 && (
        <RafflePick
          key={raw}
          items={items}
          autoStart={false}
          inertia
          onSelect={(v) => {
            setWinners((w) => [...w, String(v)])
            setConfettiKey((k) => k + 1)
          }}
          className="flex flex-col items-center gap-4 rounded-2 bg-bg p-5"
        >
          <RafflePick.Value
            animation="roll"
            className="font-display text-[clamp(24px,2.6vw,34px)] font-bold text-burgundy"
          />
          <RafflePick.Button
            startLabel="Pick a winner"
            stopLabel="Stop"
            waitLabel="…"
            className={buttonCls}
          />
          <WinnersBar winners={winners} />
        </RafflePick>
      )}
    </div>
  )
}
