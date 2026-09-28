import dynamic from 'next/dynamic'

const LazyGalleryReveal = dynamic(() => import('./GalleryReveal'), { ssr: true })

export default LazyGalleryReveal
