import type { GlobalConfig } from 'payload'

import { isLoggedIn } from '../collections/access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
    update: isLoggedIn,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contact',
          fields: [
            { name: 'address', type: 'textarea', localized: true },
            { name: 'phone', type: 'text' },
            {
              name: 'whatsapp',
              type: 'text',
              admin: { description: 'Number for the floating WhatsApp button, e.g. 077 396 9427.' },
            },
            { name: 'email', type: 'text' },
            { name: 'businessHours', type: 'text', localized: true },
            {
              name: 'socialLinks',
              type: 'array',
              fields: [
                { name: 'platform', type: 'select', options: ['Facebook', 'LinkedIn', 'YouTube'] },
                { name: 'url', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Financing',
          fields: [
            {
              name: 'financing',
              type: 'group',
              admin: {
                description:
                  'Defaults for the homepage EMI calculator. Visitors can adjust every value; these only set where the sliders start.',
              },
              fields: [
                {
                  name: 'interestRate',
                  type: 'number',
                  min: 0,
                  max: 60,
                  admin: { description: 'Indicative annual interest rate (%), e.g. 15.' },
                },
                {
                  name: 'downPaymentPercent',
                  type: 'number',
                  min: 0,
                  max: 90,
                  admin: { description: 'Default down payment (% of price), e.g. 20.' },
                },
                {
                  name: 'maxTenureMonths',
                  type: 'number',
                  min: 6,
                  max: 120,
                  admin: { description: 'Longest loan term offered (months), e.g. 60.' },
                },
                {
                  name: 'disclaimer',
                  type: 'textarea',
                  localized: true,
                  admin: { description: 'Shown under the calculator. Leave empty to use the default wording.' },
                },
                {
                  name: 'partners',
                  type: 'array',
                  labels: { singular: 'Finance partner', plural: 'Finance partners' },
                  fields: [
                    { name: 'name', type: 'text', required: true },
                    { name: 'logo', type: 'upload', relationTo: 'media' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Analytics & Cookies',
          fields: [
            {
              name: 'analytics',
              type: 'group',
              fields: [
                {
                  name: 'gaMeasurementId',
                  type: 'text',
                  admin: {
                    description:
                      'Google Analytics 4 Measurement ID (looks like G-XXXXXXXXXX). It only loads after a visitor accepts cookies.',
                  },
                  validate: (value: unknown) =>
                    !value || /^G-[A-Z0-9]+$/.test(String(value)) || 'Must look like G-XXXXXXXXXX',
                },
              ],
            },
            {
              name: 'cookieConsent',
              type: 'group',
              fields: [
                { name: 'enabled', type: 'checkbox', defaultValue: true },
                {
                  name: 'message',
                  type: 'textarea',
                  localized: true,
                  admin: { description: 'Leave empty to use the default wording.' },
                },
                { name: 'acceptLabel', type: 'text', localized: true },
                { name: 'declineLabel', type: 'text', localized: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}
