/**
 * Shared by the enquiry form (browser) and the server action, so both apply the same rules.
 *
 * Sri Lankan numbers: optional +94 / 0094 / 0 prefix followed by 9 digits — mobiles (07x xxx xxxx)
 * and landlines (e.g. 021 785 6180). Spaces, dashes, dots and brackets are ignored.
 */
export const normalizeSriLankaPhone = (raw: string): string | null => {
  const compact = raw.replace(/[\s\-().]/g, '')
  const match = compact.match(/^(?:\+94|0094|94|0)(\d{9})$/)
  if (!match) return null
  const national = match[1]
  // Sri Lankan subscriber numbers never start with 0 after the prefix.
  if (national.startsWith('0')) return null
  return `0${national}`
}

/**
 * HTML `pattern` for the phone input (browser-side check; the server re-checks with the function above).
 * Browsers compile `pattern` with the RegExp `v` flag, where ( ) . - must be escaped inside [...].
 */
export const SRI_LANKA_PHONE_PATTERN = '^\\s*\\(?(\\+94|0094|94|0)[\\s\\-\\(\\)\\.]*[1-9]([\\s\\-\\(\\)\\.]*\\d){8}\\s*$'

export const NAME_MIN = 2
export const NAME_MAX = 80
export const MESSAGE_MAX = 2000
/** Submissions faster than this after the form appeared are treated as bots. */
export const MIN_FILL_MS = 3000
