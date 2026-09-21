'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export type BuildFrame = { url: string }

const BuildSequence = ({ frames }: { frames: BuildFrame[] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isNearViewport, setIsNearViewport] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || frames.length === 0) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true)
          observer.disconnect()
        }
      },
      { rootMargin: '400px' },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [frames.length])

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!isNearViewport || !canvas || !section || frames.length === 0) return

    const context = canvas.getContext('2d')
    if (!context) return

    const images: HTMLImageElement[] = frames.map((frame) => {
      const img = new window.Image()
      img.src = frame.url
      return img
    })

    const state = { frame: 0 }

    const draw = () => {
      const img = images[Math.round(state.frame)]
      if (!img || !img.complete) return
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(img, 0, 0)
    }

    images[0].onload = draw

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: `+=${frames.length * 40}`,
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        state.frame = Math.min(frames.length - 1, Math.floor(self.progress * frames.length))
        draw()
      },
    })

    return () => trigger.kill()
  }, [frames, isNearViewport])

  if (!frames.length) return null

  return (
    <div
      ref={sectionRef}
      className="tw:relative tw:flex tw:h-screen tw:items-center tw:justify-center tw:bg-surface"
    >
      <canvas ref={canvasRef} className="tw:max-h-full tw:max-w-full" />
    </div>
  )
}

export default BuildSequence
