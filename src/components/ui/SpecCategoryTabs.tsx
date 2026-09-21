'use client'

import { useState } from 'react'
import SpecsTable, { type SpecRow } from './SpecsTable'

export type Specs = {
  engine?: {
    type?: string | null
    displacement?: string | null
    ignitionSystem?: string | null
    maxPower?: string | null
    maxTorque?: string | null
    maxSpeed?: string | null
    starting?: string | null
  } | null
  transmission?: { type?: string | null } | null
  chassis?: { type?: string | null } | null
  suspension?: { frontRear?: string | null } | null
  brakes?: { frontRear?: string | null } | null
  tyres?: { rimSize?: string | null; tyreSize?: string | null } | null
  electricals?: {
    battery?: string | null
    headLamp?: string | null
    tailLamp?: string | null
    turnSignal?: string | null
    warningLamps?: string | null
  } | null
  dimensions?: {
    fuelTankCapacity?: string | null
    groundClearance?: string | null
    kerbWeight?: string | null
    overallHeight?: string | null
    overallLength?: string | null
    overallWidth?: string | null
    wheelTrack?: string | null
    wheelbase?: string | null
  } | null
  gradeability?: string | null
}

export type Charging = {
  homeChargerTime?: string | null
  acCommercialChargerTime?: string | null
  fastChargerTime?: string | null
  rangePerCharge?: string | null
} | null

type Category = { key: string; label: string; rows: SpecRow[] }

const buildCategories = (specs?: Specs | null, charging?: Charging): Category[] => {
  if (!specs) return []

  const categories: Category[] = [
    {
      key: 'engine',
      label: 'Engine',
      rows: [
        { label: 'Type', value: specs.engine?.type },
        { label: 'Displacement', value: specs.engine?.displacement },
        { label: 'Ignition System', value: specs.engine?.ignitionSystem },
        { label: 'Max Power', value: specs.engine?.maxPower },
        { label: 'Max Torque', value: specs.engine?.maxTorque },
        { label: 'Max Speed', value: specs.engine?.maxSpeed },
        { label: 'Starting', value: specs.engine?.starting },
      ],
    },
    {
      key: 'transmission',
      label: 'Transmission',
      rows: [{ label: 'Type', value: specs.transmission?.type }],
    },
    { key: 'chassis', label: 'Chassis', rows: [{ label: 'Type', value: specs.chassis?.type }] },
    {
      key: 'suspension',
      label: 'Suspension',
      rows: [{ label: 'Front / Rear', value: specs.suspension?.frontRear }],
    },
    {
      key: 'brakes',
      label: 'Brakes',
      rows: [{ label: 'Front / Rear', value: specs.brakes?.frontRear }],
    },
    {
      key: 'tyres',
      label: 'Tyres',
      rows: [
        { label: 'Rim Size', value: specs.tyres?.rimSize },
        { label: 'Tyre Size', value: specs.tyres?.tyreSize },
      ],
    },
    {
      key: 'electricals',
      label: 'Electricals',
      rows: [
        { label: 'Battery', value: specs.electricals?.battery },
        { label: 'Head Lamp', value: specs.electricals?.headLamp },
        { label: 'Tail Lamp', value: specs.electricals?.tailLamp },
        { label: 'Turn Signal', value: specs.electricals?.turnSignal },
        { label: 'Warning Lamps', value: specs.electricals?.warningLamps },
      ],
    },
    {
      key: 'dimensions',
      label: 'Dimensions',
      rows: [
        { label: 'Fuel Tank Capacity', value: specs.dimensions?.fuelTankCapacity },
        { label: 'Ground Clearance', value: specs.dimensions?.groundClearance },
        { label: 'Kerb Weight', value: specs.dimensions?.kerbWeight },
        { label: 'Overall Height', value: specs.dimensions?.overallHeight },
        { label: 'Overall Length', value: specs.dimensions?.overallLength },
        { label: 'Overall Width', value: specs.dimensions?.overallWidth },
        { label: 'Wheel Track', value: specs.dimensions?.wheelTrack },
        { label: 'Wheelbase', value: specs.dimensions?.wheelbase },
      ],
    },
    {
      key: 'gradeability',
      label: 'Gradeability',
      rows: [{ label: 'Gradeability', value: specs.gradeability }],
    },
    {
      key: 'charging',
      label: 'Charging',
      rows: [
        { label: 'Home Charger', value: charging?.homeChargerTime },
        { label: 'AC Commercial Charger', value: charging?.acCommercialChargerTime },
        { label: 'Fast Charger', value: charging?.fastChargerTime },
        { label: 'Range per Charge', value: charging?.rangePerCharge },
      ],
    },
  ]

  return categories
    .map((category) => ({
      ...category,
      rows: category.rows.filter(
        (row) => row.value !== undefined && row.value !== null && row.value !== '',
      ),
    }))
    .filter((category) => category.rows.length > 0)
}

const SpecCategoryTabs = ({
  specs,
  charging,
}: {
  specs?: Specs | null
  charging?: Charging
}) => {
  const categories = buildCategories(specs, charging)
  const [activeKey, setActiveKey] = useState(categories[0]?.key)

  if (!categories.length) return null

  const active = categories.find((category) => category.key === activeKey) || categories[0]

  return (
    <div>
      <div className="tw:flex tw:flex-wrap tw:gap-2">
        {categories.map((category) => (
          <button
            key={category.key}
            type="button"
            onClick={() => setActiveKey(category.key)}
            className={`tw:rounded-full tw:px-3 tw:py-1.5 tw:text-xs tw:font-semibold tw:transition ${
              category.key === active.key
                ? 'tw:bg-brand-ink tw:text-white'
                : 'tw:bg-gray-100 tw:text-brand-ink tw:hover:bg-gray-200'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
      <div className="tw:mt-4">
        <SpecsTable rows={active.rows} />
      </div>
    </div>
  )
}

export default SpecCategoryTabs
