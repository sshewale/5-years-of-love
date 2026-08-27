// ─── EasterEgg.tsx — Hidden Easter egg trigger system ────────────────────────
// 5 clicks on [data-easter="logo"] within 3s → confetti + toast
//
// Usage:
//   Wrap your app in <EasterEggProvider>.

import { useEffect, useRef, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

// ── Toast component ───────────────────────────────────────────────────────────
interface ToastProps {
  message: string
  visible: boolean
}

function EggToast({ message, visible }: ToastProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="egg-toast"
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          role="status"
          aria-live="polite"
          className={[
            'fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999]',
            'bg-[#B76E79] text-white',
            'px-6 py-4 rounded-2xl shadow-2xl',
            'text-base font-medium',
            'pointer-events-none select-none',
            'flex items-center gap-3',
          ].join(' ')}
        >
          <span className="text-2xl" aria-hidden="true">🥚</span>
          <span>{message}</span>
          <span className="text-2xl" aria-hidden="true">❤️</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Confetti burst for the egg ────────────────────────────────────────────────
function fireEggConfetti() {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.5 },
    colors: ['#B76E79', '#FFD6E0', '#E8D5F5', '#FFD700', '#ffffff'],
    ticks: 200,
    scalar: 1.1,
    gravity: 0.9,
  })
}

// ── Provider ──────────────────────────────────────────────────────────────────
interface EasterEggProviderProps {
  children: ReactNode
}

export function EasterEggProvider({ children }: EasterEggProviderProps) {
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Track logo click sequence
  const logoClickTimestamps = useRef<number[]>([])
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = useCallback((message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToastMessage(message)
    setToastVisible(true)
    toastTimer.current = setTimeout(() => setToastVisible(false), 3500)
  }, [])

  const triggerEgg = useCallback(
    (message: string) => {
      fireEggConfetti()
      showToast(message)
    },
    [showToast],
  )

  // ── Behaviour 1: Logo clicks ─────────────────────────────────────────────
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (!target.closest('[data-easter="logo"]')) return

      const now = Date.now()
      logoClickTimestamps.current.push(now)

      // Keep only clicks in the last 3 seconds
      logoClickTimestamps.current = logoClickTimestamps.current.filter(
        (t) => now - t < 3000,
      )

      if (logoClickTimestamps.current.length >= 5) {
        logoClickTimestamps.current = []
        triggerEgg('You found an Easter egg! 🥚❤️')
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [triggerEgg])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current)
    }
  }, [])

  return (
    <>
      {children}
      <EggToast message={toastMessage} visible={toastVisible} />
    </>
  )
}
