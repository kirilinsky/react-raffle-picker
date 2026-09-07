'use client'

import { useId } from 'react'

export function parseEntries(raw: string): string[] {
  return raw
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}

const SAMPLE = ['Alice', 'Bob', 'Carol', 'Dmitri', 'Elena', 'Finn', 'Grace', 'Hugo'].join('\n')

export function EntriesPanel({
  value,
  onChange,
  label = 'Entries — one per line',
  hint,
}: {
  value: string
  onChange: (v: string) => void
  label?: string
  hint?: string
}) {
  const id = useId()
  const entries = parseEntries(value)

  const action =
    'rounded-full border border-line-2 px-3 py-1.5 font-mono text-xs text-ink-2 transition-colors hover:bg-bg-2 hover:text-ink disabled:opacity-40'

  return (
    <div className="flex flex-col gap-2 rounded-4 border border-line bg-bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label
          htmlFor={id}
          className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3"
        >
          {label}
        </label>
        <span className="font-mono text-[11px] text-ink-3">
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>

      <textarea
        id={id}
        rows={8}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        placeholder={'Alice\nBob\nCarol'}
        className="w-full resize-y rounded-2 border border-line bg-bg px-3 py-2.5 font-mono text-sm leading-relaxed text-ink focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/20"
      />

      <div className="flex flex-wrap gap-2">
        <button type="button" className={action} onClick={() => onChange(SAMPLE)}>
          Use sample list
        </button>
        <button
          type="button"
          className={action}
          disabled={entries.length < 2}
          onClick={() => {
            const shuffled = [...entries]
            for (let i = shuffled.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1))
              ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
            }
            onChange(shuffled.join('\n'))
          }}
        >
          Shuffle
        </button>
        <button
          type="button"
          className={action}
          disabled={entries.length === 0}
          onClick={() => {
            onChange([...new Set(entries)].join('\n'))
          }}
        >
          Remove duplicates
        </button>
        <button
          type="button"
          className={action}
          disabled={value.length === 0}
          onClick={() => onChange('')}
        >
          Clear
        </button>
      </div>

      {hint && <p className="mt-1 text-xs leading-relaxed text-ink-3">{hint}</p>}
    </div>
  )
}

export function WinnersList({
  winners,
  onReset,
  label = 'Winners so far',
}: {
  winners: string[]
  onReset?: () => void
  label?: string
}) {
  if (winners.length === 0) return null

  return (
    <div className="flex w-full max-w-[640px] flex-wrap items-center justify-center gap-2">
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">{label}:</span>
      {winners.map((w, i) => (
        <span
          key={`${w}-${i}`}
          className="rounded-full bg-green/15 px-3 py-1 font-mono text-xs text-green"
        >
          {i + 1}. {w}
        </span>
      ))}
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="font-mono text-xs text-burgundy underline underline-offset-2 hover:no-underline"
        >
          start over
        </button>
      )}
    </div>
  )
}
