import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import '@/styles/tailwind.css'
import { routing } from '@/i18n/routing'
import { getSiteSettings } from '@/lib/siteSettings'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import FacebookButton from '@/components/ui/FacebookButton'
import YouTubeButton from '@/components/ui/YouTubeButton'
import Assistant from '@/components/assistant/LazyAssistant'
import { jaffnaDealer } from '@/lib/dealers'
import CookieConsent from '@/components/ui/CookieConsent'
import Analytics from '@/components/ui/Analytics'

import { siteUrl } from '@/lib/site'

// Latin fonts everywhere; the Sinhala / Tamil script fonts only on the page language that needs them.
const scriptFont: Record<string, string> = {
  si: '&family=Noto+Sans+Sinhala:wght@400..700',
  ta: '&family=Noto+Sans+Tamil:wght@400..700',
}
const fontStylesheet = (locale: string) =>
  `https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Red+Hat+Display:wght@300..900${scriptFont[locale] ?? ''}&display=swap`

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
      images: ['/images/auto/neptune-blue-1.webp'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/auto/neptune-blue-1.webp'],
    },
  }
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const settings = await getSiteSettings(locale)
  const facebookUrl = settings.socialLinks.find((link) => link.platform === 'Facebook')?.url
  const youtubeUrl = settings.socialLinks.find((link) => link.platform === 'YouTube')?.url

  // Same name/address/phone as the footer and the Google Business Profile (NAP consistency).
  const toE164 = (phone: string) => `+94${phone.replace(/\D/g, '').replace(/^0/, '')}`
  const realProfiles = settings.socialLinks
    .map((link) => link.url)
    .filter((url): url is string => Boolean(url) && !/^https:\/\/www\.(facebook|youtube)\.com\/?$/.test(url!))
  const postcode = settings.address.match(/\b\d{5}\b/)?.[0]

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: 'Neptune Electric Three-Wheelers',
    description: 'Electric three-wheelers built for daily loads, longer routes and lower running costs, by Garudan (Pvt) Ltd.',
    url: siteUrl,
    logo: `${siteUrl}/images/assistant/neptune-assistant.webp`,
    image: `${siteUrl}/images/auto/neptune-blue-1.webp`,
    telephone: toE164(settings.phone),
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address.replace(/,?\s*\d{5}$/, ''),
      ...(postcode ? { postalCode: postcode } : {}),
      addressCountry: 'LK',
    },
    ...(settings.businessHours === 'Open 24 hours'
      ? { openingHoursSpecification: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '00:00', closes: '23:59' } }
      : { openingHours: settings.businessHours }),
    ...(realProfiles.length ? { sameAs: realProfiles } : {}),
  }

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={fontStylesheet(locale)} rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body id="scrool">
        <NextIntlClientProvider>
          {children}
          {youtubeUrl && <YouTubeButton url={youtubeUrl} />}
          {facebookUrl && <FacebookButton url={facebookUrl} />}
          <WhatsAppButton phone={settings.whatsapp} />
          <Assistant
            contacts={{
              whatsapp: settings.whatsapp,
              headOffice: settings.phone,
              hotline: settings.otherPhones[settings.otherPhones.length - 1] ?? jaffnaDealer.phone,
            }}
          />
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
