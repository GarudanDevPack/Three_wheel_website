'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

const telHref = (phone: string) => `tel:${phone.replace(/\s/g, '')}`
const whatsAppHref = (phone: string) => `https://wa.me/94${phone.replace(/\D/g, '').replace(/^0/, '')}`

/**
 * Phones/tablets only: Call, WhatsApp and the one primary action (Book a test drive), always in reach.
 * Numbers come only from SiteSettings (head-office phone + WhatsApp number); nothing is guessed.
 */
const MobileCtaBar = ({ phone, whatsapp }: { phone: string; whatsapp: string }) => {
  const t = useTranslations('MobileCta')

  return (
    <nav
      aria-label={t('label')}
      data-track-location="mobile_bar"
      className="tw:fixed tw:inset-x-0 tw:bottom-0 tw:z-[75] tw:grid tw:grid-cols-[1fr_1fr_1.6fr] tw:gap-2 tw:border-t tw:border-brand-ink/10 tw:bg-surface/95 tw:px-3 tw:pb-[max(0.75rem,env(safe-area-inset-bottom))] tw:pt-3 tw:shadow-[0_-8px_24px_-16px_rgba(11,14,20,0.35)] tw:backdrop-blur tw:lg:hidden"
    >
      {/* call_click / whatsapp_click / cta_click are recorded by LinkTracking (delegated listener). */}
      <a
        href={telHref(phone)}
        className="tw:flex tw:items-center tw:justify-center tw:gap-1.5 tw:rounded-full tw:border tw:border-brand-ink/15 tw:py-2.5 tw:text-sm tw:font-semibold tw:text-brand-ink"
      >
        <svg viewBox="0 0 24 24" className="tw:h-4 tw:w-4" fill="none" aria-hidden="true">
          <path
            d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.2c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
        {t('call')}
      </a>
      <a
        href={whatsAppHref(whatsapp)}
        target="_blank"
        rel="noopener noreferrer"
        className="tw:flex tw:items-center tw:justify-center tw:gap-1.5 tw:rounded-full tw:bg-[#25D366] tw:py-2.5 tw:text-sm tw:font-semibold tw:text-white"
      >
        WhatsApp
      </a>
      <Link
        href="/contact#enquire"
        data-track="cta"
        className="tw:flex tw:items-center tw:justify-center tw:rounded-full tw:bg-brand-blue tw:py-2.5 tw:text-sm tw:font-semibold tw:text-white"
      >
        {t('testDrive')}
      </Link>
    </nav>
  )
}

export default MobileCtaBar
