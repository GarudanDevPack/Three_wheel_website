import { getTranslations } from 'next-intl/server'
import GalleryReveal from '@/components/animations/LazyGalleryReveal'
import SectionBackdrop from '@/components/ui/SectionBackdrop'

// Alt text for each photo lives under `Gallery.photos.<key>`.
const photos = [
  { src: '/images/auto/gallery-1.webp', key: 'front' },
  { src: '/images/auto/gallery-2.webp', key: 'rear' },
  { src: '/images/auto/gallery-3.webp', key: 'side' },
  { src: '/images/auto/gallery-4.webp', key: 'cabin' },
  { src: '/images/auto/gallery-5.webp', key: 'usb' },
] as const

const Gallery = async () => {
  const t = await getTranslations('Gallery')

  return (
    <section id="gallery" className="tw:relative tw:isolate tw:overflow-hidden tw:bg-surface tw:py-20">
      <SectionBackdrop src="/images/auto/gallery-2.webp" variant="soft" base="surface" />
      <div className="tw:relative tw:z-10 tw:mx-auto tw:max-w-6xl tw:px-6">
        <h2 className="tw:text-3xl tw:font-bold tw:text-brand-ink">{t('title')}</h2>
        <GalleryReveal photos={photos.map((photo) => ({ src: photo.src, alt: t(`photos.${photo.key}`) }))} />
      </div>
    </section>
  )
}

export default Gallery
