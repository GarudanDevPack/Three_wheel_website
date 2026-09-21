import Link from 'next/link'
import type { Metadata } from 'next'
import Preloader from '@/components/animations/LazyPreloader'
import Header from '@/components/vehicle/Header'
import Footer from '@/components/vehicle/Footer'
import { getPageMetadata } from '@/lib/pageSeo'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('privacy-policy', {
    title: 'Privacy Policy | Neptune',
    description: 'How Neptune collects, uses, and protects your personal data.',
  })
}

const sections = [
  {
    title: 'Data controller and data collection',
    content: [
      'Neptune is committed to safeguarding your privacy. This policy explains what personal data we collect through this website and how it is used.',
      'Certain types of data may be necessary to access and utilize specific features, such as submitting a test ride, sales, fleet, or dealership enquiry.',
    ],
  },
  {
    title: 'User responsibilities',
    content: [
      'Users are responsible for any third-party data shared via the Neptune website and must ensure they have the right to share it.',
    ],
  },
  {
    title: 'Data processing and security',
    content: [
      'Data is processed using secure IT systems at Neptune’s operational offices and is protected against unauthorized access, alteration, or disclosure.',
    ],
  },
  {
    title: 'Data storage and retention',
    content: [
      'Personal data is retained only for as long as necessary to fulfil the purpose it was collected for, or as required by law.',
    ],
  },
  {
    title: 'Legal action',
    content: [
      'Neptune may disclose personal data to comply with legal obligations, protect our rights, or respond to lawful requests from public authorities.',
    ],
  },
  {
    title: 'User rights',
    content: [
      'Users have the right to access, update, or delete their personal data. You may:',
    ],
    list: [
      'Request information about the personal data Neptune holds.',
      'Correct any inaccurate or incomplete data.',
      'Request the deletion of your data when it’s no longer needed.',
      'Request your data in a transferable format.',
      'Limit the processing of your data in certain situations.',
      'Object to the processing of your data for direct marketing or legitimate interests.',
      'Withdraw consent for data processing at any time.',
      'File a complaint with a supervisory authority if you feel your rights are violated.',
    ],
  },
  {
    title: '‘Do not track’ requests',
    content: ['Neptune does not currently support “Do Not Track” browser signals.'],
  },
  {
    title: 'Policy updates',
    content: ['Neptune may update this Privacy Policy periodically. Continued use of the site after changes constitutes acceptance of the revised policy.'],
  },
]

const PrivacyPage = () => (
  <>
    <Preloader />
    <Header />
    <main>
      <section className="tw:bg-brand-ink tw:py-20 tw:text-white">
        <div className="tw:mx-auto tw:max-w-4xl tw:px-6 tw:text-center">
          <p className="tw:text-sm tw:font-semibold tw:uppercase tw:tracking-widest tw:text-brand-blue-light">
            Privacy Policy
          </p>
          <h1 className="tw:mt-4 tw:text-4xl tw:font-bold">Your access and usage rights</h1>
          <p className="tw:mt-4 tw:text-sm tw:text-white/50">Updated December 10th, 2024</p>
        </div>
      </section>

      <section className="tw:bg-brand-ink tw:pb-20">
        <div className="tw:mx-auto tw:max-w-3xl tw:px-6 tw:text-white/80">
          {sections.map((section) => (
            <div key={section.title} className="tw:mb-10">
              <h2 className="tw:text-xl tw:font-bold tw:text-white">{section.title}</h2>
              {section.content.map((text) => (
                <p key={text} className="tw:mt-3 tw:leading-relaxed">
                  {text}
                </p>
              ))}
              {section.list && (
                <ul className="tw:mt-3 tw:list-disc tw:space-y-1 tw:pl-5">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div>
            <h2 className="tw:text-xl tw:font-bold tw:text-white">Contact</h2>
            <p className="tw:mt-3 tw:leading-relaxed">
              <Link href="/contact" className="tw:text-brand-blue-light tw:underline">
                Click here
              </Link>{' '}
              to contact us regarding this Privacy Policy, or email{' '}
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

export default PrivacyPage
