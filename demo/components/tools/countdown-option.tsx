'use client'

import { RafflePick } from 'react-raffle-picker'

export interface CountdownSetting {
  countdown: boolean
  countdownSeconds: number
}

export const COUNTDOWN_DEFAULTS: CountdownSetting = {
  countdown: false,
  countdownSeconds: 5,
}

const PRESETS = [3, 5, 10, 15, 30]

/**
 * Renders nothing unless the countdown is on. `<RafflePick.Countdown>` only
 * mounts while the root is running and freezes it when the timer expires, so a
 * draw can start on one click and stop itself — no second click, hands free
 * while the host talks over it.
 */
export function CountdownStage({
  setting,
  className,
}: {
  setting: CountdownSetting
  className?: string
}) {
  if (!setting.countdown) return null
  return (
    <RafflePick.Countdown
      seconds={setting.countdownSeconds}
      className={className ?? 'text-burgundy'}
    />
  )
}

export function CountdownControl({
  setting,
  onChange,
}: {
  setting: CountdownSetting
  onChange: (next: Partial<CountdownSetting>) => void
}) {
  return (
    <div className="flex flex-col gap-3 rounded-4 border border-line bg-bg-card p-5">
      <label className="flex items-center gap-3 text-sm text-ink-2">
        <input
          type="checkbox"
          checked={setting.countdown}
          onChange={(e) => onChange({ countdown: e.target.checked })}
          className="h-4 w-4 accent-[var(--burgundy)]"
        />
        <span>
          <span className="font-medium text-ink">Auto-stop on a timer</span> — start the draw and
          let the countdown call it
        </span>
      </label>

      {setting.countdown && (
        <div className="flex flex-wrap items-center gap-2 pl-7">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
            Seconds
          </span>
          {PRESETS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange({ countdownSeconds: s })}
              aria-pressed={setting.countdownSeconds === s}
              className={`rounded-full border px-3 py-1.5 font-mono text-xs transition-colors ${
                setting.countdownSeconds === s
                  ? 'border-burgundy bg-burgundy text-gold-light'
                  : 'border-line-2 text-ink-2 hover:bg-bg-2 hover:text-ink'
              }`}
            >
              {s}s
            </button>
          ))}
          <input
            type="number"
            min={1}
            max={300}
            value={setting.countdownSeconds}
            onChange={(e) => {
              const n = Number(e.target.value)
              if (Number.isFinite(n) && n > 0) onChange({ countdownSeconds: Math.trunc(n) })
            }}
            aria-label="Countdown seconds"
            className="w-20 rounded-2 border border-line bg-bg px-2.5 py-1.5 font-mono text-xs text-ink focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/20"
          />
        </div>
      )}
    </div>
  )
}
