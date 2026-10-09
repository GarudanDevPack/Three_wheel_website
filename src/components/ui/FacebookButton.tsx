'use client'

import { useTranslations } from 'next-intl'
import { trackEvent } from '@/lib/analytics'

/** Floating Facebook link — sits directly above the WhatsApp button and shares its styling. */
const FacebookButton = ({ url }: { url: string }) => {
  const t = useTranslations('Facebook')

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label={t('label')}
      onClick={() => trackEvent('facebook_click')}
      className="tw:fixed tw:bottom-24 tw:left-6 tw:z-[70] tw:flex tw:h-14 tw:w-14 tw:items-center tw:justify-center tw:rounded-full tw:bg-[#1877F2] tw:text-white tw:shadow-xl tw:transition tw:hover:brightness-110"
    >
      <svg viewBox="0 0 24 24" className="tw:h-7 tw:w-7" fill="currentColor" aria-hidden="true">
        <path d="M13.5 21.9v-7.7h2.6l.4-3h-3V9.3c0-.9.3-1.5 1.5-1.5h1.6V5.1c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6v7.7h3.1z" />
      </svg>
    </a>
  )
}

export default FacebookButton
