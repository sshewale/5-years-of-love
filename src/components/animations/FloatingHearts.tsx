// ─── FloatingHearts.tsx — 20 animated floating heart emojis ──────────────────
import { motion } from 'framer-motion'
import { useMemo } from 'react'

const HEARTS = ['❤️', '🩷', '💕']
const HEART_COUNT = 20

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

interface HeartConfig {
  id: number
  emoji: string
  x: number        // vw units (0–100)
  driftX: number   // horizontal wobble in px (±40)
  size: number     // px
  opacity: number
  duration: number // seconds
  delay: number    // seconds
  rotate: number   // final rotation in degrees
}

function generateHearts(): HeartConfig[] {
  return Array.from({ length: HEART_COUNT }, (_, i) => ({
    id: i,
    emoji: HEARTS[i % HEARTS.length],
    x: randomBetween(5, 90),
    driftX: randomBetween(-40, 40),
    size: randomBetween(16, 32),
    opacity: randomBetween(0.4, 0.9),
    duration: randomBetween(5, 10),
    delay: randomBetween(0, 6),
    rotate: randomBetween(-30, 30),
  }))
}

export default function FloatingHearts() {
  // Stable across re-renders for the lifetime of the component
  const hearts = useMemo(() => generateHearts(), [])

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{
            y: '100vh',
            x: `${heart.x}vw`,
            opacity: heart.opacity,
            rotate: 0,
          }}
          animate={{
            y: '-10vh',
            x: [`${heart.x}vw`, `calc(${heart.x}vw + ${heart.driftX}px)`, `${heart.x}vw`],
            opacity: [heart.opacity, heart.opacity * 0.85, heart.opacity * 0.7, 0],
            rotate: [0, heart.rotate * 0.5, heart.rotate, heart.rotate * 0.3],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            repeatDelay: randomBetween(0, 4),
            ease: 'easeOut',
            x: { duration: heart.duration, ease: 'easeInOut' },
            rotate: { duration: heart.duration, ease: 'easeInOut' },
          }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            fontSize: heart.size,
            lineHeight: 1,
            userSelect: 'none',
            willChange: 'transform, opacity',
          }}
        >
          {heart.emoji}
        </motion.div>
      ))}
    </div>
  )
}
