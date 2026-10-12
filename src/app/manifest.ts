import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Neptune Three-Wheelers',
    short_name: 'Neptune',
    description: 'Neptune three-wheeler auto rickshaws — built for daily loads and longer routes.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f5f9ff',
    // Ring orange from the eagle logo.
    theme_color: '#fe6d00',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  }
}
