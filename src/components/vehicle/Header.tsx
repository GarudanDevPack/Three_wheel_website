'use client'

import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'

const navLinks = [
  { href: '/', key: 'home' },
  { href: '/#gallery', key: 'gallery' },
  { href: '/news', key: 'news' },
  { href: '/about', key: 'about' },
  { href: '/contact', key: 'contact' },
] as const

const Header = () => {
  const t = useTranslations('Header')
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Uppercase + wide tracking reads well in Latin script but breaks up Sinhala/Tamil glyphs.
  const caps = locale === 'en' ? 'tw:uppercase tw:tracking-widest' : ''

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`tw:sticky tw:top-0 tw:z-50 tw:bg-surface/90 tw:text-brand-ink tw:backdrop-blur tw:transition-shadow tw:duration-300 ${
        scrolled ? 'tw:shadow-md' : ''
      }`}
    >
      <div className="tw:mx-auto tw:flex tw:max-w-6xl tw:items-center tw:justify-between tw:gap-6 tw:px-6 tw:py-4">
        <Link href="/" className="tw:text-xl tw:font-bold tw:uppercase tw:tracking-[0.2em]">
          Neptune
        </Link>
        <nav className="tw:hidden tw:gap-8 tw:lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`tw:text-xs tw:font-semibold tw:text-brand-ink/70 tw:transition tw:hover:text-brand-blue ${caps}`}
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>
        <div className="tw:hidden tw:items-center tw:gap-3 tw:lg:flex">
          <LanguageSwitcher />
          <Link
            href="/contact#enquire"
            className="tw:rounded-full tw:bg-brand-blue tw:px-5 tw:py-2 tw:text-sm tw:font-semibold tw:text-white tw:transition tw:hover:bg-brand-blue-light"
          >
            {t('enquire')}
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="tw:inline-flex tw:h-9 tw:w-9 tw:cursor-pointer tw:items-center tw:justify-center tw:rounded-lg tw:border tw:border-brand-ink/20 tw:bg-transparent tw:lg:hidden"
          aria-label={t('toggleMenu')}
          aria-expanded={open}
        >
          <span className="tw:text-lg">{open ? '×' : '☰'}</span>
        </button>
      </div>
      {open && (
        <nav className="tw:flex tw:flex-col tw:gap-1 tw:border-t tw:border-brand-ink/10 tw:bg-surface tw:px-6 tw:pb-5 tw:pt-2 tw:lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`tw:py-2 tw:text-sm tw:font-semibold ${caps}`}
            >
              {t(link.key)}
            </Link>
          ))}
          <Link
            href="/contact#enquire"
            onClick={() => setOpen(false)}
            className={`tw:py-2 tw:text-sm tw:font-semibold tw:text-brand-blue ${caps}`}
          >
            {t('enquire')}
          </Link>
          <LanguageSwitcher className="tw:mt-3 tw:self-start" />
        </nav>
      )}
    </header>
  )
}

export default Header
