'use client'

import Link from 'next/link'
import { useRef, useState, type ReactNode } from 'react'
import { Container } from '../container'
import { useFullscreen } from './use-fullscreen'

function ExpandIcon({ active }: { active: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="h-4 w-4 fill-none stroke-current"
      strokeWidth="1.6"
    >
      {active ? (
        <path d="M6 1v5H1M10 15v-5h5" strokeLinecap="round" />
      ) : (
        <path d="M1 6V1h5M15 10v5h-5" strokeLinecap="round" />
      )}
    </svg>
  )
}

function ShareButton({ getUrl }: { getUrl: () => string }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      type="button"
      onClick={async () => {
        const url = getUrl()
        try {
          await navigator.clipboard.writeText(url)
        } catch {
          // Clipboard blocked (insecure context, permission) — put the link in
          // the address bar so it can still be copied by hand.
          window.history.replaceState(null, '', url)
        }
        setCopied(true)
        setTimeout(() => setCopied(false), 1800)
      }}
      className="inline-flex items-center gap-2 rounded-full border border-line-2 px-4 py-2 text-sm font-medium text-ink-2 transition-colors hover:bg-bg-2 hover:text-ink"
    >
      {copied ? 'Link copied' : 'Share this draw'}
    </button>
  )
}

export function ToolShell({
  heading,
  intro,
  stage,
  controls,
  shareUrl,
  footer,
}: {
  heading: string
  intro: ReactNode
  /** The draw itself. This is what goes fullscreen. */
  stage: ReactNode
  /** Entry list, range, options — hidden in fullscreen. */
  controls?: ReactNode
  shareUrl?: () => string
  footer?: ReactNode
}) {
  const stageRef = useRef<HTMLDivElement | null>(null)
  const { active, toggle } = useFullscreen(stageRef)

  return (
    <section className="py-10 sm:py-10">
      <Container className="max-w-[1100px]">
        <header className={active ? 'sr-only' : 'mb-8 max-w-[720px]'}>
          <h1 className="mb-3 font-display text-[clamp(27px,3.4vw,38px)] font-bold leading-[1.05] tracking-[-0.02em]">
            {heading}
          </h1>
          <p className="text-balance text-ink-2 text-[clamp(15px,1.15vw,17px)] leading-relaxed">
            {intro}
          </p>
        </header>

        <div
          ref={stageRef}
          data-fullscreen={active ? '' : undefined}
          className={
            active
              ? 'fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-bg p-6'
              : 'relative flex flex-col items-center justify-center gap-6 rounded-4 border border-line bg-bg-card px-4 py-10 sm:py-10'
          }
        >
          <button
            type="button"
            onClick={toggle}
            aria-label={active ? 'Exit fullscreen' : 'Go fullscreen'}
            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-bg-2 hover:text-ink"
          >
            <ExpandIcon active={active} />
          </button>

          {stage}

          {active && (
            <p className="absolute bottom-4 font-mono text-xs text-ink-3">
              Press Esc to leave fullscreen
            </p>
          )}
        </div>

        {!active && (
          <>
            {controls && <div className="mt-8">{controls}</div>}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {shareUrl && <ShareButton getUrl={shareUrl} />}
              <button
                type="button"
                onClick={toggle}
                className="inline-flex items-center gap-2 rounded-full border border-line-2 px-4 py-2 text-sm font-medium text-ink-2 transition-colors hover:bg-bg-2 hover:text-ink"
              >
                <ExpandIcon active={false} />
                Fullscreen
              </button>
            </div>

            {footer}

            <p className="mt-8 border-t border-line pt-6 text-sm text-ink-3">
              Free, no sign-up, and your list never leaves your browser. Building something similar?{' '}
              <Link
                href="/"
                className="text-burgundy underline underline-offset-2 hover:no-underline"
              >
                This runs on react-raffle-picker
              </Link>
              , an open-source React component.
            </p>
          </>
        )}
      </Container>
    </section>
  )
}
