import { animate, type AnimationParams, type JSAnimation } from 'animejs'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

type Targets = Element | null | undefined | ArrayLike<Element | null | undefined>

const toElements = (targets: Targets): HTMLElement[] => {
  if (!targets) return []
  const list = 'length' in targets ? Array.from(targets) : [targets]
  return list.filter((el): el is HTMLElement => el instanceof HTMLElement)
}

/**
 * Scroll-triggered entrance as progressive enhancement: content is visible in the server HTML and
 * is only hidden (then animated in) when the browser can observe it, motion is allowed and the
 * trigger is still below the fold. Returns a cleanup that never leaves anything hidden.
 */
export const revealOnScroll = (
  trigger: Element | null | undefined,
  targets: Targets,
  params: AnimationParams,
  rootMargin = '0px 0px -10% 0px',
): (() => void) => {
  const elements = toElements(targets)
  if (!trigger || !elements.length) return () => {}
  if (!('IntersectionObserver' in window) || prefersReducedMotion()) return () => {}

  // Already on screen (e.g. reload mid-page): leave it as rendered.
  const rect = trigger.getBoundingClientRect()
  if (rect.top < window.innerHeight && rect.bottom > 0) return () => {}

  elements.forEach((el) => {
    el.style.opacity = '0'
  })

  let animation: JSAnimation | null = null
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return
      observer.disconnect()
      animation = animate(elements, params)
    },
    { rootMargin },
  )
  observer.observe(trigger)

  return () => {
    observer.disconnect()
    animation?.revert()
    elements.forEach((el) => {
      el.style.opacity = ''
      el.style.transform = ''
    })
  }
}
