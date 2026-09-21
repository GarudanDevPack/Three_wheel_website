import type { Metadata } from 'next'
import Preloader from '@/components/animations/LazyPreloader'
import ScrollReveal from '@/components/animations/LazyScrollReveal'
import Header from '@/components/vehicle/Header'
import Hero from '@/components/vehicle/Hero'
import FeaturedModels from '@/components/vehicle/FeaturedModels'
import WhyChooseUs from '@/components/vehicle/WhyChooseUs'
import Highlights from '@/components/vehicle/Highlights'
import ColorVariants from '@/components/vehicle/ColorVariants'
import Gallery from '@/components/vehicle/Gallery'
import Dealers from '@/components/vehicle/Dealers'
import CtaBanner from '@/components/vehicle/CtaBanner'
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
      <ScrollReveal>
        <WhyChooseUs />
      </ScrollReveal>
      <Highlights />
      <ScrollReveal>
        <ColorVariants />
      </ScrollReveal>
      <ScrollReveal>
        <Gallery />
      </ScrollReveal>
      <ScrollReveal>
        <Dealers />
      </ScrollReveal>
      <ScrollReveal>
        <CtaBanner />
      </ScrollReveal>
      <InquiryForm />
    </main>
    <Footer />
  </>
)

export default HomePage
