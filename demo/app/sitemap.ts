import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { NAV_ITEMS } from '@/components/nav-items'
import { TOOLS, TOOLS_HUB } from '@/components/tools/tools-nav'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const docs = NAV_ITEMS.map(({ href }) => ({
    url: new URL(href, SITE_URL).toString(),
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: href === '/' ? 1 : 0.7,
  }))

  // Tools rank above the docs pages: they are the pages a non-developer
  // searching "random name picker" actually wants to land on.
  const tools = [TOOLS_HUB, ...TOOLS].map(({ href }) => ({
    url: new URL(href, SITE_URL).toString(),
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [...docs, ...tools]
}
