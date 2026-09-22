import Link from 'next/link'

const CtaBanner = () => (
  <section className="tw:bg-brand-blue tw:py-16 tw:text-center tw:text-white">
    <div className="tw:mx-auto tw:max-w-3xl tw:px-6">
      <h2 className="tw:text-3xl tw:font-bold">Ready to find your Neptune?</h2>
      <p className="tw:mt-3 tw:text-white/80">
        Compare passenger and cargo models, specs, and colors across the full lineup.
      </p>
      <Link
        href="/vehicles"
        className="tw:mt-6 tw:inline-block tw:rounded-full tw:bg-white tw:px-8 tw:py-3 tw:text-sm tw:font-semibold tw:text-brand-blue"
      >
        Browse the catalog
      </Link>
    </div>
  </section>
)

export default CtaBanner
