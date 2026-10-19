'use client'

import { useEffect, useState } from 'react'
import { GoogleAnalytics } from '@next/third-parties/google'
import { analyticsEnabled, CONSENT_CHANGE_EVENT, readConsent, type Consent } from '@/lib/analytics'

/**
 * GA4 via the official Next.js component (loads after hydration, never render-blocking).
 * Rendered only in production, with a measurement ID, after the visitor accepts cookies.
 * /admin uses its own (payload) layout, so GA never loads there.
 */
const Analytics = ({ measurementId }: { measurementId?: string }) => {
  const [consent, setConsent] = useState<Consent | null>(null)
  const [idle, setIdle] = useState(false)

  useEffect(() => {
    setConsent(readConsent())
    const onChange = (event: Event) => setConsent((event as CustomEvent<Consent>).detail)
    window.addEventListener(CONSENT_CHANGE_EVENT, onChange)
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange)
  }, [])

  // Mount GA only once the page has loaded and the main thread is idle, so gtag.js never competes
  // with hydration or the first interactions. Events fired earlier wait in trackEvent's queue.
  useEffect(() => {
    let idleId: number | undefined
    let timer: ReturnType<typeof setTimeout> | undefined
    const schedule = () => {
      if ('requestIdleCallback' in window) idleId = window.requestIdleCallback(() => setIdle(true), { timeout: 3000 })
      else timer = setTimeout(() => setIdle(true), 1500)
    }
    if (document.readyState === 'complete') schedule()
    else window.addEventListener('load', schedule, { once: true })
    return () => {
      window.removeEventListener('load', schedule)
      if (idleId !== undefined) window.cancelIdleCallback(idleId)
      if (timer) clearTimeout(timer)
    }
  }, [])

  if (!analyticsEnabled || !measurementId || consent !== 'granted' || !idle) return null

  return <GoogleAnalytics gaId={measurementId} />
}

export default Analytics
