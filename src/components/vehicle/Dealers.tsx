import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { getPayloadClient } from '@/lib/payload'
import { getSiteSettings } from '@/lib/siteSettings'
import { getFallbackDealers } from '@/lib/dealers'
import DealersGrid from '../animations/LazyDealersGrid'
import SectionVideoBackdrop from '@/components/ui/SectionVideoBackdrop'

type Dealer = { name: string; city?: string; address?: string; phone?: string; phone2?: string }

const Dealers = async () => {
  const locale = (await getLocale()) as AppLocale
  const t = await getTranslations('Dealers')
  const settings = await getSiteSettings(locale)
  // Until dealers are added in the admin, show the head office and the Jaffna dealer.
  let dealers: Dealer[] = getFallbackDealers(settings, { headOffice: t('headOffice'), jaffna: t('jaffnaDealer') })

  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({ collection: 'dealers', limit: 3, locale })
    if (docs.length) dealers = docs as unknown as Dealer[]
  } catch {
    // Payload/database not configured yet — fall back to placeholder dealer.
  }

  return (
    <section id="dealers" className="tw:relative tw:isolate tw:overflow-hidden tw:bg-surface-raised tw:py-20">
      <SectionVideoBackdrop
        src="/videos/vehicles-driving.mp4"
        poster="/images/auto/night-ride.jpg"
        variant="soft"
        base="surface-raised"
        lazy
      />
      {/* Studio glow behind the floating Neptune so the cut-out stays crisp over the moving background. */}
      <div
        aria-hidden="true"
        className="tw:pointer-events-none tw:absolute tw:inset-0 tw:bg-[radial-gradient(ellipse_at_50%_75%,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.55)_30%,transparent_65%)] tw:md:bg-[radial-gradient(ellipse_at_72%_55%,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.55)_30%,transparent_65%)]"
      />
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
