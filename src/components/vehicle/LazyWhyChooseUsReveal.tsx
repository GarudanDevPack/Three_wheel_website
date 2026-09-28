import dynamic from 'next/dynamic'

const LazyWhyChooseUsReveal = dynamic(() => import('./WhyChooseUsReveal'), { ssr: true })

export default LazyWhyChooseUsReveal
