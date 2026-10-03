'use client'

import { useTranslations } from 'next-intl'
import { trackEvent } from '@/lib/analytics'

const toWhatsAppHref = (phone: string) => {
  const digits = phone.replace(/\D/g, '').replace(/^0/, '')
  return `https://wa.me/94${digits}`
}

const WhatsAppButton = ({ phone }: { phone: string }) => {
  const t = useTranslations('WhatsApp')

  return (
    <a
      href={toWhatsAppHref(phone)}
      target="_blank"
      rel="noreferrer"
      aria-label={t('label')}
      onClick={() => trackEvent('whatsapp_click')}
      className="tw:fixed tw:bottom-6 tw:left-6 tw:z-[70] tw:flex tw:h-14 tw:w-14 tw:items-center tw:justify-center tw:rounded-full tw:bg-[#25D366] tw:text-white tw:shadow-xl tw:transition tw:hover:brightness-105"
    >
      <svg viewBox="0 0 24 24" className="tw:h-7 tw:w-7" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.47 1.33 4.98L2 22l5.2-1.36a9.9 9.9 0 0 0 4.84 1.23h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2zm0 18.2h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.1.81.83-3.02-.2-.31a8.23 8.23 0 0 1-1.26-4.39c0-4.55 3.7-8.25 8.25-8.25 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.24-8.26 8.24zm4.52-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.4-.12-.56.13-.17.25-.65.81-.8.97-.14.17-.3.19-.55.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.3.37-.44.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08s.9 2.41 1.02 2.58c.12.17 1.76 2.7 4.27 3.78.6.26 1.06.41 1.43.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.1-.23-.16-.48-.28z" />
      </svg>
    </a>
  )
}

export default WhatsAppButton
