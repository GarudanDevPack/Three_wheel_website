'use client'

import { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'
import { prefersReducedMotion } from '@/lib/reveal'
import { onIntroDone } from '@/lib/intro'

export type Stat = { label: string; value: number; unit?: string }

const StatCounters = ({ stats }: { stats: Stat[] }) => {
  const valueRefs = useRef<Array<HTMLSpanElement | null>>([])

  useEffect(() => {
    if (!stats.length || prefersReducedMotion()) return

    const targets = stats.map(() => ({ value: 0 }))
    // Keep the source's decimal places (e.g. 27.8 %), so the counter never rounds a published figure.
    const decimals = stats.map((stat) => (String(stat.value).split('.')[1] || '').length)
    const render = () =>
      targets.forEach((target, index) => {
        const el = valueRefs.current[index]
        if (el) el.textContent = target.value.toFixed(decimals[index])
      })

    // Start from 0 under the loading screen, then count up once it has faded so the visitor sees it.
    render()
    let animation: ReturnType<typeof animate> | undefined
    const stopWaiting = onIntroDone(() => {
      animation = animate(targets, {
        value: (_, index) => stats[index ?? 0].value,
        delay: stagger(120),
        duration: 1600,
        ease: 'outExpo',
        onUpdate: render,
      })
    })

    return () => {
      stopWaiting()
      animation?.revert()
      // Unmounting mid-count: put the real figures back.
      stats.forEach((stat, index) => {
        const el = valueRefs.current[index]
        if (el) el.textContent = String(stat.value)
      })
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
              {/* Real figure in the HTML (crawlers, no-JS, reduced motion); the effect counts up to it. */}
              {stat.value}
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
