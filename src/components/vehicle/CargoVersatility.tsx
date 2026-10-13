'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { animate } from 'animejs'
import { useInViewVideo } from '@/lib/useInViewVideo'
import { prefersReducedMotion, revealOnScroll } from '@/lib/reveal'

type Mode = 'passenger' | 'cargo'

const MODE_MEDIA: Record<Mode, { video: string; poster: string }> = {
  passenger: { video: '/videos/passenger-mode-blueprint.mp4', poster: '/images/posters/passenger-mode-blueprint.webp' },
  cargo: { video: '/videos/cargo-mode-doors.mp4', poster: '/images/posters/cargo-mode-doors.webp' },
}

const CargoVersatility = () => {
  const t = useTranslations('Cargo')
  const [mode, setMode] = useState<Mode>('passenger')
  const visualRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  // Fetch/play only near the viewport; re-attach when the mode swaps the <video>.
  useInViewVideo(videoRef, true, mode)

  useEffect(
    () =>
      revealOnScroll(visualRef.current, visualRef.current, {
        opacity: [0, 1],
        translateX: [200, 0],
        scale: [0.92, 1],
        duration: 1100,
        ease: 'outQuad',
      }),
    [],
  )

  useEffect(() => {
    if (!panelRef.current || prefersReducedMotion()) return
    const animation = animate(panelRef.current, {
      opacity: [0, 1],
      translateY: [16, 0],
      duration: 400,
      ease: 'outQuad',
    })
    return () => {
      animation.revert()
    }
  }, [mode])

  return (
    <section id="cargo" className="tw:relative tw:isolate tw:overflow-hidden tw:bg-surface tw:py-20">
      <div className="tw:relative tw:z-10 tw:mx-auto tw:grid tw:max-w-6xl tw:items-start tw:gap-10 tw:px-6 tw:md:grid-cols-2">
        <div>
          <h2 className="tw:text-3xl tw:font-bold tw:text-brand-ink">{t('title')}</h2>
          <p className="tw:mt-4 tw:max-w-md tw:text-brand-ink/70">{t('intro')}</p>

          <div className="tw:mt-8 tw:flex tw:gap-3">
            <button
              type="button"
              onClick={() => setMode('passenger')}
              className={`tw:cursor-pointer tw:rounded-full tw:border-0 tw:px-5 tw:py-2.5 tw:text-sm tw:font-semibold tw:transition ${
                mode === 'passenger'
                  ? 'tw:bg-brand-blue tw:text-white'
                  : 'tw:bg-surface-raised tw:text-brand-ink/70 tw:hover:bg-surface-raised/70'
              }`}
            >
              {t('passengerMode')}
            </button>
            <button
              type="button"
              onClick={() => setMode('cargo')}
              className={`tw:cursor-pointer tw:rounded-full tw:border-0 tw:px-5 tw:py-2.5 tw:text-sm tw:font-semibold tw:transition ${
                mode === 'cargo'
                  ? 'tw:bg-brand-blue tw:text-white'
                  : 'tw:bg-surface-raised tw:text-brand-ink/70 tw:hover:bg-surface-raised/70'
              }`}
            >
              {t('cargoMode')}
            </button>
          </div>
        </div>

        <div ref={visualRef}>
          <div ref={panelRef} key={mode} className="tw:rounded-2xl tw:border tw:border-brand-ink/10 tw:bg-surface-raised tw:p-6">
            {/* Both clips are 16:9 on white — keep the full frame and the same size when switching tabs. */}
            <div className="tw:relative tw:aspect-video tw:w-full tw:overflow-hidden tw:rounded-xl tw:bg-white">
              <video
                ref={videoRef}
                muted
                loop
                playsInline
                preload="none"
                poster={MODE_MEDIA[mode].poster}
                aria-label={mode === 'passenger' ? t('passengerAlt') : t('cargoAlt')}
                className="tw:absolute tw:inset-0 tw:h-full tw:w-full tw:object-contain"
              >
                <source src={MODE_MEDIA[mode].video} type="video/mp4" />
              </video>
            </div>
            <p className="tw:mt-4 tw:text-center tw:text-sm tw:font-semibold tw:text-brand-ink/50">
              {mode === 'passenger' ? t('passengerCaption') : t('cargoCaption')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CargoVersatility
