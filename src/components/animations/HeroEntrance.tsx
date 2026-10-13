import type { ReactNode } from 'react'

// Pure CSS keyframes (src/styles/tailwind.css): the hero animates on first paint without waiting
// for JavaScript, and reduced-motion visitors get it static.
const variantClass = {
  up: 'hero-enter-up',
  scale: 'hero-enter-scale',
  'drive-in': 'hero-enter-drive',
} as const

type HeroEntranceProps = {
  children: ReactNode
  variant?: keyof typeof variantClass
  /** Seconds. */
  delay?: number
  /** Seconds. */
  duration?: number
  className?: string
}

const HeroEntrance = ({ children, variant = 'up', delay = 0, duration = 0.6, className }: HeroEntranceProps) => (
  <div
    className={`${variantClass[variant]}${className ? ` ${className}` : ''}`}
    style={{ animationDelay: `${delay}s`, animationDuration: `${duration}s` }}
  >
    {children}
  </div>
)

export default HeroEntrance
