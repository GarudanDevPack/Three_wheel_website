import { getTranslations } from 'next-intl/server'

// Copy lives under `FeatureThemes.items.<key>`.
const themes = [
  { key: 'economy', icon: '⚡' },
  { key: 'durability', icon: '🛠️' },
  { key: 'maintenance', icon: '🔧' },
  { key: 'comfort', icon: '💺' },
] as const

const FeatureThemes = async () => {
  const t = await getTranslations('FeatureThemes')

  return (
    <section className="tw:bg-surface tw:py-20">
      <div className="tw:mx-auto tw:max-w-6xl tw:px-6">
        <h2 className="tw:text-3xl tw:font-bold tw:text-brand-ink">{t('title')}</h2>
        <div className="tw:mt-10 tw:grid tw:gap-6 tw:sm:grid-cols-2 tw:lg:grid-cols-4">
          {themes.map((item) => (
            <div key={item.key} className="tw:rounded-2xl tw:border tw:border-brand-ink/10 tw:bg-surface-raised tw:p-6">
              <span className="tw:text-3xl" aria-hidden="true">
                {item.icon}
              </span>
              <p className="tw:mt-3 tw:text-lg tw:font-semibold tw:text-brand-ink">{t(`items.${item.key}.title`)}</p>
              <p className="tw:mt-2 tw:text-sm tw:text-brand-ink/60">{t(`items.${item.key}.blurb`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeatureThemes
