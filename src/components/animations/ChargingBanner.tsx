'use client'

import { useEffect, useMemo, useRef } from 'react'
import { createDrawable, createMotionPath, animate, onScroll } from 'animejs'
import { parseStatValue } from '@/lib/parseStatValue'

const ROUTE_ID = 'charging-route-path'

const ChargingBanner = ({ rangeLabel }: { rangeLabel: string }) => {
  const bannerRef = useRef<HTMLDivElement>(null)
  const calloutRef = useRef<HTMLDivElement>(null)
  const rangeValueRef = useRef<HTMLSpanElement>(null)
  const dot1Ref = useRef<SVGCircleElement>(null)
  const dot2Ref = useRef<SVGCircleElement>(null)
  const range = useMemo(() => parseStatValue(rangeLabel), [rangeLabel])

  useEffect(() => {
    const banner = bannerRef.current
    if (!banner || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cancelled = false
    const animations: Array<{ revert: () => unknown }> = []
    const dots = [dot1Ref.current, dot2Ref.current].filter(
      (dot): dot is SVGCircleElement => dot !== null,
    )

    // Range callout: SSR shows the final number; reset and count up on scroll.
    const counter = { value: 0 }
    const rangeEl = rangeValueRef.current
    if (rangeEl && range.target !== null) rangeEl.textContent = (0).toFixed(range.decimals)

    if (calloutRef.current) {
      animations.push(
        animate(calloutRef.current, {
          opacity: [0, 1],
          translateY: [24, 0],
          duration: 700,
          ease: 'outQuad',
          autoplay: onScroll({ target: banner }),
        }),
      )
    }

    if (rangeEl && range.target !== null) {
      animations.push(
        animate(counter, {
          value: range.target,
          duration: 1800,
          ease: 'outExpo',
          autoplay: onScroll({ target: banner }),
          onUpdate: () => {
            rangeEl.textContent = counter.value.toFixed(range.decimals)
          },
        }),
      )
    }

    // Route line draws in on scroll; the flowing current appears only once the
    // line exists, so dots never travel over an empty road.
    animations.push(
      animate(createDrawable(`#${ROUTE_ID}`), {
        draw: ['0 0', '0 1'],
        duration: 1800,
        ease: 'inOutQuad',
        autoplay: onScroll({ target: banner }),
        onComplete: () => {
          if (cancelled || !dots.length) return
          animations.push(animate(dots, { opacity: [0, 1], duration: 500, ease: 'outQuad' }))
        },
      }),
    )

    // Motion-path translate values are absolute SVG coordinates, so the dots stay
    // at the SVG origin (hidden via opacity) and the second one is phase-shifted
    // by half the route instead of using a delay.
    dots.forEach((dot, index) => {
      animations.push(
        animate(dot, {
          ...createMotionPath(`#${ROUTE_ID}`, index * 0.5),
          duration: 3600,
          loop: true,
          ease: 'linear',
        }),
      )
    })

    return () => {
      cancelled = true
      animations.forEach((animation) => animation.revert())
    }
  }, [range])

  return (
    <div
      ref={bannerRef}
      className="tw:rounded-2xl tw:border tw:border-white/10 tw:bg-brand-ink/50 tw:p-6 tw:backdrop-blur-sm tw:md:p-8"
    >
      <div ref={calloutRef} className="tw:opacity-0 tw:md:text-right">
        <p className="tw:m-0 tw:text-sm tw:font-semibold tw:uppercase tw:tracking-widest tw:text-brand-blue-light">
          Range
        </p>
        <p className="tw:m-0 tw:mt-2 tw:text-5xl tw:font-bold tw:leading-none tw:text-white tw:md:text-6xl">
          {range.target !== null ? (
            <>
              <span ref={rangeValueRef}>{range.target.toFixed(range.decimals)}</span>
              {range.unit && (
                <span className="tw:ml-2 tw:text-xl tw:font-semibold tw:text-white/70">
                  {range.unit}
                </span>
              )}
            </>
          ) : (
            range.raw
          )}
        </p>
        <p className="tw:m-0 tw:mt-2 tw:text-white/70">on a single full charge</p>
      </div>

      <svg viewBox="0 0 1100 150" className="tw:mt-6 tw:h-auto tw:w-full" fill="none" aria-hidden="true">
        <path
          id={ROUTE_ID}
          d="M64 112 C 210 112, 250 58, 410 62 S 650 122, 790 94 S 980 30, 1040 34"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 6px rgba(59,130,246,0.7))' }}
        />
        <circle
          ref={dot1Ref}
          r="5"
          fill="#bcd6ff"
          opacity="0"
          style={{ filter: 'drop-shadow(0 0 5px #8fb8ff)' }}
        />
        <circle
          ref={dot2Ref}
          r="5"
          fill="#bcd6ff"
          opacity="0"
          style={{ filter: 'drop-shadow(0 0 5px #8fb8ff)' }}
        />
        <circle cx="64" cy="112" r="6" fill="#3b82f6" />
        <g className="charger-pulse">
          <rect x="14" y="98" width="46" height="30" rx="7" stroke="#3b82f6" strokeWidth="3" />
          <path d="M28 98 L28 86 M46 98 L46 86" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
        </g>
        <circle cx="1040" cy="34" r="6" fill="white" />
        <g className="charger-pulse">
          <circle cx="1040" cy="34" r="12" stroke="white" strokeWidth="1.5" opacity="0.5" />
        </g>
      </svg>
    </div>
  )
}

export default ChargingBanner
