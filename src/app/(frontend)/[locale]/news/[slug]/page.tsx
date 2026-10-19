import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Preloader from '@/components/animations/LazyPreloader'
import Header from '@/components/vehicle/Header'
import Footer from '@/components/vehicle/Footer'
import NewsCard from '@/components/news/NewsCard'
import NewsReveal from '@/components/news/NewsReveal'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { getNewsBySlug, getNewsList, newsLocales } from '@/lib/news'
import { formatDate } from '@/lib/format'
import { cmsTranslationFlags, languageMetadata, localizedPath, socialMetadata } from '@/lib/pageSeo'
import { indexableLocales } from '@/lib/translations'
import { siteUrl } from '@/lib/site'
import JsonLd from '@/components/seo/JsonLd'
import { absoluteUrl, breadcrumbJsonLd } from '@/lib/jsonLd'

export const revalidate = 300

type PageProps = { params: Promise<{ locale: AppLocale; slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const item = await getNewsBySlug(locale, slug)
  if (!item) return {}

  const title = item.seoTitle || item.title
  const description = item.seoDescription || item.excerpt || ''
  const path = `/news/${slug}`
  const indexable = indexableLocales(path, {
    contentLocales: newsLocales(slug),
    cmsComplete: await cmsTranslationFlags('news', slug),
  })
  const social = socialMetadata(locale, {
    title,
    description,
    url: localizedPath(path, locale),
    image: item.cover?.url,
    locales: indexable,
  })

  return {
    title,
    description,
    ...languageMetadata(path, locale, indexable),
    ...social,
    openGraph: { ...social.openGraph, type: 'article', publishedTime: item.publishedDate },
  }
}

const NewsArticlePage = async ({ params }: PageProps) => {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const item = await getNewsBySlug(locale, slug)
  if (!item) notFound()

  const [t, tc] = await Promise.all([getTranslations('News'), getTranslations('Breadcrumbs')])
  const more = (await getNewsList(locale, 4)).filter((other) => other.id !== item.id).slice(0, 3)
  const pagePath = `/news/${slug}`

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    inLanguage: locale,
    headline: item.title,
    description: item.excerpt || undefined,
    image: item.cover ? [absoluteUrl(item.cover.url)] : undefined,
    datePublished: item.publishedDate,
    mainEntityOfPage: absoluteUrl(localizedPath(pagePath, locale)),
    author: { '@type': 'Organization', name: 'Neptune' },
    publisher: { '@type': 'Organization', name: 'Neptune', logo: { '@type': 'ImageObject', url: absoluteUrl('/icon.png') } },
  }

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd(locale, tc('home'), [{ name: tc('news'), path: '/news' }, { name: item.title, path: pagePath }])} />
      <Preloader />
      <Header />
      <main className="tw:bg-surface">
        <article className="tw:mx-auto tw:max-w-4xl tw:px-6 tw:pb-16 tw:pt-12">
          <Link
            href="/news"
            className="tw:inline-flex tw:items-center tw:gap-1.5 tw:text-sm tw:font-semibold tw:text-brand-blue"
          >
            <span aria-hidden="true">←</span> {t('back')}
          </Link>

          <div className="tw:mt-6 tw:flex tw:flex-wrap tw:items-center tw:gap-2 tw:text-sm tw:font-semibold tw:text-brand-ink/50">
            <time dateTime={item.publishedDate}>{formatDate(item.publishedDate, locale)}</time>
            {item.sourceName && (
              <span className="tw:rounded-full tw:bg-brand-blue/10 tw:px-2.5 tw:py-0.5 tw:text-xs tw:text-brand-blue">
                {item.sourceName}
              </span>
            )}
          </div>
          <h1 className="tw:mt-3 tw:text-3xl tw:font-bold tw:leading-tight tw:text-brand-ink tw:md:text-5xl">{item.title}</h1>
          {item.excerpt && <p className="tw:mt-4 tw:text-lg tw:text-brand-ink/70">{item.excerpt}</p>}

          {item.cover && (
            <div className="tw:relative tw:mt-8 tw:aspect-[16/9] tw:overflow-hidden tw:rounded-3xl tw:bg-surface-raised">
              <Image
                src={item.cover.url}
                alt={item.cover.alt || item.title}
                fill
                priority
                sizes="(min-width: 1024px) 896px, 100vw"
                className="tw:object-cover"
              />
            </div>
          )}

          {item.body ? (
            <div className="news-body tw:mt-10">
              <RichText data={item.body} />
            </div>
          ) : (
            item.paragraphs && (
              <div className="news-body tw:mt-10">
                {item.paragraphs.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </div>
            )
          )}

          {item.related && (
            <Link
              href={item.related.href}
              className="tw:mt-10 tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-brand-blue tw:px-5 tw:py-2.5 tw:text-sm tw:font-semibold tw:text-white tw:transition tw:hover:bg-brand-blue-light"
            >
              {item.related.label}
              <span aria-hidden="true">→</span>
            </Link>
          )}

          {item.sources && item.sources.length > 0 && (
            <div className="tw:mt-10 tw:border-t tw:border-brand-ink/10 tw:pt-6">
              <h2 className="tw:text-sm tw:font-semibold tw:text-brand-ink/50">{t('sources')}</h2>
              <ul className="tw:mt-3 tw:space-y-2 tw:text-sm">
                {item.sources.map((source) => (
                  <li key={source.url}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="tw:text-brand-blue tw:underline tw:underline-offset-2"
                    >
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {item.sourceUrl && (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="tw:mt-10 tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:border tw:border-brand-ink/15 tw:px-5 tw:py-2.5 tw:text-sm tw:font-semibold tw:text-brand-ink tw:transition tw:hover:border-brand-blue tw:hover:text-brand-blue"
            >
              {item.sourceName ? t('originallyIn', { source: item.sourceName }) : t('readOriginal')}
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </article>

        {more.length > 0 && (
          <section className="tw:border-t tw:border-brand-ink/10 tw:bg-surface-raised/50 tw:py-16">
            <div className="tw:mx-auto tw:max-w-6xl tw:px-6">
              <h2 className="tw:text-2xl tw:font-bold tw:text-brand-ink">{t('moreNews')}</h2>
              <NewsReveal className="tw:mt-8 tw:grid tw:gap-6 tw:sm:grid-cols-2 tw:lg:grid-cols-3">
                {more.map((other) => (
                  <NewsCard
                    key={other.id}
                    item={other}
                    dateLabel={formatDate(other.publishedDate, locale)}
                    readMore={t('readMore')}
                  />
                ))}
              </NewsReveal>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}

export default NewsArticlePage
