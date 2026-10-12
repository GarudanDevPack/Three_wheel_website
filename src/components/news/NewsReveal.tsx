'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { animate, stagger } from 'animejs'

/**
 * Staggered reveal for `[data-news-card]` children — progressive enhancement only.
 * Cards render visible in the HTML; they are hidden and animated in only when the browser can
 * observe the section and motion is allowed, with a safety timeout so they can never stay hidden.
 */
const NewsReveal = ({ children, className }: { children: ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current
    const cards = container ? Array.from(container.querySelectorAll<HTMLElement>('[data-news-card]')) : []
    if (!container || !cards.length) return
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Already on screen (e.g. reload mid-page): leave the cards as they are.
    const rect = container.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) return

    cards.forEach((card) => {
      card.style.opacity = '0'
      card.style.transform = 'translateY(32px)'
    })

    let revealed = false
    const reveal = () => {
      if (revealed) return
      revealed = true
      animate(cards, {
        opacity: [0, 1],
        translateY: [32, 0],
        delay: stagger(110),
        duration: 600,
        ease: 'outQuad',
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          reveal()
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(container)

    return () => {
      observer.disconnect()
      // Never leave cards hidden after unmount / fast navigation.
      cards.forEach((card) => {
        card.style.opacity = ''
        card.style.transform = ''
      })
    }
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

export default NewsReveal
