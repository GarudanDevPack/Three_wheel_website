import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Neptune Three-Wheelers',
    short_name: 'Neptune',
    description: 'Neptune three-wheeler auto rickshaws — built for daily loads and longer routes.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f5f9ff',
    theme_color: '#2563eb',
    icons: [
      { src: '/icons/garudan-logo-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/garudan-logo-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  }
}
