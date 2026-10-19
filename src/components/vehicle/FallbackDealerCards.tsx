import { getTranslations } from 'next-intl/server'
import type { AppLocale } from '@/i18n/routing'
import { getFallbackDealers } from '@/lib/dealers'
import { getSiteSettings } from '@/lib/siteSettings'

/** Head office + Jaffna dealer cards, shown wherever dealers are listed until the admin adds them. */
const FallbackDealerCards = async ({ locale }: { locale: AppLocale }) => {
  const [settings, t, tDealers] = await Promise.all([
    getSiteSettings(locale),
    getTranslations('DealersPage'),
    getTranslations('Dealers'),
  ])

  return (
    <div className="tw:grid tw:gap-6 tw:md:grid-cols-2">
      {getFallbackDealers(settings, { headOffice: t('headOffice'), jaffna: tDealers('jaffnaDealer') }).map((dealer) => (
        <div key={dealer.name} data-track-location="dealer" data-track-dealer={dealer.name} className="tw:rounded-2xl tw:border tw:border-brand-ink/10 tw:bg-surface-raised tw:p-6">
          <p className="tw:text-lg tw:font-semibold tw:text-brand-ink">{dealer.name}</p>
          <p className="tw:mt-2 tw:text-sm tw:text-brand-ink/60">{dealer.address}</p>
          <div className="tw:mt-4 tw:flex tw:flex-wrap tw:gap-x-6 tw:gap-y-2">
            {[dealer.phone, dealer.phone2]
              .filter((phone): phone is string => Boolean(phone))
              .map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="tw:inline-flex tw:text-sm tw:font-semibold tw:text-brand-blue"
                >
                  {phone}
                </a>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default FallbackDealerCards
