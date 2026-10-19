import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Preloader from '@/components/animations/LazyPreloader'
import Header from '@/components/vehicle/Header'
import Footer from '@/components/vehicle/Footer'
import DealerLocator, { type Dealer } from '@/components/ui/DealerLocator'
import SectionBackdrop from '@/components/ui/SectionBackdrop'
import type { AppLocale } from '@/i18n/routing'
import { getPayloadClient } from '@/lib/payload'
import { getPageMetadata } from '@/lib/pageSeo'
import FallbackDealerCards from '@/components/vehicle/FallbackDealerCards'
import JsonLd from '@/components/seo/JsonLd'
import { breadcrumbJsonLd } from '@/lib/jsonLd'

export const revalidate = 300

type PageProps = { params: Promise<{ locale: AppLocale }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'DealersPage' })
  return getPageMetadata('dealers', locale, { title: t('metaTitle'), description: t('metaDescription') })
}

const DealersPage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, tc] = await Promise.all([getTranslations('DealersPage'), getTranslations('Breadcrumbs')])
  let dealers: Dealer[] = []

  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({ collection: 'dealers', limit: 100, locale })
    dealers = docs as Dealer[]
  } catch {
    // Payload/database not configured yet.
  }

  const useFallback = dealers.length === 0

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(locale, tc('home'), [{ name: tc('dealers'), path: '/dealers' }])} />
      <Preloader />
      <Header />
      <main className="tw:relative tw:isolate tw:overflow-hidden tw:bg-surface tw:py-20">
        <SectionBackdrop src="/images/auto/gallery-4.webp" variant="soft" base="surface" />
        <div className="tw:relative tw:z-10 tw:mx-auto tw:max-w-6xl tw:px-6">
          <h1 className="tw:text-4xl tw:font-bold tw:text-brand-ink tw:md:text-5xl">{t('title')}</h1>
          <p className="tw:mt-2 tw:text-brand-ink/60">{t('intro')}</p>
          <div className="tw:mt-10">
            {useFallback ? (
              <>
                <FallbackDealerCards locale={locale} />
                <p className="tw:mt-6 tw:text-sm tw:text-brand-ink/60">{t('networkSoon')}</p>
              </>
            ) : (
              <DealerLocator dealers={dealers} />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default DealersPage
