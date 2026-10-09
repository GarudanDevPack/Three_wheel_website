'use client'

import { useEffect, type RefObject } from 'react'

/**
 * Plays a muted background video only while it is near the viewport and pauses it otherwise.
 * Pair with `preload="none"` (and no `autoPlay`) so nothing downloads until the section is close.
 * Skipped entirely for `prefers-reduced-motion`, leaving the poster in place.
 */
export function useInViewVideo(ref: RefObject<HTMLVideoElement | null>, enabled = true) {
  useEffect(() => {
    const video = ref.current
    if (!enabled || !video) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { rootMargin: '200px 0px' },
    )
    observer.observe(video)

    return () => observer.disconnect()
  }, [ref, enabled])
}
