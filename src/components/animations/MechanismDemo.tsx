'use client'

import OptimizedVideo from '@/components/ui/OptimizedVideo'

/** CMS mechanism clip: lazy, paused off-screen, poster when the admin uploaded one. */
const MechanismDemo = ({ src, webm, poster }: { src: string; webm?: string | null; poster?: string | null }) => (
  <OptimizedVideo
    mp4Src={src}
    webmSrc={webm}
    poster={poster}
    posterSizes="(min-width: 768px) 768px, 100vw"
    className="tw:relative tw:mx-auto tw:aspect-video tw:max-w-3xl tw:rounded-2xl"
    mediaClassName="tw:object-contain"
  />
)

export default MechanismDemo
