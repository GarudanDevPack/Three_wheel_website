import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import FaqAccordion, { type FaqItem } from '@/components/ui/FaqAccordion'
import { getSiteSettings } from '@/lib/siteSettings'

const digits = (phone: string) => phone.replace(/\D/g, '')

/**
 * Home "Top questions" block. The full, grouped FAQ (and its FAQPage schema) lives on /faq,
 * so this block carries no structured data of its own.
 */
const HomeFaq = async () => {
  const locale = (await getLocale()) as AppLocale
  const [t, tFaq, settings] = await Promise.all([getTranslations('HomeFaq'), getTranslations('Faq'), getSiteSettings(locale)])
  const items = t.raw('top') as FaqItem[]

  return (
    <section id="faq" className="tw:bg-surface-raised tw:py-20">
      <div className="tw:mx-auto tw:grid tw:max-w-6xl tw:gap-10 tw:px-6 tw:lg:grid-cols-12">
        <div className="tw:lg:col-span-5">
          <div className="tw:lg:sticky tw:lg:top-28">
            <p className="tw:text-sm tw:font-semibold tw:text-brand-blue">{t('eyebrow')}</p>
            <h2 className="tw:mt-2 tw:text-3xl tw:font-bold tw:leading-tight tw:text-brand-ink tw:md:text-4xl">{t('title')}</h2>
            <p className="tw:mt-4 tw:text-base tw:leading-relaxed tw:text-brand-ink/70">{t('intro')}</p>
            <Link
              href="/faq"
              className="tw:mt-6 tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-brand-blue tw:px-6 tw:py-3 tw:text-sm tw:font-semibold tw:text-white tw:transition tw:hover:bg-brand-blue-light"
            >
              {t('seeAll')} <span aria-hidden="true">→</span>
            </Link>

            <div className="tw:mt-8 tw:rounded-3xl tw:bg-brand-ink tw:p-6 tw:text-white">
              <p className="tw:text-lg tw:font-bold">{tFaq('stillTitle')}</p>
              <p className="tw:mt-1 tw:text-sm tw:text-white/70">{tFaq('stillText')}</p>
              <div className="tw:mt-4 tw:flex tw:flex-wrap tw:gap-2">
                <a
                  href={`https://wa.me/94${digits(settings.whatsapp).replace(/^0/, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="tw:rounded-full tw:bg-[#25D366] tw:px-4 tw:py-2 tw:text-sm tw:font-semibold tw:text-white"
                >
                  {tFaq('whatsapp')}
                </a>
                <a
                  href={`tel:${digits(settings.phone)}`}
                  className="tw:rounded-full tw:border tw:border-white/30 tw:px-4 tw:py-2 tw:text-sm tw:font-semibold tw:text-white tw:transition tw:hover:border-white/60"
                >
                  {tFaq('call', { phone: settings.phone })}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="tw:lg:col-span-7">
          <FaqAccordion items={items} />
        </div>
      </div>
    </section>
  )
}

export default HomeFaq
