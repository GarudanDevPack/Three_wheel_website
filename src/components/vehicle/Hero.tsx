import Image from 'next/image'
import HeroEntrance from '@/components/animations/LazyHeroEntrance'
import { type Stat } from '@/components/animations/StatCounters'
import StatCounters from '@/components/animations/LazyStatCounters'
import { getPayloadClient } from '@/lib/payload'

const defaultStats: Stat[] = [
  { label: 'Range', value: 180, unit: 'km' },
  { label: 'Top Speed', value: 65, unit: 'km/h' },
  { label: 'Peak Power', value: 12, unit: 'kW' },
  { label: 'Gradeability', value: 25, unit: '%' },
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
    ['Range', heroStats.range],
    ['Top Speed', heroStats.topSpeed],
    ['Peak Power', heroStats.peakPower],
    ['Gradeability', heroStats.gradeability],
  ]

  const stats = entries
    .filter((entry): entry is [string, { value: number; unit?: string | null }] =>
      typeof entry[1]?.value === 'number',
    )
    .map(([label, stat]) => ({ label, value: stat.value, unit: stat.unit || undefined }))

  return stats.length ? stats : defaultStats
}

const Hero = async () => {
  let stats = defaultStats

  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({ collection: 'vehicles', limit: 1 })
    stats = buildStats(docs[0]?.heroStats as HeroStatsDoc | undefined)
  } catch {
    // Payload/database not configured yet — fall back to placeholder stats.
  }

  return (
    <section
      id="hero"
      className="tw:relative tw:isolate tw:flex tw:min-h-[70vh] tw:items-center tw:overflow-hidden tw:bg-brand-ink tw:text-white tw:md:min-h-[85vh]"
    >
      <HeroEntrance variant="drive-in" delay={0.1} duration={0.8} className="tw:absolute tw:inset-0">
        <Image
          src="/images/auto/neptune-blue-1.png"
          alt="Neptune three-wheeler, blue variant"
          fill
          priority
          sizes="100vw"
          className="tw:object-cover tw:object-center"
        />
      </HeroEntrance>

      {/* Light-sweep: simulates a moving light reflection across the photo, no video asset needed. */}
      <div className="tw:pointer-events-none tw:absolute tw:inset-0 tw:overflow-hidden">
        <div className="hero-sweep tw:absolute tw:inset-y-0 tw:left-0 tw:w-1/4 tw:bg-gradient-to-r tw:from-transparent tw:via-white/15 tw:to-transparent" />
      </div>

      {/* Legibility scrims */}
      <div className="tw:pointer-events-none tw:absolute tw:inset-0 tw:bg-gradient-to-r tw:from-brand-ink tw:via-brand-ink/60 tw:to-transparent tw:md:via-brand-ink/40" />
      <div className="tw:pointer-events-none tw:absolute tw:inset-0 tw:bg-gradient-to-t tw:from-brand-ink tw:via-transparent tw:to-transparent" />

      <div className="tw:relative tw:z-10 tw:mx-auto tw:w-full tw:max-w-6xl tw:px-6 tw:pb-28 tw:pt-16">
        <HeroEntrance variant="up" className="tw:max-w-xl">
          <p className="tw:mb-4 tw:text-sm tw:font-semibold tw:uppercase tw:tracking-widest tw:text-brand-blue-light">
            Neptune Three-Wheeler
          </p>
          <h1 className="tw:text-4xl tw:font-bold tw:leading-tight tw:md:text-5xl">
            Built to carry your business further.
          </h1>
          <p className="tw:mt-5 tw:max-w-md tw:text-white/70">
            A rugged, fuel-efficient auto rickshaw designed for daily loads, longer routes, and
            lower running costs.
          </p>
          <div className="tw:mt-8 tw:flex tw:flex-wrap tw:gap-4">
            <a
              href="#enquire"
              className="tw:rounded-full tw:bg-brand-blue tw:px-6 tw:py-3 tw:text-sm tw:font-semibold"
            >
              Book a Test Drive
            </a>
            <a
              href="#highlights"
              className="tw:rounded-full tw:border tw:border-white/30 tw:px-6 tw:py-3 tw:text-sm tw:font-semibold"
            >
              See Specifications
            </a>
          </div>
        </HeroEntrance>
      </div>

      <div className="tw:absolute tw:inset-x-0 tw:bottom-0 tw:z-10 tw:bg-gradient-to-t tw:from-brand-ink tw:to-transparent tw:pb-8 tw:pt-16">
        <div className="tw:mx-auto tw:max-w-6xl tw:px-6">
          <StatCounters stats={stats} />
        </div>
      </div>
    </section>
  )
}

export default Hero
