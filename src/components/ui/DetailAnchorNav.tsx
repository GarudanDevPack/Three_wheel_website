export type AnchorLink = { href: string; label: string }

const DetailAnchorNav = ({ links }: { links: AnchorLink[] }) => (
  <nav className="tw:sticky tw:top-[64px] tw:z-40 tw:overflow-x-auto tw:border-b tw:border-white/10 tw:bg-surface/95 tw:backdrop-blur">
    <div className="tw:mx-auto tw:flex tw:max-w-6xl tw:gap-6 tw:px-6 tw:py-3 tw:text-sm tw:font-semibold tw:whitespace-nowrap">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="tw:text-white/70 tw:transition tw:hover:text-brand-blue-light"
        >
          {link.label}
        </a>
      ))}
    </div>
  </nav>
)

export default DetailAnchorNav
