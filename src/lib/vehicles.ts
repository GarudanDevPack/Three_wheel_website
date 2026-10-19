import { cache } from 'react'
import { getPayloadClient } from './payload'
import type { AppLocale } from '@/i18n/routing'
import type { Specs, Charging } from './specs'
import { catalog } from './catalog'
import { applyOfferWindow } from './offers'

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
  /** Pre-offer price, shown struck through when higher than `price`. */
  originalPrice: number | null
  offerLabel: string | null
  /** What the offer includes / who qualifies (shown beside the price), and its optional dates. */
  offerConditions: string | null
  offerValidFrom: string | null
  offerValidUntil: string | null
  /** Estimated monthly fuel/running-cost saving vs a petrol three-wheeler (LKR). */
  monthlySaving: number | null
  /** Suggested down payment (LKR), e.g. from the client's poster. */
  downPayment: number | null
  category: 'Passenger' | 'Cargo'
  /** Honest range wording, e.g. "About 100 km on battery …". */
  rangeNote: string | null
  isNew: boolean
  heroStats: Partial<Record<'range' | 'topSpeed' | 'peakPower' | 'ratedPower' | 'gradeability', HeroStat>>
  specs: Specs | null
  charging: Charging
}

// No database yet: built from the client-verified catalog (src/lib/catalog.ts); the admin overrides it.
const fallbackModels: ModelVehicle[] = catalog.map((model) => ({
  id: `catalog-${model.slug}`,
  // Upcoming models have no page yet, so no link.
  slug: model.status === 'Available' ? model.slug : null,
  name: model.status === 'Available' ? model.name : '',
  modelRange: model.modelRange,
  availability: model.status,
  heroImage: model.heroImage,
  price: model.price,
  showPrice: model.price !== null,
  priceNote: model.priceNote ?? null,
  originalPrice: model.originalPrice ?? null,
  offerLabel: model.offerLabel ?? null,
  offerConditions: model.offerConditions ?? null,
  offerValidFrom: model.offerValidFrom ?? null,
  offerValidUntil: model.offerValidUntil ?? null,
  monthlySaving: model.monthlySaving ?? null,
  downPayment: model.downPayment ?? null,
  category: model.category,
  rangeNote: model.status === 'Available' ? model.rangeNote : null,
  isNew: Boolean(model.isNew),
  heroStats: model.heroStats,
  specs: model.specs,
  charging: model.charging,
}))

type StatDoc = { value?: number | null; unit?: string | null } | null | undefined

type VehicleDoc = {
  id: string | number
  slug?: string | null
  name?: string | null
  modelRange?: string | null
  availability?: string | null
  heroImage?: { url?: string | null; alt?: string | null } | null
  pricing?: {
    price?: number | null
    showPrice?: boolean | null
    priceNote?: string | null
    originalPrice?: number | null
    offerLabel?: string | null
    offerConditions?: string | null
    offerValidFrom?: string | null
    offerValidUntil?: string | null
    monthlySaving?: number | null
    downPayment?: number | null
  } | null
  category?: string | null
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
    if (!vehicleDocs.length) return fallbackModels.map((model) => applyOfferWindow(model))

    return vehicleDocs.map((doc): ModelVehicle => {
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
        originalPrice: typeof doc.pricing?.originalPrice === 'number' ? doc.pricing.originalPrice : null,
        offerLabel: doc.pricing?.offerLabel || null,
        offerConditions: doc.pricing?.offerConditions || null,
        offerValidFrom: doc.pricing?.offerValidFrom || null,
        offerValidUntil: doc.pricing?.offerValidUntil || null,
        monthlySaving: typeof doc.pricing?.monthlySaving === 'number' ? doc.pricing.monthlySaving : null,
        downPayment: typeof doc.pricing?.downPayment === 'number' ? doc.pricing.downPayment : null,
        category: doc.category === 'Cargo' ? 'Cargo' : 'Passenger',
        rangeNote: null,
        isNew: false,
        heroStats: {
          range: toStat(stats.range),
          topSpeed: toStat(stats.topSpeed),
          peakPower: toStat(stats.peakPower),
          gradeability: toStat(stats.gradeability),
        },
        specs: doc.variants?.[0]?.specs || null,
        charging: doc.variants?.[0]?.charging || null,
      }
    }).map((model) => applyOfferWindow(model))
  } catch {
    // Payload/database not configured yet.
    return fallbackModels.map((model) => applyOfferWindow(model))
  }
})

/** A price the admin has chosen to publish, or null for "Price on request". */
export const publicPrice = (vehicle: Pick<ModelVehicle, 'price' | 'showPrice'>) =>
  vehicle.showPrice && typeof vehicle.price === 'number' && vehicle.price > 0 ? vehicle.price : null
