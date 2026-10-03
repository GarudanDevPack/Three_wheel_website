import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import type { NewsItem } from '@/lib/news'

type NewsCardProps = {
  item: NewsItem
  dateLabel: string
  readMore: string
  featured?: boolean
}

const NewsCard = ({ item, dateLabel, readMore, featured = false }: NewsCardProps) => (
  <article
    data-news-card
    className={`tw:group tw:overflow-hidden tw:rounded-3xl tw:border tw:border-brand-ink/10 tw:bg-surface-raised tw:opacity-0 tw:transition tw:duration-300 tw:hover:-translate-y-1 tw:hover:shadow-[0_20px_40px_-20px_rgba(11,14,20,0.35)] ${
      featured ? 'tw:grid tw:md:grid-cols-2' : 'tw:flex tw:flex-col'
    }`}
  >
    <Link href={`/news/${item.slug}`} className={`tw:relative tw:block tw:overflow-hidden ${featured ? 'tw:aspect-[16/10] tw:md:aspect-auto tw:md:min-h-[340px]' : 'tw:aspect-[16/10]'}`}>
      {item.cover ? (
        <Image
          src={item.cover.url}
          alt={item.cover.alt || item.title}
          fill
          sizes={featured ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'}
          className="tw:object-cover tw:transition tw:duration-500 tw:group-hover:scale-105"
        />
      ) : (
        <div className="tw:h-full tw:w-full tw:bg-brand-blue/10" />
      )}
    </Link>
    <div className={`tw:flex tw:flex-1 tw:flex-col ${featured ? 'tw:justify-center tw:p-8 tw:md:p-10' : 'tw:p-6'}`}>
      <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-2 tw:text-xs tw:font-semibold tw:text-brand-ink/50">
        <time dateTime={item.publishedDate}>{dateLabel}</time>
        {item.sourceName && (
          <span className="tw:rounded-full tw:bg-brand-blue/10 tw:px-2.5 tw:py-0.5 tw:text-brand-blue">{item.sourceName}</span>
        )}
      </div>
      <h2 className={`tw:mt-3 tw:font-bold tw:text-brand-ink ${featured ? 'tw:text-2xl tw:md:text-3xl' : 'tw:text-lg'}`}>
        <Link href={`/news/${item.slug}`} className="tw:transition tw:hover:text-brand-blue">
          {item.title}
        </Link>
      </h2>
      {item.excerpt && (
        <p className={`tw:mt-3 tw:text-brand-ink/70 ${featured ? '' : 'tw:line-clamp-3 tw:text-sm'}`}>{item.excerpt}</p>
      )}
      <Link
        href={`/news/${item.slug}`}
        className="tw:mt-5 tw:inline-flex tw:items-center tw:gap-1.5 tw:text-sm tw:font-semibold tw:text-brand-blue"
      >
        {readMore}
        <span aria-hidden="true" className="tw:transition tw:group-hover:translate-x-1">
          →
        </span>
      </Link>
    </div>
  </article>
)

export default NewsCard
