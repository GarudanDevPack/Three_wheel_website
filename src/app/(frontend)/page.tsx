import type { Metadata } from 'next'
import Preloader from '@/components/animations/LazyPreloader'
import ScrollReveal from '@/components/animations/LazyScrollReveal'
import FloatingVehicleWidget from '@/components/animations/LazyFloatingVehicleWidget'
import MechanismSketch from '@/components/animations/LazyMechanismSketch'
import CtaBanner from '@/components/animations/LazyCtaBanner'
import Header from '@/components/vehicle/Header'
import Hero from '@/components/vehicle/Hero'
import FeaturedModels from '@/components/vehicle/FeaturedModels'
import WhyChooseUs from '@/components/vehicle/WhyChooseUs'
import Highlights from '@/components/vehicle/Highlights'
import ColorVariants from '@/components/vehicle/ColorVariants'
import ChargingSection from '@/components/vehicle/ChargingSection'
import Gallery from '@/components/vehicle/Gallery'
import Dealers from '@/components/vehicle/Dealers'
import AwardStrip from '@/components/vehicle/AwardStrip'
import InquiryForm from '@/components/ui/InquiryForm'
import Footer from '@/components/vehicle/Footer'
import { getPageMetadata } from '@/lib/pageSeo'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('home', {
    title: 'Neptune Three-Wheelers',
    description:
      'Neptune three-wheeler auto rickshaws — built for daily loads and longer routes.',
  })
}

const HomePage = () => (
  <>
    <Preloader />
    <Header />
    <main>
      <Hero />
      <ScrollReveal>
        <FeaturedModels />
      </ScrollReveal>
      <WhyChooseUs />
      <MechanismSketch />
      <Highlights />
      <ScrollReveal>
        <ColorVariants />
      </ScrollReveal>
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

export default HomePage
