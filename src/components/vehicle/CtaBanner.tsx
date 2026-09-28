'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { animate, stagger, onScroll } from 'animejs'

const CtaBanner = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const items = section?.querySelectorAll('[data-cta-item]')
    if (!section || !items?.length) return

    const animation = animate(items, {
      opacity: [0, 1],
      translateY: [24, 0],
      delay: stagger(100),
      duration: 600,
      ease: 'outQuad',
      autoplay: onScroll({ target: section }),
    })

    return () => {
      animation.revert()
    }
  }, [])

  return (
    <section
      id="cta"
      className="tw:relative tw:overflow-hidden tw:bg-gradient-to-br tw:from-brand-blue tw:to-brand-ink tw:py-20 tw:text-center tw:text-white"
    >
      <div className="tw:pointer-events-none tw:absolute tw:-left-24 tw:-top-24 tw:h-72 tw:w-72 tw:rounded-full tw:bg-white/15 tw:blur-3xl" />
      <div className="tw:pointer-events-none tw:absolute tw:-bottom-24 tw:-right-16 tw:h-80 tw:w-80 tw:rounded-full tw:bg-white/10 tw:blur-3xl" />

      <svg
        viewBox="0 0 48 32"
        className="tw:pointer-events-none tw:absolute tw:-bottom-6 tw:-right-6 tw:h-56 tw:w-56 tw:opacity-10"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 24 L4 16 Q4 12 8 12 L14 12 L19 6 L34 6 Q38 6 39 10 L41 16 L44 16 Q46 16 46 18 L46 24"
          stroke="white"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="13" cy="24" r="4.5" stroke="white" strokeWidth="1.4" />
        <circle cx="37" cy="24" r="4.5" stroke="white" strokeWidth="1.4" />
      </svg>

      <div ref={sectionRef} className="tw:relative tw:mx-auto tw:max-w-3xl tw:px-6">
        <h2 data-cta-item className="tw:text-3xl tw:font-bold tw:opacity-0">
          Ready to find your Neptune?
        </h2>
        <p data-cta-item className="tw:mt-3 tw:text-white/80 tw:opacity-0">
          Compare passenger and cargo models, specs, and colors across the full lineup.
        </p>
        <div data-cta-item className="tw:mt-8 tw:flex tw:flex-wrap tw:justify-center tw:gap-4 tw:opacity-0">
          <Link
            href="/vehicles"
            className="tw:rounded-full tw:bg-white tw:px-8 tw:py-3 tw:text-sm tw:font-semibold tw:text-brand-blue tw:transition tw:hover:bg-white/90"
          >
            Browse the catalog
          </Link>
          <a
            href="#enquire"
            className="tw:rounded-full tw:border tw:border-white/30 tw:px-8 tw:py-3 tw:text-sm tw:font-semibold tw:transition tw:hover:border-white/60"
          >
            Book a Test Drive
          </a>
        </div>
      </div>
    </section>
  )
}

export default CtaBanner
