import dynamic from 'next/dynamic'

const LazyColorVideoSpin = dynamic(() => import('./ColorVideoSpin'), { ssr: true })

export default LazyColorVideoSpin
