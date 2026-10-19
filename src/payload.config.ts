import path from 'path'
import { fileURLToPath } from 'url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Vehicles } from './collections/Vehicles'
import { VehicleParts } from './collections/VehicleParts'
import { Accessories } from './collections/Accessories'
import { Dealers } from './collections/Dealers'
import { Inquiries } from './collections/Inquiries'
import { Pages } from './collections/Pages'
import { News } from './collections/News'
import { Testimonials } from './collections/Testimonials'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [
    Users,
    Media,
    Vehicles,
    VehicleParts,
    Accessories,
    Dealers,
    Inquiries,
    Pages,
    News,
    Testimonials,
  ],
  globals: [SiteSettings],
  // Content editors switch language with the locale picker in the admin. Untranslated
  // fields fall back to English, so translation can happen gradually.
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'සිංහල (Sinhala)', code: 'si' },
      { label: 'தமிழ் (Tamil)', code: 'ta' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    // Uploads (images, videos, PDFs) go to Vercel Blob: CDN-served, Range requests, long cache.
    // Vercel's filesystem is ephemeral, so local-disk uploads would be lost on every deploy.
    // Active only once BLOB_READ_WRITE_TOKEN is set (Vercel → Storage → Blob); local dev keeps disk.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
