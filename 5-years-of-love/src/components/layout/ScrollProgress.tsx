// ─── ScrollProgress ────────────────────────────────────────────────────────
// Fixed top bar showing reading/scroll progress as a rose-gold gradient line.

import { useState, useEffect } from 'react'

export function ScrollProgress() {
  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight
      const viewportHeight = window.innerHeight
      const scrollable = docHeight - viewportHeight

      if (scrollable <= 0) {
        setProgress(0)
        return
      }

      const pct = Math.min(100, Math.max(0, (scrollY / scrollable) * 100))
      setProgress(pct)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // initialise on mount

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        zIndex: 50,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(to right, #B76E79, #FFD6E0)',
          transition: 'width 0.1s linear',
        }}
      />
    </div>
  )
}
