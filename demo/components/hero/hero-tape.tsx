const TAPE_TEXT =
  'GIVEAWAYS · RAFFLES · LOTTERY · DECISION MAKERS · CASINO UI · SLOT MACHINES · COUNTDOWN · OTP CODES · NICKNAMES · CLASSROOM PICKER ·  '

export function HeroTape() {
  return (
    <div
      aria-hidden="true"
      className="relative mt-10 overflow-hidden border-y border-line bg-bg-2 py-2.5 text-ink-3"
    >
      <div className="flex whitespace-nowrap will-change-transform animate-marquee">
        <span className="flex-shrink-0 pr-8 font-mono text-[12px] uppercase tracking-[0.2em]">
          {TAPE_TEXT}
        </span>
        <span className="flex-shrink-0 pr-8 font-mono text-[12px] uppercase tracking-[0.2em]">
          {TAPE_TEXT}
        </span>
      </div>
    </div>
  )
}
