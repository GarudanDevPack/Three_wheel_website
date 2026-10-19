import type { Metadata } from 'next'
import { getPayloadClient } from './payload'
import { routing, type AppLocale } from '@/i18n/routing'
import { indexableLocales } from './translations'

/** Path for a locale under the `as-needed` prefix strategy (English stays unprefixed). */
export const localizedPath = (path: string, locale: AppLocale) => {
  const clean = path === '/' ? '' : path
  return locale === routing.defaultLocale ? clean || '/' : `/${locale}${clean}`
}

/**
 * Static pages whose body is English-only: the legal text (warranty terms from the User Manual,
 * privacy policy, T&C) is hard-coded English, only headings/summary are translated. Their /si and
 * /ta versions are noindex and left out of the sitemap and hreflang until fully translated.
 */
const englishOnlyPages = new Set(['/warranty', '/privacy-policy', '/terms-conditions'])

/** Languages a static page really exists in. */
export const pageLocales = (path: string): readonly AppLocale[] =>
  englishOnlyPages.has(path) ? [routing.defaultLocale] : routing.locales

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

/**
 * Canonical + hreflang + robots for one language version of a page. `indexable` is the set from
 * `indexableLocales()`: hreflang lists exactly that set (always incl. this page when indexable),
 * the canonical always points to this page in its own language, and a language outside the set is
 * served normally but noindex.
 */
export const languageMetadata = (
  path: string,
  locale: AppLocale,
  indexable: readonly AppLocale[],
): Pick<Metadata, 'alternates' | 'robots'> => ({
  alternates: localeAlternates(path, locale, indexable),
  ...(indexable.includes(locale) ? {} : { robots: { index: false, follow: true } }),
})

/** Default 1200×630 share image (cropped from the studio render). */
export const defaultOgImage = { url: '/images/og/neptune-og.jpg', width: 1200, height: 630, alt: 'Neptune electric three-wheeler' }

const ogLocale: Record<AppLocale, string> = { en: 'en_LK', si: 'si_LK', ta: 'ta_LK' }

/** Open Graph + Twitter tags for a page; `image` falls back to the default share image. */
export const socialMetadata = (
  locale: AppLocale,
  {
    title,
    description,
    url,
    image,
    locales = routing.locales,
  }: { title: string; description: string; url: string; image?: string | null; locales?: readonly AppLocale[] },
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
      // Only the other language versions that are indexable for this page.
      alternateLocale: locales.filter((code) => code !== locale).map((code) => ogLocale[code]),
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
  const url = localizedPath(path, locale)

  // `locale: 'all'` returns every language's value of the localised SEO fields, so this page's own
  // text can be read without Payload's English fallback, and the other languages' "Translation
  // complete" flags are known for hreflang.
  type PerLocale<T> = Partial<Record<AppLocale, T | null>>
  type SeoAll = {
    metaTitle?: PerLocale<string>
    metaDescription?: PerLocale<string>
    ogImage?: unknown
    translationComplete?: PerLocale<boolean>
  }
  let seo: { metaTitle?: string | null; metaDescription?: string | null; ogImage?: unknown } | undefined
  let cmsComplete: PerLocale<boolean> | undefined
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
      locale: 'all',
      depth: 1,
    })
    const all = docs[0]?.seo as SeoAll | undefined
    if (docs[0]) {
      seo = { metaTitle: all?.metaTitle?.[locale], metaDescription: all?.metaDescription?.[locale], ogImage: all?.ogImage }
      cmsComplete = all?.translationComplete
      if (locale !== routing.defaultLocale && (!seo.metaTitle || !seo.metaDescription)) {
        console.warn(`[seo] "${slug}" has no ${locale} meta ${!seo.metaTitle ? 'title' : 'description'} in the CMS; using the site's ${locale} copy instead.`)
      }
    }
  } catch {
    // No CMS (no DATABASE_URI): use the fallback copy below.
  }

  // `fallback` is the page's own-language copy from the message files (never English on /si or /ta).
  const title = seo?.metaTitle || fallback.title
  const description = seo?.metaDescription || fallback.description
  const ogImage = seo?.ogImage as { url?: string | null } | null | undefined
  const image = ogImage && typeof ogImage === 'object' ? ogImage.url : null
  const indexable = indexableLocales(path, { contentLocales: pageLocales(path), cmsComplete })

  return {
    title,
    description,
    ...languageMetadata(path, locale, indexable),
    ...socialMetadata(locale, { title, description, url, image, locales: indexable }),
  }
}

/**
 * A CMS record's "Translation complete" flag in every language (empty without a CMS), so all
 * language versions of a page build the same hreflang set.
 */
export async function cmsTranslationFlags(
  collection: 'vehicles' | 'news',
  slug: string,
): Promise<Partial<Record<AppLocale, boolean | null>> | undefined> {
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, locale: 'all', depth: 0 })
    const seo = docs[0]?.seo as { translationComplete?: Partial<Record<AppLocale, boolean | null>> } | undefined
    return seo?.translationComplete
  } catch {
    return undefined
  }
}
