'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

type OptimizedVideoProps = {
  mp4Src: string
  /** Optional VP9/AV1 version; listed first so browsers that support it pick the smaller file. */
  webmSrc?: string | null
  /**
   * Shown until the video plays, and instead of it for reduced-motion / data-saver visitors. Every clip
   * shipped with the site has one; only a CMS upload without a poster falls back to an empty box.
   */
  poster?: string | null
  /** `sizes` for the poster image (it fills the box). */
  posterSizes?: string
  /** Hero only: poster is preloaded as the LCP image and the video starts after the page has loaded. */
  priority?: boolean
  /** Box around poster + video (position it; it gets `relative overflow-hidden` if not absolute). */
  className?: string
  /** Fit/position/effects for both the poster and the video, e.g. "tw:object-cover tw:opacity-50". */
  mediaClassName?: string
  /** Meaningful video: announced with this label. Without it the video is decorative (aria-hidden). */
  ariaLabel?: string
}

/**
 * At most this many videos play at once. Starting another pauses the one that started first; a paused
 * video that is still on screen resumes when a slot frees up.
 */
const MAX_PLAYING = 2
const playing: HTMLVideoElement[] = []
const onScreen = new Set<HTMLVideoElement>()

const play = (video: HTMLVideoElement) =>
  video.play().catch(() => {
    // Autoplay can be refused (power saving, browser policy): the poster simply stays.
  })

const startPlayback = (video: HTMLVideoElement) => {
  onScreen.add(video)
  if (!playing.includes(video)) {
    playing.push(video)
    while (playing.length > MAX_PLAYING) playing.shift()?.pause()
  }
  play(video)
}

const stopPlayback = (video: HTMLVideoElement) => {
  onScreen.delete(video)
  const index = playing.indexOf(video)
  if (index >= 0) playing.splice(index, 1)
  video.pause()
  // Hand the free slot to the most recently shown video that is waiting.
  const waiting = [...onScreen].reverse().find((other) => !playing.includes(other))
  if (waiting && playing.length < MAX_PLAYING) {
    playing.push(waiting)
    play(waiting)
  }
}

/**
 * Visitors who asked for less motion or less data, or are on a slow connection, only get the poster.
 * The hero clip (0.7 MB) still plays on connections Chrome rates "3g", which is common on Sri Lankan
 * mobile networks; the other clips wait for a faster one.
 */
const mayLoadVideo = (hero: boolean) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
    .connection
  if (connection?.saveData) return false
  const tooSlow = hero ? ['slow-2g', '2g'] : ['slow-2g', '2g', '3g']
  return !tooSlow.includes(connection?.effectiveType ?? '')
}

/**
 * Below-the-hero clips wait for the visitor's first scroll / tap / key press, so the first screen only
 * ever downloads the hero video (a backdrop peeking in at the bottom of a phone screen does not count).
 */
let engaged = false
const engagedCallbacks = new Set<() => void>()
const onEngaged = (callback: () => void) => {
  if (engaged) {
    callback()
    return () => {}
  }
  if (!engagedCallbacks.size) {
    const engage = () => {
      engaged = true
      events.forEach((name) => window.removeEventListener(name, engage))
      engagedCallbacks.forEach((cb) => cb())
      engagedCallbacks.clear()
    }
    const events = ['scroll', 'pointerdown', 'keydown', 'touchstart'] as const
    events.forEach((name) => window.addEventListener(name, engage, { passive: true }))
  }
  engagedCallbacks.add(callback)
  return () => engagedCallbacks.delete(callback)
}

/** Resolves once the page has finished loading and the browser is idle (keeps the hero video off the LCP path). */
const afterPageLoad = (callback: () => void) => {
  let cancelled = false
  const idle = () => {
    const run = () => !cancelled && callback()
    if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 2000 })
    else setTimeout(run, 200)
  }
  if (document.readyState === 'complete') idle()
  else window.addEventListener('load', idle, { once: true })
  return () => {
    cancelled = true
    window.removeEventListener('load', idle)
  }
}

/**
 * The one way to put a video on the site: poster first (next/image, lazy unless `priority`), sources
 * attached only when the video is about to be seen, paused off-screen, never loaded under reduced
 * motion / data saver / slow connections. Swap clips by changing `key`, not the src props.
 */
const OptimizedVideo = ({
  mp4Src,
  webmSrc,
  poster,
  posterSizes = '100vw',
  priority = false,
  className = 'tw:absolute tw:inset-0',
  mediaClassName = 'tw:object-cover',
  ariaLabel,
}: OptimizedVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [sourcesOn, setSourcesOn] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !mayLoadVideo(priority)) return

    let visible = false
    // Hero: after the page `load` event. Everything else: after the visitor's first scroll/tap.
    let ready = false
    const sync = () => {
      if (!ready) return
      if (visible) {
        setSourcesOn(true)
        startPlayback(video)
      } else {
        stopPlayback(video)
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        sync()
      },
      { rootMargin: '200px 0px' },
    )
    observer.observe(video)
    const markReady = () => {
      ready = true
      sync()
    }
    const cancelWait = priority ? afterPageLoad(markReady) : onEngaged(markReady)

    return () => {
      cancelWait()
      observer.disconnect()
      stopPlayback(video)
    }
  }, [priority])

  // New <source> children only take effect after load(); then resume if it should be playing.
  useEffect(() => {
    const video = videoRef.current
    if (!sourcesOn || !video) return
    video.load()
    if (playing.includes(video)) play(video)
  }, [sourcesOn])

  const box = className.includes('absolute') || className.includes('fixed') ? className : `tw:relative ${className}`

  return (
    <div className={`${box} tw:overflow-hidden`} aria-hidden={ariaLabel ? undefined : true}>
      {poster && <Image src={poster} alt="" fill priority={priority} sizes={posterSizes} className={mediaClassName} />}
      {/* Fade wrapper, so effect classes on the video itself (opacity, blur) are left alone. */}
      <div
        className={`tw:absolute tw:inset-0 tw:transition-opacity tw:duration-500 tw:motion-reduce:transition-none ${
          isPlaying ? 'tw:opacity-100' : 'tw:opacity-0'
        }`}
      >
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload={priority ? 'metadata' : 'none'}
          aria-label={ariaLabel}
          onPlaying={() => setIsPlaying(true)}
          className={`tw:absolute tw:inset-0 tw:h-full tw:w-full ${mediaClassName}`}
        >
          {sourcesOn && webmSrc && <source src={webmSrc} type="video/webm" />}
          {sourcesOn && <source src={mp4Src} type="video/mp4" />}
        </video>
      </div>
    </div>
  )
}

export default OptimizedVideo
