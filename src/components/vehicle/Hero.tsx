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
    <section className="tw:relative tw:overflow-hidden tw:bg-brand-ink tw:pt-8 tw:text-white">
      <div className="tw:mx-auto tw:grid tw:max-w-6xl tw:items-center tw:gap-10 tw:px-6 tw:py-16 tw:md:grid-cols-2 tw:md:py-24">
        <HeroEntrance variant="up">
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
          <StatCounters stats={stats} />
        </HeroEntrance>
        <HeroEntrance
          variant="drive-in"
          delay={0.15}
          duration={0.8}
          className="tw:relative tw:aspect-square tw:w-full"
        >
          <Image
            src="/images/auto/neptune-blue-1.png"
            alt="Neptune three-wheeler, blue variant"
            fill
            priority
            sizes="(min-width: 768px) 480px, 100vw"
            className="tw:object-contain tw:drop-shadow-2xl"
          />
        </HeroEntrance>
      </div>
    </section>
  )
}

export default Hero
