// ─── Confetti / celebration effect hook ───────────────────────────────────
import { useCallback, useRef, useEffect } from 'react'
import confetti from 'canvas-confetti'

interface UseConfettiReturn {
  /** Standard confetti burst from the bottom-centre. */
  fireBurst: () => void
  /** Heart-shaped emoji rain from the top. */
  fireHearts: () => void
  /** Full-screen multi-cannon celebration blast. */
  fireCelebration: () => void
}

// Brand colours for consistent theming
const BRAND_COLORS = [
  '#B76E79', // rose-gold (primary)
  '#FFD6E0', // pink-soft (accent)
  '#E8D5F5', // lavender (secondary)
  '#F5ECD7', // beige-warm (background)
  '#FF85A1', // hot pink
  '#C9A0DC', // medium purple
]

/**
 * useConfetti
 *
 * Provides three celebration effects built on top of canvas-confetti.
 * None of them auto-fire; call the returned functions at the right moment.
 * All internal setTimeout IDs are tracked and cleared on unmount.
 */
export function useConfetti(): UseConfettiReturn {
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  // Clear all pending timers on unmount to prevent no-op calls after navigation
  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout)
    }
  }, [])

  // ── fireBurst ─────────────────────────────────────────────────────────────
  const fireBurst = useCallback(() => {
    void confetti({
      particleCount: 120,
      spread: 80,
      origin: { x: 0.5, y: 0.85 },
      colors: BRAND_COLORS,
      gravity: 0.9,
      scalar: 1.1,
      ticks: 200,
    })
  }, [])

  // ── fireHearts ────────────────────────────────────────────────────────────
  const fireHearts = useCallback(() => {
    // canvas-confetti supports custom shapes via the `shapes` option;
    // we use the built-in emoji shape which renders Unicode characters.
    const heartShape = confetti.shapeFromText({ text: '❤️', scalar: 2 })
    const pinkHeartShape = confetti.shapeFromText({ text: '🩷', scalar: 2 })
    const sparkleShape = confetti.shapeFromText({ text: '✨', scalar: 2 })

    const commonOptions: confetti.Options = {
      particleCount: 30,
      spread: 60,
      gravity: 0.6,
      scalar: 2,
      drift: 0,
      ticks: 300,
    }

    // Fire from multiple positions across the top of the screen
    void confetti({
      ...commonOptions,
      shapes: [heartShape, pinkHeartShape],
      origin: { x: 0.2, y: 0 },
    })
    void confetti({
      ...commonOptions,
      shapes: [heartShape, sparkleShape],
      origin: { x: 0.5, y: 0 },
    })
    void confetti({
      ...commonOptions,
      shapes: [pinkHeartShape, sparkleShape],
      origin: { x: 0.8, y: 0 },
    })
  }, [])

  // ── fireCelebration ───────────────────────────────────────────────────────
  const fireCelebration = useCallback(() => {
    // Left cannon
    void confetti({
      particleCount: 180,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: BRAND_COLORS,
      gravity: 0.8,
      scalar: 1.2,
      ticks: 400,
    })

    // Right cannon (slight delay for a staggered effect)
    const t1 = setTimeout(() => {
      void confetti({
        particleCount: 180,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors: BRAND_COLORS,
        gravity: 0.8,
        scalar: 1.2,
        ticks: 400,
      })
    }, 150)
    timers.current.push(t1)

    // Top-centre finale burst
    const t2 = setTimeout(() => {
      void confetti({
        particleCount: 250,
        spread: 100,
        startVelocity: 45,
        origin: { x: 0.5, y: 0.3 },
        colors: BRAND_COLORS,
        gravity: 0.7,
        scalar: 1.3,
        ticks: 500,
      })
    }, 400)
    timers.current.push(t2)
  }, [])

  return { fireBurst, fireHearts, fireCelebration }
}
