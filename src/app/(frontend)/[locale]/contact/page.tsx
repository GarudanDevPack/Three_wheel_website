import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Preloader from '@/components/animations/LazyPreloader'
import Header from '@/components/vehicle/Header'
import Footer from '@/components/vehicle/Footer'
import InquiryForm from '@/components/ui/InquiryForm'
import SectionBackdrop from '@/components/ui/SectionBackdrop'
import type { AppLocale } from '@/i18n/routing'
import { getPageMetadata } from '@/lib/pageSeo'
import { getSiteSettings } from '@/lib/siteSettings'

export const revalidate = 300

type PageProps = { params: Promise<{ locale: AppLocale }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Contact' })
  return getPageMetadata('contact', locale, { title: t('metaTitle'), description: t('metaDescription') })
}

const ContactPage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Contact')
  const settings = await getSiteSettings(locale)

  return (
    <>
      <Preloader />
      <Header />
      <main>
        <section className="tw:relative tw:isolate tw:overflow-hidden tw:bg-surface tw:py-20">
          <SectionBackdrop src="/images/auto/night-ride.jpg" variant="soft" base="surface" />
          <div className="tw:relative tw:z-10 tw:mx-auto tw:max-w-4xl tw:px-6 tw:text-center">
            <h1 className="tw:text-4xl tw:font-bold tw:text-brand-ink tw:md:text-5xl">{t('title')}</h1>
            <p className="tw:mt-4 tw:text-brand-ink/60">{t('intro')}</p>
            <div className="tw:mt-8 tw:flex tw:flex-wrap tw:items-center tw:justify-center tw:gap-x-8 tw:gap-y-2 tw:text-sm tw:font-semibold tw:text-brand-ink/70">
              <span>{settings.address}</span>
              <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="tw:transition tw:hover:text-brand-blue">
                {settings.phone}
              </a>
              <span>{settings.businessHours}</span>
            </div>
          </div>
        </section>
        <InquiryForm defaultType="Single Vehicle" title={t('formTitle')} description={t('formDescription')} />
      </main>
      <Footer />
    </>
  )
}

export default ContactPage
