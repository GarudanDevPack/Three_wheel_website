import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import Header from '@/components/vehicle/Header'
import Footer from '@/components/vehicle/Footer'

export default async function NotFound() {
  const t = await getTranslations('NotFound')

  return (
    <>
      <Header />
      <main className="tw:bg-surface tw:py-32">
        <div className="tw:mx-auto tw:max-w-2xl tw:px-6 tw:text-center">
          <p className="tw:text-brand-blue tw:font-semibold">404</p>
          <h1 className="tw:mt-4 tw:text-4xl tw:font-bold tw:text-brand-ink">{t('title')}</h1>
          <p className="tw:mt-4 tw:text-brand-ink/70">{t('text')}</p>
          <Link
            href="/"
            className="tw:mt-8 tw:inline-block tw:rounded-full tw:bg-brand-blue tw:px-8 tw:py-3 tw:font-semibold tw:text-white tw:transition tw:hover:bg-brand-blue-light"
          >{t('home')}</Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
