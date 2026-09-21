import type { Metadata } from 'next'
import Preloader from '@/components/animations/LazyPreloader'
import Header from '@/components/vehicle/Header'
import Footer from '@/components/vehicle/Footer'
import VehicleCatalogGrid from '@/components/vehicle/VehicleCatalogGrid'
import type { VehicleCardData } from '@/components/vehicle/VehicleCard'
import { getPayloadClient } from '@/lib/payload'
import { getPageMetadata } from '@/lib/pageSeo'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('vehicles', {
    title: 'Our Vehicles',
    description: 'Browse Neptune passenger and cargo three-wheelers by category and fuel type.',
  })
}

const VehiclesPage = async () => {
  let vehicles: VehicleCardData[] = []

  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({ collection: 'vehicles', limit: 50 })
    vehicles = docs as VehicleCardData[]
  } catch {
    // Payload/database not configured yet.
  }

  return (
    <>
      <Preloader />
      <Header />
      <main className="tw:bg-surface tw:py-20">
        <div className="tw:mx-auto tw:max-w-6xl tw:px-6">
          <h1 className="tw:text-4xl tw:font-bold tw:text-white">Our Vehicles</h1>
          <p className="tw:mt-2 tw:text-white/60">
            Passenger and cargo three-wheelers built for the road ahead.
          </p>
          <div className="tw:mt-10">
            {vehicles.length === 0 ? (
              <p className="tw:text-white/50">Add vehicles in /admin to populate this catalog.</p>
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
