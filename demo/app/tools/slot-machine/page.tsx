import type { Metadata } from 'next'
import { SlotMachineTool } from '@/components/tools/slot-machine-tool'
import { TOOLS } from '@/components/tools/tools-nav'
import { pageMetadata } from '@/lib/site'

const tool = TOOLS.find((t) => t.id === 'slot-machine')!

export const metadata: Metadata = pageMetadata({
  title: tool.title,
  description: tool.blurb,
  path: tool.href,
})

export default function Page() {
  return <SlotMachineTool />
}
