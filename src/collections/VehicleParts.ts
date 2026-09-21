import type { CollectionConfig } from 'payload'

import { isLoggedIn } from './access'

export const VehicleParts: CollectionConfig = {
  slug: 'vehicle-parts',
  access: {
    read: () => true,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  admin: {
    useAsTitle: 'partName',
  },
  fields: [
    { name: 'partName', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'hotspotX', type: 'number', min: 0, max: 100 },
    { name: 'hotspotY', type: 'number', min: 0, max: 100 },
    { name: 'relatedVehicle', type: 'relationship', relationTo: 'vehicles' },
  ],
}
