'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, onScroll } from 'animejs'

export type ExplodedPart = {
  partName: string
  svg?: { url?: string | null; alt?: string | null } | null
  exploded?: { x?: number | null; y?: number | null; rotate?: number | null } | null
  assembled?: { x?: number | null; y?: number | null; rotate?: number | null } | null
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

const BuildSequence = ({ parts }: { parts: ExplodedPart[] }) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const partRefs = useRef<Array<HTMLDivElement | null>>([])
  const [isNearViewport, setIsNearViewport] = useState(false)

  const renderableParts = parts.filter((part) => part.svg?.url)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || renderableParts.length === 0) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true)
          observer.disconnect()
        }
      },
      { rootMargin: '400px' },
    )

    observer.observe(section)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderableParts.length])

  useEffect(() => {
    const section = sectionRef.current
    if (!isNearViewport || !section || renderableParts.length === 0) return

    const state = { progress: 0 }

    const applyProgress = () => {
      partRefs.current.forEach((el, index) => {
        if (!el) return
        const part = renderableParts[index]
        const exploded = part.exploded || {}
        const assembled = part.assembled || {}
        const x = lerp(exploded.x ?? 0, assembled.x ?? 0, state.progress)
        const y = lerp(exploded.y ?? 0, assembled.y ?? 0, state.progress)
        const rotate = lerp(exploded.rotate ?? 0, assembled.rotate ?? 0, state.progress)
        el.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`
      })
    }

    applyProgress()

    const animation = animate(state, {
      progress: 1,
      ease: 'linear',
      autoplay: onScroll({ target: section, sync: true }),
      onUpdate: applyProgress,
    })

    return () => {
      animation.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNearViewport, renderableParts])

  if (!renderableParts.length) return null

  return (
    <div
      ref={sectionRef}
      className="tw:relative"
      style={{ height: `${Math.max(renderableParts.length, 3) * 60}vh` }}
    >
      <div className="tw:sticky tw:top-0 tw:flex tw:h-screen tw:items-center tw:justify-center tw:overflow-hidden tw:bg-surface">
        <div className="tw:relative tw:h-[70vmin] tw:w-[70vmin]">
          {renderableParts.map((part, index) => (
            <div
              key={`${part.partName}-${index}`}
              ref={(el) => {
                partRefs.current[index] = el
              }}
              className="tw:absolute tw:inset-0 tw:flex tw:items-center tw:justify-center tw:will-change-transform"
            >
              {/* SVG part illustrations are user-uploaded and variable in count/size, so a plain img keeps this simple - next/image's fixed-dimension requirement doesn't fit an unknown-count exploded diagram. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={part.svg!.url!}
                alt={part.svg?.alt || part.partName}
                className="tw:max-h-full tw:max-w-full"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BuildSequence
