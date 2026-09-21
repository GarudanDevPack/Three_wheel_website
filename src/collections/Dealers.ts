import type { CollectionConfig } from 'payload'

import { isLoggedIn } from './access'

export const Dealers: CollectionConfig = {
  slug: 'dealers',
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
    { name: 'address', type: 'textarea' },
    { name: 'city', type: 'text' },
    { name: 'pincode', type: 'text' },
    { name: 'phone', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'latitude', type: 'number' },
    { name: 'longitude', type: 'number' },
  ],
}
