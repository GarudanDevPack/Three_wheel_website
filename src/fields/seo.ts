import type { Field } from 'payload'

/**
 * Shared SEO group. Lengths are guidance, not hard limits (Google truncates rather than rejects),
 * so editors see the target in the field description instead of a blocking validation error.
 */
export const seoField = ({ ogImage = true }: { ogImage?: boolean } = {}): Field => ({
  name: 'seo',
  type: 'group',
  fields: [
    {
      name: 'metaTitle',
      type: 'text',
      localized: true,
      admin: {
        description:
          'Keep under about 60 characters; longer titles are cut off in Google. " | Neptune" is added automatically on most pages.',
      },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      localized: true,
      admin: { description: 'Keep under about 155 characters; longer descriptions are cut off in Google.' },
    },
    ...(ogImage
      ? [
          {
            name: 'ogImage',
            type: 'upload',
            relationTo: 'media',
            admin: { description: 'Link-preview image for Facebook/WhatsApp. Use 1200 × 630 px.' },
          } satisfies Field,
        ]
      : []),
  ],
})
