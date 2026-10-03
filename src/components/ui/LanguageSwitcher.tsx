'use client'

import { useLocale } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { routing, localeLabels } from '@/i18n/routing'

const LanguageSwitcher = ({ className = '' }: { className?: string }) => {
  const locale = useLocale()
  const pathname = usePathname()

  return (
    <div
      role="group"
      aria-label="Language"
      className={`tw:inline-flex tw:items-center tw:rounded-full tw:border tw:border-brand-ink/10 tw:bg-surface-raised tw:p-0.5 ${className}`}
    >
      {routing.locales.map((code) => (
        <Link
          key={code}
          href={pathname}
          locale={code}
          aria-current={code === locale ? 'true' : undefined}
          className={`tw:rounded-full tw:px-3 tw:py-1 tw:text-xs tw:font-semibold tw:transition ${
            code === locale
              ? 'tw:bg-brand-blue tw:text-white tw:shadow-sm'
              : 'tw:text-brand-ink/60 tw:hover:text-brand-ink'
          }`}
        >
          {localeLabels[code]}
        </Link>
      ))}
    </div>
  )
}

export default LanguageSwitcher
