import Image from 'next/image'

type SectionBackdropProps = {
  src: string
  variant: 'soft' | 'strong'
  base: 'surface' | 'raised'
  position?: string
}

const fadeFrom = {
  surface: 'tw:from-surface',
  raised: 'tw:from-surface-raised',
} as const

// Decorative photo behind a section. The parent <section> must be
// `relative isolate overflow-hidden`; the negative z-index keeps the backdrop
// above the section's own background but under all of its in-flow content.
const SectionBackdrop = ({ src, variant, base, position }: SectionBackdropProps) => (
  <div aria-hidden="true" className="tw:pointer-events-none tw:absolute tw:inset-0 tw:-z-10">
    <Image
      src={src}
      alt=""
      fill
      sizes="100vw"
      quality={45}
      style={position ? { objectPosition: position } : undefined}
      className={
        variant === 'soft'
          ? 'tw:scale-105 tw:object-cover tw:opacity-30 tw:blur-[3px] tw:saturate-75'
          : 'tw:object-cover'
      }
    />

    {variant === 'soft' ? (
      <div className="tw:absolute tw:inset-0 tw:bg-brand-ink/55" />
    ) : (
      <>
        <div className="tw:absolute tw:inset-0 tw:bg-gradient-to-t tw:from-brand-ink tw:via-brand-ink/75 tw:to-brand-ink/45" />
        <div className="tw:absolute tw:inset-0 tw:bg-gradient-to-r tw:from-brand-ink/70 tw:via-transparent tw:to-brand-ink/70" />
      </>
    )}

    <div className={`tw:absolute tw:inset-x-0 tw:top-0 tw:h-24 tw:bg-gradient-to-b ${fadeFrom[base]} tw:to-transparent`} />
    <div className={`tw:absolute tw:inset-x-0 tw:bottom-0 tw:h-24 tw:bg-gradient-to-t ${fadeFrom[base]} tw:to-transparent`} />
  </div>
)

export default SectionBackdrop
