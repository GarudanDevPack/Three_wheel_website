import type { Metadata } from 'next'
import { Inter, Noto_Sans_Sinhala, Noto_Sans_Tamil, Red_Hat_Display } from 'next/font/google'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import '@/styles/tailwind.css'
import { routing, type AppLocale } from '@/i18n/routing'
import { defaultOgImage, localizedPath, socialMetadata } from '@/lib/pageSeo'
import JsonLd from '@/components/seo/JsonLd'
import { getSiteSettings } from '@/lib/siteSettings'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import MobileCtaBar from '@/components/ui/MobileCtaBar'
import FacebookButton from '@/components/ui/FacebookButton'
import YouTubeButton from '@/components/ui/YouTubeButton'
import Assistant from '@/components/assistant/LazyAssistant'
import { jaffnaDealer } from '@/lib/dealers'
import CookieConsent from '@/components/ui/CookieConsent'
import Analytics from '@/components/ui/Analytics'
import LinkTracking from '@/components/ui/LinkTracking'
import LanguageSuggestion from '@/components/ui/LanguageSuggestion'
import IntroGate from '@/components/ui/IntroGate'

import { siteUrl } from '@/lib/site'

// Self-hosted by next/font (no Google Fonts request at runtime). Latin fonts are preloaded; the
// Sinhala / Tamil script fonts are only applied, and so only downloaded, on the language that needs them.
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })
const redHatDisplay = Red_Hat_Display({ subsets: ['latin'], display: 'swap', variable: '--font-red-hat' })
const notoSinhala = Noto_Sans_Sinhala({ subsets: ['sinhala'], display: 'swap', preload: false, variable: '--font-noto-sinhala' })
const notoTamil = Noto_Sans_Tamil({ subsets: ['tamil'], display: 'swap', preload: false, variable: '--font-noto-tamil' })
const scriptFont: Record<string, string> = { si: notoSinhala.variable, ta: notoTamil.variable }

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
    ...socialMetadata(locale as AppLocale, { title, description, url: localizedPath('/', locale as AppLocale) }),
    // Search Console HTML-tag verification (DNS verification needs no code).
    ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
      ? { verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } }
      : {}),
  }
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const [settings, tMeta] = await Promise.all([getSiteSettings(locale), getTranslations({ locale, namespace: 'Meta' })])
  const facebookUrl = settings.socialLinks.find((link) => link.platform === 'Facebook')?.url
  const youtubeUrl = settings.socialLinks.find((link) => link.platform === 'YouTube')?.url

  // Same name/address/phone as the footer and the Google Business Profile (NAP consistency).
  const toE164 = (phone: string) => `+94${phone.replace(/\D/g, '').replace(/^0/, '')}`
  const realProfiles = settings.socialLinks
    .map((link) => link.url)
    .filter((url): url is string => Boolean(url) && !/^https:\/\/www\.(facebook|youtube)\.com\/?$/.test(url!))
  // "No 13, Galle Road, Mount Lavinia, Colombo 10379" → street / locality / postcode (same as the footer).
  const postcode = settings.address.match(/\b\d{5}\b/)?.[0]
  const addressParts = settings.address.replace(/\s*\d{5}\s*$/, '').split(',').map((part) => part.trim())
  const locality = addressParts.length > 1 ? addressParts.pop() : undefined

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: 'Neptune',
    // Same language as the page (the site description from that locale's message file).
    description: tMeta('siteDescription'),
    url: siteUrl,
    logo: `${siteUrl}/icon.png`,
    image: `${siteUrl}${defaultOgImage.url}`,
    telephone: toE164(settings.phone),
    address: {
      '@type': 'PostalAddress',
      streetAddress: addressParts.join(', '),
      ...(locality ? { addressLocality: locality } : {}),
      ...(postcode ? { postalCode: postcode } : {}),
      addressCountry: 'LK',
    },
    ...(settings.businessHours === 'Open 24 hours'
      ? { openingHoursSpecification: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '00:00', closes: '23:59' } }
      : { openingHours: settings.businessHours }),
    ...(realProfiles.length ? { sameAs: realProfiles } : {}),
  }

  return (
    <html lang={locale} className={`${inter.variable} ${redHatDisplay.variable} ${scriptFont[locale] ?? ''}`}>
      <head>
        <JsonLd data={localBusinessJsonLd} />
      </head>
      {/* Bottom padding on phones/tablets so the sticky contact bar never covers the footer. */}
      <body id="scrool" className="tw:pb-[76px] tw:lg:pb-0">
        <NextIntlClientProvider>
          {children}
          {youtubeUrl && <YouTubeButton url={youtubeUrl} />}
          {facebookUrl && <FacebookButton url={facebookUrl} />}
          <WhatsAppButton phone={settings.whatsapp} />
          <MobileCtaBar phone={settings.phone} whatsapp={settings.whatsapp} />
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
          {/* GA4 ID from the environment; the older CMS field is only a fallback. */}
          <Analytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || settings.gaMeasurementId} />
          <LinkTracking />
          <LanguageSuggestion />
          <IntroGate />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
