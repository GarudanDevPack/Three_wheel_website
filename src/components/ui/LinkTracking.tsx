'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

/**
 * One delegated listener for links rendered by server components (which can't take onClick):
 * every `tel:` link → `call_click`, every PDF → `brochure_download`. No-ops until GA is loaded.
 */
const LinkTracking = () => {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href]')
      if (!(link instanceof HTMLAnchorElement)) return
      const href = link.getAttribute('href') || ''
      if (href.startsWith('tel:')) {
        trackEvent('call_click', { phone: href.slice(4), page: window.location.pathname })
      } else if (/\.pdf($|[?#])/i.test(href)) {
        trackEvent('brochure_download', { file: href.split('/').pop(), page: window.location.pathname })
      }
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])

  return null
}

export default LinkTracking
