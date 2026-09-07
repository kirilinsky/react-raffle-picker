'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useState } from 'react'
import { NAV_ITEMS } from './nav-items'
import { TOOLS, TOOLS_HUB } from './tools/tools-nav'

const githubHref = 'https://github.com/kirilinsky/react-raffle-picker'

function isActivePath(pathname: string, href: string) {
  if (href === '/') {
    return pathname === '/'
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

function GitHubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 fill-current">
      <path d="M8 0C3.58 0 0 3.67 0 8.2c0 3.62 2.29 6.69 5.47 7.78.4.08.55-.18.55-.4 0-.19-.01-.84-.01-1.53-2.01.38-2.53-.5-2.69-.96-.09-.24-.48-.96-.82-1.15-.28-.16-.68-.55-.01-.56.63-.01 1.08.59 1.23.84.72 1.24 1.87.89 2.33.68.07-.53.28-.89.51-1.09-1.78-.21-3.64-.91-3.64-4.04 0-.89.31-1.62.82-2.19-.08-.21-.36-1.04.08-2.16 0 0 .67-.22 2.2.84A7.4 7.4 0 0 1 8 3.98c.68 0 1.36.09 2 .28 1.53-1.06 2.2-.84 2.2-.84.44 1.12.16 1.95.08 2.16.51.57.82 1.29.82 2.19 0 3.14-1.87 3.83-3.65 4.04.29.26.54.75.54 1.52 0 1.09-.01 1.97-.01 2.24 0 .22.15.48.55.4A8.09 8.09 0 0 0 16 8.2C16 3.67 12.42 0 8 0Z" />
    </svg>
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const generatedMenuId = useId()
  const menuId = `primary-nav-${generatedMenuId.replace(/:/g, '')}`

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-[color-mix(in_srgb,var(--bg)_85%,transparent)] backdrop-blur-[12px]">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-4 px-4 min-[820px]:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy"
          aria-label="react-raffle-picker home"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-gold bg-burgundy font-display text-base font-bold leading-none text-gold-light">
            R
          </span>
          <span className="min-w-0 font-mono text-sm font-medium leading-none tracking-normal">
            <span className="text-ink-2">react-</span>
            <span className="text-burgundy">raffle-picker</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="ml-auto hidden items-center gap-1 min-[820px]:flex">
          <Link
            href={TOOLS_HUB.href}
            aria-current={isActivePath(pathname, TOOLS_HUB.href) ? 'page' : undefined}
            className={`mr-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy ${
              isActivePath(pathname, TOOLS_HUB.href)
                ? 'bg-burgundy text-gold-light'
                : 'text-burgundy hover:bg-burgundy/10'
            }`}
          >
            {TOOLS_HUB.label}
          </Link>
          <span aria-hidden="true" className="mr-2 h-5 w-px bg-line-2" />
          {NAV_ITEMS.map((item) => {
            const active = isActivePath(pathname, item.href)

            return (
              <Link
                key={item.id}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy ${
                  active ? 'bg-ink text-gold-light' : 'text-ink-2 hover:bg-bg-2 hover:text-ink'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <a
          href={githubHref}
          target="_blank"
          rel="noreferrer"
          className="ml-1 hidden items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg transition-colors duration-150 hover:bg-burgundy hover:text-gold-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy min-[820px]:inline-flex"
        >
          <GitHubIcon />
          GitHub
        </a>

        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={menuId}
          aria-label="Toggle primary navigation"
          onClick={() => setIsOpen((open) => !open)}
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink transition-colors duration-150 hover:bg-bg-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy min-[820px]:hidden"
        >
          <span className="relative h-4 w-5" aria-hidden="true">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition-transform duration-150 ${
                isOpen ? 'translate-y-[7px] rotate-45' : ''
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-current transition-opacity duration-150 ${
                isOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-0.5 w-5 rounded-full bg-current transition-transform duration-150 ${
                isOpen ? '-translate-y-[7px] -rotate-45' : ''
              }`}
            />
          </span>
        </button>
      </div>

      <div
        id={menuId}
        className={`border-t border-line px-4 pb-4 pt-3 min-[820px]:hidden ${isOpen ? 'block' : 'hidden'}`}
      >
        <nav aria-label="Primary mobile" className="mx-auto grid max-w-[1240px] gap-1">
          <p className="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
            Tools
          </p>
          {[TOOLS_HUB, ...TOOLS].map((item) => {
            const active = isActivePath(pathname, item.href)

            return (
              <Link
                key={item.id}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy ${
                  active ? 'bg-burgundy text-gold-light' : 'text-burgundy hover:bg-burgundy/10'
                }`}
              >
                {item.label}
              </Link>
            )
          })}

          <p className="px-3 pb-1 pt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
            Docs
          </p>
          {NAV_ITEMS.map((item) => {
            const active = isActivePath(pathname, item.href)

            return (
              <Link
                key={item.id}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy ${
                  active ? 'bg-ink text-gold-light' : 'text-ink-2 hover:bg-bg-2 hover:text-ink'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
          <a
            href={githubHref}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg transition-colors duration-150 hover:bg-burgundy hover:text-gold-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy"
          >
            <GitHubIcon />
            GitHub
          </a>
        </nav>
      </div>
    </header>
  )
}

export { SiteHeader as Header }
