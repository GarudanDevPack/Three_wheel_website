import { cache } from 'react'
import { getPayloadClient } from './payload'
import type { AppLocale } from '@/i18n/routing'
import type { Specs, Charging } from './specs'

export type HeroStat = { value: number; unit?: string | null }

export type ModelVehicle = {
  id: string
  slug: string | null
  /** Empty in the no-database fallback — UI falls back to a translated "{range} Range" label. */
  name: string
  modelRange: string
  availability: 'Available' | 'Upcoming'
  heroImage: { url: string; alt?: string | null } | null
  price: number | null
  showPrice: boolean
  priceNote: string | null
  heroStats: Partial<Record<'range' | 'topSpeed' | 'peakPower' | 'gradeability', HeroStat>>
  specs: Specs | null
  charging: Charging
}

// Only figures already published on the site/spec sheet. No prices: those come from the admin.
const fallbackModels: ModelVehicle[] = [
  {
    id: 'placeholder-300',
    slug: 'neptune',
    name: '',
    modelRange: '300km',
    availability: 'Available',
    heroImage: { url: '/images/auto/neptune-blue-1.png', alt: 'Neptune three-wheeler, 300km model' },
    price: null,
    showPrice: false,
    priceNote: null,
    heroStats: {
      range: { value: 300, unit: 'km' },
      topSpeed: { value: 60, unit: 'km/h' },
      peakPower: { value: 12, unit: 'kW' },
      gradeability: { value: 15, unit: '%' },
    },
    specs: {
      motor: { motorType: 'PMSM', ratedPower: '5 kW', maxPower: '12 kW', peakTorque: '67 Nm' },
      dimensions: { kerbWeight: '285 kg' },
    },
    charging: {
      chargerRating: '2kW / 30Ah off-board',
      chargingTime: '8 hrs (20% → 100%)',
      rangePerCharge: '300 km',
    },
  },
  ...(['200km', '120km'] as const).map<ModelVehicle>((modelRange) => ({
    id: `placeholder-${modelRange}`,
    slug: null,
    name: '',
    modelRange,
    availability: 'Upcoming',
    heroImage: null,
    price: null,
    showPrice: false,
    priceNote: null,
    heroStats: {},
    specs: null,
    charging: null,
  })),
]

type StatDoc = { value?: number | null; unit?: string | null } | null | undefined

type VehicleDoc = {
  id: string | number
  slug?: string | null
  name?: string | null
  modelRange?: string | null
  availability?: string | null
  heroImage?: { url?: string | null; alt?: string | null } | null
  pricing?: { price?: number | null; showPrice?: boolean | null; priceNote?: string | null } | null
  heroStats?: Partial<Record<'range' | 'topSpeed' | 'peakPower' | 'gradeability', StatDoc>> | null
  variants?: Array<{ specs?: Specs | null; charging?: Charging }> | null
}

const toStat = (stat: StatDoc): HeroStat | undefined =>
  typeof stat?.value === 'number' ? { value: stat.value, unit: stat.unit } : undefined

export const getModelVehicles = cache(async (locale: AppLocale): Promise<ModelVehicle[]> => {
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'vehicles',
      where: { modelRange: { exists: true } },
      sort: 'selectorOrder',
      depth: 1,
      locale,
    })
    const vehicleDocs = docs as unknown as VehicleDoc[]
    if (!vehicleDocs.length) return fallbackModels

    return vehicleDocs.map((doc) => {
      const stats = doc.heroStats || {}
      return {
        id: String(doc.id),
        slug: doc.slug || null,
        name: doc.name || '',
        modelRange: doc.modelRange || '',
        availability: doc.availability === 'Available' ? 'Available' : 'Upcoming',
        heroImage: doc.heroImage?.url ? { url: doc.heroImage.url, alt: doc.heroImage.alt } : null,
        price: typeof doc.pricing?.price === 'number' ? doc.pricing.price : null,
        showPrice: doc.pricing?.showPrice ?? true,
        priceNote: doc.pricing?.priceNote || null,
        heroStats: {
          range: toStat(stats.range),
          topSpeed: toStat(stats.topSpeed),
          peakPower: toStat(stats.peakPower),
          gradeability: toStat(stats.gradeability),
        },
        specs: doc.variants?.[0]?.specs || null,
        charging: doc.variants?.[0]?.charging || null,
      }
    })
  } catch {
    // Payload/database not configured yet.
    return fallbackModels
  }
})

/** A price the admin has chosen to publish, or null for "Price on request". */
export const publicPrice = (vehicle: Pick<ModelVehicle, 'price' | 'showPrice'>) =>
  vehicle.showPrice && typeof vehicle.price === 'number' && vehicle.price > 0 ? vehicle.price : null
