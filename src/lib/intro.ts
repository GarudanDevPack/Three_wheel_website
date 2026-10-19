/**
 * "Intro finished" signal: the loading screen has faded out (or the page has none). Hidden-until-intro
 * elements (`.intro-pop`, see tailwind.css) and the hero count-up wait for it.
 */
const INTRO_DONE_EVENT = 'neptune-intro-done'

/** Fired every time a loading screen finishes (first load and client-side navigations). */
export const markIntroDone = () => {
  document.documentElement.setAttribute('data-intro-done', '')
  window.dispatchEvent(new Event(INTRO_DONE_EVENT))
}

/**
 * Runs `callback` once the loading screen currently on the page has faded out, or right away when
 * there is none. Returns a cleanup.
 */
export const onIntroDone = (callback: () => void) => {
  if (!document.getElementById('preloader')) {
    callback()
    return () => {}
  }
  window.addEventListener(INTRO_DONE_EVENT, callback, { once: true })
  return () => window.removeEventListener(INTRO_DONE_EVENT, callback)
}
