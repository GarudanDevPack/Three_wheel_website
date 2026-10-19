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
import { formatLkr } from '@/lib/format'
import { availableModels, catalog, toVehicleCard } from '@/lib/catalog'
import FaqAccordion from '@/components/ui/FaqAccordion'

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
    // Payload/database not configured yet — show the client-verified catalog.
    vehicles = availableModels.map(toVehicleCard)
  }

  // Visible buying questions only; the FAQPage schema lives on /faq (one canonical FAQ page).
  const tFaq = await getTranslations('HomeFaq')
  const faqs = (tFaq.raw('top') as Array<{ question: string; answer: string }>).slice(0, 4)
  const capacity = (model: (typeof catalog)[number]) =>
    model.keyFacts.find((fact) => fact.label === 'Seats' || fact.label === 'Payload')?.value ?? '—'
  const factValue = (model: (typeof catalog)[number], label: string) =>
    model.keyFacts.find((fact) => fact.label === label)?.value ?? '—'

  return (
    <>
      <Preloader />
      <Header />
      <main className="tw:relative tw:isolate tw:overflow-hidden tw:bg-surface tw:py-20">
        <SectionBackdrop src="/images/auto/neptune-blue-2.webp" variant="soft" base="surface" />
        <div className="tw:relative tw:z-10 tw:mx-auto tw:max-w-6xl tw:px-6">
          <h1 className="tw:text-4xl tw:font-bold tw:text-brand-ink tw:md:text-5xl">{t('title')}</h1>
          <p className="tw:mt-4 tw:max-w-3xl tw:leading-relaxed tw:text-brand-ink/70">{t('intro')}</p>
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

          <section aria-labelledby="compare-models" className="tw:mt-16">
            <h2 id="compare-models" className="tw:text-2xl tw:font-bold tw:text-brand-ink">{t('compareTitle')}</h2>
            <div className="tw:mt-6 tw:overflow-x-auto tw:rounded-2xl tw:border tw:border-brand-ink/10 tw:bg-surface-raised">
              <table className="tw:w-full tw:min-w-[720px] tw:text-left tw:text-sm">
                <thead className="tw:bg-brand-ink tw:text-white">
                  <tr>
                    {['compareModel', 'compareRange', 'compareBattery', 'compareCharge', 'compareCapacity', 'compareWarranty', 'comparePrice'].map((key) => (
                      <th key={key} scope="col" className="tw:px-4 tw:py-3 tw:font-semibold">{t(key)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {catalog.map((model) => (
                    <tr key={model.slug} className="tw:border-t tw:border-brand-ink/10">
                      <th scope="row" className="tw:px-4 tw:py-3 tw:font-semibold tw:text-brand-ink">
                        {model.status === 'Available' ? (
                          <Link href={`/vehicles/${model.slug}`} className="tw:text-brand-blue tw:underline-offset-2 tw:hover:underline">
                            {model.name}
                          </Link>
                        ) : (
                          // Upcoming: no page until there are photos, price and specs.
                          model.name
                        )}
                      </th>
                      {model.status === 'Available' ? (
                        <>
                          <td className="tw:px-4 tw:py-3 tw:text-brand-ink/80">{model.rangeNote}</td>
                          <td className="tw:px-4 tw:py-3 tw:text-brand-ink/80">{factValue(model, 'Battery')}</td>
                          <td className="tw:px-4 tw:py-3 tw:text-brand-ink/80">{factValue(model, 'Charging')}</td>
                          <td className="tw:px-4 tw:py-3 tw:text-brand-ink/80">{capacity(model)}</td>
                          <td className="tw:px-4 tw:py-3 tw:text-brand-ink/80">{model.warranty ? `${model.warranty.vehicle}; battery ${model.warranty.battery}` : '—'}</td>
                          <td className="tw:px-4 tw:py-3 tw:font-semibold tw:text-brand-ink">{model.price ? formatLkr(model.price, locale) : '—'}</td>
                        </>
                      ) : (
                        <td colSpan={6} className="tw:px-4 tw:py-3">
                          <span className="tw:rounded-full tw:bg-brand-blue/10 tw:px-3 tw:py-1 tw:text-xs tw:font-bold tw:text-brand-blue">
                            {t('comingSoon')}
                          </span>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section aria-labelledby="catalog-faq" className="tw:mt-16 tw:max-w-3xl">
            <h2 id="catalog-faq" className="tw:text-2xl tw:font-bold tw:text-brand-ink">{tFaq('title')}</h2>
            <div className="tw:mt-6">
              <FaqAccordion items={faqs} />
            </div>
            <Link href="/faq" className="tw:mt-5 tw:inline-flex tw:text-sm tw:font-semibold tw:text-brand-blue">
              {tFaq('seeAll')} →
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default VehiclesPage
