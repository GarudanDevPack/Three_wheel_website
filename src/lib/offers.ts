import { isStillValid } from './siteSettings'

export type OfferFields = {
  price: number | null
  /** Regular price shown struck through while the offer runs. */
  originalPrice: number | null
  offerLabel: string | null
  offerConditions?: string | null
  /** ISO dates from the CMS; unknown today, so usually unset. */
  offerValidFrom?: string | null
  offerValidUntil?: string | null
}

/** Is a time-limited offer running right now? An offer with no dates runs until it is removed. */
export const offerIsActive = (offer: Pick<OfferFields, 'offerValidFrom' | 'offerValidUntil'>, now = new Date()) => {
  if (offer.offerValidFrom && now.getTime() < new Date(offer.offerValidFrom).getTime()) return false
  return isStillValid(offer.offerValidUntil, now)
}

/**
 * Applies the offer window at render time (pages revalidate every few minutes): outside it the
 * offer disappears and the regular price (`originalPrice`) is shown instead of the offer price.
 */
export const applyOfferWindow = <T extends OfferFields>(vehicle: T, now = new Date()): T => {
  if (!vehicle.originalPrice || offerIsActive(vehicle, now)) return vehicle
  return {
    ...vehicle,
    price: vehicle.originalPrice,
    originalPrice: null,
    offerLabel: null,
    offerConditions: null,
    offerValidFrom: null,
    offerValidUntil: null,
  }
}
