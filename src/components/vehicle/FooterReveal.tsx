'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { openConsentSettings } from '@/lib/analytics'
import { animate, stagger, onScroll } from 'animejs'

export type ContactRow = { type: 'address' | 'phone' | 'email'; label: string }
export type SocialLink = { label: string; path: string; url?: string }

const icons: Record<ContactRow['type'], { icon: ReactNode; extra?: ReactNode }> = {
  address: {
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
  phone: {
    icon: (
      <path
        d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.2c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"
        stroke="#3b82f6"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    ),
  },
  email: {
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="#3b82f6" strokeWidth="1.6" />
        <path d="M3.5 6.5l8.5 6.5 8.5-6.5" stroke="#3b82f6" strokeWidth="1.6" strokeLinejoin="round" />
      </>
    ),
  },
}

const FooterReveal = ({
  contactRows,
  socialLinks,
}: {
  contactRows: ContactRow[]
  socialLinks: SocialLink[]
}) => {
  const t = useTranslations('Footer')
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
          alt={t('photoAlt')}
          fill
          className="tw:object-cover"
        />
        <div className="tw:pointer-events-none tw:absolute tw:inset-0 tw:bg-gradient-to-r tw:from-brand-ink tw:via-brand-ink/70 tw:to-transparent" />
        <div className="tw:pointer-events-none tw:absolute tw:inset-0 tw:bg-gradient-to-t tw:from-brand-ink tw:via-transparent tw:to-transparent" />
      </div>

      <div ref={containerRef} className="tw:relative tw:mx-auto tw:flex tw:min-h-[420px] tw:max-w-6xl tw:flex-col tw:justify-center tw:px-6 tw:py-20 tw:md:min-h-[520px]">
        <p className="tw:text-2xl tw:font-bold">Neptune</p>
        <p className="tw:mt-2 tw:max-w-sm tw:text-sm tw:text-white/60">{t('tagline')}</p>
        <div className="tw:mt-8 tw:space-y-4">
          {contactRows.map((row) => (
            <div key={row.type} data-contact-row className="tw:flex tw:items-center tw:gap-3 tw:opacity-0">
              <svg viewBox="0 0 24 24" className="tw:h-5 tw:w-5 tw:shrink-0" fill="none" aria-hidden="true">
                {icons[row.type].icon}
                {icons[row.type].extra}
              </svg>
              <p className="tw:text-sm tw:text-white/70">{row.label}</p>
            </div>
          ))}
          <div data-contact-row className="tw:flex tw:items-center tw:gap-4 tw:pt-2 tw:opacity-0">
            {socialLinks.map((social) =>
              social.url ? (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="tw:text-white/40 tw:transition tw:hover:text-brand-blue-light"
                >
                  <svg viewBox="0 0 24 24" className="tw:h-5 tw:w-5" role="img">
                    <path d={social.path} fill="currentColor" />
                  </svg>
                </a>
              ) : (
                <svg
                  key={social.label}
                  viewBox="0 0 24 24"
                  className="tw:h-5 tw:w-5 tw:text-white/40 tw:transition tw:hover:text-brand-blue-light"
                  aria-label={social.label}
                  role="img"
                >
                  <path d={social.path} fill="currentColor" />
                </svg>
              ),
            )}
          </div>
        </div>
      </div>

      <div className="tw:relative tw:border-t tw:border-white/10 tw:py-6 tw:text-center tw:text-sm tw:text-white/50">
        <div className="tw:mx-auto tw:flex tw:max-w-6xl tw:flex-col tw:items-center tw:justify-between tw:gap-3 tw:px-6 tw:sm:flex-row">
          <p className="tw:m-0">{t('copyright', { year: new Date().getFullYear() })}</p>
          <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-5">
            <Link href="/privacy-policy" className="tw:transition tw:hover:text-white">
              {t('privacy')}
            </Link>
            <Link href="/terms-conditions" className="tw:transition tw:hover:text-white">
              {t('terms')}
            </Link>
            <button
              type="button"
              onClick={openConsentSettings}
              className="tw:cursor-pointer tw:border-0 tw:bg-transparent tw:p-0 tw:text-sm tw:text-white/50 tw:transition tw:hover:text-white"
            >
              {t('cookieSettings')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterReveal
