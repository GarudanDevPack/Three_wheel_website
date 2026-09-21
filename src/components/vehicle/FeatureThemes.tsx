const themes = [
  { theme: 'Economy', icon: '⛽', blurb: 'Fuel-efficient engines that keep your cost per kilometer low.' },
  { theme: 'Durability', icon: '🛠️', blurb: 'Reinforced chassis and components built for daily commercial duty.' },
  { theme: 'Low Maintenance', icon: '🔧', blurb: 'Simple servicing and widely available genuine parts.' },
  { theme: 'Comfort', icon: '💺', blurb: 'A cabin designed for long shifts on the road.' },
]

const FeatureThemes = () => (
  <section className="tw:bg-surface tw:py-20">
    <div className="tw:mx-auto tw:max-w-6xl tw:px-6">
      <h2 className="tw:text-3xl tw:font-bold tw:text-white">Built around what matters</h2>
      <div className="tw:mt-10 tw:grid tw:gap-6 tw:sm:grid-cols-2 tw:lg:grid-cols-4">
        {themes.map((item) => (
          <div key={item.theme} className="tw:rounded-2xl tw:bg-surface-raised tw:p-6">
            <span className="tw:text-3xl">{item.icon}</span>
            <p className="tw:mt-3 tw:text-lg tw:font-semibold tw:text-white">{item.theme}</p>
            <p className="tw:mt-2 tw:text-sm tw:text-white/60">{item.blurb}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default FeatureThemes
