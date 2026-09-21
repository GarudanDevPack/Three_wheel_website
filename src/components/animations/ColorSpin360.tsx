'use client'

import { useRef, useState, type PointerEvent } from 'react'
import Image from 'next/image'

export type AngleImage = {
  angleLabel?: string | null
  image?: { url?: string | null; alt?: string | null } | null
}

const dragThreshold = 60

const ColorSpin360 = ({ images, label }: { images: AngleImage[]; label: string }) => {
  const [index, setIndex] = useState(0)
  const dragStartX = useRef<number | null>(null)

  const frames = images.filter((frame) => frame?.image?.url)
  if (!frames.length) return null

  const current = frames[index % frames.length]

  const step = (direction: 1 | -1) => {
    setIndex((prev) => (prev + direction + frames.length) % frames.length)
  }

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragStartX.current = e.clientX
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return
    const delta = e.clientX - dragStartX.current
    if (Math.abs(delta) >= dragThreshold) {
      step(delta > 0 ? -1 : 1)
      dragStartX.current = e.clientX
    }
  }

  const handlePointerUp = () => {
    dragStartX.current = null
  }

  return (
    <div className="tw:select-none">
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="tw:relative tw:aspect-square tw:w-full tw:cursor-grab tw:touch-pan-y tw:active:cursor-grabbing"
      >
        {current?.image?.url && (
          <Image
            src={current.image.url}
            alt={current.image.alt || `${label} — ${current.angleLabel || 'view'}`}
            fill
            draggable={false}
            className="tw:object-contain tw:p-6"
          />
        )}
      </div>
      <div className="tw:mt-3 tw:flex tw:items-center tw:justify-center tw:gap-3">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous angle"
          className="tw:rounded-full tw:border tw:border-white/20 tw:px-3 tw:py-1 tw:text-sm tw:text-white"
        >
          ‹
        </button>
        <p className="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wide tw:text-white/50">
          Drag to rotate — {current?.angleLabel || `${index + 1}/${frames.length}`}
        </p>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next angle"
          className="tw:rounded-full tw:border tw:border-white/20 tw:px-3 tw:py-1 tw:text-sm tw:text-white"
        >
          ›
        </button>
      </div>
    </div>
  )
}

export default ColorSpin360
