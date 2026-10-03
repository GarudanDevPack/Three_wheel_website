import type { CollectionConfig } from 'payload'

import { isLoggedIn } from './access'

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
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text', localized: true },
        { name: 'metaDescription', type: 'textarea', localized: true },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
