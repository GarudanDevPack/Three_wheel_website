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
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
  },
  async redirects() {
    return [
      // One canonical host: bare domain → www (Vercel already forces HTTPS).
      {
        source: "/:path*",
        has: [{ type: "host", value: "neptunesl.lk" }],
        destination: "https://www.neptunesl.lk/:path*",
        permanent: true,
      },
      { source: "/press", destination: "/news", permanent: true },
      { source: "/:locale(si|ta)/press", destination: "/:locale/news", permanent: true },
      // Old flagship URL → the SEO model URL.
      { source: "/vehicles/neptune", destination: "/vehicles/neptune-300-km", permanent: true },
      { source: "/:locale(si|ta)/vehicles/neptune", destination: "/:locale/vehicles/neptune-300-km", permanent: true },
      // English is the default locale and lives at unprefixed URLs.
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ];
  },
  // Search, filter and preview variants of a page must not be indexed (the clean URL is canonical).
  async headers() {
    return ["q", "filter", "preview", "draft"].map((key) => ({
      source: "/:path*",
      has: [{ type: "query", key }],
      headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
    }));
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
