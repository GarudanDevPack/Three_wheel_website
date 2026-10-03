'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import SpecCategoryTabs, { type Specs, type Charging } from './SpecCategoryTabs'

export type Variant = {
  variantName: string
  fuelType?: string | null
  taglineForReveal?: string | null
  specs?: Specs | null
  charging?: Charging | null
}

const VariantTabs = ({ variants }: { variants: Variant[] }) => {
  const t = useTranslations('Catalog')
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
            className={`tw:cursor-pointer tw:rounded-full tw:border-0 tw:px-4 tw:py-2 tw:text-sm tw:font-semibold tw:transition ${
              index === activeIndex
                ? 'tw:bg-brand-blue tw:text-white'
                : 'tw:bg-surface tw:text-brand-ink/70 tw:hover:bg-surface-raised'
            }`}
          >
            {variant.variantName}
          </button>
        ))}
      </div>
      <div className="tw:mt-6">
        {active.fuelType && (
          <p className="tw:mb-3 tw:text-sm tw:font-semibold tw:text-brand-blue-light">
            {t(`fuel.${active.fuelType}`)}
          </p>
        )}
        <SpecCategoryTabs key={active.variantName} specs={active.specs} charging={active.charging} />
      </div>
    </div>
  )
}

export default VariantTabs
