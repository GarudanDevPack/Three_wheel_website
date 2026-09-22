import dynamic from 'next/dynamic'

const LazyStatCounters = dynamic(() => import('./StatCounters'), { ssr: true })

export default LazyStatCounters
