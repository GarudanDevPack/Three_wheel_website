'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { markIntroDone } from '@/lib/intro'

const spokeAngles = [0, 60, 120, 180, 240, 300]

const Preloader = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // ~1.2 s from the start of the page load (the overlay is server-rendered, so it has been showing
    // since the first paint); a short beat on client-side navigation.
    const timeout = setTimeout(() => setLoading(false), Math.max(300, 1200 - performance.now()))
    return () => clearTimeout(timeout)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      {/* Fade-out finished → floating buttons pop in and the hero numbers count up (lib/intro.ts). */}
      <AnimatePresence onExitComplete={markIntroDone}>
        {loading && (
          <motion.div
            id="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="tw:fixed tw:inset-0 tw:z-[100] tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-4 tw:bg-brand-ink"
          >
            <motion.svg
              width="56"
              height="56"
              viewBox="0 0 56 56"
              fill="none"
              initial={{ rotate: 0, opacity: 0 }}
              animate={{ rotate: 360, opacity: 1 }}
              transition={{
                rotate: { duration: 1.1, ease: 'easeInOut' },
                opacity: { duration: 0.3 },
              }}
            >
              <circle cx="28" cy="28" r="24" stroke="#ffffff" strokeWidth="3" />
              <circle cx="28" cy="28" r="6" stroke="#ffffff" strokeWidth="3" />
              {spokeAngles.map((angle) => (
                <line
                  key={angle}
                  x1="28"
                  y1="28"
                  x2={28 + 24 * Math.cos((angle * Math.PI) / 180)}
                  y2={28 + 24 * Math.sin((angle * Math.PI) / 180)}
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              ))}
            </motion.svg>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="tw:text-2xl tw:font-bold tw:tracking-widest tw:text-white"
            >
              NEPTUNE
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  )
}

export default Preloader
