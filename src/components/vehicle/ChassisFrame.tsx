import { getTranslations } from 'next-intl/server'
import { type ChassisImage } from '@/components/animations/ChassisFrameReveal'
import ChassisFrameReveal from '@/components/animations/LazyChassisFrameReveal'

export type ChassisFeatureDoc = {
  heading?: string | null
  description?: string | null
  images?: Array<{
    image?: { url?: string | null; alt?: string | null } | null
    caption?: string | null
  }> | null
} | null

// TODO: replace with real chassis/frame photos once the client sends them.
const placeholderImages = ['/images/auto/gallery-1.png', '/images/auto/gallery-2.png', '/images/auto/gallery-3.png']

const ChassisFrame = async ({
  chassisFeature,
  vehicleName,
}: {
  chassisFeature?: ChassisFeatureDoc
  vehicleName: string
}) => {
  const t = await getTranslations('Chassis')
  const heading = chassisFeature?.heading || t('heading')
  const description =
    chassisFeature?.description || t('description', { name: vehicleName })

  const cmsImages: ChassisImage[] =
    chassisFeature?.images
      ?.filter((entry) => entry.image?.url)
      .map((entry) => ({
        url: entry.image!.url as string,
        alt: entry.image!.alt || t('imageAlt', { name: vehicleName }),
        caption: entry.caption || undefined,
      })) || []

  const images = cmsImages.length
    ? cmsImages
    : placeholderImages.map((url, index) => ({ url, alt: t('placeholderAlt', { number: index + 1 }) }))

  return <ChassisFrameReveal heading={heading} description={description} images={images} />
}

export default ChassisFrame
