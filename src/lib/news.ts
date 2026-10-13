import { cache } from 'react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { getPayloadClient } from './payload'
import { routing, type AppLocale } from '@/i18n/routing'

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
  /** Topic chip shown on cards (translated via News.categories.*). */
  category?: 'offer' | 'launch' | 'guide' | 'notice' | 'industry' | null
  /** Sinhala / Tamil versions of the built-in articles (CMS articles are localised in the admin). */
  translations?: Partial<Record<'si' | 'ta', NewsTranslation>>
}

type NewsTranslation = {
  title: string
  excerpt: string
  paragraphs: string[]
  related?: { label: string; href: string }
}

/** Swap in the Sinhala / Tamil text of a built-in article when it exists. */
const localize = (item: NewsItem, locale: AppLocale): NewsItem => {
  const translation = locale === 'en' ? undefined : item.translations?.[locale]
  if (!translation) return item
  return {
    ...item,
    title: translation.title,
    excerpt: translation.excerpt,
    paragraphs: translation.paragraphs,
    related: translation.related ?? item.related,
    seoTitle: null,
    seoDescription: translation.excerpt,
  }
}

const byNewest = (a: NewsItem, b: NewsItem) => b.publishedDate.localeCompare(a.publishedDate)

const FINANCE_SLUG = 'garudan-interest-free-financing-neptune-ev'
const CARGO_SLUG = 'neptune-ev-cargo-new-arrival-offer'
const RUNNING_SLUG = 'charge-while-you-sleep-running-cost'
const PRICE_SLUG = 'neptune-ev-price-notice-raw-material-costs'

const CARGO_MODE_SLUG = 'neptune-cargo-mode-passenger-and-delivery'
const SOLAR_SLUG = 'solar-powered-electric-tuk-tuk-rooftop-charging'

/** Client campaign announcements (October 2026). Figures exactly as supplied by Garudan. */
const campaignNews: NewsItem[] = [
  {
    id: 'news-cargo-mode',
    category: 'launch',
    slug: CARGO_MODE_SLUG,
    title: 'Neptune Cargo Mode: one electric three-wheeler for passengers and deliveries',
    excerpt:
      'Neptune launches Cargo Mode: fold the rear seats and the same electric three-wheeler becomes a secure goods carrier, so drivers can earn from hires and deliveries with one vehicle.',
    publishedDate: '2026-10-12T10:00:00.000Z',
    cover: { url: '/images/auto/neptune-blue-2.webp', alt: 'Neptune electric three-wheeler that switches between passenger and cargo mode' },
    sourceName: null,
    sourceUrl: null,
    seoTitle: 'Cargo Electric Tuk Tuk: Neptune Cargo Mode',
    seoDescription:
      'Neptune Cargo Mode turns the electric three-wheeler from passenger hire to deliveries in moments. Earn from both with one EV in Sri Lanka.',
    body: null,
    paragraphs: [
      'Small-business deliveries are one of the fastest-growing ways to earn with a three-wheeler in Sri Lanka, from shop orders to online-store parcels. Many drivers want to carry passengers in the morning and goods in the afternoon without owning two vehicles.',
      'Neptune Cargo Mode is built for exactly that. Fold the rear seats back and the cabin becomes a secure, flat load area in moments; put them up again and you have a comfortable passenger seat with plenty of legroom.',
      'The vehicle underneath stays the same Neptune Long Range: up to 300 km per charge (250–300 km depending on load and speed), a 20 kWh LiFePO4 battery with a 5-year warranty, and a rated payload of 320 kg.',
      'Because it is electric, every extra delivery round costs very little: Garudan’s figures put running costs at about Rs. 12,000 of electricity for around 5,500 km a month, with no engine oil, grease or clutch cables to pay for.',
      'For businesses that move heavier loads every day, the dedicated Neptune EV Cargo with its heavy-duty box carries up to 500 kg. Book a test drive to see which one fits your work.',
    ],
    related: { label: 'See the Neptune Long Range', href: '/vehicles/neptune-300-km' },
    translations: {
      si: {
        title: 'Neptune Cargo Mode: මගීන් සහ භාණ්ඩ බෙදාහැරීම සඳහා එකම විදුලි ත්‍රිරෝද රථය',
        excerpt:
          'Neptune Cargo Mode හඳුන්වා දෙයි: පසුපස ආසන නැවීමෙන් එම විදුලි ත්‍රිරෝද රථයම ආරක්ෂිත භාණ්ඩ ප්‍රවාහන රථයක් බවට පත් වේ — එක් රථයකින් කුලී සහ බෙදාහැරීම් දෙකෙන්ම ආදායම.',
        paragraphs: [
          'උදෑසන මගීන් සහ දහවල් භාණ්ඩ රැගෙන යාමට රථ දෙකක් අවශ්‍ය නැත. Neptune Cargo Mode එය පහසු කරයි.',
          'පසුපස ආසන පසුපසට නැවූ විට කැබිනය මොහොතකින් ආරක්ෂිත, සමතල භාණ්ඩ ප්‍රදේශයක් බවට පත් වේ; නැවත ඉහළට ගත් විට මගීන් සඳහා සුවපහසු ආසනයක් ලැබේ.',
          'එය එම Neptune Long Range රථයමයි: ආරෝපණයකට කි.මී. 300 දක්වා (බර සහ වේගය අනුව කි.මී. 250–300), වසර 5 වගකීම සහිත 20 kWh LiFePO4 බැටරිය සහ කි.ග්‍රෑ. 320 බර ධාරිතාව.',
          'Garudan සංඛ්‍යාවලට අනුව මසකට කි.මී. 5,500 ක් පමණ සඳහා විදුලි වියදම රු. 12,000 ක් පමණි; එන්ජින් ඔයිල්, ග්‍රීස් හෝ ක්ලච් කේබල් වියදම් නැත.',
          'දිනපතා බර භාණ්ඩ ප්‍රවාහනය සඳහා කි.ග්‍රෑ. 500 දරන Neptune EV Cargo ද ඇත. ඔබට ගැළපෙන්නේ කුමක්දැයි බැලීමට පරීක්ෂණ ධාවනයක් වෙන්කරන්න.',
        ],
        related: { label: 'Neptune Long Range බලන්න', href: '/vehicles/neptune-300-km' },
      },
      ta: {
        title: 'Neptune Cargo Mode: பயணிகளுக்கும் டெலிவரிக்கும் ஒரே மின்சார முச்சக்கர வண்டி',
        excerpt:
          'Neptune Cargo Mode அறிமுகம்: பின் இருக்கைகளை மடித்தால் அதே மின்சார முச்சக்கர வண்டி பாதுகாப்பான சரக்கு வாகனமாகிறது — ஒரே வாகனத்தில் வாடகை மற்றும் டெலிவரி வருமானம்.',
        paragraphs: [
          'காலையில் பயணிகள், மதியம் சரக்குகள் — இரண்டு வாகனங்கள் தேவையில்லை. Neptune Cargo Mode அதை எளிதாக்குகிறது.',
          'பின் இருக்கைகளைப் பின்னால் மடித்தால் கேபின் சில நொடிகளில் பாதுகாப்பான, தட்டையான சரக்குப் பகுதியாக மாறும்; மீண்டும் உயர்த்தினால் பயணிகளுக்கு வசதியான இருக்கை.',
          'அதே Neptune Long Range: ஒரு சார்ஜில் 300 கி.மீ. வரை (சுமை, வேகத்தைப் பொறுத்து 250–300 கி.மீ.), 5 ஆண்டு உத்தரவாதத்துடன் 20 kWh LiFePO4 பேட்டரி, 320 கி.கி. சுமை திறன்.',
          'Garudan புள்ளிவிவரங்களின்படி மாதம் சுமார் 5,500 கி.மீ.க்கு மின்செலவு சுமார் ரூ. 12,000 மட்டுமே; எஞ்சின் ஆயில், கிரீஸ், கிளட்ச் கேபிள் செலவுகள் இல்லை.',
          'தினமும் அதிக சுமை ஏற்றுபவர்களுக்கு 500 கி.கி. சுமக்கும் Neptune EV Cargo-வும் உண்டு. உங்களுக்கு ஏற்றதைத் தெரிந்துகொள்ள சோதனை ஓட்டம் பதிவு செய்யுங்கள்.',
        ],
        related: { label: 'Neptune Long Range பாருங்கள்', href: '/vehicles/neptune-300-km' },
      },
    },
  },
  {
    id: 'news-solar-roof',
    category: 'guide',
    slug: SOLAR_SLUG,
    title: 'Solar-powered tuk tuks: how a 620 W roof adds about 50 km a day',
    excerpt:
      'The Neptune EV Cargo offers an optional 620 W rooftop solar system that adds about 50 km of free driving a day. Here is what solar charging can and can’t do for an electric three-wheeler.',
    publishedDate: '2026-10-12T08:00:00.000Z',
    cover: { url: '/images/auto/neptune-ev-cargo-front.webp', alt: 'Neptune EV Cargo electric three-wheeler, available with a rooftop solar panel' },
    sourceName: null,
    sourceUrl: null,
    seoTitle: 'Solar Three-Wheeler Sri Lanka: Rooftop Charging',
    seoDescription:
      'How the Neptune EV Cargo’s 620 W rooftop solar system adds about 50 km of free driving a day, and what solar charging means for running costs.',
    body: null,
    paragraphs: [
      'Sri Lanka gets strong sunshine for most of the year, and researchers have been studying how photovoltaic (PV) panels can help charge electric three-wheelers and cut grid electricity use.',
      'Neptune puts that idea on the road. The Neptune EV Cargo offers an optional 620 W rooftop solar system (Rs. 150,000) that, by Garudan’s figures, adds about 50 km of driving a day straight from the sun.',
      'To be clear about the numbers: the EV Cargo’s 20 kWh battery gives about 100 km on its own, depending on load and speed. With the rooftop solar system, total range rises to up to 350 km over a working cycle. Solar tops up the battery while you drive and park; it does not replace overnight charging.',
      'For delivery businesses that spend long hours outside, those free daily kilometres add up to real savings on top of already-low electricity costs.',
      'The EV Cargo also carries up to 500 kg in a heavy-duty box, uses a fully automatic gearbox and is made in Sri Lanka, with a limited-time offer price of Rs. 1,775,000.',
    ],
    sources: [
      {
        label: 'SLIIT — Research on PV-assisted charging for electric three-wheelers (2026)',
        url: 'https://rda.sliit.lk/entities/publication/c4f7eb50-a386-469a-aba9-66651d1288ed/full',
      },
    ],
    related: { label: 'See the Neptune EV Cargo', href: '/vehicles/neptune-ev-cargo' },
    translations: {
      si: {
        title: 'සූර්ය බලයෙන් ත්‍රිරෝද රථ: 620 W සූර්ය පැනලයකින් දිනකට කි.මී. 50 ක් පමණ',
        excerpt:
          'Neptune EV Cargo සඳහා විකල්ප 620 W සූර්ය පද්ධතියක් ඇත; එය දිනකට කි.මී. 50 ක් පමණ නොමිලේ ධාවනය එක් කරයි. සූර්ය ආරෝපණයෙන් කළ හැකි සහ කළ නොහැකි දේ මෙන්න.',
        paragraphs: [
          'ශ්‍රී ලංකාවට වසර පුරාම ප්‍රබල හිරු එළිය ලැබෙන අතර, විදුලි ත්‍රිරෝද රථ ආරෝපණයට සූර්ය පැනල භාවිතය ගැන පර්යේෂකයන් අධ්‍යයනය කරමින් සිටී.',
          'Neptune EV Cargo සඳහා විකල්ප 620 W සූර්ය පද්ධතියක් (රු. 150,000) ඇති අතර, Garudan සංඛ්‍යාවලට අනුව එය දිනකට කි.මී. 50 ක් පමණ ධාවනය සූර්යයාගෙන් එක් කරයි.',
          'සංඛ්‍යා පැහැදිලිව: EV Cargo හි 20 kWh බැටරිය පමණක් බර සහ වේගය අනුව කි.මී. 100 ක් පමණ ලබාදෙයි. සූර්ය පද්ධතිය සමඟ මුළු ධාවන දුර කි.මී. 350 දක්වා ඉහළ යයි. සූර්ය ආරෝපණය රාත්‍රී ආරෝපණය වෙනුවට නොවේ.',
          'EV Cargo කි.ග්‍රෑ. 500 දක්වා දරන අතර, සම්පූර්ණ ස්වයංක්‍රීය ගියර් පද්ධතියක් ඇති අතර ශ්‍රී ලංකාවේ නිපදවා ඇත; සීමිත කාල දීමනා මිල රු. 1,775,000.',
        ],
        related: { label: 'Neptune EV Cargo බලන්න', href: '/vehicles/neptune-ev-cargo' },
      },
      ta: {
        title: 'சோலார் முச்சக்கர வண்டிகள்: 620 W கூரை தினமும் சுமார் 50 கி.மீ. சேர்க்கிறது',
        excerpt:
          'Neptune EV Cargo-வில் விருப்ப 620 W சோலார் கூரை அமைப்பு தினமும் சுமார் 50 கி.மீ. இலவச ஓட்டத்தைச் சேர்க்கிறது. சோலார் சார்ஜிங் என்ன செய்யும், என்ன செய்யாது என்பது இதோ.',
        paragraphs: [
          'இலங்கைக்கு ஆண்டு முழுவதும் வலுவான சூரிய ஒளி கிடைக்கிறது; மின்சார முச்சக்கர வண்டிகளை சார்ஜ் செய்ய சோலார் பேனல்களைப் பயன்படுத்துவது குறித்து ஆய்வாளர்கள் ஆராய்ந்து வருகின்றனர்.',
          'Neptune EV Cargo-வில் விருப்ப 620 W சோலார் அமைப்பு (ரூ. 150,000) உண்டு; Garudan புள்ளிவிவரங்களின்படி அது சூரியனிடமிருந்து தினமும் சுமார் 50 கி.மீ. ஓட்டத்தைச் சேர்க்கிறது.',
          'தெளிவாகச் சொன்னால்: EV Cargo-வின் 20 kWh பேட்டரி மட்டும் சுமை, வேகத்தைப் பொறுத்து சுமார் 100 கி.மீ. தரும். சோலாருடன் மொத்த ஓட்டம் 350 கி.மீ. வரை உயரும். சோலார் இரவு சார்ஜிங்கிற்கு மாற்று அல்ல.',
          'EV Cargo 500 கி.கி. வரை சுமக்கும், முழு தானியங்கி கியர்பாக்ஸ் கொண்டது, இலங்கையில் தயாரிக்கப்பட்டது; குறுகிய கால சலுகை விலை ரூ. 1,775,000.',
        ],
        related: { label: 'Neptune EV Cargo பாருங்கள்', href: '/vehicles/neptune-ev-cargo' },
      },
    },
  },
  {
    id: 'news-garudan-zero-finance',
    category: 'offer',
    slug: FINANCE_SLUG,
    title: 'Interest-free financing of up to Rs. 1 million for a Neptune electric three-wheeler',
    excerpt:
      'A special offer you won’t find elsewhere in Sri Lanka: Garudan offers interest-free financing of up to Rs. 1,000,000, paid back at Rs. 20,000 a month over 50 months. Limited to the first 200 families.',
    publishedDate: '2026-10-12T00:00:00.000Z',
    cover: { url: '/images/news/neptune-long-range-poster.webp', alt: 'Neptune Long Range electric three-wheeler offer poster' },
    sourceName: null,
    sourceUrl: null,
    seoTitle: 'Interest-Free Electric Tuk Tuk Loan, Sri Lanka',
    seoDescription:
      'Garudan interest-free financing up to Rs. 1,000,000 for a Neptune electric three-wheeler: Rs. 20,000 a month for 50 months. First 200 families.',
    body: null,
    paragraphs: [
      'Garudan (Pvt) Ltd, the maker of Neptune electric three-wheelers, is offering a financing plan that no other company in Sri Lanka provides: interest-free financing of up to Rs. 1,000,000 towards a NEPTUNE electric three-wheeler.',
      'Repayments are Rs. 20,000 a month, spread over 50 months, with no interest. Combined with the low running cost of an electric three-wheeler (about Rs. 12,000 of electricity for around 5,500 km a month), the instalment can be covered by what a driver no longer spends on petrol.',
      'Who can apply: the applicant must be from a low-income family and must be a three-wheeler driver.',
      'The offer is limited to the first 200 families. Register today using the enquiry form on this website, or call 021 785 6180 / 077 396 9427.',
      'Garudan: a new opportunity for a new life.',
    ],
    related: { label: 'Register for the 0% plan', href: '/#pricing' },
    translations: {
      si: {
        title: 'Neptune විදුලි ත්‍රිරෝද රථයක් සඳහා රු. ලක්ෂ 10 දක්වා පොලී රහිත ණය',
        excerpt:
          'ශ්‍රී ලංකාවේ වෙනත් කිසිදු ආයතනයක් ලබා නොදෙන විශේෂ දීමනාවක්: Garudan රු. 1,000,000 දක්වා පොලී රහිත ණය, මාස 50 ක් පුරා මසකට රු. 20,000 බැගින්. පළමු පවුල් 200 සඳහා පමණි.',
        paragraphs: [
          'Neptune විදුලි ත්‍රිරෝද රථ නිෂ්පාදකයා වන Garudan (Pvt) Ltd, ශ්‍රී ලංකාවේ වෙනත් කිසිදු ආයතනයක් ලබා නොදෙන ණය පහසුකමක් ලබාදෙයි: NEPTUNE විදුලි ත්‍රිරෝද රථයක් සඳහා රු. 1,000,000 දක්වා පොලී රහිත ණය.',
          'මාසික ගෙවීම රු. 20,000 ක් පමණි, මාස 50 ක කාලයක් පුරා, පොලියක් නැත.',
          'සුදුසුකම්: අඩු ආදායම් ලාභී පවුලකට අයත් විය යුතු අතර ත්‍රිරෝද රථ රියදුරෙකු විය යුතුය.',
          'මෙම විශේෂ දීමනාව පළමු පවුල් 200 සඳහා පමණි. ප්‍රමාද නොවී අදම මෙම වෙබ් අඩවියේ විමසුම් පෝරමයෙන් හෝ 021 785 6180 / 077 396 9427 ඇමතීමෙන් ලියාපදිංචි වන්න.',
          'Garudan – නව ජීවිතයක් සඳහා නව අවස්ථාවක්.',
        ],
        related: { label: '0% සැලැස්මට ලියාපදිංචි වන්න', href: '/#pricing' },
      },
      ta: {
        title: 'Neptune மின்சார முச்சக்கர வண்டிக்கு ரூ.10 இலட்சம் வரை வட்டி இல்லாத கடன்',
        excerpt:
          'இலங்கையில் எந்த நிறுவனமும் வழங்காத சிறப்பு சலுகை! Garudan நிறுவனத்தின் மூலம் வட்டி இல்லாமல் ரூ.10 இலட்சம் கடன் வசதி — மாதம் ரூ.20,000 மட்டும், 50 மாதங்களில் செலுத்தும் வசதி.',
        paragraphs: [
          'இலங்கையில் எந்த நிறுவனமும் வழங்காத சிறப்பு சலுகை! Garudan நிறுவனத்தின் மூலம் வட்டி இல்லாமல் ரூ.10 இலட்சம் கடன் வசதி!',
          'மாதம் ரூ.20,000/- மட்டும் — 50 மாதங்களில் செலுத்தும் வசதி! NEPTUNE Electric Three Wheeler வாங்கி உங்கள் வருமானத்தை உயர்த்திக்கொள்ளுங்கள்!',
          'தகுதிகள்: குறைந்த வருமானம் கொண்ட குடும்பத்தைச் சேர்ந்தவராக இருக்க வேண்டும்; Three Wheeler ஓட்டுநராக இருக்க வேண்டும்.',
          'இந்த சிறப்பு சலுகை முதல் 200 குடும்பங்களுக்கு மட்டும்! வாய்ப்பை தவறவிடாதீர்கள் — தாமதிக்காமல் இன்றே பதிவு செய்யுங்கள்: 021 785 6180 / 077 396 9427.',
          'Garudan – புதிய வாழ்க்கைக்கான புதிய வாய்ப்பு.',
        ],
        related: { label: '0% திட்டத்திற்குப் பதிவு செய்யுங்கள்', href: '/#pricing' },
      },
    },
  },
  {
    id: 'news-price-notice',
    category: 'notice',
    slug: PRICE_SLUG,
    title: 'Price notice: rising raw material and battery costs — book your Neptune EV at today’s price',
    excerpt:
      'Raw material, parts and battery prices in Sri Lanka keep rising, so NEPTUNE EV prices may increase next month. Book now to secure the current price.',
    publishedDate: '2026-10-11T00:00:00.000Z',
    cover: { url: '/images/auto/neptune-blue-1.webp', alt: 'Neptune Long Range electric three-wheeler in blue' },
    sourceName: null,
    sourceUrl: null,
    seoTitle: 'Neptune EV Price Notice: Book at Today’s Price',
    seoDescription:
      'Rising raw material, parts and battery costs mean NEPTUNE EV prices may rise next month. Book your electric three-wheeler at today’s price.',
    body: null,
    paragraphs: [
      'Important notice: raw material prices in Sri Lanka continue to rise.',
      'The cost of parts, batteries and manufacturing has increased. Because of this, NEPTUNE EV prices may have to rise again next month.',
      'If you would like to buy at the current price — Rs. 2,675,000 including VAT for the Long Range 300 km (Rs. 605,000 down payment), or Rs. 1,775,000 for the new EV Cargo on its limited-time offer — please book without delay.',
      'Book today with the enquiry form or call 021 785 6180 / 077 396 9427.',
    ],
    related: { label: 'Book a test drive', href: '/#enquire' },
    translations: {
      si: {
        title: 'වැදගත් නිවේදනයක්: NEPTUNE EV දැනට පවතින මිලට අදම වෙන්කරවා ගන්න',
        excerpt:
          'ශ්‍රී ලංකාවේ අමුද්‍රව්‍ය, අමතර කොටස් සහ Battery මිල ගණන් අඛණ්ඩව ඉහළ යමින් පවතී. ඊළඟ මාසයේ NEPTUNE EV මිල තවදුරටත් ඉහළ යා හැකිය.',
        paragraphs: [
          'වැදගත් නිවේදනයක්! ශ්‍රී ලංකාවේ අමුද්‍රව්‍ය (Raw Material) මිල ගණන් අඛණ්ඩව ඉහළ යමින් පවතී.',
          'අමතර කොටස් (Parts) මිල ඉහළ යමින් පවතී. Battery මිල ගණන් ඉහළ යමින් පවතී. නිෂ්පාදන වියදම් ද වැඩි වෙමින් පවතී.',
          'මෙම තත්ත්වය හේතුවෙන් ඊළඟ මාසයේ NEPTUNE EV මිල තවදුරටත් ඉහළ යා හැකි බව අපේක්ෂා කෙරේ.',
          'දැනට පවතින මිලට NEPTUNE EV එක ලබාගැනීමට කැමති නම්, ප්‍රමාද නොවී අදම වෙන්කරවා ගන්න! 021 785 6180 / 077 396 9427.',
          'NEPTUNE EV – අදම Book කරන්න! දැනට පවතින මිලට ලබාගැනීමට ඇති අවස්ථාව මඟ නොහරින්න!',
        ],
        related: { label: 'අදම වෙන්කරන්න', href: '/#enquire' },
      },
      ta: {
        title: 'விலை அறிவிப்பு: NEPTUNE EV-ஐ தற்போதைய விலையில் இன்றே Book செய்யுங்கள்',
        excerpt:
          'இலங்கையில் Raw Material, Parts, Battery விலைகள் தொடர்ந்து அதிகரித்து வருகின்றன. அடுத்த மாதம் NEPTUNE EV விலை மேலும் அதிகரிக்கலாம்.',
        paragraphs: [
          'இலங்கையில் Raw Material விலைகள் தொடர்ந்து அதிகரித்து வருகின்றன.',
          'Parts விலையும், Battery விலையும், உற்பத்தி செலவுகளும் அதிகரித்துள்ளன.',
          'இதன் காரணமாக அடுத்த மாதம் NEPTUNE EV விலை மேலும் அதிகரிக்க வேண்டிய நிலை ஏற்படலாம்.',
          'தற்போதைய விலையில் வாங்க விரும்புபவர்கள் தாமதிக்காமல் முன்பதிவு செய்யுங்கள்! தேவை உள்ளவர்கள் விரைவாக Book செய்யவும்: 021 785 6180 / 077 396 9427.',
          'NEPTUNE EV – இன்றே Book செய்யுங்கள்!',
        ],
        related: { label: 'இன்றே Book செய்யுங்கள்', href: '/#enquire' },
      },
    },
  },
  {
    id: 'news-ev-cargo',
    category: 'launch',
    slug: CARGO_SLUG,
    title: 'New arrival: Neptune EV Cargo — Rs. 1,000,000 off, now Rs. 1,775,000',
    excerpt:
      'The new Neptune EV Cargo pairs a heavy-duty cargo box and 500 kg payload with a 20 kWh battery, a fully automatic gearbox and an optional rooftop solar system. Limited-time offer: Rs. 1,775,000.',
    publishedDate: '2026-10-10T00:00:00.000Z',
    cover: { url: '/images/news/neptune-ev-cargo-offer.webp', alt: 'Neptune EV Cargo electric three-wheeler with yellow heavy-duty cargo box' },
    sourceName: null,
    sourceUrl: null,
    seoTitle: 'EV Cargo Electric Three-Wheeler: Rs. 1,775,000',
    seoDescription:
      'New Neptune EV Cargo: heavy-duty box, 500 kg payload, 20 kWh battery, automatic gearbox, rooftop solar option. Now Rs. 1,775,000 (save Rs. 1,000,000).',
    body: null,
    paragraphs: [
      'Neptune has added a dedicated delivery vehicle to its electric line-up: the NEPTUNE EV Cargo, made in Sri Lanka.',
      'It carries up to 500 kg in a strong, durable, heavy-duty cargo box with rear double doors, runs on a 20 kWh battery with a 5 kW rated motor, and uses a fully automatic gearbox.',
      'Range is about 100 km on battery alone, depending on load and speed. An optional 620 W rooftop solar system (Rs. 150,000) adds about 50 km a day for free, for a total of up to 350 km.',
      'Launch offer: the list price is Rs. 2,775,000, with a limited-time discount of Rs. 1,000,000, so the offer price is Rs. 1,775,000. The vehicle carries a 2-year / 50,000 km warranty and the battery 5 years with unlimited kilometres.',
      'Zero emissions, low maintenance and a low running cost make it a strong fit for shops, delivery rounds and farm-to-town transport.',
    ],
    related: { label: 'See Neptune EV Cargo specs', href: `/vehicles/neptune-ev-cargo` },
    translations: {
      si: {
        title: 'නව පැමිණීම: Neptune EV Cargo — රු. 1,000,000 ක වට්ටමක්, දැන් රු. 1,775,000',
        excerpt:
          'නව Neptune EV Cargo හි ශක්තිමත් භාණ්ඩ පෙට්ටියක්, කි.ග්‍රෑ. 500 ධාරිතාවක්, 20 kWh බැටරියක්, සම්පූර්ණ ස්වයංක්‍රීය ගියර් පද්ධතියක් සහ විකල්ප සූර්ය පැනලයක් ඇත. සීමිත කාල දීමනාව: රු. 1,775,000.',
        paragraphs: [
          'Neptune දැන් ශ්‍රී ලංකාවේ නිෂ්පාදිත NEPTUNE EV Cargo රථය හඳුන්වා දෙයි.',
          'ශක්තිමත් භාණ්ඩ පෙට්ටියක කි.ග්‍රෑ. 500 දක්වා රැගෙන යා හැකි අතර, 20 kWh බැටරියක්, 5 kW මෝටරයක් සහ සම්පූර්ණ ස්වයංක්‍රීය ගියර් පද්ධතියක් ඇත.',
          'බර සහ වේගය අනුව බැටරියෙන් කි.මී. 100 ක් පමණ ධාවනය වේ. විකල්ප 620 W සූර්ය පද්ධතිය (රු. 150,000) දිනකට කි.මී. 50 ක් පමණ නොමිලේ එක් කරයි; මුළු ධාවන දුර කි.මී. 350 දක්වා.',
          'මිල රු. 2,775,000; සීමිත කාල වට්ටම රු. 1,000,000; දීමනා මිල රු. 1,775,000. රථ වගකීම වසර 2 / කි.මී. 50,000, බැටරිය වසර 5 (අසීමිත කි.මී.).',
        ],
        related: { label: 'EV Cargo විස්තර බලන්න', href: '/vehicles/neptune-ev-cargo' },
      },
      ta: {
        title: 'புதிய வருகை: Neptune EV Cargo — ரூ.1,000,000 தள்ளுபடி, இப்போது ரூ.1,775,000',
        excerpt:
          'புதிய Neptune EV Cargo-வில் உறுதியான சரக்குப் பெட்டி, 500 கி.கி. சுமை, 20 kWh பேட்டரி, முழு தானியங்கி கியர்பாக்ஸ் மற்றும் விருப்ப சோலார் கூரை. குறுகிய கால சலுகை: ரூ.1,775,000.',
        paragraphs: [
          'Neptune இலங்கையில் தயாரிக்கப்பட்ட NEPTUNE EV Cargo-வை அறிமுகப்படுத்துகிறது.',
          'உறுதியான சரக்குப் பெட்டியில் 500 கி.கி. வரை சுமக்கும்; 20 kWh பேட்டரி, 5 kW மோட்டார், முழு தானியங்கி கியர்பாக்ஸ்.',
          'சுமை மற்றும் வேகத்தைப் பொறுத்து பேட்டரியில் சுமார் 100 கி.மீ. ஓடும். விருப்ப 620 W சோலார் அமைப்பு (ரூ.150,000) தினமும் சுமார் 50 கி.மீ. இலவசமாகச் சேர்க்கும்; மொத்தம் 350 கி.மீ. வரை.',
          'விலை ரூ.2,775,000; குறுகிய கால தள்ளுபடி ரூ.1,000,000; சலுகை விலை ரூ.1,775,000. வாகன உத்தரவாதம் 2 ஆண்டு / 50,000 கி.மீ., பேட்டரி 5 ஆண்டுகள் (வரம்பற்ற கி.மீ.).',
        ],
        related: { label: 'EV Cargo விவரங்களைப் பாருங்கள்', href: '/vehicles/neptune-ev-cargo' },
      },
    },
  },
  {
    id: 'news-charge-while-you-sleep',
    category: 'guide',
    slug: RUNNING_SLUG,
    title: 'Charge while you sleep: run 5,500 km a month on about Rs. 12,000 of electricity',
    excerpt:
      'Charge your NEPTUNE EV overnight, drive up to 300 km by day, and spend about Rs. 12,000 a month on electricity for around 5,500 km, with zero engine oil, grease or clutch cables.',
    publishedDate: '2026-10-09T00:00:00.000Z',
    cover: { url: '/images/auto/night-ride.webp', alt: 'Neptune electric three-wheeler on the road at night' },
    sourceName: null,
    sourceUrl: null,
    seoTitle: 'Electric Tuk Tuk Cost: Rs. 12,000 for 5,500 km',
    seoDescription:
      'NEPTUNE EV running cost: about Rs. 12,000 of electricity for 5,500 km a month. Charge overnight, drive 300 km by day, no oil, grease or clutch cables.',
    body: null,
    paragraphs: [
      'While you sleep, your NEPTUNE EV charges. Plug in at night on a standard, properly earthed home socket and drive up to 300 km the next day.',
      'Garudan’s figures put the monthly electricity cost at about Rs. 12,000 for around 5,500 km, roughly Rs. 2.2 per kilometre. Your own cost will depend on your electricity tariff, load, speed and daily distance.',
      'Maintenance costs drop too: no engine oil, no grease, no clutch, and no clutch or gear cables to replace.',
      'The Neptune EV Cargo can add a 620 W rooftop solar system for about 50 km a day of free driving.',
      'Lower electricity costs, more income and an eco-friendly ride: charge while you sleep, earn when you wake.',
    ],
    related: { label: 'See prices & finance', href: '/#pricing' },
    translations: {
      si: {
        title: 'NEPTUNE EV: මාසිකව රු. 12,000/- ක විදුලි වියදමකින් කි.මී. 5,500ක් ධාවනය කරන්න!',
        excerpt:
          'රාත්‍රියේ ආරෝපණය කර දිවා කාලයේ කි.මී. 300 දක්වා ධාවනය කරන්න. එන්ජින් ඔයිල්, ග්‍රීස් හෝ කේබල් සඳහා වියදමක් නැත.',
        paragraphs: [
          'NEPTUNE EV — මාසිකව රු. 12,000/- ක විදුලි වියදමකින් කි.මී. 5,500ක් ධාවනය කරන්න!',
          'Zero Engine Oil – එන්ජින් ඔයිල් සඳහා වියදමක් නැත. Zero Grease – ග්‍රීස් සඳහා වියදමක් නැත. Zero Cable – ක්ලච් / ගියර් කේබල් සඳහා වියදමක් නැත.',
          'අඩු විදුලි වියදම, වැඩි ඉතිරියක්, අඩු නඩත්තු වියදම.',
          'ඔබගේ වියදම විදුලි ගාස්තුව, බර, වේගය සහ දෛනික ධාවන දුර අනුව වෙනස් වේ.',
          'NEPTUNE EV – අඩු වියදම • වැඩි ඉතිරිය • විදුලි ගමන',
        ],
        related: { label: 'මිල සහ ණය බලන්න', href: '/#pricing' },
      },
      ta: {
        title: 'நீங்கள் தூங்கும்போது… NEPTUNE EV சார்ஜ் ஆகும்! மாதம் ரூ.12,000 மின்செலவில் 5,500 கி.மீ.',
        excerpt:
          'இரவில் சார்ஜ் செய்யுங்கள், பகலில் 300 கி.மீ. வரை ஓடுங்கள். மாத மின்சாரச் செலவு வெறும் ரூ.12,000/- — மாதம் 5,500 கி.மீ. வரை.',
        paragraphs: [
          'நீங்கள் தூங்கும்போது… NEPTUNE EV சார்ஜ் ஆகும்! இரவில் சார்ஜ் செய்யுங்கள், பகலில் ஓட்டுங்கள் — பகலில் 300 கி.மீ. வரை ஓடுங்கள்!',
          'மாத மின்சாரச் செலவு வெறும் ரூ.12,000/- — மாதம் 5,500 கி.மீ. வரை ஓடுங்கள்!',
          'Roof-top Solar Panel, குறைந்த சார்ஜிங் செலவு, அதிக வருமான வாய்ப்பு, சுற்றுச்சூழலுக்கு நட்பு.',
          'பராமரிப்பு செலவு குறைவு: எஞ்சின் ஆயில் தேவையில்லை, கிரீஸ் தேவையில்லை, கிளட்ச் கேபிள் தேவையில்லை, கியர் கேபிள் தேவையில்லை, கிளட்ச் தேவையில்லை.',
          '“நீங்கள் தூங்கும்போது சார்ஜ்… நீங்கள் விழித்ததும் வருமானம்!”',
        ],
        related: { label: 'விலை & நிதி பாருங்கள்', href: '/#pricing' },
      },
    },
  },
]

/**
 * Shown until the CMS has published news — same idea as the vehicle placeholders.
 * Neptune facts come from the User Manual & Service Book; outside facts are cited in `sources`.
 */
export const fallbackNews: NewsItem[] = [
  ...campaignNews,
  {
    id: 'fallback-ev-running-costs',
    category: 'guide',
    slug: 'electric-three-wheeler-running-costs-sri-lanka',
    title: 'Fuel prices up again: what an electric three-wheeler really costs to run in Sri Lanka',
    excerpt:
      'Another fuel price hike has squeezed three-wheeler drivers, while fares stay unchanged. Here is how to work out what an electric three-wheeler costs per kilometre — using your own electricity tariff.',
    publishedDate: '2026-10-06T00:00:00.000Z',
    cover: { url: '/images/auto/neptune-blue-2.webp', alt: 'Neptune electric three-wheeler in blue' },
    sourceName: null,
    sourceUrl: null,
    seoTitle: 'Electric Three-Wheeler Running Cost, Sri Lanka',
    seoDescription:
      'Fuel prices keep rising. See how to calculate the per-km running cost of an electric three-wheeler in Sri Lanka, with real range and charging figures.',
    body: null,
    paragraphs: [
      'When fuel prices rose again in mid-2026, the All-Island Three-Wheeler Drivers’ and Owners’ Association announced that fares would stay unchanged. For drivers that means one thing: every rupee of the increase comes straight out of their daily income.',
      'That is why more owners are asking a simple question — what does an electric three-wheeler actually cost to run? Garudan’s own figures put it at about Rs. 12,000 of electricity for around 5,500 km a month, roughly Rs. 2.2 per kilometre. Your exact cost depends on your electricity tariff, but the maths is easy to check yourself.',
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
    category: 'industry',
    slug: 'sri-lanka-electric-three-wheeler-transition',
    title: '1.2 million tuk-tuks going electric: what Sri Lanka’s e-three-wheeler push means for drivers',
    excerpt:
      'A Ministry of Transport and UNDP pilot shows electric three-wheelers can cut fuel and maintenance costs. What the shift means for the drivers behind Sri Lanka’s 1.2 million tuk-tuks.',
    publishedDate: '2026-10-03T00:00:00.000Z',
    cover: { url: '/images/auto/green-1.webp', alt: 'Green Neptune electric three-wheeler' },
    sourceName: null,
    sourceUrl: null,
    seoTitle: 'Electric Tuk Tuks: Sri Lanka’s Shift Explained',
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
    category: 'industry',
    slug: 'three-wheeler-rules-driver-registration-tyre-standards',
    title: 'New rules for three-wheeler owners: driver registration and 2027 tyre standards explained',
    excerpt:
      'The NTC (Amendment) Act requires every three-wheeler driver to be registered, and new tyre standards apply to imports from 1 January 2027. What owners need to know — and how to stay road-ready.',
    publishedDate: '2026-09-29T00:00:00.000Z',
    cover: { url: '/images/auto/gallery-3.webp', alt: 'Neptune three-wheeler on the road' },
    sourceName: null,
    sourceUrl: null,
    seoTitle: 'Three-Wheeler Rules 2026: Registration & Tyres',
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
  return [...fallbackNews].sort(byNewest).slice(0, limit).map((item) => localize(item, locale))
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
  const item = fallbackNews.find((entry) => entry.slug === slug)
  return item ? localize(item, locale) : null
})

/**
 * Languages an article really exists in. Built-in articles without a Sinhala/Tamil version would show
 * English text on /si and /ta, so those pages are noindex and left out of hreflang and the sitemap.
 * CMS articles are translated in the admin, so all languages are assumed.
 */
export const newsLocales = (slug: string): AppLocale[] => {
  const builtIn = fallbackNews.find((item) => item.slug === slug)
  if (!builtIn) return [...routing.locales]
  return routing.locales.filter((code) => code === 'en' || Boolean(builtIn.translations?.[code]))
}
