import { withPayload } from "@payloadcms/next/withPayload";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Anything that is not a locale prefix, Payload (/admin, /api), a Next internal,
// or a file with an extension (images, videos, sitemap.xml, robots.txt...).
const unprefixed = "(?!(?:en|si|ta|admin|api|_next)(?:/|$))(?!.*\\.).*";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // AVIF first (smallest), WebP fallback. No 2048/3840 widths: the widest layout is a 1920px screen.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
  },
  async redirects() {
    return [
      // One canonical host, https://www.neptunesl.lk — 301 (not Next's default 308) as the SEO brief asks.
      // Bare domain → www (needs neptunesl.lk added to the Vercel project so requests reach the app).
      {
        source: "/:path*",
        has: [{ type: "host", value: "neptunesl.lk" }],
        destination: "https://www.neptunesl.lk/:path*",
        statusCode: 301,
      },
      // Force HTTPS. Vercel already upgrades HTTP at the edge; this is a backstop for other hosts/proxies.
      // Scoped to the production host so local http://localhost can never loop.
      {
        source: "/:path*",
        has: [
          { type: "host", value: "www.neptunesl.lk" },
          { type: "header", key: "x-forwarded-proto", value: "http" },
        ],
        destination: "https://www.neptunesl.lk/:path*",
        statusCode: 301,
      },
      { source: "/press", destination: "/news", statusCode: 301 },
      { source: "/:locale(si|ta)/press", destination: "/:locale/news", statusCode: 301 },
      // Old flagship URL → the SEO model URL.
      { source: "/vehicles/neptune", destination: "/vehicles/neptune-300-km", statusCode: 301 },
      { source: "/:locale(si|ta)/vehicles/neptune", destination: "/:locale/vehicles/neptune-300-km", statusCode: 301 },
      // English is the default locale and lives at unprefixed URLs.
      { source: "/en", destination: "/", statusCode: 301 },
      { source: "/en/:path*", destination: "/:path*", statusCode: 301 },
    ];
  },
  // Never indexed: search/filter/preview variants of a page (the clean URL is canonical) and the
  // Payload admin (also disallowed in robots.txt; the header covers links from elsewhere).
  async headers() {
    const noindex = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];
    return [
      ...["q", "filter", "preview", "draft"].map((key) => ({
        source: "/:path*",
        has: [{ type: "query", key }],
        headers: noindex,
      })),
      { source: "/admin", headers: noindex },
      { source: "/admin/:path*", headers: noindex },
      // Enquiry confirmation page (every language). Not disallowed in robots.txt on purpose:
      // crawlers must be able to fetch it to see this noindex.
      { source: "/thank-you", headers: noindex },
      { source: "/:locale(si|ta)/thank-you", headers: noindex },
      // Long-lived caching for media. Rule: a replaced video or poster always gets a NEW filename
      // (never overwrite in place), so a year-long immutable cache is safe.
      {
        source: "/videos/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/images/posters/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  // English pages are served from the [locale] segment without a /en prefix.
  // Done with rewrites rather than middleware: Next 15.3's edge middleware runtime
  // crashes on Node 24 ("controller[kState].transformAlgorithm is not a function").
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/en" },
        { source: `/:path(${unprefixed})`, destination: "/en/:path" },
      ],
    };
  },
};

export default withPayload(withNextIntl(nextConfig));
