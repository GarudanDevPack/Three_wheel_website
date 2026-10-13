import { getTranslations } from 'next-intl/server'
import Preloader from '@/components/animations/LazyPreloader'
import Header from '@/components/vehicle/Header'
import Footer from '@/components/vehicle/Footer'
import VehicleCard from '@/components/vehicle/VehicleCard'
import { Link } from '@/i18n/navigation'
import { availableModels, toVehicleCard, type CatalogModel } from '@/lib/catalog'

/**
 * "Coming soon" page for a model that is not on sale yet. It is noindex (see the route's metadata)
 * and only states what the catalog already says: no price, specs or photos are invented.
 */
const UpcomingModel = async ({ model }: { model: CatalogModel }) => {
  const t = await getTranslations('UpcomingModel')

  return (
    <>
      <Preloader />
      <Header />
      <main className="tw:bg-surface">
        <section className="tw:mx-auto tw:max-w-4xl tw:px-6 tw:py-20 tw:text-center">
          <Link href="/vehicles" className="tw:text-sm tw:font-semibold tw:text-brand-blue">
            ← {t('allVehicles')}
          </Link>
          <p className="tw:mt-8">
            <span className="tw:rounded-full tw:bg-brand-blue/10 tw:px-4 tw:py-1.5 tw:text-sm tw:font-bold tw:text-brand-blue">
              {t('comingSoon')}
            </span>
          </p>
          <h1 className="tw:mt-6 tw:text-4xl tw:font-bold tw:text-brand-ink tw:md:text-5xl">{model.seo.h1}</h1>
          <p className="tw:mx-auto tw:mt-5 tw:max-w-2xl tw:text-lg tw:text-brand-ink/70">{model.seo.intro}</p>
          <p className="tw:mx-auto tw:mt-3 tw:max-w-2xl tw:text-brand-ink/60">{model.seo.bestFor}</p>
          <p className="tw:mx-auto tw:mt-3 tw:max-w-2xl tw:text-sm tw:text-brand-ink/50">{t('note')}</p>
          <Link
            href="/contact#enquire"
            className="tw:mt-8 tw:inline-flex tw:rounded-full tw:bg-brand-blue tw:px-7 tw:py-3 tw:text-sm tw:font-semibold tw:text-white tw:transition tw:hover:bg-brand-blue-light"
          >
            {t('cta')}
          </Link>
        </section>

        <section aria-labelledby="available-now" className="tw:bg-surface-raised tw:py-16">
          <div className="tw:mx-auto tw:max-w-6xl tw:px-6">
            <h2 id="available-now" className="tw:text-2xl tw:font-bold tw:text-brand-ink">
              {t('availableNow')}
            </h2>
            <div className="tw:mt-8 tw:grid tw:gap-6 tw:sm:grid-cols-2">
              {availableModels.map((available) => (
                <VehicleCard key={available.slug} vehicle={toVehicleCard(available)} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default UpcomingModel
