import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Preloader from '@/components/animations/LazyPreloader'
import ScrollReveal from '@/components/animations/LazyScrollReveal'
import FloatingVehicleWidget from '@/components/animations/LazyFloatingVehicleWidget'
import CargoVersatility from '@/components/vehicle/CargoVersatility'
import CtaBanner from '@/components/animations/LazyCtaBanner'
import Header from '@/components/vehicle/Header'
import Hero from '@/components/vehicle/Hero'
import ModelSelector from '@/components/vehicle/ModelSelector'
import DesignShowcase from '@/components/vehicle/LazyDesignShowcase'
import PricingFinance from '@/components/vehicle/PricingFinance'
import Testimonials from '@/components/vehicle/Testimonials'
import ModelComparison from '@/components/vehicle/ModelComparison'
import ChargingSection from '@/components/vehicle/ChargingSection'
import Gallery from '@/components/vehicle/Gallery'
import Dealers from '@/components/vehicle/Dealers'
import AwardStrip from '@/components/vehicle/AwardStrip'
import InquiryForm from '@/components/ui/InquiryForm'
import Footer from '@/components/vehicle/Footer'
import type { AppLocale } from '@/i18n/routing'
import { getPageMetadata } from '@/lib/pageSeo'

export const revalidate = 300

type PageProps = { params: Promise<{ locale: AppLocale }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Meta' })
  const metadata = await getPageMetadata('home', locale, {
    title: t('siteTitle'),
    description: t('siteDescription'),
  })
  return { ...metadata, title: { absolute: String(metadata.title ?? t('siteTitle')) } }
}

const HomePage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <Preloader />
      <Header />
      <main>
        <Hero />
        <ScrollReveal>
          <ModelSelector />
        </ScrollReveal>
        <ScrollReveal>
          <DesignShowcase />
        </ScrollReveal>
        <PricingFinance />
        <Testimonials />
        <ScrollReveal>
          <CargoVersatility />
        </ScrollReveal>
        <ModelComparison />
        <ScrollReveal>
          <ChargingSection />
        </ScrollReveal>
        <Gallery />
        <Dealers />
        <AwardStrip />
        <CtaBanner />
        <InquiryForm />
      </main>
      <Footer />
      <FloatingVehicleWidget />
    </>
  )
}

export default HomePage
