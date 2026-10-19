'use client'

import { useEffect } from 'react'
import { trackEvent, type EventParams } from '@/lib/analytics'

/**
 * One delegated listener for every tracked link, including those rendered by server components
 * (which can't take onClick). Where a click happened comes from markup, not handlers:
 *  - `data-track-location` on the link or any ancestor (hero, footer, dealer, sticky, …), else "content"
 *  - `data-track-dealer` on the link or an ancestor (dealer cards)
 *  - `data-track="cta"` on the primary "Book a test drive" links
 * Events: wa.me → whatsapp_click, tel: → call_click, .pdf → brochure_download, CTA → cta_click.
 * No phone numbers or other personal data are sent.
 */
const LinkTracking = () => {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href]')
      if (!(link instanceof HTMLAnchorElement)) return
      const href = link.getAttribute('href') || ''
      const location = link.closest<HTMLElement>('[data-track-location]')?.dataset.trackLocation || 'content'
      const dealer = link.closest<HTMLElement>('[data-track-dealer]')?.dataset.trackDealer
      const base: EventParams = { location, ...(dealer ? { dealer } : {}) }

      if (href.startsWith('tel:')) {
        trackEvent('call_click', base)
      } else if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) {
        trackEvent('whatsapp_click', base)
      } else if (/\.pdf($|[?#])/i.test(href)) {
        trackEvent('brochure_download', { ...base, file: href.split(/[?#]/)[0].split('/').pop() })
      } else if (link.dataset.track === 'cta') {
        const model = new URL(link.href, window.location.href).searchParams.get('model')
        trackEvent('cta_click', { ...base, ...(model ? { model } : {}) })
      }
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])

  return null
}

export default LinkTracking
