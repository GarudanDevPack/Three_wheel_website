'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { animate, stagger, onScroll } from 'animejs'

export type ChassisImage = { url: string; alt: string; caption?: string }

const ChassisFrameReveal = ({
  heading,
  description,
  images,
}: {
  heading: string
  description?: string
  images: ChassisImage[]
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const tiles = container?.querySelectorAll('[data-chassis-tile]')
    if (!container || !tiles?.length) return

    const animation = animate(tiles, {
      opacity: [0, 1],
      translateY: [40, 0],
      delay: stagger(120),
      duration: 600,
      ease: 'outQuad',
      autoplay: onScroll({ target: container }),
    })

    return () => {
      animation.revert()
    }
  }, [])

  if (!images.length) return null

  return (
    <section className="tw:bg-surface-raised tw:py-20">
      <div className="tw:mx-auto tw:max-w-6xl tw:px-6">
        <h2 className="tw:text-3xl tw:font-bold tw:text-brand-ink">{heading}</h2>
        {description && <p className="tw:mt-4 tw:max-w-2xl tw:text-brand-ink/70">{description}</p>}
        <div
          ref={containerRef}
          className="tw:mt-10 tw:grid tw:gap-6 tw:sm:grid-cols-2 tw:lg:grid-cols-3"
        >
          {images.map((image, index) => (
            <div
              key={index}
              data-chassis-tile
              className="tw:overflow-hidden tw:rounded-2xl tw:bg-surface tw:border tw:border-brand-ink/10 tw:opacity-0"
            >
              <div className="tw:relative tw:aspect-[4/3]">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="tw:object-cover"
                />
              </div>
              {image.caption && (
                <p className="tw:p-4 tw:text-sm tw:font-semibold tw:text-brand-ink/70">
                  {image.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ChassisFrameReveal
