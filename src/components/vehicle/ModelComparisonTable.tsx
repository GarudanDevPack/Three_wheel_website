'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { animate, onScroll } from 'animejs'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { formatLkr } from '@/lib/format'
import SectionBackdrop from '@/components/ui/SectionBackdrop'

export type ComparisonColumn = {
  id: string
  name: string
  modelRange: string
  availability: 'Available' | 'Upcoming'
  slug: string | null
  image: { url: string; alt?: string | null } | null
  price: number | null
}

export type ComparisonGroup = {
  key: string
  rows: Array<{ key: string; values: Array<string | null> }>
}

const ModelComparisonTable = ({ columns, groups }: { columns: ComparisonColumn[]; groups: ComparisonGroup[] }) => {
  const t = useTranslations('Compare')
  const ts = useTranslations('Specs')
  const locale = useLocale() as AppLocale
  const sectionRef = useRef<HTMLDivElement>(null)
  const [differencesOnly, setDifferencesOnly] = useState(false)

  // A model contributes to "differences" only if it has any data at all.
  const hasData = columns.map((_, col) => groups.some((group) => group.rows.some((row) => row.values[col])))
  const columnsWithData = hasData.filter(Boolean).length

  const visibleGroups = differencesOnly
    ? groups
        .map((group) => ({
          ...group,
          rows: group.rows.filter((row) => {
            const compared = row.values.filter((_, col) => hasData[col]).map((value) => value || '—')
            return new Set(compared).size > 1
          }),
        }))
        .filter((group) => group.rows.length > 0)
    : groups

  useEffect(() => {
    if (!sectionRef.current) return
    const animation = animate(sectionRef.current, {
      opacity: [0, 1],
      translateY: [32, 0],
      duration: 700,
      ease: 'outQuad',
      autoplay: onScroll({ target: sectionRef.current }),
    })
    return () => {
      animation.revert()
    }
  }, [])

  const stickyCell = 'tw:sticky tw:left-0 tw:z-10 tw:bg-surface-raised'

  return (
    <section id="compare" className="tw:relative tw:isolate tw:overflow-hidden tw:bg-surface tw:py-20">
      <SectionBackdrop src="/images/auto/gallery-4.png" variant="soft" base="surface" />
      <div ref={sectionRef} className="tw:relative tw:z-10 tw:mx-auto tw:max-w-6xl tw:px-6 tw:opacity-0">
        <div className="tw:flex tw:flex-col tw:gap-6 tw:md:flex-row tw:md:items-end tw:md:justify-between">
          <div className="tw:max-w-2xl">
            <p className="tw:text-sm tw:font-semibold tw:text-brand-blue">{t('eyebrow')}</p>
            <h2 className="tw:mt-2 tw:text-3xl tw:font-bold tw:text-brand-ink tw:md:text-4xl">{t('title')}</h2>
            <p className="tw:mt-3 tw:text-brand-ink/70">{t('intro')}</p>
          </div>
          <label className="tw:inline-flex tw:cursor-pointer tw:items-center tw:gap-3 tw:self-start tw:md:self-auto">
            <span className="tw:text-sm tw:font-medium tw:text-brand-ink/70">{t('differencesOnly')}</span>
            <span className="tw:relative tw:inline-flex">
              <input
                type="checkbox"
                checked={differencesOnly}
                onChange={(event) => setDifferencesOnly(event.target.checked)}
                className="tw:peer tw:sr-only"
              />
              <span className="tw:h-6 tw:w-11 tw:rounded-full tw:bg-brand-ink/20 tw:transition tw:peer-checked:bg-brand-blue" />
              <span className="tw:absolute tw:left-0.5 tw:top-0.5 tw:h-5 tw:w-5 tw:rounded-full tw:bg-white tw:shadow tw:transition tw:peer-checked:translate-x-5" />
            </span>
          </label>
        </div>

        <div className="tw:mt-10 tw:overflow-x-auto tw:rounded-3xl tw:border tw:border-brand-ink/10 tw:bg-surface-raised tw:shadow-[0_20px_50px_-24px_rgba(11,14,20,0.25)]">
          <table className="tw:w-full tw:min-w-[720px] tw:border-collapse tw:text-sm">
            <thead>
              <tr>
                <th scope="col" className={`${stickyCell} tw:w-48 tw:p-5 tw:text-left tw:align-bottom`}>
                  <span className="tw:text-xs tw:font-semibold tw:text-brand-ink/50">{t('model')}</span>
                </th>
                {columns.map((column, col) => (
                  <th key={column.id} scope="col" className="tw:p-5 tw:text-left tw:align-top tw:font-normal">
                    <div className="tw:relative tw:aspect-[4/3] tw:overflow-hidden tw:rounded-2xl tw:bg-surface">
                      {column.image ? (
                        <Image
                          src={column.image.url}
                          alt={column.image.alt || column.modelRange}
                          fill
                          sizes="220px"
                          className="tw:object-cover"
                        />
                      ) : (
                        <div className="tw:flex tw:h-full tw:items-center tw:justify-center tw:text-xs tw:font-semibold tw:text-brand-ink/35">
                          {t('photoSoon')}
                        </div>
                      )}
                    </div>
                    <div className="tw:mt-4 tw:flex tw:items-center tw:justify-between tw:gap-2">
                      <span className="tw:text-2xl tw:font-bold tw:text-brand-ink">{column.modelRange}</span>
                      <span
                        className={`tw:rounded-full tw:px-2.5 tw:py-1 tw:text-[11px] tw:font-bold ${
                          column.availability === 'Available'
                            ? 'tw:bg-brand-green/15 tw:text-emerald-700'
                            : 'tw:bg-brand-ink/10 tw:text-brand-ink/60'
                        }`}
                      >
                        {column.availability === 'Available' ? t('available') : t('upcoming')}
                      </span>
                    </div>
                    <p className="tw:mt-0.5 tw:text-sm tw:text-brand-ink/60">
                      {column.name || t('rangeModel', { range: column.modelRange })}
                    </p>
                    <p className="tw:mt-2 tw:text-base tw:font-semibold tw:text-brand-ink">
                      {column.price ? formatLkr(column.price, locale) : t('priceOnRequest')}
                    </p>
                    {!hasData[col] && <p className="tw:mt-1 tw:text-xs tw:text-brand-ink/50">{t('specsSoon')}</p>}
                    <div className="tw:mt-4">
                      {column.availability === 'Available' && column.slug ? (
                        <Link
                          href={`/vehicles/${column.slug}`}
                          className="tw:inline-flex tw:rounded-full tw:bg-brand-blue tw:px-4 tw:py-2 tw:text-xs tw:font-semibold tw:text-white tw:transition tw:hover:bg-brand-blue-light"
                        >
                          {t('viewDetails')}
                        </Link>
                      ) : (
                        <span className="tw:inline-flex tw:rounded-full tw:border tw:border-brand-ink/15 tw:px-4 tw:py-2 tw:text-xs tw:font-semibold tw:text-brand-ink/45">
                          {t('comingSoon')}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleGroups.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="tw:p-8 tw:text-center tw:text-brand-ink/60">
                    {columnsWithData < 2 ? t('noDifferencesYet') : t('noDifferences')}
                  </td>
                </tr>
              )}
              {visibleGroups.map((group) => (
                <ComparisonRows key={group.key} group={group} columns={columns} label={ts(`categories.${group.key}`)} rowLabel={(key) => ts(`rows.${key}`)} stickyCell={stickyCell} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

const ComparisonRows = ({
  group,
  columns,
  label,
  rowLabel,
  stickyCell,
}: {
  group: ComparisonGroup
  columns: ComparisonColumn[]
  label: string
  rowLabel: (key: string) => string
  stickyCell: string
}) => (
  <>
    <tr className="tw:border-t tw:border-brand-ink/10">
      <th scope="colgroup" colSpan={columns.length + 1} className="tw:bg-brand-blue/5 tw:px-5 tw:py-2.5 tw:text-left">
        <span className="tw:sticky tw:left-5 tw:text-xs tw:font-bold tw:text-brand-blue">{label}</span>
      </th>
    </tr>
    {group.rows.map((row) => (
      <tr key={row.key} className="tw:border-t tw:border-brand-ink/5 tw:transition tw:hover:bg-surface/60">
        <th scope="row" className={`${stickyCell} tw:px-5 tw:py-3 tw:text-left tw:font-medium tw:text-brand-ink/60`}>
          {rowLabel(row.key)}
        </th>
        {row.values.map((value, col) => (
          <td
            key={columns[col].id}
            className={`tw:px-5 tw:py-3 ${value ? 'tw:font-semibold tw:text-brand-ink' : 'tw:text-brand-ink/30'}`}
          >
            {value || '—'}
          </td>
        ))}
      </tr>
    ))}
  </>
)

export default ModelComparisonTable
