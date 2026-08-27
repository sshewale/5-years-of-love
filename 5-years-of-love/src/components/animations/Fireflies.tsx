// ─── Fireflies.tsx — 30 glowing animated dots ────────────────────────────────
import { motion } from 'framer-motion'
import { useMemo } from 'react'

const FIREFLY_COUNT = 30

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}


interface FireflyConfig {
  id: number
  top: number
  left: number
  size: number
  driftX: number
  driftY: number
  opacityMin: number
  opacityMax: number
  duration: number
  delay: number
  glowColor: string  // vary between warm gold and soft pink
}

function generateFireflies(): FireflyConfig[] {
  const glowColors = [
    'rgba(255, 215, 0, 0.7)',
    'rgba(255, 180, 120, 0.65)',
    'rgba(255, 214, 224, 0.6)',
  ]
  return Array.from({ length: FIREFLY_COUNT }, (_, i) => ({
    id: i,
    top: randomBetween(5, 95),
    left: randomBetween(5, 95),
    size: randomBetween(3, 7),
    driftX: randomBetween(-40, 40),
    driftY: randomBetween(-40, 40),
    opacityMin: randomBetween(0.15, 0.35),
    opacityMax: randomBetween(0.65, 1.0),
    duration: randomBetween(3, 8),
    delay: randomBetween(0, 5),
    glowColor: glowColors[i % glowColors.length],
  }))
}

export default function Fireflies() {
  const flies = useMemo(() => generateFireflies(), [])

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
      {flies.map((fly) => (
        <motion.div
          key={fly.id}
          initial={{
            top: `${fly.top}%`,
            left: `${fly.left}%`,
            opacity: fly.opacityMin,
            rotate: 0,
          }}
          animate={{
            x: [0, fly.driftX, -fly.driftX * 0.6, fly.driftX * 0.3, 0],
            y: [0, fly.driftY * 0.6, fly.driftY, -fly.driftY * 0.4, 0],
            opacity: [fly.opacityMin, fly.opacityMax, fly.opacityMin * 1.5, fly.opacityMax * 0.8, fly.opacityMin],
            rotate: [0, 15, -10, 8, 0],
            scale: [1, 1.3, 0.9, 1.1, 1],
          }}
          transition={{
            duration: fly.duration,
            delay: fly.delay,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            width: fly.size,
            height: fly.size,
            borderRadius: '50%',
            backgroundColor: '#FFD700',
            boxShadow: `0 0 ${fly.size * 2}px ${fly.size}px ${fly.glowColor}, 0 0 ${fly.size * 5}px ${fly.size * 2}px ${fly.glowColor.replace('0.7', '0.25').replace('0.65', '0.2').replace('0.6', '0.18')}`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  )
}
