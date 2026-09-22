import dynamic from 'next/dynamic'

const LazyVariantReveal = dynamic(() => import('./VariantReveal'), { ssr: true })

export default LazyVariantReveal
