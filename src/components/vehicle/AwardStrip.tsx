import { getPayloadClient } from '@/lib/payload'
import { type Award } from '@/components/animations/AwardBadges'
import AwardBadges from '@/components/animations/LazyAwardBadges'

const AwardStrip = async () => {
  let awards: Award[] = []

  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({ collection: 'vehicles', limit: 20 })
    awards = docs.flatMap((doc) => (doc.awards || []) as Award[])
  } catch {
    // Payload/database not configured yet.
  }

  if (!awards.length) return null

  return (
    <section className="tw:bg-surface-raised tw:py-16">
      <div className="tw:mx-auto tw:max-w-6xl tw:px-6">
        <h2 className="tw:text-center tw:text-sm tw:font-semibold tw:uppercase tw:tracking-widest tw:text-white/50">
          Recognized for engineering that works as hard as you do
        </h2>
        <AwardBadges awards={awards} />
      </div>
    </section>
  )
}

export default AwardStrip
