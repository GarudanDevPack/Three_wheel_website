'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { CONSENT_CHANGE_EVENT, readConsent, type Consent } from '@/lib/analytics'

const Analytics = ({ measurementId }: { measurementId?: string }) => {
  const [consent, setConsent] = useState<Consent | null>(null)

  useEffect(() => {
    setConsent(readConsent())
    const onChange = (event: Event) => setConsent((event as CustomEvent<Consent>).detail)
    window.addEventListener(CONSENT_CHANGE_EVENT, onChange)
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange)
  }, [])

  if (!measurementId || consent !== 'granted') return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', { analytics_storage: 'granted' });
gtag('js', new Date());
gtag('config', '${measurementId}');`}
      </Script>
    </>
  )
}

export default Analytics
