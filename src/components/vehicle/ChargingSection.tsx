import { getPayloadClient } from '@/lib/payload'
import ChargingStats from '@/components/animations/LazyChargingStats'
import ChargingBanner from '@/components/animations/LazyChargingBanner'
import SectionBackdrop from '@/components/ui/SectionBackdrop'

type ChargingValues = {
  homeChargerTime: string
  acCommercialChargerTime: string
  fastChargerTime: string
  rangePerCharge: string
}

type CmsCharging = {
  [K in keyof ChargingValues]?: string | null
}

const defaultCharging: ChargingValues = {
  homeChargerTime: '5 hrs',
  acCommercialChargerTime: '3 hrs',
  fastChargerTime: '1 hr',
  rangePerCharge: '120 km',
}

const ChargingSection = async () => {
  let charging: ChargingValues = defaultCharging

  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({ collection: 'vehicles', limit: 1 })
    const variants = docs[0]?.variants as
      | Array<{ fuelType?: string | null; charging?: CmsCharging | null }>
      | undefined
    const electricCharging = variants?.find((v) => v.fuelType === 'Electric')?.charging

    if (electricCharging) {
      charging = {
        homeChargerTime: electricCharging.homeChargerTime || defaultCharging.homeChargerTime,
        acCommercialChargerTime:
          electricCharging.acCommercialChargerTime || defaultCharging.acCommercialChargerTime,
        fastChargerTime: electricCharging.fastChargerTime || defaultCharging.fastChargerTime,
        rangePerCharge: electricCharging.rangePerCharge || defaultCharging.rangePerCharge,
      }
    }
  } catch {
    // Payload/database not configured yet — fall back to placeholder charging stats.
  }

  const stats = [
    { label: 'Using home charger for full charge', value: charging.homeChargerTime },
    { label: 'Using AC commercial charger for full charge', value: charging.acCommercialChargerTime },
    { label: 'Using fast charger for full charge', value: charging.fastChargerTime },
  ]

  return (
    <section id="charging" className="tw:relative tw:isolate tw:overflow-hidden tw:bg-surface tw:py-20 tw:md:py-28">
      <SectionBackdrop
        src="/images/auto/blue-360-side-a.jpg"
        variant="strong"
        base="surface"
        position="62% 60%"
      />
      <div className="tw:mx-auto tw:grid tw:max-w-6xl tw:items-center tw:gap-12 tw:px-6 tw:md:grid-cols-2">
        <div>
          <h2 className="tw:text-3xl tw:font-bold tw:text-white">Charging</h2>
          <p className="tw:mt-4 tw:max-w-md tw:text-white/70">
            Recharge with confidence. Say goodbye to range anxiety with fast, flexible charging
            options that fit your day.
          </p>
          <ChargingStats stats={stats} />
        </div>
        <ChargingBanner rangeLabel={charging.rangePerCharge} />
      </div>
    </section>
  )
}

export default ChargingSection
