import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Preloader from '@/components/animations/LazyPreloader'
import Header from '@/components/vehicle/Header'
import Footer from '@/components/vehicle/Footer'
import FaqAccordion from '@/components/ui/FaqAccordion'
import SectionBackdrop from '@/components/ui/SectionBackdrop'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { getPageMetadata } from '@/lib/pageSeo'

export const revalidate = 300

type PageProps = { params: Promise<{ locale: AppLocale }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'About' })
  return getPageMetadata('about', locale, { title: t('metaTitle'), description: t('metaDescription') })
}

const faqKeys = ['electric', 'warranty', 'testDrive'] as const
const highlightKeys = ['models', 'drivetrain', 'network'] as const

const AboutPage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('About')
  const caps = locale === 'en' ? 'tw:uppercase tw:tracking-widest' : ''

  const faqs = faqKeys.map((key) => ({ question: t(`faq.${key}.q`), answer: t(`faq.${key}.a`) }))
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Preloader />
      <Header />
      <main>
        <section className="tw:relative tw:isolate tw:overflow-hidden tw:bg-surface tw:py-20 tw:text-brand-ink">
          <SectionBackdrop src="/images/auto/gallery-1.png" variant="soft" base="surface" />
          <div className="tw:relative tw:z-10 tw:mx-auto tw:max-w-4xl tw:px-6 tw:text-center">
            <p className={`tw:text-sm tw:font-semibold tw:text-brand-blue ${caps}`}>{t('eyebrow')}</p>
            <h1 className="tw:mt-4 tw:text-4xl tw:font-bold tw:md:text-5xl">{t('title')}</h1>
            <p className="tw:mt-6 tw:text-brand-ink/70">{t('intro')}</p>
          </div>
        </section>

        <section className="tw:bg-surface tw:py-20">
          <div className="tw:mx-auto tw:grid tw:max-w-5xl tw:gap-8 tw:px-6 tw:sm:grid-cols-3">
            {highlightKeys.map((key) => (
              <div key={key} className="tw:rounded-2xl tw:border tw:border-brand-ink/10 tw:bg-surface-raised tw:p-6 tw:text-center">
                <p className="tw:text-lg tw:font-bold tw:text-brand-ink">{t(`highlights.${key}.value`)}</p>
                <p className="tw:mt-1 tw:text-sm tw:text-brand-ink/60">{t(`highlights.${key}.label`)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="tw:bg-surface-raised tw:py-20">
          <div className="tw:mx-auto tw:max-w-3xl tw:px-6">
            <h2 className="tw:text-3xl tw:font-bold tw:text-brand-ink">{t('faqTitle')}</h2>
            <div className="tw:mt-8">
              <FaqAccordion items={faqs} />
            </div>
          </div>
        </section>

        <section className="tw:bg-surface tw:py-16 tw:text-center">
          <Link
            href="/vehicles"
            className="tw:inline-block tw:rounded-full tw:bg-brand-blue tw:px-8 tw:py-3 tw:text-sm tw:font-semibold tw:text-white tw:transition tw:hover:bg-brand-blue-light"
          >
            {t('cta')}
          </Link>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default AboutPage
