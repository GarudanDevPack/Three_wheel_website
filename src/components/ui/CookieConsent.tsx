'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { OPEN_CONSENT_EVENT, readConsent, writeConsent, type Consent } from '@/lib/analytics'

type CookieConsentProps = {
  message?: string
  acceptLabel?: string
  declineLabel?: string
}

const CookieConsent = ({ message, acceptLabel, declineLabel }: CookieConsentProps) => {
  const t = useTranslations('Cookies')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!readConsent()) setVisible(true)
    const reopen = () => setVisible(true)
    window.addEventListener(OPEN_CONSENT_EVENT, reopen)
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen)
  }, [])

  const choose = (value: Consent) => {
    writeConsent(value)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t('title')}
      className="tw:fixed tw:inset-x-4 tw:bottom-24 tw:z-[85] tw:mx-auto tw:max-w-xl tw:rounded-2xl tw:border tw:border-brand-ink/10 tw:bg-surface tw:p-5 tw:shadow-2xl tw:sm:bottom-6"
    >
      <p className="tw:text-sm tw:font-semibold tw:text-brand-ink">{t('title')}</p>
      <p className="tw:mt-1.5 tw:text-sm tw:leading-relaxed tw:text-brand-ink/70">
        {message || t('message')}{' '}
        <Link href="/privacy-policy" className="tw:font-semibold tw:text-brand-blue tw:underline">
          {t('learnMore')}
        </Link>
      </p>
      <div className="tw:mt-4 tw:flex tw:flex-wrap tw:justify-end tw:gap-2">
        <button
          type="button"
          onClick={() => choose('denied')}
          className="tw:cursor-pointer tw:rounded-full tw:border tw:border-brand-ink/20 tw:bg-transparent tw:px-5 tw:py-2 tw:text-sm tw:font-semibold tw:text-brand-ink tw:transition tw:hover:bg-surface-raised"
        >
          {declineLabel || t('decline')}
        </button>
        <button
          type="button"
          onClick={() => choose('granted')}
          className="tw:cursor-pointer tw:rounded-full tw:border-0 tw:bg-brand-blue tw:px-5 tw:py-2 tw:text-sm tw:font-semibold tw:text-white tw:transition tw:hover:bg-brand-blue-light"
        >
          {acceptLabel || t('accept')}
        </button>
      </div>
    </div>
  )
}

export default CookieConsent
