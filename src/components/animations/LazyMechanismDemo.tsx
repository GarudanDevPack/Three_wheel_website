import dynamic from 'next/dynamic'

const LazyMechanismDemo = dynamic(() => import('./MechanismDemo'), { ssr: true })

export default LazyMechanismDemo
