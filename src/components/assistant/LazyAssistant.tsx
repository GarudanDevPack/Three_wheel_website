'use client'

import dynamic from 'next/dynamic'

const LazyAssistant = dynamic(() => import('./AssistantLauncher'), {
  ssr: false,
})

export default LazyAssistant
