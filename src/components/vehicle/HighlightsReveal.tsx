'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { animate, stagger, onScroll } from 'animejs'

export type Spec = { label: string; value: string }
export type ColorOption = { name: string; swatchHex: string; image: string }

const HighlightsReveal = ({ specs, colors }: { specs: Spec[]; colors: ColorOption[] }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const activeColor = colors[activeIndex] || colors[0]

  useEffect(() => {
    const container = containerRef.current
    const cards = container?.querySelectorAll('[data-spec-card]')
    if (!container || !cards?.length) return

    const animations = [
      animate(cards, {
        opacity: [0, 1],
        translateY: [40, 0],
        delay: stagger(120),
        duration: 600,
        ease: 'outQuad',
        autoplay: onScroll({ target: container }),
      }),
    ]

    if (photoRef.current) {
      animations.push(
        animate(photoRef.current, {
          opacity: [0, 1],
          translateX: [140, 0],
          duration: 700,
          ease: 'outQuad',
          autoplay: onScroll({ target: container }),
        }),
      )
    }

    return () => {
      animations.forEach((animation) => animation.revert())
    }
  }, [])

  return (
    <section id="highlights" className="tw:bg-surface tw:py-20">
      <div className="tw:mx-auto tw:grid tw:max-w-6xl tw:items-center tw:gap-10 tw:px-6 tw:md:grid-cols-2">
        <div>
          <h2 className="tw:text-3xl tw:font-bold tw:text-white">
            Why fleet owners pick Neptune
          </h2>
          <div ref={containerRef} className="tw:mt-10 tw:grid tw:gap-6 tw:sm:grid-cols-2">
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

        {activeColor && (
          <div ref={photoRef} className="tw:opacity-0">
            <div className="tw:relative tw:aspect-square tw:w-full">
              <Image
                src={activeColor.image}
                alt={`Neptune three-wheeler in ${activeColor.name}`}
                fill
                className="tw:object-contain"
              />
            </div>
            <div className="tw:mt-4 tw:flex tw:items-center tw:justify-center tw:gap-3">
              {colors.map((color, index) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={color.name}
                  title={color.name}
                  className={`tw:h-7 tw:w-7 tw:rounded-full tw:border-2 tw:transition ${
                    index === activeIndex ? 'tw:border-white' : 'tw:border-white/20'
                  }`}
                  style={{ backgroundColor: color.swatchHex }}
                />
              ))}
            </div>
            <p className="tw:mt-2 tw:text-center tw:text-sm tw:font-semibold tw:text-white/70">
              {activeColor.name}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default HighlightsReveal
