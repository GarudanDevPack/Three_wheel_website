import Link from 'next/link'
import Header from '@/components/vehicle/Header'
import Footer from '@/components/vehicle/Footer'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="tw:bg-brand-ink tw:py-32">
        <div className="tw:mx-auto tw:max-w-2xl tw:px-6 tw:text-center">
          <p className="tw:text-brand-blue-light tw:font-semibold">404</p>
          <h1 className="tw:mt-4 tw:text-4xl tw:font-bold tw:text-white">
            We can&apos;t find that page
          </h1>
          <p className="tw:mt-4 tw:text-white/70">
            The page you're looking for doesn't exist or may have moved.
          </p>
          <Link
            href="/"
            className="tw:mt-8 tw:inline-block tw:rounded-full tw:bg-brand-blue tw:px-8 tw:py-3 tw:font-semibold tw:text-white tw:transition hover:tw:bg-brand-blue-light"
          >
            Go back home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
