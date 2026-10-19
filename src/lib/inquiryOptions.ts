import { cache } from 'react'
import { getTranslations } from 'next-intl/server'
import type { AppLocale } from '@/i18n/routing'
import { getPayloadClient } from './payload'
import { getModelVehicles } from './vehicles'
import { jaffnaDealer } from './dealers'

export type SelectOption = { value: string; label: string }

/**
 * Model and dealer choices for the enquiry forms, from the CMS (vehicles / dealers collections),
 * falling back to the catalog models and the head office + Jaffna dealer when there is no database.
 * Values are stored English names (admin + reporting); labels may be translated.
 */
export const getInquiryOptions = cache(async (locale: AppLocale) => {
  const [vehicles, t] = await Promise.all([getModelVehicles(locale), getTranslations({ locale, namespace: 'Inquiry' })])

  const models: Array<SelectOption & { slug: string | null }> = vehicles.map((vehicle) => {
    const name = vehicle.name || `Neptune ${vehicle.modelRange.replace(/km$/i, ' km')}`
    return {
      value: name,
      label: vehicle.availability === 'Available' ? name : `${name} (${t('upcoming')})`,
      slug: vehicle.slug,
    }
  })

  let dealers: SelectOption[] = []
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({ collection: 'dealers', limit: 100, locale, depth: 0 })
    dealers = (docs as Array<{ name?: string | null; city?: string | null }>)
      .filter((dealer) => dealer.name)
      .map((dealer) => ({
        value: dealer.name as string,
        label: dealer.city ? `${dealer.name} (${dealer.city})` : (dealer.name as string),
      }))
  } catch {
    // No database: fall through to the known dealers.
  }
  if (!dealers.length) {
    dealers = [
      { value: 'Head office', label: t('dealerHeadOffice') },
      { value: jaffnaDealer.city, label: t('dealerJaffna') },
    ]
  }

  return { models, dealers }
})

/** Option value of the model behind a `?model=<slug>` link (e.g. from a model page). */
export const modelValueForSlug = (models: Array<SelectOption & { slug: string | null }>, slug?: string | null) =>
  (slug && models.find((model) => model.slug === slug)?.value) || ''
