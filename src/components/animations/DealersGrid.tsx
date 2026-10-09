'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { animate, stagger, onScroll } from 'animejs'

type Dealer = { name: string; city?: string; address?: string; phone?: string; phone2?: string }

// Background-free renders for the Elektrateq-style colour switcher. Add a colour = add an entry.
const colours = [
  { key: 'black', hex: '#1c1c1e', src: '/images/auto/neptune-black-cutout.webp' },
  { key: 'green', hex: '#1fa05a', src: '/images/auto/green-1.png' },
] as const

type ColourKey = (typeof colours)[number]['key']
const colourLabelKey = { black: 'colourBlack', green: 'colourGreen' } as const

const DealersGrid = ({ dealers }: { dealers: Dealer[] }) => {
  const t = useTranslations('Dealers')
  const [colour, setColour] = useState<ColourKey>(colours[0].key)
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
        // Slides in from beyond the right edge as the section scrolls into view.
        animate(photoRef.current, {
          opacity: [0, 1],
          translateX: ['60%', '0%'],
          scale: [0.96, 1],
          duration: 900,
          ease: 'outCubic',
          autoplay: onScroll({ target: section }),
        }),
      )
    }

    return () => {
      animations.forEach((animation) => animation.revert())
    }
  }, [])

  return (
    <div ref={sectionRef} className="tw:mt-10 tw:grid tw:items-center tw:gap-10 tw:md:grid-cols-[5fr_7fr]">
      <div ref={containerRef} className="tw:grid tw:gap-6">
        {dealers.map((dealer) => (
          <div
            key={dealer.name}
            data-dealer-card
            className="tw:rounded-2xl tw:border tw:border-brand-ink/10 tw:bg-surface tw:p-6 tw:opacity-0 tw:transition tw:hover:border-brand-ink/20"
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
              <p className="tw:text-lg tw:font-semibold tw:text-brand-ink">{dealer.name}</p>
            </div>
            {dealer.city && (
              <p className="tw:mt-3 tw:inline-block tw:rounded-full tw:bg-brand-blue-light/10 tw:px-3 tw:py-1 tw:text-xs tw:font-semibold tw:text-brand-blue-light">
                {dealer.city}
              </p>
            )}
            {dealer.address && <p className="tw:mt-3 tw:text-sm tw:text-brand-ink/60">{dealer.address}</p>}
            {(dealer.phone || dealer.phone2) && (
              <div className="tw:mt-4 tw:flex tw:flex-wrap tw:gap-x-6 tw:gap-y-2">
                {[dealer.phone, dealer.phone2]
                  .filter((phone): phone is string => Boolean(phone))
                  .map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\s/g, '')}`}
                      className="tw:inline-flex tw:items-center tw:gap-2 tw:text-sm tw:font-semibold tw:text-brand-blue-light"
                    >
                      <svg viewBox="0 0 24 24" className="tw:h-4 tw:w-4" fill="none" aria-hidden="true">
                        <path
                          d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.2c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"
                          stroke="#3b82f6"
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {phone}
                    </a>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Floating studio stage: background-free vehicle, ground shadow and colour dots (Elektrateq-style). */}
      <div ref={photoRef} className="tw:relative tw:opacity-0 tw:md:pr-16">
        <div className="tw:relative tw:aspect-[16/12] tw:w-full tw:md:scale-110">
          <div
            aria-hidden="true"
            className="tw:absolute tw:bottom-[4%] tw:left-1/2 tw:h-8 tw:w-3/4 tw:-translate-x-1/2 tw:rounded-[100%] tw:bg-brand-ink/25 tw:blur-2xl"
          />
          {colours.map((option) => {
            const isActive = option.key === colour
            return (
              <Image
                key={option.key}
                src={option.src}
                alt={isActive ? t('photoAlt', { colour: t(colourLabelKey[option.key]) }) : ''}
                aria-hidden={!isActive}
                fill
                sizes="(min-width: 768px) 55vw, 100vw"
                className={`tw:object-contain tw:transition tw:duration-500 tw:ease-out tw:motion-reduce:transition-none ${
                  isActive ? 'tw:translate-x-0 tw:opacity-100' : 'tw:translate-x-6 tw:opacity-0'
                }`}
              />
            )
          })}
        </div>

        <div
          role="group"
          aria-label={t('colour')}
          className="tw:mt-6 tw:flex tw:items-center tw:justify-center tw:gap-4 tw:md:absolute tw:md:right-0 tw:md:top-1/2 tw:md:mt-0 tw:md:-translate-y-1/2 tw:md:flex-col"
        >
          {colours.map((option) => {
            const isActive = option.key === colour
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => setColour(option.key)}
                aria-pressed={isActive}
                aria-label={t(colourLabelKey[option.key])}
                title={t(colourLabelKey[option.key])}
                className={`tw:h-7 tw:w-7 tw:cursor-pointer tw:rounded-full tw:border-2 tw:border-white tw:p-0 tw:shadow-md tw:transition ${
                  isActive ? 'tw:scale-110 tw:ring-2 tw:ring-brand-blue tw:ring-offset-2' : 'tw:hover:scale-110'
                }`}
                style={{ backgroundColor: option.hex }}
              />
            )
          })}
          <span className="tw:text-xs tw:font-semibold tw:text-brand-ink/60 tw:md:mt-1">
            {t(colourLabelKey[colour])}
          </span>
        </div>
      </div>
    </div>
  )
}

export default DealersGrid
