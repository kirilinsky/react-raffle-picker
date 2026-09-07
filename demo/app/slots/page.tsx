'use client'

import { useState } from 'react'
import { Container } from '@/components/container'
import { CodeBlock } from '@/components/code-block'
import { SlotsControlsPanel } from '@/components/slots-page/controls-panel'
import { SlotsPreviewStage } from '@/components/slots-page/preview-stage'
import { buildSlotsCode, DEFAULT_SLOTS_STATE, type SlotsState } from '@/components/slots-page/types'

export default function SlotsPage() {
  const [state, setState] = useState<SlotsState>(DEFAULT_SLOTS_STATE)

  return (
    <section className="py-11">
      <Container className="max-w-[1240px]">
        <header className="mb-7 max-w-[720px]">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-ink-3">Slots</p>
          <h1 className="mb-4 font-display text-[clamp(27px,3.4vw,40px)] font-bold tracking-[-0.02em] leading-[1.05]">
            Independent reels, staggered stop.
          </h1>
          <p className="text-balance text-ink-2 text-[clamp(15px,1.15vw,17px)] leading-relaxed">
            <code className="rounded bg-bg-2 px-1.5 py-0.5 font-mono text-[0.9em]">
              {'<RafflePick.Slots>'}
            </code>{' '}
            — each reel spins on its own tick and locks in one at a time, left to right.
            Digits, letters, emoji — any charset.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <div className="order-2 min-w-0 lg:order-1">
            <SlotsControlsPanel state={state} onChange={setState} />
          </div>
          <div className="order-1 min-w-0 lg:order-2">
            <SlotsPreviewStage state={state} />
          </div>
        </div>

        <div className="mt-8 min-w-0">
          <CodeBlock code={buildSlotsCode(state)} />
        </div>
      </Container>
    </section>
  )
}
