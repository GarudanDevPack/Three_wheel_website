import { getLocale } from 'next-intl/server'
import { getSiteSettings } from '@/lib/siteSettings'
import type { AppLocale } from '@/i18n/routing'
import FooterReveal, { type ContactRow, type SocialLink } from './FooterReveal'

const socialIconPaths: Record<string, string> = {
  Facebook:
    'M14 9.5h2.5V6h-2.5c-1.9 0-3.5 1.6-3.5 3.5V12H8.5v3.5H10.5V22H14v-6.5h2.3l.4-3.5H14V9.7c0-.4.1-.2.3-.2z',
  LinkedIn:
    'M6.5 9h3v10h-3V9zM8 4.5A1.75 1.75 0 1 1 8 8a1.75 1.75 0 0 1 0-3.5zM12.5 9h2.9v1.4h.04c.4-.75 1.4-1.55 2.9-1.55 3.1 0 3.66 2 3.66 4.7V19h-3v-4.9c0-1.15-.02-2.65-1.6-2.65-1.6 0-1.85 1.25-1.85 2.55V19h-3V9z',
  YouTube:
    'M21.5 8.5s-.2-1.4-.8-2c-.75-.8-1.6-.8-2-.85C15.9 5.4 12 5.4 12 5.4h0s-3.9 0-6.7.25c-.4.05-1.25.05-2 .85-.6.6-.8 2-.8 2S2.3 10.1 2.3 11.7v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.75.8 1.75.78 2.2.87 1.6.15 6.5.24 6.5.24s3.9 0 6.7-.25c.4-.05 1.25-.05 2-.85.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5c0-1.6-.2-3.2-.2-3.2zM9.9 15V9.4l5.4 2.8-5.4 2.8z',
}

const defaultSocialPlatforms = ['Facebook', 'LinkedIn', 'YouTube']

const Footer = async () => {
  const locale = (await getLocale()) as AppLocale
  const settings = await getSiteSettings(locale)

  const contactRows: ContactRow[] = [
    { type: 'address', label: settings.address },
    { type: 'phone', label: settings.phone },
    ...(settings.email ? [{ type: 'email' as const, label: settings.email }] : []),
  ]

  const linkedByPlatform = new Map(
    settings.socialLinks
      .filter((link) => link.platform && link.url)
      .map((link) => [link.platform as string, link.url as string]),
  )

  const socialLinks: SocialLink[] = defaultSocialPlatforms.map((platform) => ({
    label: platform,
    path: socialIconPaths[platform],
    url: linkedByPlatform.get(platform),
  }))

  return <FooterReveal contactRows={contactRows} socialLinks={socialLinks} />
}

export default Footer
