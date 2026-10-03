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
      { source: "/press", destination: "/news", permanent: true },
      { source: "/:locale(si|ta)/press", destination: "/:locale/news", permanent: true },
      // English is the default locale and lives at unprefixed URLs.
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
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
