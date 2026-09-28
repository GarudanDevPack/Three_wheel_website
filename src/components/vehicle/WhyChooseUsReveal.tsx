'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { animate, stagger, onScroll } from 'animejs'

type Point = { title: string; text: string; icon: 'coin' | 'shield' | 'network' | 'handshake' }

const points: Point[] = [
  {
    icon: 'coin',
    title: 'Low Running Cost',
    text: 'Fuel-efficient engines that keep your daily cost per kilometer down.',
  },
  {
    icon: 'shield',
    title: 'Built to Last',
    text: 'Reinforced chassis and components engineered for daily commercial use.',
  },
  {
    icon: 'network',
    title: 'Wide Dealer Network',
    text: 'Sales, service, and genuine parts available near you.',
  },
  {
    icon: 'handshake',
    title: 'Easy Financing',
    text: 'Flexible plans through our dealer and partner network.',
  },
]

const icons: Record<Point['icon'], React.ReactNode> = {
  coin: (
    <svg viewBox="0 0 32 32" className="tw:h-6 tw:w-6" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="11" stroke="#3b82f6" strokeWidth="2" />
      <path d="M16 10v12M12.5 12.5c0-1.5 1.5-2.5 3.5-2.5s3.5 1 3.5 2.5-1.5 2-3.5 2.5-3.5 1-3.5 2.5 1.5 2.5 3.5 2.5 3.5-1 3.5-2.5" stroke="#3b82f6" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 32 32" className="tw:h-6 tw:w-6" fill="none" aria-hidden="true">
      <path d="M16 5l10 4v7c0 6.5-4.3 10.8-10 12-5.7-1.2-10-5.5-10-12V9l10-4z" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 16l3 3 5-6" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  network: (
    <svg viewBox="0 0 32 32" className="tw:h-6 tw:w-6" fill="none" aria-hidden="true">
      <circle cx="16" cy="9" r="3.5" stroke="#3b82f6" strokeWidth="2" />
      <circle cx="7" cy="24" r="3.5" stroke="#3b82f6" strokeWidth="2" />
      <circle cx="25" cy="24" r="3.5" stroke="#3b82f6" strokeWidth="2" />
      <path d="M13.5 11.5L9 20.5M18.5 11.5L23 20.5" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  handshake: (
    <svg viewBox="0 0 32 32" className="tw:h-6 tw:w-6" fill="none" aria-hidden="true">
      <path d="M4 14l5-4 5 3 4-3 5 4M4 14v6l5 4M25 14v6l-5 4" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 13l3 3-3 3-3-3zM19 13l3 3-3 3-3-3z" stroke="#3b82f6" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
}

const WhyChooseUsReveal = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const cards = container?.querySelectorAll('[data-benefit-card]')
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
    <section id="why-choose-us" className="tw:bg-surface-raised tw:py-20">
      <div className="tw:mx-auto tw:grid tw:max-w-6xl tw:items-center tw:gap-10 tw:px-6 tw:md:grid-cols-2">
        <div>
          <h2 className="tw:text-3xl tw:font-bold tw:text-white">Why choose Neptune</h2>
          <div ref={containerRef} className="tw:mt-10 tw:grid tw:gap-6 tw:sm:grid-cols-2">
            {points.map((point) => (
              <div
                key={point.title}
                data-benefit-card
                className="tw:rounded-2xl tw:border tw:border-white/10 tw:bg-surface tw:p-6 tw:opacity-0"
              >
                {icons[point.icon]}
                <p className="tw:mt-3 tw:text-lg tw:font-semibold tw:text-white">{point.title}</p>
                <p className="tw:mt-2 tw:text-sm tw:text-white/60">{point.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div ref={photoRef} className="tw:relative tw:aspect-square tw:w-full tw:opacity-0">
          <Image
            src="/images/auto/gallery-3.png"
            alt="Neptune three-wheeler on the road"
            fill
            className="tw:rounded-2xl tw:object-cover"
          />
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUsReveal
