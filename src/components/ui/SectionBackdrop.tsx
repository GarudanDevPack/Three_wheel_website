import Image from 'next/image'

type SectionBackdropProps = {
  src: string
  alt?: string
  variant?: 'soft' | 'strong'
  base?: 'surface' | 'surface-raised'
}

const SectionBackdrop = ({ src, alt = '', variant = 'soft', base = 'surface' }: SectionBackdropProps) => {
  const imageClass =
    variant === 'strong'
      ? 'tw:object-cover tw:opacity-35'
      : 'tw:object-cover tw:opacity-35 tw:blur-sm tw:grayscale-[15%]'

  const washClass =
    base === 'surface-raised'
      ? 'tw:absolute tw:inset-0 tw:bg-surface-raised/60'
      : 'tw:absolute tw:inset-0 tw:bg-surface/60'

  return (
    <div className="tw:pointer-events-none tw:absolute tw:inset-0 tw:overflow-hidden">
      <Image src={src} alt={alt} fill sizes="100vw" className={imageClass} />
      <div className={washClass} />
    </div>
  )
}

export default SectionBackdrop
