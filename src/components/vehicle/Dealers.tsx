import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { getPayloadClient } from '@/lib/payload'
import { getSiteSettings } from '@/lib/siteSettings'
import DealersGrid from '../animations/LazyDealersGrid'
import SectionBackdrop from '@/components/ui/SectionBackdrop'

type Dealer = { name: string; city?: string; address?: string; phone?: string }

const Dealers = async () => {
  const locale = (await getLocale()) as AppLocale
  const t = await getTranslations('Dealers')
  const settings = await getSiteSettings(locale)
  // Until dealers are added in the admin, point visitors at the real head office.
  let dealers: Dealer[] = [{ name: t('headOffice'), address: settings.address, phone: settings.phone }]

  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({ collection: 'dealers', limit: 3, locale })
    if (docs.length) dealers = docs as unknown as Dealer[]
  } catch {
    // Payload/database not configured yet — fall back to placeholder dealer.
  }

  return (
    <section id="dealers" className="tw:relative tw:isolate tw:overflow-hidden tw:bg-surface-raised tw:py-20">
      <SectionBackdrop src="/images/auto/gallery-2.png" variant="soft" base="surface-raised" />
      <div className="tw:relative tw:z-10 tw:mx-auto tw:max-w-6xl tw:px-6">
        <div className="tw:flex tw:items-end tw:justify-between">
          <h2 className="tw:text-3xl tw:font-bold tw:text-brand-ink">{t('title')}</h2>
          <Link href="/dealers" className="tw:text-sm tw:font-semibold tw:text-brand-blue-light">
            {t('seeAll')} →
          </Link>
        </div>
        <DealersGrid dealers={dealers} />
      </div>
    </section>
  )
}

export default Dealers
