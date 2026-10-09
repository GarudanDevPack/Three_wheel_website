'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { animate, stagger, onScroll } from 'animejs'
import { Link } from '@/i18n/navigation'
import SectionVideoBackdrop from '@/components/ui/SectionVideoBackdrop'

// Copy for each tab lives under `Design.<key>.{label,headline,copy,alt}`.
const tabs = [
  { key: 'powertrain', image: '/images/design/powertrain-chassis.png' },
  { key: 'interior', image: '/images/design/interior-layout.png' },
  { key: 'exterior', image: '/images/design/exterior-structure.jpg' },
] as const

const DesignShowcase = () => {
  const t = useTranslations('Design')
  const locale = useLocale()
  const caps = locale === 'en' ? 'tw:uppercase tw:tracking-widest' : ''
  const [activeKey, setActiveKey] = useState<(typeof tabs)[number]['key']>(tabs[0].key)
  const sectionRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const active = tabs.find((tab) => tab.key === activeKey) || tabs[0]

  useEffect(() => {
    const section = sectionRef.current
    const items = section?.querySelectorAll('[data-design-intro]')
    if (!section || !items?.length) return

    const animations = [
      animate(items, {
        opacity: [0, 1],
        translateY: [24, 0],
        delay: stagger(100),
        duration: 600,
        ease: 'outQuad',
        autoplay: onScroll({ target: section }),
      }),
    ]

    // The image frame slides in from the right once, as the section scrolls into view.
    if (mediaRef.current) {
      animations.push(
        animate(mediaRef.current, {
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

  // Tab switches only cross-fade the copy and the picture inside the (already visible) frame.
  useEffect(() => {
    const targets = [textRef.current, imageRef.current].filter((el): el is HTMLDivElement => Boolean(el))
    if (!targets.length) return
    const animation = animate(targets, {
      opacity: [0, 1],
      translateY: [16, 0],
      duration: 400,
      ease: 'outQuad',
    })
    return () => {
      animation.revert()
    }
  }, [activeKey])

  return (
    <section
      ref={sectionRef}
      id="design"
      className="tw:relative tw:isolate tw:overflow-hidden tw:bg-surface tw:py-20 tw:text-brand-ink"
    >
      <SectionVideoBackdrop src="/videos/design-backdrop.mp4" variant="soft" base="surface" />

      <div className="tw:relative tw:z-10 tw:mx-auto tw:max-w-6xl tw:px-6">
        <p data-design-intro className={`tw:text-sm tw:font-semibold tw:text-brand-blue tw:opacity-0 ${caps}`}>
          {t('eyebrow')}
        </p>

        <div className="tw:mt-4 tw:grid tw:items-center tw:gap-10 tw:md:grid-cols-2">
          <div ref={textRef} key={active.key}>
            <h2 className="tw:text-3xl tw:font-bold tw:text-brand-ink">{t(`${active.key}.headline`)}</h2>
            <p className="tw:mt-3 tw:max-w-md tw:text-brand-ink/70">{t(`${active.key}.copy`)}</p>
            <Link
              href="/vehicles/neptune#build"
              className="tw:mt-6 tw:inline-block tw:text-sm tw:font-semibold tw:text-brand-blue"
            >
              {t('seeBuild')} →
            </Link>
          </div>

          <div
            ref={mediaRef}
            className="tw:relative tw:aspect-[4/3] tw:w-full tw:overflow-hidden tw:rounded-2xl tw:bg-surface-raised/60 tw:opacity-0 tw:shadow-[0_30px_60px_-30px_rgba(11,14,20,0.35)]"
          >
            <div ref={imageRef} key={active.key} className="tw:absolute tw:inset-0">
              <Image
                src={active.image}
                alt={t(`${active.key}.alt`)}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="tw:object-contain"
              />
            </div>
          </div>
        </div>

        <div data-design-intro className="tw:mt-10 tw:flex tw:flex-wrap tw:items-center tw:justify-center tw:gap-3 tw:opacity-0">
          {tabs.map((tab, index) => (
            <div key={tab.key} className="tw:flex tw:items-center tw:gap-3">
              <button
                type="button"
                onClick={() => setActiveKey(tab.key)}
                className={`tw:cursor-pointer tw:appearance-none tw:border-0 tw:bg-transparent tw:p-0 tw:text-sm tw:font-semibold tw:transition ${
                  locale === 'en' ? 'tw:uppercase tw:tracking-wide' : ''
                } ${
                  tab.key === activeKey
                    ? 'tw:font-bold tw:text-brand-blue'
                    : 'tw:text-brand-ink/50 tw:hover:text-brand-ink/80'
                }`}
              >
                {t(`${tab.key}.label`)}
              </button>
              {index < tabs.length - 1 && <span className="tw:text-brand-ink/30">|</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DesignShowcase
