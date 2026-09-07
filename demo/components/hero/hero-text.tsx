import Link from 'next/link'
import { HeroPill } from './hero-pill'
import { SlotCabinet } from './slot-cabinet'

export function HeroText() {
  return (
    <div className="flex flex-col items-center text-center">
      <HeroPill>npm i react-raffle-picker</HeroPill>

      <h1 className="mt-4 text-balance font-display text-[clamp(34px,5vw,58px)] leading-[1] tracking-[-0.025em]">
        Random winner picker for React.
      </h1>

      <p className="mt-4 max-w-[600px] text-balance text-ink-2 text-[clamp(15px,1.15vw,17px)] leading-relaxed">
        A headless React component for giveaways, raffles and prize draws. Cycle names or numbers,
        freeze on a winner, never draw the same one twice.
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/tools"
          className="inline-flex items-center justify-center gap-2 rounded-3 bg-burgundy px-[22px] py-3 text-sm font-semibold text-gold-light transition-colors hover:bg-burgundy-deep"
        >
          Just run a draw →
        </Link>
        <Link
          href="/playground"
          className="inline-flex items-center justify-center gap-2 rounded-3 border border-line-2 px-[18px] py-3 text-sm font-semibold text-ink transition-colors hover:bg-bg-2"
        >
          Open playground
        </Link>
      </div>

      <p className="mt-3 font-mono text-xs text-ink-3">
        No install needed for the tools — spin a wheel, pick a name, roll a number.
      </p>

      {/* The machine is the demo, not the headline — it sits below the CTAs so
          the first screen leads with something to do. */}
      <div className="mt-9 inline-block pr-9 max-[600px]:pr-7">
        <SlotCabinet />
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3 font-mono text-xs text-ink-3">
        <span>~3.4 KB gzip</span>
        <span className="text-line-2">·</span>
        <span>headless</span>
        <span className="text-line-2">·</span>
        <span>React 18+</span>
        <span className="text-line-2">·</span>
        <span>MIT</span>
      </div>
    </div>
  )
}
