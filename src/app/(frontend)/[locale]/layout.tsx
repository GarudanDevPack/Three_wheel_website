import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import '@/styles/tailwind.css'
import { routing } from '@/i18n/routing'
import { getSiteSettings } from '@/lib/siteSettings'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import CookieConsent from '@/components/ui/CookieConsent'
import Analytics from '@/components/ui/Analytics'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

type LayoutProps = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Pick<LayoutProps, 'params'>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Meta' })
  const title = t('siteTitle')
  const description = t('siteDescription')

  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: '%s | Neptune' },
    description,
    openGraph: {
      title,
      description,
      siteName: 'Neptune',
      locale,
      images: ['/images/auto/neptune-blue-1.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/auto/neptune-blue-1.png'],
    },
  }
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const settings = await getSiteSettings(locale)

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Neptune',
    address: settings.address,
    telephone: settings.phone,
    openingHours: settings.businessHours,
  }

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,100..900;1,100..900&family=Red+Hat+Display:ital,wght@0,300..900;1,300..900&family=Noto+Sans+Sinhala:wght@400..700&family=Noto+Sans+Tamil:wght@400..700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body id="scrool">
        <NextIntlClientProvider>
          {children}
          <WhatsAppButton phone={settings.phone} />
          {settings.cookieConsent.enabled && (
            <CookieConsent
              message={settings.cookieConsent.message}
              acceptLabel={settings.cookieConsent.acceptLabel}
              declineLabel={settings.cookieConsent.declineLabel}
            />
          )}
          <Analytics measurementId={settings.gaMeasurementId} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
