'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const sectionMessages: Record<string, string> = {
  hero: 'Meet the Neptune.',
  'featured-models': 'Built for every route.',
  'why-choose-us': 'Lower running costs, every day.',
  'mechanism-sketch': 'One vehicle, many jobs.',
  highlights: 'Check the numbers.',
  colors: 'Pick your color.',
  charging: 'Charged up and ready.',
  gallery: 'See it from every angle.',
  dealers: 'Find a dealer near you.',
  'award-strip': 'Award-winning design.',
  cta: 'Ready to book a test drive?',
  enquire: "Let's talk.",
}

const sectionIds = Object.keys(sectionMessages)

const FloatingVehicleWidget = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  useEffect(() => {
    const visibility = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibility.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0)
        })

        let winner: string | null = null
        let winnerRatio = 0
        visibility.forEach((ratio, id) => {
          if (ratio > winnerRatio) {
            winner = id
            winnerRatio = ratio
          }
        })
        if (winner) setActiveSection(winner)
      },
      { threshold: [0.5], rootMargin: '-45% 0px -45% 0px' },
    )

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const message = activeSection ? sectionMessages[activeSection] : null

  return (
    <div className="tw:pointer-events-none tw:fixed tw:bottom-6 tw:right-6 tw:z-[70] tw:flex tw:items-end tw:gap-3">
      <AnimatePresence mode="wait">
        {message && (
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="tw:mb-1 tw:max-w-[12rem] tw:rounded-2xl tw:rounded-br-sm tw:border tw:border-white/10 tw:bg-surface-raised tw:px-4 tw:py-3 tw:text-sm tw:font-medium tw:text-white tw:shadow-xl"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="tw:flex tw:h-14 tw:w-14 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-full tw:border tw:border-white/10 tw:bg-surface tw:shadow-xl">
        <svg viewBox="0 0 48 32" className="tw:h-8 tw:w-8" fill="none" aria-hidden="true">
          <path
            d="M4 24 L4 16 Q4 12 8 12 L14 12 L19 6 L34 6 Q38 6 39 10 L41 16 L44 16 Q46 16 46 18 L46 24"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="13"
            cy="24"
            r="4.5"
            stroke="#3b82f6"
            strokeWidth="2"
            className="tw:origin-center tw:animate-spin"
            style={{ animationDuration: '2.5s' }}
          />
          <circle cx="13" cy="24" r="1" fill="#3b82f6" />
          <circle
            cx="37"
            cy="24"
            r="4.5"
            stroke="#3b82f6"
            strokeWidth="2"
            className="tw:origin-center tw:animate-spin"
            style={{ animationDuration: '2.5s' }}
          />
          <circle cx="37" cy="24" r="1" fill="#3b82f6" />
        </svg>
      </div>
    </div>
  )
}

export default FloatingVehicleWidget
