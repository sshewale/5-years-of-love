// ─── SurpriseCountdownPage.tsx — 30-second dramatic countdown ─────────────────
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import FloatingHearts from '../components/animations/FloatingHearts'
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage'
import { surpriseCountdownMsgs } from '../data/surpriseCountdownMsgs'

const COUNTDOWN_KEY = 'swati_countdown_started'
const TOTAL_SECONDS = 30

// SVG progress ring constants
const RADIUS = 90
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

// Returns remaining seconds (0–30) from a saved start timestamp.
function getRemainingSeconds(startTs: number): number {
  const elapsed = (Date.now() - startTs) / 1000
  return Math.max(0, Math.ceil(TOTAL_SECONDS - elapsed))
}

export default function SurpriseCountdownPage() {
  const navigate = useNavigate()

  // ── Initialise: resume or start fresh ────────────────────────────────────
  const [seconds, setSeconds] = useState<number>(() => {
    const saved = getStorageItem<number>(COUNTDOWN_KEY)
    if (saved !== null) {
      const remaining = getRemainingSeconds(saved)
      if (remaining > 0) return remaining
    }
    const now = Date.now()
    setStorageItem(COUNTDOWN_KEY, now)
    return TOTAL_SECONDS
  })

  const [msgIndex, setMsgIndex] = useState(0)

  // Ref to hold the start timestamp for the progress ring
  const startTsRef = useRef<number>(
    (() => {
      const saved = getStorageItem<number>(COUNTDOWN_KEY)
      if (saved !== null && getRemainingSeconds(saved) > 0) return saved
      return Date.now()
    })()
  )

  // ── Countdown tick ────────────────────────────────────────────────────────
  useEffect(() => {
    if (seconds <= 0) {
      removeStorageItem(COUNTDOWN_KEY)
      void navigate('/surprise')
      return
    }

    const id = window.setInterval(() => {
      setSeconds((prev) => {
        const next = prev - 1
        if (next <= 0) {
          clearInterval(id)
          removeStorageItem(COUNTDOWN_KEY)
          void navigate('/surprise')
          return 0
        }
        return next
      })
    }, 1000)

    return () => clearInterval(id)
    // navigate is stable; seconds drives re-registration on each decrement
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Message rotation every 7 s ────────────────────────────────────────────
  useEffect(() => {
    const id = window.setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % surpriseCountdownMsgs.length)
    }, 7000)
    return () => clearInterval(id)
  }, [])

  // ── Progress ring: stroke-dashoffset derived from elapsed time ────────────
  // We keep the ring synced to wall-clock elapsed time, not the seconds state,
  // so it animates smoothly every render.
  const elapsed = Math.min(
    TOTAL_SECONDS,
    (Date.now() - startTsRef.current) / 1000
  )
  const progress = elapsed / TOTAL_SECONDS // 0 → 1
  const dashOffset = CIRCUMFERENCE * (1 - progress)

  return (
    // Full-screen dark overlay — sits on top of everything via fixed positioning
    <div
      style={{ backgroundColor: '#1A1A2E' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      role="main"
      aria-label="Surprise countdown"
    >
      {/* Background hearts */}
      <FloatingHearts />

      {/* SVG progress ring + countdown number */}
      <div className="relative z-10 flex items-center justify-center mb-10">
        {/* SVG ring */}
        <svg
          width={RADIUS * 2 + 20}
          height={RADIUS * 2 + 20}
          viewBox={`0 0 ${RADIUS * 2 + 20} ${RADIUS * 2 + 20}`}
          aria-hidden="true"
          className="absolute"
        >
          {/* Track */}
          <circle
            cx={RADIUS + 10}
            cy={RADIUS + 10}
            r={RADIUS}
            fill="none"
            stroke="rgba(183,110,121,0.2)"
            strokeWidth="6"
          />
          {/* Progress arc */}
          <circle
            cx={RADIUS + 10}
            cy={RADIUS + 10}
            r={RADIUS}
            fill="none"
            stroke="#B76E79"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            style={{
              transformOrigin: `${RADIUS + 10}px ${RADIUS + 10}px`,
              transform: 'rotate(-90deg)',
              transition: 'stroke-dashoffset 1s linear',
              filter: 'drop-shadow(0 0 8px rgba(183,110,121,0.8))',
            }}
          />
        </svg>

        {/* Animated number — dramatic pop at 10, 5, 1 */}
        <AnimatePresence mode="wait">
          <motion.span
            key={seconds}
            initial={
              seconds <= 5
                ? { scale: 2.2, opacity: 0 }
                : seconds <= 10
                ? { scale: 1.6, opacity: 0 }
                : { scale: 1.3, opacity: 0 }
            }
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={
              seconds <= 5
                ? { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
                : seconds <= 10
                ? { duration: 0.32, ease: 'easeOut' }
                : { duration: 0.22, ease: 'easeOut' }
            }
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize:
                seconds <= 5
                  ? 'clamp(7rem, 22vw, 11rem)'
                  : seconds <= 10
                  ? 'clamp(6.5rem, 20vw, 10rem)'
                  : 'clamp(6rem, 18vw, 9rem)',
              lineHeight: 1,
              color: seconds <= 3 ? '#FFD6E0' : '#B76E79',
              textShadow:
                seconds <= 3
                  ? '0 0 40px rgba(255,214,224,1), 0 0 80px rgba(183,110,121,0.8)'
                  : seconds <= 10
                  ? '0 0 40px rgba(183,110,121,1), 0 0 80px rgba(183,110,121,0.7)'
                  : '0 0 30px rgba(183,110,121,0.8), 0 0 60px rgba(183,110,121,0.5)',
              fontWeight: 700,
              userSelect: 'none',
            }}
            aria-live="polite"
            aria-label={`${seconds} seconds remaining`}
          >
            {seconds}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Rotating anticipation messages */}
      <div
        className="relative z-10 h-12 flex items-center justify-center px-8"
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="text-center text-lg md:text-2xl"
            style={{
              color: '#FFD6E0',
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              textShadow: '0 0 20px rgba(255,214,224,0.4)',
            }}
          >
            {surpriseCountdownMsgs[msgIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Small "hold on" label above number */}
      <motion.p
        className="absolute top-10 left-0 right-0 text-center text-sm tracking-widest uppercase"
        animate={{
          opacity: seconds <= 5 ? [0.6, 1, 0.6] : [0.4, 0.6, 0.4],
          scale: seconds <= 5 ? [1, 1.08, 1] : 1,
        }}
        transition={{ duration: seconds <= 5 ? 0.8 : 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ color: 'rgba(255,214,224,0.7)', letterSpacing: '0.25em' }}
      >
        {seconds <= 3 ? '✨ Almost There ✨' : seconds <= 10 ? 'Get Ready…' : 'Get Ready…'}
      </motion.p>
    </div>
  )
}
