import Link from 'next/link'
import Image from 'next/image'

export type VehicleCardData = {
  id: string
  slug: string
  name: string
  shortDescription?: string | null
  category?: string | null
  fuelType?: string[] | null
  heroImage?: { url?: string | null; alt?: string | null } | null
}

const VehicleCard = ({ vehicle }: { vehicle: VehicleCardData }) => (
  <Link
    href={`/vehicles/${vehicle.slug}`}
    className="tw:overflow-hidden tw:rounded-2xl tw:bg-surface-raised tw:border tw:border-white/10 tw:transition tw:hover:border-white/20"
  >
    {vehicle.heroImage?.url && (
      <div className="tw:relative tw:aspect-square">
        <Image
          src={vehicle.heroImage.url}
          alt={vehicle.heroImage.alt || vehicle.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="tw:object-contain tw:p-6"
        />
      </div>
    )}
    <div className="tw:border-t tw:border-white/10 tw:p-5">
      <div className="tw:flex tw:flex-wrap tw:gap-2">
        {vehicle.category && (
          <span className="tw:rounded-full tw:bg-brand-blue/10 tw:px-3 tw:py-1 tw:text-xs tw:font-semibold tw:text-brand-blue-light">
            {vehicle.category}
          </span>
        )}
        {vehicle.fuelType?.map((fuel) => (
          <span
            key={fuel}
            className="tw:rounded-full tw:bg-brand-green/10 tw:px-3 tw:py-1 tw:text-xs tw:font-semibold tw:text-brand-green"
          >
            {fuel}
          </span>
        ))}
      </div>
      <p className="tw:mt-3 tw:text-lg tw:font-semibold tw:text-white">{vehicle.name}</p>
      {vehicle.shortDescription && (
        <p className="tw:mt-1 tw:text-sm tw:text-white/60">{vehicle.shortDescription}</p>
      )}
    </div>
  </Link>
)

export default VehicleCard
