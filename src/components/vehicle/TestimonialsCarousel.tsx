'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { animate, onScroll } from 'animejs'
import SectionBackdrop from '@/components/ui/SectionBackdrop'

export type TestimonialItem = {
  id: string
  name: string
  role: string | null
  location: string | null
  quote: string
  rating: number
  photo: string | null
}

const AUTO_ADVANCE_MS = 6500

const Star = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 20 20" className={`tw:h-5 tw:w-5 ${filled ? 'tw:text-amber-400' : 'tw:text-brand-ink/15'}`} fill="currentColor" aria-hidden="true">
    <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
  </svg>
)

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

const TestimonialsCarousel = ({ items }: { items: TestimonialItem[] }) => {
  const t = useTranslations('Testimonials')
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = items.length
  const active = items[index]

  const go = useCallback((next: number) => setIndex((next + count) % count), [count])

  useEffect(() => {
    if (!sectionRef.current) return
    const animation = animate(sectionRef.current, {
      opacity: [0, 1],
      translateY: [32, 0],
      duration: 700,
      ease: 'outQuad',
      autoplay: onScroll({ target: sectionRef.current }),
    })
    return () => {
      animation.revert()
    }
  }, [])

  useEffect(() => {
    if (!cardRef.current) return
    const animation = animate(cardRef.current, {
      opacity: [0, 1],
      translateY: [14, 0],
      duration: 450,
      ease: 'outQuad',
    })
    return () => {
      animation.revert()
    }
  }, [index])

  useEffect(() => {
    if (count < 2 || paused) return
    const timer = window.setTimeout(() => go(index + 1), AUTO_ADVANCE_MS)
    return () => window.clearTimeout(timer)
  }, [index, paused, count, go])

  return (
    <section id="testimonials" className="tw:relative tw:isolate tw:overflow-hidden tw:bg-surface-raised tw:py-20">
      <SectionBackdrop src="/images/auto/night-ride.jpg" variant="soft" base="surface-raised" />
      <div
        ref={sectionRef}
        className="tw:relative tw:z-10 tw:mx-auto tw:max-w-4xl tw:px-6 tw:text-center tw:opacity-0"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <p className="tw:text-sm tw:font-semibold tw:text-brand-blue">{t('eyebrow')}</p>
        <h2 className="tw:mt-2 tw:text-3xl tw:font-bold tw:text-brand-ink tw:md:text-4xl">{t('title')}</h2>

        <div className="tw:relative tw:mt-10">
          <svg
            viewBox="0 0 48 48"
            className="tw:pointer-events-none tw:absolute tw:-top-6 tw:left-4 tw:h-16 tw:w-16 tw:text-brand-blue/15 tw:sm:left-8"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M10 36c-3.3 0-6-2.7-6-6V22c0-7.7 5-14 12-16l1.6 3.4C13 11.4 11 15 11 19h5c2.8 0 5 2.2 5 5v6c0 3.3-2.7 6-6 6h-5zm22 0c-3.3 0-6-2.7-6-6V22c0-7.7 5-14 12-16l1.6 3.4C35 11.4 33 15 33 19h5c2.8 0 5 2.2 5 5v6c0 3.3-2.7 6-6 6h-5z" />
          </svg>

          <figure
            ref={cardRef}
            key={active.id}
            aria-live="polite"
            className="tw:m-0 tw:rounded-3xl tw:border tw:border-brand-ink/10 tw:bg-surface/90 tw:px-6 tw:py-10 tw:shadow-[0_20px_50px_-24px_rgba(11,14,20,0.3)] tw:backdrop-blur tw:sm:px-12"
          >
            <div className="tw:flex tw:justify-center tw:gap-1" aria-label={t('rating', { rating: active.rating })}>
              {Array.from({ length: 5 }, (_, star) => (
                <Star key={star} filled={star < active.rating} />
              ))}
            </div>
            <blockquote className="tw:m-0 tw:mt-6 tw:text-lg tw:leading-relaxed tw:text-brand-ink tw:sm:text-xl">
              “{active.quote}”
            </blockquote>
            <figcaption className="tw:mt-8 tw:flex tw:items-center tw:justify-center tw:gap-3">
              {active.photo ? (
                <Image
                  src={active.photo}
                  alt={active.name}
                  width={48}
                  height={48}
                  className="tw:h-12 tw:w-12 tw:rounded-full tw:object-cover"
                />
              ) : (
                <span className="tw:flex tw:h-12 tw:w-12 tw:items-center tw:justify-center tw:rounded-full tw:bg-brand-blue tw:text-sm tw:font-bold tw:text-white">
                  {initials(active.name)}
                </span>
              )}
              <span className="tw:text-left">
                <span className="tw:block tw:font-semibold tw:text-brand-ink">{active.name}</span>
                {(active.role || active.location) && (
                  <span className="tw:block tw:text-sm tw:text-brand-ink/60">
                    {[active.role, active.location].filter(Boolean).join(' · ')}
                  </span>
                )}
              </span>
            </figcaption>
          </figure>
        </div>

        {count > 1 && (
          <div className="tw:mt-8 tw:flex tw:items-center tw:justify-center tw:gap-4">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label={t('previous')}
              className="tw:flex tw:h-10 tw:w-10 tw:cursor-pointer tw:items-center tw:justify-center tw:rounded-full tw:border tw:border-brand-ink/15 tw:bg-surface tw:text-brand-ink tw:transition tw:hover:border-brand-blue tw:hover:text-brand-blue"
            >
              ‹
            </button>
            <div className="tw:flex tw:gap-2">
              {items.map((item, dot) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => go(dot)}
                  aria-label={t('goTo', { number: dot + 1 })}
                  aria-current={dot === index ? 'true' : undefined}
                  className={`tw:h-2.5 tw:cursor-pointer tw:rounded-full tw:border-0 tw:p-0 tw:transition-all ${
                    dot === index ? 'tw:w-8 tw:bg-brand-blue' : 'tw:w-2.5 tw:bg-brand-ink/20 tw:hover:bg-brand-ink/40'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label={t('next')}
              className="tw:flex tw:h-10 tw:w-10 tw:cursor-pointer tw:items-center tw:justify-center tw:rounded-full tw:border tw:border-brand-ink/15 tw:bg-surface tw:text-brand-ink tw:transition tw:hover:border-brand-blue tw:hover:text-brand-blue"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default TestimonialsCarousel
