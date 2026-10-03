'use client'

import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import { createTimeline } from 'animejs'

export type RevealVariant = {
  variantName: string
  fuelType?: string | null
  taglineForReveal?: string | null
}

const VariantReveal = ({ variants }: { variants: RevealVariant[] }) => {
  const t = useTranslations('VariantReveal')
  const tc = useTranslations('Catalog')
  const [activeIndex, setActiveIndex] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)

  const revealable = variants.filter((v) => v.taglineForReveal)
  if (revealable.length < 2) return null

  const active = revealable[activeIndex]
  const nextIndex = (activeIndex + 1) % revealable.length
  const next = revealable[nextIndex]

  const goTo = (index: number) => {
    const el = contentRef.current
    if (!el) {
      setActiveIndex(index)
      return
    }

    createTimeline()
      .add(el, { opacity: [1, 0], translateY: [0, -12], duration: 250, ease: 'inQuad' })
      .add(el, {
        opacity: [0, 1],
        translateY: [12, 0],
        duration: 350,
        ease: 'outQuad',
        onBegin: () => setActiveIndex(index),
      })
  }

  return (
    <div
      ref={contentRef}
      className="tw:rounded-2xl tw:border tw:border-brand-ink/10 tw:bg-surface-raised tw:p-8 tw:text-center"
    >
      <p className="tw:text-sm tw:font-semibold tw:text-brand-blue">
        {active.fuelType ? tc(`fuel.${active.fuelType}`) : t('variant')}
      </p>
      <h3 className="tw:mt-2 tw:text-2xl tw:font-bold tw:text-brand-ink">{active.variantName}</h3>
      <p className="tw:mx-auto tw:mt-3 tw:max-w-xl tw:text-brand-ink/70">{active.taglineForReveal}</p>
      <div className="tw:mt-6">
        {activeIndex === 0 ? (
          <button
            type="button"
            onClick={() => goTo(nextIndex)}
            className="tw:cursor-pointer tw:rounded-full tw:border-0 tw:bg-brand-blue tw:px-6 tw:py-3 tw:text-sm tw:font-semibold tw:text-white"
          >
            {t('reveal', { name: next.variantName })}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => goTo(0)}
            className="tw:cursor-pointer tw:rounded-full tw:border tw:border-brand-ink/30 tw:bg-transparent tw:px-6 tw:py-3 tw:text-sm tw:font-semibold tw:text-brand-ink"
          >
            {t('back', { name: revealable[0].variantName })}
          </button>
        )}
      </div>
    </div>
  )
}

export default VariantReveal
