'use client'

import { useEffect, useRef, useState, type PointerEvent } from 'react'
import Image from 'next/image'
import { createAnimatable, type AnimatableObject } from 'animejs'

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
  const animatableRef = useRef<AnimatableObject | null>(null)

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

  if (!frames.length) return null

  const current = frames[index % frames.length]

  const step = (direction: 1 | -1) => {
    setIndex((prev) => (prev + direction + frames.length) % frames.length)
  }

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
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

    if (Math.abs(delta) >= dragThreshold) {
      step(delta > 0 ? -1 : 1)
      dragStartX.current = e.clientX
    }
  }

  const handlePointerUp = () => {
    dragStartX.current = null
    isDraggingRef.current = false
    if (isTiltMode) animatableRef.current?.rotateY(0)
  }

  return (
    <div className="tw:select-none">
      <div
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
            <Image
              src={current.image.url}
              alt={current.image.alt || `${label} — ${current.angleLabel || 'view'}`}
              fill
              draggable={false}
              className="tw:object-contain tw:p-6"
            />
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
        <p className="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wide tw:text-white/50">
          {isTiltMode
            ? 'Drag to tilt'
            : `Drag to rotate — ${current?.angleLabel || `${index + 1}/${frames.length}`}`}
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
