import { getLocale } from 'next-intl/server'
import type { AppLocale } from '@/i18n/routing'
import { getModelVehicles, publicPrice, type HeroStat } from '@/lib/vehicles'
import { buildCategories } from '@/lib/specs'
import ModelComparisonTable, { type ComparisonColumn, type ComparisonGroup } from './ModelComparisonTable'

const statText = (stat?: HeroStat) => (stat ? `${stat.value}${stat.unit ? ` ${stat.unit}` : ''}` : null)

const ModelComparison = async () => {
  const locale = (await getLocale()) as AppLocale
  const vehicles = await getModelVehicles(locale)

  const columns: ComparisonColumn[] = vehicles.map((vehicle) => ({
    id: vehicle.id,
    name: vehicle.name,
    modelRange: vehicle.modelRange,
    availability: vehicle.availability,
    slug: vehicle.slug,
    image: vehicle.heroImage,
    price: publicPrice(vehicle),
  }))

  const performance: ComparisonGroup = {
    key: 'performance',
    rows: (['range', 'topSpeed', 'peakPower', 'gradeability'] as const).map((stat) => ({
      key: stat === 'gradeability' ? 'gradeabilityStat' : stat,
      values: vehicles.map((vehicle) => statText(vehicle.heroStats[stat])),
    })),
  }

  // Union of every spec row across models, so columns line up even when a model is missing data.
  const perVehicle = vehicles.map((vehicle) => buildCategories(vehicle.specs, vehicle.charging, { keepEmpty: true }))
  const specGroups: ComparisonGroup[] = perVehicle[0].map((category, categoryIndex) => ({
    key: category.key,
    rows: category.rows.map((row, rowIndex) => ({
      key: row.key,
      values: perVehicle.map((categories) => categories[categoryIndex].rows[rowIndex].value || null),
    })),
  }))

  const groups = [performance, ...specGroups]
    .map((group) => ({ ...group, rows: group.rows.filter((row) => row.values.some(Boolean)) }))
    .filter((group) => group.rows.length > 0)

  return <ModelComparisonTable columns={columns} groups={groups} />
}

export default ModelComparison
