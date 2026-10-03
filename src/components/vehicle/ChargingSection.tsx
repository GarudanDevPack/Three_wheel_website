import { getLocale, getTranslations } from 'next-intl/server'
import { getPayloadClient } from '@/lib/payload'
import type { AppLocale } from '@/i18n/routing'
import ChargingRoute from '@/components/animations/LazyChargingRoute'
import TopographicBackdrop from '@/components/ui/TopographicBackdrop'
import SectionVideoBackdrop from '@/components/ui/SectionVideoBackdrop'

type Charging = {
  chargerRating?: string | null
  chargingTime?: string | null
  rangePerCharge?: string | null
}

const defaultCharging: Required<Charging> = {
  chargerRating: '2kW / 30Ah off-board',
  chargingTime: '8 hrs (20% → 100%)',
  rangePerCharge: '300 km',
}

const ChargingSection = async () => {
  const locale = (await getLocale()) as AppLocale
  const t = await getTranslations('Charging')
  let charging: Charging = defaultCharging

  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'vehicles',
      where: { modelRange: { equals: '300km' } },
      limit: 1,
      locale,
    })
    const variants = docs[0]?.variants as
      | Array<{ fuelType?: string | null; charging?: Charging | null }>
      | undefined
    const electricCharging = variants?.find((v) => v.fuelType === 'Electric')?.charging

    if (electricCharging) {
      charging = {
        chargerRating: electricCharging.chargerRating || defaultCharging.chargerRating,
        chargingTime: electricCharging.chargingTime || defaultCharging.chargingTime,
        rangePerCharge: electricCharging.rangePerCharge || defaultCharging.rangePerCharge,
      }
    }
  } catch {
    // Payload/database not configured yet — fall back to placeholder charging stats.
  }

  const stats = [
    { label: t('charger'), value: charging.chargerRating },
    { label: t('chargingTime'), value: charging.chargingTime },
  ]

  return (
    <section id="charging" className="tw:relative tw:isolate tw:overflow-hidden tw:bg-surface tw:py-20">
      <SectionVideoBackdrop src="/videos/charging-backdrop.mp4" variant="soft" base="surface" />
      <TopographicBackdrop />
      <div className="tw:relative tw:z-10 tw:mx-auto tw:grid tw:max-w-6xl tw:items-center tw:gap-10 tw:px-6 tw:md:grid-cols-2">
        <div>
          <h2 className="tw:text-3xl tw:font-bold tw:text-brand-ink">{t('title')}</h2>
          <p className="tw:mt-4 tw:max-w-md tw:text-brand-ink/70">{t('intro')}</p>
          <div className="tw:mt-8 tw:grid tw:grid-cols-2 tw:gap-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="tw:text-2xl tw:font-bold tw:text-brand-ink">{stat.value}</p>
                <p className="tw:mt-1 tw:text-xs tw:font-semibold tw:text-brand-ink/50">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
        <ChargingRoute rangeLabel={charging.rangePerCharge!} />
      </div>
    </section>
  )
}

export default ChargingSection
