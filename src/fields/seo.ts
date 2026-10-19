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
    {
      name: 'translationComplete',
      type: 'checkbox',
      localized: true,
      defaultValue: false,
      label: 'Translation complete and ready to index',
      admin: {
        description:
          'Sinhala / Tamil only: tick after a native speaker has checked this page in this language. Until then the page is shown to visitors but kept out of Google, the sitemap and hreflang. English is always indexed.',
      },
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
