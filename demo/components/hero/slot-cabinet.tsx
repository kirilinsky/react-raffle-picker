'use client'

import { useState } from 'react'
import { RafflePick, useRaffleContext } from 'react-raffle-picker'
import { ConfettiBurst } from './confetti-burst'
import { SlotLever } from './slot-lever'

function LeverLabel() {
  const { phase } = useRaffleContext('SlotCabinet.Lever')
  // Stays pulled through the win reveal (`frozen`) — a real lever doesn't
  // spring back up before you've seen the result. Only resets at `idle`.
  const pulled = phase !== 'idle'
  return <SlotLever pulled={pulled} />
}

export function SlotCabinet() {
  const [confettiKey, setConfettiKey] = useState(0)

  return (
    <>
      <ConfettiBurst trigger={confettiKey} />

      <div className="inline-flex flex-col items-center">
        <RafflePick
          inertia
          autoStart={false}
          initialValue="⚛raffled"
          finalValue="you⭐win"
          onSelect={() => setConfettiKey((k) => k + 1)}
          className="cabinet-idle-glow relative inline-block rounded-4 border border-line bg-ink px-5 py-5 shadow-lg max-[600px]:scale-[0.94] max-[600px]:px-3 max-[600px]:py-4"
        >
          <RafflePick.Slots
            length={7}
            spinInterval={70}
            staggerMs={220}
            className="hero-slots relative z-10 flex gap-1.5 rounded-3 bg-bg-card p-2.5 max-[600px]:gap-1 max-[600px]:p-2"
            slotClassName="hero-slot relative inline-block h-[1.25em] w-[clamp(44px,7vw,68px)] overflow-hidden rounded-2 bg-bg-2 font-display text-[clamp(32px,5.4vw,50px)] font-bold leading-none tabular-nums text-ink transition-colors duration-300 data-[stopped]:text-burgundy max-[600px]:w-[34px] max-[600px]:text-[26px]"
          />

          <div className="relative z-10 mx-auto mt-3 h-1 w-16 rounded-full bg-white/15" />

          <RafflePick.Countdown seconds={4} className="sr-only" />

          <RafflePick.Button
            className="absolute -right-9 top-1/2 z-30 h-44 w-14 -translate-y-1/2 cursor-pointer border-0 bg-transparent p-0 disabled:cursor-not-allowed max-[600px]:-right-7 max-[600px]:h-36 max-[600px]:w-12"
            startLabel={<LeverLabel />}
            stopLabel={<LeverLabel />}
            waitLabel={<LeverLabel />}
          />
        </RafflePick>
      </div>
    </>
  )
}
