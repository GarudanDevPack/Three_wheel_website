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
import { getFallbackDealers } from '@/lib/dealers'

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
  const [t, tDealers] = await Promise.all([getTranslations('DealersPage'), getTranslations('Dealers')])
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
              <>
                <div className="tw:grid tw:gap-6 tw:md:grid-cols-2">
                  {getFallbackDealers(settings, { headOffice: t('headOffice'), jaffna: tDealers('jaffnaDealer') }).map(
                    (dealer) => (
                      <div
                        key={dealer.name}
                        className="tw:rounded-2xl tw:border tw:border-brand-ink/10 tw:bg-surface-raised tw:p-6"
                      >
                        <p className="tw:text-lg tw:font-semibold tw:text-brand-ink">{dealer.name}</p>
                        <p className="tw:mt-2 tw:text-sm tw:text-brand-ink/60">{dealer.address}</p>
                        <div className="tw:mt-4 tw:flex tw:flex-wrap tw:gap-x-6 tw:gap-y-2">
                          {[dealer.phone, dealer.phone2]
                            .filter((phone): phone is string => Boolean(phone))
                            .map((phone) => (
                              <a
                                key={phone}
                                href={`tel:${phone.replace(/\s/g, '')}`}
                                className="tw:inline-flex tw:text-sm tw:font-semibold tw:text-brand-blue"
                              >
                                {phone}
                              </a>
                            ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
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
