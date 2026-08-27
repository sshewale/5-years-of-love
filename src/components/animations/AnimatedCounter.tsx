// ─── AnimatedCounter.tsx — Spring-animated number counter ─────────────────────
import { useEffect, useRef } from 'react'
import { useMotionValue, useSpring, useTransform, motion } from 'framer-motion'

interface AnimatedCounterProps {
  to: number
  duration?: number   // ms (default 1500)
  className?: string
  suffix?: string
  inView: boolean
}

export default function AnimatedCounter({
  to,
  duration = 1500,
  className = '',
  suffix = '',
  inView,
}: AnimatedCounterProps) {
  const raw = useMotionValue(0)
  const hasStarted = useRef(false)

  // Spring stiffness/damping tuned to approximate `duration`
  // Higher duration → softer spring (lower stiffness)
  const stiffness = Math.max(20, 2000000 / (duration * duration))
  const damping = Math.max(10, stiffness * 0.4)

  const spring = useSpring(raw, { stiffness, damping, restDelta: 0.5 })
  const displayed = useTransform(spring, (v) => Math.round(v).toString())

  useEffect(() => {
    if (inView && !hasStarted.current) {
      hasStarted.current = true
      raw.set(to)
    }
  }, [inView, to, raw])

  return (
    <span className={className} aria-label={`${to}${suffix}`}>
      <motion.span>{displayed}</motion.span>
      {suffix && <span>{suffix}</span>}
    </span>
  )
}
