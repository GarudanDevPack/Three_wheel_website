import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { routing, type AppLocale } from '@/i18n/routing'
import { localizedPath, pageLocales } from '@/lib/pageSeo'
import { fallbackNews, newsLocales } from '@/lib/news'
import { availableModels, catalogModelLocales } from '@/lib/catalog'
import { siteUrl } from '@/lib/site'
import { indexableLocales } from '@/lib/translations'

export const revalidate = 300

const staticRoutes = [
  '/',
  '/vehicles',
  '/about',
  '/contact',
  '/dealers',
  '/news',
  '/privacy-policy',
  '/terms-conditions',
  '/warranty',
  '/faq',
]

/**
 * One URL per indexable language version, each carrying the same hreflang set (`locales` comes from
 * indexableLocales(): English always, si/ta only once marked translation-complete).
 */
const entriesFor = (
  path: string,
  lastModified: Date,
  locales: readonly AppLocale[] = routing.locales,
): MetadataRoute.Sitemap =>
  locales.map((locale) => ({
    url: `${siteUrl}${localizedPath(path, locale)}`,
    lastModified,
    alternates: {
      languages: Object.fromEntries(locales.map((code) => [code, `${siteUrl}${localizedPath(path, code)}`])),
    },
  }))

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []
  type Flags = Partial<Record<AppLocale, boolean | null>>
  const pageFlags = new Map<string, Flags | undefined>()
  const flagsOf = (doc: unknown) => (doc as { seo?: { translationComplete?: Flags } }).seo?.translationComplete
  const addStaticRoutes = (updatedAt: Map<string, Date> = new Map()) =>
    staticRoutes.forEach((route) =>
      entries.push(
        ...entriesFor(
          route,
          updatedAt.get(route) ?? new Date(),
          indexableLocales(route, { contentLocales: pageLocales(route), cmsComplete: pageFlags.get(route) }),
        ),
      ),
    )

  try {
    const payload = await getPayloadClient()
    const [vehicles, news, pages] = await Promise.all([
      // locale 'all': each record's "Translation complete" flag per language.
      payload.find({ collection: 'vehicles', limit: 1000, locale: 'all', depth: 0 }),
      payload.find({ collection: 'news', where: { _status: { equals: 'published' } }, limit: 1000, locale: 'all', depth: 0 }),
      payload.find({ collection: 'pages', limit: 100, locale: 'all', depth: 0 }),
    ])

    // Static pages: the CMS page record's updatedAt when there is one ("home" is "/").
    const pageUpdatedAt = new Map(
      pages.docs
        .filter((page) => page.updatedAt)
        .map((page) => [page.slug === 'home' ? '/' : `/${page.slug}`, new Date(page.updatedAt)] as const),
    )
    pages.docs.forEach((page) => pageFlags.set(page.slug === 'home' ? '/' : `/${page.slug}`, flagsOf(page)))
    addStaticRoutes(pageUpdatedAt)

    vehicles.docs.forEach((vehicle) => {
      const path = `/vehicles/${vehicle.slug}`
      entries.push(
        ...entriesFor(
          path,
          vehicle.updatedAt ? new Date(vehicle.updatedAt) : new Date(),
          indexableLocales(path, { cmsComplete: flagsOf(vehicle) }),
        ),
      )
    })
    news.docs.forEach((item) => {
      const doc = item as unknown as { slug: string; updatedAt?: string }
      const path = `/news/${doc.slug}`
      entries.push(
        ...entriesFor(path, doc.updatedAt ? new Date(doc.updatedAt) : new Date(), indexableLocales(path, { cmsComplete: flagsOf(item) })),
      )
    })
  } catch {
    addStaticRoutes()
    // Payload/database not configured yet — list the catalog model pages and built-in articles instead.
    availableModels.forEach((model) => {
      const path = `/vehicles/${model.slug}`
      entries.push(...entriesFor(path, new Date(), indexableLocales(path, { contentLocales: catalogModelLocales })))
    })
    fallbackNews.forEach((item) => {
      const path = `/news/${item.slug}`
      entries.push(...entriesFor(path, new Date(item.publishedDate), indexableLocales(path, { contentLocales: newsLocales(item.slug) })))
    })
  }

  return entries
}
