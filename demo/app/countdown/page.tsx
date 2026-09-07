'use client'

import { useState } from 'react'
import { Container } from '@/components/container'
import { CodeBlock } from '@/components/code-block'
import { CountdownControlsPanel } from '@/components/countdown-page/controls-panel'
import { CountdownPreviewStage } from '@/components/countdown-page/preview-stage'
import { buildCountdownCode, DEFAULT_COUNTDOWN_STATE, type CountdownState } from '@/components/countdown-page/types'

export default function CountdownPage() {
  const [state, setState] = useState<CountdownState>(DEFAULT_COUNTDOWN_STATE)

  return (
    <section className="py-11">
      <Container className="max-w-[1240px]">
        <header className="mb-7 max-w-[720px]">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-ink-3">Countdown</p>
          <h1 className="mb-4 font-display text-[clamp(27px,3.4vw,40px)] font-bold tracking-[-0.02em] leading-[1.05]">
            Auto-freeze, on the clock.
          </h1>
          <p className="text-balance text-ink-2 text-[clamp(15px,1.15vw,17px)] leading-relaxed">
            <code className="rounded bg-bg-2 px-1.5 py-0.5 font-mono text-[0.9em]">
              {'<RafflePick.Countdown>'}
            </code>{' '}
            schedules the freeze for you — a built-in SVG ring + label, or swap in your own
            render-prop.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <div className="order-2 min-w-0 lg:order-1">
            <CountdownControlsPanel state={state} onChange={setState} />
          </div>
          <div className="order-1 min-w-0 lg:order-2">
            <CountdownPreviewStage state={state} />
          </div>
        </div>

        <div className="mt-8 min-w-0">
          <CodeBlock code={buildCountdownCode(state)} />
        </div>
      </Container>
    </section>
  )
}
