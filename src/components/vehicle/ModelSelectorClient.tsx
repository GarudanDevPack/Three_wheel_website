'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { animate } from 'animejs'
import { Link } from '@/i18n/navigation'
import { type Stat } from '@/components/animations/StatCounters'
import { type AngleImage } from '@/components/animations/ColorSpin360'
import ColorShowcase from './LazyColorShowcase'
import SectionVideoBackdrop from '@/components/ui/SectionVideoBackdrop'

export type ModelColor = {
  colorName: string
  swatchHex?: string | null
  video?: string | null
  angleImages?: AngleImage[] | null
}

export type ModelOption = {
  id: string
  slug: string | null
  name: string
  modelRange: string
  availability: 'Available' | 'Upcoming'
  shortDescription?: string | null
  heroImage?: { url?: string | null; alt?: string | null } | null
  stats: Stat[]
  colors: ModelColor[]
}

const ModelSelectorClient = ({ models }: { models: ModelOption[] }) => {
  const t = useTranslations('ModelSelector')
  const [activeIndex, setActiveIndex] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)
  const active = models[activeIndex]

  useEffect(() => {
    if (!panelRef.current) return
    const animation = animate(panelRef.current, {
      opacity: [0, 1],
      translateY: [16, 0],
      duration: 400,
      ease: 'outQuad',
    })
    return () => {
      animation.revert()
    }
  }, [activeIndex])

  if (!models.length) return null

  return (
    <section id="model-selector" className="tw:relative tw:isolate tw:overflow-hidden tw:bg-surface tw:py-20">
      <SectionVideoBackdrop src="/videos/model-selector-backdrop.mp4" variant="soft" base="surface" />
      <div className="tw:relative tw:z-10 tw:mx-auto tw:max-w-6xl tw:px-6">
        <div className="tw:flex tw:items-end tw:justify-between">
          <h2 className="tw:text-3xl tw:font-bold tw:text-brand-ink">{t('title')}</h2>
          <Link href="/vehicles" className="tw:text-sm tw:font-semibold tw:text-brand-blue-light">
            {t('seeAll')} →
          </Link>
        </div>

        <div className="tw:mt-8 tw:flex tw:flex-wrap tw:gap-3">
          {models.map((model, index) => (
            <button
              key={model.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`tw:flex tw:cursor-pointer tw:items-center tw:gap-2 tw:rounded-full tw:border-0 tw:px-5 tw:py-2.5 tw:text-sm tw:font-semibold tw:transition ${
                index === activeIndex
                  ? 'tw:bg-brand-blue tw:text-white'
                  : 'tw:bg-surface-raised tw:text-brand-ink/70 tw:hover:bg-surface-raised/70'
              }`}
            >
              {model.modelRange}
              <span
                className={`tw:rounded-full tw:px-2 tw:py-0.5 tw:text-[10px] tw:font-bold ${
                  model.availability === 'Available'
                    ? 'tw:bg-brand-green/20 tw:text-brand-green'
                    : 'tw:bg-brand-ink/10 tw:text-brand-ink/50'
                }`}
              >
                {model.availability === 'Available' ? t('available') : t('upcoming')}
              </span>
            </button>
          ))}
        </div>

        <div ref={panelRef} key={active.id} className="tw:mt-10 tw:grid tw:gap-10 tw:md:grid-cols-2">
          <div>
            <h3 className="tw:text-2xl tw:font-bold tw:text-brand-ink">{active.name}</h3>
            {active.shortDescription && (
              <p className="tw:mt-3 tw:max-w-md tw:text-brand-ink/70">{active.shortDescription}</p>
            )}

            {active.stats.length > 0 && (
              <div className="tw:mt-6 tw:grid tw:grid-cols-2 tw:gap-x-6 tw:gap-y-4 tw:sm:grid-cols-4">
                {active.stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="tw:text-2xl tw:font-bold tw:text-brand-ink">
                      {stat.value}
                      {stat.unit && (
                        <span className="tw:ml-1 tw:text-base tw:font-semibold tw:text-brand-ink/70">
                          {stat.unit}
                        </span>
                      )}
                    </p>
                    <p className="tw:mt-1 tw:text-xs tw:font-semibold tw:text-brand-ink/50">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="tw:mt-8">
              {active.availability === 'Available' && active.slug ? (
                <Link
                  href={`/vehicles/${active.slug}`}
                  className="tw:inline-block tw:rounded-full tw:bg-brand-blue tw:px-6 tw:py-3 tw:text-sm tw:font-semibold tw:text-white"
                >
                  {t('viewDetails')} →
                </Link>
              ) : (
                <span className="tw:inline-block tw:cursor-not-allowed tw:rounded-full tw:border tw:border-brand-ink/20 tw:px-6 tw:py-3 tw:text-sm tw:font-semibold tw:text-brand-ink/40">
                  {t('specsSoon')}
                </span>
              )}
            </div>
          </div>

          <div>
            {active.colors.length > 0 ? (
              <ColorShowcase colors={active.colors} />
            ) : (
              <div className="tw:flex tw:aspect-square tw:items-center tw:justify-center tw:rounded-2xl tw:border tw:border-dashed tw:border-white/20 tw:bg-brand-ink tw:text-center tw:text-sm tw:text-white/40">
                {t('photosSoon')}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ModelSelectorClient
