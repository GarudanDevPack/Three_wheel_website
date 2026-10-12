'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useInViewVideo } from '@/lib/useInViewVideo'

const ColorVideoSpin = ({ src, label }: { src: string; label: string }) => {
  const t = useTranslations('Viewer')
  const videoRef = useRef<HTMLVideoElement>(null)
  // Only fetch/play the turntable once it is near the viewport.
  useInViewVideo(videoRef, true, src)

  return (
    <div className="tw:select-none">
      <div className="tw:relative tw:aspect-square tw:w-full tw:overflow-hidden tw:rounded-xl">
        <video
          ref={videoRef}
          key={src}
          muted
          loop
          playsInline
          preload="none"
          aria-label={t('turntable', { label })}
          className="tw:absolute tw:inset-0 tw:h-full tw:w-full tw:object-cover"
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>
      <div className="tw:mt-3 tw:flex tw:items-center tw:justify-center">
        <p className="tw:m-0 tw:text-xs tw:font-semibold tw:text-white/50">{t('view360')}</p>
      </div>
    </div>
  )
}

export default ColorVideoSpin
