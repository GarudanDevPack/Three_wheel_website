import { getLocale, getTranslations } from 'next-intl/server'
import { getPayloadClient } from '@/lib/payload'
import type { AppLocale } from '@/i18n/routing'
import { type AngleImage } from '@/components/animations/ColorSpin360'
import { type ModelOption } from './ModelSelectorClient'
import ModelSelectorClient from './LazyModelSelectorClient'

type VehicleSummaryDoc = {
  id: string
  slug: string
  name: string
  modelRange?: string | null
  availability?: string | null
  shortDescription?: string | null
  heroImage?: { url?: string | null; alt?: string | null } | null
  heroStats?: {
    range?: { value?: number | null; unit?: string | null } | null
    topSpeed?: { value?: number | null; unit?: string | null } | null
    peakPower?: { value?: number | null; unit?: string | null } | null
    gradeability?: { value?: number | null; unit?: string | null } | null
  } | null
  colors?: Array<{
    colorName: string
    swatchHex?: string | null
    video?: { url?: string | null } | null
    angleImages?: AngleImage[] | null
  }> | null
}

type HeroStatField = { value?: number | null; unit?: string | null } | null | undefined

const buildStats = (heroStats?: {
  range?: HeroStatField
  topSpeed?: HeroStatField
  peakPower?: HeroStatField
  gradeability?: HeroStatField
} | null) => {
  const entries: Array<[string, HeroStatField]> = [
    ['range', heroStats?.range],
    ['topSpeed', heroStats?.topSpeed],
    ['peakPower', heroStats?.peakPower],
    ['gradeabilityStat', heroStats?.gradeability],
  ]

  return entries
    .filter((entry): entry is [string, { value: number; unit?: string | null }] =>
      typeof entry[1]?.value === 'number',
    )
    .map(([label, stat]) => ({ label, value: stat.value, unit: stat.unit || undefined }))
}

const defaultModels: ModelOption[] = [
  {
    id: 'placeholder-300',
    slug: 'neptune',
    name: '',
    modelRange: '300km',
    availability: 'Available',
    shortDescription: null,
    heroImage: { url: '/images/auto/neptune-blue-1.png', alt: 'Neptune three-wheeler, 300km model' },
    stats: [
      { label: 'range', value: 300, unit: 'km' },
      { label: 'topSpeed', value: 60, unit: 'km/h' },
      { label: 'peakPower', value: 12, unit: 'kW' },
      { label: 'gradeabilityStat', value: 15, unit: '%' },
    ],
    colors: [
      {
        colorName: 'Neptune Blue',
        swatchHex: '#6B9BC3',
        video: '/videos/color-blue.mp4',
        angleImages: [
          { angleLabel: 'Front', image: { url: '/images/auto/neptune-blue-2.png', alt: 'Neptune Blue' } },
        ],
      },
      {
        colorName: 'Forest Green',
        swatchHex: '#2E5E3A',
        video: '/videos/color-green.mp4',
        angleImages: [
          { angleLabel: 'Front', image: { url: '/images/auto/green-1.png', alt: 'Forest Green' } },
        ],
      },
      {
        colorName: 'Stealth Black',
        swatchHex: '#1a1a1a',
        video: '/videos/color-black.mp4',
        angleImages: [],
      },
    ],
  },
  {
    id: 'placeholder-200',
    slug: null,
    name: '',
    modelRange: '200km',
    availability: 'Upcoming',
    shortDescription: null,
    heroImage: null,
    stats: [],
    colors: [],
  },
  {
    id: 'placeholder-120',
    slug: null,
    name: '',
    modelRange: '120km',
    availability: 'Upcoming',
    shortDescription: null,
    heroImage: null,
    stats: [],
    colors: [],
  },
]

const ModelSelector = async () => {
  const locale = (await getLocale()) as AppLocale
  const t = await getTranslations('ModelSelector')
  const ts = await getTranslations('Specs.rows')
  let models = defaultModels

  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'vehicles',
      where: { modelRange: { exists: true } },
      sort: 'selectorOrder',
      depth: 2,
      locale,
    })

    const vehicleDocs = docs as unknown as VehicleSummaryDoc[]

    if (vehicleDocs.length) {
      models = vehicleDocs.map((doc) => ({
        id: doc.id,
        slug: doc.slug,
        name: doc.name,
        modelRange: doc.modelRange || '',
        availability: (doc.availability as 'Available' | 'Upcoming') || 'Upcoming',
        shortDescription: doc.shortDescription,
        heroImage: doc.heroImage?.url
          ? { url: doc.heroImage.url, alt: doc.heroImage.alt }
          : null,
        stats: buildStats(doc.heroStats),
        colors: (doc.colors || [])
          .filter((color) => color.video?.url || color.angleImages?.length)
          .map((color) => ({
            colorName: color.colorName,
            swatchHex: color.swatchHex,
            video: color.video?.url || null,
            angleImages: color.angleImages,
          })),
      }))
    }
  } catch {
    // Payload/database not configured yet — fall back to placeholder models.
  }

  if (!models.length) return null

  const localized = models.map((model) => ({
    ...model,
    name: model.name || t('rangeModel', { range: model.modelRange }),
    shortDescription:
      model.shortDescription ??
      (model.availability === 'Available' ? t('flagshipDescription') : t('upcomingDescription')),
    stats: model.stats.map((stat) => ({ ...stat, label: ts(stat.label) })),
  }))

  return <ModelSelectorClient models={localized} />
}

export default ModelSelector
