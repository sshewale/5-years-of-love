// ─── Scroll-triggered visibility hook (IntersectionObserver) ──────────────
import { useRef, useState, useEffect, type RefObject } from 'react'

interface UseScrollAnimationReturn {
  // React 19 / TypeScript strict: useRef initialises to null, so the ref type
  // is RefObject<HTMLDivElement | null>.
  ref: RefObject<HTMLDivElement | null>
  inView: boolean
}

/**
 * useScrollAnimation
 *
 * Returns a ref to attach to any HTMLDivElement and a boolean `inView` that
 * becomes true once the element scrolls into the viewport.
 *
 * Once an element has entered the viewport the observer is disconnected so
 * the animation only fires once (enter-once behaviour).
 *
 * @param threshold - fraction of the element that must be visible before
 *   `inView` flips to true. Defaults to 0.15 (15 %).
 */
export function useScrollAnimation(threshold = 0.15): UseScrollAnimationReturn {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // If IntersectionObserver is unavailable (very old browsers), show
    // immediately so content is never permanently hidden.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setInView(true)
          // Disconnect once visible — animation plays once only
          observer.disconnect()
        }
      },
      { threshold },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold])

  return { ref, inView }
}
