'use client'

import { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'

export type Stat = { label: string; value: number; unit?: string }

const StatCounters = ({ stats }: { stats: Stat[] }) => {
  const valueRefs = useRef<Array<HTMLSpanElement | null>>([])

  useEffect(() => {
    if (!stats.length) return

    const targets = stats.map(() => ({ value: 0 }))

    const animation = animate(targets, {
      value: (_, index) => stats[index ?? 0].value,
      delay: stagger(100),
      duration: 1200,
      ease: 'outExpo',
      onUpdate: () => {
        targets.forEach((target, index) => {
          const el = valueRefs.current[index]
          if (el) el.textContent = String(Math.round(target.value))
        })
      },
    })

    return () => {
      animation.revert()
    }
  }, [stats])

  if (!stats.length) return null

  return (
    <div className="tw:mt-8 tw:grid tw:grid-cols-2 tw:gap-x-6 tw:gap-y-4 tw:sm:grid-cols-4">
      {stats.map((stat, index) => (
        <div key={stat.label}>
          <p className="tw:text-2xl tw:font-bold tw:text-white">
            <span
              ref={(el) => {
                valueRefs.current[index] = el
              }}
            >
              0
            </span>
            {stat.unit && (
              <span className="tw:ml-1 tw:text-base tw:font-semibold tw:text-white/70">
                {stat.unit}
              </span>
            )}
          </p>
          <p className="tw:mt-1 tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wide tw:text-white/50">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  )
}

export default StatCounters
