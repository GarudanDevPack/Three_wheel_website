import dynamic from 'next/dynamic'

const LazyMechanismSketch = dynamic(() => import('./MechanismSketch'), { ssr: true })

export default LazyMechanismSketch
