import dynamic from 'next/dynamic'

const LazyChargingBanner = dynamic(() => import('./ChargingBanner'), { ssr: true })

export default LazyChargingBanner
