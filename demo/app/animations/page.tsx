'use client'

import { useState } from 'react'
import { Container } from '@/components/container'
import { CodeBlock } from '@/components/code-block'
import { AnimationsControlsPanel } from '@/components/animations-page/controls-panel'
import { AnimationsPreviewStage } from '@/components/animations-page/preview-stage'
import {
  buildAnimationsCode,
  DEFAULT_ANIMATIONS_STATE,
  type AnimationsState,
} from '@/components/animations-page/types'

export default function AnimationsPage() {
  const [state, setState] = useState<AnimationsState>(DEFAULT_ANIMATIONS_STATE)

  return (
    <section className="py-11">
      <Container className="max-w-[1240px]">
        <header className="mb-7 max-w-[720px]">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-ink-3">Animations</p>
          <h1 className="mb-4 font-display text-[clamp(27px,3.4vw,40px)] font-bold tracking-[-0.02em] leading-[1.05]">
            Four looks, one tick.
          </h1>
          <p className="text-balance text-ink-2 text-[clamp(15px,1.15vw,17px)] leading-relaxed">
            All four instances below share one root — same tick, same freeze, side by side.
            Pick the one that fits, or bring your own CSS and skip the{' '}
            <code className="rounded bg-bg-2 px-1.5 py-0.5 font-mono text-[0.9em]">animation</code>{' '}
            prop entirely.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <div className="order-2 min-w-0 lg:order-1">
            <AnimationsControlsPanel state={state} onChange={setState} />
          </div>
          <div className="order-1 min-w-0 lg:order-2">
            <AnimationsPreviewStage state={state} />
          </div>
        </div>

        <div className="mt-8 min-w-0">
          <CodeBlock code={buildAnimationsCode(state)} />
        </div>

        <p className="mt-8 text-sm text-ink-2">
          Every animation respects <code className="rounded bg-bg-2 px-1 py-0.5 font-mono text-[0.9em]">prefers-reduced-motion</code>{' '}
          — ticks still update the value, motion just turns off.
        </p>
      </Container>
    </section>
  )
}
