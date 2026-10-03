export type Specs = {
  motor?: {
    motorType?: string | null
    ratedPower?: string | null
    maxPower?: string | null
    peakTorque?: string | null
    driveType?: string | null
    driveModes?: string | null
  } | null
  battery?: {
    capacity?: string | null
    waterResistance?: string | null
  } | null
  comfort?: {
    driverSeat?: string | null
    passengerSeat?: string | null
    instrumentCluster?: string | null
    gloveBox?: string | null
    cabinLight?: string | null
    mobileCharger?: string | null
    bottleHolder?: string | null
  } | null
  transmission?: { type?: string | null } | null
  chassis?: { type?: string | null } | null
  suspension?: { frontRear?: string | null } | null
  brakes?: { frontRear?: string | null; regenerativeBraking?: string | null } | null
  tyres?: { rimSize?: string | null; tyreSize?: string | null } | null
  electricals?: {
    battery?: string | null
    headLamp?: string | null
    tailLamp?: string | null
    turnSignal?: string | null
    warningLamps?: string | null
  } | null
  dimensions?: {
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
  chargerRating?: string | null
  chargingTime?: string | null
  rangePerCharge?: string | null
} | null

/** Keys map to `Specs.categories.*` / `Specs.rows.*` in the message files. */
export type SpecRowData = { key: string; value?: string | null }
export type SpecCategoryData = { key: string; rows: SpecRowData[] }

const hasValue = (value?: string | null) => value !== undefined && value !== null && value !== ''

export const buildCategories = (
  specs?: Specs | null,
  charging?: Charging,
  { keepEmpty = false }: { keepEmpty?: boolean } = {},
): SpecCategoryData[] => {
  if (!specs && !charging && !keepEmpty) return []
  const s = specs || {}

  const categories: SpecCategoryData[] = [
    {
      key: 'motor',
      rows: [
        { key: 'motorType', value: s.motor?.motorType },
        { key: 'ratedPower', value: s.motor?.ratedPower },
        { key: 'maxPower', value: s.motor?.maxPower },
        { key: 'peakTorque', value: s.motor?.peakTorque },
        { key: 'driveType', value: s.motor?.driveType },
        { key: 'driveModes', value: s.motor?.driveModes },
      ],
    },
    {
      key: 'battery',
      rows: [
        { key: 'batteryCapacity', value: s.battery?.capacity },
        { key: 'waterResistance', value: s.battery?.waterResistance },
      ],
    },
    {
      key: 'comfort',
      rows: [
        { key: 'driverSeat', value: s.comfort?.driverSeat },
        { key: 'passengerSeat', value: s.comfort?.passengerSeat },
        { key: 'instrumentCluster', value: s.comfort?.instrumentCluster },
        { key: 'gloveBox', value: s.comfort?.gloveBox },
        { key: 'cabinLight', value: s.comfort?.cabinLight },
        { key: 'mobileCharger', value: s.comfort?.mobileCharger },
        { key: 'bottleHolder', value: s.comfort?.bottleHolder },
      ],
    },
    { key: 'transmission', rows: [{ key: 'transmissionType', value: s.transmission?.type }] },
    { key: 'chassis', rows: [{ key: 'chassisType', value: s.chassis?.type }] },
    { key: 'suspension', rows: [{ key: 'suspension', value: s.suspension?.frontRear }] },
    {
      key: 'brakes',
      rows: [
        { key: 'brakes', value: s.brakes?.frontRear },
        { key: 'regenerativeBraking', value: s.brakes?.regenerativeBraking },
      ],
    },
    {
      key: 'tyres',
      rows: [
        { key: 'rimSize', value: s.tyres?.rimSize },
        { key: 'tyreSize', value: s.tyres?.tyreSize },
      ],
    },
    {
      key: 'electricals',
      rows: [
        { key: 'electricalBattery', value: s.electricals?.battery },
        { key: 'headLamp', value: s.electricals?.headLamp },
        { key: 'tailLamp', value: s.electricals?.tailLamp },
        { key: 'turnSignal', value: s.electricals?.turnSignal },
        { key: 'warningLamps', value: s.electricals?.warningLamps },
      ],
    },
    {
      key: 'dimensions',
      rows: [
        { key: 'groundClearance', value: s.dimensions?.groundClearance },
        { key: 'kerbWeight', value: s.dimensions?.kerbWeight },
        { key: 'overallHeight', value: s.dimensions?.overallHeight },
        { key: 'overallLength', value: s.dimensions?.overallLength },
        { key: 'overallWidth', value: s.dimensions?.overallWidth },
        { key: 'wheelTrack', value: s.dimensions?.wheelTrack },
        { key: 'wheelbase', value: s.dimensions?.wheelbase },
      ],
    },
    { key: 'gradeability', rows: [{ key: 'gradeability', value: s.gradeability }] },
    {
      key: 'charging',
      rows: [
        { key: 'charger', value: charging?.chargerRating },
        { key: 'chargingTime', value: charging?.chargingTime },
        { key: 'rangePerCharge', value: charging?.rangePerCharge },
      ],
    },
  ]

  if (keepEmpty) return categories

  return categories
    .map((category) => ({ ...category, rows: category.rows.filter((row) => hasValue(row.value)) }))
    .filter((category) => category.rows.length > 0)
}
