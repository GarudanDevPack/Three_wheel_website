'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { AnimatePresence, motion } from 'framer-motion'
import AssistantChat, { type AssistantContacts } from './AssistantChat'

// Section id → invitation message under `FloatingWidget` (home page). Other pages use `greeting`.
const sectionMessages: Record<string, string> = {
  hero: 'hero',
  'model-selector': 'modelSelector',
  design: 'design',
  pricing: 'pricing',
  testimonials: 'testimonials',
  compare: 'compare',
  charging: 'charging',
  gallery: 'gallery',
  dealers: 'dealers',
  'award-strip': 'awardStrip',
  enquire: 'enquire',
}

const SEEN_KEY = 'neptune-assistant-seen'

const readFlag = (key: string) => {
  try {
    return sessionStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

const writeFlag = (key: string) => {
  try {
    sessionStorage.setItem(key, '1')
  } catch {
    // Storage unavailable — the flag just won't persist across pages.
  }
}

/** Floating Elektrateq-style assistant: scroll-aware speech bubble + avatar that opens the AI chat. */
const AssistantLauncher = ({ contacts }: { contacts: AssistantContacts }) => {
  const t = useTranslations('FloatingWidget')
  const ta = useTranslations('Assistant')
  const [open, setOpen] = useState(false)
  const [seen, setSeen] = useState(() => readFlag(SEEN_KEY))
  // Dismissing the bubble lasts until the page is reloaded (not persisted).
  const [bubbleHidden, setBubbleHidden] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [hasSections, setHasSections] = useState(false)
  const launcherRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const elements = Object.keys(sectionMessages)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    setHasSections(elements.length > 0)
    if (!elements.length) return

    const visibility = new Map<string, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visibility.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0))
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
      { threshold: [0, 0.25, 0.5], rootMargin: '-40% 0px -40% 0px' },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const openChat = () => {
    setOpen(true)
    setSeen(true)
    writeFlag(SEEN_KEY)
  }

  const closeChat = () => {
    setOpen(false)
    launcherRef.current?.focus()
  }

  const hideBubble = () => setBubbleHidden(true)

  const messageKey = activeSection ? sectionMessages[activeSection] : hasSections ? null : 'greeting'
  const message = !open && !bubbleHidden && messageKey ? t(messageKey) : null

  return (
    <>
      <AnimatePresence>{open && <AssistantChat contacts={contacts} onClose={closeChat} />}</AnimatePresence>

      <div className="tw:pointer-events-none tw:fixed tw:bottom-6 tw:right-6 tw:z-[70] tw:flex tw:items-end tw:gap-3">
        <AnimatePresence mode="wait">
          {message && (
            <motion.div
              key={messageKey}
              initial={{ opacity: 0, y: 10, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="tw:pointer-events-auto tw:relative tw:mb-5 tw:hidden tw:max-w-[15rem] tw:sm:block"
            >
              <button
                type="button"
                onClick={openChat}
                className="tw:cursor-pointer tw:rounded-2xl tw:border tw:border-white/10 tw:bg-brand-ink/90 tw:px-5 tw:py-3.5 tw:text-center tw:text-sm tw:font-medium tw:leading-snug tw:text-white tw:shadow-2xl tw:backdrop-blur"
              >
                {message}
              </button>
              {/* Tail pointing at the avatar */}
              <span
                aria-hidden="true"
                className="tw:absolute tw:-right-2 tw:bottom-4 tw:h-4 tw:w-4 tw:rotate-45 tw:border-r tw:border-t tw:border-white/10 tw:bg-brand-ink/90"
              />
              <button
                type="button"
                onClick={hideBubble}
                aria-label={ta('dismiss')}
                className="tw:absolute tw:-left-2 tw:-top-2 tw:flex tw:h-6 tw:w-6 tw:cursor-pointer tw:items-center tw:justify-center tw:rounded-full tw:border tw:border-brand-ink/10 tw:bg-surface tw:text-brand-ink/60 tw:shadow tw:transition tw:hover:text-brand-ink"
              >
                <svg viewBox="0 0 24 24" className="tw:h-3 tw:w-3" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          ref={launcherRef}
          type="button"
          onClick={open ? closeChat : openChat}
          aria-label={ta('open')}
          aria-expanded={open}
          animate={open ? { y: 0 } : { y: [0, -5, 0] }}
          transition={open ? { duration: 0.2 } : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="tw:pointer-events-auto tw:relative tw:h-16 tw:w-16 tw:shrink-0 tw:cursor-pointer tw:rounded-full tw:border-0 tw:bg-transparent tw:p-0 tw:shadow-[0_12px_30px_-8px_rgba(11,14,20,0.55)]"
        >
          {!seen && !open && (
            <span aria-hidden="true" className="tw:absolute tw:inset-0 tw:animate-ping tw:rounded-full tw:bg-brand-blue/40" />
          )}
          <Image
            src="/images/assistant/neptune-assistant-192.webp"
            alt=""
            width={64}
            height={64}
            priority={false}
            className="tw:relative tw:rounded-full"
          />
          {open && (
            <span className="tw:absolute tw:inset-0 tw:flex tw:items-center tw:justify-center tw:rounded-full tw:bg-brand-ink/70 tw:text-white">
              <svg viewBox="0 0 24 24" className="tw:h-6 tw:w-6" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          )}
        </motion.button>
      </div>
    </>
  )
}

export default AssistantLauncher
