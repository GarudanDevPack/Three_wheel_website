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
import { getSiteSettings } from '@/lib/siteSettings'

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
  const t = await getTranslations('DealersPage')
  let dealers: Dealer[] = []

  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({ collection: 'dealers', limit: 100, locale })
    dealers = docs as Dealer[]
  } catch {
    // Payload/database not configured yet.
  }

  const settings = dealers.length === 0 ? await getSiteSettings(locale) : null

  return (
    <>
      <Preloader />
      <Header />
      <main className="tw:relative tw:isolate tw:overflow-hidden tw:bg-surface tw:py-20">
        <SectionBackdrop src="/images/auto/gallery-4.png" variant="soft" base="surface" />
        <div className="tw:relative tw:z-10 tw:mx-auto tw:max-w-6xl tw:px-6">
          <h1 className="tw:text-4xl tw:font-bold tw:text-brand-ink tw:md:text-5xl">{t('title')}</h1>
          <p className="tw:mt-2 tw:text-brand-ink/60">{t('intro')}</p>
          <div className="tw:mt-10">
            {settings ? (
              <div className="tw:max-w-xl tw:rounded-2xl tw:border tw:border-brand-ink/10 tw:bg-surface-raised tw:p-6">
                <p className="tw:text-lg tw:font-semibold tw:text-brand-ink">{t('headOffice')}</p>
                <p className="tw:mt-2 tw:text-sm tw:text-brand-ink/60">{settings.address}</p>
                <a
                  href={`tel:${settings.phone.replace(/\s/g, '')}`}
                  className="tw:mt-4 tw:inline-flex tw:text-sm tw:font-semibold tw:text-brand-blue"
                >
                  {settings.phone}
                </a>
                <p className="tw:mt-4 tw:text-sm tw:text-brand-ink/60">{t('networkSoon')}</p>
              </div>
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
