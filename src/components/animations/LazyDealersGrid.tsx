import dynamic from 'next/dynamic'

const LazyDealersGrid = dynamic(() => import('./DealersGrid'), { ssr: true })

export default LazyDealersGrid
