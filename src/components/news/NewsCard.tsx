import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import type { NewsItem } from '@/lib/news'

type Variant = 'grid' | 'featured' | 'hero' | 'compact'

type NewsCardProps = {
  item: NewsItem
  dateLabel: string
  readMore: string
  /** Translated category chip label (e.g. "Offer"). */
  categoryLabel?: string | null
  /** Legacy flag for the wide card on /news — same as `variant="featured"`. */
  featured?: boolean
  variant?: Variant
  /** Use `h3` when the cards sit under a section `h2` (e.g. on the home page). */
  headingLevel?: 'h2' | 'h3'
}

// Cards are visible by default; NewsReveal only adds the entrance animation.
const cardBase =
  'tw:group tw:overflow-hidden tw:rounded-3xl tw:border tw:border-brand-ink/10 tw:bg-white tw:transition-[box-shadow,translate] tw:duration-300 tw:hover:-translate-y-1 tw:hover:shadow-[0_20px_40px_-20px_rgba(11,14,20,0.35)]'

const Chip = ({ label }: { label: string }) => (
  <span className="tw:rounded-full tw:bg-brand-blue/10 tw:px-2.5 tw:py-0.5 tw:text-[11px] tw:font-bold tw:uppercase tw:tracking-wide tw:text-brand-blue">
    {label}
  </span>
)

const NewsCard = ({
  item,
  dateLabel,
  readMore,
  categoryLabel,
  featured = false,
  variant: variantProp,
  headingLevel: Heading = 'h2',
}: NewsCardProps) => {
  const variant: Variant = variantProp ?? (featured ? 'featured' : 'grid')
  const href = `/news/${item.slug}`
  const meta = (
    <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-2 tw:text-xs tw:font-semibold tw:text-brand-ink/50">
      {categoryLabel && <Chip label={categoryLabel} />}
      <time dateTime={item.publishedDate}>{dateLabel}</time>
      {item.sourceName && <span className="tw:text-brand-blue">· {item.sourceName}</span>}
    </div>
  )

  if (variant === 'compact') {
    return (
      <article data-news-card className={`${cardBase} tw:grid tw:grid-cols-[112px_1fr] tw:gap-4 tw:p-3 tw:sm:grid-cols-[140px_1fr]`}>
        <Link href={href} className="tw:relative tw:block tw:aspect-square tw:overflow-hidden tw:rounded-2xl tw:bg-brand-blue/10" tabIndex={-1} aria-hidden="true">
          {item.cover && (
            <Image src={item.cover.url} alt="" fill sizes="140px" className="tw:object-cover tw:transition-transform tw:duration-500 tw:group-hover:scale-105" />
          )}
        </Link>
        <div className="tw:flex tw:min-w-0 tw:flex-col tw:justify-center tw:py-1 tw:pr-2">
          {meta}
          <Heading className="tw:mt-2 tw:line-clamp-3 tw:text-base tw:font-bold tw:leading-snug tw:text-brand-ink">
            <Link href={href} className="tw:transition tw:hover:text-brand-blue">
              {item.title}
            </Link>
          </Heading>
        </div>
      </article>
    )
  }

  const isHero = variant === 'hero'
  const isWide = variant === 'featured'

  return (
    <article data-news-card className={`${cardBase} ${isWide ? 'tw:grid tw:md:grid-cols-2' : 'tw:flex tw:flex-col'}`}>
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className={`tw:relative tw:block tw:overflow-hidden tw:bg-brand-blue/10 ${
          isWide ? 'tw:aspect-[16/10] tw:md:aspect-auto tw:md:min-h-[340px]' : 'tw:aspect-[16/10]'
        }`}
      >
        {item.cover && (
          <Image
            src={item.cover.url}
            alt=""
            fill
            sizes={isWide || isHero ? '(min-width: 768px) 55vw, 100vw' : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'}
            className="tw:object-cover tw:transition-transform tw:duration-500 tw:group-hover:scale-105"
          />
        )}
      </Link>
      <div className={`tw:flex tw:flex-1 tw:flex-col ${isWide ? 'tw:justify-center tw:p-8 tw:md:p-10' : isHero ? 'tw:p-6 tw:sm:p-8' : 'tw:p-6'}`}>
        {meta}
        <Heading
          className={`tw:mt-3 tw:font-bold tw:leading-tight tw:text-brand-ink ${
            isWide || isHero ? 'tw:text-2xl tw:md:text-3xl' : 'tw:text-lg'
          }`}
        >
          <Link href={href} className="tw:transition tw:hover:text-brand-blue">
            {item.title}
          </Link>
        </Heading>
        {item.excerpt && (
          <p className={`tw:mt-3 tw:leading-relaxed tw:text-brand-ink/70 ${isWide ? '' : isHero ? 'tw:line-clamp-3 tw:text-base' : 'tw:line-clamp-3 tw:text-sm'}`}>
            {item.excerpt}
          </p>
        )}
        <Link href={href} className="tw:mt-5 tw:inline-flex tw:items-center tw:gap-1.5 tw:text-sm tw:font-semibold tw:text-brand-blue">
          {readMore}
          <span aria-hidden="true" className="tw:transition-transform tw:group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </article>
  )
}

export default NewsCard
