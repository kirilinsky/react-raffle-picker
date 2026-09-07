'use client'

import { useState } from 'react'
import { Container } from '@/components/container'
import { ControlsPanel } from '@/components/playground/controls-panel'
import { LiveCode } from '@/components/playground/live-code'
import { PreviewStage } from '@/components/playground/preview-stage'
import { DEFAULT_STATE, type PlaygroundState } from '@/components/playground/types'

export default function PlaygroundPage() {
  const [state, setState] = useState<PlaygroundState>(DEFAULT_STATE)

  return (
    <section className="py-11">
      <Container className="max-w-[1240px]">
        <header className="mb-7 max-w-[720px]">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-ink-3">
            Playground
          </p>
          <h1 className="mb-4 font-display text-[clamp(27px,3.4vw,40px)] font-bold tracking-[-0.02em] leading-[1.05]">
            Twist the knobs.
          </h1>
          <p className="text-balance text-ink-2 text-[clamp(15px,1.15vw,17px)] leading-relaxed">
            Every prop, live. Copy the code when it looks right.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <div className="order-2 min-w-0 lg:order-1">
            <ControlsPanel state={state} onChange={setState} />
          </div>
          <div className="order-1 min-w-0 lg:order-2">
            <PreviewStage state={state} />
          </div>
        </div>

        <div className="mt-8 min-w-0">
          <LiveCode state={state} />
        </div>
      </Container>
    </section>
  )
}
