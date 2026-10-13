import type { Metadata } from 'next'
import { getPayloadClient } from './payload'
import { routing, type AppLocale } from '@/i18n/routing'

/** Path for a locale under the `as-needed` prefix strategy (English stays unprefixed). */
export const localizedPath = (path: string, locale: AppLocale) => {
  const clean = path === '/' ? '' : path
  return locale === routing.defaultLocale ? clean || '/' : `/${locale}${clean}`
}

/** Self canonical + hreflang. Pass `locales` when only some languages have a real translation. */
export const localeAlternates = (
  path: string,
  locale: AppLocale,
  locales: readonly AppLocale[] = routing.locales,
): Metadata['alternates'] => ({
  canonical: localizedPath(path, locale),
  languages: {
    ...Object.fromEntries(locales.map((code) => [code, localizedPath(path, code)])),
    'x-default': localizedPath(path, routing.defaultLocale),
  },
})

/** Default 1200×630 share image (cropped from the studio render). */
export const defaultOgImage = { url: '/images/og/neptune-og.jpg', width: 1200, height: 630, alt: 'Neptune electric three-wheeler' }

const ogLocale: Record<AppLocale, string> = { en: 'en_LK', si: 'si_LK', ta: 'ta_LK' }

/** Open Graph + Twitter tags for a page; `image` falls back to the default share image. */
export const socialMetadata = (
  locale: AppLocale,
  { title, description, url, image }: { title: string; description: string; url: string; image?: string | null },
): Pick<Metadata, 'openGraph' | 'twitter'> => {
  const images = image ? [{ url: image }] : [defaultOgImage]
  return {
    openGraph: {
      type: 'website',
      title,
      description,
      url,
      siteName: 'Neptune',
      locale: ogLocale[locale],
      alternateLocale: routing.locales.filter((code) => code !== locale).map((code) => ogLocale[code]),
      images,
    },
    twitter: { card: 'summary_large_image', title, description, images },
  }
}

export async function getPageMetadata(
  slug: string,
  locale: AppLocale,
  fallback: { title: string; description: string },
): Promise<Metadata> {
  const path = slug === 'home' ? '/' : `/${slug}`
  const alternates = localeAlternates(path, locale)
  const url = localizedPath(path, locale)

  let seo: { metaTitle?: string | null; metaDescription?: string | null; ogImage?: unknown } | null | undefined
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
      locale,
    })
    seo = docs[0]?.seo
  } catch {
    // No CMS (no DATABASE_URI): use the fallback copy below.
  }

  const title = seo?.metaTitle || fallback.title
  const description = seo?.metaDescription || fallback.description
  const ogImage = seo?.ogImage as { url?: string | null } | null | undefined
  const image = ogImage && typeof ogImage === 'object' ? ogImage.url : null

  return { title, description, alternates, ...socialMetadata(locale, { title, description, url, image }) }
}
