import type { AppLocale } from '@/i18n/routing'
import { localizedPath } from './pageSeo'
import { siteUrl } from './site'

export const absoluteUrl = (path: string) => new URL(path, siteUrl).toString()

/** BreadcrumbList starting at Home; `trail` paths are locale-neutral ("/vehicles/x"). */
export const breadcrumbJsonLd = (locale: AppLocale, homeLabel: string, trail: Array<{ name: string; path: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: homeLabel, path: '/' }, ...trail].map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: absoluteUrl(localizedPath(crumb.path, locale)),
  })),
})

/** FAQPage for the questions shown on the page, in the page's own language. */
export const faqPageJsonLd = (faqs: Array<{ question: string; answer: string }>, locale: AppLocale) =>
  faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        inLanguage: locale,
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      }
    : null
