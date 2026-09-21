import Image from 'next/image'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'

type ColorPreview = { name: string; image: string; alt: string }

const defaultColors: ColorPreview[] = [
  {
    name: 'Neptune Blue',
    image: '/images/auto/neptune-blue-2.png',
    alt: 'Neptune three-wheeler in Neptune Blue',
  },
  {
    name: 'Forest Green',
    image: '/images/auto/green-1.png',
    alt: 'Neptune three-wheeler in Forest Green',
  },
]

const ColorVariants = async () => {
  let colors = defaultColors

  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({ collection: 'vehicles', limit: 1 })
    const vehicleColors = docs[0]?.colors as
      | Array<{
          colorName: string
          angleImages?: { front?: { url?: string; alt?: string } | null } | null
        }>
      | undefined

    const withImages = vehicleColors
      ?.filter((color) => color.angleImages?.front?.url)
      .map((color) => ({
        name: color.colorName,
        image: color.angleImages!.front!.url as string,
        alt: color.angleImages!.front!.alt || `Neptune three-wheeler in ${color.colorName}`,
      }))

    if (withImages?.length) colors = withImages
  } catch {
    // Payload/database not configured yet — fall back to placeholder colors.
  }

  return (
    <section id="colors" className="tw:bg-gray-50 tw:py-20">
      <div className="tw:mx-auto tw:max-w-6xl tw:px-6">
        <div className="tw:flex tw:items-end tw:justify-between">
          <h2 className="tw:text-3xl tw:font-bold tw:text-brand-ink">Choose your color</h2>
          <Link href="/vehicles" className="tw:text-sm tw:font-semibold tw:text-brand-blue-light">
            See all vehicles →
          </Link>
        </div>
        <div className="tw:mt-10 tw:grid tw:gap-8 tw:sm:grid-cols-2">
          {colors.map((color) => (
            <div
              key={color.name}
              className="tw:overflow-hidden tw:rounded-2xl tw:bg-white tw:shadow-sm"
            >
              <div className="tw:relative tw:aspect-square">
                <Image
                  src={color.image}
                  alt={color.alt}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="tw:object-contain tw:p-6"
                />
              </div>
              <p className="tw:border-t tw:border-black/5 tw:px-6 tw:py-4 tw:text-center tw:text-lg tw:font-semibold tw:text-brand-ink">
                {color.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ColorVariants
