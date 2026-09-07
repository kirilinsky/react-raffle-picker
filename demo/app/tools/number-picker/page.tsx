import type { Metadata } from 'next'
import { NumberPickerTool } from '@/components/tools/number-picker-tool'
import { TOOLS } from '@/components/tools/tools-nav'
import { pageMetadata } from '@/lib/site'

const tool = TOOLS.find((t) => t.id === 'number-picker')!

export const metadata: Metadata = pageMetadata({
  title: tool.title,
  description: tool.blurb,
  path: tool.href,
})

export default function Page() {
  return <NumberPickerTool />
}
