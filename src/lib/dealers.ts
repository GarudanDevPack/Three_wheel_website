import type { SiteSettingsData } from './siteSettings'

export type FallbackDealer = {
  name: string
  city?: string
  address: string
  phone: string
  phone2?: string
}

// From the client's Mega Offer poster. Replaced by Dealers collection entries once they exist in the admin.
export const jaffnaDealer = {
  city: 'Jaffna',
  address: '1018A, K.K.S Road, Kokuvil, Jaffna',
  phone: '021 785 6180',
  phone2: '077 396 9427',
}

/** Head office + Jaffna, shown until dealers are added in the admin. Names come from translations. */
export const getFallbackDealers = (
  settings: Pick<SiteSettingsData, 'address' | 'phone'>,
  names: { headOffice: string; jaffna: string },
): FallbackDealer[] => [
  { name: names.headOffice, address: settings.address, phone: settings.phone },
  { name: names.jaffna, ...jaffnaDealer },
]
