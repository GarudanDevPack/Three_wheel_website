const contourPaths = [
  'M-20 40 C 80 10, 160 70, 260 30 S 420 20, 520 60',
  'M-20 90 C 100 60, 180 120, 280 80 S 440 70, 520 110',
  'M-20 140 C 90 180, 190 130, 290 160 S 430 190, 520 150',
  'M-20 190 C 110 220, 210 170, 300 200 S 450 230, 520 200',
  'M-20 240 C 90 210, 200 260, 300 230 S 440 210, 520 250',
]

const TopographicBackdrop = () => (
  <div className="tw:pointer-events-none tw:absolute tw:inset-0 tw:overflow-hidden tw:[mask-image:linear-gradient(to_right,transparent,black_45%)]">
    <svg
      viewBox="0 0 500 280"
      preserveAspectRatio="none"
      className="tw:h-full tw:w-full"
      fill="none"
      aria-hidden="true"
    >
      {contourPaths.map((d, index) => (
        <path
          key={index}
          d={d}
          stroke="currentColor"
          strokeWidth="1"
          className="tw:text-brand-ink/15"
        />
      ))}
    </svg>
  </div>
)

export default TopographicBackdrop
