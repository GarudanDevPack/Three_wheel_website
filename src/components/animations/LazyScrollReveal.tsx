import dynamic from 'next/dynamic'

const LazyScrollReveal = dynamic(() => import('./ScrollReveal'), { ssr: true })

export default LazyScrollReveal
