import type { CollectionConfig } from 'payload'

import { isLoggedIn } from './access'
import { seoField } from '../fields/seo'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: () => true,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  admin: {
    useAsTitle: 'slug',
  },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    seoField(),
  ],
}
