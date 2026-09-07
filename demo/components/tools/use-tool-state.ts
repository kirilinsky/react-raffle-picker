'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/** Unicode-safe base64url — names are rarely ASCII-only. */
function encode(value: unknown): string {
  const bytes = new TextEncoder().encode(JSON.stringify(value))
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function decode<T>(raw: string): T | null {
  try {
    const b64 = raw.replace(/-/g, '+').replace(/_/g, '/')
    const bin = atob(b64.padEnd(Math.ceil(b64.length / 4) * 4, '='))
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0))
    return JSON.parse(new TextDecoder().decode(bytes)) as T
  } catch {
    return null
  }
}

/**
 * Tool state that survives a reload and travels in a link.
 *
 * A `?d=` param wins over stored state, so a shared link always shows the
 * sender's setup. Everything else falls back to localStorage, then defaults.
 * The first client render matches the server render (defaults) and the stored
 * value is applied in an effect, so hydration stays clean.
 */
export function useToolState<T>(storageKey: string, defaults: T) {
  const [state, setState] = useState<T>(defaults)
  const [hydrated, setHydrated] = useState(false)
  const storageKeyRef = useRef(storageKey)

  useEffect(() => {
    const key = storageKeyRef.current
    let next: T | null = null

    const shared = new URLSearchParams(window.location.search).get('d')
    if (shared) next = decode<T>(shared)

    if (next === null) {
      try {
        const stored = window.localStorage.getItem(key)
        if (stored) next = JSON.parse(stored) as T
      } catch {
        // Private mode, disabled storage, or corrupt JSON — defaults are fine.
      }
    }

    if (next !== null && typeof next === 'object') {
      // Merge so a link or an old stored blob missing newer fields still works.
      setState((current) => ({ ...current, ...next }))
    } else if (next !== null) {
      setState(next)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(storageKeyRef.current, JSON.stringify(state))
    } catch {
      // Nothing actionable — the tool still works for this session.
    }
  }, [state, hydrated])

  const shareUrl = useCallback(() => {
    const url = new URL(window.location.href)
    url.search = ''
    url.searchParams.set('d', encode(state))
    return url.toString()
  }, [state])

  return { state, setState, hydrated, shareUrl }
}
