'use client'

import { useState } from 'react'
import Image from 'next/image'

export type VehiclePart = {
  id: string
  partName: string
  description?: string | null
  image?: { url?: string | null; alt?: string | null } | null
  hotspotX?: number | null
  hotspotY?: number | null
}

type PartHotspotsProps = {
  baseImage: { url: string; alt: string }
  parts: VehiclePart[]
}

const PartHotspots = ({ baseImage, parts }: PartHotspotsProps) => {
  const [openId, setOpenId] = useState<string | null>(null)
  const placed = parts.filter((p) => p.hotspotX != null && p.hotspotY != null)

  return (
    <div className="tw:relative tw:mx-auto tw:aspect-square tw:w-full tw:max-w-2xl">
      <Image src={baseImage.url} alt={baseImage.alt} fill className="tw:object-contain" />
      {placed.map((part) => {
        const isOpen = openId === part.id
        return (
          <div
            key={part.id}
            className="tw:absolute tw:-translate-x-1/2 tw:-translate-y-1/2"
            style={{ left: `${part.hotspotX}%`, top: `${part.hotspotY}%` }}
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : part.id)}
              aria-label={part.partName}
              className="tw:flex tw:h-8 tw:w-8 tw:items-center tw:justify-center tw:rounded-full tw:bg-brand-blue tw:text-white tw:shadow-lg tw:ring-4 tw:ring-white/60"
            >
              +
            </button>
            {isOpen && (
              <div className="tw:absolute tw:top-10 tw:left-1/2 tw:z-10 tw:w-56 tw:-translate-x-1/2 tw:rounded-xl tw:border tw:border-white/10 tw:bg-surface-raised tw:p-4 tw:text-left tw:shadow-xl">
                {part.image?.url && (
                  <div className="tw:relative tw:mb-2 tw:aspect-video tw:overflow-hidden tw:rounded-lg">
                    <Image
                      src={part.image.url}
                      alt={part.image.alt || part.partName}
                      fill
                      className="tw:object-cover"
                    />
                  </div>
                )}
                <p className="tw:text-sm tw:font-semibold tw:text-white">{part.partName}</p>
                {part.description && (
                  <p className="tw:mt-1 tw:text-xs tw:text-white/60">{part.description}</p>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default PartHotspots
