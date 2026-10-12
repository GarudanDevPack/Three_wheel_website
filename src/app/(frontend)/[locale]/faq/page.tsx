import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Preloader from '@/components/animations/LazyPreloader'
import Header from '@/components/vehicle/Header'
import Footer from '@/components/vehicle/Footer'
import FaqAccordion, { type FaqItem } from '@/components/ui/FaqAccordion'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { getPageMetadata } from '@/lib/pageSeo'
import { getSiteSettings } from '@/lib/siteSettings'

export const revalidate = 300

type PageProps = { params: Promise<{ locale: AppLocale }> }
type FaqGroup = { id: string; title: string; items: FaqItem[] }

const digits = (phone: string) => phone.replace(/\D/g, '')

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Faq' })
  return getPageMetadata('faq', locale, { title: t('metaTitle'), description: t('metaDescription') })
}

const FaqPage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, settings] = await Promise.all([getTranslations('Faq'), getSiteSettings(locale)])
  const groups = t.raw('groups') as FaqGroup[]

  // The site's one FAQPage block: every question on this page.
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: groups.flatMap((group) =>
      group.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    ),
  }

  const phones = [settings.phone, ...settings.otherPhones]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Preloader />
      <Header />
      <main>
        <section className="tw:bg-surface-raised tw:py-16 tw:md:py-20">
          <div className="tw:mx-auto tw:max-w-6xl tw:px-6">
            <p className="tw:text-sm tw:font-semibold tw:text-brand-blue">{t('eyebrow')}</p>
            <h1 className="tw:mt-2 tw:max-w-3xl tw:text-4xl tw:font-bold tw:leading-tight tw:text-brand-ink tw:md:text-5xl">{t('title')}</h1>
            <p className="tw:mt-4 tw:max-w-2xl tw:text-lg tw:leading-relaxed tw:text-brand-ink/70">{t('intro')}</p>

            <nav aria-label={t('jumpTo')} className="tw:mt-8">
              <p className="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wide tw:text-brand-ink/50">{t('jumpTo')}</p>
              <ul className="tw:mt-3 tw:flex tw:list-none tw:flex-wrap tw:gap-2 tw:p-0">
                {groups.map((group) => (
                  <li key={group.id}>
                    <a
                      href={`#${group.id}`}
                      className="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:border tw:border-brand-ink/10 tw:bg-surface tw:px-4 tw:py-2 tw:text-sm tw:font-semibold tw:text-brand-ink tw:transition tw:hover:border-brand-blue tw:hover:text-brand-blue"
                    >
                      {group.title}
                      <span className="tw:rounded-full tw:bg-brand-blue/10 tw:px-2 tw:text-xs tw:text-brand-blue">{group.items.length}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>

        <section className="tw:bg-surface tw:py-16">
          <div className="tw:mx-auto tw:grid tw:max-w-6xl tw:gap-12 tw:px-6 tw:lg:grid-cols-12">
            <div className="tw:space-y-14 tw:lg:col-span-8">
              {groups.map((group, index) => (
                <section key={group.id} id={group.id} aria-labelledby={`${group.id}-title`} className="tw:scroll-mt-28">
                  <h2 id={`${group.id}-title`} className="tw:text-2xl tw:font-bold tw:text-brand-ink">
                    {group.title}
                  </h2>
                  <div className="tw:mt-5">
                    <FaqAccordion items={group.items} defaultOpen={index === 0 ? 0 : null} />
                  </div>
                </section>
              ))}
            </div>

            <aside className="tw:lg:col-span-4">
              <div className="tw:rounded-3xl tw:bg-brand-ink tw:p-7 tw:text-white tw:lg:sticky tw:lg:top-28">
                <p className="tw:text-xl tw:font-bold">{t('stillTitle')}</p>
                <p className="tw:mt-2 tw:text-sm tw:text-white/70">{t('stillText')}</p>
                <div className="tw:mt-5 tw:flex tw:flex-col tw:gap-2.5">
                  <a
                    href={`https://wa.me/94${digits(settings.whatsapp).replace(/^0/, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="tw:rounded-full tw:bg-[#25D366] tw:px-5 tw:py-3 tw:text-center tw:text-sm tw:font-semibold tw:text-white"
                  >
                    {t('whatsapp')}
                  </a>
                  {phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${digits(phone)}`}
                      className="tw:rounded-full tw:border tw:border-white/25 tw:px-5 tw:py-3 tw:text-center tw:text-sm tw:font-semibold tw:text-white tw:transition tw:hover:border-white/60"
                    >
                      {t('call', { phone })}
                    </a>
                  ))}
                  <Link
                    href="/contact"
                    className="tw:rounded-full tw:bg-brand-blue tw:px-5 tw:py-3 tw:text-center tw:text-sm tw:font-semibold tw:text-white tw:transition tw:hover:bg-brand-blue-light"
                  >
                    {t('testDrive')}
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default FaqPage
