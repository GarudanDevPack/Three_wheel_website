import { getLocale, getTranslations } from 'next-intl/server'
import { getPayloadClient } from '@/lib/payload'
import type { AppLocale } from '@/i18n/routing'
import { type AngleImage } from '@/components/animations/ColorSpin360'
import { type ModelOption } from './ModelSelectorClient'
import ModelSelectorClient from './LazyModelSelectorClient'
import { catalog } from '@/lib/catalog'

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

// No database yet: built from the client-verified catalog (src/lib/catalog.ts).
const defaultModels: ModelOption[] = catalog.map((model) => ({
  id: `catalog-${model.slug}`,
  slug: model.slug,
  name: model.status === 'Available' ? model.name : '',
  modelRange: model.modelRange,
  availability: model.status,
  shortDescription: null,
  heroImage: model.heroImage,
  stats: buildStats(model.heroStats),
  colors: model.colors.map((color) => ({
    colorName: color.colorName,
    swatchHex: color.swatchHex,
    video: color.video ?? null,
    angleImages: color.image ? [{ angleLabel: 'Front', image: color.image }] : [],
  })),
}))

const descriptionKey = (model: ModelOption) =>
  model.availability !== 'Available'
    ? 'upcomingDescription'
    : model.id === 'catalog-neptune-ev-cargo'
      ? 'cargoDescription'
      : 'flagshipDescription'

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
    shortDescription: model.shortDescription ?? t(descriptionKey(model)),
    stats: model.stats.map((stat) => ({ ...stat, label: ts(stat.label) })),
  }))

  return <ModelSelectorClient models={localized} />
}

export default ModelSelector
