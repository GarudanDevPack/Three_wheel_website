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
import { routing, type AppLocale } from '@/i18n/routing'
import { cmsTranslationFlags, languageMetadata, localizedPath, socialMetadata } from '@/lib/pageSeo'
import { indexableLocales } from '@/lib/translations'
import { formatDate, formatLkr } from '@/lib/format'
import { Link } from '@/i18n/navigation'
import { availableModels, catalogModelLocales, getCatalogModel, RUNNING_COST, type CatalogModel } from '@/lib/catalog'
import JsonLd from '@/components/seo/JsonLd'
import { absoluteUrl, breadcrumbJsonLd, faqPageJsonLd } from '@/lib/jsonLd'
import FallbackDealerCards from '@/components/vehicle/FallbackDealerCards'
import TrackModelView from '@/components/vehicle/TrackModelView'
import { applyOfferWindow } from '@/lib/offers'
import { getSiteSettings } from '@/lib/siteSettings'

export const revalidate = 300

const perKmCost = (RUNNING_COST.monthlyElectricity / RUNNING_COST.monthlyKm).toFixed(1)

type PageProps = { params: Promise<{ locale: AppLocale; slug: string }> }

type MediaRef = { url?: string | null; alt?: string | null } | null | undefined

type VehicleDoc = {
  id: string
  name: string
  category?: string | null
  shortDescription?: string | null
  pricing?: {
    price?: number | null
    showPrice?: boolean | null
    priceNote?: string | null
    originalPrice?: number | null
    offerLabel?: string | null
    offerConditions?: string | null
    offerValidFrom?: string | null
    offerValidUntil?: string | null
  } | null
  heroImage?: MediaRef
  variants?: Variant[]
  colors?: Array<{
    colorName: string
    swatchHex?: string | null
    video?: MediaRef
    videoWebm?: MediaRef
    videoPoster?: MediaRef
    angleImages?: AngleImage[]
  }>
  explodedPartsIllustration?: ExplodedPart[]
  chassisFeature?: ChassisFeatureDoc
  mechanismDemo?: MediaRef
  mechanismDemoWebm?: MediaRef
  mechanismDemoPoster?: MediaRef
  parts?: VehiclePart[]
  accessories?: Accessory[]
  gallery?: Array<{ image?: MediaRef }>
  faqs?: FaqItem[]
  brochurePdf?: MediaRef
  maintenanceSchedulePdf?: MediaRef
  warrantyPolicyPdf?: MediaRef
  seo?: { metaTitle?: string | null; metaDescription?: string | null; ogImage?: MediaRef }
  /** Set when the page is built from the client-verified catalog (no database yet). */
  catalog?: CatalogModel | null
}

/** Catalog model → the vehicle document shape this page renders. */
const fromCatalog = (model: CatalogModel): VehicleDoc => ({
  id: `catalog-${model.slug}`,
  name: model.name,
  category: model.category,
  shortDescription: model.seo.intro,
  pricing: {
    price: model.price,
    showPrice: model.price !== null,
    priceNote: model.priceNote,
    originalPrice: model.originalPrice,
    offerLabel: model.offerLabel,
    offerConditions: model.offerConditions,
    offerValidFrom: model.offerValidFrom,
    offerValidUntil: model.offerValidUntil,
  },
  heroImage: model.heroImage,
  variants: [{ variantName: model.name, fuelType: 'Electric', specs: model.specs, charging: model.charging }],
  colors: model.colors.map((color) => ({
    colorName: color.colorName,
    swatchHex: color.swatchHex,
    video: color.video ? { url: color.video } : null,
    videoWebm: color.videoWebm ? { url: color.videoWebm } : null,
    videoPoster: color.videoPoster ? { url: color.videoPoster } : null,
    angleImages: color.image ? [{ angleLabel: 'Front', image: color.image }] : [],
  })),
  faqs: model.faqs,
  catalog: model,
})

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
    if (docs[0]) return docs[0] as VehicleDoc
  } catch {
    // Payload/database not configured yet — fall back to the catalog below.
  }
  const model = getCatalogModel(slug)
  return model && model.status === 'Available' ? fromCatalog(model) : null
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
    if (docs.length) return docs.map((vehicle) => ({ slug: vehicle.slug as string }))
  } catch {
    // No database yet — prerender the catalog models.
  }
  // Upcoming models have no photos, price or specs yet, so they get no page (a "Coming soon" card instead).
  return availableModels.map((model) => ({ slug: model.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const vehicle = await getVehicle(slug, locale)
  if (!vehicle) return {}

  // Catalog titles already carry the brand, so they bypass the "%s | Neptune" template.
  const catalogSeo = vehicle.catalog?.seo
  const title = vehicle.seo?.metaTitle || catalogSeo?.title || vehicle.name
  const description = vehicle.seo?.metaDescription || catalogSeo?.description || vehicle.shortDescription || undefined
  // Prefer a photo on a real background (studio render) over a transparent cut-out for link previews.
  const image = vehicle.seo?.ogImage?.url || vehicle.catalog?.pricingImage?.url || vehicle.catalog?.heroImage?.url
  const path = `/vehicles/${slug}`
  // Catalog copy (H1, intro, FAQs) is English-only; CMS records are translated in the admin and
  // switched on per language with "Translation complete".
  const indexable = indexableLocales(path, {
    contentLocales: vehicle.catalog ? catalogModelLocales : routing.locales,
    cmsComplete: vehicle.catalog ? undefined : await cmsTranslationFlags('vehicles', slug),
  })

  return {
    title: catalogSeo && !vehicle.seo?.metaTitle ? { absolute: title } : title,
    description,
    ...languageMetadata(path, locale, indexable),
    ...socialMetadata(locale, { title, description: description || '', url: localizedPath(path, locale), image, locales: indexable }),
  }
}

const pdfLinks = (vehicle: VehicleDoc) =>
  [
    { doc: vehicle.brochurePdf, label: 'brochure' },
    { doc: vehicle.maintenanceSchedulePdf, label: 'maintenance' },
    { doc: vehicle.warrantyPolicyPdf, label: 'warranty' },
    // Catalog models: the client's User Manual & Service Book.
    { doc: vehicle.catalog ? { url: '/docs/neptune-user-manual-service-book.pdf' } : null, label: 'manual' },
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
  const [t, tc, tp] = await Promise.all([
    getTranslations('VehicleDetail'),
    getTranslations('Breadcrumbs'),
    getTranslations('Pricing'),
  ])
  const [vehicle, dealers, settings, tw] = await Promise.all([
    getVehicle(slug, locale),
    getDealers(locale),
    getSiteSettings(locale),
    getTranslations('Warranty'),
  ])
  if (!vehicle) notFound()
  const listedPrice =
    vehicle.pricing?.showPrice !== false && typeof vehicle.pricing?.price === 'number' && vehicle.pricing.price > 0
      ? vehicle.pricing.price
      : null
  // Offer window applied at render time: outside it the offer disappears and the regular price shows.
  const offer = applyOfferWindow({
    price: listedPrice,
    originalPrice:
      listedPrice && (vehicle.pricing?.originalPrice ?? 0) > listedPrice ? (vehicle.pricing?.originalPrice ?? null) : null,
    offerLabel: vehicle.pricing?.offerLabel ?? null,
    offerConditions: vehicle.pricing?.offerConditions,
    offerValidFrom: vehicle.pricing?.offerValidFrom,
    offerValidUntil: vehicle.pricing?.offerValidUntil,
  })
  const price = offer.price
  const plan = settings.financing.interestFreePlan
  const planEligibility = plan.eligibility ? [plan.eligibility] : [tp('zeroEligibilityIncome'), tp('zeroEligibilityDriver')]
  // One warranty wording (SiteSettings → Warranty), falling back to the translated defaults.
  const warrantyText = {
    vehicle: settings.warranty.vehicle ?? tw('vehicleValue'),
    battery: settings.warranty.battery ?? `${tw('batteryValue')}, ${tw('batteryNote')}`,
    service: settings.warranty.serviceCondition ?? t('serviceText'),
  }

  const variants = vehicle.variants || []
  const revealableVariants = variants.filter((v) => v.taglineForReveal)
  const colors = vehicle.colors || []
  const explodedParts = vehicle.explodedPartsIllustration || []
  const parts = vehicle.parts || []
  const accessories = vehicle.accessories || []
  const gallery = vehicle.gallery || []
  const faqs = vehicle.faqs || []
  const documents = pdfLinks(vehicle)

  const catalogModel = vehicle.catalog ?? null
  const pagePath = `/vehicles/${slug}`
  const productImage = catalogModel?.pricingImage?.url || vehicle.heroImage?.url

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: vehicle.name,
    description: vehicle.shortDescription || undefined,
    image: productImage ? absoluteUrl(productImage) : undefined,
    brand: { '@type': 'Brand', name: 'Neptune' },
    manufacturer: { '@type': 'Organization', name: 'Garudan (Pvt) Ltd' },
    category: vehicle.category ? `${vehicle.category} electric three-wheeler` : 'Electric three-wheeler',
    // Only a real, published price becomes an Offer; no ratings/reviews until real ones exist.
    offers: price
      ? {
          '@type': 'Offer',
          price,
          priceCurrency: 'LKR',
          availability:
            catalogModel?.status === 'Upcoming' ? 'https://schema.org/PreOrder' : 'https://schema.org/InStock',
          url: absoluteUrl(localizedPath(pagePath, locale)),
          seller: { '@type': 'Organization', name: 'Neptune' },
          // Only a real, published end date.
          ...(offer.offerValidUntil ? { priceValidUntil: offer.offerValidUntil.slice(0, 10) } : {}),
        }
      : undefined,
  }

  return (
    <>
      <JsonLd data={productJsonLd} />
      <JsonLd
        data={breadcrumbJsonLd(locale, tc('home'), [
          { name: tc('vehicles'), path: '/vehicles' },
          { name: vehicle.name, path: pagePath },
        ])}
      />
      <JsonLd data={faqPageJsonLd(faqs, locale)} />
      <Preloader />
      <Header />
      <DetailAnchorNav links={anchorLinks.map((link) => ({ ...link, label: t(`nav.${link.label}`) }))} />
      <main data-track-location="model_page">
        <TrackModelView model={slug} />
        <section id="overview" className="tw:relative tw:isolate tw:overflow-hidden tw:bg-surface tw:py-16 tw:text-brand-ink">
          <SectionBackdrop src="/images/auto/neptune-blue-1.webp" variant="soft" base="surface" />
          <div className="tw:relative tw:z-10 tw:mx-auto tw:grid tw:max-w-6xl tw:items-center tw:gap-10 tw:px-6 tw:md:grid-cols-2">
            <div>
              <nav aria-label={t('breadcrumb')} className="tw:mb-4 tw:text-xs tw:font-semibold tw:text-brand-ink/50">
                <Link href="/" className="tw:hover:text-brand-blue">{t('home')}</Link>
                <span className="tw:mx-2" aria-hidden="true">›</span>
                <Link href="/vehicles" className="tw:hover:text-brand-blue">{t('vehicles')}</Link>
                <span className="tw:mx-2" aria-hidden="true">›</span>
                <span className="tw:text-brand-ink/70">{vehicle.name}</span>
              </nav>
              {catalogModel?.isNew && (
                <span className="tw:mb-3 tw:inline-flex tw:rounded-full tw:bg-red-600 tw:px-3 tw:py-1 tw:text-xs tw:font-bold tw:uppercase tw:text-white">
                  {t('newArrival')}
                </span>
              )}
              <h1 className="tw:text-4xl tw:font-bold">{catalogModel?.seo.h1 ?? vehicle.name}</h1>
              {vehicle.shortDescription && (
                <p className="tw:mt-4 tw:text-brand-ink/70">{vehicle.shortDescription}</p>
              )}
              {catalogModel && (
                <p className="tw:mt-3 tw:text-sm tw:text-brand-ink/70">
                  <strong className="tw:text-brand-ink">{t('bestFor')}</strong> {catalogModel.seo.bestFor}
                </p>
              )}
              <div className="tw:mt-6 tw:inline-flex tw:flex-col tw:rounded-2xl tw:border tw:border-brand-ink/10 tw:bg-surface-raised/80 tw:px-5 tw:py-4">
                <span className="tw:text-xs tw:font-semibold tw:text-brand-ink/50">{t('price')}</span>
                {price && offer.originalPrice && (
                  <span className="tw:mt-1 tw:text-sm tw:text-brand-ink/45">
                    <s>{formatLkr(offer.originalPrice, locale)}</s>{' '}
                    <span className="tw:font-bold tw:text-red-600">
                      {t('save', { amount: formatLkr(offer.originalPrice - price, locale) })}
                    </span>
                  </span>
                )}
                <span className="tw:mt-1 tw:text-2xl tw:font-bold tw:text-brand-ink">
                  {price ? formatLkr(price, locale) : t('priceOnRequest')}
                </span>
                {price && vehicle.pricing?.priceNote && (
                  <span className="tw:mt-0.5 tw:text-xs tw:text-brand-ink/50">
                    {vehicle.pricing.priceNote === 'Including VAT' ? t('inclVat') : vehicle.pricing.priceNote}
                  </span>
                )}
                {catalogModel?.downPayment && (
                  <span className="tw:mt-1 tw:text-sm tw:font-semibold tw:text-brand-blue">
                    {t('downPayment', { amount: formatLkr(catalogModel.downPayment, locale) })}
                  </span>
                )}
                {/* Offer details and end date, only when published. */}
                {price && offer.originalPrice && offer.offerConditions && (
                  <span className="tw:mt-2 tw:max-w-sm tw:text-xs tw:leading-relaxed tw:text-brand-ink/70">
                    {offer.offerConditions}
                  </span>
                )}
                {price && offer.originalPrice && offer.offerValidUntil && (
                  <span className="tw:mt-1 tw:text-xs tw:font-semibold tw:text-red-700">
                    {tp('offerEnds', { date: formatDate(offer.offerValidUntil, locale) })}
                  </span>
                )}
                {/* Interest-free plan terms next to the price (SiteSettings → Financing). */}
                {price && plan.enabled && (
                  <div className="tw:mt-3 tw:max-w-sm tw:border-t tw:border-brand-ink/10 tw:pt-3 tw:text-sm">
                    <p className="tw:m-0 tw:font-semibold tw:text-brand-ink">{tp('zeroTitle')}</p>
                    <p className="tw:m-0 tw:mt-1 tw:text-brand-ink/70">
                      {tp('zeroTerms', {
                        amount: formatLkr(plan.maxLoan, locale),
                        monthly: formatLkr(plan.monthly, locale),
                        months: plan.months,
                      })}
                    </p>
                    <p className="tw:m-0 tw:mt-1 tw:text-xs tw:text-brand-ink/60">
                      {planEligibility.join(' · ')} · {tp('zeroLimited', { count: plan.families })}
                    </p>
                    {plan.validUntil && (
                      <p className="tw:m-0 tw:mt-1 tw:text-xs tw:font-semibold tw:text-red-700">
                        {tp('offerEnds', { date: formatDate(plan.validUntil, locale) })}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="tw:mt-6 tw:flex tw:flex-wrap tw:gap-3">
                <Link href={`/contact?model=${slug}#enquire`} data-track="cta" className="tw:rounded-full tw:bg-brand-blue tw:px-6 tw:py-3 tw:text-sm tw:font-semibold tw:text-white tw:transition tw:hover:bg-brand-blue-light">
                  {t('bookTestDrive')}
                </Link>
                <Link href="/#pricing" className="tw:rounded-full tw:border tw:border-brand-blue/40 tw:px-6 tw:py-3 tw:text-sm tw:font-semibold tw:text-brand-blue tw:transition tw:hover:border-brand-blue">
                  {t('financeOptions')}
                </Link>
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

        {catalogModel && (
          <section aria-labelledby="key-facts" className="tw:bg-surface-raised tw:py-16">
            <div className="tw:mx-auto tw:max-w-6xl tw:px-6">
              <h2 id="key-facts" className="tw:text-3xl tw:font-bold tw:text-brand-ink">{t('keyFacts')}</h2>
              <dl className="tw:mt-8 tw:grid tw:grid-cols-2 tw:gap-4 tw:md:grid-cols-3 tw:lg:grid-cols-6">
                {catalogModel.keyFacts.map((fact) => (
                  <div key={fact.label} className="tw:rounded-2xl tw:border tw:border-brand-ink/10 tw:bg-surface tw:p-4">
                    <dt className="tw:text-xs tw:font-semibold tw:text-brand-ink/50">{fact.label}</dt>
                    <dd className="tw:m-0 tw:mt-1 tw:text-base tw:font-bold tw:text-brand-ink">{fact.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="tw:mt-3 tw:text-xs tw:text-brand-ink/50">{catalogModel.rangeNote}</p>

              <div className="tw:mt-12 tw:grid tw:gap-8 tw:lg:grid-cols-3">
                <div className="tw:rounded-3xl tw:bg-surface tw:p-6">
                  <h3 className="tw:text-lg tw:font-bold tw:text-brand-ink">{t('features')}</h3>
                  <ul className="tw:mt-4 tw:list-disc tw:space-y-2 tw:pl-5 tw:text-sm tw:text-brand-ink/75">
                    {catalogModel.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="tw:rounded-3xl tw:bg-surface tw:p-6">
                  <h3 className="tw:text-lg tw:font-bold tw:text-brand-ink">{t('runningCost')}</h3>
                  <p className="tw:mt-4 tw:text-3xl tw:font-bold tw:text-brand-blue">≈ Rs. {perKmCost}</p>
                  <p className="tw:text-sm tw:text-brand-ink/60">{t('perKm')}</p>
                  <p className="tw:mt-3 tw:text-sm tw:text-brand-ink/75">
                    {t('runningCostText', {
                      cost: RUNNING_COST.monthlyElectricity.toLocaleString('en-US'),
                      km: RUNNING_COST.monthlyKm.toLocaleString('en-US'),
                    })}
                  </p>
                  <p className="tw:mt-2 tw:text-xs tw:text-brand-ink/50">{t('runningCostAssumptions')}</p>
                </div>
                {(catalogModel.warranty || settings.warranty.vehicle) && (
                  <div className="tw:rounded-3xl tw:bg-surface tw:p-6">
                    <h3 className="tw:text-lg tw:font-bold tw:text-brand-ink">{t('warrantyService')}</h3>
                    <dl className="tw:mt-4 tw:space-y-3 tw:text-sm">
                      <div>
                        <dt className="tw:text-xs tw:font-semibold tw:text-brand-ink/50">{t('vehicleWarranty')}</dt>
                        <dd className="tw:m-0 tw:font-bold tw:text-brand-ink">{warrantyText.vehicle}</dd>
                      </div>
                      <div>
                        <dt className="tw:text-xs tw:font-semibold tw:text-brand-ink/50">{t('batteryWarranty')}</dt>
                        <dd className="tw:m-0 tw:font-bold tw:text-brand-ink">{warrantyText.battery}</dd>
                      </div>
                    </dl>
                    <p className="tw:mt-3 tw:text-sm tw:text-brand-ink/75">{warrantyText.service}</p>
                    <Link href="/warranty" className="tw:mt-3 tw:inline-flex tw:text-sm tw:font-semibold tw:text-brand-blue">
                      {t('warrantyLink')} →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        <ScrollReveal>
          <FeatureThemes />
        </ScrollReveal>

        {colors.length > 0 && (
          <ScrollReveal>
            <section id="colors" className="tw:relative tw:isolate tw:overflow-hidden tw:bg-surface-raised tw:py-20">
              <SectionBackdrop src="/images/auto/night-ride.webp" variant="soft" base="surface-raised" />
              <div className="tw:relative tw:z-10 tw:mx-auto tw:max-w-6xl tw:px-6">
                <h2 className="tw:text-3xl tw:font-bold tw:text-brand-ink">{t('colors')}</h2>
                <div className="tw:mt-10">
                  <ColorShowcase
                    colors={colors.map((color) => ({
                      colorName: color.colorName,
                      swatchHex: color.swatchHex,
                      video: color.video?.url,
                      videoWebm: color.videoWebm?.url,
                      videoPoster: color.videoPoster?.url,
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
                <MechanismDemo
                  src={vehicle.mechanismDemo.url}
                  webm={vehicle.mechanismDemoWebm?.url}
                  poster={vehicle.mechanismDemoPoster?.url}
                />
              </div>
            </section>
          </ScrollReveal>
        )}

        {variants.length > 0 && (
          <ScrollReveal>
            <section id="specifications" className="tw:relative tw:isolate tw:overflow-hidden tw:bg-surface-raised tw:py-20">
              <SectionBackdrop src="/images/auto/gallery-2.webp" variant="soft" base="surface-raised" />
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
                  <FallbackDealerCards locale={locale} />
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
