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
                {
                  name: 'interestFreePlan',
                  type: 'group',
                  label: 'Garudan interest-free plan',
                  admin: {
                    description:
                      'Shown next to every price and in the calculator. Edit the terms here once; empty fields fall back to the current published terms.',
                  },
                  fields: [
                    { name: 'enabled', type: 'checkbox', defaultValue: true, admin: { description: 'Untick to hide the plan everywhere.' } },
                    // Defaults = the confirmed terms (Phase 8 follow-up), same as GARUDAN_ZERO_FINANCE.
                    { name: 'maxLoan', type: 'number', min: 0, defaultValue: 1_000_000, admin: { description: 'Largest interest-free amount (Rs.).' } },
                    { name: 'monthly', type: 'number', min: 0, defaultValue: 20_000, admin: { description: 'Monthly instalment (Rs.).' } },
                    { name: 'months', type: 'number', min: 1, defaultValue: 50, admin: { description: 'Number of monthly instalments.' } },
                    { name: 'families', type: 'number', min: 0, defaultValue: 200, admin: { description: 'How many families it is limited to.' } },
                    {
                      name: 'eligibility',
                      type: 'textarea',
                      localized: true,
                      admin: { description: 'Who qualifies, in plain words. Leave empty to use the current wording.' },
                    },
                    { name: 'validUntil', type: 'date', admin: { description: 'Last day of the plan. The plan hides itself after this date. Leave empty if there is no end date.' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Warranty',
          fields: [
            {
              name: 'warranty',
              type: 'group',
              admin: { description: 'One wording used on model pages and price boxes. Leave empty to use the current wording.' },
              fields: [
                { name: 'vehicle', type: 'text', localized: true, admin: { description: 'e.g. 24 months / 50,000 km' } },
                { name: 'battery', type: 'text', localized: true, admin: { description: 'e.g. 5 years, unlimited km' } },
                {
                  name: 'serviceCondition',
                  type: 'text',
                  localized: true,
                  admin: { description: 'e.g. Valid when serviced at authorised Garudan dealers.' },
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
