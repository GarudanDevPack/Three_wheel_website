'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { animate, stagger, onScroll } from 'animejs'

const contactRows = [
  {
    label: 'Add your company address in /admin',
    icon: (
      <path
        d="M12 21s7-6.3 7-11.5A7 7 0 0 0 5 9.5C5 14.7 12 21 12 21z"
        stroke="#3b82f6"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    ),
    extra: <circle cx="12" cy="9.5" r="2.5" stroke="#3b82f6" strokeWidth="1.8" />,
  },
  {
    label: '+91 00000 00000',
    icon: (
      <path
        d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.2c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"
        stroke="#3b82f6"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: 'info@example.com',
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="#3b82f6" strokeWidth="1.6" />
        <path d="M3.5 6.5l8.5 6.5 8.5-6.5" stroke="#3b82f6" strokeWidth="1.6" strokeLinejoin="round" />
      </>
    ),
  },
]

const socialIcons = [
  {
    label: 'Facebook',
    path: 'M14 9.5h2.5V6h-2.5c-1.9 0-3.5 1.6-3.5 3.5V12H8.5v3.5H10.5V22H14v-6.5h2.3l.4-3.5H14V9.7c0-.4.1-.2.3-.2z',
  },
  {
    label: 'LinkedIn',
    path: 'M6.5 9h3v10h-3V9zM8 4.5A1.75 1.75 0 1 1 8 8a1.75 1.75 0 0 1 0-3.5zM12.5 9h2.9v1.4h.04c.4-.75 1.4-1.55 2.9-1.55 3.1 0 3.66 2 3.66 4.7V19h-3v-4.9c0-1.15-.02-2.65-1.6-2.65-1.6 0-1.85 1.25-1.85 2.55V19h-3V9z',
  },
  {
    label: 'YouTube',
    path: 'M21.5 8.5s-.2-1.4-.8-2c-.75-.8-1.6-.8-2-.85C15.9 5.4 12 5.4 12 5.4h0s-3.9 0-6.7.25c-.4.05-1.25.05-2 .85-.6.6-.8 2-.8 2S2.3 10.1 2.3 11.7v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.75.8 1.75.78 2.2.87 1.6.15 6.5.24 6.5.24s3.9 0 6.7-.25c.4-.05 1.25-.05 2-.85.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5c0-1.6-.2-3.2-.2-3.2zM9.9 15V9.4l5.4 2.8-5.4 2.8z',
  },
]

const Footer = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const rows = container?.querySelectorAll('[data-contact-row]')
    if (!container || !rows?.length) return

    const animations = [
      animate(rows, {
        opacity: [0, 1],
        translateY: [40, 0],
        delay: stagger(120),
        duration: 600,
        ease: 'outQuad',
        autoplay: onScroll({ target: container }),
      }),
    ]

    if (photoRef.current) {
      animations.push(
        animate(photoRef.current, {
          opacity: [0, 1],
          duration: 900,
          ease: 'outQuad',
          autoplay: onScroll({ target: container }),
        }),
      )
    }

    return () => {
      animations.forEach((animation) => animation.revert())
    }
  }, [])

  return (
    <footer className="tw:relative tw:overflow-hidden tw:bg-brand-ink tw:text-white">
      <div ref={photoRef} className="tw:absolute tw:inset-0 tw:opacity-0">
        <Image
          src="/images/auto/night-ride.jpg"
          alt="Neptune three-wheeler driving at night"
          fill
          className="tw:object-cover"
        />
        <div className="tw:pointer-events-none tw:absolute tw:inset-0 tw:bg-gradient-to-r tw:from-brand-ink tw:via-brand-ink/70 tw:to-transparent" />
        <div className="tw:pointer-events-none tw:absolute tw:inset-0 tw:bg-gradient-to-t tw:from-brand-ink tw:via-transparent tw:to-transparent" />
      </div>

      <div ref={containerRef} className="tw:relative tw:mx-auto tw:flex tw:min-h-[420px] tw:max-w-6xl tw:flex-col tw:justify-center tw:px-6 tw:py-20 tw:md:min-h-[520px]">
        <p className="tw:text-2xl tw:font-bold">Neptune</p>
        <p className="tw:mt-2 tw:max-w-sm tw:text-sm tw:text-white/60">
          Rugged three-wheelers built for daily loads, longer routes, and lower running costs.
        </p>
        <div className="tw:mt-8 tw:space-y-4">
          {contactRows.map((row) => (
            <div key={row.label} data-contact-row className="tw:flex tw:items-center tw:gap-3 tw:opacity-0">
              <svg viewBox="0 0 24 24" className="tw:h-5 tw:w-5 tw:shrink-0" fill="none" aria-hidden="true">
                {row.icon}
                {row.extra}
              </svg>
              <p className="tw:text-sm tw:text-white/70">{row.label}</p>
            </div>
          ))}
          <div data-contact-row className="tw:flex tw:items-center tw:gap-4 tw:pt-2 tw:opacity-0">
            {socialIcons.map((social) => (
              <svg
                key={social.label}
                viewBox="0 0 24 24"
                className="tw:h-5 tw:w-5 tw:text-white/40 tw:transition tw:hover:text-brand-blue-light"
                aria-label={social.label}
                role="img"
              >
                <path d={social.path} fill="currentColor" />
              </svg>
            ))}
          </div>
        </div>
      </div>

      <div className="tw:relative tw:border-t tw:border-white/10 tw:py-6 tw:text-center tw:text-sm tw:text-white/50">
        <p>&copy; {new Date().getFullYear()} Neptune Three-Wheelers. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
