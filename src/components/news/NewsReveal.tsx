'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { stagger } from 'animejs'
import { revealOnScroll } from '@/lib/reveal'

/** Staggered reveal for `[data-news-card]` children — progressive enhancement only (see revealOnScroll). */
const NewsReveal = ({ children, className }: { children: ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(
    () =>
      revealOnScroll(ref.current, ref.current?.querySelectorAll('[data-news-card]'), {
        opacity: [0, 1],
        translateY: [32, 0],
        delay: stagger(110),
        duration: 600,
        ease: 'outQuad',
      }),
    [],
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

export default NewsReveal
