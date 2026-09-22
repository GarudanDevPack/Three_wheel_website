'use client'

import { useState } from 'react'
import Modal from './Modal'
import InquiryForm from './InquiryForm'
import type { InquiryType } from '@/app/(frontend)/actions/inquiries'

const options: { type: InquiryType; label: string }[] = [
  { type: 'Test Ride', label: 'Book Test Ride' },
  { type: 'Single Vehicle', label: 'Single Enquiry' },
  { type: 'Fleet', label: 'Fleet Enquiry' },
  { type: 'Dealership', label: 'Dealership' },
  { type: 'Sales Partner', label: 'Become a Partner' },
]

type FloatingEnquiryMenuProps = {
  relatedVehicleId: string
  relatedVehicleName: string
}

const FloatingEnquiryMenu = ({
  relatedVehicleId,
  relatedVehicleName,
}: FloatingEnquiryMenuProps) => {
  const [open, setOpen] = useState(false)
  const [activeType, setActiveType] = useState<InquiryType | null>(null)

  return (
    <>
      <div className="tw:fixed tw:bottom-6 tw:right-6 tw:z-[80] tw:flex tw:flex-col tw:items-end tw:gap-3">
        {open && (
          <div className="tw:flex tw:flex-col tw:items-end tw:gap-2">
            {options.map((option) => (
              <button
                key={option.type}
                type="button"
                onClick={() => {
                  setActiveType(option.type)
                  setOpen(false)
                }}
                className="tw:rounded-full tw:border tw:border-white/10 tw:bg-surface-raised tw:px-4 tw:py-2 tw:text-sm tw:font-semibold tw:text-white tw:shadow-lg tw:transition tw:hover:bg-surface"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Enquire about this vehicle"
          className="tw:flex tw:h-14 tw:w-14 tw:items-center tw:justify-center tw:rounded-full tw:bg-brand-blue tw:text-xl tw:text-white tw:shadow-xl"
        >
          {open ? '×' : '✉'}
        </button>
      </div>

      <Modal open={activeType !== null} onClose={() => setActiveType(null)}>
        {activeType && (
          <InquiryForm
            compact
            lockType
            defaultType={activeType}
            relatedVehicleId={relatedVehicleId}
            relatedVehicleName={relatedVehicleName}
            title={options.find((o) => o.type === activeType)?.label}
            description="Share your details and we'll get back to you shortly."
          />
        )}
      </Modal>
    </>
  )
}

export default FloatingEnquiryMenu
