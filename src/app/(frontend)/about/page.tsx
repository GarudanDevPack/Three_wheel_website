import Link from 'next/link'
import type { Metadata } from 'next'
import Preloader from '@/components/animations/LazyPreloader'
import Header from '@/components/vehicle/Header'
import Footer from '@/components/vehicle/Footer'
import FaqAccordion from '@/components/ui/FaqAccordion'
import { getPageMetadata } from '@/lib/pageSeo'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('about', {
    title: 'About Neptune',
    description: 'Neptune designs and builds passenger and cargo three-wheelers built for daily loads and longer routes.',
  })
}

const faqs = [
  {
    question: 'What fuel types are available?',
    answer: 'Neptune three-wheelers are available in Petrol, CNG, LPG, and Electric variants depending on the model.',
  },
  {
    question: 'What is the warranty coverage?',
    answer: 'Every Neptune vehicle ships with a standard warranty policy — see the vehicle detail page for the full document.',
  },
  {
    question: 'Can I test drive before buying?',
    answer: 'Yes — request a test ride from any vehicle page or your nearest dealer.',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
}

const AboutPage = () => (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
    />
    <Preloader />
    <Header />
    <main>
      <section className="tw:bg-brand-ink tw:py-20 tw:text-white">
        <div className="tw:mx-auto tw:max-w-4xl tw:px-6 tw:text-center">
          <p className="tw:text-sm tw:font-semibold tw:uppercase tw:tracking-widest tw:text-brand-blue-light">
            About Neptune
          </p>
          <h1 className="tw:mt-4 tw:text-4xl tw:font-bold">Built for the roads that carry a livelihood.</h1>
          <p className="tw:mt-6 tw:text-white/70">
            Neptune designs and builds passenger and cargo three-wheelers engineered for daily
            loads, longer routes, and lower running costs — so every trip pays for itself.
          </p>
        </div>
      </section>

      <section className="tw:bg-surface tw:py-20">
        <div className="tw:mx-auto tw:grid tw:max-w-5xl tw:gap-8 tw:px-6 tw:sm:grid-cols-3">
          {[
            { label: 'Passenger & Cargo Models', value: 'Built for every route' },
            { label: 'Fuel Options', value: 'Petrol · CNG · LPG · Electric' },
            { label: 'Dealer Network', value: 'Growing across every state' },
          ].map((item) => (
            <div key={item.label} className="tw:rounded-2xl tw:bg-surface-raised tw:p-6 tw:text-center">
              <p className="tw:text-lg tw:font-bold tw:text-white">{item.value}</p>
              <p className="tw:mt-1 tw:text-sm tw:text-white/60">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="tw:bg-surface-raised tw:py-20">
        <div className="tw:mx-auto tw:max-w-3xl tw:px-6">
          <h2 className="tw:text-3xl tw:font-bold tw:text-white">Frequently asked questions</h2>
          <div className="tw:mt-8">
            <FaqAccordion items={faqs} />
          </div>
        </div>
      </section>

      <section className="tw:bg-surface tw:py-16 tw:text-center">
        <Link
          href="/vehicles"
          className="tw:inline-block tw:rounded-full tw:bg-brand-blue tw:px-8 tw:py-3 tw:text-sm tw:font-semibold tw:text-white"
        >
          Explore the lineup
        </Link>
      </section>
    </main>
    <Footer />
  </>
)

export default AboutPage
