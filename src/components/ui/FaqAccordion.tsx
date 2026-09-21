'use client'

import { useState } from 'react'

export type FaqItem = { question: string; answer: string }

const FaqAccordion = ({ items }: { items: FaqItem[] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="tw:divide-y tw:divide-white/10 tw:rounded-xl tw:border tw:border-white/10 tw:bg-surface-raised">
      {items.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="tw:flex tw:w-full tw:items-center tw:justify-between tw:px-5 tw:py-4 tw:text-left tw:text-sm tw:font-semibold tw:text-white"
            >
              {item.question}
              <span className="tw:ml-4 tw:text-lg">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <p className="tw:px-5 tw:pb-4 tw:text-sm tw:text-white/60">{item.answer}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default FaqAccordion
