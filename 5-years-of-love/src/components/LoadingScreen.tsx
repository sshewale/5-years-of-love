// ─── LoadingScreen ──────────────────────────────────────────────────────────
// Full-screen loading splash shown on first visit.
// Animated SVG heart pulses, text fades in, then the whole screen fades out
// after 2 seconds and calls onComplete().

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LoadingScreenProps {
  onComplete: () => void
}

// SVG heart path (standard heart shape, centred at 50 50)
const HEART_PATH =
  'M50,85 C50,85 10,58 10,32 C10,18 21,8 35,8 C42,8 48,12 50,16 C52,12 58,8 65,8 C79,8 90,18 90,32 C90,58 50,85 50,85 Z'

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 2000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      <motion.div
        key="loading-screen"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        role="status"
        aria-label="Loading our story, please wait"
        aria-live="polite"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F5ECD7',
          gap: '1.75rem',
        }}
      >
        {/* Pulsing heart */}
        <motion.div
          animate={{
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 1.4,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
          aria-hidden="true"
        >
          <svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d={HEART_PATH} fill="#B76E79" />
            {/* Inner highlight */}
            <path
              d="M35,20 C30,20 26,24 26,30 C26,36 32,44 38,50"
              stroke="#FFD6E0"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
            />
          </svg>
        </motion.div>

        {/* Fade-in text */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.35rem',
            fontWeight: 600,
            color: '#B76E79',
            letterSpacing: '0.02em',
            textAlign: 'center',
          }}
        >
          Loading Our Story…
        </motion.p>

        {/* Subtle dot-pulse indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          style={{ display: 'flex', gap: '0.4rem' }}
          aria-hidden="true"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#B76E79',
                display: 'inline-block',
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
