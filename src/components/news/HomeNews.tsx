import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { getNewsList } from '@/lib/news'
import { formatDate } from '@/lib/format'
import NewsCard from './NewsCard'
import NewsReveal from './NewsReveal'

/** Home "Latest news": one featured story + the next three as compact rows (magazine layout). */
const HomeNews = async () => {
  const locale = (await getLocale()) as AppLocale
  const [t, tNews, items] = await Promise.all([getTranslations('HomeNews'), getTranslations('News'), getNewsList(locale, 4)])
  if (!items.length) return null

  const [lead, ...rest] = items
  const category = (key?: string | null) => (key ? tNews(`categories.${key}`) : null)

  return (
    <section id="news" className="tw:bg-surface tw:py-20">
      <div className="tw:mx-auto tw:max-w-6xl tw:px-6">
        <div className="tw:flex tw:flex-col tw:gap-6 tw:md:flex-row tw:md:items-end tw:md:justify-between">
          <div className="tw:max-w-2xl">
            <p className="tw:text-sm tw:font-semibold tw:text-brand-blue">{t('eyebrow')}</p>
            <h2 className="tw:mt-2 tw:text-3xl tw:font-bold tw:text-brand-ink tw:md:text-4xl">{t('title')}</h2>
            <p className="tw:mt-3 tw:text-base tw:leading-relaxed tw:text-brand-ink/70">{t('intro')}</p>
          </div>
          <Link
            href="/news"
            className="tw:inline-flex tw:shrink-0 tw:items-center tw:gap-2 tw:self-start tw:rounded-full tw:bg-brand-blue tw:px-6 tw:py-3 tw:text-sm tw:font-semibold tw:text-white tw:transition tw:hover:bg-brand-blue-light tw:md:self-auto"
          >
            {t('viewAll')} <span aria-hidden="true">→</span>
          </Link>
        </div>

        <NewsReveal className="tw:mt-10 tw:grid tw:gap-6 tw:lg:grid-cols-12">
          <div className="tw:lg:col-span-7">
            <NewsCard
              item={lead}
              variant="hero"
              headingLevel="h3"
              categoryLabel={category(lead.category)}
              dateLabel={formatDate(lead.publishedDate, locale)}
              readMore={tNews('readMore')}
            />
          </div>
          {rest.length > 0 && (
            <div className="tw:flex tw:flex-col tw:gap-4 tw:lg:col-span-5">
              {rest.map((item) => (
                <NewsCard
                  key={item.id}
                  item={item}
                  variant="compact"
                  headingLevel="h3"
                  categoryLabel={category(item.category)}
                  dateLabel={formatDate(item.publishedDate, locale)}
                  readMore={tNews('readMore')}
                />
              ))}
              <Link
                href="/warranty"
                className="tw:mt-auto tw:inline-flex tw:items-center tw:gap-2 tw:self-start tw:rounded-full tw:border tw:border-brand-blue/40 tw:px-5 tw:py-2.5 tw:text-sm tw:font-semibold tw:text-brand-blue tw:transition tw:hover:border-brand-blue"
              >
                {t('warrantyLink')} <span aria-hidden="true">→</span>
              </Link>
            </div>
          )}
        </NewsReveal>
      </div>
    </section>
  )
}

export default HomeNews
