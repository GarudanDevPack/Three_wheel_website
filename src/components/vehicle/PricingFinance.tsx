import { getLocale, getTranslations } from 'next-intl/server'
import type { AppLocale } from '@/i18n/routing'
import { getModelVehicles, publicPrice } from '@/lib/vehicles'
import { getSiteSettings } from '@/lib/siteSettings'
import { getCatalogModel, GARUDAN_ZERO_FINANCE } from '@/lib/catalog'
import PricingFinanceClient, { type PricedModel, type PricingFact } from './PricingFinanceClient'

const PricingFinance = async () => {
  const locale = (await getLocale()) as AppLocale
  const [vehicles, settings, t, tw] = await Promise.all([
    getModelVehicles(locale),
    getSiteSettings(locale),
    getTranslations('Pricing'),
    getTranslations('Warranty'),
  ])

  const models: PricedModel[] = vehicles.map((vehicle) => {
    const price = publicPrice(vehicle)
    const catalogModel = vehicle.slug ? getCatalogModel(vehicle.slug) : null
    const isCargo = vehicle.category === 'Cargo'

    const facts: PricingFact[] = []
    if (vehicle.availability === 'Available') {
      if (isCargo) {
        facts.push({ icon: 'range', label: t('rangePerCharge'), value: t('cargoRange') })
        facts.push({ icon: 'payload', label: t('payload'), value: t('upToKg', { kg: 500 }) })
        facts.push({ icon: 'battery', label: t('battery'), value: '20 kWh' })
        facts.push({ icon: 'gear', label: t('gearbox'), value: t('automatic') })
      } else {
        const range = vehicle.heroStats.range?.value
        if (range) facts.push({ icon: 'range', label: t('rangePerCharge'), value: t('upToKm', { km: range }) })
        if (vehicle.monthlySaving) facts.push({ icon: 'saving', label: t('monthlySaving'), value: `LKR ${vehicle.monthlySaving.toLocaleString('en-US')}` })
        facts.push({ icon: 'warranty', label: t('warranty'), value: tw('vehicleValue') })
        facts.push({ icon: 'battery', label: t('batteryWarranty'), value: `${tw('batteryValue')} / ${tw('batteryNote')}` })
      }
    }

    return {
      id: vehicle.id,
      name: vehicle.name,
      modelRange: vehicle.modelRange,
      availability: vehicle.availability,
      isNew: vehicle.isNew,
      price,
      priceNote: vehicle.priceNote === 'Including VAT' ? t('inclVat') : vehicle.priceNote,
      originalPrice: price && vehicle.originalPrice && vehicle.originalPrice > price ? vehicle.originalPrice : null,
      // Catalog label is translated; an admin-entered label is shown as written.
      offerLabel: vehicle.offerLabel === 'Limited-time offer' ? t('limitedOffer') : vehicle.offerLabel,
      downPayment: vehicle.downPayment,
      monthlySaving: vehicle.monthlySaving,
      image: vehicle.heroImage,
      facts,
      detailHref: catalogModel && vehicle.availability === 'Available' ? `/vehicles/${catalogModel.slug}` : null,
    }
  })

  return <PricingFinanceClient models={models} financing={settings.financing} zeroPlan={GARUDAN_ZERO_FINANCE} />
}

export default PricingFinance
