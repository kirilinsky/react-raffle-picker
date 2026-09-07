import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/container'
import { TOOLS } from '@/components/tools/tools-nav'
import { pageMetadata } from '@/lib/site'

export const metadata: Metadata = pageMetadata({
  title: 'Free random picker tools — wheel, names, numbers, slots',
  description:
    'Free browser tools for running a draw: spin a wheel, pick a random name or number, spin a slot machine, or draw a running order. No sign-up, no ads, works on stream.',
  path: '/tools',
})

export default function ToolsHub() {
  return (
    <section className="py-11">
      <Container className="max-w-[1100px]">
        <header className="mb-8 max-w-[720px]">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-ink-3">Tools</p>
          <h1 className="mb-4 font-display text-[clamp(27px,3.4vw,40px)] font-bold leading-[1.05] tracking-[-0.02em]">
            Run the draw. Skip the code.
          </h1>
          <p className="text-balance text-ink-2 text-[clamp(15px,1.15vw,17px)] leading-relaxed">
            Ready-to-use pickers for giveaways, classrooms and streams. Nothing to install and no
            account — put your list in, go fullscreen, and draw. Your entries stay in your browser.
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2">
          {TOOLS.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group flex flex-col gap-3 rounded-4 border border-line bg-bg-card p-6 transition-colors hover:border-burgundy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy"
            >
              <span aria-hidden="true" className="text-3xl leading-none">
                {tool.emoji}
              </span>
              <h2 className="font-display text-xl font-bold tracking-[-0.01em] text-ink group-hover:text-burgundy">
                {tool.tagline}
              </h2>
              <p className="text-sm leading-relaxed text-ink-2">{tool.blurb}</p>
              <span className="mt-auto pt-2 font-mono text-xs text-burgundy">Open →</span>
            </Link>
          ))}
        </div>

        <p className="mt-9 border-t border-line pt-6 text-sm text-ink-3">
          Every tool on this page is the{' '}
          <Link href="/" className="text-burgundy underline underline-offset-2 hover:no-underline">
            react-raffle-picker
          </Link>{' '}
          component with a different set of props. If you want one of these inside your own app, the
          same engine ships as an open-source React package.
        </p>
      </Container>
    </section>
  )
}
