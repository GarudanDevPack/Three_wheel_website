'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const navLinks = [
  { href: '/360-view', label: '360° View' },
  { href: '/#gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

const navLinkClasses =
  'tw:relative tw:pb-1 tw:transition tw:hover:text-brand-blue-light tw:after:absolute tw:after:bottom-0 tw:after:left-0 tw:after:h-[1.5px] tw:after:w-full tw:after:origin-left tw:after:scale-x-0 tw:after:bg-brand-blue-light tw:after:transition-transform tw:after:duration-300 tw:hover:after:scale-x-100'

const Header = () => {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`tw:sticky tw:top-0 tw:z-50 tw:text-white tw:transition-colors tw:duration-300 ${
        scrolled
          ? 'tw:bg-brand-ink/95 tw:shadow-lg tw:backdrop-blur'
          : 'tw:bg-gradient-to-b tw:from-black/70 tw:via-black/30 tw:to-transparent'
      }`}
    >
      <div className="tw:mx-auto tw:flex tw:max-w-6xl tw:items-center tw:justify-between tw:px-6 tw:py-4">
        <Link href="/" className="tw:text-xl tw:font-bold tw:tracking-wide">
          Neptune
        </Link>
        <nav className="tw:hidden tw:gap-8 tw:text-sm tw:font-medium tw:md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={navLinkClasses}>
              {link.label}
            </Link>
          ))}
        </nav>
        <a
          href="/contact#enquire"
          className="tw:hidden tw:rounded-full tw:bg-brand-blue tw:px-5 tw:py-2 tw:text-sm tw:font-semibold tw:md:inline-block"
        >
          Enquire Now
        </a>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="tw:inline-flex tw:h-9 tw:w-9 tw:items-center tw:justify-center tw:rounded tw:border tw:border-white/30 tw:md:hidden"
          aria-label="Toggle menu"
        >
          <span className="tw:text-lg">{open ? '×' : '☰'}</span>
        </button>
      </div>
      {open && (
        <nav className="tw:flex tw:flex-col tw:gap-1 tw:border-t tw:border-white/10 tw:bg-brand-ink tw:px-6 tw:pb-4 tw:md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="tw:py-2 tw:text-sm tw:font-medium"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="/contact#enquire"
            onClick={() => setOpen(false)}
            className="tw:py-2 tw:text-sm tw:font-semibold tw:text-brand-blue-light"
          >
            Enquire Now
          </a>
        </nav>
      )}
    </header>
  )
}

export default Header
