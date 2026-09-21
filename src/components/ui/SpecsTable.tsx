export type SpecRow = { label: string; value?: string | null }

const SpecsTable = ({ rows }: { rows: SpecRow[] }) => {
  const populated = rows.filter((row) => row.value !== undefined && row.value !== null && row.value !== '')
  if (!populated.length) return null

  return (
    <table className="tw:w-full tw:border-collapse tw:overflow-hidden tw:rounded-xl tw:bg-white tw:text-sm tw:shadow-sm">
      <tbody>
        {populated.map((row) => (
          <tr key={row.label} className="tw:border-b tw:border-black/5 tw:last:border-0">
            <th className="tw:w-1/2 tw:px-4 tw:py-3 tw:text-left tw:font-medium tw:text-gray-500">
              {row.label}
            </th>
            <td className="tw:px-4 tw:py-3 tw:font-semibold tw:text-brand-ink">{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default SpecsTable
