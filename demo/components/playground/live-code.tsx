'use client'

import { useState } from 'react'
import { normalizeRange, type PlaygroundState } from './types'

const parseItems = (raw: string) =>
  raw
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

export function buildCode(s: PlaygroundState): string {
  const propsArr: string[] = []
  if (s.mode === 'range') {
    const range = normalizeRange(s.min, s.max)
    propsArr.push(`min={${range.min}}`, `max={${range.max}}`)
  } else {
    const items = parseItems(s.itemsRaw)
    propsArr.push(`items={${JSON.stringify(items.length ? items : ['—'])}}`)
  }
  if (s.interval !== 80) propsArr.push(`interval={${s.interval}}`)
  if (s.inertia) propsArr.push(`inertia`)
  if (s.autoStart) propsArr.push(`autoStart`)

  const indent = '\n      '
  const valueProp = s.animation !== 'none' ? ` animation="${s.animation}"` : ''
  const countdownLine = s.countdown
    ? `      <RafflePick.Countdown seconds={${s.countdown}} />\n`
    : ''

  return `import { RafflePick } from 'react-raffle-picker'

export function Demo() {
  return (
    <RafflePick${indent}${propsArr.join(indent)}
    >
      <RafflePick.Value${valueProp} />
${countdownLine}      <RafflePick.Button startLabel="Spin" stopLabel="Stop" />
    </RafflePick>
  )
}`
}

export function LiveCode({ state }: { state: PlaygroundState }) {
  const [copied, setCopied] = useState(false)
  const code = buildCode(state)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      /* clipboard blocked — silent */
    }
  }

  return (
    <div className="overflow-hidden rounded-3 border border-line">
      <div className="flex items-center justify-between border-b border-line bg-bg-2 px-5 py-3">
        <span className="font-mono text-xs text-ink-3">playground.tsx</span>
        <button
          type="button"
          onClick={onCopy}
          aria-label="Copy code"
          className="rounded-2 border border-line bg-bg-card px-2.5 py-1 font-mono text-[11px] text-ink-2 transition-colors hover:bg-bg"
        >
          {copied ? '✓ copied' : 'Copy'}
        </button>
      </div>
      <pre className="max-w-full overflow-x-auto bg-[#17181c] p-4 font-mono text-[12px] leading-relaxed text-[#e6e7ea] sm:p-5 sm:text-[13px]">
        <code>{code}</code>
      </pre>
    </div>
  )
}
