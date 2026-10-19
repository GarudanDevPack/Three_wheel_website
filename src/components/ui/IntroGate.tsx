'use client'

import { useEffect } from 'react'
import { markIntroDone } from '@/lib/intro'

/** Pages without a loading screen (thank-you, 404): reveal the floating buttons straight away. */
const IntroGate = () => {
  useEffect(() => {
    if (!document.getElementById('preloader')) markIntroDone()
  }, [])
  return null
}

export default IntroGate
