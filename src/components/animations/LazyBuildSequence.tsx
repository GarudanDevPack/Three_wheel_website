import dynamic from 'next/dynamic'

const LazyBuildSequence = dynamic(() => import('./BuildSequence'), { ssr: true })

export default LazyBuildSequence
