import { intlLocale, type AppLocale } from '@/i18n/routing'

export const formatLkr = (amount: number, locale: AppLocale) =>
  new Intl.NumberFormat(intlLocale[locale], {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0,
  }).format(Math.round(amount))

export const formatDate = (iso: string, locale: AppLocale) =>
  new Intl.DateTimeFormat(intlLocale[locale], { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(iso),
  )

/** Standard reducing-balance EMI. Returns 0 when inputs are incomplete. */
export const monthlyEmi = (principal: number, annualRatePercent: number, months: number) => {
  if (!(principal > 0) || !(months > 0)) return 0
  const r = annualRatePercent / 12 / 100
  if (r === 0) return principal / months
  const growth = Math.pow(1 + r, months)
  return (principal * r * growth) / (growth - 1)
}
