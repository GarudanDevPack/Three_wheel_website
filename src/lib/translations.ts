import { routing, type AppLocale } from '@/i18n/routing'

type TranslatedLocale = Exclude<AppLocale, 'en'>

/**
 * Sinhala / Tamil pages a native speaker has reviewed and approved for Google. Until a path is listed
 * here (or its CMS record has "Translation complete" ticked for that language) the /si or /ta version
 * is still shown to visitors but is noindex and left out of the sitemap and hreflang.
 *
 * Empty on purpose: the current si/ta copy was drafted with AI help and has not been reviewed yet.
 * Example once approved: si: new Set(['/', '/faq', '/news/neptune-cargo-mode-passenger-and-delivery'])
 */
const reviewedTranslations: Record<TranslatedLocale, ReadonlySet<string>> = {
  si: new Set<string>(),
  ta: new Set<string>(),
}

/**
 * Languages in which a page may be indexed (and listed in hreflang + sitemap).
 * English always; si/ta only when the content exists in that language AND it is marked complete.
 *
 * @param contentLocales languages the page's content really exists in (default: all)
 * @param cmsComplete    per-language "Translation complete" flags from the CMS record, when there is one
 */
export const indexableLocales = (
  path: string,
  {
    contentLocales = routing.locales,
    cmsComplete,
  }: { contentLocales?: readonly AppLocale[]; cmsComplete?: Partial<Record<AppLocale, boolean | null | undefined>> } = {},
): AppLocale[] =>
  routing.locales.filter((locale) => {
    if (locale === routing.defaultLocale) return true
    if (!contentLocales.includes(locale)) return false
    return reviewedTranslations[locale as TranslatedLocale].has(path) || cmsComplete?.[locale] === true
  })
