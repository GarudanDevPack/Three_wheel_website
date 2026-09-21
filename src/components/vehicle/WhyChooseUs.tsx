const points = [
  { title: 'Low Running Cost', text: 'Fuel-efficient engines that keep your daily cost per kilometer down.' },
  { title: 'Built to Last', text: 'Reinforced chassis and components engineered for daily commercial use.' },
  { title: 'Wide Dealer Network', text: 'Sales, service, and genuine parts available near you.' },
  { title: 'Easy Financing', text: 'Flexible plans through our dealer and partner network.' },
]

const WhyChooseUs = () => (
  <section className="tw:bg-gray-50 tw:py-20">
    <div className="tw:mx-auto tw:max-w-6xl tw:px-6">
      <h2 className="tw:text-3xl tw:font-bold tw:text-brand-ink">Why choose Neptune</h2>
      <div className="tw:mt-10 tw:grid tw:gap-6 tw:sm:grid-cols-2 tw:lg:grid-cols-4">
        {points.map((point) => (
          <div key={point.title} className="tw:rounded-2xl tw:bg-white tw:p-6 tw:shadow-sm">
            <p className="tw:text-lg tw:font-semibold tw:text-brand-ink">{point.title}</p>
            <p className="tw:mt-2 tw:text-sm tw:text-gray-600">{point.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default WhyChooseUs
