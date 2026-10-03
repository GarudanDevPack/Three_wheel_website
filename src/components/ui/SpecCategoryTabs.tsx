'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import SpecsTable from './SpecsTable'
import { buildCategories, type Specs, type Charging } from '@/lib/specs'

export type { Specs, Charging }

const SpecCategoryTabs = ({
  specs,
  charging,
}: {
  specs?: Specs | null
  charging?: Charging
}) => {
  const t = useTranslations('Specs')
  const categories = buildCategories(specs, charging)
  const [activeKey, setActiveKey] = useState(categories[0]?.key)

  if (!categories.length) return null

  const active = categories.find((category) => category.key === activeKey) || categories[0]

  return (
    <div>
      <div className="tw:flex tw:flex-wrap tw:gap-2">
        {categories.map((category) => (
          <button
            key={category.key}
            type="button"
            onClick={() => setActiveKey(category.key)}
            className={`tw:cursor-pointer tw:rounded-full tw:border-0 tw:px-3 tw:py-1.5 tw:text-xs tw:font-semibold tw:transition ${
              category.key === active.key
                ? 'tw:bg-brand-blue tw:text-white'
                : 'tw:bg-surface tw:text-brand-ink/70 tw:hover:bg-surface-raised'
            }`}
          >
            {t(`categories.${category.key}`)}
          </button>
        ))}
      </div>
      <div className="tw:mt-4">
        <SpecsTable rows={active.rows.map((row) => ({ label: t(`rows.${row.key}`), value: row.value }))} />
      </div>
    </div>
  )
}

export default SpecCategoryTabs
