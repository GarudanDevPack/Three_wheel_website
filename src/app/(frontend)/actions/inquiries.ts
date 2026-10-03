'use server'

import { getPayloadClient } from '@/lib/payload'

// Keep in sync with the `type` options in src/collections/Inquiries.ts
export type InquiryType =
  | 'Test Ride'
  | 'Single Vehicle'
  | 'Fleet'
  | 'Finance'
  | 'Dealership'
  | 'Sales Partner'

export type InquiryFormState = {
  status: 'idle' | 'success' | 'error'
  messageKey?: 'success' | 'missingFields' | 'failed'
}

export async function submitInquiry(
  _prevState: InquiryFormState,
  formData: FormData,
): Promise<InquiryFormState> {
  const type = String(formData.get('type') || 'Single Vehicle') as InquiryType
  const name = String(formData.get('name') || '').trim()
  const phone = String(formData.get('phone') || '').trim()
  const email = String(formData.get('email') || '').trim()
  const message = String(formData.get('message') || '').trim()
  const relatedVehicle = String(formData.get('relatedVehicle') || '').trim()

  if (!name || !phone) {
    return { status: 'error', messageKey: 'missingFields' }
  }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'inquiries',
      data: {
        type,
        name,
        phone,
        email: email || undefined,
        message: message || undefined,
        relatedVehicle: relatedVehicle || undefined,
      },
    })
    return { status: 'success', messageKey: 'success' }
  } catch {
    return { status: 'error', messageKey: 'failed' }
  }
}
