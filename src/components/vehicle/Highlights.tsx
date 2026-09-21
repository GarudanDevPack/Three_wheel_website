import { getPayloadClient } from '@/lib/payload'
import { type Spec } from './HighlightsReveal'
import HighlightsReveal from './LazyHighlightsReveal'

const defaultSpecs: Spec[] = [
  { label: 'Engine', value: '150cc, air-cooled' },
  { label: 'Max Power', value: '7.2 kW' },
  { label: 'Fuel Tank Capacity', value: '8 litres' },
  { label: 'Kerb Weight', value: '285 kg' },
]

const Highlights = async () => {
  let specs = defaultSpecs

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
  } catch {
    // Payload/database not configured yet — fall back to placeholder specs.
  }

  return <HighlightsReveal specs={specs} />
}

export default Highlights
