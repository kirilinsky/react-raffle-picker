'use client'

export function SlotLever({ pulled }: { pulled: boolean }) {
  return (
    <span className="pointer-events-none absolute inset-0 block">
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-4 w-7 rounded-full bg-ink shadow-[inset_0_-2px_4px_rgba(0,0,0,0.5),0_1px_2px_rgba(0,0,0,0.4)] z-10" />

      <span
        className={[
          'absolute bottom-2 left-1/2 -translate-x-1/2 origin-bottom flex flex-col items-center',
          'transition-transform duration-[420ms] ease-[cubic-bezier(0.5,0,0.2,1)]',
          pulled ? 'rotate-[68deg]' : 'hover:rotate-[6deg]',
        ].join(' ')}
      >
        <span className="h-[38px] w-[38px] rounded-full border-2 border-ink bg-[radial-gradient(circle_at_30%_25%,#ff8a8a_0%,#cf2436_45%,#8f1523_100%)] shadow-[0_3px_8px_rgba(0,0,0,0.45),inset_0_-4px_8px_rgba(0,0,0,0.35)] -mb-1 z-10 max-[600px]:h-[30px] max-[600px]:w-[30px]" />
        <span className="h-[140px] w-3 rounded-full bg-gradient-to-b from-[#dcdde1] via-[#b6b8bf] to-[#83858d] shadow-[inset_2px_0_0_rgba(255,255,255,0.4),inset_-2px_0_0_rgba(0,0,0,0.3)] max-[600px]:h-[110px]" />
      </span>
    </span>
  )
}
