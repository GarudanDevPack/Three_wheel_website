'use server'

import { getPayloadClient } from '@/lib/payload'

export type InquiryType = 'Test Ride' | 'Single Vehicle' | 'Fleet' | 'Dealership' | 'Sales Partner'

export type InquiryFormState = { status: 'idle' | 'success' | 'error'; message?: string }

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
    return { status: 'error', message: 'Name and phone number are required.' }
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
    return { status: 'success', message: 'Thanks! Our team will reach out shortly.' }
  } catch {
    return {
      status: 'error',
      message: 'We could not submit your enquiry right now. Please try again later.',
    }
  }
}
