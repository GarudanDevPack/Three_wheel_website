'use client'

import { useActionState } from 'react'
import { submitInquiry, type InquiryFormState, type InquiryType } from '@/app/(frontend)/actions/inquiries'

const initialState: InquiryFormState = { status: 'idle' }

const fieldClasses =
  'tw:rounded-lg tw:bg-white/10 tw:px-4 tw:py-3 tw:text-sm tw:placeholder-white/50 tw:outline-none tw:focus:ring-2 tw:focus:ring-brand-blue-light'

const inquiryTypes: InquiryType[] = [
  'Single Vehicle',
  'Test Ride',
  'Fleet',
  'Dealership',
  'Sales Partner',
]

type InquiryFormProps = {
  relatedVehicleId?: string
  relatedVehicleName?: string
  defaultType?: InquiryType
  lockType?: boolean
  compact?: boolean
  title?: string
  description?: string
}

const InquiryForm = ({
  relatedVehicleId,
  relatedVehicleName,
  defaultType = 'Single Vehicle',
  lockType = false,
  compact = false,
  title = 'Book a test drive',
  description = 'Leave your details and a dealer will contact you.',
}: InquiryFormProps) => {
  const [state, formAction, pending] = useActionState(submitInquiry, initialState)

  const content = (
    <div className={compact ? '' : 'tw:mx-auto tw:max-w-2xl tw:px-6'}>
      <h2 className="tw:text-3xl tw:font-bold">{title}</h2>
      <p className="tw:mt-2 tw:text-white/70">{description}</p>
      {relatedVehicleName && (
        <p className="tw:mt-2 tw:text-sm tw:font-semibold tw:text-brand-blue-light">
          Regarding: {relatedVehicleName}
        </p>
      )}
      <form action={formAction} className="tw:mt-8 tw:grid tw:gap-4 tw:sm:grid-cols-2">
        {relatedVehicleId && (
          <input type="hidden" name="relatedVehicle" value={relatedVehicleId} />
        )}
        {lockType ? (
          <input type="hidden" name="type" value={defaultType} />
        ) : (
          <select
            name="type"
            aria-label="Enquiry type"
            defaultValue={defaultType}
            className={`${fieldClasses} tw:sm:col-span-2`}
          >
            {inquiryTypes.map((option) => (
              <option key={option} value={option} className="tw:text-brand-ink">
                {option}
              </option>
            ))}
          </select>
        )}
        <input name="name" required placeholder="Full name" className={fieldClasses} />
        <input name="phone" required placeholder="Phone number" className={fieldClasses} />
        <input
          name="email"
          type="email"
          placeholder="Email (optional)"
          className={`${fieldClasses} tw:sm:col-span-2`}
        />
        <textarea
          name="message"
          placeholder="Message (optional)"
          rows={3}
          className={`${fieldClasses} tw:sm:col-span-2`}
        />
        <button
          type="submit"
          disabled={pending}
          className="tw:rounded-full tw:bg-brand-blue tw:px-6 tw:py-3 tw:text-sm tw:font-semibold tw:disabled:opacity-60 tw:sm:col-span-2"
        >
          {pending ? 'Submitting…' : 'Submit Enquiry'}
        </button>
      </form>
      {state.status !== 'idle' && (
        <p
          className={`tw:mt-4 tw:text-sm ${
            state.status === 'success' ? 'tw:text-green-400' : 'tw:text-red-400'
          }`}
        >
          {state.message}
        </p>
      )}
    </div>
  )

  if (compact) {
    return <div className="tw:bg-brand-ink tw:p-6 tw:text-white tw:sm:p-8">{content}</div>
  }

  return (
    <section id="enquire" className="tw:bg-brand-ink tw:py-20 tw:text-white">
      {content}
    </section>
  )
}

export default InquiryForm
