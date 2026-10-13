'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { stagger } from 'animejs'
import { revealOnScroll } from '@/lib/reveal'

export type Award = {
  awardName: string
  awardImage?: { url?: string | null; alt?: string | null } | null
  year?: number | null
}

const AwardBadges = ({ awards }: { awards: Award[] }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(
    () =>
      revealOnScroll(containerRef.current, containerRef.current?.querySelectorAll('[data-award-badge]'), {
        opacity: [0, 1],
        translateY: [20, 0],
        delay: stagger(80),
        duration: 500,
        ease: 'outQuad',
      }),
    [],
  )

  return (
    <div
      ref={containerRef}
      className="tw:mt-8 tw:flex tw:flex-wrap tw:items-center tw:justify-center tw:gap-8"
    >
      {awards.map((award, index) => (
        <div
          key={`${award.awardName}-${index}`}
          data-award-badge
          className="tw:flex tw:flex-col tw:items-center tw:gap-2"
        >
          {award.awardImage?.url ? (
            <div className="tw:relative tw:h-16 tw:w-16">
              <Image
                src={award.awardImage.url}
                alt={award.awardImage.alt || award.awardName}
                fill
                sizes="64px"
                className="tw:object-contain"
              />
            </div>
          ) : (
            <div className="tw:flex tw:h-16 tw:w-16 tw:items-center tw:justify-center tw:rounded-full tw:bg-surface tw:text-2xl">
              🏆
            </div>
          )}
          <p className="tw:max-w-[8rem] tw:text-center tw:text-xs tw:font-semibold tw:text-brand-ink">
            {award.awardName}
          </p>
          {award.year && <p className="tw:text-xs tw:text-brand-ink/50">{award.year}</p>}
        </div>
      ))}
    </div>
  )
}

export default AwardBadges
