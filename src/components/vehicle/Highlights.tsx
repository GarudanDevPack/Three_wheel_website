import { getPayloadClient } from '@/lib/payload'
import { type Spec, type ColorOption } from './HighlightsReveal'
import HighlightsReveal from './LazyHighlightsReveal'

const defaultSpecs: Spec[] = [
  { label: 'Engine', value: '150cc, air-cooled' },
  { label: 'Max Power', value: '7.2 kW' },
  { label: 'Fuel Tank Capacity', value: '8 litres' },
  { label: 'Kerb Weight', value: '285 kg' },
]

const defaultColors: ColorOption[] = [
  { name: 'Neptune Blue', swatchHex: '#6B9BC3', image: '/images/auto/neptune-blue-2.png' },
  { name: 'Forest Green', swatchHex: '#2E5E3A', image: '/images/auto/green-1.png' },
]

const Highlights = async () => {
  let specs = defaultSpecs
  let colors = defaultColors

  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({ collection: 'vehicles', limit: 1 })
    const vehicleSpecs = docs[0]?.variants?.[0]?.specs

    if (vehicleSpecs) {
      specs = [
        { label: 'Engine', value: vehicleSpecs.engine?.displacement || defaultSpecs[0].value },
        { label: 'Max Power', value: vehicleSpecs.engine?.maxPower || defaultSpecs[1].value },
        {
          label: 'Fuel Tank Capacity',
          value: vehicleSpecs.dimensions?.fuelTankCapacity || defaultSpecs[2].value,
        },
        {
          label: 'Kerb Weight',
          value: vehicleSpecs.dimensions?.kerbWeight || defaultSpecs[3].value,
        },
      ]
    }

    const vehicleColors = docs[0]?.colors as
      | Array<{
          colorName: string
          swatchHex?: string | null
          angleImages?: Array<{ image?: { url?: string | null } | null }> | null
        }>
      | undefined

    const withImages = vehicleColors
      ?.filter((color) => color.angleImages?.[0]?.image?.url)
      .map((color) => ({
        name: color.colorName,
        swatchHex: color.swatchHex || '#6B9BC3',
        image: color.angleImages![0].image!.url as string,
      }))

    if (withImages?.length) colors = withImages
  } catch {
    // Payload/database not configured yet — fall back to placeholder specs/colors.
  }

  return <HighlightsReveal specs={specs} colors={colors} />
}

export default Highlights
