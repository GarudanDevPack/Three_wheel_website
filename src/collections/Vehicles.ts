import type { CollectionConfig } from 'payload'

import { isLoggedIn } from './access'

const specFields: CollectionConfig['fields'] = [
  {
    name: 'motor',
    type: 'group',
    fields: [
      { name: 'motorType', type: 'text' }, // e.g. "PMSM"
      { name: 'ratedPower', type: 'text' }, // e.g. "5 kW"
      {
        name: 'maxPower',
        type: 'text',
        admin: {
          description:
            'Client-provided figure (e.g. "12 kW") — not shown on the reference spec sheet, confirm before publishing.',
        },
      },
      { name: 'peakTorque', type: 'text' }, // e.g. "67 Nm"
      { name: 'driveType', type: 'text' }, // e.g. "Rear axle"
      { name: 'driveModes', type: 'text' }, // e.g. "Eco, Power, Climb, Park Assist"
    ],
  },
  {
    name: 'battery',
    type: 'group',
    fields: [
      { name: 'capacity', type: 'text' }, // e.g. "20 kWh"
      { name: 'waterResistance', type: 'text' }, // e.g. "IP67"
    ],
  },
  {
    name: 'comfort',
    type: 'group',
    fields: [
      { name: 'driverSeat', type: 'text' }, // e.g. "Easy Adjustable Seat"
      { name: 'passengerSeat', type: 'text' }, // e.g. "Foldable Seat"
      { name: 'instrumentCluster', type: 'text' }, // e.g. "Digital LCD display"
      { name: 'gloveBox', type: 'text' }, // e.g. "Yes"
      { name: 'cabinLight', type: 'text' }, // e.g. "Yes"
      { name: 'mobileCharger', type: 'text' }, // e.g. "USB Type A"
      { name: 'bottleHolder', type: 'text' }, // e.g. "Yes"
    ],
  },
  {
    name: 'transmission',
    type: 'group',
    fields: [{ name: 'type', type: 'text' }],
  },
  {
    name: 'chassis',
    type: 'group',
    fields: [{ name: 'type', type: 'text' }],
  },
  {
    name: 'suspension',
    type: 'group',
    fields: [{ name: 'frontRear', type: 'text' }],
  },
  {
    name: 'brakes',
    type: 'group',
    fields: [
      { name: 'frontRear', type: 'text' },
      { name: 'regenerativeBraking', type: 'text' }, // e.g. "Yes"
    ],
  },
  {
    name: 'tyres',
    type: 'group',
    fields: [
      { name: 'rimSize', type: 'text' },
      { name: 'tyreSize', type: 'text' },
    ],
  },
  {
    name: 'electricals',
    type: 'group',
    fields: [
      { name: 'battery', type: 'text' },
      { name: 'headLamp', type: 'text' },
      { name: 'tailLamp', type: 'text' },
      { name: 'turnSignal', type: 'text' },
      { name: 'warningLamps', type: 'text' },
    ],
  },
  {
    name: 'dimensions',
    type: 'group',
    fields: [
      { name: 'groundClearance', type: 'text' },
      { name: 'kerbWeight', type: 'text' },
      { name: 'overallHeight', type: 'text' },
      { name: 'overallLength', type: 'text' },
      { name: 'overallWidth', type: 'text' },
      { name: 'wheelTrack', type: 'text' },
      { name: 'wheelbase', type: 'text' },
    ],
  },
  { name: 'gradeability', type: 'text' },
]

const chargingFields: CollectionConfig['fields'] = [
  {
    name: 'charging',
    type: 'group',
    admin: {
      condition: (_, siblingData) => siblingData?.fuelType === 'Electric',
    },
    fields: [
      { name: 'chargerRating', type: 'text' }, // e.g. "2kW / 30Ah off-board"
      { name: 'chargingTime', type: 'text' }, // e.g. "8 hrs (20% → 100%)"
      { name: 'rangePerCharge', type: 'text' },
    ],
  },
]

const statField = (name: string): CollectionConfig['fields'][number] => ({
  name,
  type: 'group',
  fields: [
    { name: 'value', type: 'number' },
    { name: 'unit', type: 'text' },
  ],
})

export const Vehicles: CollectionConfig = {
  slug: 'vehicles',
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
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      name: 'category',
      type: 'select',
      options: ['Passenger', 'Cargo'],
    },
    {
      name: 'fuelType',
      type: 'select',
      hasMany: true,
      options: ['Petrol', 'CNG', 'LPG', 'Electric'],
    },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'shortDescription', type: 'textarea', localized: true },
    {
      name: 'pricing',
      type: 'group',
      admin: { description: 'Shown on the homepage price cards, EMI calculator, comparison table and vehicle pages.' },
      fields: [
        {
          name: 'price',
          type: 'number',
          min: 0,
          admin: { description: 'Price in Sri Lankan Rupees (LKR), numbers only, e.g. 1850000.' },
        },
        {
          name: 'showPrice',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Untick to show "Price on request" instead of the number.' },
        },
        {
          name: 'priceNote',
          type: 'text',
          localized: true,
          admin: { description: 'Optional, e.g. "Ex-showroom, Colombo".' },
        },
      ],
    },
    {
      name: 'modelRange',
      type: 'select',
      options: ['300km', '200km', '120km'],
      admin: { description: 'Which range variant this vehicle document represents.' },
    },
    {
      name: 'availability',
      type: 'select',
      options: ['Available', 'Upcoming'],
      defaultValue: 'Upcoming',
    },
    {
      name: 'selectorOrder',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Controls left-to-right order in the homepage model selector.' },
    },
    {
      name: 'heroStats',
      type: 'group',
      fields: [
        statField('range'),
        statField('topSpeed'),
        statField('peakPower'),
        statField('gradeability'),
      ],
    },
    {
      name: 'chassisFeature',
      type: 'group',
      admin: { description: 'Strong Chassis & Frame Design content section.' },
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Strong Chassis & Frame Design', localized: true },
        { name: 'description', type: 'textarea', localized: true },
        {
          name: 'images',
          type: 'array',
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media', required: true },
            { name: 'caption', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'variants',
      type: 'array',
      fields: [
        { name: 'variantName', type: 'text', required: true },
        {
          name: 'fuelType',
          type: 'select',
          options: ['Petrol', 'CNG', 'LPG', 'Electric'],
        },
        { name: 'taglineForReveal', type: 'text', localized: true },
        { name: 'specs', type: 'group', fields: specFields },
        ...chargingFields,
      ],
    },
    {
      name: 'colors',
      type: 'array',
      fields: [
        { name: 'colorName', type: 'text', required: true },
        { name: 'swatchHex', type: 'text' },
        {
          name: 'video',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'A looping 360° turntable clip for this color — preferred over angle images when present.' },
        },
        {
          name: 'angleImages',
          type: 'array',
          admin: { description: 'Fallback drag-to-tilt angle photos, used only when no video is set above.' },
          fields: [
            { name: 'angleLabel', type: 'text', required: true },
            { name: 'image', type: 'upload', relationTo: 'media', required: true },
          ],
        },
      ],
    },
    { name: 'mechanismDemo', type: 'upload', relationTo: 'media' },
    {
      name: 'awards',
      type: 'array',
      fields: [
        { name: 'awardName', type: 'text', required: true },
        { name: 'awardImage', type: 'upload', relationTo: 'media' },
        { name: 'year', type: 'number' },
      ],
    },
    {
      name: 'explodedPartsIllustration',
      type: 'array',
      labels: { singular: 'Part illustration', plural: 'Part illustrations' },
      fields: [
        { name: 'partName', type: 'text', required: true },
        { name: 'svg', type: 'upload', relationTo: 'media', required: true },
        {
          name: 'exploded',
          type: 'group',
          fields: [
            { name: 'x', type: 'number', defaultValue: 0 },
            { name: 'y', type: 'number', defaultValue: 0 },
            { name: 'rotate', type: 'number', defaultValue: 0 },
          ],
        },
        {
          name: 'assembled',
          type: 'group',
          fields: [
            { name: 'x', type: 'number', defaultValue: 0 },
            { name: 'y', type: 'number', defaultValue: 0 },
            { name: 'rotate', type: 'number', defaultValue: 0 },
          ],
        },
      ],
    },
    { name: 'parts', type: 'relationship', relationTo: 'vehicle-parts', hasMany: true },
    { name: 'accessories', type: 'relationship', relationTo: 'accessories', hasMany: true },
    {
      name: 'gallery',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    {
      name: 'faqs',
      type: 'array',
      fields: [
        { name: 'question', type: 'text', required: true, localized: true },
        { name: 'answer', type: 'textarea', required: true, localized: true },
      ],
    },
    { name: 'brochurePdf', type: 'upload', relationTo: 'media' },
    { name: 'maintenanceSchedulePdf', type: 'upload', relationTo: 'media' },
    { name: 'warrantyPolicyPdf', type: 'upload', relationTo: 'media' },
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
