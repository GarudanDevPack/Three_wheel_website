'use client'

import { useEffect, useRef } from 'react'
import { animate, stagger, onScroll } from 'animejs'

export type Spec = { label: string; value: string }

const HighlightsReveal = ({ specs }: { specs: Spec[] }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const cards = container?.querySelectorAll('[data-spec-card]')
    if (!container || !cards?.length) return

    const animation = animate(cards, {
      opacity: [0, 1],
      translateY: [40, 0],
      delay: stagger(120),
      duration: 600,
      ease: 'outQuad',
      autoplay: onScroll({ target: container }),
    })

    return () => {
      animation.revert()
    }
  }, [])

  return (
    <section id="highlights" className="tw:bg-surface tw:py-20">
      <div className="tw:mx-auto tw:max-w-6xl tw:px-6">
        <h2 className="tw:text-3xl tw:font-bold tw:text-white">
          Why fleet owners pick Neptune
        </h2>
        <div
          ref={containerRef}
          className="tw:mt-10 tw:grid tw:gap-6 tw:sm:grid-cols-2 tw:lg:grid-cols-4"
        >
          {specs.map((spec) => (
            <div
              key={spec.label}
              data-spec-card
              className="tw:rounded-2xl tw:border tw:border-white/10 tw:bg-surface-raised tw:p-6 tw:opacity-0"
            >
              <p className="tw:text-sm tw:font-semibold tw:uppercase tw:tracking-wide tw:text-brand-blue-light">
                {spec.label}
              </p>
              <p className="tw:mt-2 tw:text-2xl tw:font-bold tw:text-white">{spec.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HighlightsReveal
