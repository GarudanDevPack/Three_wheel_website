import dynamic from 'next/dynamic'

const LazyHighlightsReveal = dynamic(() => import('./HighlightsReveal'), { ssr: true })

export default LazyHighlightsReveal
