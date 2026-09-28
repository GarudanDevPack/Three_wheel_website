import dynamic from 'next/dynamic'

const LazyDesignShowcase = dynamic(() => import('./DesignShowcase'), { ssr: true })

export default LazyDesignShowcase
