import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import DealersGrid from '../animations/LazyDealersGrid'

type Dealer = { name: string; city?: string; address?: string; phone?: string }

const defaultDealers: Dealer[] = [
  {
    name: 'Add your dealers in /admin',
    city: 'Sample City',
    address: 'Dealer address goes here',
    phone: '+91 00000 00000',
  },
]

const Dealers = async () => {
  let dealers = defaultDealers

  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({ collection: 'dealers', limit: 3 })
    if (docs.length) dealers = docs as unknown as Dealer[]
  } catch {
    // Payload/database not configured yet — fall back to placeholder dealer.
  }

  return (
    <section id="dealers" className="tw:bg-surface-raised tw:py-20">
      <div className="tw:mx-auto tw:max-w-6xl tw:px-6">
        <div className="tw:flex tw:items-end tw:justify-between">
          <h2 className="tw:text-3xl tw:font-bold tw:text-white">Find a dealer</h2>
          <Link href="/dealers" className="tw:text-sm tw:font-semibold tw:text-brand-blue-light">
            See all dealers →
          </Link>
        </div>
        <DealersGrid dealers={dealers} />
      </div>
    </section>
  )
}

export default Dealers
