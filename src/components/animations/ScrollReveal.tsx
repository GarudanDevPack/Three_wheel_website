'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { revealOnScroll } from '@/lib/reveal'

type ScrollRevealProps = {
  children: ReactNode
  delay?: number
  className?: string
}

/** Fade-up on scroll; content stays visible in the HTML (see revealOnScroll). `delay` is in seconds. */
const ScrollReveal = ({ children, delay = 0, className }: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(
    () =>
      revealOnScroll(
        ref.current,
        ref.current,
        { opacity: [0, 1], translateY: [32, 0], duration: 600, delay: delay * 1000, ease: 'outQuad' },
        '0px 0px -80px 0px',
      ),
    [delay],
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

export default ScrollReveal
