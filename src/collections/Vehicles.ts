import type { CollectionConfig } from 'payload'

import { isLoggedIn } from './access'

const specFields: CollectionConfig['fields'] = [
  {
    name: 'engine',
    type: 'group',
    fields: [
      { name: 'type', type: 'text' },
      { name: 'displacement', type: 'text' },
      { name: 'ignitionSystem', type: 'text' },
      { name: 'maxPower', type: 'text' },
      { name: 'maxTorque', type: 'text' },
      { name: 'maxSpeed', type: 'text' },
      { name: 'starting', type: 'text' },
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
    fields: [{ name: 'frontRear', type: 'text' }],
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
      { name: 'fuelTankCapacity', type: 'text' },
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
      { name: 'homeChargerTime', type: 'text' },
      { name: 'acCommercialChargerTime', type: 'text' },
      { name: 'fastChargerTime', type: 'text' },
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
    { name: 'name', type: 'text', required: true },
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
    { name: 'shortDescription', type: 'textarea' },
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
      name: 'variants',
      type: 'array',
      fields: [
        { name: 'variantName', type: 'text', required: true },
        {
          name: 'fuelType',
          type: 'select',
          options: ['Petrol', 'CNG', 'LPG', 'Electric'],
        },
        { name: 'taglineForReveal', type: 'text' },
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
          name: 'angleImages',
          type: 'array',
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
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
    { name: 'brochurePdf', type: 'upload', relationTo: 'media' },
    { name: 'maintenanceSchedulePdf', type: 'upload', relationTo: 'media' },
    { name: 'warrantyPolicyPdf', type: 'upload', relationTo: 'media' },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
