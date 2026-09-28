import dynamic from 'next/dynamic'

const LazyChargingStats = dynamic(() => import('./ChargingStats'), { ssr: true })

export default LazyChargingStats
