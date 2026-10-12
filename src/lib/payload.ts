import type { Payload } from 'payload'

let cached: Promise<Payload> | null = null

/**
 * Payload client for the frontend. Without DATABASE_URI (no database yet) it fails fast instead of
 * importing and booting the whole CMS on every request — every caller already catches and falls back
 * to built-in content. Once a database is configured, behaviour is unchanged.
 */
export function getPayloadClient(): Promise<Payload> {
  if (!process.env.DATABASE_URI) {
    return Promise.reject(new Error('Payload: DATABASE_URI is not set'))
  }
  if (!cached) {
    cached = (async () => {
      const [{ getPayload }, { default: config }] = await Promise.all([
        import('payload'),
        import('@payload-config'),
      ])
      return getPayload({ config })
    })()
  }
  return cached
}
