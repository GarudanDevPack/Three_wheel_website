'use client'

import OptimizedVideo from './OptimizedVideo'

type SectionVideoBackdropProps = {
  src: string
  webm?: string
  /** Required: shown until the clip plays, and instead of it on reduced motion / data saver. */
  poster: string
  /** soft = blurred + washed; strong = sharper; clear = sharp, washed only behind left-side text. */
  variant?: 'soft' | 'strong' | 'clear'
  base?: 'surface' | 'surface-raised'
}

/** Decorative looping clip behind a section; loading and playback rules live in OptimizedVideo. */
const SectionVideoBackdrop = ({ src, webm, poster, variant = 'soft', base = 'surface' }: SectionVideoBackdropProps) => {
  const mediaClass = {
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
      <OptimizedVideo mp4Src={src} webmSrc={webm} poster={poster} mediaClassName={mediaClass} />
      <div className={washClass} />
    </div>
  )
}

export default SectionVideoBackdrop
