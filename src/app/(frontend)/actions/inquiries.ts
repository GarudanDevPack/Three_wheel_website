'use server'

import { headers } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import { MESSAGE_MAX, MIN_FILL_MS, NAME_MAX, NAME_MIN, normalizeSriLankaPhone } from '@/lib/inquiryValidation'

// Keep in sync with the `type` options in src/collections/Inquiries.ts
export type InquiryType =
  | 'Test Ride'
  | 'Single Vehicle'
  | 'Fleet'
  | 'Finance'
  | 'Dealership'
  | 'Sales Partner'

const inquiryTypes: InquiryType[] = ['Test Ride', 'Single Vehicle', 'Fleet', 'Finance', 'Dealership', 'Sales Partner']

export type InquiryFormState = {
  status: 'idle' | 'success' | 'error'
  messageKey?: 'success' | 'missingFields' | 'invalidName' | 'invalidPhone' | 'consentRequired' | 'tooFast' | 'rateLimited' | 'failed'
}

/**
 * Basic spam protection without a CAPTCHA: at most RATE_LIMIT submissions per IP per window.
 * In-memory, so it is per server instance (best effort on serverless) — the honeypot and the
 * minimum fill time below catch most bots on their own.
 */
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 10 * 60 * 1000
const recent = new Map<string, number[]>()

const rateLimited = (ip: string) => {
  const now = Date.now()
  const hits = (recent.get(ip) || []).filter((time) => now - time < RATE_WINDOW_MS)
  if (hits.length >= RATE_LIMIT) {
    recent.set(ip, hits)
    return true
  }
  hits.push(now)
  recent.set(ip, hits)
  if (recent.size > 5000) recent.clear() // keep memory bounded
  return false
}

const text = (formData: FormData, key: string, max: number) => String(formData.get(key) || '').trim().slice(0, max)

export async function submitInquiry(_prevState: InquiryFormState, formData: FormData): Promise<InquiryFormState> {
  // Honeypot: real visitors never see or fill this field. Pretend it worked, store nothing.
  if (text(formData, 'website', 200)) return { status: 'success', messageKey: 'success' }

  // Too fast to be a person: ms between the form appearing and Submit, measured in the browser
  // (elapsed time, so visitors' clock differences don't matter). Missing = not sent by our form.
  const elapsed = Number(formData.get('elapsed'))
  if (!Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    return { status: 'error', messageKey: 'tooFast' }
  }

  const requestHeaders = await headers()
  const ip = (requestHeaders.get('x-forwarded-for') || requestHeaders.get('x-real-ip') || 'unknown').split(',')[0].trim()
  if (rateLimited(ip)) return { status: 'error', messageKey: 'rateLimited' }

  const rawType = text(formData, 'type', 40) as InquiryType
  const type: InquiryType = inquiryTypes.includes(rawType) ? rawType : 'Single Vehicle'
  const name = text(formData, 'name', NAME_MAX + 1)
  const rawPhone = text(formData, 'phone', 40)
  const email = text(formData, 'email', 120)
  const message = text(formData, 'message', MESSAGE_MAX)
  const relatedVehicle = text(formData, 'relatedVehicle', 64)
  const model = text(formData, 'model', 100)
  const dealer = text(formData, 'dealer', 100)
  const sourcePath = text(formData, 'sourcePage', 300)
  const sourcePage = sourcePath.startsWith('/') ? sourcePath : undefined
  const consent = formData.get('consent') === 'on'

  if (!name || !rawPhone) return { status: 'error', messageKey: 'missingFields' }
  if (name.length < NAME_MIN || name.length > NAME_MAX) return { status: 'error', messageKey: 'invalidName' }
  const phone = normalizeSriLankaPhone(rawPhone)
  if (!phone) return { status: 'error', messageKey: 'invalidPhone' }
  if (!consent) return { status: 'error', messageKey: 'consentRequired' }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'inquiries',
      data: {
        type,
        name,
        phone,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : undefined,
        message: message || undefined,
        relatedVehicle: relatedVehicle || undefined,
        model: model || undefined,
        dealer: dealer || undefined,
        sourcePage,
        consent: true,
        consentAt: new Date().toISOString(),
      },
    })
    return { status: 'success', messageKey: 'success' }
  } catch {
    return { status: 'error', messageKey: 'failed' }
  }
}
