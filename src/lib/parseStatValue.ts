export type ParsedStat = {
  target: number | null
  unit: string
  decimals: number
  raw: string
}

export const parseStatValue = (raw: string): ParsedStat => {
  const match = raw.trim().match(/^(\d+(?:\.\d+)?)\s*(.*)$/)
  if (!match) return { target: null, unit: '', decimals: 0, raw }

  const decimals = match[1].includes('.') ? match[1].split('.')[1].length : 0
  return { target: Number(match[1]), unit: match[2], decimals, raw }
}
