/**
 * The tools track. Separate from NAV_ITEMS on purpose: these pages are for
 * people running a draw, not people integrating the package. Everything that
 * needs to enumerate tools — the hub, the header, the sitemap, per-page
 * metadata — reads this one list.
 */
export interface ToolEntry {
  id: string
  label: string
  href: string
  /** Hub card headline. */
  tagline: string
  /** Hub card body + meta description. */
  blurb: string
  /** Page <h1>. */
  heading: string
  /** SEO title, minus the site suffix. */
  title: string
  emoji: string
}

export const TOOLS: ToolEntry[] = [
  {
    id: 'wheel',
    label: 'Spin the wheel',
    href: '/tools/wheel',
    tagline: 'Spin a wheel of names',
    blurb:
      'Type your entries, spin the wheel, land on a winner. No sign-up, no ads, works on stream.',
    heading: 'Spin the wheel',
    title: 'Spinning wheel picker — spin a wheel of names',
    emoji: '🎡',
  },
  {
    id: 'name-picker',
    label: 'Pick a name',
    href: '/tools/name-picker',
    tagline: 'Pick a random name',
    blurb:
      'Paste a list of names and draw a winner. Draw again for second and third place — nobody wins twice.',
    heading: 'Pick a random name',
    title: 'Random name picker — draw a winner from a list',
    emoji: '🎯',
  },
  {
    id: 'number-picker',
    label: 'Pick a number',
    href: '/tools/number-picker',
    tagline: 'Pick a random number',
    blurb:
      'Set a range and roll the winning number. Ticket draws, seat numbers, prize slots, lotto lines.',
    heading: 'Pick a random number',
    title: 'Random number picker — roll a winning number',
    emoji: '🔢',
  },
  {
    id: 'slot-machine',
    label: 'Slot machine',
    href: '/tools/slot-machine',
    tagline: 'Pull the slot machine',
    blurb:
      'Spin the reels and stop them one by one. Use digits, letters or your own emoji as symbols.',
    heading: 'Slot machine',
    title: 'Slot machine simulator — spin the reels',
    emoji: '🎰',
  },
  {
    id: 'order',
    label: "Who's next",
    href: '/tools/order',
    tagline: 'Draw the running order',
    blurb:
      'Draw one person at a time until everyone has had a turn. Standups, classrooms, podcasts, demos.',
    heading: "Who's next",
    title: "Random order generator — who's next",
    emoji: '📋',
  },
]

export const TOOLS_HUB = { id: 'tools', label: 'Tools', href: '/tools' } as const
