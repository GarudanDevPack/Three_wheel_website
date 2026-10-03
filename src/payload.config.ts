import path from 'path'
import { fileURLToPath } from 'url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
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
})
