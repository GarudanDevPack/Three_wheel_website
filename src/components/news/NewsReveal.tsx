'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { animate, stagger, onScroll } from 'animejs'

/** Staggered scroll-in for any `[data-news-card]` children — same idiom as the Gallery/Accessories grids. */
const NewsReveal = ({ children, className }: { children: ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current
    const cards = container?.querySelectorAll('[data-news-card]')
    if (!container || !cards?.length) return

    const animation = animate(cards, {
      opacity: [0, 1],
      translateY: [36, 0],
      delay: stagger(110),
      duration: 600,
      ease: 'outQuad',
      autoplay: onScroll({ target: container }),
    })
    return () => {
      animation.revert()
    }
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

export default NewsReveal
