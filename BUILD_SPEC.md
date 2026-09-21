# Three-Wheeler Sales Website — Complete Build Prompt / Spec

## 0. Purpose of this document

This is a complete, build-ready spec for a three-wheeler (auto rickshaw / EV three-wheeler) sales website. Hand this whole document to a developer, or paste it into an AI coding assistant (e.g. Claude Code) as the starting instruction set. It consolidates reference analysis from: TVS Motor (tvsmotor.com), Openskies.lk, KIRI Engine (kiriengine.app), Anime.js (animejs.com), and Elektrateq (elektrateq.com).

## 1. Tech Stack

- **Frontend + Backend:** Next.js + Payload CMS 3 (Payload runs embedded inside the Next.js app — same repo, same server, admin panel at `/admin`)
- **Database:** PostgreSQL (recommended over MongoDB for this data shape — structured specs, relations between vehicles/parts/dealers)
- **Styling:** Tailwind CSS
- **Animation:** anime.js v4 for all scroll-driven, stagger, SVG, and draggable animations. Framer Motion for React-level UI transitions (route changes, modals, mount/unmount). No GSAP.
- **Package manager:** npm (yarn 1.x is NOT supported by Payload)

### ⚠️ Version compatibility — CHECK BEFORE SCAFFOLDING

Payload CMS 3.x only works with specific Next.js version ranges. Verify against Payload's current docs at build time (ranges shift), but as of this spec:

- Next.js 15.2.9 – 15.2.x
- Next.js 15.3.9 – 15.3.x
- Next.js 15.4.11 – 15.4.x
- Next.js 16.2.6+

Also required: Node.js 20.9.0+. If your starting template is on an unsupported version, upgrade first, or scaffold fresh with `npx create-payload-app@latest` to get a known-compatible pairing.

## 2. Project Structure (monorepo, single app)

```
src/
  app/
    (frontend)/            # public site
      page.tsx             # home
      vehicles/
        page.tsx            # catalog/listing
        [slug]/page.tsx      # vehicle detail page
      about/page.tsx
      contact/page.tsx
      dealers/page.tsx
    (payload)/              # admin panel + API (auto-generated)
  collections/              # Payload collection configs
    Vehicles.ts
    VehicleParts.ts
    Dealers.ts
    Accessories.ts
    Inquiries.ts
    Media.ts
  components/
    animations/
      Preloader.tsx
      HeroEntrance.tsx
      StatCounters.tsx        # animated count-up stats (Elektrateq-style)
      ExplodedPartsSection.tsx # anime.js scroll-scrubbed exploded diagram
      ColorSpin360.tsx          # draggable multi-angle color viewer
      VariantReveal.tsx          # click/scroll-triggered variant swap
    ui/
      SpecsTable.tsx
      VariantTabs.tsx
      DealerLocator.tsx
      AccessoryGrid.tsx
      InquiryForm.tsx
      FaqAccordion.tsx
      AwardBadge.tsx
  payload.config.ts
```

## 3. Payload Collections (data model)

### Vehicles
- `name` (text)
- `slug` (text, unique)
- `category` (select: Passenger / Cargo)
- `fuelType` (select: Petrol / CNG / LPG / Electric, multi-select allowed)
- `heroImage` (upload → Media)
- `heroStats` (group) — for animated hero counters: range, topSpeed, peakPower, gradeability (numbers, with unit labels)
- `shortDescription` (textarea)
- `variants` (array) — each variant:
  - `variantName` (e.g. "GS+ Fi Petrol", "ETX-L Luxury")
  - `fuelType`
  - `taglineForReveal` (short text — used in the variant-reveal swap section)
  - `specs` (group, see Section 5)
- `colors` (array) — each color:
  - `colorName`
  - `swatchHex`
  - `angleImages` (array of uploads: front / right / back / left — for 360 color spin)
- `explodedPartsIllustration` (array of uploads) — line-art SVG illustrations of each part, positioned for the exploded-diagram animation (see Section 8)
- `mechanismDemo` (upload, video/GIF — optional, e.g. seat-folding, cargo conversion, storage compartment opening)
- `parts` (relationship → VehicleParts, many)
- `accessories` (relationship → Accessories, many)
- `gallery` (array of uploads)
- `brochurePdf` (upload)
- `maintenanceSchedulePdf` (upload)
- `warrantyPolicyPdf` (upload)
- `awards` (array, optional) — awardName, awardImage, year
- `seo` (group): metaTitle, metaDescription, ogImage

### VehicleParts
- `partName` (text — e.g. "Engine", "Chassis", "Fuel Tank")
- `description` (textarea)
- `image` (upload)
- `hotspotX`, `hotspotY` (number, 0–100% — position for clickable hotspot)
- `relatedVehicle` (relationship → Vehicles)

### Dealers
- `name`, `address`, `phone`, `email`
- `latitude`, `longitude` (number — for map embed)
- `city`, `pincode`

### Accessories
- `name`, `description`, `image`
- `compatibleVehicles` (relationship → Vehicles, many)

### Inquiries
- `type` (select: Test Ride / Single Vehicle / Fleet / Dealership / Sales Partner)
- `name`, `phone`, `email`, `message`
- `relatedVehicle` (relationship → Vehicles, optional)
- `status` (select: New / Contacted / Closed)

### Media
- Standard Payload upload collection (images, PDFs, videos/GIFs, SVGs)

## 4. Vehicle Spec Fields (per variant, structured group)

- **Engine:** type, displacement, ignitionSystem, maxPower, maxTorque, maxSpeed, starting
- **Transmission:** type
- **Chassis:** type
- **Suspension:** frontRear
- **Brakes:** frontRear
- **Tyres:** rimSize, tyreSize
- **Electricals:** battery, headLamp, tailLamp, turnSignal, warningLamps
- **Dimensions:** fuelTankCapacity, groundClearance, kerbWeight, overallHeight, overallLength, overallWidth, wheelTrack, wheelbase
- **Gradeability:** value
- **Charging** (if Electric fuelType): homeChargerTime, acCommercialChargerTime, fastChargerTime, rangePerCharge

## 5. Design System / Brand (locked — modern dark UI)

Based on the approved homepage draft ("Neptune Three-Wheeler"), the site uses a dark, modern automotive brand aesthetic — not a bright/corporate look. Apply this consistently across every page and component:

- **Background:** near-black / dark navy (e.g. `#0B0E14`–`#10131A` range) as the primary background — not pure black, keep a slight blue undertone
- **Accent color:** confident blue (e.g. `#2F6FEB`–`#3B82F6` range) used for links, primary buttons, active nav states, and headline highlight words
- **Buttons:** fully rounded / pill-shaped (`rounded-full`), solid blue fill for primary actions ("Enquire Now", "Book a Test Drive"), outlined/ghost style with blue border for secondary actions ("See Specifications")
- **Typography:** clean modern sans-serif, bold large headlines, generous line height on body copy, light/medium weight for supporting text, high contrast against the dark background (white/near-white text)
- **Navigation:** simple horizontal nav (Vehicles / Dealers / About / Contact) on the left/center, logo top-left, primary CTA button ("Enquire Now") pill-shaped top-right, transparent/dark nav bar sitting directly on the hero image
- **Hero pattern:** full-bleed vehicle photo on the right/majority of viewport, headline + short description + two CTA buttons on the left, dark overlay/gradient where text sits on the image for readability, animated stat counters beneath or beside the headline (Range / Top Speed / Peak Power / Gradeability, counting up from 0 on load — see Section 8)
- **Overall feel:** premium, technical, confident — closer to an EV/tech product launch page than a traditional dealership site. Avoid stock "corporate blue on white" templates; keep the dark canvas throughout (specs sections, forms, footer), using lighter dark-gray cards/panels to separate content blocks from the base background rather than switching to white sections
- Carry this same palette and button/typography style into Payload admin panel's public-facing forms (inquiry forms, etc.) so the experience feels continuous
- Define all colors as CSS variables/Tailwind theme tokens (not hardcoded hex scattered through components) so the palette can be adjusted centrally later

## 6. Reference Site Analysis Summary

| Reference | What we're borrowing |
|---|---|
| TVS Motor (tvsmotor.com) | Sticky segmented enquiry menu (Test Ride/Single/Fleet/Dealership/Partner); in-page anchor nav; variant-tabbed spec tables; 360° per-color photo spin (4 angles); dealer locator; accessories grid; brochure downloads; FAQ accordion; "You may also like" cross-sell |
| Openskies.lk | Branded preloader animation; hero entrance animation (element flies/slides in on load); scroll-triggered parallax on decorative shapes |
| KIRI Engine (kiriengine.app) | Scroll-scrubbed frame-sequence "build" animation technique — the mechanism behind our exploded-parts section |
| Anime.js (animejs.com) | The animation library itself (lightweight, Scroll Observer, stagger, SVG toolset, Draggable) and its own homepage's line-art exploded mechanical illustration as the visual style reference for our parts section |
| Elektrateq (elektrateq.com) | Animated count-up hero stats; award/certification badge; tabbed design showcase (Powertrain/Interior/Exterior); variant-reveal toggle (click to swap entire section into a different variant's content/imagery); use-case storytelling section; looping GIF mechanism demos (e.g. seat-folding); charging stats section |

## 7. Pages & Features

### Home
- Preloader animation (branded, wheel-spin or logo line-draw)
- Hero: vehicle drive-in entrance animation + animated stat counters (Range/Top Speed/Power/Gradeability, counting up from 0)
- Featured models grid
- "One Vehicle, Many Possibilities" use-case storytelling section (lifestyle photography: daily ride / business / delivery / taxi), single Pre-Order/Enquire CTA
- Award/certification badge strip (if applicable)
- CTA banner → catalog

### Vehicle Catalog (`/vehicles`)
- Filter by category (Passenger/Cargo) and fuel type
- Card grid, each linking to detail page

### Vehicle Detail (`/vehicles/[slug]`)
- Sticky/floating enquiry menu: Book Test Ride / Single Enquiry / Fleet Enquiry / Dealership / Become a Partner (each opens its own short form → writes to Inquiries)
- In-page anchor nav: Overview / Build & Parts / Specifications / Accessories / Dealers
- Exploded parts / build section (Section 8) — scroll-scrubbed line-art assembly animation
- Variant-reveal section — e.g. base model shown first, a "Reveal the [X] Version" button/scroll-trigger swaps the section's copy + imagery into the next variant (luxury/delivery/cargo version), with a "Back to [base]" control to return — reusable for each pair of variants a vehicle has
- Color spin section — draggable/clickable multi-angle viewer cycling through `colors[].angleImages`
- Mechanism demo — looping GIF/WebM if the vehicle has a foldable/convertible feature (e.g. cargo/passenger seat conversion)
- Feature storytelling blocks (icon + image + short blurb, grouped by theme — Economy, Durability, Low Maintenance, Comfort)
- Tabbed design showcase (Powertrain / Interior / Exterior)
- Specs section — variant tabs → sub-tabs (Engine/Transmission/etc.), including Charging stats sub-tab for electric variants
- Accessories grid (from accessories relationship)
- Dealer locator (pincode/geolocation search + embedded map)
- Brochure/maintenance/warranty PDF downloads
- FAQ accordion (schema-marked for rich snippets)
- "You may also like" — related vehicles
- Structured data: Product/Vehicle JSON-LD

### About / Contact / Dealers pages
- Standard content pages, each with own seo fields

## 8. Animation Requirements (in priority order)

Animation library: anime.js v4 for all scroll-driven and stagger animations — lightweight (~24.5 KB full, Scroll module alone ~4.3 KB), native Scroll Observer API (play-once / loop / scrub sync modes), built-in stagger utility, SVG toolset (line-drawing, shape morph, motion path), and a Draggable API. Framer Motion handles React-level transitions only (route changes, modals, mount/unmount). No GSAP in the stack.

1. **Preloader** — short branded loading animation on first load (Lottie, or an anime.js-driven logo/wheel-spin draw-in using the SVG line-drawing toolset), fades into homepage
2. **Hero entrance** — vehicle slides/drives in with slight easing/bounce on load (Framer Motion for the React transition, or anime.js `animate()` with a spring ease)
3. **Animated stat counters** — hero numbers (Range/Top Speed/Power/Gradeability) count up from 0 to their real value when the hero enters view, using anime.js's number-tweening (animate a plain object's value prop, render it into text each frame via update callback)
4. **Scroll reveals** — sections and cards fade/slide into view on scroll, using anime.js Scroll Observer in "play once on enter" mode; grids (accessories, gallery, spec icons, feature cards) use anime.js `stagger()` so items cascade in one after another
5. **Exploded parts / build illustration section** — reference: anime.js's own homepage "lightweight and modular API" section (clean, thin-line technical illustration of a mechanical assembly, exploded into separate floating components, on a warm neutral background — adapted here to the dark theme). Recreate this treatment for the three-wheeler:
   - A line-art / technical-illustration style exploded diagram of the vehicle (chassis, wheels, engine, cabin, seats, body panels) — each part rendered as a clean outline illustration (SVG), not a photo
   - On scroll into this section, parts animate in from different directions and assemble into the complete vehicle silhouette (or reverse: assembled → explodes apart as you scroll further) — driven by anime.js Scroll Observer in scrub mode, motion directly tied to scroll position
   - Optional: once assembled, each part becomes a clickable hotspot showing its name/spec (pulls from the VehicleParts collection)
   - Asset requirement: a set of line-art/outline SVG illustrations of each part, laid out at "exploded" starting positions and "assembled" end positions — commissioned from an illustrator, or vector-traced from reference photos of the actual vehicle
6. **Variant-reveal transition** — clicking "Reveal the [Variant] Version" cross-fades/slides the section's image and copy into the alternate variant's content (anime.js timeline: fade out current → swap DOM content → fade/slide in new content), with a "Back" control reversing it
7. **360° color spin** — draggable/swipeable image cycler per color variant, implemented with anime.js Draggable API (no 3D engine required)
8. **Mechanism demo GIF/video** — autoplay-on-scroll-into-view looping clip (native `<video loop muted>` preferred over GIF for file size/performance)

All animation assets (SVGs, sequence frames, Lottie files, videos) must be lazy-loaded (not blocking first paint) to protect Core Web Vitals / SEO performance.

## 9. SEO Requirements

- Next.js Metadata API — unique title/description/OG tags per page, pulled from each collection's `seo` group
- Server-side rendering / static generation (SSG/ISR) for all public pages — no client-only rendering of primary content
- Clean slugs: `/vehicles/king-deluxe` style
- Auto-generated `sitemap.xml` and `robots.txt`, regenerating as Payload content changes
- JSON-LD structured data: Product schema per vehicle, FAQPage schema on FAQ sections
- `next/image` for all images — auto-optimized, alt text pulled from Payload media alt fields
- Mobile-first responsive layout (required for Google mobile-first indexing)
- Heavy assets (SVG sequences, animation libraries, videos) lazy-loaded so they don't hurt Largest Contentful Paint

## 10. Admin Panel (auto-generated by Payload)

No custom admin UI needed — Payload generates create/edit/delete screens for every collection above automatically at `/admin`, including:

- Add/edit/delete vehicles, variants, colors, parts, accessories, dealers
- Upload media (images, PDFs, videos, sequence frames, SVGs)
- View and manage incoming inquiries/leads
- Role-based user accounts for staff access

## 11. Build Order (recommended, incremental)

Work through Claude Code in these stages rather than all at once:

1. Scaffold Next.js + Payload (confirm version compatibility first), set up PostgreSQL connection
2. Build all Payload collections (Section 3) and confirm admin panel works
3. Seed one placeholder vehicle with full data (specs, images, one variant, one color)
4. Build the Vehicle Detail page structure with real data, no animation yet — confirm layout, specs tables, dealer locator, forms all work
5. Apply the Design System (Section 5) — dark theme, colors, typography, buttons
6. Add animations in order: preloader → hero entrance/stat counters → scroll reveals → exploded parts section → variant reveal → color spin → mechanism demo
7. Build remaining pages: catalog, home, about, contact, dealers
8. Apply SEO requirements (Section 9) across all pages
9. QA pass: mobile responsiveness, Core Web Vitals, cross-browser check
