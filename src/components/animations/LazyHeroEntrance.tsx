import dynamic from 'next/dynamic'

const LazyHeroEntrance = dynamic(() => import('./HeroEntrance'), { ssr: true })

export default LazyHeroEntrance
