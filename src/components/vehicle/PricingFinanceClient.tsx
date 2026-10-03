'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { animate, stagger, onScroll } from 'animejs'
import type { AppLocale } from '@/i18n/routing'
import type { SiteSettingsData } from '@/lib/siteSettings'
import { formatLkr, monthlyEmi } from '@/lib/format'
import SectionBackdrop from '@/components/ui/SectionBackdrop'
import Modal from '@/components/ui/Modal'
import InquiryForm from '@/components/ui/InquiryForm'

export type PricedModel = {
  id: string
  name: string
  modelRange: string
  availability: 'Available' | 'Upcoming'
  price: number | null
  priceNote: string | null
}

type Financing = SiteSettingsData['financing']

const sliderClasses = 'tw:mt-3 tw:w-full tw:cursor-pointer tw:accent-brand-blue'

const SliderField = ({
  id,
  label,
  display,
  children,
}: {
  id: string
  label: string
  display: string
  children: React.ReactNode
}) => (
  <div>
    <div className="tw:flex tw:items-baseline tw:justify-between tw:gap-4">
      <label htmlFor={id} className="tw:text-sm tw:font-medium tw:text-brand-ink/70">
        {label}
      </label>
      <span className="tw:text-sm tw:font-bold tw:text-brand-ink">{display}</span>
    </div>
    {children}
  </div>
)

const PricingFinanceClient = ({ models, financing }: { models: PricedModel[]; financing: Financing }) => {
  const t = useTranslations('Pricing')
  const locale = useLocale() as AppLocale
  const sectionRef = useRef<HTMLDivElement>(null)

  const maxTenure = Math.max(6, financing.maxTenureMonths)
  const defaultTenure = Math.min(36, maxTenure)
  const initialModel = models.find((model) => model.availability === 'Available') || models[0]

  const [selectedId, setSelectedId] = useState(initialModel?.id)
  const [priceInput, setPriceInput] = useState(initialModel?.price ? String(initialModel.price) : '')
  const [downPct, setDownPct] = useState(financing.downPaymentPercent)
  const [tenure, setTenure] = useState(defaultTenure)
  const [rate, setRate] = useState(financing.interestRate)
  const [applyOpen, setApplyOpen] = useState(false)

  const modelLabel = (model: PricedModel) => model.name || t('rangeModel', { range: model.modelRange })

  const price = Number(priceInput) || 0
  const down = (price * downPct) / 100
  const loan = Math.max(0, price - down)
  const emi = monthlyEmi(loan, rate, tenure)
  const totalPayable = emi * tenure
  const totalInterest = Math.max(0, totalPayable - loan)
  const hasResult = price > 0
  const money = (amount: number) => formatLkr(amount, locale)
  const dash = '—'

  const cardEstimate = useMemo(
    () => (model: PricedModel) =>
      model.price
        ? monthlyEmi(
            model.price * (1 - financing.downPaymentPercent / 100),
            financing.interestRate,
            defaultTenure,
          )
        : 0,
    [financing.downPaymentPercent, financing.interestRate, defaultTenure],
  )

  useEffect(() => {
    const section = sectionRef.current
    const items = section?.querySelectorAll('[data-pricing-reveal]')
    if (!section || !items?.length) return

    const animation = animate(items, {
      opacity: [0, 1],
      translateY: [32, 0],
      delay: stagger(120),
      duration: 650,
      ease: 'outQuad',
      autoplay: onScroll({ target: section }),
    })
    return () => {
      animation.revert()
    }
  }, [])

  const selectModel = (model: PricedModel) => {
    setSelectedId(model.id)
    setPriceInput(model.price ? String(model.price) : '')
  }

  const selected = models.find((model) => model.id === selectedId)

  return (
    <section id="pricing" className="tw:relative tw:isolate tw:overflow-hidden tw:bg-surface tw:py-20">
      <SectionBackdrop src="/images/auto/gallery-1.png" variant="soft" base="surface" />
      <div ref={sectionRef} className="tw:relative tw:z-10 tw:mx-auto tw:max-w-6xl tw:px-6">
        <div data-pricing-reveal className="tw:max-w-2xl tw:opacity-0">
          <p className="tw:text-sm tw:font-semibold tw:text-brand-blue">{t('eyebrow')}</p>
          <h2 className="tw:mt-2 tw:text-3xl tw:font-bold tw:text-brand-ink tw:md:text-4xl">{t('title')}</h2>
          <p className="tw:mt-3 tw:text-brand-ink/70">{t('intro')}</p>
        </div>

        <div className="tw:mt-10 tw:grid tw:gap-8 tw:lg:grid-cols-5">
          <div data-pricing-reveal className="tw:flex tw:flex-col tw:gap-4 tw:opacity-0 tw:lg:col-span-2">
            {models.map((model) => {
              const isSelected = model.id === selectedId
              const estimate = cardEstimate(model)
              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => selectModel(model)}
                  aria-pressed={isSelected}
                  className={`tw:group tw:w-full tw:cursor-pointer tw:rounded-2xl tw:border tw:bg-surface-raised/80 tw:p-5 tw:text-left tw:backdrop-blur tw:transition ${
                    isSelected
                      ? 'tw:border-brand-blue tw:shadow-[0_10px_30px_-12px_rgba(37,99,235,0.45)]'
                      : 'tw:border-brand-ink/10 tw:hover:border-brand-blue/40'
                  }`}
                >
                  <div className="tw:flex tw:items-start tw:justify-between tw:gap-3">
                    <div>
                      <p className="tw:text-2xl tw:font-bold tw:text-brand-ink">{model.modelRange}</p>
                      <p className="tw:text-sm tw:text-brand-ink/60">{modelLabel(model)}</p>
                    </div>
                    <span
                      className={`tw:shrink-0 tw:rounded-full tw:px-2.5 tw:py-1 tw:text-[11px] tw:font-bold ${
                        model.availability === 'Available'
                          ? 'tw:bg-brand-green/15 tw:text-emerald-700'
                          : 'tw:bg-brand-ink/10 tw:text-brand-ink/60'
                      }`}
                    >
                      {model.availability === 'Available' ? t('available') : t('upcoming')}
                    </span>
                  </div>
                  <div className="tw:mt-4 tw:border-t tw:border-brand-ink/10 tw:pt-4">
                    <p className="tw:text-xl tw:font-bold tw:text-brand-ink">
                      {model.price ? money(model.price) : t('priceOnRequest')}
                    </p>
                    {model.priceNote && <p className="tw:mt-0.5 tw:text-xs tw:text-brand-ink/50">{model.priceNote}</p>}
                    {estimate > 0 && (
                      <p className="tw:mt-2 tw:text-sm tw:font-semibold tw:text-brand-blue">
                        {t('fromPerMonth', { amount: money(estimate) })}
                      </p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          <div
            data-pricing-reveal
            className="tw:overflow-hidden tw:rounded-3xl tw:border tw:border-brand-ink/10 tw:bg-surface-raised tw:opacity-0 tw:shadow-[0_20px_50px_-20px_rgba(11,14,20,0.25)] tw:lg:col-span-3"
          >
            <div className="tw:bg-gradient-to-br tw:from-brand-blue tw:to-[#1e40af] tw:p-6 tw:text-white tw:sm:p-8">
              <p className="tw:text-sm tw:font-medium tw:text-white/75">{t('monthlyLabel')}</p>
              <p className="tw:mt-1 tw:text-4xl tw:font-bold tw:sm:text-5xl" aria-live="polite">
                {hasResult ? money(emi) : dash}
              </p>
              <p className="tw:mt-1 tw:text-xs tw:text-white/60">
                {t('over', { months: tenure, rate })}
                {selected ? ` · ${selected.modelRange}` : ''}
              </p>
              <dl className="tw:mt-6 tw:grid tw:grid-cols-3 tw:gap-4 tw:border-t tw:border-white/15 tw:pt-5">
                {[
                  { label: t('loanAmount'), value: loan },
                  { label: t('totalInterest'), value: totalInterest },
                  { label: t('totalPayable'), value: totalPayable + down },
                ].map((item) => (
                  <div key={item.label}>
                    <dt className="tw:text-[11px] tw:text-white/60">{item.label}</dt>
                    <dd className="tw:m-0 tw:mt-1 tw:text-sm tw:font-semibold tw:sm:text-base">
                      {hasResult ? money(item.value) : dash}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="tw:space-y-6 tw:p-6 tw:sm:p-8">
              <div>
                <label htmlFor="emi-price" className="tw:text-sm tw:font-medium tw:text-brand-ink/70">
                  {t('vehiclePrice')}
                </label>
                <div className="tw:mt-2 tw:flex tw:items-center tw:gap-2 tw:rounded-xl tw:border tw:border-brand-ink/10 tw:bg-surface tw:px-4 tw:focus-within:ring-2 tw:focus-within:ring-brand-blue-light">
                  <span className="tw:text-sm tw:font-semibold tw:text-brand-ink/50">LKR</span>
                  <input
                    id="emi-price"
                    inputMode="numeric"
                    value={priceInput ? Number(priceInput).toLocaleString('en-LK') : ''}
                    onChange={(event) => setPriceInput(event.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder={t('pricePlaceholder')}
                    className="tw:w-full tw:border-0 tw:bg-transparent tw:py-3 tw:text-base tw:font-semibold tw:text-brand-ink tw:outline-none"
                  />
                </div>
                {!selected?.price && (
                  <p className="tw:mt-1.5 tw:text-xs tw:text-brand-ink/50">{t('priceHint')}</p>
                )}
              </div>

              <SliderField
                id="emi-down"
                label={t('downPayment')}
                display={`${downPct}%${hasResult ? ` · ${money(down)}` : ''}`}
              >
                <input
                  id="emi-down"
                  type="range"
                  min={0}
                  max={60}
                  step={5}
                  value={downPct}
                  onChange={(event) => setDownPct(Number(event.target.value))}
                  className={sliderClasses}
                />
              </SliderField>

              <SliderField id="emi-tenure" label={t('tenure')} display={t('months', { months: tenure })}>
                <input
                  id="emi-tenure"
                  type="range"
                  min={6}
                  max={maxTenure}
                  step={6}
                  value={tenure}
                  onChange={(event) => setTenure(Number(event.target.value))}
                  className={sliderClasses}
                />
              </SliderField>

              <SliderField id="emi-rate" label={t('interestRate')} display={`${rate}%`}>
                <input
                  id="emi-rate"
                  type="range"
                  min={0}
                  max={30}
                  step={0.5}
                  value={rate}
                  onChange={(event) => setRate(Number(event.target.value))}
                  className={sliderClasses}
                />
              </SliderField>

              <button
                type="button"
                onClick={() => setApplyOpen(true)}
                className="tw:inline-flex tw:w-full tw:cursor-pointer tw:items-center tw:justify-center tw:gap-2 tw:rounded-full tw:border-0 tw:bg-brand-blue tw:px-6 tw:py-3.5 tw:text-sm tw:font-semibold tw:text-white tw:transition tw:hover:bg-brand-blue-light"
              >
                {t('apply')}
                <svg viewBox="0 0 24 24" className="tw:h-4 tw:w-4" fill="none" aria-hidden="true">
                  <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <p className="tw:text-xs tw:leading-relaxed tw:text-brand-ink/50">{financing.disclaimer || t('disclaimer')}</p>

              {financing.partners.length > 0 && (
                <div className="tw:border-t tw:border-brand-ink/10 tw:pt-5">
                  <p className="tw:text-xs tw:font-semibold tw:text-brand-ink/50">{t('partners')}</p>
                  <div className="tw:mt-3 tw:flex tw:flex-wrap tw:items-center tw:gap-6">
                    {financing.partners.map((partner) =>
                      partner.logo ? (
                        <Image
                          key={partner.name}
                          src={partner.logo}
                          alt={partner.name}
                          width={96}
                          height={32}
                          className="tw:h-8 tw:w-auto tw:object-contain tw:opacity-70 tw:grayscale"
                        />
                      ) : (
                        <span key={partner.name} className="tw:text-sm tw:font-semibold tw:text-brand-ink/60">
                          {partner.name}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal open={applyOpen} onClose={() => setApplyOpen(false)}>
        <InquiryForm
          compact
          lockType
          defaultType="Finance"
          title={t('applyTitle')}
          description={t('applyDescription')}
          defaultMessage={
            hasResult
              ? t('applyMessage', {
                  model: selected ? `${selected.modelRange} ${modelLabel(selected)}` : '',
                  price: money(price),
                  down: downPct,
                  months: tenure,
                  emi: money(emi),
                })
              : undefined
          }
        />
      </Modal>
    </section>
  )
}

export default PricingFinanceClient
