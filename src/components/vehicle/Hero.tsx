import { getLocale, getTranslations } from 'next-intl/server'
import HeroEntrance from '@/components/animations/LazyHeroEntrance'
import { type Stat } from '@/components/animations/StatCounters'
import StatCounters from '@/components/animations/LazyStatCounters'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { getPayloadClient } from '@/lib/payload'

// Labels are message keys under `Specs.rows`, translated at render time.
const defaultStats: Stat[] = [
  { label: 'range', value: 300, unit: 'km' },
  { label: 'topSpeed', value: 60, unit: 'km/h' },
  { label: 'peakPower', value: 12, unit: 'kW' },
  { label: 'gradeabilityStat', value: 15, unit: '%' },
]

type HeroStatField = { value?: number | null; unit?: string | null } | null | undefined

type HeroStatsDoc = {
  range?: HeroStatField
  topSpeed?: HeroStatField
  peakPower?: HeroStatField
  gradeability?: HeroStatField
}

const buildStats = (heroStats?: HeroStatsDoc | null): Stat[] => {
  if (!heroStats) return defaultStats

  const entries: Array<[string, HeroStatField]> = [
    ['range', heroStats.range],
    ['topSpeed', heroStats.topSpeed],
    ['peakPower', heroStats.peakPower],
    ['gradeabilityStat', heroStats.gradeability],
  ]

  const stats = entries
    .filter((entry): entry is [string, { value: number; unit?: string | null }] =>
      typeof entry[1]?.value === 'number',
    )
    .map(([label, stat]) => ({ label, value: stat.value, unit: stat.unit || undefined }))

  return stats.length ? stats : defaultStats
}

const Hero = async () => {
  const locale = (await getLocale()) as AppLocale
  const t = await getTranslations('Hero')
  const ts = await getTranslations('Specs.rows')
  let stats = defaultStats

  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'vehicles',
      where: { modelRange: { equals: '300km' } },
      limit: 1,
      locale,
    })
    stats = buildStats(docs[0]?.heroStats as HeroStatsDoc | undefined)
  } catch {
    // Payload/database not configured yet — fall back to placeholder stats.
  }

  const localizedStats = stats.map((stat) => ({ ...stat, label: ts(stat.label) }))
  const caps = locale === 'en' ? 'tw:uppercase tw:tracking-widest' : ''

  return (
    <section
      id="hero"
      className="tw:relative tw:isolate tw:min-h-[70vh] tw:overflow-hidden tw:bg-brand-ink tw:text-white tw:md:min-h-[85vh]"
    >
      <HeroEntrance variant="drive-in" delay={0.1} duration={0.8} className="tw:absolute tw:inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/auto/neptune-blue-1.png"
          className="tw:absolute tw:inset-0 tw:h-full tw:w-full tw:object-cover tw:object-center"
        >
          <source src="/videos/three-wheeler-reveal.mp4" type="video/mp4" />
        </video>
      </HeroEntrance>

      {/* Legibility scrims */}
      <div className="tw:pointer-events-none tw:absolute tw:inset-0 tw:bg-gradient-to-r tw:from-brand-ink tw:via-brand-ink/60 tw:to-transparent tw:md:via-brand-ink/40" />
      <div className="tw:pointer-events-none tw:absolute tw:inset-0 tw:bg-gradient-to-t tw:from-brand-ink tw:via-transparent tw:to-transparent" />

      <div className="tw:relative tw:z-10 tw:mx-auto tw:flex tw:w-full tw:max-w-6xl tw:flex-col tw:px-6 tw:pb-8 tw:pt-16 tw:md:min-h-[85vh] tw:md:justify-center tw:md:pb-28">
        <HeroEntrance variant="up" className="tw:max-w-xl">
          <p className={`tw:mb-4 tw:text-sm tw:font-semibold tw:text-brand-blue-light ${caps}`}>{t('eyebrow')}</p>
          <h1 className="tw:text-4xl tw:font-bold tw:leading-tight tw:md:text-5xl">{t('title')}</h1>
          <p className="tw:mt-5 tw:max-w-md tw:text-white/70">{t('intro')}</p>
          <div className="tw:mt-8 tw:flex tw:flex-wrap tw:gap-4">
            <a
              href="#enquire"
              className="tw:rounded-full tw:bg-brand-blue tw:px-6 tw:py-3 tw:text-sm tw:font-semibold tw:transition tw:hover:bg-brand-blue-light"
            >
              {t('testDrive')}
            </a>
            <a
              href="#compare"
              className="tw:rounded-full tw:border tw:border-white/30 tw:px-6 tw:py-3 tw:text-sm tw:font-semibold tw:transition tw:hover:border-white/60"
            >
              {t('compare')}
            </a>
            <Link
              href="/#pricing"
              className="tw:rounded-full tw:px-2 tw:py-3 tw:text-sm tw:font-semibold tw:text-white/80 tw:transition tw:hover:text-white"
            >
              {t('pricing')} →
            </Link>
          </div>
        </HeroEntrance>
      </div>

      <div className="tw:relative tw:z-10 tw:bg-gradient-to-t tw:from-brand-ink tw:to-transparent tw:pb-8 tw:pt-16 tw:md:absolute tw:md:inset-x-0 tw:md:bottom-0">
        <div className="tw:mx-auto tw:max-w-6xl tw:px-6">
          <StatCounters stats={localizedStats} />
        </div>
      </div>
    </section>
  )
}

export default Hero
