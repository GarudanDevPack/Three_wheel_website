import { cache } from 'react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { getPayloadClient } from './payload'
import type { AppLocale } from '@/i18n/routing'

export type NewsItem = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  publishedDate: string
  cover: { url: string; alt?: string | null } | null
  sourceName: string | null
  sourceUrl: string | null
  seoTitle: string | null
  seoDescription: string | null
  body: SerializedEditorState | null
}

type NewsDoc = {
  id: string | number
  slug: string
  title: string
  excerpt?: string | null
  publishedDate: string
  coverImage?: { url?: string | null; alt?: string | null } | null
  source?: { name?: string | null; url?: string | null } | null
  seo?: { metaTitle?: string | null; metaDescription?: string | null } | null
  body?: SerializedEditorState | null
}

const toItem = (doc: NewsDoc): NewsItem => ({
  id: String(doc.id),
  slug: doc.slug,
  title: doc.title,
  excerpt: doc.excerpt || null,
  publishedDate: doc.publishedDate,
  cover: doc.coverImage?.url ? { url: doc.coverImage.url, alt: doc.coverImage.alt } : null,
  sourceName: doc.source?.name || null,
  sourceUrl: doc.source?.url || null,
  seoTitle: doc.seo?.metaTitle || null,
  seoDescription: doc.seo?.metaDescription || null,
  body: doc.body || null,
})

const published = { _status: { equals: 'published' } } as const

export const getNewsList = cache(async (locale: AppLocale, limit = 50): Promise<NewsItem[]> => {
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'news',
      where: published,
      sort: '-publishedDate',
      limit,
      depth: 1,
      locale,
    })
    return (docs as unknown as NewsDoc[]).map(toItem)
  } catch {
    return []
  }
})

export const getNewsBySlug = cache(async (locale: AppLocale, slug: string): Promise<NewsItem | null> => {
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'news',
      where: { and: [published, { slug: { equals: slug } }] },
      limit: 1,
      depth: 1,
      locale,
    })
    const doc = (docs as unknown as NewsDoc[])[0]
    return doc ? toItem(doc) : null
  } catch {
    return null
  }
})
