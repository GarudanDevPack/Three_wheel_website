'use client'

import { useEffect, useRef } from 'react'
import { useActionState } from 'react'
import { animate, stagger, onScroll } from 'animejs'
import { submitInquiry, type InquiryFormState, type InquiryType } from '@/app/(frontend)/actions/inquiries'

const initialState: InquiryFormState = { status: 'idle' }

const fieldRowClasses =
  'tw:flex tw:items-center tw:gap-2 tw:rounded-lg tw:bg-white/10 tw:px-3 tw:focus-within:ring-2 tw:focus-within:ring-brand-blue-light'

const fieldClasses =
  'tw:w-full tw:flex-1 tw:border-0 tw:bg-transparent tw:py-3 tw:text-sm tw:placeholder-white/50 tw:outline-none'

const labelClasses = 'tw:mb-1.5 tw:block tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wide tw:text-white/50'

const iconClasses = 'tw:h-4 tw:w-4 tw:shrink-0 tw:text-brand-blue-light'

const inquiryTypes: InquiryType[] = [
  'Single Vehicle',
  'Test Ride',
  'Fleet',
  'Dealership',
  'Sales Partner',
]

const steps = [
  'Share your details',
  'A dealer reaches out',
  'Book your test drive',
]

const TagIcon = () => (
  <svg viewBox="0 0 24 24" className={iconClasses} fill="none" aria-hidden="true">
    <path d="M11 3l9 9-8 8-9-9V4a1 1 0 0 1 1-1h7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="7.5" cy="7.5" r="1.3" fill="currentColor" />
  </svg>
)

const PersonIcon = () => (
  <svg viewBox="0 0 24 24" className={iconClasses} fill="none" aria-hidden="true">
    <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M4.5 20c1-3.5 4-5.5 7.5-5.5s6.5 2 7.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" className={iconClasses} fill="none" aria-hidden="true">
    <path
      d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.2c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
)

const EnvelopeIcon = () => (
  <svg viewBox="0 0 24 24" className={iconClasses} fill="none" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M3.5 6.5l8.5 6.5 8.5-6.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
)

const MessageIcon = () => (
  <svg viewBox="0 0 24 24" className={iconClasses} fill="none" aria-hidden="true">
    <path d="M4 5h16v10H9l-4 4v-4H4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
)

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
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (compact) return
    const section = sectionRef.current
    const card = cardRef.current
    const introItems = section?.querySelectorAll('[data-intro-item]')
    if (!section || !card) return

    const animations = [
      animate(card, {
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 600,
        ease: 'outQuad',
        autoplay: onScroll({ target: section }),
      }),
    ]

    if (introItems?.length) {
      animations.push(
        animate(introItems, {
          opacity: [0, 1],
          translateY: [24, 0],
          delay: stagger(100),
          duration: 600,
          ease: 'outQuad',
          autoplay: onScroll({ target: section }),
        }),
      )
    }

    return () => {
      animations.forEach((animation) => animation.revert())
    }
  }, [compact])

  const form = (
    <form action={formAction} className="tw:grid tw:gap-4 tw:sm:grid-cols-2">
      {relatedVehicleId && <input type="hidden" name="relatedVehicle" value={relatedVehicleId} />}
      {lockType ? (
        <input type="hidden" name="type" value={defaultType} />
      ) : (
        <div className="tw:sm:col-span-2">
          <label htmlFor="inquiry-type" className={labelClasses}>
            Enquiry type
          </label>
          <div className={fieldRowClasses}>
            <TagIcon />
            <select id="inquiry-type" name="type" defaultValue={defaultType} className={fieldClasses}>
              {inquiryTypes.map((option) => (
                <option key={option} value={option} className="tw:text-brand-ink">
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      <div>
        <label htmlFor="inquiry-name" className={labelClasses}>
          Full name
        </label>
        <div className={fieldRowClasses}>
          <PersonIcon />
          <input id="inquiry-name" name="name" required placeholder="Jane Doe" className={fieldClasses} />
        </div>
      </div>
      <div>
        <label htmlFor="inquiry-phone" className={labelClasses}>
          Phone number
        </label>
        <div className={fieldRowClasses}>
          <PhoneIcon />
          <input id="inquiry-phone" name="phone" required placeholder="+91 00000 00000" className={fieldClasses} />
        </div>
      </div>
      <div className="tw:sm:col-span-2">
        <label htmlFor="inquiry-email" className={labelClasses}>
          Email (optional)
        </label>
        <div className={fieldRowClasses}>
          <EnvelopeIcon />
          <input id="inquiry-email" name="email" type="email" placeholder="you@example.com" className={fieldClasses} />
        </div>
      </div>
      <div className="tw:sm:col-span-2">
        <label htmlFor="inquiry-message" className={labelClasses}>
          Message (optional)
        </label>
        <div className={`${fieldRowClasses} tw:items-start`}>
          <span className="tw:mt-3">
            <MessageIcon />
          </span>
          <textarea
            id="inquiry-message"
            name="message"
            placeholder="Anything we should know?"
            rows={3}
            className={fieldClasses}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:rounded-full tw:bg-brand-blue tw:px-6 tw:py-3 tw:text-sm tw:font-semibold tw:transition tw:hover:bg-brand-blue-light tw:disabled:opacity-60 tw:sm:col-span-2"
      >
        {pending ? 'Submitting…' : 'Submit Enquiry'}
        <svg viewBox="0 0 24 24" className="tw:h-4 tw:w-4" fill="none" aria-hidden="true">
          <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </form>
  )

  const status = state.status !== 'idle' && (
    <p
      className={`tw:mt-4 tw:text-sm ${
        state.status === 'success' ? 'tw:text-green-400' : 'tw:text-red-400'
      }`}
    >
      {state.message}
    </p>
  )

  if (compact) {
    return (
      <div className="tw:bg-brand-ink tw:p-6 tw:text-white tw:sm:p-8">
        <h2 className="tw:text-3xl tw:font-bold">{title}</h2>
        <p className="tw:mt-2 tw:text-white/70">{description}</p>
        {relatedVehicleName && (
          <p className="tw:mt-2 tw:text-sm tw:font-semibold tw:text-brand-blue-light">
            Regarding: {relatedVehicleName}
          </p>
        )}
        <div className="tw:mt-8">{form}</div>
        {status}
      </div>
    )
  }

  return (
    <section id="enquire" className="tw:bg-brand-ink tw:py-20 tw:text-white">
      <div ref={sectionRef} className="tw:mx-auto tw:grid tw:max-w-6xl tw:items-center tw:gap-10 tw:px-6 tw:md:grid-cols-2">
        <div>
          <h2 data-intro-item className="tw:text-3xl tw:font-bold tw:opacity-0">
            {title}
          </h2>
          <p data-intro-item className="tw:mt-2 tw:max-w-md tw:text-white/70 tw:opacity-0">
            {description}
          </p>
          {relatedVehicleName && (
            <p data-intro-item className="tw:mt-2 tw:text-sm tw:font-semibold tw:text-brand-blue-light tw:opacity-0">
              Regarding: {relatedVehicleName}
            </p>
          )}
          <ul className="tw:mt-8 tw:space-y-4">
            {steps.map((step, index) => (
              <li key={step} data-intro-item className="tw:flex tw:items-center tw:gap-3 tw:opacity-0">
                <span className="tw:flex tw:h-7 tw:w-7 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-full tw:bg-brand-blue-light/15 tw:text-sm tw:font-semibold tw:text-brand-blue-light">
                  {index + 1}
                </span>
                <p className="tw:text-sm tw:text-white/70">{step}</p>
              </li>
            ))}
          </ul>
          <svg viewBox="0 0 24 24" className="tw:mt-10 tw:hidden tw:h-20 tw:w-20 tw:text-brand-blue-light/10 tw:md:block" fill="none" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.2" />
            <path d="M3.5 6.5l8.5 6.5 8.5-6.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
        </div>

        <div
          ref={cardRef}
          className="tw:rounded-2xl tw:border tw:border-white/10 tw:bg-surface-raised tw:p-8 tw:opacity-0"
        >
          {form}
          {status}
        </div>
      </div>
    </section>
  )
}

export default InquiryForm
