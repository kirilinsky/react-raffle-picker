'use client'

import { useState } from 'react'
import { RafflePick } from 'react-raffle-picker'
import { NameListInput, parseNames } from './name-list-input'

const DEFAULT_OPTIONS = 'Yes\nNo'

const buttonCls =
  'rounded-2 bg-ink px-5 py-2.5 font-mono text-sm text-gold-light transition-colors hover:bg-burgundy disabled:cursor-not-allowed disabled:opacity-40'

export function DecisionMaker() {
  const [raw, setRaw] = useState(DEFAULT_OPTIONS)
  const [trail, setTrail] = useState<string[]>([])
  const items = parseNames(raw)

  return (
    <div className="flex flex-col gap-5">
      <NameListInput value={raw} onChange={setRaw} label="Options (one per line)" />
      {items.length >= 2 ? (
        <RafflePick
          key={raw}
          items={items}
          noRepeat={false}
          autoStart={false}
          interval={60}
          onSelect={(v) => setTrail((t) => [String(v), ...t].slice(0, 6))}
          className="flex flex-col items-center gap-4 rounded-2 bg-bg p-5"
        >
          <RafflePick.Value
            animation="blur"
            className="font-display text-[clamp(24px,2.6vw,34px)] font-bold text-burgundy"
          />
          <RafflePick.Button
            startLabel="Decide"
            stopLabel="Stop"
            waitLabel="…"
            className={buttonCls}
          />
        </RafflePick>
      ) : (
        <p className="font-mono text-xs text-ink-3">Add at least 2 options.</p>
      )}
      {trail.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-line pt-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">Last:</span>
          {trail.map((t, i) => (
            <span key={i} className="rounded-full bg-bg-2 px-2.5 py-1 font-mono text-xs text-ink-2">
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
