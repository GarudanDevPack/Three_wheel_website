'use client'

import { useEffect, useRef, useState } from 'react'
import { useCallback } from 'react'
import Image from 'next/image'
import { animate, stagger, onScroll } from 'animejs'

const ZoomIcon = () => (
  <svg viewBox="0 0 24 24" className="tw:h-6 tw:w-6 tw:text-white" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
    <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M11 8v6M8 11h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

const GalleryReveal = ({ photos }: { photos: string[] }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const tiles = container?.querySelectorAll('[data-gallery-tile]')
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

  const close = useCallback(() => setActiveIndex(null), [])
  const showPrev = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length)),
    [photos.length],
  )
  const showNext = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i + 1) % photos.length)),
    [photos.length],
  )

  useEffect(() => {
    if (activeIndex === null) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') showPrev()
      if (e.key === 'ArrowRight') showNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [activeIndex, close, showPrev, showNext])

  return (
    <>
      <div ref={containerRef} className="tw:mt-10 tw:grid tw:gap-4 tw:sm:grid-cols-2 tw:lg:grid-cols-3">
        {photos.map((src, index) => (
          <button
            key={src}
            type="button"
            data-gallery-tile
            onClick={() => setActiveIndex(index)}
            className="tw:group tw:relative tw:aspect-[3/4] tw:overflow-hidden tw:rounded-xl tw:opacity-0"
          >
            <Image
              src={src}
              alt="Neptune three-wheeler"
              fill
              className="tw:object-cover tw:transition tw:duration-300 tw:group-hover:scale-105"
            />
            <div className="tw:absolute tw:inset-0 tw:flex tw:items-center tw:justify-center tw:bg-black/0 tw:transition tw:duration-300 tw:group-hover:bg-black/40">
              <span className="tw:opacity-0 tw:transition tw:duration-300 tw:group-hover:opacity-100">
                <ZoomIcon />
              </span>
            </div>
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          onClick={close}
          className="tw:fixed tw:inset-0 tw:z-[90] tw:flex tw:items-center tw:justify-center tw:bg-black/80 tw:p-4"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="tw:absolute tw:right-4 tw:top-4 tw:z-10 tw:flex tw:h-10 tw:w-10 tw:items-center tw:justify-center tw:rounded-full tw:bg-white/10 tw:text-xl tw:text-white"
          >
            ×
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              showPrev()
            }}
            aria-label="Previous photo"
            className="tw:absolute tw:left-4 tw:top-1/2 tw:flex tw:h-10 tw:w-10 tw:-translate-y-1/2 tw:items-center tw:justify-center tw:rounded-full tw:bg-white/10 tw:text-xl tw:text-white"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              showNext()
            }}
            aria-label="Next photo"
            className="tw:absolute tw:right-4 tw:top-1/2 tw:flex tw:h-10 tw:w-10 tw:-translate-y-1/2 tw:items-center tw:justify-center tw:rounded-full tw:bg-white/10 tw:text-xl tw:text-white"
          >
            ›
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="tw:relative tw:h-[80vh] tw:w-full tw:max-w-4xl"
          >
            <Image
              src={photos[activeIndex]}
              alt="Neptune three-wheeler, enlarged"
              fill
              className="tw:object-contain"
            />
          </div>
        </div>
      )}
    </>
  )
}

export default GalleryReveal
