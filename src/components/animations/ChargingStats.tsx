'use client'

import { useEffect, useMemo, useRef } from 'react'
import { animate, stagger, onScroll } from 'animejs'
import { parseStatValue } from '@/lib/parseStatValue'

export type ChargingStat = { label: string; value: string }

const ChargingStats = ({ stats }: { stats: ChargingStat[] }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const valueRefs = useRef<Array<HTMLSpanElement | null>>([])
  const parsed = useMemo(() => stats.map((stat) => parseStatValue(stat.value)), [stats])

  useEffect(() => {
    const container = containerRef.current
    if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const items = container.querySelectorAll('[data-charging-stat]')
    const counters = parsed.map(() => ({ value: 0 }))

    // Server-rendered markup already shows the final numbers (so the section is
    // correct without JS); reset to 0 here and count up when scrolled into view.
    parsed.forEach((stat, index) => {
      const el = valueRefs.current[index]
      if (el && stat.target !== null) el.textContent = (0).toFixed(stat.decimals)
    })

    const reveal = animate(items, {
      opacity: [0, 1],
      translateY: [24, 0],
      delay: stagger(120),
      duration: 700,
      ease: 'outQuad',
      autoplay: onScroll({ target: container }),
    })

    const count = animate(counters, {
      value: (_, index) => parsed[index ?? 0].target ?? 0,
      delay: stagger(120),
      duration: 1600,
      ease: 'outExpo',
      autoplay: onScroll({ target: container }),
      onUpdate: () => {
        counters.forEach((counter, index) => {
          const el = valueRefs.current[index]
          const stat = parsed[index]
          if (el && stat.target !== null) el.textContent = counter.value.toFixed(stat.decimals)
        })
      },
    })

    return () => {
      reveal.revert()
      count.revert()
    }
  }, [parsed])

  return (
    <div ref={containerRef} className="tw:mt-10 tw:grid tw:gap-6 tw:sm:grid-cols-3">
      {stats.map((stat, index) => {
        const item = parsed[index]

        return (
          <div
            key={stat.label}
            data-charging-stat
            className="tw:border-l-2 tw:border-brand-blue/60 tw:pl-4 tw:opacity-0"
          >
            <p className="tw:m-0 tw:text-4xl tw:font-bold tw:leading-none tw:text-white tw:md:text-5xl">
              {item.target !== null ? (
                <>
                  <span
                    ref={(el) => {
                      valueRefs.current[index] = el
                    }}
                  >
                    {item.target.toFixed(item.decimals)}
                  </span>
                  {item.unit && (
                    <span className="tw:ml-1.5 tw:text-xl tw:font-semibold tw:text-white/60 tw:md:text-2xl">
                      {item.unit}
                    </span>
                  )}
                </>
              ) : (
                item.raw
              )}
            </p>
            <p className="tw:m-0 tw:mt-4 tw:max-w-[16rem] tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wide tw:text-white/50">
              {stat.label}
            </p>
          </div>
        )
      })}
    </div>
  )
}

export default ChargingStats
