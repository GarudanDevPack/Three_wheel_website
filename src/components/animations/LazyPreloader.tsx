'use client'

import dynamic from 'next/dynamic'

const LazyPreloader = dynamic(() => import('./Preloader'), { ssr: false })

export default LazyPreloader
