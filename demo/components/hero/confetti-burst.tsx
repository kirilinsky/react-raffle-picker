'use client'

import { useEffect, useMemo, useState } from 'react'

const COLORS = [
  'var(--burgundy)',
  'var(--gold)',
  'var(--green)',
  'var(--react-blue, #61dafb)',
  'var(--gold-light)',
  'var(--burgundy-light)',
]

interface Shard {
  left: number
  cx: number
  delay: number
  duration: number
  color: string
  size: number
  rotate: number
}

const makeShards = (count: number): Shard[] =>
  Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    cx: (Math.random() - 0.5) * 320,
    delay: Math.random() * 250,
    duration: 2400 + Math.random() * 1100,
    color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
    size: 6 + Math.random() * 8,
    rotate: Math.random() * 360,
  }))

export function ConfettiBurst({ trigger }: { trigger: number }) {
  const [active, setActive] = useState(false)
  const shards = useMemo<Shard[]>(() => (active ? makeShards(80) : []), [active, trigger])

  useEffect(() => {
    if (!trigger) return
    setActive(true)
    const id = setTimeout(() => setActive(false), 3500)
    return () => clearTimeout(id)
  }, [trigger])

  if (!active) return null

  return (
    <span className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {shards.map((s, i) => (
        <span
          key={i}
          className="absolute -top-4 block animate-confetti-fall"
          style={{
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size * 0.4}px`,
            background: s.color,
            animationDelay: `${s.delay}ms`,
            animationDuration: `${s.duration}ms`,
            ['--cx' as string]: `${s.cx}px`,
            ['--rot' as string]: `${s.rotate}deg`,
          }}
        />
      ))}
    </span>
  )
}
