'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Modal from './Modal'
import InquiryForm from './InquiryForm'
import type { InquiryType } from '@/app/(frontend)/actions/inquiries'

const options: { type: InquiryType; key: string }[] = [
  { type: 'Test Ride', key: 'testRide' },
  { type: 'Single Vehicle', key: 'single' },
  { type: 'Finance', key: 'finance' },
  { type: 'Fleet', key: 'fleet' },
  { type: 'Dealership', key: 'dealership' },
  { type: 'Sales Partner', key: 'partner' },
]

type FloatingEnquiryMenuProps = {
  relatedVehicleId: string
  relatedVehicleName: string
}

const FloatingEnquiryMenu = ({
  relatedVehicleId,
  relatedVehicleName,
}: FloatingEnquiryMenuProps) => {
  const t = useTranslations('EnquiryMenu')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<(typeof options)[number] | null>(null)

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
                  setActive(option)
                  setOpen(false)
                }}
                className="tw:cursor-pointer tw:rounded-full tw:border tw:border-brand-ink/10 tw:bg-surface-raised tw:px-4 tw:py-2 tw:text-sm tw:font-semibold tw:text-brand-ink tw:shadow-lg tw:transition tw:hover:bg-surface"
              >
                {t(option.key)}
              </button>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={t('toggle')}
          className="tw:flex tw:h-14 tw:w-14 tw:cursor-pointer tw:items-center tw:justify-center tw:rounded-full tw:border-0 tw:bg-brand-blue tw:text-xl tw:text-white tw:shadow-xl"
        >
          {open ? '×' : '✉'}
        </button>
      </div>

      <Modal open={active !== null} onClose={() => setActive(null)}>
        {active && (
          <InquiryForm
            compact
            lockType
            defaultType={active.type}
            relatedVehicleId={relatedVehicleId}
            relatedVehicleName={relatedVehicleName}
            title={t(active.key)}
            description={t('modalDescription')}
          />
        )}
      </Modal>
    </>
  )
}

export default FloatingEnquiryMenu
