import type { Metadata } from 'next'
import Preloader from '@/components/animations/LazyPreloader'
import Header from '@/components/vehicle/Header'
import Footer from '@/components/vehicle/Footer'
import DealerLocator, { type Dealer } from '@/components/ui/DealerLocator'
import { getPayloadClient } from '@/lib/payload'
import { getPageMetadata } from '@/lib/pageSeo'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('dealers', {
    title: 'Find a Neptune Dealer',
    description: 'Locate your nearest Neptune dealer for a test drive or to place an order.',
  })
}

const DealersPage = async () => {
  let dealers: Dealer[] = []

  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({ collection: 'dealers', limit: 100 })
    dealers = docs as Dealer[]
  } catch {
    // Payload/database not configured yet.
  }

  return (
    <>
      <Preloader />
      <Header />
      <main className="tw:bg-white tw:py-20">
        <div className="tw:mx-auto tw:max-w-6xl tw:px-6">
          <h1 className="tw:text-4xl tw:font-bold tw:text-brand-ink">Find a dealer</h1>
          <p className="tw:mt-2 tw:text-gray-600">
            Visit your nearest Neptune dealer for a test drive or to place an order.
          </p>
          <div className="tw:mt-10">
            {dealers.length === 0 ? (
              <p className="tw:text-gray-500">Add dealers in /admin to populate this page.</p>
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
