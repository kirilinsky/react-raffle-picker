import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { Container } from './container'

type SectionSpace = 'sm' | 'md' | 'lg'
type SectionTone = 'default' | 'card' | 'ink'

const spaceClasses: Record<SectionSpace, string> = {
  sm: 'py-7',
  md: 'py-10',
  lg: 'py-14',
}

const toneClasses: Record<SectionTone, string> = {
  default: 'bg-transparent',
  card: 'bg-bg-card',
  ink: 'bg-ink text-gold-light',
}

type SectionProps = {
  id?: string
  children: ReactNode
  className?: string
  space?: SectionSpace
  tone?: SectionTone
}

export function Section({ id, children, className, space = 'md', tone = 'default' }: SectionProps) {
  return (
    <section id={id} className={twMerge(spaceClasses[space], toneClasses[tone], className)}>
      <Container>{children}</Container>
    </section>
  )
}
