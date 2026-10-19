'use client'

import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { routing, type AppLocale } from '@/i18n/routing'
import { CONSENT_CHANGE_EVENT, readConsent } from '@/lib/analytics'

// Written in the language being suggested, so the visitor can read it. UI chrome, not indexed content.
// TODO(review): native-speaker check of the si/ta lines.
const copy: Record<AppLocale, { view: string; dismiss: string }> = {
  en: { view: 'View this page in English', dismiss: 'Dismiss' },
  si: { view: 'මෙම පිටුව සිංහලෙන් බලන්න', dismiss: 'වසන්න' },
  ta: { view: 'இந்தப் பக்கத்தை தமிழில் பார்க்கவும்', dismiss: 'மூடு' },
}

const DISMISS_KEY = 'neptune_lang_suggestion_dismissed'

/** First site language in the browser's preference list (e.g. "si-LK" → "si"), if any. */
const preferredLocale = (): AppLocale | null => {
  for (const tag of navigator.languages ?? [navigator.language]) {
    const base = tag.toLowerCase().split('-')[0] as AppLocale
    if (routing.locales.includes(base)) return base
  }
  return null
}

/**
 * Suggests the visitor's browser language with a dismissible bar and a real link to the same page in
 * that language. Never redirects automatically (by IP or Accept-Language). Waits until the cookie
 * banner has been answered so the two never stack.
 */
const LanguageSuggestion = () => {
  const locale = useLocale() as AppLocale
  const pathname = usePathname()
  const [suggested, setSuggested] = useState<AppLocale | null>(null)

  useEffect(() => {
    const evaluate = () => {
      let dismissed = false
      try {
        dismissed = window.localStorage.getItem(DISMISS_KEY) === '1'
      } catch {
        // Storage blocked (private mode): just show it again next time.
      }
      const preferred = preferredLocale()
      setSuggested(!dismissed && readConsent() && preferred && preferred !== locale ? preferred : null)
    }
    evaluate()
    window.addEventListener(CONSENT_CHANGE_EVENT, evaluate)
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, evaluate)
  }, [locale])

  if (!suggested) return null

  const dismiss = () => {
    try {
      window.localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      // ignore
    }
    setSuggested(null)
  }

  return (
    <div
      role="region"
      aria-label={copy[suggested].view}
      lang={suggested}
      // Phones: just under the sticky header (the bottom corners hold the social and assistant
      // buttons). Larger screens: bottom centre, between them.
      className="tw:fixed tw:inset-x-4 tw:top-20 tw:z-[60] tw:mx-auto tw:flex tw:max-w-sm tw:items-center tw:gap-3 tw:rounded-2xl tw:border tw:border-brand-ink/10 tw:bg-surface tw:px-4 tw:py-3 tw:shadow-card tw:lg:top-auto tw:lg:bottom-6"
    >
      <Link
        href={pathname}
        locale={suggested}
        hrefLang={suggested}
        className="tw:flex-1 tw:text-sm tw:font-semibold tw:text-brand-blue tw:underline-offset-2 tw:hover:underline"
      >
        {copy[suggested].view} →
      </Link>
      <button
        type="button"
        onClick={dismiss}
        aria-label={copy[suggested].dismiss}
        className="tw:flex tw:h-8 tw:w-8 tw:shrink-0 tw:cursor-pointer tw:items-center tw:justify-center tw:rounded-full tw:border-0 tw:bg-brand-ink/5 tw:text-brand-ink/60 tw:hover:text-brand-ink"
      >
        <svg viewBox="0 0 24 24" className="tw:h-3.5 tw:w-3.5" fill="none" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}

export default LanguageSuggestion
