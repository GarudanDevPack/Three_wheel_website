'use client'

import { useRef } from 'react'
import { useInViewVideo } from '@/lib/useInViewVideo'

type SectionVideoBackdropProps = {
  src: string
  /** soft = blurred + washed; strong = sharper; clear = sharp, washed only behind left-side text. */
  variant?: 'soft' | 'strong' | 'clear'
  base?: 'surface' | 'surface-raised'
  poster?: string
  /** Defer download/playback until the section is near the viewport (for below-the-fold sections). */
  lazy?: boolean
}

const SectionVideoBackdrop = ({ src, variant = 'soft', base = 'surface', poster, lazy = false }: SectionVideoBackdropProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  useInViewVideo(videoRef, lazy)

  const videoClass = {
    soft: 'tw:object-cover tw:opacity-50 tw:blur-[2px]',
    strong: 'tw:object-cover tw:opacity-60',
    clear: 'tw:object-cover tw:opacity-90',
  }[variant]

  const raised = base === 'surface-raised'
  const washClass =
    variant === 'clear'
      ? // Mobile: even wash (text spans full width). Desktop: fade only behind the left text column.
        raised
        ? 'tw:absolute tw:inset-0 tw:bg-surface-raised/60 tw:md:bg-transparent tw:md:bg-gradient-to-r tw:md:from-surface-raised/85 tw:md:via-surface-raised/35 tw:md:to-surface-raised/10'
        : 'tw:absolute tw:inset-0 tw:bg-surface/60 tw:md:bg-transparent tw:md:bg-gradient-to-r tw:md:from-surface/85 tw:md:via-surface/35 tw:md:to-surface/10'
      : raised
        ? 'tw:absolute tw:inset-0 tw:bg-surface-raised/40'
        : 'tw:absolute tw:inset-0 tw:bg-surface/40'

  return (
    <div className="tw:pointer-events-none tw:absolute tw:inset-0 tw:overflow-hidden">
      <video
        ref={videoRef}
        autoPlay={!lazy}
        preload={lazy ? 'none' : undefined}
        poster={poster}
        muted
        loop
        playsInline
        aria-hidden="true"
        className={`tw:absolute tw:inset-0 tw:h-full tw:w-full ${videoClass}`}
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className={washClass} />
    </div>
  )
}

export default SectionVideoBackdrop
