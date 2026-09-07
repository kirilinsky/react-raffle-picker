'use client'

import { useCallback, useEffect, useState, type RefObject } from 'react'

/**
 * Fullscreen for the draw stage only — the point is an OBS-capturable surface
 * with no page chrome in it. Falls back to a CSS-only "fill the viewport" mode
 * when the Fullscreen API is unavailable (notably iOS Safari on iPhone).
 */
export function useFullscreen(ref: RefObject<HTMLElement | null>) {
  const [active, setActive] = useState(false)
  const [nativeSupported, setNativeSupported] = useState(true)

  useEffect(() => {
    setNativeSupported(typeof document !== 'undefined' && document.fullscreenEnabled)
  }, [])

  useEffect(() => {
    const onChange = () => {
      if (!document.fullscreenElement) setActive(false)
    }
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  // Without the native API there is no browser-provided way out, so Escape has
  // to be wired up by hand.
  useEffect(() => {
    if (!active || nativeSupported) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, nativeSupported])

  const toggle = useCallback(async () => {
    const node = ref.current
    if (!node) return

    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => {})
      setActive(false)
      return
    }

    if (nativeSupported && node.requestFullscreen) {
      try {
        await node.requestFullscreen()
        setActive(true)
        return
      } catch {
        // Denied by the browser — fall through to the CSS fallback.
      }
    }
    setActive((v) => !v)
  }, [ref, nativeSupported])

  return { active, toggle }
}
