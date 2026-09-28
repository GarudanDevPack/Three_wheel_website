'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
    <section id="cta" className="tw:relative tw:overflow-hidden tw:py-24 tw:text-center tw:text-white">
      <div className="tw:absolute tw:inset-0">
        <Image
          src="/images/auto/gallery-2.png"
          alt="Neptune three-wheeler"
          fill
          className="tw:object-cover"
        />
        <div className="tw:pointer-events-none tw:absolute tw:inset-0 tw:bg-gradient-to-t tw:from-brand-ink tw:via-brand-ink/70 tw:to-brand-ink/40" />
        <div className="tw:pointer-events-none tw:absolute tw:inset-0 tw:bg-gradient-to-r tw:from-brand-ink/60 tw:via-transparent tw:to-brand-ink/60" />
      </div>

      <div ref={sectionRef} className="tw:relative tw:mx-auto tw:max-w-3xl tw:px-6">
        <h2 data-cta-item className="tw:text-3xl tw:font-bold tw:opacity-0">
          Ready to find your Neptune?
        </h2>
        <p data-cta-item className="tw:mt-3 tw:text-white/80 tw:opacity-0">
          Explore every color up close, or talk to us about booking a test drive.
        </p>
        <div data-cta-item className="tw:mt-8 tw:flex tw:flex-wrap tw:justify-center tw:gap-4 tw:opacity-0">
          <Link
            href="/360-view"
            className="tw:rounded-full tw:bg-white tw:px-8 tw:py-3 tw:text-sm tw:font-semibold tw:text-brand-blue tw:transition tw:hover:bg-white/90"
          >
            See it in 360°
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
