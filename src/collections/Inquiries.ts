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
      // Keep in sync with InquiryType in src/app/(frontend)/actions/inquiries.ts
      options: ['Test Ride', 'Single Vehicle', 'Fleet', 'Finance', 'Dealership', 'Sales Partner'],
    },
    { name: 'name', type: 'text', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'email', type: 'email' },
    { name: 'message', type: 'textarea' },
    { name: 'relatedVehicle', type: 'relationship', relationTo: 'vehicles' },
    // Chosen in the form's selectors (plain text so catalog models without a CMS record still work).
    { name: 'model', type: 'text' },
    { name: 'dealer', type: 'text' },
    { name: 'sourcePage', type: 'text', admin: { description: 'Page the form was sent from.' } },
    {
      name: 'consent',
      type: 'checkbox',
      admin: { description: 'Visitor agreed to be contacted and accepted the privacy policy.' },
    },
    { name: 'consentAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
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
