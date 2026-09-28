'use client'

import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

const variantsMap: Record<'up' | 'scale' | 'drive-in', Variants> = {
  up: { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } },
  'drive-in': { hidden: { opacity: 0, x: 160 }, visible: { opacity: 1, x: 0 } },
}

type HeroEntranceProps = {
  children: ReactNode
  variant?: 'up' | 'scale' | 'drive-in'
  delay?: number
  duration?: number
  className?: string
}

const HeroEntrance = ({
  children,
  variant = 'up',
  delay = 0,
  duration = 0.6,
  className,
}: HeroEntranceProps) => {
  const transition =
    variant === 'drive-in'
      ? { type: 'spring' as const, stiffness: 120, damping: 12, mass: 0.9, delay }
      : { duration, ease: 'easeOut' as const, delay }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variantsMap[variant]}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default HeroEntrance
