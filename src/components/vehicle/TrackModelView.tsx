'use client'

import { useEffect, useRef } from 'react'
import { trackEvent } from '@/lib/analytics'

/** GA4 `model_view`, once per /vehicles/[slug] page view (the ref guards against re-renders). */
const TrackModelView = ({ model }: { model: string }) => {
  const sent = useRef(false)
  useEffect(() => {
    if (sent.current) return
    sent.current = true
    trackEvent('model_view', { model })
  }, [model])
  return null
}

export default TrackModelView
