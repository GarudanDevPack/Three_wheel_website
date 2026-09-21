import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import VehicleCard, { type VehicleCardData } from './VehicleCard'

const FeaturedModels = async () => {
  let vehicles: VehicleCardData[] = []

  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({ collection: 'vehicles', limit: 4 })
    vehicles = docs as VehicleCardData[]
  } catch {
    // Payload/database not configured yet.
  }

  if (!vehicles.length) return null

  return (
    <section className="tw:bg-white tw:py-20">
      <div className="tw:mx-auto tw:max-w-6xl tw:px-6">
        <div className="tw:flex tw:items-end tw:justify-between">
          <h2 className="tw:text-3xl tw:font-bold tw:text-brand-ink">Featured models</h2>
          <Link href="/vehicles" className="tw:text-sm tw:font-semibold tw:text-brand-blue-light">
            View all →
          </Link>
        </div>
        <div className="tw:mt-10 tw:grid tw:gap-8 tw:sm:grid-cols-2 tw:lg:grid-cols-4">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedModels
