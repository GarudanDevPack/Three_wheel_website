import dynamic from 'next/dynamic'

const LazyChargingRoute = dynamic(() => import('./ChargingRoute'), { ssr: true })

export default LazyChargingRoute
