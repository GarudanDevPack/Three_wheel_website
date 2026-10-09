import { cache } from 'react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { getPayloadClient } from './payload'
import type { AppLocale } from '@/i18n/routing'

export type NewsItem = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  publishedDate: string
  cover: { url: string; alt?: string | null } | null
  sourceName: string | null
  sourceUrl: string | null
  seoTitle: string | null
  seoDescription: string | null
  body: SerializedEditorState | null
  /** Plain-text body used by the built-in fallback articles (CMS articles use `body`). */
  paragraphs?: string[]
  sources?: Array<{ label: string; url: string }>
  /** Optional on-site link shown under the article, e.g. to the warranty page. */
  related?: { label: string; href: string }
}

/**
 * Shown until the CMS has published news — same idea as the vehicle placeholders.
 * Neptune facts come from the User Manual & Service Book; outside facts are cited in `sources`.
 */
export const fallbackNews: NewsItem[] = [
  {
    id: 'fallback-ev-running-costs',
    slug: 'electric-three-wheeler-running-costs-sri-lanka',
    title: 'Fuel prices up again: what an electric three-wheeler really costs to run in Sri Lanka',
    excerpt:
      'Another fuel price hike has squeezed three-wheeler drivers, while fares stay unchanged. Here is how to work out what an electric three-wheeler costs per kilometre — using your own electricity tariff.',
    publishedDate: '2026-10-06T00:00:00.000Z',
    cover: { url: '/images/auto/neptune-blue-2.png', alt: 'Neptune electric three-wheeler in blue' },
    sourceName: null,
    sourceUrl: null,
    seoTitle: 'Electric Three Wheeler Running Cost in Sri Lanka (2026 Guide)',
    seoDescription:
      'Fuel prices keep rising. See how to calculate the per-km running cost of an electric three-wheeler in Sri Lanka, with real range and charging figures.',
    body: null,
    paragraphs: [
      'When fuel prices rose again in mid-2026, the All-Island Three-Wheeler Drivers’ and Owners’ Association announced that fares would stay unchanged. For drivers that means one thing: every rupee of the increase comes straight out of their daily income.',
      'That is why more owners are asking a simple question — what does an electric three-wheeler actually cost to run? The honest answer depends on your electricity tariff, but the maths is easy to do yourself.',
      'Start with the battery. The Neptune Electric Three Wheeler carries a 20 kWh LiFePO4 battery and is rated for 250–300 km per full charge. Divide one by the other and you get roughly 0.07–0.08 kWh of electricity per kilometre. Multiply that by the per-unit rate on your electricity bill and you have your energy cost per kilometre — then compare it with your current fuel spend for the same distance.',
      'Charging does not need special infrastructure. Neptune uses an on-board charger with a 32 A AC socket that runs on a standard, properly earthed 220–240 V household supply. A normal charge from 20% to 100% takes about 6 hours, so most drivers simply charge overnight at home.',
      'Running costs are not only about energy. An electric drivetrain has no engine oil, spark plugs or clutch to replace. Neptune’s maintenance schedule focuses on checks — tyre pressure weekly, brakes monthly, motor and wiring connections every six months — plus scheduled services at an authorised Garudan service dealer.',
      'Before you switch, compare like with like: your daily distance, where you will charge, and the total cost of ownership over several years, not just the purchase price. Our team can help you run the numbers for your own routes.',
    ],
    sources: [
      {
        label: 'Newsfirst — Three-wheeler fares to remain unchanged despite fuel price hike',
        url: 'https://english.newsfirst.lk/2026/05/31/three-wheeler-fares-to-remain-unchanged-despite-fuel-price-hike',
      },
    ],
  },
  {
    id: 'fallback-e-tuk-transition',
    slug: 'sri-lanka-electric-three-wheeler-transition',
    title: '1.2 million tuk-tuks going electric: what Sri Lanka’s e-three-wheeler push means for drivers',
    excerpt:
      'A Ministry of Transport and UNDP pilot shows electric three-wheelers can cut fuel and maintenance costs. What the shift means for the drivers behind Sri Lanka’s 1.2 million tuk-tuks.',
    publishedDate: '2026-10-03T00:00:00.000Z',
    cover: { url: '/images/auto/green-1.png', alt: 'Green Neptune electric three-wheeler' },
    sourceName: null,
    sourceUrl: null,
    seoTitle: 'Electric Tuk Tuk Sri Lanka: The E-Three-Wheeler Transition Explained',
    seoDescription:
      'Sri Lanka has over 1.2 million three-wheelers. Learn what the UNDP and Ministry of Transport electric three-wheeler pilot means for drivers and owners.',
    body: null,
    paragraphs: [
      'Sri Lanka has more than 1.2 million three-wheelers — for many families, the tuk-tuk is both transport and livelihood. Almost all of them run on imported fuel, which exposes drivers to every swing in global oil prices.',
      'A pilot run by the Ministry of Transport with the United Nations Development Programme (UNDP) tested converting petrol three-wheelers to electric. Its findings point the same way as drivers’ own experience: electric three-wheelers reduce fuel and maintenance costs, cut emissions and improve air quality in busy towns.',
      'For drivers, the practical questions are range, charging and battery life. Range decides whether one charge covers a working day; charging decides whether you depend on public chargers; battery life decides what the vehicle is worth in five years.',
      'Factory-built electric three-wheelers answer those questions by design. The Neptune Electric Three Wheeler is rated for 250–300 km per charge, charges from a household socket in around 6 hours, and uses a LiFePO4 battery — a chemistry known for long cycle life and thermal stability. The motor and battery are IP67 rated against dust and water.',
      'Battery confidence matters most, which is why the Neptune battery pack carries a 5-year manufacturer’s warranty with unlimited mileage, alongside a 24-month / 50,000 km vehicle warranty.',
      'The transition will not happen overnight, but the direction is clear. Drivers who understand the numbers today will be best placed to benefit as charging access and support for electric mobility grow.',
    ],
    sources: [
      {
        label: 'UNDP Sri Lanka — Accelerating the Transition to Electric Three-Wheelers in Sri Lanka',
        url: 'https://www.undp.org/srilanka/publications/accelerating-transition-electric-three-wheelers-sri-lanka',
      },
      {
        label: 'The Island — Sri Lanka’s 1.2 million ‘Tuks’ to undergo ‘e-Wheel’ revolution',
        url: 'https://island.lk/sri-lankas-1-2-million-tuks-to-undergo-e-wheel-revolution-2/',
      },
    ],
  },
  {
    id: 'fallback-new-rules',
    slug: 'three-wheeler-rules-driver-registration-tyre-standards',
    title: 'New rules for three-wheeler owners: driver registration and 2027 tyre standards explained',
    excerpt:
      'The NTC (Amendment) Act requires every three-wheeler driver to be registered, and new tyre standards apply to imports from 1 January 2027. What owners need to know — and how to stay road-ready.',
    publishedDate: '2026-09-29T00:00:00.000Z',
    cover: { url: '/images/auto/gallery-3.png', alt: 'Neptune three-wheeler on the road' },
    sourceName: null,
    sourceUrl: null,
    seoTitle: 'Three Wheeler Regulations Sri Lanka 2026: Driver Registration & Tyre Standards',
    seoDescription:
      'Understand the NTC driver registration requirement and the new tyre import standards from January 2027 — plus a simple checklist to keep your three-wheeler compliant.',
    body: null,
    paragraphs: [
      'Two regulatory changes are reshaping the three-wheeler sector, and both affect everyday owners and drivers.',
      'First, the National Transport Commission (Amendment) Act No. 8 of 2025 introduces driver registration. Every driver will need to be registered, with their details accessible to the regulator. The aim is to reduce anonymity and raise accountability and passenger safety — good news for drivers who run professional, reliable services.',
      'Second, new Sri Lankan standards have been made compulsory for passenger car and three-wheeler tyres imported into the country. They apply to tyres arriving at any port or airport on or after 1 January 2027, so replacement tyres on the market will need to meet the new standard.',
      'For owners, the best response is simple maintenance discipline. The Neptune Electric Three Wheeler runs on 4.00-12 tube-type tyres; the recommended pressure is 30 psi front and 35 psi rear, checked weekly. Repair punctures by vulcanising or patching rather than liquid sealant, and replace any tyre with bulges, cuts or visible damage.',
      'Keeping your service record complete matters too. Neptune’s service schedule starts at 1,000 km (or 60 days), then 2,500 km, 5,000 km and every 2,500 km after that — and warranty claims depend on stamped service coupons from an authorised Garudan service dealer.',
      'See our Warranty & Service Terms page for the full schedule and conditions, or download the User Manual & Service Book.',
    ],
    related: { label: 'Warranty & Service Terms', href: '/warranty' },
    sources: [
      {
        label: 'The Morning — Taming the three-wheeler beast',
        url: 'https://www.themorning.lk/articles/bN624FVpoRZrVkVKUbsQ',
      },
      {
        label: 'Sri Lanka Mirror — New standards for imported motor car & trishaw tyres',
        url: 'https://srilankamirror.com/news/new-standards-for-imported-motor-car-and-three-wheeler-tyres/',
      },
    ],
  },
]

type NewsDoc = {
  id: string | number
  slug: string
  title: string
  excerpt?: string | null
  publishedDate: string
  coverImage?: { url?: string | null; alt?: string | null } | null
  source?: { name?: string | null; url?: string | null } | null
  seo?: { metaTitle?: string | null; metaDescription?: string | null } | null
  body?: SerializedEditorState | null
}

const toItem = (doc: NewsDoc): NewsItem => ({
  id: String(doc.id),
  slug: doc.slug,
  title: doc.title,
  excerpt: doc.excerpt || null,
  publishedDate: doc.publishedDate,
  cover: doc.coverImage?.url ? { url: doc.coverImage.url, alt: doc.coverImage.alt } : null,
  sourceName: doc.source?.name || null,
  sourceUrl: doc.source?.url || null,
  seoTitle: doc.seo?.metaTitle || null,
  seoDescription: doc.seo?.metaDescription || null,
  body: doc.body || null,
})

const published = { _status: { equals: 'published' } } as const

export const getNewsList = cache(async (locale: AppLocale, limit = 50): Promise<NewsItem[]> => {
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'news',
      where: published,
      sort: '-publishedDate',
      limit,
      depth: 1,
      locale,
    })
    if (docs.length) return (docs as unknown as NewsDoc[]).map(toItem)
  } catch {
    // Payload/database not configured yet — fall back to the built-in articles.
  }
  return fallbackNews.slice(0, limit)
})

export const getNewsBySlug = cache(async (locale: AppLocale, slug: string): Promise<NewsItem | null> => {
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'news',
      where: { and: [published, { slug: { equals: slug } }] },
      limit: 1,
      depth: 1,
      locale,
    })
    const doc = (docs as unknown as NewsDoc[])[0]
    if (doc) return toItem(doc)
  } catch {
    // Payload/database not configured yet — fall back to the built-in articles.
  }
  return fallbackNews.find((item) => item.slug === slug) || null
})
