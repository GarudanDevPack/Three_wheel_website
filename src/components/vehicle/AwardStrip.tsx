import { getLocale, getTranslations } from 'next-intl/server'
import { getPayloadClient } from '@/lib/payload'
import type { AppLocale } from '@/i18n/routing'
import { type Award } from '@/components/animations/AwardBadges'
import AwardBadges from '@/components/animations/LazyAwardBadges'

const AwardStrip = async () => {
  const locale = (await getLocale()) as AppLocale
  const t = await getTranslations('Awards')
  let awards: Award[] = []

  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({ collection: 'vehicles', limit: 20, locale })
    awards = docs.flatMap((doc) => (doc.awards || []) as Award[])
  } catch {
    // Payload/database not configured yet.
  }

  if (!awards.length) return null

  return (
    <section id="award-strip" className="tw:bg-surface-raised tw:py-16">
      <div className="tw:mx-auto tw:max-w-6xl tw:px-6">
        <h2 className="tw:text-center tw:text-sm tw:font-semibold tw:text-brand-ink/50">{t('title')}</h2>
        <AwardBadges awards={awards} />
      </div>
    </section>
  )
}

export default AwardStrip
