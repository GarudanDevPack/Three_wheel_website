'use client'

import { useId, useState } from 'react'

export type FaqItem = { question: string; answer: string }

type FaqAccordionProps = {
  items: FaqItem[]
  /** Index opened on first render; `null` keeps every item closed. */
  defaultOpen?: number | null
}

/** Readable, accessible FAQ: one card per question, smooth open/close, one item open at a time. */
const FaqAccordion = ({ items, defaultOpen = 0 }: FaqAccordionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen)
  const baseId = useId()

  return (
    <div className="tw:space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index
        const buttonId = `${baseId}-q${index}`
        const panelId = `${baseId}-a${index}`
        return (
          <div
            key={item.question}
            className={`tw:rounded-2xl tw:border tw:bg-surface tw:transition-[border-color,box-shadow] tw:duration-200 ${
              isOpen ? 'tw:border-brand-blue/40 tw:shadow-[0_12px_30px_-18px_rgba(37,99,235,0.45)]' : 'tw:border-brand-ink/10'
            }`}
          >
            <h3 className="tw:m-0">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="tw:flex tw:w-full tw:cursor-pointer tw:items-center tw:justify-between tw:gap-4 tw:rounded-2xl tw:border-0 tw:bg-transparent tw:px-5 tw:py-4 tw:text-left tw:text-base tw:font-semibold tw:leading-snug tw:text-brand-ink tw:outline-none tw:focus-visible:ring-2 tw:focus-visible:ring-brand-blue-light tw:sm:px-6 tw:sm:py-5"
              >
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className={`tw:flex tw:h-8 tw:w-8 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-full tw:transition-[background-color,color,rotate] tw:duration-300 tw:motion-reduce:transition-none ${
                    isOpen ? 'tw:rotate-45 tw:bg-brand-blue tw:text-white' : 'tw:bg-brand-blue/10 tw:text-brand-blue'
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="tw:h-4 tw:w-4" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!isOpen}
              inert={!isOpen}
              className={`tw:grid tw:transition-[grid-template-rows] tw:duration-300 tw:ease-out tw:motion-reduce:transition-none ${
                isOpen ? 'tw:grid-rows-[1fr]' : 'tw:grid-rows-[0fr]'
              }`}
            >
              <div className="tw:overflow-hidden">
                <p className="tw:m-0 tw:px-5 tw:pb-5 tw:text-[15px] tw:leading-relaxed tw:text-brand-ink/75 tw:sm:px-6">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default FaqAccordion
