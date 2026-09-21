const points = [
  { title: 'Low Running Cost', text: 'Fuel-efficient engines that keep your daily cost per kilometer down.' },
  { title: 'Built to Last', text: 'Reinforced chassis and components engineered for daily commercial use.' },
  { title: 'Wide Dealer Network', text: 'Sales, service, and genuine parts available near you.' },
  { title: 'Easy Financing', text: 'Flexible plans through our dealer and partner network.' },
]

const WhyChooseUs = () => (
  <section className="tw:bg-surface-raised tw:py-20">
    <div className="tw:mx-auto tw:max-w-6xl tw:px-6">
      <h2 className="tw:text-3xl tw:font-bold tw:text-white">Why choose Neptune</h2>
      <div className="tw:mt-10 tw:grid tw:gap-6 tw:sm:grid-cols-2 tw:lg:grid-cols-4">
        {points.map((point) => (
          <div key={point.title} className="tw:rounded-2xl tw:bg-surface tw:border tw:border-white/10 tw:p-6">
            <p className="tw:text-lg tw:font-semibold tw:text-white">{point.title}</p>
            <p className="tw:mt-2 tw:text-sm tw:text-white/60">{point.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default WhyChooseUs
