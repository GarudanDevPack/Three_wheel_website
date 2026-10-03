import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Preloader from '@/components/animations/LazyPreloader'
import ScrollReveal from '@/components/animations/LazyScrollReveal'
import Header from '@/components/vehicle/Header'
import Footer from '@/components/vehicle/Footer'
import FeatureThemes from '@/components/vehicle/FeatureThemes'
import RelatedVehicles from '@/components/vehicle/RelatedVehicles'
import DetailAnchorNav from '@/components/ui/DetailAnchorNav'
import VariantTabs, { type Variant } from '@/components/ui/VariantTabs'
import { type AngleImage } from '@/components/animations/ColorSpin360'
import ColorShowcase from '@/components/vehicle/LazyColorShowcase'
import { type ExplodedPart } from '@/components/animations/BuildSequence'
import BuildSequence from '@/components/animations/LazyBuildSequence'
import ChassisFrame, { type ChassisFeatureDoc } from '@/components/vehicle/ChassisFrame'
import SectionBackdrop from '@/components/ui/SectionBackdrop'
import VariantReveal from '@/components/animations/LazyVariantReveal'
import MechanismDemo from '@/components/animations/LazyMechanismDemo'
import PartHotspots, { type VehiclePart } from '@/components/ui/PartHotspots'
import AccessoryGrid, { type Accessory } from '@/components/ui/AccessoryGrid'
import FaqAccordion, { type FaqItem } from '@/components/ui/FaqAccordion'
import DealerLocator, { type Dealer } from '@/components/ui/DealerLocator'
import FloatingEnquiryMenu from '@/components/ui/FloatingEnquiryMenu'
import { getPayloadClient } from '@/lib/payload'
import type { AppLocale } from '@/i18n/routing'
import { localeAlternates } from '@/lib/pageSeo'
import { formatLkr } from '@/lib/format'

export const revalidate = 300

type PageProps = { params: Promise<{ locale: AppLocale; slug: string }> }

type MediaRef = { url?: string | null; alt?: string | null } | null | undefined

type VehicleDoc = {
  id: string
  name: string
  category?: string | null
  shortDescription?: string | null
  pricing?: { price?: number | null; showPrice?: boolean | null; priceNote?: string | null } | null
  heroImage?: MediaRef
  variants?: Variant[]
  colors?: Array<{
    colorName: string
    swatchHex?: string | null
    video?: MediaRef
    angleImages?: AngleImage[]
  }>
  explodedPartsIllustration?: ExplodedPart[]
  chassisFeature?: ChassisFeatureDoc
  mechanismDemo?: MediaRef
  parts?: VehiclePart[]
  accessories?: Accessory[]
  gallery?: Array<{ image?: MediaRef }>
  faqs?: FaqItem[]
  brochurePdf?: MediaRef
  maintenanceSchedulePdf?: MediaRef
  warrantyPolicyPdf?: MediaRef
  seo?: { metaTitle?: string | null; metaDescription?: string | null; ogImage?: MediaRef }
}

async function getVehicle(slug: string, locale: AppLocale): Promise<VehicleDoc | null> {
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'vehicles',
      where: { slug: { equals: slug } },
      depth: 2,
      limit: 1,
      locale,
    })
    return (docs[0] as VehicleDoc) || null
  } catch {
    return null
  }
}

async function getDealers(locale: AppLocale): Promise<Dealer[]> {
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({ collection: 'dealers', limit: 100, locale })
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
  const { slug, locale } = await params
  const vehicle = await getVehicle(slug, locale)
  if (!vehicle) return {}

  const title = vehicle.seo?.metaTitle || vehicle.name
  const description = vehicle.seo?.metaDescription || vehicle.shortDescription || undefined
  const images = vehicle.seo?.ogImage?.url ? [vehicle.seo.ogImage.url] : undefined

  return {
    title,
    description,
    alternates: localeAlternates(`/vehicles/${slug}`, locale),
    openGraph: { title, description, siteName: 'Neptune', images },
    twitter: { card: 'summary_large_image', title, description, images },
  }
}

const pdfLinks = (vehicle: VehicleDoc) =>
  [
    { doc: vehicle.brochurePdf, label: 'brochure' },
    { doc: vehicle.maintenanceSchedulePdf, label: 'maintenance' },
    { doc: vehicle.warrantyPolicyPdf, label: 'warranty' },
  ].filter((entry) => entry.doc?.url)

const anchorLinks = [
  { href: '#overview', label: 'overview' },
  { href: '#build', label: 'build' },
  { href: '#specifications', label: 'specifications' },
  { href: '#accessories', label: 'accessories' },
  { href: '#dealers', label: 'dealers' },
]

const VehicleDetailPage = async ({ params }: PageProps) => {
  const { slug, locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('VehicleDetail')
  const [vehicle, dealers] = await Promise.all([getVehicle(slug, locale), getDealers(locale)])
  if (!vehicle) notFound()
  const price =
    vehicle.pricing?.showPrice !== false && typeof vehicle.pricing?.price === 'number' && vehicle.pricing.price > 0
      ? vehicle.pricing.price
      : null

  const variants = vehicle.variants || []
  const revealableVariants = variants.filter((v) => v.taglineForReveal)
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
      <DetailAnchorNav links={anchorLinks.map((link) => ({ ...link, label: t(`nav.${link.label}`) }))} />
      <main>
        <section id="overview" className="tw:relative tw:isolate tw:overflow-hidden tw:bg-surface tw:py-16 tw:text-brand-ink">
          <SectionBackdrop src="/images/auto/neptune-blue-1.png" variant="soft" base="surface" />
          <div className="tw:relative tw:z-10 tw:mx-auto tw:grid tw:max-w-6xl tw:items-center tw:gap-10 tw:px-6 tw:md:grid-cols-2">
            <div>
              <h1 className="tw:text-4xl tw:font-bold">{vehicle.name}</h1>
              {vehicle.shortDescription && (
                <p className="tw:mt-4 tw:text-brand-ink/70">{vehicle.shortDescription}</p>
              )}
              <div className="tw:mt-6 tw:inline-flex tw:flex-col tw:rounded-2xl tw:border tw:border-brand-ink/10 tw:bg-surface-raised/80 tw:px-5 tw:py-4">
                <span className="tw:text-xs tw:font-semibold tw:text-brand-ink/50">{t('price')}</span>
                <span className="tw:mt-1 tw:text-2xl tw:font-bold tw:text-brand-ink">
                  {price ? formatLkr(price, locale) : t('priceOnRequest')}
                </span>
                {price && vehicle.pricing?.priceNote && (
                  <span className="tw:mt-0.5 tw:text-xs tw:text-brand-ink/50">{vehicle.pricing.priceNote}</span>
                )}
              </div>
            </div>
            {vehicle.heroImage?.url && (
              <div className="tw:relative tw:aspect-square">
                <Image
                  src={vehicle.heroImage.url}
                  alt={vehicle.heroImage.alt || vehicle.name}
                  fill
                  priority
                  sizes="(min-width: 768px) 50vw, 100vw"
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
            <section id="colors" className="tw:relative tw:isolate tw:overflow-hidden tw:bg-surface-raised tw:py-20">
              <SectionBackdrop src="/images/auto/night-ride.jpg" variant="soft" base="surface-raised" />
              <div className="tw:relative tw:z-10 tw:mx-auto tw:max-w-6xl tw:px-6">
                <h2 className="tw:text-3xl tw:font-bold tw:text-brand-ink">{t('colors')}</h2>
                <div className="tw:mt-10">
                  <ColorShowcase
                    colors={colors.map((color) => ({
                      colorName: color.colorName,
                      swatchHex: color.swatchHex,
                      video: color.video?.url,
                      angleImages: color.angleImages,
                    }))}
                  />
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
                <h2 className="tw:mb-10 tw:text-3xl tw:font-bold tw:text-brand-ink">{t('exploreBuild')}</h2>
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

          <ChassisFrame chassisFeature={vehicle.chassisFeature} vehicleName={vehicle.name} />
        </div>

        {vehicle.mechanismDemo?.url && (
          <ScrollReveal>
            <section className="tw:bg-surface tw:py-20">
              <div className="tw:mx-auto tw:max-w-4xl tw:px-6 tw:text-center">
                <h2 className="tw:mb-10 tw:text-3xl tw:font-bold tw:text-brand-ink">{t('inAction')}</h2>
                <MechanismDemo src={vehicle.mechanismDemo.url} />
              </div>
            </section>
          </ScrollReveal>
        )}

        {variants.length > 0 && (
          <ScrollReveal>
            <section id="specifications" className="tw:relative tw:isolate tw:overflow-hidden tw:bg-surface-raised tw:py-20">
              <SectionBackdrop src="/images/auto/gallery-2.png" variant="soft" base="surface-raised" />
              <div className="tw:relative tw:z-10 tw:mx-auto tw:max-w-4xl tw:px-6">
                <h2 className="tw:text-3xl tw:font-bold tw:text-brand-ink">{t('specifications')}</h2>
                <div className="tw:mt-8">
                  <VariantTabs variants={variants} />
                </div>
              </div>
            </section>
          </ScrollReveal>
        )}

        {revealableVariants.length >= 2 && (
          <ScrollReveal>
            <section className="tw:bg-surface tw:py-20">
              <div className="tw:mx-auto tw:max-w-4xl tw:px-6">
                <h2 className="tw:mb-8 tw:text-center tw:text-3xl tw:font-bold tw:text-brand-ink">{t('reveal')}</h2>
                <VariantReveal variants={variants} />
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
                <h2 className="tw:text-3xl tw:font-bold tw:text-brand-ink">{t('gallery')}</h2>
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
                <h2 className="tw:text-3xl tw:font-bold tw:text-brand-ink">{t('faq')}</h2>
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
              <h2 className="tw:text-3xl tw:font-bold tw:text-brand-ink">{t('findDealer')}</h2>
              <div className="tw:mt-10">
                {dealers.length === 0 ? (
                  <p className="tw:text-brand-ink/50">{t('dealersSoon')}</p>
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
                    {t(`documents.${label}`)}
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
