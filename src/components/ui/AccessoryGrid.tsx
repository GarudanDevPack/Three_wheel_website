'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { animate, stagger, onScroll } from 'animejs'
import SectionBackdrop from '@/components/ui/SectionBackdrop'

export type Accessory = {
  id: string
  name: string
  description?: string | null
  image?: { url?: string | null; alt?: string | null } | null
}

const AccessoryGrid = ({ accessories }: { accessories: Accessory[] }) => {
  const t = useTranslations('VehicleDetail')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const tiles = container?.querySelectorAll('[data-accessory-card]')
    if (!container || !tiles?.length) return

    const animation = animate(tiles, {
      opacity: [0, 1],
      translateY: [40, 0],
      delay: stagger(100),
      duration: 600,
      ease: 'outQuad',
      autoplay: onScroll({ target: container }),
    })

    return () => {
      animation.revert()
    }
  }, [])

  if (!accessories.length) return null

  return (
    <section className="tw:relative tw:isolate tw:overflow-hidden tw:bg-surface-raised tw:py-20">
      <SectionBackdrop src="/images/auto/gallery-4.png" variant="soft" base="surface-raised" />
      <div className="tw:relative tw:z-10 tw:mx-auto tw:max-w-6xl tw:px-6">
        <h2 className="tw:text-3xl tw:font-bold tw:text-brand-ink">{t('accessories')}</h2>
        <div ref={containerRef} className="tw:mt-10 tw:grid tw:gap-6 tw:sm:grid-cols-2 tw:lg:grid-cols-3">
          {accessories.map((accessory) => (
            <div
              key={accessory.id}
              data-accessory-card
              className="tw:group tw:overflow-hidden tw:rounded-2xl tw:border tw:border-brand-ink/10 tw:bg-surface tw:opacity-0 tw:transition tw:duration-300 tw:hover:-translate-y-1 tw:hover:shadow-lg"
            >
              {accessory.image?.url && (
                <div className="tw:relative tw:aspect-square tw:overflow-hidden">
                  <Image
                    src={accessory.image.url}
                    alt={accessory.image.alt || accessory.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="tw:object-contain tw:p-6 tw:transition tw:duration-300 tw:group-hover:scale-105"
                  />
                </div>
              )}
              <div className="tw:border-t tw:border-brand-ink/10 tw:p-5">
                <p className="tw:text-lg tw:font-semibold tw:text-brand-ink">{accessory.name}</p>
                {accessory.description && (
                  <p className="tw:mt-1 tw:text-sm tw:text-brand-ink/60">{accessory.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AccessoryGrid
