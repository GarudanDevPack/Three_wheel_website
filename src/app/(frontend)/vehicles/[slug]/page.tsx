import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import Preloader from '@/components/animations/LazyPreloader'
import ScrollReveal from '@/components/animations/LazyScrollReveal'
import Header from '@/components/vehicle/Header'
import Footer from '@/components/vehicle/Footer'
import FeatureThemes from '@/components/vehicle/FeatureThemes'
import RelatedVehicles from '@/components/vehicle/RelatedVehicles'
import DetailAnchorNav from '@/components/ui/DetailAnchorNav'
import VariantTabs, { type Variant } from '@/components/ui/VariantTabs'
import { type AngleImage } from '@/components/animations/ColorSpin360'
import ColorSpin360 from '@/components/animations/LazyColorSpin360'
import { type ExplodedPart } from '@/components/animations/BuildSequence'
import BuildSequence from '@/components/animations/LazyBuildSequence'
import PartHotspots, { type VehiclePart } from '@/components/ui/PartHotspots'
import AccessoryGrid, { type Accessory } from '@/components/ui/AccessoryGrid'
import FaqAccordion, { type FaqItem } from '@/components/ui/FaqAccordion'
import DealerLocator, { type Dealer } from '@/components/ui/DealerLocator'
import FloatingEnquiryMenu from '@/components/ui/FloatingEnquiryMenu'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 300

type PageProps = { params: Promise<{ slug: string }> }

type MediaRef = { url?: string | null; alt?: string | null } | null | undefined

type VehicleDoc = {
  id: string
  name: string
  category?: string | null
  shortDescription?: string | null
  heroImage?: MediaRef
  variants?: Variant[]
  colors?: Array<{ colorName: string; angleImages?: AngleImage[] }>
  explodedPartsIllustration?: ExplodedPart[]
  parts?: VehiclePart[]
  accessories?: Accessory[]
  gallery?: Array<{ image?: MediaRef }>
  faqs?: FaqItem[]
  brochurePdf?: MediaRef
  maintenanceSchedulePdf?: MediaRef
  warrantyPolicyPdf?: MediaRef
  seo?: { metaTitle?: string | null; metaDescription?: string | null; ogImage?: MediaRef }
}

async function getVehicle(slug: string): Promise<VehicleDoc | null> {
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'vehicles',
      where: { slug: { equals: slug } },
      depth: 2,
      limit: 1,
    })
    return (docs[0] as VehicleDoc) || null
  } catch {
    return null
  }
}

async function getDealers(): Promise<Dealer[]> {
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({ collection: 'dealers', limit: 100 })
    return docs as Dealer[]
  } catch {
    return []
  }
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({ collection: 'vehicles', limit: 1000 })
    return docs.map((vehicle) => ({ slug: vehicle.slug as string }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const vehicle = await getVehicle(slug)
  if (!vehicle) return {}

  return {
    title: vehicle.seo?.metaTitle || vehicle.name,
    description: vehicle.seo?.metaDescription || vehicle.shortDescription || undefined,
    openGraph: vehicle.seo?.ogImage?.url ? { images: [vehicle.seo.ogImage.url] } : undefined,
  }
}

const pdfLinks = (vehicle: VehicleDoc) =>
  [
    { doc: vehicle.brochurePdf, label: 'Download Brochure' },
    { doc: vehicle.maintenanceSchedulePdf, label: 'Maintenance Schedule' },
    { doc: vehicle.warrantyPolicyPdf, label: 'Warranty Policy' },
  ].filter((entry) => entry.doc?.url)

const anchorLinks = [
  { href: '#overview', label: 'Overview' },
  { href: '#build', label: 'Build & Parts' },
  { href: '#specifications', label: 'Specifications' },
  { href: '#accessories', label: 'Accessories' },
  { href: '#dealers', label: 'Dealers' },
]

const VehicleDetailPage = async ({ params }: PageProps) => {
  const { slug } = await params
  const [vehicle, dealers] = await Promise.all([getVehicle(slug), getDealers()])
  if (!vehicle) notFound()

  const variants = vehicle.variants || []
  const colors = vehicle.colors || []
  const explodedParts = vehicle.explodedPartsIllustration || []
  const parts = vehicle.parts || []
  const accessories = vehicle.accessories || []
  const gallery = vehicle.gallery || []
  const faqs = vehicle.faqs || []
  const documents = pdfLinks(vehicle)

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: vehicle.name,
    description: vehicle.shortDescription || undefined,
    image: vehicle.heroImage?.url || undefined,
    brand: { '@type': 'Brand', name: 'Neptune' },
  }

  const faqJsonLd = faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      }
    : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <Preloader />
      <Header />
      <DetailAnchorNav links={anchorLinks} />
      <main>
        <section id="overview" className="tw:bg-brand-ink tw:py-16 tw:text-white">
          <div className="tw:mx-auto tw:grid tw:max-w-6xl tw:items-center tw:gap-10 tw:px-6 tw:md:grid-cols-2">
            <div>
              <h1 className="tw:text-4xl tw:font-bold">{vehicle.name}</h1>
              {vehicle.shortDescription && (
                <p className="tw:mt-4 tw:text-white/70">{vehicle.shortDescription}</p>
              )}
            </div>
            {vehicle.heroImage?.url && (
              <div className="tw:relative tw:aspect-square">
                <Image
                  src={vehicle.heroImage.url}
                  alt={vehicle.heroImage.alt || vehicle.name}
                  fill
                  priority
                  className="tw:object-contain"
                />
              </div>
            )}
          </div>
        </section>

        <ScrollReveal>
          <FeatureThemes />
        </ScrollReveal>

        {colors.length > 0 && (
          <ScrollReveal>
            <section id="colors" className="tw:bg-surface-raised tw:py-20">
              <div className="tw:mx-auto tw:max-w-6xl tw:px-6">
                <h2 className="tw:text-3xl tw:font-bold tw:text-white">Colors</h2>
                <div className="tw:mt-10 tw:grid tw:gap-10 tw:sm:grid-cols-2">
                  {colors.map((color) => (
                    <div key={color.colorName}>
                      <ColorSpin360 images={color.angleImages || []} label={color.colorName} />
                      <p className="tw:mt-3 tw:text-center tw:font-semibold tw:text-white">
                        {color.colorName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </ScrollReveal>
        )}

        <div id="build">
          <BuildSequence parts={explodedParts} />

          {parts.length > 0 && vehicle.heroImage?.url && (
            <section className="tw:bg-surface tw:py-20">
              <div className="tw:mx-auto tw:max-w-4xl tw:px-6 tw:text-center">
                <h2 className="tw:mb-10 tw:text-3xl tw:font-bold tw:text-white">
                  Explore the build
                </h2>
                <PartHotspots
                  baseImage={{
                    url: vehicle.heroImage.url,
                    alt: vehicle.heroImage.alt || vehicle.name,
                  }}
                  parts={parts}
                />
              </div>
            </section>
          )}
        </div>

        {variants.length > 0 && (
          <ScrollReveal>
            <section id="specifications" className="tw:bg-surface-raised tw:py-20">
              <div className="tw:mx-auto tw:max-w-4xl tw:px-6">
                <h2 className="tw:text-3xl tw:font-bold tw:text-white">
                  Variants &amp; Specifications
                </h2>
                <div className="tw:mt-8">
                  <VariantTabs variants={variants} />
                </div>
              </div>
            </section>
          </ScrollReveal>
        )}

        <ScrollReveal>
          <div id="accessories">
            <AccessoryGrid accessories={accessories} />
          </div>
        </ScrollReveal>

        {gallery.length > 0 && (
          <ScrollReveal>
            <section className="tw:bg-surface tw:py-20">
              <div className="tw:mx-auto tw:max-w-6xl tw:px-6">
                <h2 className="tw:text-3xl tw:font-bold tw:text-white">Gallery</h2>
                <div className="tw:mt-10 tw:columns-1 tw:gap-4 tw:sm:columns-2 tw:lg:columns-3">
                  {gallery.map(
                    (item, index) =>
                      item.image?.url && (
                        <div
                          key={index}
                          className="tw:relative tw:mb-4 tw:break-inside-avoid tw:overflow-hidden tw:rounded-xl"
                        >
                          <Image
                            src={item.image.url}
                            alt={item.image.alt || vehicle.name}
                            width={600}
                            height={800}
                            className="tw:h-auto tw:w-full tw:object-cover"
                          />
                        </div>
                      ),
                  )}
                </div>
              </div>
            </section>
          </ScrollReveal>
        )}

        {faqs.length > 0 && (
          <ScrollReveal>
            <section className="tw:bg-surface-raised tw:py-20">
              <div className="tw:mx-auto tw:max-w-3xl tw:px-6">
                <h2 className="tw:text-3xl tw:font-bold tw:text-white">
                  Frequently asked questions
                </h2>
                <div className="tw:mt-8">
                  <FaqAccordion items={faqs} />
                </div>
              </div>
            </section>
          </ScrollReveal>
        )}

        <ScrollReveal>
          <section id="dealers" className="tw:bg-surface tw:py-20">
            <div className="tw:mx-auto tw:max-w-6xl tw:px-6">
              <h2 className="tw:text-3xl tw:font-bold tw:text-white">Find a dealer</h2>
              <div className="tw:mt-10">
                {dealers.length === 0 ? (
                  <p className="tw:text-white/50">
                    Add dealers in /admin to populate this section.
                  </p>
                ) : (
                  <DealerLocator dealers={dealers} />
                )}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {documents.length > 0 && (
          <ScrollReveal>
            <section className="tw:bg-surface-raised tw:py-16">
              <div className="tw:mx-auto tw:flex tw:max-w-4xl tw:flex-wrap tw:justify-center tw:gap-4 tw:px-6">
                {documents.map(({ doc, label }) => (
                  <a
                    key={label}
                    href={doc!.url!}
                    target="_blank"
                    rel="noreferrer"
                    className="tw:rounded-full tw:border tw:border-brand-blue-light tw:px-6 tw:py-3 tw:text-sm tw:font-semibold tw:text-brand-blue-light"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </section>
          </ScrollReveal>
        )}

        <ScrollReveal>
          <RelatedVehicles currentId={vehicle.id} category={vehicle.category} />
        </ScrollReveal>
      </main>
      <Footer />
      <FloatingEnquiryMenu relatedVehicleId={vehicle.id} relatedVehicleName={vehicle.name} />
    </>
  )
}

export default VehicleDetailPage
