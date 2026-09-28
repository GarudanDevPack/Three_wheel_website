'use client'

import { useEffect, useRef, useState } from 'react'
import { createDrawable, animate, stagger, onScroll } from 'animejs'

const MechanismSketch = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
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

    const drawables = createDrawable('.sketch-line')
    const animation = animate(drawables, {
      draw: ['0 0', '0 1'],
      delay: stagger(150),
      duration: 900,
      ease: 'inOutQuad',
      autoplay: onScroll({ target: section }),
    })

    return () => {
      animation.revert()
    }
  }, [isNearViewport])

  return (
    <section id="mechanism-sketch" className="tw:bg-surface-raised tw:py-20">
      <div className="tw:mx-auto tw:grid tw:max-w-6xl tw:items-center tw:gap-10 tw:px-6 tw:md:grid-cols-2">
        <div>
          <p className="tw:text-sm tw:font-semibold tw:uppercase tw:tracking-widest tw:text-brand-blue-light">
            Design
          </p>
          <p className="tw:mt-2 tw:text-lg tw:font-bold tw:text-brand-blue-light">
            Built for every job
          </p>
          <h2 className="tw:mt-3 tw:text-3xl tw:font-bold tw:text-white">One vehicle, many jobs</h2>
          <p className="tw:mt-4 tw:max-w-md tw:text-white/70">
            Switch between passenger and cargo mode in seconds — the same Neptune adapts to
            whatever the day needs.
          </p>
        </div>

        <div ref={sectionRef} className="tw:mx-auto tw:w-full tw:max-w-lg tw:rounded-2xl tw:border tw:border-white/10 tw:bg-surface tw:p-8">
          <svg viewBox="0 0 300 160" className="tw:h-auto tw:w-full" fill="none" aria-hidden="true">
            <defs>
              <marker id="sketch-arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                <path d="M0 0 L8 4 L0 8 Z" fill="#3b82f6" />
              </marker>
            </defs>
            <path
              className="sketch-line"
              d="M20 120 L20 90 Q20 70 40 65 L70 65 L95 35 L180 35 Q200 35 205 55 L215 90 L270 90 Q280 90 280 100 L280 120"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle className="sketch-line" cx="55" cy="120" r="18" stroke="#3b82f6" strokeWidth="2" />
            <circle className="sketch-line" cx="230" cy="120" r="18" stroke="#3b82f6" strokeWidth="2" />
            <rect
              className="sketch-line"
              x="150"
              y="70"
              width="50"
              height="35"
              rx="4"
              stroke="#3b82f6"
              strokeWidth="2"
            />
            <path
              className="sketch-line"
              d="M175 68 Q185 42 208 42"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              markerEnd="url(#sketch-arrow)"
            />
          </svg>
        </div>
      </div>
    </section>
  )
}

export default MechanismSketch
