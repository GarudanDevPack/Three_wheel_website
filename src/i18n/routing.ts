import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'si', 'ta'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
})

export type AppLocale = (typeof routing.locales)[number]

export const localeLabels: Record<AppLocale, string> = {
  en: 'EN',
  si: 'සිං',
  ta: 'தமிழ்',
}

export const intlLocale: Record<AppLocale, string> = {
  en: 'en-LK',
  si: 'si-LK',
  ta: 'ta-LK',
}
