'use client'

import { useEffect, useRef, useState } from 'react'
import { animate } from 'animejs'
import { type AngleImage } from '@/components/animations/ColorSpin360'
import ColorSpin360 from '@/components/animations/LazyColorSpin360'
import ColorVideoSpin from '@/components/animations/LazyColorVideoSpin'

export type ShowcaseColor = {
  colorName: string
  swatchHex?: string | null
  video?: string | null
  angleImages?: AngleImage[] | null
}

const ColorShowcase = ({ colors }: { colors: ShowcaseColor[] }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)
  const active = colors[activeIndex] || colors[0]

  useEffect(() => {
    if (!panelRef.current) return
    const animation = animate(panelRef.current, {
      opacity: [0, 1],
      translateY: [16, 0],
      duration: 400,
      ease: 'outQuad',
    })
    return () => {
      animation.revert()
    }
  }, [activeIndex])

  if (!colors.length || !active) return null

  return (
    <div className="tw:flex tw:flex-col tw:items-center tw:gap-5 tw:md:flex-row tw:md:items-center tw:md:justify-center">
      <div
        key={active.colorName}
        ref={panelRef}
        className="tw:w-full tw:max-w-md tw:overflow-hidden tw:rounded-2xl tw:border tw:border-brand-blue-light/20 tw:bg-brand-ink tw:p-4 tw:shadow-[0_0_24px_-6px_rgba(56,225,255,0.35)]"
      >
        {active.video ? (
          <ColorVideoSpin src={active.video} label={active.colorName} />
        ) : (
          <ColorSpin360 images={active.angleImages || []} label={active.colorName} dark />
        )}
        <p className="tw:mt-3 tw:border-t tw:border-white/10 tw:pt-3 tw:text-center tw:text-sm tw:font-semibold tw:text-white">
          {active.colorName}
        </p>
      </div>

      {colors.length > 1 && (
        <div className="tw:flex tw:flex-row tw:gap-3 tw:md:flex-col">
          {colors.map((color, index) => (
            <button
              key={color.colorName}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={color.colorName}
              title={color.colorName}
              className={`tw:h-8 tw:w-8 tw:rounded-full tw:border-2 tw:transition ${
                index === activeIndex ? 'tw:border-brand-ink' : 'tw:border-brand-ink/20'
              }`}
              style={{ backgroundColor: color.swatchHex || '#999' }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ColorShowcase
