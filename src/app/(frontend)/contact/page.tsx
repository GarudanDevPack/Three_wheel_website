import type { Metadata } from 'next'
import Preloader from '@/components/animations/LazyPreloader'
import Header from '@/components/vehicle/Header'
import Footer from '@/components/vehicle/Footer'
import InquiryForm from '@/components/ui/InquiryForm'
import { getPageMetadata } from '@/lib/pageSeo'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('contact', {
    title: 'Contact Neptune',
    description: 'Get in touch with Neptune for vehicle, fleet, dealership, or partnership enquiries.',
  })
}

const ContactPage = () => (
  <>
    <Preloader />
    <Header />
    <main>
      <section className="tw:bg-surface tw:py-20">
        <div className="tw:mx-auto tw:max-w-4xl tw:px-6 tw:text-center">
          <h1 className="tw:text-4xl tw:font-bold tw:text-white">Get in touch</h1>
          <p className="tw:mt-4 tw:text-white/60">
            Questions about a vehicle, fleet orders, or becoming a dealer or sales partner —
            reach out and our team will get back to you.
          </p>
        </div>
      </section>
      <InquiryForm
        defaultType="Single Vehicle"
        title="Send us a message"
        description="Pick the enquiry type that fits best and we'll route it to the right team."
      />
    </main>
    <Footer />
  </>
)

export default ContactPage
