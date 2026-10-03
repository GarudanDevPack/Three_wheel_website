import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { routing } from '@/i18n/routing'
import { localizedPath } from '@/lib/pageSeo'

export const revalidate = 300

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

const staticRoutes = [
  '/',
  '/vehicles',
  '/about',
  '/contact',
  '/dealers',
  '/news',
  '/privacy-policy',
  '/terms-conditions',
]

const entriesFor = (path: string, lastModified: Date): MetadataRoute.Sitemap =>
  routing.locales.map((locale) => ({
    url: `${siteUrl}${localizedPath(path, locale)}`,
    lastModified,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((code) => [code, `${siteUrl}${localizedPath(path, code)}`]),
      ),
    },
  }))

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = staticRoutes.flatMap((route) => entriesFor(route, new Date()))

  try {
    const payload = await getPayloadClient()
    const [vehicles, news] = await Promise.all([
      payload.find({ collection: 'vehicles', limit: 1000 }),
      payload.find({ collection: 'news', where: { _status: { equals: 'published' } }, limit: 1000 }),
    ])

    vehicles.docs.forEach((vehicle) => {
      entries.push(
        ...entriesFor(`/vehicles/${vehicle.slug}`, vehicle.updatedAt ? new Date(vehicle.updatedAt) : new Date()),
      )
    })
    news.docs.forEach((item) => {
      const doc = item as unknown as { slug: string; updatedAt?: string }
      entries.push(...entriesFor(`/news/${doc.slug}`, doc.updatedAt ? new Date(doc.updatedAt) : new Date()))
    })
  } catch {
    // Payload/database not configured yet — sitemap still returns the static routes.
  }

  return entries
}
