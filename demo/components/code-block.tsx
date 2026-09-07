'use client'

import { useState } from 'react'

export function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {}
  }

  return (
    <pre className="relative max-w-full overflow-x-auto rounded-3 border border-[#26272c] bg-[#17181c] p-4 font-mono text-[12px] leading-relaxed text-[#e6e7ea] sm:p-5 sm:text-[13px]">
      <button
        type="button"
        onClick={onCopy}
        aria-label="Copy code"
        className="absolute right-2.5 top-3 rounded-2 border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-[#a8aab2] transition-colors hover:bg-white/10"
      >
        {copied ? '✓ copied' : 'Copy'}
      </button>
      <code>{code}</code>
    </pre>
  )
}
