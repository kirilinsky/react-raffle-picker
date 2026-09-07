import { Section } from '../section'

const FEATURES: Array<{ title: string; pill: string; body: string }> = [
  {
    title: 'Headless',
    pill: 'composable',
    body: 'Zero styles, full DOM control. Wrap pieces in your own card, modal, paragraph.',
  },
  {
    title: 'Numbers or items',
    pill: 'two modes',
    body: 'Roll a range like 1–100 or cycle through your own list of names, prizes, or words.',
  },
  {
    title: '4 animations',
    pill: 'css-driven',
    body: 'roll, fade, blur, reel — bound to your tick interval, no cross-frame tearing.',
  },
  {
    title: 'Performant ticks',
    pill: 'no re-render',
    body: 'Tick updates write textContent via refs. No React render per tick. Smooth on potatoes.',
  },
  {
    title: 'Inertia',
    pill: 'opt-in',
    body: 'Soft start, soft stop. The reel ramps in and out for a more tactile feel.',
  },
  {
    title: 'Countdown ring',
    pill: 'auto-freeze',
    body: 'Auto-freeze after N seconds with a built-in SVG ring or your own render-prop.',
  },
  {
    title: 'Slot machine',
    pill: '<Slots />',
    body: 'Independent multi-reel slots. Each reel ticks on its own and stops with a stagger.',
  },
  {
    title: 'TypeScript',
    pill: 'd.ts',
    body: 'Fully typed. Discriminated phase union. No any in the public API.',
  },
]

export function FeaturesGrid() {
  return (
    <Section space="lg">
      <div className="mx-auto mb-8 max-w-[720px] text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-ink-3">
          What&apos;s inside
        </p>
        <h2 className="mb-4 font-display font-bold tracking-[-0.02em] text-[clamp(27px,3.4vw,40px)] leading-[1.05]">
          One root, many faces.
        </h2>
        <p className="text-balance text-ink-2 text-[clamp(15px,1.15vw,17px)] leading-relaxed">
          A compound component you compose, not a widget you configure. Pick the
          pieces you need, drop them where you want them, style them like any
          other DOM.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <article
            key={f.title}
            className="flex min-h-[160px] flex-col gap-2.5 rounded-[14px] border border-line bg-bg-card p-[22px] transition-all hover:-translate-y-0.5 hover:border-burgundy hover:shadow-md"
          >
            <header className="flex items-start justify-between gap-2">
              <h3 className="font-display text-xl leading-tight">{f.title}</h3>
              <span className="shrink-0 whitespace-nowrap rounded-full border border-gold/30 bg-gold/15 px-2.5 py-1 font-mono text-xs text-gold-deep">
                {f.pill}
              </span>
            </header>
            <p className="text-sm leading-relaxed text-ink-2">{f.body}</p>
          </article>
        ))}
      </div>
    </Section>
  )
}
