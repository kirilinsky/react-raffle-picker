import Link from 'next/link'
import { Container } from '@/components/container'
import { CodeBlock } from '@/components/code-block'
import { ApiSection } from '@/components/api-page/api-section'
import {
  BUTTON_PROPS,
  CONTEXT_FIELDS,
  COUNTDOWN_PROPS,
  ROOT_PROPS,
  SLOTS_PROPS,
  WHEEL_PROPS,
  TYPE_ROWS,
  VALUE_PROPS,
} from '@/components/api-page/data'
import { PropsTable } from '@/components/api-page/props-table'
import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/site'

const QUICKSTART = `import { RafflePick } from 'react-raffle-picker'

;<RafflePick items={['Alice', 'Bob', 'Carol']} inertia autoStart={false}>
  <RafflePick.Value animation="roll" />
  <RafflePick.Button startLabel="Draw" stopLabel="Stop" />
  <RafflePick.Countdown seconds={5} />
</RafflePick>`

const TOC = [
  { href: '#root', label: 'Root' },
  { href: '#value', label: 'Value' },
  { href: '#button', label: 'Button' },
  { href: '#countdown', label: 'Countdown' },
  { href: '#slots', label: 'Slots' },
  { href: '#wheel', label: 'Wheel' },
  { href: '#context', label: 'Context' },
  { href: '#types', label: 'Types' },
]

export const metadata: Metadata = pageMetadata({
  title: 'API reference — every prop on one page',
  description:
    'Full react-raffle-picker API: RafflePick root props, Value, Button, Countdown and Slots sub-components, the useRaffleContext hook and exported types.',
  path: '/api',
})

export default function ApiPage() {
  return (
    <section className="py-11">
      <Container className="max-w-[880px]">
        <header className="mb-8">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-ink-3">API</p>
          <h1 className="mb-4 font-display text-[clamp(27px,3.4vw,40px)] font-bold tracking-[-0.02em] leading-[1.05]">
            Every prop, one page.
          </h1>
          <p className="text-balance text-ink-2 text-[clamp(15px,1.15vw,17px)] leading-relaxed">
            This is the flat reference — everything the compound API exposes, no clicking through
            tabs. For a live, interactive version of every prop, use the{' '}
            <a
              href="https://kirilinsky.github.io/react-raffle-picker/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-burgundy underline underline-offset-2 hover:no-underline"
            >
              Storybook
            </a>{' '}
            or the{' '}
            <Link
              href="/playground"
              className="text-burgundy underline underline-offset-2 hover:no-underline"
            >
              Playground
            </Link>
            .
          </p>
        </header>

        <nav className="mb-7 flex flex-wrap gap-2 border-y border-line py-4">
          {TOC.map((t) => (
            <a
              key={t.href}
              href={t.href}
              className="rounded-full border border-line px-3 py-1.5 font-mono text-xs text-ink-2 transition-colors hover:border-burgundy hover:text-burgundy"
            >
              {t.label}
            </a>
          ))}
        </nav>

        <div className="mb-7">
          <CodeBlock code={QUICKSTART} />
        </div>

        <ApiSection id="root" title="<RafflePick>" kicker="root">
          <p className="text-sm leading-relaxed text-ink-2">
            Owns the engine — cycling, phase machine, no-repeat history. Provides context; renders
            no DOM opinion beyond the wrapper element.
          </p>
          <PropsTable rows={ROOT_PROPS} />
        </ApiSection>

        <ApiSection id="value" title="<RafflePick.Value>" kicker="consumer">
          <p className="text-sm leading-relaxed text-ink-2">
            Renders the cycling value. Writes textContent imperatively per tick — no React re-render
            while running. Multiple instances inside one root are supported.
          </p>
          <PropsTable rows={VALUE_PROPS} />
        </ApiSection>

        <ApiSection id="button" title="<RafflePick.Button>" kicker="consumer">
          <p className="text-sm leading-relaxed text-ink-2">
            Toggles start / freeze based on the current phase.
          </p>
          <PropsTable rows={BUTTON_PROPS} />
        </ApiSection>

        <ApiSection id="countdown" title="<RafflePick.Countdown>" kicker="consumer">
          <p className="text-sm leading-relaxed text-ink-2">
            Schedules auto-freeze after{' '}
            <code className="rounded bg-bg-2 px-1 py-0.5 font-mono text-[0.9em]">seconds</code>.
            Renders an SVG ring + numeric label by default.
          </p>
          <PropsTable rows={COUNTDOWN_PROPS} />
        </ApiSection>

        <ApiSection id="slots" title="<RafflePick.Slots>" kicker="consumer">
          <p className="text-sm leading-relaxed text-ink-2">
            Independent multi-reel slot machine. Each reel ticks on its own and stops with a
            stagger, left to right.
          </p>
          <PropsTable rows={SLOTS_PROPS} />
        </ApiSection>

        <ApiSection id="wheel" title="<RafflePick.Wheel>" kicker="consumer">
          <p className="text-sm leading-relaxed text-ink-2">
            Spinning wheel that lands on the value the root picks. Segments come from{' '}
            <code className="rounded bg-bg-2 px-1 py-0.5 font-mono text-[0.9em]">items</code> or the{' '}
            <code className="rounded bg-bg-2 px-1 py-0.5 font-mono text-[0.9em]">min</code>/
            <code className="rounded bg-bg-2 px-1 py-0.5 font-mono text-[0.9em]">max</code> range.
            Needs no stylesheet, and honours{' '}
            <code className="rounded bg-bg-2 px-1 py-0.5 font-mono text-[0.9em]">
              prefers-reduced-motion
            </code>
            .
          </p>
          <p className="text-sm leading-relaxed text-ink-2">
            Reveal results from the wheel&apos;s{' '}
            <code className="rounded bg-bg-2 px-1 py-0.5 font-mono text-[0.9em]">onResult</code>,
            not the root&apos;s{' '}
            <code className="rounded bg-bg-2 px-1 py-0.5 font-mono text-[0.9em]">onSelect</code>:
            the root commits the winner when it freezes, which is the moment the landing animation{' '}
            <em>starts</em>.
          </p>
          <PropsTable rows={WHEEL_PROPS} />
        </ApiSection>

        <ApiSection id="context" title="useRaffleContext()" kicker="escape hatch">
          <p className="text-sm leading-relaxed text-ink-2">
            For fully custom renderers. Must be called under{' '}
            <code className="rounded bg-bg-2 px-1 py-0.5 font-mono text-[0.9em]">
              {'<RafflePick>'}
            </code>{' '}
            — throws otherwise.
          </p>
          <PropsTable rows={CONTEXT_FIELDS} />
        </ApiSection>

        <ApiSection id="types" title="Exported types" kicker="typescript">
          <PropsTable rows={TYPE_ROWS} />
        </ApiSection>

        <p className="mt-8 border-t border-line pt-8 text-sm text-ink-2">
          Full prop docs, recipes, and CSS custom properties live in the{' '}
          <a
            href="https://github.com/kirilinsky/react-raffle-picker#readme"
            target="_blank"
            rel="noopener noreferrer"
            className="text-burgundy underline underline-offset-2 hover:no-underline"
          >
            README
          </a>{' '}
          on GitHub.
        </p>
      </Container>
    </section>
  )
}
