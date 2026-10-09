import { getLocale, getTranslations } from 'next-intl/server'
import SectionVideoBackdrop from '@/components/ui/SectionVideoBackdrop'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { getNewsList } from '@/lib/news'
import { formatDate } from '@/lib/format'
import NewsCard from './NewsCard'
import NewsReveal from './NewsReveal'

/** Home-page "Latest news" strip — the three newest articles plus links to all news and the warranty terms. */
const HomeNews = async () => {
  const locale = (await getLocale()) as AppLocale
  const [t, tNews, items] = await Promise.all([
    getTranslations('HomeNews'),
    getTranslations('News'),
    getNewsList(locale, 3),
  ])
  if (!items.length) return null

  return (
    <section id="news" className="tw:relative tw:isolate tw:overflow-hidden tw:bg-surface-raised tw:py-20">
      <SectionVideoBackdrop
        src="/videos/model-selector-backdrop.mp4"
        poster="/images/auto/night-ride.jpg"
        variant="soft"
        base="surface-raised"
        lazy
      />
      <div className="tw:relative tw:z-10 tw:mx-auto tw:max-w-6xl tw:px-6">
        <div className="tw:flex tw:flex-col tw:gap-6 tw:md:flex-row tw:md:items-end tw:md:justify-between">
          <div className="tw:max-w-2xl">
            <p className="tw:text-sm tw:font-semibold tw:text-brand-blue">{t('eyebrow')}</p>
            <h2 className="tw:mt-2 tw:text-3xl tw:font-bold tw:text-brand-ink tw:md:text-4xl">{t('title')}</h2>
            <p className="tw:mt-3 tw:text-brand-ink/70">{t('intro')}</p>
          </div>
          <Link
            href="/news"
            className="tw:inline-flex tw:shrink-0 tw:self-start tw:rounded-full tw:bg-brand-blue tw:px-6 tw:py-3 tw:text-sm tw:font-semibold tw:text-white tw:transition tw:hover:bg-brand-blue-light tw:md:self-auto"
          >
            {t('viewAll')}
          </Link>
        </div>

        <NewsReveal className="tw:mt-10 tw:grid tw:gap-6 tw:sm:grid-cols-2 tw:lg:grid-cols-3">
          {items.map((item) => (
            <NewsCard
              key={item.id}
              item={item}
              headingLevel="h3"
              dateLabel={formatDate(item.publishedDate, locale)}
              readMore={tNews('readMore')}
            />
          ))}
        </NewsReveal>

        <Link
          href="/warranty"
          className="tw:mt-10 tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:border tw:border-brand-blue/40 tw:px-5 tw:py-2.5 tw:text-sm tw:font-semibold tw:text-brand-blue tw:transition tw:hover:border-brand-blue"
        >
          {t('warrantyLink')}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}

export default HomeNews
