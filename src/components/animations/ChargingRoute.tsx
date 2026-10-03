'use client'

import { useEffect, useRef, useState } from 'react'
import { createDrawable, createMotionPath, animate, onScroll } from 'animejs'

const ChargingRoute = ({ rangeLabel }: { rangeLabel: string }) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const dot1Ref = useRef<SVGCircleElement>(null)
  const dot2Ref = useRef<SVGCircleElement>(null)
  const [isNearViewport, setIsNearViewport] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

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
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!isNearViewport || !section) return

    const drawables = createDrawable('#charging-route-path')
    const drawAnimation = animate(drawables, {
      draw: ['0 0', '0 1'],
      duration: 1400,
      ease: 'inOutQuad',
      autoplay: onScroll({ target: section }),
    })

    // Two dots flowing along the route, offset by half a cycle so they read
    // as a continuous stream of "current" rather than one lonely dot.
    const flowAnimations = [dot1Ref.current, dot2Ref.current]
      .filter((dot): dot is SVGCircleElement => dot !== null)
      .map((dot, index) =>
        animate(dot, {
          ...createMotionPath('#charging-route-path'),
          duration: 2500,
          delay: index * 1250,
          loop: true,
          ease: 'linear',
        }),
      )

    return () => {
      drawAnimation.revert()
      flowAnimations.forEach((animation) => animation.revert())
    }
  }, [isNearViewport])

  return (
    <div ref={sectionRef} className="tw:relative tw:mx-auto tw:aspect-[4/3] tw:w-full tw:max-w-md">
      <svg viewBox="0 0 320 240" className="tw:h-full tw:w-full" fill="none" aria-hidden="true">
        <path
          id="charging-route-path"
          d="M40 200 C 90 200, 70 130, 120 120 S 180 60, 230 55 S 270 40, 280 30"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle ref={dot1Ref} r="3.5" fill="#8fb8ff" />
        <circle ref={dot2Ref} r="3.5" fill="#8fb8ff" />
        <circle cx="40" cy="200" r="6" fill="#3b82f6" className="charger-pulse" />
        <g transform="translate(226, 4) scale(0.6)" opacity="0.7">
          <path
            d="M4 24 L4 16 Q4 12 8 12 L14 12 L19 6 L34 6 Q38 6 39 10 L41 16 L44 16 Q46 16 46 18 L46 24"
            stroke="#2563eb"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="13" cy="24" r="4.5" stroke="#2563eb" strokeWidth="2.4" />
          <circle cx="37" cy="24" r="4.5" stroke="#2563eb" strokeWidth="2.4" />
        </g>
        <circle cx="280" cy="30" r="5" fill="#2563eb" />
        <circle cx="280" cy="30" r="9" stroke="#2563eb" strokeWidth="1.5" opacity="0.5" />
      </svg>
      <span className="tw:absolute tw:right-0 tw:top-16 tw:text-sm tw:font-semibold tw:text-brand-ink">
        {rangeLabel}
      </span>
    </div>
  )
}

export default ChargingRoute
