export const CONSENT_COOKIE = 'neptune_consent'
export const CONSENT_CHANGE_EVENT = 'neptune-consent-change'
export const OPEN_CONSENT_EVENT = 'neptune-open-consent'

export type Consent = 'granted' | 'denied'

type Gtag = (...args: unknown[]) => void

declare global {
  interface Window {
    gtag?: Gtag
    dataLayer?: unknown[]
  }
}

/** Every GA4 event the site sends (Phase 9). Params never include a visitor's name, phone or message. */
export type AnalyticsEvent =
  | 'test_drive_submit'
  | 'generate_lead'
  | 'whatsapp_click'
  | 'call_click'
  | 'cta_click'
  | 'finance_calc_use'
  | 'brochure_download'
  | 'model_view'
  | 'youtube_click'
  | 'facebook_click'
  | 'assistant_message'

export type EventParams = Record<string, string | number | boolean | undefined>

export const readConsent = (): Consent | null => {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=(granted|denied)`))
  return (match?.[1] as Consent | undefined) ?? null
}

export const writeConsent = (value: Consent) => {
  document.cookie = `${CONSENT_COOKIE}=${value}; max-age=31536000; path=/; samesite=lax`
  window.gtag?.('consent', 'update', { analytics_storage: value })
  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_CHANGE_EVENT, { detail: value }))
}

export const openConsentSettings = () => {
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))
}

/** GA is only ever loaded in production builds (see components/ui/Analytics.tsx). */
export const analyticsEnabled = process.env.NODE_ENV === 'production'

// Events fired before gtag.js has initialised (e.g. model_view on page load) wait here briefly.
const pending: [AnalyticsEvent, EventParams][] = []
let flushTimer: ReturnType<typeof setInterval> | undefined

const send = (name: AnalyticsEvent, params: EventParams) => window.gtag?.('event', name, params)

const scheduleFlush = () => {
  if (flushTimer) return
  let tries = 0
  flushTimer = setInterval(() => {
    tries++
    if (window.gtag) pending.splice(0).forEach(([name, params]) => send(name, params))
    // GA mounts after load + idle (components/ui/Analytics.tsx); allow up to 30 s on slow connections.
    if (window.gtag || tries >= 120) {
      clearInterval(flushTimer)
      flushTimer = undefined
      pending.length = 0
    }
  }, 250)
}

/**
 * Sends a GA4 event with `page_path` and `language` added. Does nothing in development, without
 * cookie consent or without a measurement ID; never throws.
 */
export const trackEvent = (name: AnalyticsEvent, params: EventParams = {}) => {
  try {
    if (!analyticsEnabled || typeof window === 'undefined' || readConsent() !== 'granted') return
    const full: EventParams = {
      page_path: window.location.pathname,
      language: document.documentElement.lang || 'en',
      ...params,
    }
    if (window.gtag) {
      send(name, full)
    } else {
      pending.push([name, full])
      scheduleFlush()
    }
  } catch {
    // Analytics must never break the page.
  }
}
