import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import Preloader from '@/components/animations/LazyPreloader'
import Header from '@/components/vehicle/Header'
import Footer from '@/components/vehicle/Footer'
import { getPageMetadata } from '@/lib/pageSeo'

export const revalidate = 300

type PageProps = { params: Promise<{ locale: AppLocale }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Legal' })
  return getPageMetadata('terms-conditions', locale, {
    title: t('termsTitle'),
    description: 'The terms and conditions governing use of the Neptune website.',
  })
}

const sections = [
  {
    title: 'Copyright and intellectual property usage',
    content: [
      'All content on this website, including text, graphics, logos, and trademarks, is the intellectual property of Neptune unless otherwise noted.',
      'Images on this website may include licensed stock photos and may not be reproduced without permission.',
    ],
  },
  {
    title: 'Website usage terms',
    content: [
      'By accessing this website, you agree to comply with these terms and use the site only for lawful purposes.',
      'Users must not submit or transmit any unlawful, abusive, defamatory, or otherwise objectionable content through this site.',
      'This website may contain links to external sites that Neptune does not control and is not responsible for.',
    ],
  },
  {
    title: 'Software and services',
    content: [
      'Our services are provided on an "as-is" and "as-available" basis, without warranties of any kind, express or implied.',
    ],
  },
  {
    title: 'Personal information policy',
    content: [
      'Neptune adheres to ethical business practices and safeguards your personal information as described in our Privacy Policy.',
    ],
  },
  {
    title: 'Disclaimer',
    content: [
      'Information on this website is provided in good faith and sourced from reliable providers, but Neptune makes no guarantee of completeness or accuracy.',
      'Neptune disclaims all warranties, including those related to fitness for a particular purpose, to the fullest extent permitted by law.',
    ],
  },
  {
    title: 'Limitation of liability',
    content: [
      'Neptune disclaims liability for any damages, including lost data or profits, arising from the use of this website.',
    ],
  },
]

const TermsPage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Legal')

  return (
  <>
    <Preloader />
    <Header />
    <main>
      <section className="tw:bg-surface tw:py-20 tw:text-brand-ink">
        <div className="tw:mx-auto tw:max-w-4xl tw:px-6 tw:text-center">
          <p className="tw:text-sm tw:font-semibold tw:text-brand-blue">{t('termsTitle')}</p>
          <h1 className="tw:mt-4 tw:text-4xl tw:font-bold">{t('termsHeading')}</h1>
          {locale !== 'en' && (
            <p className="tw:mx-auto tw:mt-4 tw:max-w-xl tw:rounded-xl tw:bg-brand-blue/10 tw:px-4 tw:py-2 tw:text-sm tw:text-brand-ink/70">
              {t('englishOnly')}
            </p>
          )}
          <p className="tw:mt-4 tw:text-sm tw:text-brand-ink/50">Updated December 10th, 2024</p>
        </div>
      </section>

      <section className="tw:bg-surface tw:pb-20">
        <div className="tw:mx-auto tw:max-w-3xl tw:px-6 tw:text-brand-ink/80">
          {sections.map((section) => (
            <div key={section.title} className="tw:mb-10">
              <h2 className="tw:text-xl tw:font-bold tw:text-brand-ink">{section.title}</h2>
              {section.content.map((text) => (
                <p key={text} className="tw:mt-3 tw:leading-relaxed">
                  {text}
                </p>
              ))}
            </div>
          ))}

          <div>
            <h2 className="tw:text-xl tw:font-bold tw:text-brand-ink">Contact</h2>
            <p className="tw:mt-3 tw:leading-relaxed">
              <Link href="/contact" className="tw:text-brand-blue-light tw:underline">
                Click here
              </Link>{' '}
              to contact us regarding these Terms &amp; Conditions, or email{' '}
              <a href="mailto:contact@neptune.com" className="tw:text-brand-blue-light tw:underline">
                contact@neptune.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </>
  )
}

export default TermsPage
