import type { CollectionConfig } from 'payload'

import { isLoggedIn } from './access'

export const Accessories: CollectionConfig = {
  slug: 'accessories',
  access: {
    read: () => true,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'compatibleVehicles', type: 'relationship', relationTo: 'vehicles', hasMany: true },
  ],
}
