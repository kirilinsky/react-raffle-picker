/**
 * Docs track — for people integrating the package. The tools track lives in
 * `tools/tools-nav.ts`; the header renders them as two separate groups because
 * the two audiences share almost nothing.
 */
export const NAV_ITEMS = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'playground', label: 'Playground', href: '/playground' },
  { id: 'use-cases', label: 'Use cases', href: '/use-cases' },
  { id: 'slots', label: 'Slots', href: '/slots' },
  { id: 'countdown', label: 'Countdown', href: '/countdown' },
  { id: 'animations', label: 'Animations', href: '/animations' },
  { id: 'api', label: 'API', href: '/api' },
] as const
