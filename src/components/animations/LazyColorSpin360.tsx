import dynamic from 'next/dynamic'

const LazyColorSpin360 = dynamic(() => import('./ColorSpin360'), { ssr: true })

export default LazyColorSpin360
