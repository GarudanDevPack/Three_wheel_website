import dynamic from 'next/dynamic'

const LazyColorShowcase = dynamic(() => import('./ColorShowcase'), { ssr: true })

export default LazyColorShowcase
