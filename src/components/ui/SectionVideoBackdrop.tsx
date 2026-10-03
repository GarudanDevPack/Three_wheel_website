type SectionVideoBackdropProps = {
  src: string
  variant?: 'soft' | 'strong'
  base?: 'surface' | 'surface-raised'
}

const SectionVideoBackdrop = ({ src, variant = 'soft', base = 'surface' }: SectionVideoBackdropProps) => {
  const videoClass =
    variant === 'strong'
      ? 'tw:object-cover tw:opacity-60'
      : 'tw:object-cover tw:opacity-50 tw:blur-[2px]'

  const washClass =
    base === 'surface-raised'
      ? 'tw:absolute tw:inset-0 tw:bg-surface-raised/40'
      : 'tw:absolute tw:inset-0 tw:bg-surface/40'

  return (
    <div className="tw:pointer-events-none tw:absolute tw:inset-0 tw:overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className={`tw:absolute tw:inset-0 tw:h-full tw:w-full ${videoClass}`}
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className={washClass} />
    </div>
  )
}

export default SectionVideoBackdrop
