'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export type Spec = { label: string; value: string }

const HighlightsReveal = ({ specs }: { specs: Spec[] }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll('[data-spec-card]')
    if (!cards?.length) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          },
        },
      )
    }, containerRef)

    return () => ctx.revert()
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
