import dynamic from 'next/dynamic'

const LazyModelSelectorClient = dynamic(() => import('./ModelSelectorClient'), { ssr: true })

export default LazyModelSelectorClient
