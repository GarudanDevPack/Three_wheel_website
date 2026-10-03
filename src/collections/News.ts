import type { CollectionConfig } from 'payload'

import { isLoggedIn } from './access'

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'News item', plural: 'News' },
  access: {
    read: () => true,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedDate', '_status'],
  },
  defaultSort: '-publishedDate',
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'URL part, e.g. "neptune-launches-in-galle". Filled from the title if left empty.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => (value ? toSlug(String(value)) : data?.title ? toSlug(String(data.title)) : value),
        ],
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: { description: 'One image shown on the news card and at the top of the article.' },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      maxLength: 280,
      admin: { description: 'Short summary shown on the news listing (max 280 characters).' },
    },
    { name: 'body', type: 'richText', localized: true },
    {
      name: 'source',
      type: 'group',
      admin: { description: 'Optional — for press coverage published elsewhere.' },
      fields: [
        { name: 'name', type: 'text', admin: { description: 'e.g. Daily Mirror' } },
        { name: 'url', type: 'text' },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text', localized: true },
        { name: 'metaDescription', type: 'textarea', localized: true },
      ],
    },
  ],
}
