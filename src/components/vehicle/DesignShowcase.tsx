'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { animate, onScroll } from 'animejs'
import SectionBackdrop from '@/components/ui/SectionBackdrop'

type Tab = {
  key: string
  label: string
  heading: string
  description: string
  image: string
  alt: string
}

const tabs: Tab[] = [
  {
    key: 'powertrain',
    label: 'Powertrain',
    heading: 'Built to work harder',
    description:
      'A rugged 150cc air-cooled engine and reinforced chassis, engineered for daily commercial use and long routes without compromise.',
    image: '/images/auto/design-powertrain.jpg',
    alt: 'Neptune three-wheeler bare chassis and engine',
  },
  {
    key: 'interior',
    label: 'Interior',
    heading: 'Comfort that keeps up',
    description:
      'Durable bench seating and a driver-first layout keep passengers comfortable and cargo secure, trip after trip.',
    image: '/images/auto/design-interior.jpg',
    alt: 'Neptune three-wheeler interior seating',
  },
  {
    key: 'exterior',
    label: 'Exterior',
    heading: 'A shape that means business',
    description:
      'A practical, road-ready silhouette built for visibility and durability on daily routes, in every kind of weather.',
    image: '/images/auto/design-exterior.png',
    alt: 'Neptune three-wheeler exterior on the road',
  },
]

const DesignShowcase = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const active = tabs[activeIndex]

  useEffect(() => {
    const section = sectionRef.current
    const items = section?.querySelectorAll('[data-design-item]')
    if (!section || !items?.length) return

    const animation = animate(items, {
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 600,
      ease: 'outQuad',
      autoplay: onScroll({ target: section }),
    })

    return () => {
      animation.revert()
    }
  }, [])

  const selectTab = (index: number) => {
    if (index === activeIndex) return

    const targets = [textRef.current, photoRef.current].filter(
      (el): el is HTMLDivElement => el !== null,
    )
    if (!targets.length) {
      setActiveIndex(index)
      return
    }

    animate(targets, {
      opacity: [1, 0],
      duration: 150,
      ease: 'inQuad',
      onComplete: () => {
        setActiveIndex(index)
        animate(targets, {
          opacity: [0, 1],
          duration: 250,
          ease: 'outQuad',
        })
      },
    })
  }

  return (
    <section id="design" className="tw:relative tw:isolate tw:overflow-hidden tw:bg-surface-raised tw:py-20">
      <SectionBackdrop src="/images/auto/blue-360-side-b.jpg" variant="soft" base="raised" />
      <div ref={sectionRef} className="tw:mx-auto tw:max-w-6xl tw:px-6">
        <div className="tw:grid tw:items-center tw:gap-10 tw:md:grid-cols-2">
          <div ref={textRef} data-design-item className="tw:opacity-0">
            <p className="tw:text-sm tw:font-semibold tw:uppercase tw:tracking-widest tw:text-brand-blue-light">
              Design
            </p>
            <p className="tw:mt-2 tw:text-lg tw:font-bold tw:text-brand-blue-light">{active.heading}</p>
            <h2 className="tw:mt-3 tw:text-3xl tw:font-bold tw:text-white">One vehicle, every detail</h2>
            <p className="tw:mt-4 tw:max-w-md tw:text-white/70">{active.description}</p>
          </div>

          <div
            ref={photoRef}
            data-design-item
            className="tw:relative tw:aspect-[4/3] tw:w-full tw:overflow-hidden tw:rounded-2xl tw:opacity-0"
          >
            <Image src={active.image} alt={active.alt} fill className="tw:object-cover" />
          </div>
        </div>

        <div data-design-item className="tw:mt-10 tw:flex tw:flex-wrap tw:justify-center tw:gap-2 tw:opacity-0">
          {tabs.map((tab, index) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => selectTab(index)}
              className={`tw:rounded-full tw:px-5 tw:py-2 tw:text-sm tw:font-semibold tw:transition ${
                index === activeIndex
                  ? 'tw:bg-brand-blue tw:text-white'
                  : 'tw:bg-surface tw:text-white/70 tw:hover:bg-surface-raised'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DesignShowcase
