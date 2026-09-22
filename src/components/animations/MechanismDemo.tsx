'use client'

import { useEffect, useRef, useState } from 'react'

const MechanismDemo = ({ src }: { src: string }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isNearViewport, setIsNearViewport] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true)
          observer.disconnect()
        }
      },
      { rootMargin: '400px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="tw:mx-auto tw:max-w-3xl tw:overflow-hidden tw:rounded-2xl">
      {isNearViewport && (
        <video src={src} loop muted autoPlay playsInline className="tw:h-auto tw:w-full" />
      )}
    </div>
  )
}

export default MechanismDemo
