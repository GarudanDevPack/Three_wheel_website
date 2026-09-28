import type { Metadata } from 'next'
import Preloader from '@/components/animations/LazyPreloader'
import FloatingVehicleWidget from '@/components/animations/LazyFloatingVehicleWidget'
import CtaBanner from '@/components/animations/LazyCtaBanner'
import DesignShowcase from '@/components/vehicle/LazyDesignShowcase'
import Header from '@/components/vehicle/Header'
import Hero from '@/components/vehicle/Hero'
import WhyChooseUs from '@/components/vehicle/WhyChooseUs'
import Highlights from '@/components/vehicle/Highlights'
import ChargingSection from '@/components/vehicle/ChargingSection'
import Gallery from '@/components/vehicle/Gallery'
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
      <WhyChooseUs />
      <DesignShowcase />
      <Highlights />
      <ChargingSection />
      <Gallery />
      <AwardStrip />
      <CtaBanner />
      <InquiryForm />
    </main>
    <Footer />
    <FloatingVehicleWidget />
  </>
)

export default HomePage
