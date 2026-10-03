import type { CollectionConfig } from 'payload'

import { isLoggedIn } from './access'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  access: {
    read: () => true,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'rating', 'featured'],
    description: 'Real customer quotes only. The homepage section stays hidden until at least one is added.',
  },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'text',
      localized: true,
      admin: { description: 'e.g. "Fleet owner, 12 vehicles" or "Three-wheeler driver"' },
    },
    { name: 'location', type: 'text', admin: { description: 'e.g. Galle' } },
    { name: 'quote', type: 'textarea', required: true, localized: true },
    { name: 'rating', type: 'number', min: 1, max: 5, defaultValue: 5 },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'vehicle', type: 'relationship', relationTo: 'vehicles' },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Show on the homepage.' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers show first.' },
    },
  ],
}
