'use client'

import { useEffect, useRef, useState, type PointerEvent } from 'react'
import Image from 'next/image'
import { animate, createAnimatable, type AnimatableObject } from 'animejs'

export type AngleImage = {
  angleLabel?: string | null
  image?: { url?: string | null; alt?: string | null } | null
}

const dragThreshold = 60
const maxTilt = 22
const idleSwingAngle = 7
const idleSwingIntervalMs = 1400

const ColorSpin360 = ({ images, label }: { images: AngleImage[]; label: string }) => {
  const [index, setIndex] = useState(0)
  const dragStartX = useRef<number | null>(null)
  const isDraggingRef = useRef(false)
  const tiltRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const peekRef = useRef<HTMLDivElement>(null)
  const animatableRef = useRef<AnimatableObject | null>(null)
  const peekAnimatableRef = useRef<AnimatableObject | null>(null)
  const isAnimatingRef = useRef(false)
  const dragDirectionRef = useRef<1 | -1>(1)
  const dragProgressRef = useRef(0)
  const [peekIndex, setPeekIndex] = useState<number | null>(null)
  const spinIndicatorRef = useRef<HTMLSpanElement>(null)
  const hoverIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const frames = images.filter((frame) => frame?.image?.url)
  const isTiltMode = frames.length === 1

  useEffect(() => {
    if (!isTiltMode || !tiltRef.current) return

    const animatable = createAnimatable(tiltRef.current, {
      rotateY: 1100,
      ease: 'inOut(2)',
    })
    animatableRef.current = animatable

    // Continuous gentle sway so the card is always visibly "alive," rather
    // than relying on a one-shot hint that's easy to miss on first load.
    let direction: 1 | -1 = 1
    let timeoutId: ReturnType<typeof setTimeout>

    const swing = () => {
      if (!isDraggingRef.current) {
        animatable.rotateY(direction * idleSwingAngle)
        direction = direction === 1 ? -1 : 1
      }
      timeoutId = setTimeout(swing, idleSwingIntervalMs)
    }
    timeoutId = setTimeout(swing, 500)

    return () => {
      clearTimeout(timeoutId)
      animatable.revert()
      animatableRef.current = null
    }
  }, [isTiltMode])

  useEffect(() => {
    if (isTiltMode || frames.length <= 1 || !peekRef.current) return

    const animatable = createAnimatable(peekRef.current, {
      opacity: 200,
      ease: 'outQuad',
    })
    peekAnimatableRef.current = animatable

    return () => {
      animatable.revert()
      peekAnimatableRef.current = null
    }
  }, [isTiltMode, frames.length])

  useEffect(() => {
    return () => {
      if (hoverIntervalRef.current) clearInterval(hoverIntervalRef.current)
    }
  }, [])

  if (!frames.length) return null

  const current = frames[index % frames.length]

  const step = (direction: 1 | -1) => {
    const advance = () => setIndex((prev) => (prev + direction + frames.length) % frames.length)

    if (isAnimatingRef.current || !frameRef.current) {
      advance()
      return
    }

    isAnimatingRef.current = true
    animate(frameRef.current, {
      opacity: [1, 0],
      duration: 100,
      ease: 'inQuad',
      onComplete: () => {
        advance()
        animate(frameRef.current!, {
          opacity: [0, 1],
          duration: 200,
          ease: 'outQuad',
          onComplete: () => {
            isAnimatingRef.current = false
          },
        })
      },
    })
  }

  const stopHoverCycle = () => {
    if (hoverIntervalRef.current) {
      clearInterval(hoverIntervalRef.current)
      hoverIntervalRef.current = null
    }
  }

  const handlePointerEnter = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || isTiltMode || frames.length <= 1 || hoverIntervalRef.current) return

    hoverIntervalRef.current = setInterval(() => {
      step(1)
      if (spinIndicatorRef.current) {
        animate(spinIndicatorRef.current, {
          rotate: '+=360',
          duration: 900,
          ease: 'linear',
        })
      }
    }, 900)
  }

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    stopHoverCycle()
    dragStartX.current = e.clientX
    isDraggingRef.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return
    const delta = e.clientX - dragStartX.current

    if (isTiltMode) {
      const tilt = Math.max(-maxTilt, Math.min(maxTilt, delta / 4))
      animatableRef.current?.rotateY(tilt, 150)
      return
    }

    const direction = delta > 0 ? -1 : 1
    const progress = Math.min(1, Math.abs(delta) / dragThreshold)
    dragDirectionRef.current = direction
    dragProgressRef.current = progress
    setPeekIndex((prev) => {
      const next = (index + direction + frames.length) % frames.length
      return prev === next ? prev : next
    })
    peekAnimatableRef.current?.opacity(progress, 100)
  }

  const handlePointerUp = () => {
    dragStartX.current = null
    isDraggingRef.current = false
    stopHoverCycle()

    if (isTiltMode) {
      animatableRef.current?.rotateY(0)
      return
    }

    if (!isAnimatingRef.current && dragProgressRef.current >= 0.5) {
      const direction = dragDirectionRef.current
      setIndex((prev) => (prev + direction + frames.length) % frames.length)
      peekAnimatableRef.current?.opacity(0, 0)
    } else {
      peekAnimatableRef.current?.opacity(0, 200)
    }
    dragProgressRef.current = 0
  }

  return (
    <div className="tw:select-none">
      <div
        onPointerEnter={handlePointerEnter}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={isTiltMode ? { perspective: 900 } : undefined}
        className="tw:relative tw:aspect-square tw:w-full tw:cursor-grab tw:touch-pan-y tw:active:cursor-grabbing"
      >
        {current?.image?.url &&
          (isTiltMode ? (
            <div ref={tiltRef} className="tw:absolute tw:inset-0">
              <Image
                src={current.image.url}
                alt={current.image.alt || `${label} — ${current.angleLabel || 'view'}`}
                fill
                draggable={false}
                className="tw:object-contain tw:p-6"
              />
            </div>
          ) : (
            <>
              <div ref={frameRef} className="tw:absolute tw:inset-0">
                <Image
                  src={current.image.url}
                  alt={current.image.alt || `${label} — ${current.angleLabel || 'view'}`}
                  fill
                  draggable={false}
                  className="tw:object-contain tw:p-6"
                />
              </div>
              {peekIndex !== null && frames[peekIndex]?.image?.url && (
                <div ref={peekRef} className="tw:pointer-events-none tw:absolute tw:inset-0 tw:opacity-0">
                  <Image
                    src={frames[peekIndex]!.image!.url!}
                    alt={frames[peekIndex]?.image?.alt || `${label} — next view`}
                    fill
                    draggable={false}
                    className="tw:object-contain tw:p-6"
                  />
                </div>
              )}
            </>
          ))}
      </div>
      <div className="tw:mt-3 tw:flex tw:items-center tw:justify-center tw:gap-3">
        {!isTiltMode && (
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous angle"
            className="tw:rounded-full tw:border tw:border-white/20 tw:px-3 tw:py-1 tw:text-sm tw:text-white"
          >
            ‹
          </button>
        )}
        <p className="tw:flex tw:items-center tw:gap-1.5 tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wide tw:text-white/50">
          {!isTiltMode && (
            <span ref={spinIndicatorRef} className="tw:inline-block tw:leading-none">
              <svg viewBox="0 0 24 24" className="tw:h-3.5 tw:w-3.5" fill="none" aria-hidden="true">
                <path
                  d="M20 12a8 8 0 1 1-2.34-5.66"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path d="M20 4v5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
          {isTiltMode
            ? 'Drag to tilt'
            : `Hover or drag to rotate — ${current?.angleLabel || `${index + 1}/${frames.length}`}`}
        </p>
        {!isTiltMode && (
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next angle"
            className="tw:rounded-full tw:border tw:border-white/20 tw:px-3 tw:py-1 tw:text-sm tw:text-white"
          >
            ›
          </button>
        )}
      </div>
    </div>
  )
}

export default ColorSpin360
