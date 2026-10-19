import { cache } from 'react'
import { getPayloadClient } from './payload'
import type { AppLocale } from '@/i18n/routing'
import { GARUDAN_ZERO_FINANCE } from './catalog'

/** The Garudan interest-free plan, edited in the CMS (SiteSettings → Financing). */
export type InterestFreePlan = {
  /** False when switched off in the CMS or past `validUntil` (see `planActive`). */
  enabled: boolean
  maxLoan: number
  monthly: number
  months: number
  families: number
  /** CMS wording of who qualifies; when empty the site's translated default wording is shown. */
  eligibility?: string
  /** ISO date; the plan hides itself after this day. Unknown today, so not set. */
  validUntil?: string
}

/** One warranty wording; empty fields fall back to the translated Warranty.* messages. */
export type WarrantyText = { vehicle?: string; battery?: string; serviceCondition?: string }

/** True while an offer/plan is live: enabled and not past its end date (checked at render time). */
export const isStillValid = (validUntil?: string | null, now = new Date()) => {
  if (!validUntil) return true
  const end = new Date(validUntil)
  end.setHours(23, 59, 59, 999) // valid through the whole last day
  return now.getTime() <= end.getTime()
}

export type FinancePartner = { name: string; logo?: string | null }

export type SiteSettingsData = {
  address: string
  phone: string
  /** Extra head-office numbers (mobile, hotline), shown after the main phone. */
  otherPhones: string[]
  /** Number behind the floating WhatsApp button (can differ from the head-office phone). */
  whatsapp: string
  email?: string
  businessHours: string
  socialLinks: Array<{ platform?: string | null; url?: string | null }>
  financing: {
    interestRate: number
    downPaymentPercent: number
    maxTenureMonths: number
    disclaimer?: string
    partners: FinancePartner[]
    interestFreePlan: InterestFreePlan
  }
  warranty: WarrantyText
  gaMeasurementId?: string
  cookieConsent: {
    enabled: boolean
    message?: string
    acceptLabel?: string
    declineLabel?: string
  }
}

const fallback: SiteSettingsData = {
  // Head office as printed on the client's posters (keep identical to the Google Business Profile).
  address: 'No 13, Galle Road, Mount Lavinia, Colombo 10379',
  phone: '021 785 6180',
  otherPhones: ['077 396 9427', '077 444 5909'],
  whatsapp: '077 396 9427',
  email: undefined, // TODO: no company email supplied by client yet
  businessHours: 'Open 24 hours',
  // TODO: client to supply the YouTube channel URL.
  socialLinks: [
    { platform: 'Facebook', url: 'https://www.facebook.com/share/g/1F6ezwwqtR/' },
    { platform: 'YouTube', url: 'https://www.youtube.com/' },
  ],
  // Calculator starting points only — visitors adjust them, and the admin sets the real figures.
  financing: {
    interestRate: 15,
    downPaymentPercent: 20,
    maxTenureMonths: 60,
    partners: [],
    // Terms from the client's posters (see GARUDAN_ZERO_FINANCE). No end date has been published.
    interestFreePlan: { enabled: true, ...GARUDAN_ZERO_FINANCE },
  },
  warranty: {},
  gaMeasurementId: undefined,
  cookieConsent: { enabled: true },
}

type SettingsDoc = {
  address?: string | null
  phone?: string | null
  whatsapp?: string | null
  email?: string | null
  businessHours?: string | null
  socialLinks?: SiteSettingsData['socialLinks'] | null
  financing?: {
    interestRate?: number | null
    downPaymentPercent?: number | null
    maxTenureMonths?: number | null
    disclaimer?: string | null
    partners?: Array<{ name: string; logo?: { url?: string | null } | null }> | null
    interestFreePlan?: {
      enabled?: boolean | null
      maxLoan?: number | null
      monthly?: number | null
      months?: number | null
      families?: number | null
      eligibility?: string | null
      validUntil?: string | null
    } | null
  } | null
  warranty?: { vehicle?: string | null; battery?: string | null; serviceCondition?: string | null } | null
  analytics?: { gaMeasurementId?: string | null } | null
  cookieConsent?: {
    enabled?: boolean | null
    message?: string | null
    acceptLabel?: string | null
    declineLabel?: string | null
  } | null
}

export const getSiteSettings = cache(async (locale?: AppLocale): Promise<SiteSettingsData> => {
  try {
    const payload = await getPayloadClient()
    const settings = (await payload.findGlobal({
      slug: 'site-settings',
      locale,
      depth: 1,
    })) as unknown as SettingsDoc

    const financing = settings.financing
    const consent = settings.cookieConsent

    return {
      address: settings.address || fallback.address,
      phone: settings.phone || fallback.phone,
      otherPhones: settings.phone ? [] : fallback.otherPhones,
      whatsapp: settings.whatsapp || fallback.whatsapp,
      email: settings.email || fallback.email,
      businessHours: settings.businessHours || fallback.businessHours,
      socialLinks: settings.socialLinks?.length ? settings.socialLinks : fallback.socialLinks,
      financing: {
        interestRate: financing?.interestRate ?? fallback.financing.interestRate,
        downPaymentPercent: financing?.downPaymentPercent ?? fallback.financing.downPaymentPercent,
        maxTenureMonths: financing?.maxTenureMonths ?? fallback.financing.maxTenureMonths,
        disclaimer: financing?.disclaimer || undefined,
        partners: (financing?.partners || []).map((partner) => ({
          name: partner.name,
          logo: partner.logo?.url || null,
        })),
        interestFreePlan: (() => {
          const plan = financing?.interestFreePlan
          const base = fallback.financing.interestFreePlan
          const validUntil = plan?.validUntil || undefined
          return {
            enabled: (plan?.enabled ?? true) && isStillValid(validUntil),
            maxLoan: plan?.maxLoan ?? base.maxLoan,
            monthly: plan?.monthly ?? base.monthly,
            months: plan?.months ?? base.months,
            families: plan?.families ?? base.families,
            eligibility: plan?.eligibility || undefined,
            validUntil,
          }
        })(),
      },
      warranty: {
        vehicle: settings.warranty?.vehicle || undefined,
        battery: settings.warranty?.battery || undefined,
        serviceCondition: settings.warranty?.serviceCondition || undefined,
      },
      gaMeasurementId: settings.analytics?.gaMeasurementId || undefined,
      cookieConsent: {
        enabled: consent?.enabled ?? true,
        message: consent?.message || undefined,
        acceptLabel: consent?.acceptLabel || undefined,
        declineLabel: consent?.declineLabel || undefined,
      },
    }
  } catch {
    return fallback
  }
})
