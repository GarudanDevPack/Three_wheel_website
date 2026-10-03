import dynamic from 'next/dynamic'

const LazyChassisFrameReveal = dynamic(() => import('./ChassisFrameReveal'), { ssr: true })

export default LazyChassisFrameReveal
