'use client'

import { useTranslations } from 'next-intl'

const ColorVideoSpin = ({ src, label }: { src: string; label: string }) => {
  const t = useTranslations('Viewer')

  return (
    <div className="tw:select-none">
      <div className="tw:relative tw:aspect-square tw:w-full tw:overflow-hidden tw:rounded-xl">
        <video
          autoPlay
          muted
          loop
          playsInline
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
