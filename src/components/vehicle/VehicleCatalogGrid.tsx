'use client'

import { useMemo, useState } from 'react'
import VehicleCard, { type VehicleCardData } from './VehicleCard'

const categories = ['Passenger', 'Cargo'] as const
const fuelTypes = ['Petrol', 'CNG', 'LPG', 'Electric'] as const

const VehicleCatalogGrid = ({ vehicles }: { vehicles: VehicleCardData[] }) => {
  const [category, setCategory] = useState<string | null>(null)
  const [fuel, setFuel] = useState<string | null>(null)

  const filtered = useMemo(
    () =>
      vehicles.filter((vehicle) => {
        if (category && vehicle.category !== category) return false
        if (fuel && !vehicle.fuelType?.includes(fuel)) return false
        return true
      }),
    [vehicles, category, fuel],
  )

  const toggle = (value: string, current: string | null, setter: (v: string | null) => void) =>
    setter(current === value ? null : value)

  return (
    <div>
      <div className="tw:flex tw:flex-wrap tw:gap-6">
        <div className="tw:flex tw:flex-wrap tw:gap-2">
          {categories.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => toggle(value, category, setCategory)}
              className={`tw:rounded-full tw:px-4 tw:py-2 tw:text-sm tw:font-semibold tw:transition ${
                category === value
                  ? 'tw:bg-brand-blue-light tw:text-white'
                  : 'tw:bg-gray-100 tw:text-brand-ink tw:hover:bg-gray-200'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
        <div className="tw:flex tw:flex-wrap tw:gap-2">
          {fuelTypes.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => toggle(value, fuel, setFuel)}
              className={`tw:rounded-full tw:px-4 tw:py-2 tw:text-sm tw:font-semibold tw:transition ${
                fuel === value
                  ? 'tw:bg-brand-green tw:text-white'
                  : 'tw:bg-gray-100 tw:text-brand-ink tw:hover:bg-gray-200'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="tw:mt-10 tw:text-gray-500">No vehicles match those filters.</p>
      ) : (
        <div className="tw:mt-10 tw:grid tw:gap-8 tw:sm:grid-cols-2 tw:lg:grid-cols-3">
          {filtered.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  )
}

export default VehicleCatalogGrid
