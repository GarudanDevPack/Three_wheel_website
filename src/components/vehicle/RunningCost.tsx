import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { RUNNING_COST } from '@/lib/catalog'

const zeroItems = ['engineOil', 'grease', 'clutch', 'cables'] as const
const benefitItems = ['electricity', 'savings', 'maintenance'] as const

/** "Why switch to an electric tuk tuk?" — client running-cost figures with the assumptions spelled out. */
const RunningCost = async () => {
  const t = await getTranslations('RunningCost')
  const perKm = (RUNNING_COST.monthlyElectricity / RUNNING_COST.monthlyKm).toFixed(1)

  const stats = [
    { value: `Rs. ${RUNNING_COST.monthlyElectricity.toLocaleString('en-US')}`, label: t('statElectricity') },
    { value: `${RUNNING_COST.monthlyKm.toLocaleString('en-US')} km`, label: t('statDistance') },
    { value: `≈ Rs. ${perKm}`, label: t('statPerKm') },
  ]

  return (
    <section
      id="running-cost"
      className="tw:relative tw:isolate tw:overflow-hidden tw:bg-surface-raised tw:bg-[radial-gradient(ellipse_at_80%_10%,rgba(34,217,122,0.12),transparent_55%)] tw:py-20"
    >
      <div className="tw:relative tw:z-10 tw:mx-auto tw:max-w-6xl tw:px-6">
        <div className="tw:max-w-3xl">
          <p className="tw:text-sm tw:font-semibold tw:text-brand-blue">{t('eyebrow')}</p>
          <h2 className="tw:mt-2 tw:text-3xl tw:font-bold tw:text-brand-ink tw:md:text-4xl">{t('title')}</h2>
          <p className="tw:mt-3 tw:text-lg tw:font-semibold tw:text-brand-ink">{t('headline')}</p>
          <p className="tw:mt-2 tw:text-brand-ink/70">{t('intro')}</p>
        </div>

        <div className="tw:mt-10 tw:grid tw:gap-4 tw:sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="tw:rounded-3xl tw:border tw:border-brand-ink/10 tw:bg-surface tw:p-6">
              <p className="tw:text-3xl tw:font-bold tw:tracking-tight tw:text-brand-blue">{stat.value}</p>
              <p className="tw:mt-1 tw:text-sm tw:font-medium tw:text-brand-ink/60">{stat.label}</p>
            </div>
          ))}
        </div>
        <p className="tw:mt-3 tw:text-xs tw:text-brand-ink/50">{t('assumptions')}</p>

        <div className="tw:mt-12 tw:grid tw:gap-10 tw:lg:grid-cols-2">
          <div>
            <h3 className="tw:text-xl tw:font-bold tw:text-brand-ink">{t('zeroTitle')}</h3>
            <ul className="tw:mt-5 tw:grid tw:list-none tw:gap-3 tw:p-0 tw:sm:grid-cols-2">
              {zeroItems.map((item) => (
                <li key={item} className="tw:flex tw:items-center tw:gap-3 tw:rounded-2xl tw:bg-surface tw:px-4 tw:py-3">
                  <span className="tw:flex tw:h-8 tw:w-8 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-full tw:bg-brand-green/15 tw:text-sm tw:font-bold tw:text-emerald-700">
                    0
                  </span>
                  <span className="tw:text-sm tw:font-semibold tw:text-brand-ink">{t(`zero.${item}`)}</span>
                </li>
              ))}
            </ul>
            <ul className="tw:mt-5 tw:flex tw:list-none tw:flex-wrap tw:gap-2 tw:p-0">
              {benefitItems.map((item) => (
                <li key={item} className="tw:rounded-full tw:bg-brand-blue/10 tw:px-3 tw:py-1.5 tw:text-xs tw:font-semibold tw:text-brand-blue">
                  {t(`benefits.${item}`)}
                </li>
              ))}
            </ul>
          </div>

          <div className="tw:rounded-3xl tw:bg-brand-ink tw:p-8 tw:text-white">
            <p className="tw:text-sm tw:font-semibold tw:text-brand-blue-light">{t('nightTitle')}</p>
            <div className="tw:mt-4 tw:grid tw:grid-cols-2 tw:gap-4">
              <div className="tw:rounded-2xl tw:bg-white/5 tw:p-4">
                <p className="tw:text-2xl" aria-hidden="true">🌙</p>
                <p className="tw:mt-2 tw:text-sm tw:font-semibold">{t('night')}</p>
              </div>
              <div className="tw:rounded-2xl tw:bg-white/5 tw:p-4">
                <p className="tw:text-2xl" aria-hidden="true">☀️</p>
                <p className="tw:mt-2 tw:text-sm tw:font-semibold">{t('day')}</p>
              </div>
            </div>
            <p className="tw:mt-5 tw:text-sm tw:text-white/70">{t('solar')}</p>
            <p className="tw:mt-6 tw:text-lg tw:font-bold tw:italic">“{t('tagline')}”</p>
            <div className="tw:mt-6 tw:flex tw:flex-wrap tw:gap-3">
              <Link href="/#pricing" className="tw:rounded-full tw:bg-brand-blue tw:px-5 tw:py-2.5 tw:text-sm tw:font-semibold tw:text-white tw:transition tw:hover:bg-brand-blue-light">
                {t('ctaPricing')}
              </Link>
              <Link href="/news/charge-while-you-sleep-running-cost" className="tw:rounded-full tw:border tw:border-white/30 tw:px-5 tw:py-2.5 tw:text-sm tw:font-semibold tw:text-white tw:transition tw:hover:border-white/60">
                {t('ctaRead')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RunningCost
