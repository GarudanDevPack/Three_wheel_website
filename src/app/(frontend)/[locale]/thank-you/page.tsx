import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Header from '@/components/vehicle/Header'
import Footer from '@/components/vehicle/Footer'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { getSiteSettings } from '@/lib/siteSettings'

type PageProps = { params: Promise<{ locale: AppLocale }> }

// Confirmation after an enquiry: never indexed or followed, never in the sitemap
// (next.config.mjs also sends X-Robots-Tag: noindex, nofollow for this path).
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ThankYou' })
  return { title: t('metaTitle'), robots: { index: false, follow: false } }
}

const ThankYouPage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, settings] = await Promise.all([getTranslations('ThankYou'), getSiteSettings(locale)])
  const whatsapp = `https://wa.me/94${settings.whatsapp.replace(/\D/g, '').replace(/^0/, '')}`

  return (
    <>
      <Header />
      <main data-track-location="thank_you" className="tw:bg-surface">
        <section className="tw:mx-auto tw:max-w-2xl tw:px-6 tw:py-24 tw:text-center">
          <span
            aria-hidden="true"
            className="tw:mx-auto tw:flex tw:h-14 tw:w-14 tw:items-center tw:justify-center tw:rounded-full tw:bg-brand-green/15 tw:text-emerald-700"
          >
            <svg viewBox="0 0 24 24" className="tw:h-7 tw:w-7" fill="none">
              <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <h1 className="tw:mt-6 tw:text-3xl tw:font-bold tw:text-brand-ink tw:md:text-4xl">{t('title')}</h1>
          <p role="status" className="tw:mt-4 tw:text-lg tw:text-brand-ink/70">
            {t('body')}
          </p>
          <div className="tw:mt-8 tw:flex tw:flex-wrap tw:items-center tw:justify-center tw:gap-3">
            <Link
              href="/vehicles"
              className="tw:rounded-full tw:bg-brand-blue tw:px-6 tw:py-3 tw:text-sm tw:font-semibold tw:text-white tw:transition tw:hover:bg-brand-blue-light"
            >
              {t('models')}
            </Link>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="tw:rounded-full tw:border tw:border-brand-ink/15 tw:px-6 tw:py-3 tw:text-sm tw:font-semibold tw:text-brand-ink tw:transition tw:hover:border-brand-ink/35"
            >
              {t('whatsapp')}
            </a>
            <Link href="/" className="tw:px-3 tw:py-3 tw:text-sm tw:font-semibold tw:text-brand-blue">
              {t('home')}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default ThankYouPage
