import Image from 'next/image'

const photos = [
  '/images/auto/gallery-1.png',
  '/images/auto/gallery-2.png',
  '/images/auto/gallery-3.png',
  '/images/auto/gallery-4.png',
  '/images/auto/gallery-5.png',
]

const Gallery = () => (
  <section id="gallery" className="tw:bg-surface tw:py-20">
    <div className="tw:mx-auto tw:max-w-6xl tw:px-6">
      <h2 className="tw:text-3xl tw:font-bold tw:text-white">Gallery</h2>
      <div className="tw:mt-10 tw:columns-1 tw:gap-4 tw:sm:columns-2 tw:lg:columns-3">
        {photos.map((src) => (
          <div
            key={src}
            className="tw:relative tw:mb-4 tw:break-inside-avoid tw:overflow-hidden tw:rounded-xl"
          >
            <Image
              src={src}
              alt="Neptune three-wheeler"
              width={600}
              height={800}
              className="tw:h-auto tw:w-full tw:object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default Gallery
