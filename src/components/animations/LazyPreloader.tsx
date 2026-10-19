'use client'

import dynamic from 'next/dynamic'

// Server-rendered so the loading screen covers the page from the first paint (no flash underneath).
const LazyPreloader = dynamic(() => import('./Preloader'), { ssr: true })

export default LazyPreloader
