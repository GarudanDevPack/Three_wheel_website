import { getPayloadClient } from '@/lib/payload'
import ChargingRoute from '@/components/animations/LazyChargingRoute'

type Charging = {
  homeChargerTime?: string | null
  acCommercialChargerTime?: string | null
  fastChargerTime?: string | null
  rangePerCharge?: string | null
}

const defaultCharging: Required<Charging> = {
  homeChargerTime: '5 hrs',
  acCommercialChargerTime: '3 hrs',
  fastChargerTime: '1 hr',
  rangePerCharge: '120 km',
}

const ChargingSection = async () => {
  let charging: Charging = defaultCharging

  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({ collection: 'vehicles', limit: 1 })
    const variants = docs[0]?.variants as
      | Array<{ fuelType?: string | null; charging?: Charging | null }>
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
    <section id="charging" className="tw:bg-surface tw:py-20">
      <div className="tw:mx-auto tw:grid tw:max-w-6xl tw:items-center tw:gap-10 tw:px-6 tw:md:grid-cols-2">
        <div>
          <h2 className="tw:text-3xl tw:font-bold tw:text-white">Charging</h2>
          <p className="tw:mt-4 tw:max-w-md tw:text-white/70">
            Recharge with confidence. Say goodbye to range anxiety with fast, flexible charging
            options that fit your day.
          </p>
          <div className="tw:mt-8 tw:grid tw:grid-cols-3 tw:gap-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="tw:text-2xl tw:font-bold tw:text-white">{stat.value}</p>
                <p className="tw:mt-1 tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wide tw:text-white/50">
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
