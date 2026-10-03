import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Preloader from '@/components/animations/LazyPreloader'
import Header from '@/components/vehicle/Header'
import Footer from '@/components/vehicle/Footer'
import SectionBackdrop from '@/components/ui/SectionBackdrop'
import NewsCard from '@/components/news/NewsCard'
import NewsReveal from '@/components/news/NewsReveal'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { getNewsList } from '@/lib/news'
import { formatDate } from '@/lib/format'
import { getPageMetadata } from '@/lib/pageSeo'

export const revalidate = 300

type PageProps = { params: Promise<{ locale: AppLocale }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'News' })
  return getPageMetadata('news', locale, { title: t('metaTitle'), description: t('metaDescription') })
}

const NewsPage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('News')
  const items = await getNewsList(locale)
  const [featured, ...rest] = items

  return (
    <>
      <Preloader />
      <Header />
      <main>
        <section className="tw:relative tw:isolate tw:overflow-hidden tw:bg-surface tw:py-20">
          <SectionBackdrop src="/images/auto/night-ride.jpg" variant="soft" base="surface" />
          <div className="tw:relative tw:z-10 tw:mx-auto tw:max-w-6xl tw:px-6">
            <p className="tw:text-sm tw:font-semibold tw:text-brand-blue">{t('eyebrow')}</p>
            <h1 className="tw:mt-2 tw:text-4xl tw:font-bold tw:text-brand-ink tw:md:text-5xl">{t('title')}</h1>
            <p className="tw:mt-4 tw:max-w-2xl tw:text-brand-ink/70">{t('intro')}</p>
          </div>
        </section>

        <section className="tw:bg-surface tw:pb-24">
          <div className="tw:mx-auto tw:max-w-6xl tw:px-6">
            {featured ? (
              <NewsReveal className="tw:space-y-10">
                <NewsCard
                  item={featured}
                  featured
                  dateLabel={formatDate(featured.publishedDate, locale)}
                  readMore={t('readMore')}
                />
                {rest.length > 0 && (
                  <div className="tw:grid tw:gap-6 tw:sm:grid-cols-2 tw:lg:grid-cols-3">
                    {rest.map((item) => (
                      <NewsCard
                        key={item.id}
                        item={item}
                        dateLabel={formatDate(item.publishedDate, locale)}
                        readMore={t('readMore')}
                      />
                    ))}
                  </div>
                )}
              </NewsReveal>
            ) : (
              <div className="tw:mx-auto tw:max-w-xl tw:rounded-3xl tw:border tw:border-dashed tw:border-brand-ink/15 tw:bg-surface-raised tw:px-8 tw:py-16 tw:text-center">
                <svg viewBox="0 0 24 24" className="tw:mx-auto tw:h-12 tw:w-12 tw:text-brand-blue/60" fill="none" aria-hidden="true">
                  <rect x="3" y="4" width="15" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M18 8h2a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2M7 8h7M7 12h7M7 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <h2 className="tw:mt-5 tw:text-xl tw:font-bold tw:text-brand-ink">{t('emptyTitle')}</h2>
                <p className="tw:mt-2 tw:text-brand-ink/60">{t('emptyText')}</p>
                <Link
                  href="/"
                  className="tw:mt-6 tw:inline-flex tw:rounded-full tw:bg-brand-blue tw:px-5 tw:py-2.5 tw:text-sm tw:font-semibold tw:text-white tw:transition tw:hover:bg-brand-blue-light"
                >
                  {t('backHome')}
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default NewsPage
