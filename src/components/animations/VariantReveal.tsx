'use client'

import { useRef, useState } from 'react'
import { createTimeline } from 'animejs'

export type RevealVariant = {
  variantName: string
  fuelType?: string | null
  taglineForReveal?: string | null
}

const VariantReveal = ({ variants }: { variants: RevealVariant[] }) => {
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
      className="tw:rounded-2xl tw:border tw:border-white/10 tw:bg-surface-raised tw:p-8 tw:text-center"
    >
      <p className="tw:text-sm tw:font-semibold tw:uppercase tw:tracking-wide tw:text-brand-blue-light">
        {active.fuelType || 'Variant'}
      </p>
      <h3 className="tw:mt-2 tw:text-2xl tw:font-bold tw:text-white">{active.variantName}</h3>
      <p className="tw:mx-auto tw:mt-3 tw:max-w-xl tw:text-white/70">{active.taglineForReveal}</p>
      <div className="tw:mt-6">
        {activeIndex === 0 ? (
          <button
            type="button"
            onClick={() => goTo(nextIndex)}
            className="tw:rounded-full tw:bg-brand-blue tw:px-6 tw:py-3 tw:text-sm tw:font-semibold tw:text-white"
          >
            Reveal the {next.variantName} Version
          </button>
        ) : (
          <button
            type="button"
            onClick={() => goTo(0)}
            className="tw:rounded-full tw:border tw:border-white/30 tw:px-6 tw:py-3 tw:text-sm tw:font-semibold tw:text-white"
          >
            Back to {revealable[0].variantName}
          </button>
        )}
      </div>
    </div>
  )
}

export default VariantReveal
