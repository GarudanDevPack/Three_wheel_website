import type { Metadata } from 'next'
import { getPayloadClient } from './payload'
import { routing, type AppLocale } from '@/i18n/routing'

/** Path for a locale under the `as-needed` prefix strategy (English stays unprefixed). */
export const localizedPath = (path: string, locale: AppLocale) => {
  const clean = path === '/' ? '' : path
  return locale === routing.defaultLocale ? clean || '/' : `/${locale}${clean}`
}

export const localeAlternates = (path: string, locale: AppLocale): Metadata['alternates'] => ({
  canonical: localizedPath(path, locale),
  languages: {
    ...Object.fromEntries(routing.locales.map((code) => [code, localizedPath(path, code)])),
    'x-default': localizedPath(path, routing.defaultLocale),
  },
})

export async function getPageMetadata(
  slug: string,
  locale: AppLocale,
  fallback: { title: string; description: string },
): Promise<Metadata> {
  const path = slug === 'home' ? '/' : `/${slug}`
  const alternates = localeAlternates(path, locale)

  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
      locale,
    })
    const seo = docs[0]?.seo
    const title = seo?.metaTitle || fallback.title
    const description = seo?.metaDescription || fallback.description
    const images = seo?.ogImage && typeof seo.ogImage === 'object' && seo.ogImage.url ? [seo.ogImage.url] : undefined

    return {
      title,
      description,
      alternates,
      openGraph: { title, description, siteName: 'Neptune', images },
      twitter: { card: 'summary_large_image', title, description, images },
    }
  } catch {
    return { ...fallback, alternates }
  }
}
