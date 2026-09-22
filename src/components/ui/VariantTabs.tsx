'use client'

import { useState } from 'react'
import SpecCategoryTabs, { type Specs, type Charging } from './SpecCategoryTabs'

export type Variant = {
  variantName: string
  fuelType?: string | null
  taglineForReveal?: string | null
  specs?: Specs | null
  charging?: Charging | null
}

const VariantTabs = ({ variants }: { variants: Variant[] }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!variants.length) return null

  const active = variants[activeIndex]

  return (
    <div>
      <div className="tw:flex tw:flex-wrap tw:gap-2">
        {variants.map((variant, index) => (
          <button
            key={variant.variantName}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`tw:rounded-full tw:px-4 tw:py-2 tw:text-sm tw:font-semibold tw:transition ${
              index === activeIndex
                ? 'tw:bg-brand-blue tw:text-white'
                : 'tw:bg-surface tw:text-white/70 tw:hover:bg-surface-raised'
            }`}
          >
            {variant.variantName}
          </button>
        ))}
      </div>
      <div className="tw:mt-6">
        {active.fuelType && (
          <p className="tw:mb-3 tw:text-sm tw:font-semibold tw:uppercase tw:tracking-wide tw:text-brand-blue-light">
            {active.fuelType}
          </p>
        )}
        <SpecCategoryTabs key={active.variantName} specs={active.specs} charging={active.charging} />
      </div>
    </div>
  )
}

export default VariantTabs
