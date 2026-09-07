import { Container } from '@/components/container'
import { DecisionMaker } from '@/components/use-cases/decision-maker'
import { NumberRoller } from '@/components/use-cases/number-roller'
import { SpeakerOrder } from '@/components/use-cases/speaker-order'
import { UseCaseCard } from '@/components/use-cases/use-case-card'
import { WinnerPicker } from '@/components/use-cases/winner-picker'
import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/site'

export const metadata: Metadata = pageMetadata({
  title: 'Use cases — giveaway, standup order, random number',
  description:
    'Ready-made React random picker recipes: giveaway winner from a pasted name list, speaking order for standups, random number rolls — no repeat winners.',
  path: '/use-cases',
})

export default function UseCasesPage() {
  return (
    <section className="py-11">
      <Container className="max-w-[1240px]">
        <header className="mb-7 max-w-[720px]">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-ink-3">Use cases</p>
          <h1 className="mb-4 font-display text-[clamp(27px,3.4vw,40px)] font-bold tracking-[-0.02em] leading-[1.05]">
            Ready-made, not roll-your-own.
          </h1>
          <p className="text-balance text-ink-2 text-[clamp(15px,1.15vw,17px)] leading-relaxed">
            Paste names, hit a button. Built for the moment you actually need this — mid-stream,
            mid-call, no setup.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <UseCaseCard
            title="Giveaway winner"
            tag="streams"
            description="Paste chat names, pick a winner, confetti. Draw again for a second prize — no repeat winners."
          >
            <WinnerPicker />
          </UseCaseCard>

          <UseCaseCard
            title="Who's next"
            tag="calls / standups"
            description="Draw speaking order one person at a time. No repeats until everyone's had a turn."
          >
            <SpeakerOrder />
          </UseCaseCard>

          <UseCaseCard
            title="Random number"
            tag="raffles / lotto"
            description="Roll a number in any range. Toggle off no-repeat for true independent rolls."
          >
            <NumberRoller />
          </UseCaseCard>

          <UseCaseCard
            title="Quick decision"
            tag="calls"
            description="Yes/no, or your own short list. Every flip is independent — no memory."
          >
            <DecisionMaker />
          </UseCaseCard>
        </div>
      </Container>
    </section>
  )
}
