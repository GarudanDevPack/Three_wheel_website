'use client'

import dynamic from 'next/dynamic'

const LazyFloatingVehicleWidget = dynamic(() => import('./FloatingVehicleWidget'), {
  ssr: false,
})

export default LazyFloatingVehicleWidget
