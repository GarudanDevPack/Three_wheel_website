import { getLocale } from 'next-intl/server'
import type { AppLocale } from '@/i18n/routing'
import { getModelVehicles, publicPrice } from '@/lib/vehicles'
import { getSiteSettings } from '@/lib/siteSettings'
import PricingFinanceClient, { type PricedModel } from './PricingFinanceClient'

const PricingFinance = async () => {
  const locale = (await getLocale()) as AppLocale
  const [vehicles, settings] = await Promise.all([getModelVehicles(locale), getSiteSettings(locale)])

  const models: PricedModel[] = vehicles.map((vehicle) => {
    const price = publicPrice(vehicle)
    return {
      id: vehicle.id,
      name: vehicle.name,
      modelRange: vehicle.modelRange,
      availability: vehicle.availability,
      price,
      priceNote: vehicle.priceNote,
      originalPrice: price && vehicle.originalPrice && vehicle.originalPrice > price ? vehicle.originalPrice : null,
      offerLabel: vehicle.offerLabel,
      monthlySaving: vehicle.monthlySaving,
      image: vehicle.heroImage,
      rangeKm: vehicle.heroStats.range?.value ?? null,
    }
  })

  return <PricingFinanceClient models={models} financing={settings.financing} />
}

export default PricingFinance
