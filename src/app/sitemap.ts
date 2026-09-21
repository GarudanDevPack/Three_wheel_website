import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 300

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

const staticRoutes = ['', '/vehicles', '/about', '/contact', '/dealers']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }))

  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({ collection: 'vehicles', limit: 1000 })

    docs.forEach((vehicle) => {
      entries.push({
        url: `${siteUrl}/vehicles/${vehicle.slug}`,
        lastModified: vehicle.updatedAt ? new Date(vehicle.updatedAt) : new Date(),
      })
    })
  } catch {
    // Payload/database not configured yet — sitemap still returns the static routes.
  }

  return entries
}
