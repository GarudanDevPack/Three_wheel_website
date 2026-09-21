'use client'

import { useRef, useState, type PointerEvent } from 'react'
import Image from 'next/image'

export type AngleImages = {
  front?: { url?: string | null; alt?: string | null } | null
  right?: { url?: string | null; alt?: string | null } | null
  back?: { url?: string | null; alt?: string | null } | null
  left?: { url?: string | null; alt?: string | null } | null
}

const order: Array<keyof AngleImages> = ['front', 'right', 'back', 'left']
const dragThreshold = 60

const ColorSpin360 = ({ images, label }: { images: AngleImages; label: string }) => {
  const [index, setIndex] = useState(0)
  const dragStartX = useRef<number | null>(null)

  const hasAnyFrame = order.some((key) => images[key]?.url)
  if (!hasAnyFrame) return null

  const current = images[order[index]]

  const step = (direction: 1 | -1) => {
    setIndex((prev) => (prev + direction + order.length) % order.length)
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
        {current?.url && (
          <Image
            src={current.url}
            alt={current.alt || `${label} — ${order[index]} view`}
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
          className="tw:rounded-full tw:border tw:border-black/10 tw:px-3 tw:py-1 tw:text-sm"
        >
          ‹
        </button>
        <p className="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wide tw:text-gray-500">
          Drag to rotate — {order[index]}
        </p>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next angle"
          className="tw:rounded-full tw:border tw:border-black/10 tw:px-3 tw:py-1 tw:text-sm"
        >
          ›
        </button>
      </div>
    </div>
  )
}

export default ColorSpin360
