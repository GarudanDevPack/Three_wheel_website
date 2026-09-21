import { getPayloadClient } from '@/lib/payload'
import VehicleCard, { type VehicleCardData } from './VehicleCard'

type RelatedVehiclesProps = {
  currentId: string
  category?: string | null
}

const RelatedVehicles = async ({ currentId, category }: RelatedVehiclesProps) => {
  let vehicles: VehicleCardData[] = []

  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'vehicles',
      where: category ? { category: { equals: category } } : {},
      limit: 4,
    })
    vehicles = (docs as VehicleCardData[]).filter((vehicle) => vehicle.id !== currentId).slice(0, 3)
  } catch {
    // Payload/database not configured yet.
  }

  if (!vehicles.length) return null

  return (
    <section className="tw:bg-gray-50 tw:py-20">
      <div className="tw:mx-auto tw:max-w-6xl tw:px-6">
        <h2 className="tw:text-3xl tw:font-bold tw:text-brand-ink">You may also like</h2>
        <div className="tw:mt-10 tw:grid tw:gap-8 tw:sm:grid-cols-2 tw:lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default RelatedVehicles
