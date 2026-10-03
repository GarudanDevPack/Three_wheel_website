import { getLocale } from 'next-intl/server'
import type { AppLocale } from '@/i18n/routing'
import { getModelVehicles, publicPrice } from '@/lib/vehicles'
import { getSiteSettings } from '@/lib/siteSettings'
import PricingFinanceClient, { type PricedModel } from './PricingFinanceClient'

const PricingFinance = async () => {
  const locale = (await getLocale()) as AppLocale
  const [vehicles, settings] = await Promise.all([getModelVehicles(locale), getSiteSettings(locale)])

  const models: PricedModel[] = vehicles.map((vehicle) => ({
    id: vehicle.id,
    name: vehicle.name,
    modelRange: vehicle.modelRange,
    availability: vehicle.availability,
    price: publicPrice(vehicle),
    priceNote: vehicle.priceNote,
  }))

  return <PricingFinanceClient models={models} financing={settings.financing} />
}

export default PricingFinance
