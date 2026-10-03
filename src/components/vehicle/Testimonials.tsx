import { getLocale } from 'next-intl/server'
import { getPayloadClient } from '@/lib/payload'
import type { AppLocale } from '@/i18n/routing'
import TestimonialsCarousel, { type TestimonialItem } from './TestimonialsCarousel'

type TestimonialDoc = {
  id: string | number
  name: string
  role?: string | null
  location?: string | null
  quote: string
  rating?: number | null
  photo?: { url?: string | null } | null
}

const Testimonials = async () => {
  const locale = (await getLocale()) as AppLocale
  let items: TestimonialItem[] = []

  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'testimonials',
      where: { featured: { equals: true } },
      sort: 'order',
      limit: 12,
      depth: 1,
      locale,
    })
    items = (docs as unknown as TestimonialDoc[]).map((doc) => ({
      id: String(doc.id),
      name: doc.name,
      role: doc.role || null,
      location: doc.location || null,
      quote: doc.quote,
      rating: Math.min(5, Math.max(1, doc.rating ?? 5)),
      photo: doc.photo?.url || null,
    }))
  } catch {
    // Payload/database not configured yet.
  }

  // Only real customer quotes — the section stays hidden until the admin adds some.
  if (!items.length) return null

  return <TestimonialsCarousel items={items} />
}

export default Testimonials
