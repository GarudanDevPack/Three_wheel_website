'use client'

import { useEffect } from 'react'
import type { ReactNode } from 'react'

type ModalProps = {
  open: boolean
  onClose: () => void
  children: ReactNode
}

const Modal = ({ open, onClose, children }: ModalProps) => {
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      onClick={onClose}
      className="tw:fixed tw:inset-0 tw:z-[90] tw:flex tw:items-center tw:justify-center tw:bg-black/60 tw:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="tw:relative tw:max-h-[90vh] tw:w-full tw:max-w-lg tw:overflow-y-auto tw:rounded-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="tw:absolute tw:right-4 tw:top-4 tw:z-10 tw:flex tw:h-8 tw:w-8 tw:items-center tw:justify-center tw:rounded-full tw:bg-white/10 tw:text-white"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  )
}

export default Modal
