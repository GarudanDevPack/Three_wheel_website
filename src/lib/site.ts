/**
 * Canonical site origin for metadata, sitemap and JSON-LD.
 * Set NEXT_PUBLIC_SITE_URL on Vercel; it falls back to the brand domain printed on the posters.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.neptunesl.lk').replace(/\/$/, '')
