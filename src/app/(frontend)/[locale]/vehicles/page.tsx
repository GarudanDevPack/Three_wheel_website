import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Preloader from '@/components/animations/LazyPreloader'
import Header from '@/components/vehicle/Header'
import Footer from '@/components/vehicle/Footer'
import VehicleCatalogGrid from '@/components/vehicle/VehicleCatalogGrid'
import type { VehicleCardData } from '@/components/vehicle/VehicleCard'
import SectionBackdrop from '@/components/ui/SectionBackdrop'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { getPayloadClient } from '@/lib/payload'
import { getPageMetadata } from '@/lib/pageSeo'

export const revalidate = 300

type PageProps = { params: Promise<{ locale: AppLocale }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Catalog' })
  return getPageMetadata('vehicles', locale, { title: t('metaTitle'), description: t('metaDescription') })
}

const VehiclesPage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Catalog')
  let vehicles: VehicleCardData[] = []

  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({ collection: 'vehicles', limit: 50, locale })
    vehicles = docs as unknown as VehicleCardData[]
  } catch {
    // Payload/database not configured yet.
  }

  return (
    <>
      <Preloader />
      <Header />
      <main className="tw:relative tw:isolate tw:overflow-hidden tw:bg-surface tw:py-20">
        <SectionBackdrop src="/images/auto/neptune-blue-2.png" variant="soft" base="surface" />
        <div className="tw:relative tw:z-10 tw:mx-auto tw:max-w-6xl tw:px-6">
          <h1 className="tw:text-4xl tw:font-bold tw:text-brand-ink tw:md:text-5xl">{t('title')}</h1>
          <p className="tw:mt-2 tw:text-brand-ink/60">{t('intro')}</p>
          <div className="tw:mt-10">
            {vehicles.length === 0 ? (
              <div className="tw:max-w-xl tw:rounded-2xl tw:border tw:border-brand-ink/10 tw:bg-surface-raised tw:p-6">
                <p className="tw:text-brand-ink/70">{t('empty')}</p>
                <Link
                  href="/#compare"
                  className="tw:mt-4 tw:inline-flex tw:rounded-full tw:bg-brand-blue tw:px-5 tw:py-2.5 tw:text-sm tw:font-semibold tw:text-white"
                >
                  {t('compareModels')}
                </Link>
              </div>
            ) : (
              <VehicleCatalogGrid vehicles={vehicles} />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default VehiclesPage
