'use client'

import { useTranslations } from 'next-intl'
import { trackEvent } from '@/lib/analytics'

/** Floating YouTube link — top of the stack above the Facebook and WhatsApp buttons. */
const YouTubeButton = ({ url }: { url: string }) => {
  const t = useTranslations('YouTube')

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label={t('label')}
      onClick={() => trackEvent('youtube_click')}
      className="tw:fixed tw:bottom-[10.5rem] tw:left-6 tw:z-[70] tw:flex tw:h-14 tw:w-14 tw:items-center tw:justify-center tw:rounded-full tw:bg-[#FF0000] tw:text-white tw:shadow-xl tw:transition tw:hover:brightness-110"
    >
      <svg viewBox="0 0 24 24" className="tw:h-7 tw:w-7" fill="currentColor" aria-hidden="true">
        <path d="M9.5 8.2v7.6l6.4-3.8-6.4-3.8z" />
      </svg>
    </a>
  )
}

export default YouTubeButton
