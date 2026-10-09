import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import Preloader from '@/components/animations/LazyPreloader'
import Header from '@/components/vehicle/Header'
import Footer from '@/components/vehicle/Footer'
import SectionBackdrop from '@/components/ui/SectionBackdrop'
import { getPageMetadata } from '@/lib/pageSeo'

export const revalidate = 300

type PageProps = { params: Promise<{ locale: AppLocale }> }

const manualPdf = '/docs/neptune-user-manual-service-book.pdf'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Warranty' })
  return getPageMetadata('warranty', locale, { title: t('metaTitle'), description: t('metaDescription') })
}

// Terms and conditions of warranty — User Manual & Service Book, pages 08–09.
const warrantyTerms = [
  {
    title: 'Warranty period',
    content: [
      'The warranty for your Neptune Electric Three Wheeler is valid for 24 months from the date of delivery or 50,000 km, whichever comes first, subject to these terms and conditions.',
      'The main LiFePO4 battery pack is covered by a 5-year manufacturer’s warranty with unlimited mileage from the date of vehicle delivery, subject to the terms and conditions of this warranty.',
      'Note: the charging port must be inspected by an authorized Garudan technician.',
    ],
  },
  {
    title: 'Manufacturer’s guarantee',
    content: [
      'Garudan (Pvt) Ltd guarantees that all parts of the Neptune Electric Three Wheeler are free from manufacturing defects and built with proper workmanship. In case of any manufacturing defect, the repair or replacement will be limited to the defective part only.',
    ],
  },
  {
    title: 'Company liability',
    content: [
      'The company’s liability is limited strictly to the repair or replacement of defective parts as specified under this warranty.',
    ],
  },
  {
    title: 'Warranty not applicable for',
    list: [
      'Regular maintenance operations such as brake or controller adjustments, cleaning, lubrication or tuning.',
      'Damage due to misuse, accidents, overloading or negligence.',
      'Any alteration or modification not authorized by Garudan (Pvt) Ltd.',
    ],
  },
  {
    title: 'Service records',
    content: [
      'Warranty claims will be entertained only if all service records and coupons are properly filled and stamped by an authorized Garudan service dealer.',
    ],
  },
  {
    title: 'Invalidation of warranty',
    content: ['The warranty will become void if:'],
    list: [
      'The odometer is tampered with or disconnected.',
      'The vehicle has not been serviced at the prescribed intervals.',
      'Non-Garudan spare parts or accessories are used.',
      'Repairs are done at unauthorized workshops.',
    ],
  },
  {
    title: 'No refund or replacement of vehicle',
    content: [
      'Garudan (Pvt) Ltd will not exchange the vehicle, refund payment, or replace the unit once sold and delivered to the customer.',
    ],
  },
  {
    title: 'Consequential loss',
    content: [
      'The company will not be liable for any indirect or consequential damages or losses arising out of the use or inability to use the vehicle.',
    ],
  },
  {
    title: 'Force majeure',
    content: [
      'The company shall not be held responsible for any failure caused by natural disasters, strikes, or any other circumstances beyond its control.',
    ],
  },
  {
    title: 'Company rights',
    content: [
      'Garudan (Pvt) Ltd reserves the right to repair, replace, or modify parts at its discretion during the warranty period.',
    ],
  },
]

// Recommended service schedule — Service Book page 10.
const serviceSchedule = [
  { service: '1', mileage: '1,000 km or 60 days from purchase, whichever is earlier' },
  { service: '2', mileage: '2,500 km' },
  { service: '3', mileage: '5,000 km' },
  { service: '4', mileage: '7,500 km' },
  { service: '5', mileage: '10,000 km' },
  { service: '6', mileage: '12,500 km' },
  { service: '7', mileage: '15,000 km and every 2,500 km thereafter' },
]

// User Manual pages 14, 15, 23, 28 and 29.
const ownerCare = [
  {
    title: 'Charging',
    list: [
      'Charge from a properly earthed 220–240 V AC outlet using only the original on-board charger.',
      'Park on a flat, dry surface, switch the vehicle OFF and apply the parking brake before charging.',
      'Push the connector in until you hear a “tick”, and keep the socket clean, dry and covered after charging.',
      'Allow 30 minutes to cool after long use, and avoid charging in rain or direct sunlight.',
    ],
  },
  {
    title: 'Battery care',
    list: [
      'Recharge when the level falls below 20%.',
      'For long-term storage, keep the charge between 50% and 70% and turn the BMS off.',
      'Never open, modify or repair the battery or charger yourself — contact your dealer if you notice unusual heat or smell.',
      'Maximum water wading depth is 1 foot from the ground.',
    ],
  },
  {
    title: 'Tyres & routine checks',
    list: [
      'Tyre pressure: 30 psi front, 35 psi rear — check weekly.',
      'Inspect brakes monthly and tighten nuts and bolts monthly.',
      'Check and lubricate the suspension quarterly; inspect motor and wiring connections every 6 months.',
      'Repair punctures by vulcanising or patching only — avoid liquid sealants.',
    ],
  },
]

const WarrantyPage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, tLegal] = await Promise.all([getTranslations('Warranty'), getTranslations('Legal')])

  return (
    <>
      <Preloader />
      <Header />
      <main>
        <section className="tw:relative tw:isolate tw:overflow-hidden tw:bg-surface tw:py-20 tw:text-brand-ink">
          <SectionBackdrop src="/images/auto/green-1.png" variant="soft" base="surface" />
          <div className="tw:relative tw:z-10 tw:mx-auto tw:max-w-4xl tw:px-6 tw:text-center">
            <p className="tw:text-sm tw:font-semibold tw:text-brand-blue">{t('eyebrow')}</p>
            <h1 className="tw:mt-4 tw:text-4xl tw:font-bold tw:md:text-5xl">{t('heading')}</h1>
            <p className="tw:mx-auto tw:mt-4 tw:max-w-2xl tw:text-brand-ink/70">{t('intro')}</p>
            {locale !== 'en' && (
              <p className="tw:mx-auto tw:mt-4 tw:max-w-xl tw:rounded-xl tw:bg-brand-blue/10 tw:px-4 tw:py-2 tw:text-sm tw:text-brand-ink/70">
                {tLegal('englishOnly')}
              </p>
            )}

            <div className="tw:mx-auto tw:mt-10 tw:grid tw:max-w-2xl tw:gap-4 tw:sm:grid-cols-2">
              {[
                { label: t('vehicleLabel'), value: t('vehicleValue'), note: t('vehicleNote') },
                { label: t('batteryLabel'), value: t('batteryValue'), note: t('batteryNote') },
              ].map((card) => (
                <div
                  key={card.label}
                  className="tw:rounded-3xl tw:border tw:border-brand-ink/10 tw:bg-surface-raised/80 tw:px-6 tw:py-6 tw:text-left"
                >
                  <p className="tw:text-xs tw:font-semibold tw:text-brand-ink/50">{card.label}</p>
                  <p className="tw:mt-2 tw:text-2xl tw:font-bold tw:text-brand-blue">{card.value}</p>
                  <p className="tw:mt-1 tw:text-sm tw:text-brand-ink/60">{card.note}</p>
                </div>
              ))}
            </div>

            <a
              href={manualPdf}
              download
              className="tw:mt-10 tw:inline-flex tw:items-center tw:gap-3 tw:rounded-full tw:bg-brand-blue tw:px-7 tw:py-3 tw:text-sm tw:font-semibold tw:text-white tw:transition tw:hover:bg-brand-blue-light"
            >
              <svg viewBox="0 0 24 24" className="tw:h-5 tw:w-5" fill="none" aria-hidden="true">
                <path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t('download')}
              <span className="tw:font-normal tw:text-white/70">{t('downloadNote')}</span>
            </a>
          </div>
        </section>

        <section className="tw:bg-surface tw:pb-20">
          <div className="tw:mx-auto tw:max-w-3xl tw:px-6 tw:text-brand-ink/80">
            <h2 className="tw:text-2xl tw:font-bold tw:text-brand-ink">{t('termsHeading')}</h2>
            <ol className="tw:mt-8 tw:list-none tw:space-y-8 tw:p-0">
              {warrantyTerms.map((term, index) => (
                <li key={term.title}>
                  <h3 className="tw:text-lg tw:font-bold tw:text-brand-ink">
                    <span className="tw:mr-2 tw:text-brand-blue">{index + 1}.</span>
                    {term.title}
                  </h3>
                  {term.content?.map((text) => (
                    <p key={text} className="tw:mt-2 tw:leading-relaxed">
                      {text}
                    </p>
                  ))}
                  {term.list && (
                    <ul className="tw:mt-2 tw:list-disc tw:space-y-1 tw:pl-5 tw:leading-relaxed">
                      {term.list.map((text) => (
                        <li key={text}>{text}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="tw:bg-surface-raised tw:py-20">
          <div className="tw:mx-auto tw:max-w-3xl tw:px-6">
            <h2 className="tw:text-2xl tw:font-bold tw:text-brand-ink">{t('scheduleHeading')}</h2>
            <p className="tw:mt-3 tw:text-brand-ink/70">{t('scheduleIntro')}</p>
            <div className="tw:mt-8 tw:overflow-hidden tw:rounded-2xl tw:border tw:border-brand-ink/10 tw:bg-surface">
              <table className="tw:w-full tw:text-left tw:text-sm">
                <thead className="tw:bg-brand-ink tw:text-white">
                  <tr>
                    <th scope="col" className="tw:w-28 tw:px-5 tw:py-3 tw:font-semibold">{t('serviceColumn')}</th>
                    <th scope="col" className="tw:px-5 tw:py-3 tw:font-semibold">{t('mileageColumn')}</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceSchedule.map((row) => (
                    <tr key={row.service} className="tw:border-t tw:border-brand-ink/10">
                      <td className="tw:px-5 tw:py-3 tw:font-semibold tw:text-brand-blue">{row.service}</td>
                      <td className="tw:px-5 tw:py-3 tw:text-brand-ink/80">{row.mileage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="tw:mt-4 tw:text-sm tw:text-brand-ink/60">
              If the vehicle is used in extreme conditions — dusty environments, steep terrain, heavy loads or frequent
              start-stop driving — preventive maintenance should be done more often than these intervals.
            </p>
          </div>
        </section>

        <section className="tw:bg-surface tw:py-20">
          <div className="tw:mx-auto tw:max-w-6xl tw:px-6">
            <h2 className="tw:text-2xl tw:font-bold tw:text-brand-ink">{t('careHeading')}</h2>
            <div className="tw:mt-8 tw:grid tw:gap-6 tw:md:grid-cols-3">
              {ownerCare.map((group) => (
                <div key={group.title} className="tw:rounded-3xl tw:border tw:border-brand-ink/10 tw:bg-surface-raised tw:p-6">
                  <h3 className="tw:text-lg tw:font-bold tw:text-brand-ink">{group.title}</h3>
                  <ul className="tw:mt-3 tw:list-disc tw:space-y-2 tw:pl-5 tw:text-sm tw:leading-relaxed tw:text-brand-ink/75">
                    {group.list.map((text) => (
                      <li key={text}>{text}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="tw:mt-12 tw:flex tw:flex-col tw:items-center tw:gap-4 tw:text-center">
              <p className="tw:text-brand-ink/70">{t('questions')}</p>
              <Link
                href="/contact"
                className="tw:rounded-full tw:border tw:border-brand-blue/40 tw:px-6 tw:py-2.5 tw:text-sm tw:font-semibold tw:text-brand-blue tw:transition tw:hover:border-brand-blue"
              >
                {t('contact')}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default WarrantyPage
