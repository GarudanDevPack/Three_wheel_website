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

/** No-ops unless GA has been loaded (i.e. an ID is configured and the visitor accepted cookies). */
export const trackEvent = (name: string, params: Record<string, unknown> = {}) => {
  window.gtag?.('event', name, params)
}
