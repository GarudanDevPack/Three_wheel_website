'use client'

import { useTranslations } from 'next-intl'
import OptimizedVideo from '@/components/ui/OptimizedVideo'

type ColorVideoSpinProps = { src: string; webm?: string | null; poster?: string | null; label: string }

const ColorVideoSpin = ({ src, webm, poster, label }: ColorVideoSpinProps) => {
  const t = useTranslations('Viewer')

  return (
    <div className="tw:select-none">
      <OptimizedVideo
        key={src}
        mp4Src={src}
        webmSrc={webm}
        poster={poster}
        posterSizes="(min-width: 768px) 420px, 90vw"
        className="tw:relative tw:aspect-square tw:w-full tw:rounded-xl"
        ariaLabel={t('turntable', { label })}
      />
      <div className="tw:mt-3 tw:flex tw:items-center tw:justify-center">
        <p className="tw:m-0 tw:text-xs tw:font-semibold tw:text-white/50">{t('view360')}</p>
      </div>
    </div>
  )
}

export default ColorVideoSpin
