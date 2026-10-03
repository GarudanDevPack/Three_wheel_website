'use client'

import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { formatLkr } from '@/lib/format'

export type VehicleCardData = {
  id: string
  slug: string
  name: string
  shortDescription?: string | null
  category?: string | null
  fuelType?: string[] | null
  heroImage?: { url?: string | null; alt?: string | null } | null
  pricing?: { price?: number | null; showPrice?: boolean | null } | null
}

const VehicleCard = ({ vehicle }: { vehicle: VehicleCardData }) => {
  const t = useTranslations('Catalog')
  const locale = useLocale() as AppLocale
  const price =
    vehicle.pricing?.showPrice !== false && typeof vehicle.pricing?.price === 'number' && vehicle.pricing.price > 0
      ? vehicle.pricing.price
      : null

  return (
    <Link
      href={`/vehicles/${vehicle.slug}`}
      className="tw:group tw:overflow-hidden tw:rounded-2xl tw:border tw:border-brand-ink/10 tw:bg-surface-raised tw:transition tw:duration-300 tw:hover:-translate-y-1 tw:hover:shadow-lg"
    >
      {vehicle.heroImage?.url && (
        <div className="tw:relative tw:aspect-square tw:overflow-hidden">
          <Image
            src={vehicle.heroImage.url}
            alt={vehicle.heroImage.alt || vehicle.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="tw:object-contain tw:p-6 tw:transition tw:duration-300 tw:group-hover:scale-105"
          />
        </div>
      )}
      <div className="tw:border-t tw:border-brand-ink/10 tw:p-5">
        <div className="tw:flex tw:flex-wrap tw:gap-2">
          {vehicle.category && (
            <span className="tw:rounded-full tw:bg-brand-blue/10 tw:px-3 tw:py-1 tw:text-xs tw:font-semibold tw:text-brand-blue-light">
              {t(`categories.${vehicle.category}`)}
            </span>
          )}
          {vehicle.fuelType?.map((fuel) => (
            <span
              key={fuel}
              className="tw:rounded-full tw:bg-brand-green/10 tw:px-3 tw:py-1 tw:text-xs tw:font-semibold tw:text-emerald-700"
            >
              {t(`fuel.${fuel}`)}
            </span>
          ))}
        </div>
        <p className="tw:mt-3 tw:text-lg tw:font-semibold tw:text-brand-ink">{vehicle.name}</p>
        {vehicle.shortDescription && (
          <p className="tw:mt-1 tw:text-sm tw:text-brand-ink/60">{vehicle.shortDescription}</p>
        )}
        <p className="tw:mt-3 tw:text-sm tw:font-bold tw:text-brand-ink">
          {price ? t('fromPrice', { price: formatLkr(price, locale) }) : t('priceOnRequest')}
        </p>
      </div>
    </Link>
  )
}

export default VehicleCard
