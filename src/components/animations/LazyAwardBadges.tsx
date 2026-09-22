import dynamic from 'next/dynamic'

const LazyAwardBadges = dynamic(() => import('./AwardBadges'), { ssr: true })

export default LazyAwardBadges
