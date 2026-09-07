'use client'

import { useState } from 'react'
import { RafflePick } from 'react-raffle-picker'
import { ConfettiBurst } from '../hero/confetti-burst'
import { COUNTDOWN_DEFAULTS, CountdownControl, CountdownStage } from './countdown-option'
import { ToolShell } from './tool-shell'
import { useToolState } from './use-tool-state'

const PRESETS: Array<{ id: string; label: string; chars: string }> = [
  { id: 'digits', label: 'Digits', chars: '0123456789' },
  { id: 'letters', label: 'Letters', chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
  { id: 'fruit', label: 'Fruit', chars: '🍒🍋🍊🍉🍇🔔⭐️7️⃣' },
  { id: 'faces', label: 'Faces', chars: '😀😎🤑🥳😴🤖👻🎃' },
]

const DEFAULTS = { ...COUNTDOWN_DEFAULTS, reels: 3, chars: '🍒🍋🍊🍉🍇🔔⭐️7️⃣' }

export function SlotMachineTool() {
  const { state, setState, shareUrl } = useToolState('rrp-tool-slot-machine', DEFAULTS)
  const [result, setResult] = useState<string | null>(null)
  const [confettiKey, setConfettiKey] = useState(0)

  // Emoji are multi-codepoint, so reel symbols have to be split by grapheme,
  // not by UTF-16 unit.
  const symbols = Array.from(state.chars).filter((c) => c.trim())
  const reels = Math.min(6, Math.max(1, state.reels))

  return (
    <ToolShell
      heading="Slot machine"
      intro="Pull the lever and watch the reels stop one at a time. Swap in your own symbols — digits, letters, or whatever emoji fit the bit."
      shareUrl={shareUrl}
      stage={
        <>
          <ConfettiBurst trigger={confettiKey} />
          {symbols.length >= 2 ? (
            <RafflePick
              key={`${reels}-${state.chars}`}
              autoStart={false}
              inertia
              noRepeat={false}
              className="flex flex-col items-center gap-8 py-4"
            >
              <div className="rounded-4 border-4 border-gold-deep bg-ink px-6 py-5 shadow-lg">
                <RafflePick.Slots
                  length={reels}
                  chars={symbols.join('')}
                  spinInterval={70}
                  staggerMs={320}
                  className="flex gap-3"
                  slotClassName="h-[clamp(64px,14vw,110px)] w-[clamp(52px,11vw,90px)] rounded-2 bg-bg text-[clamp(30px,7vw,54px)] leading-none"
                  onResult={(r) => {
                    setResult(r)
                    const first = Array.from(r)[0]
                    if (Array.from(r).every((c) => c === first)) setConfettiKey((k) => k + 1)
                  }}
                />
              </div>

              {result && (
                <p className="font-mono text-sm text-ink-3">
                  Last spin: <span className="text-ink">{result}</span>
                </p>
              )}

              <CountdownStage setting={state} />

              <RafflePick.Button
                startLabel="Spin"
                stopLabel="Stop"
                waitLabel="…"
                className="rounded-full bg-ink px-8 py-3.5 font-mono text-base text-gold-light transition-colors hover:bg-burgundy disabled:cursor-not-allowed disabled:opacity-40"
              />
            </RafflePick>
          ) : (
            <p className="py-16 text-center text-ink-3">Add at least two symbols to spin.</p>
          )}
        </>
      }
      controls={
        <div className="grid gap-5 rounded-4 border border-line bg-bg-card p-5">
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
              Reels — {reels}
            </span>
            <input
              type="range"
              min={1}
              max={6}
              value={reels}
              onChange={(e) => setState((s) => ({ ...s, reels: Number(e.target.value) }))}
              className="w-full accent-[var(--burgundy)]"
            />
          </label>

          <div className="flex flex-col gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
              Symbols — {symbols.length} in the pool
            </span>
            <input
              value={state.chars}
              onChange={(e) => setState((s) => ({ ...s, chars: e.target.value }))}
              className="w-full rounded-2 border border-line bg-bg px-3 py-2.5 font-mono text-sm text-ink focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/20"
            />
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setState((s) => ({ ...s, chars: p.chars }))}
                  className="rounded-full border border-line-2 px-3 py-1.5 font-mono text-xs text-ink-2 transition-colors hover:bg-bg-2 hover:text-ink"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <CountdownControl
            setting={state}
            onChange={(next) => setState((s) => ({ ...s, ...next }))}
          />
        </div>
      }
    />
  )
}
