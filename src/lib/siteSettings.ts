import { cache } from 'react'
import { getPayloadClient } from './payload'
import type { AppLocale } from '@/i18n/routing'

export type FinancePartner = { name: string; logo?: string | null }

export type SiteSettingsData = {
  address: string
  phone: string
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
  }
  gaMeasurementId?: string
  cookieConsent: {
    enabled: boolean
    message?: string
    acceptLabel?: string
    declineLabel?: string
  }
}

const fallback: SiteSettingsData = {
  address: '13 Galle Rd, Dehiwala-Mount Lavinia 10370',
  phone: '077 444 5909',
  whatsapp: '077 396 9427',
  email: undefined, // TODO: no company email supplied by client yet
  businessHours: 'Open 24 hours',
  // TODO: client to supply the Facebook page and YouTube channel URLs.
  socialLinks: [
    { platform: 'Facebook', url: 'https://www.facebook.com/' },
    { platform: 'YouTube', url: 'https://www.youtube.com/' },
  ],
  // Calculator starting points only — visitors adjust them, and the admin sets the real figures.
  financing: { interestRate: 15, downPaymentPercent: 20, maxTenureMonths: 60, partners: [] },
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
  } | null
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
