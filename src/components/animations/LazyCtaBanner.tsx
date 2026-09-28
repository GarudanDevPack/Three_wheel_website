import dynamic from 'next/dynamic'

const LazyCtaBanner = dynamic(() => import('@/components/vehicle/CtaBanner'), { ssr: true })

export default LazyCtaBanner
