import GalleryReveal from '@/components/animations/LazyGalleryReveal'
import SectionBackdrop from '@/components/ui/SectionBackdrop'

const photos = [
  '/images/auto/gallery-1.png',
  '/images/auto/gallery-2.png',
  '/images/auto/gallery-3.png',
  '/images/auto/gallery-4.png',
  '/images/auto/gallery-5.png',
]

const Gallery = () => (
  <section id="gallery" className="tw:relative tw:isolate tw:overflow-hidden tw:bg-surface tw:py-20">
    <SectionBackdrop src="/images/auto/night-ride.jpg" variant="strong" base="surface" />
    <div className="tw:mx-auto tw:max-w-6xl tw:px-6">
      <h2 className="tw:text-3xl tw:font-bold tw:text-white">Gallery</h2>
      <GalleryReveal photos={photos} />
    </div>
  </section>
)

export default Gallery
