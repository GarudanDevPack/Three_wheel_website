import type { CollectionConfig } from 'payload'

import { isLoggedIn } from './access'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  access: {
    read: isLoggedIn,
    create: () => true,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'Single Vehicle',
      options: ['Test Ride', 'Single Vehicle', 'Fleet', 'Dealership', 'Sales Partner'],
    },
    { name: 'name', type: 'text', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'email', type: 'email' },
    { name: 'message', type: 'textarea' },
    { name: 'relatedVehicle', type: 'relationship', relationTo: 'vehicles' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'New',
      options: ['New', 'Contacted', 'Closed'],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
