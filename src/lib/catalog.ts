import type { AppLocale } from '@/i18n/routing'
import type { Specs, Charging } from './specs'

/**
 * Single source of truth for the Neptune lineup while there is no database.
 * Every figure comes from the client: the User Manual & Service Book (passenger specs),
 * the Long Range and EV Cargo posters, and the Cargo spec sheet. Admin/DB data overrides it.
 */

export type CatalogStatus = 'Available' | 'Upcoming'

export type CatalogColor = {
  colorName: string
  swatchHex: string
  video?: string | null
  image?: { url: string; alt: string } | null
}

export type CatalogModel = {
  slug: string
  name: string
  category: 'Passenger' | 'Cargo'
  status: CatalogStatus
  isNew?: boolean
  /** Short label used on chips and cards, e.g. "300km" or "Cargo". */
  modelRange: string
  rangeKm: number | null
  /** Honest range wording shown wherever the range is quoted. */
  rangeNote: string
  price: number | null
  originalPrice?: number | null
  offerLabel?: string | null
  downPayment?: number | null
  priceNote?: string | null
  /** Estimated monthly petrol saving vs a petrol three-wheeler (client figure). */
  monthlySaving?: number | null
  heroImage: { url: string; alt: string } | null
  /** Full-bleed studio photo for the home pricing card; falls back to `heroImage` (shown contained). */
  pricingImage?: { url: string; alt: string } | null
  heroStats: Partial<Record<'range' | 'topSpeed' | 'peakPower' | 'gradeability', { value: number; unit: string }>>
  keyFacts: Array<{ label: string; value: string }>
  features: string[]
  specs: Specs | null
  charging: Charging
  colors: CatalogColor[]
  warranty: { vehicle: string; battery: string } | null
  faqs: Array<{ question: string; answer: string }>
  seo: { title: string; description: string; h1: string; intro: string; bestFor: string }
}

export const WARRANTY = { vehicle: '2 years / 50,000 km', battery: '5 years, unlimited km' }

/** Client campaign figures used across the site (running cost, finance offer). */
export const RUNNING_COST = { monthlyElectricity: 12_000, monthlyKm: 5_500 }
// TODO(client): offer validity date and full eligibility wording — not shown until supplied.
export const GARUDAN_ZERO_FINANCE = { maxLoan: 1_000_000, monthly: 20_000, months: 50, families: 200 }

const passengerSpecs: Specs = {
  motor: { motorType: 'PMS motor, 60 V', ratedPower: '5 kW', maxPower: '10 kW', driveModes: 'Eco, Power, Climb' },
  battery: { capacity: '20 kWh LiFePO4 (64 V)', waterResistance: 'IP67 (motor and battery)' },
  comfort: { driverSeat: 'Adjustable driver seat', passengerSeat: 'Driver + 3 passengers', instrumentCluster: 'Digital display' },
  transmission: { type: 'Fixed gear' },
  chassis: { type: 'Ladder frame' },
  suspension: { frontRear: 'Double-arm shocks / leaf spring' },
  brakes: { frontRear: 'Hydraulic drum brakes, hand brake', regenerativeBraking: 'Yes, with hill hold' },
  tyres: { rimSize: 'Iron wheel', tyreSize: '4.00-12 tube type (30 / 35 psi)' },
  electricals: { headLamp: 'LED', tailLamp: 'LED', turnSignal: 'LED' },
  dimensions: {
    groundClearance: '130 mm',
    kerbWeight: '480 kg',
    overallHeight: '1700 mm',
    overallLength: '2780 mm',
    overallWidth: '1275 mm',
    wheelbase: '2100 mm',
  },
  gradeability: '27.8%',
}

const passengerCharging: Charging = {
  chargerRating: 'On-board charger, 32 A AC socket (220–240 V home supply)',
  chargingTime: 'About 6 h (20% → 100%); slow charge about 12 h',
  rangePerCharge: '250–300 km (depends on load and speed)',
}

const faqWarranty = {
  question: 'What warranty do I get?',
  answer: `The vehicle is covered for ${WARRANTY.vehicle} (whichever comes first) and the LiFePO4 battery for ${WARRANTY.battery}. Servicing at authorised Garudan service dealers keeps the warranty valid.`,
}

export const catalog: CatalogModel[] = [
  {
    slug: 'neptune-300-km',
    name: 'Neptune Long Range 300 km',
    category: 'Passenger',
    status: 'Available',
    modelRange: '300km',
    rangeKm: 300,
    rangeNote: 'Up to 300 km per charge (250–300 km depending on load and speed)',
    price: 2_675_000,
    downPayment: 605_000,
    priceNote: 'Including VAT',
    monthlySaving: 100_000,
    heroImage: { url: '/images/auto/neptune-blue-1.webp', alt: 'Neptune Long Range 300 km electric three-wheeler in blue' },
    pricingImage: {
      url: '/images/auto/neptune-300km-studio-blue.webp',
      alt: 'Neptune Long Range 300 km electric three-wheeler in light blue, studio view',
    },
    heroStats: {
      range: { value: 300, unit: 'km' },
      topSpeed: { value: 60, unit: 'km/h' },
      peakPower: { value: 10, unit: 'kW' },
      gradeability: { value: 27.8, unit: '%' },
    },
    keyFacts: [
      { label: 'Range', value: 'Up to 300 km' },
      { label: 'Top speed', value: '60 km/h' },
      { label: 'Battery', value: '20 kWh LiFePO4' },
      { label: 'Charging', value: 'About 6 h at home' },
      { label: 'Seats', value: 'Driver + 3' },
      { label: 'Payload', value: '320 kg' },
    ],
    features: [
      'Adjustable driver seat',
      'Open-sided passenger cabin for easy boarding',
      'Regenerative braking with hill hold',
      'IP67 motor and battery',
      'Fire extinguisher and emergency BMS cut-off',
      'LED lighting and digital instrument cluster',
    ],
    specs: passengerSpecs,
    charging: passengerCharging,
    colors: [
      { colorName: 'Neptune Blue', swatchHex: '#6B9BC3', video: '/videos/color-blue.mp4', image: { url: '/images/auto/neptune-blue-2.webp', alt: 'Neptune 300 km in Neptune Blue' } },
      { colorName: 'Forest Green', swatchHex: '#2E5E3A', video: '/videos/color-green.mp4', image: { url: '/images/auto/green-1.webp', alt: 'Neptune 300 km in Forest Green' } },
      { colorName: 'Stealth Black', swatchHex: '#1a1a1a', video: '/videos/color-black.mp4', image: { url: '/images/auto/neptune-black-cutout.webp', alt: 'Neptune 300 km in Stealth Black' } },
    ],
    warranty: WARRANTY,
    faqs: [
      {
        question: 'How far does the Neptune 300 km go on one charge?',
        answer: 'Up to 300 km on a full charge. Real range is usually 250–300 km and depends on load, speed, road and weather.',
      },
      {
        question: 'How long does it take to charge?',
        answer: 'About 6 hours from 20% to 100% using the on-board charger and a properly earthed 220–240 V home socket, so an overnight charge covers a full working day.',
      },
      {
        question: 'How much is the down payment?',
        answer: 'The Long Range 300 km costs Rs. 2,675,000 including VAT, with a down payment of Rs. 605,000. Use the finance calculator or ask about the Garudan interest-free plan.',
      },
      faqWarranty,
    ],
    seo: {
      title: 'Neptune 300 km Long-Range Electric Tuk Tuk | Sri Lanka',
      description: 'Neptune 300 km long-range electric three-wheeler for hire, tourism and intercity work. Rs. 2,675,000 incl. VAT, Rs. 605,000 down. Book a test drive.',
      h1: 'Neptune 300 km: our longest-range electric three-wheeler',
      intro:
        'The Neptune Long Range 300 km is an electric three-wheeler built for full working days in Sri Lanka: up to 300 km on a charge, about 6 hours to charge at home, a 20 kWh LiFePO4 battery with a 5-year warranty, and seating for the driver plus three passengers.',
      bestFor: 'Full-day hire, tourism and tour operators, intercity routes and high-mileage fleets.',
    },
  },
  {
    slug: 'neptune-ev-cargo',
    name: 'Neptune EV Cargo',
    category: 'Cargo',
    status: 'Available',
    isNew: true,
    modelRange: 'Cargo',
    rangeKm: 100,
    rangeNote: 'About 100 km on battery (depends on load and speed); up to 350 km with the 620 W rooftop solar system',
    price: 1_775_000,
    originalPrice: 2_775_000,
    offerLabel: 'Limited-time offer',
    priceNote: null,
    heroImage: { url: '/images/auto/neptune-ev-cargo-front.webp', alt: 'Neptune EV Cargo electric three-wheeler, yellow, front view' },
    heroStats: {
      range: { value: 100, unit: 'km' },
      peakPower: { value: 5, unit: 'kW' },
    },
    keyFacts: [
      { label: 'Range', value: 'About 100 km on battery' },
      { label: 'With solar', value: 'Up to 350 km' },
      { label: 'Battery', value: '20 kWh' },
      { label: 'Motor', value: '5 kW rated' },
      { label: 'Payload', value: 'Up to 500 kg' },
      { label: 'Gearbox', value: 'Fully automatic' },
    ],
    features: [
      'Heavy-duty steel cargo box with rear double doors',
      'Optional 620 W rooftop solar system (Rs. 150,000), about 50 km a day free',
      'Fully automatic gearbox',
      'Up to 500 kg payload',
      'Made in Sri Lanka',
    ],
    specs: {
      motor: { ratedPower: '5 kW' },
      battery: { capacity: '20 kWh' },
      transmission: { type: 'Fully automatic gearbox' },
    },
    charging: {
      rangePerCharge: 'About 100 km on battery (depends on load and speed); up to 350 km with 620 W rooftop solar',
    },
    colors: [{ colorName: 'Sunshine Yellow', swatchHex: '#F5C400', image: { url: '/images/auto/neptune-ev-cargo-front.webp', alt: 'Neptune EV Cargo in yellow, front view' } }],
    warranty: WARRANTY,
    faqs: [
      {
        question: 'How far does the Neptune EV Cargo go?',
        answer: 'About 100 km on battery alone; real range depends on load and speed. With the optional 620 W rooftop solar system, total range rises to up to 350 km, with about 50 km a day from the sun.',
      },
      {
        question: 'How much can it carry?',
        answer: 'Up to 500 kg in a heavy-duty, lockable steel cargo box with rear double doors.',
      },
      {
        question: 'What is the price?',
        answer: 'Rs. 2,775,000 with a limited-time Rs. 1,000,000 discount, so the offer price is Rs. 1,775,000. The rooftop solar system is Rs. 150,000.',
      },
      faqWarranty,
    ],
    seo: {
      title: 'Neptune EV Cargo | Electric Cargo Three-Wheeler Sri Lanka',
      description: 'Neptune EV Cargo: 500 kg payload, heavy-duty box, 20 kWh battery, rooftop solar option. Now Rs. 1,775,000 (save Rs. 1,000,000). Enquire today.',
      h1: 'Neptune EV Cargo: the electric three-wheeler built for deliveries',
      intro:
        'The Neptune EV Cargo is an electric cargo three-wheeler made in Sri Lanka for delivery and small-business work: a heavy-duty box carrying up to 500 kg, a 20 kWh battery, a fully automatic gearbox and an optional 620 W rooftop solar system.',
      bestFor: 'Delivery rounds, shop and farm-to-town transport, and small businesses moving goods every day.',
    },
  },
  ...(['200', '120'] as const).map<CatalogModel>((km) => ({
    slug: `neptune-${km}-km`,
    name: `Neptune ${km} km`,
    category: 'Passenger',
    status: 'Upcoming',
    modelRange: `${km}km`,
    rangeKm: null,
    rangeNote: 'Specifications coming soon',
    price: null,
    heroImage: null,
    heroStats: {},
    keyFacts: [],
    features: [],
    specs: null,
    charging: null,
    colors: [],
    warranty: null,
    faqs: [],
    seo: {
      title: `Neptune ${km} km Electric Three-Wheeler | Coming Soon`,
      description: `The Neptune ${km} km electric three-wheeler is coming soon to Sri Lanka. Register your interest for launch news.`,
      h1: `Neptune ${km} km: coming soon`,
      intro: `The Neptune ${km} km electric three-wheeler is in development. Register your interest and we'll let you know when it launches.`,
      bestFor: km === '200' ? 'Full-day hire and suburban routes.' : 'City hires and short routes.',
    },
  })),
]

export const availableModels = catalog.filter((model) => model.status === 'Available')

/** Languages the catalog model copy is written in (only English so far; si/ta pages are noindex). */
export const catalogModelLocales: readonly AppLocale[] = ['en']
export const getCatalogModel = (slug: string) => catalog.find((model) => model.slug === slug) || null

/** Catalog model → the shape `VehicleCard` renders (used while there is no database). */
export const toVehicleCard = (model: CatalogModel) => ({
  id: `catalog-${model.slug}`,
  slug: model.slug,
  name: model.name,
  shortDescription: model.seo.bestFor,
  category: model.category,
  fuelType: ['Electric'],
  heroImage: model.heroImage,
  pricing: { price: model.price, showPrice: model.price !== null },
})
