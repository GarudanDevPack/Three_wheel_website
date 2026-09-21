import type { Metadata } from 'next'
import { getPayloadClient } from './payload'

export async function getPageMetadata(
  slug: string,
  fallback: { title: string; description: string },
): Promise<Metadata> {
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    const seo = docs[0]?.seo

    return {
      title: seo?.metaTitle || fallback.title,
      description: seo?.metaDescription || fallback.description,
      openGraph: seo?.ogImage?.url ? { images: [seo.ogImage.url] } : undefined,
    }
  } catch {
    return fallback
  }
}
