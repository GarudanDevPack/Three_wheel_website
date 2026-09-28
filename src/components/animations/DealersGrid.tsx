'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { animate, stagger, onScroll } from 'animejs'

type Dealer = { name: string; city?: string; address?: string; phone?: string }

const DealersGrid = ({ dealers }: { dealers: Dealer[] }) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const container = containerRef.current
    const cards = container?.querySelectorAll('[data-dealer-card]')
    if (!section || !container || !cards?.length) return

    const animations = [
      animate(cards, {
        opacity: [0, 1],
        translateY: [40, 0],
        delay: stagger(120),
        duration: 600,
        ease: 'outQuad',
        autoplay: onScroll({ target: section }),
      }),
    ]

    if (photoRef.current) {
      animations.push(
        animate(photoRef.current, {
          opacity: [0, 1],
          translateX: [140, 0],
          duration: 700,
          ease: 'outQuad',
          autoplay: onScroll({ target: section }),
        }),
      )
    }

    return () => {
      animations.forEach((animation) => animation.revert())
    }
  }, [])

  return (
    <div ref={sectionRef} className="tw:mt-10 tw:grid tw:items-center tw:gap-10 tw:md:grid-cols-2">
      <div ref={containerRef} className="tw:grid tw:gap-6">
        {dealers.map((dealer) => (
          <div
            key={dealer.name}
            data-dealer-card
            className="tw:rounded-2xl tw:border tw:border-white/10 tw:bg-surface tw:p-6 tw:opacity-0 tw:transition tw:hover:border-white/20"
          >
            <div className="tw:flex tw:items-center tw:gap-3">
              <span className="tw:flex tw:h-10 tw:w-10 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-full tw:bg-brand-blue/15">
                <svg viewBox="0 0 24 24" className="tw:h-5 tw:w-5" fill="none" aria-hidden="true">
                  <path
                    d="M12 21s7-6.3 7-11.5A7 7 0 0 0 5 9.5C5 14.7 12 21 12 21z"
                    stroke="#3b82f6"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="9.5" r="2.5" stroke="#3b82f6" strokeWidth="1.8" />
                </svg>
              </span>
              <p className="tw:text-lg tw:font-semibold tw:text-white">{dealer.name}</p>
            </div>
            {dealer.city && (
              <p className="tw:mt-3 tw:inline-block tw:rounded-full tw:bg-brand-blue-light/10 tw:px-3 tw:py-1 tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wide tw:text-brand-blue-light">
                {dealer.city}
              </p>
            )}
            {dealer.address && <p className="tw:mt-3 tw:text-sm tw:text-white/60">{dealer.address}</p>}
            {dealer.phone && (
              <a
                href={`tel:${dealer.phone}`}
                className="tw:mt-4 tw:inline-flex tw:items-center tw:gap-2 tw:text-sm tw:font-semibold tw:text-brand-blue-light"
              >
                <svg viewBox="0 0 24 24" className="tw:h-4 tw:w-4" fill="none" aria-hidden="true">
                  <path
                    d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.2c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"
                    stroke="#3b82f6"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
                {dealer.phone}
              </a>
            )}
          </div>
        ))}
      </div>

      <div ref={photoRef} className="tw:relative tw:aspect-square tw:w-full tw:opacity-0">
        <Image
          src="/images/auto/gallery-2.png"
          alt="Neptune three-wheeler"
          fill
          className="tw:rounded-2xl tw:object-cover"
        />
      </div>
    </div>
  )
}

export default DealersGrid
