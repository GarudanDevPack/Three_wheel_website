import type { Metadata } from 'next'
import Preloader from '@/components/animations/LazyPreloader'
import ScrollReveal from '@/components/animations/LazyScrollReveal'
import Header from '@/components/vehicle/Header'
import Footer from '@/components/vehicle/Footer'
import { type AngleImage } from '@/components/animations/ColorSpin360'
import ColorSpin360 from '@/components/animations/LazyColorSpin360'
import { getPayloadClient } from '@/lib/payload'
import { getPageMetadata } from '@/lib/pageSeo'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('360-view', {
    title: '360° View — Neptune',
    description: 'Drag to explore the Neptune three-wheeler in every color, up close.',
  })
}

type ColorPreview = { name: string; angleImages: AngleImage[] }

const defaultColors: ColorPreview[] = [
  {
    name: 'Neptune Blue',
    angleImages: [
      {
        angleLabel: 'Front',
        image: { url: '/images/auto/blue-360-front.png', alt: 'Neptune three-wheeler in Neptune Blue — front view' },
      },
      {
        angleLabel: 'Side',
        image: { url: '/images/auto/blue-360-side-a.jpg', alt: 'Neptune three-wheeler in Neptune Blue — side view' },
      },
      {
        angleLabel: 'Rear 3/4',
        image: { url: '/images/auto/blue-360-side-b.jpg', alt: 'Neptune three-wheeler in Neptune Blue — rear three-quarter view' },
      },
      {
        angleLabel: 'Rear',
        image: { url: '/images/auto/blue-360-rear.jpg', alt: 'Neptune three-wheeler in Neptune Blue — rear view' },
      },
    ],
  },
  {
    name: 'Forest Green',
    angleImages: [
      {
        angleLabel: 'Front',
        image: { url: '/images/auto/green-1.png', alt: 'Neptune three-wheeler in Forest Green' },
      },
    ],
  },
]

const ColorViewPage = async () => {
  let colors = defaultColors

  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({ collection: 'vehicles', limit: 1 })
    const vehicleColors = docs[0]?.colors as
      | Array<{ colorName: string; angleImages?: AngleImage[] | null }>
      | undefined

    const withImages = vehicleColors
      ?.filter((color) => color.angleImages?.some((frame) => frame?.image?.url))
      .map((color) => ({
        name: color.colorName,
        angleImages: color.angleImages || [],
      }))

    if (withImages?.length) colors = withImages
  } catch {
    // Payload/database not configured yet — fall back to placeholder colors.
  }

  return (
    <>
      <Preloader />
      <Header />
      <main>
        <section className="tw:bg-brand-ink tw:py-20 tw:text-white">
          <div className="tw:mx-auto tw:max-w-3xl tw:px-6 tw:text-center">
            <p className="tw:text-sm tw:font-semibold tw:uppercase tw:tracking-widest tw:text-brand-blue-light">
              360° View
            </p>
            <h1 className="tw:mt-4 tw:text-4xl tw:font-bold">See every color, up close.</h1>
            <p className="tw:mt-6 tw:text-white/70">
              Drag any photo below to tilt it and get a feel for how Neptune looks in each color.
            </p>
          </div>
        </section>

        <section className="tw:bg-surface-raised tw:py-20">
          <div className="tw:mx-auto tw:max-w-5xl tw:px-6">
            <ScrollReveal>
              <div className="tw:overflow-hidden tw:rounded-2xl tw:border tw:border-white/10">
                <video
                  src="/images/video.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  className="tw:aspect-video tw:w-full tw:object-cover"
                >
                  Your browser does not support embedded video.
                </video>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="tw:bg-surface tw:py-20">
          <div className="tw:mx-auto tw:max-w-5xl tw:px-6">
            <div className="tw:grid tw:gap-10 tw:sm:grid-cols-2">
              {colors.map((color) => (
                <div
                  key={color.name}
                  className="tw:overflow-hidden tw:rounded-2xl tw:border tw:border-white/10 tw:bg-surface-raised tw:p-8"
                >
                  <ColorSpin360 images={color.angleImages} label={color.name} />
                  <p className="tw:mt-6 tw:border-t tw:border-white/10 tw:pt-6 tw:text-center tw:text-xl tw:font-semibold tw:text-white">
                    {color.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default ColorViewPage
