// ─── Landing.tsx — Hero page for "5 Years of Love" ────────────────────────────
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import StarField from '../components/animations/StarField'
import Fireflies from '../components/animations/Fireflies'
import FloatingHearts from '../components/animations/FloatingHearts'
import Typewriter from '../components/animations/Typewriter'
import BirthdayCountdown from '../components/BirthdayCountdown'
import Button from '../components/ui/Button'
import { birthdayMessages } from '../data/birthdayMessages'
import { computeYearsOfLove } from '../utils/formatters'

// ── Balloon colours (rose-gold / pink / lavender palette) ─────────────────────
const BALLOON_CONFIGS = [
  { color: '#B76E79', x: '10%', delay: 0.0, size: 56 },
  { color: '#FFD6E0', x: '25%', delay: 0.15, size: 48 },
  { color: '#E8D5F5', x: '50%', delay: 0.05, size: 64 },
  { color: '#B76E79', x: '72%', delay: 0.2,  size: 52 },
  { color: '#FFD6E0', x: '88%', delay: 0.1,  size: 44 },
] as const

// ── Balloon SVG ───────────────────────────────────────────────────────────────
interface BalloonProps {
  color: string
  size: number
}

function Balloon({ color, size }: BalloonProps) {
  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 60 78"
      aria-hidden="true"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Balloon body */}
      <ellipse cx="30" cy="28" rx="26" ry="28" fill={color} opacity="0.88" />
      {/* Shine */}
      <ellipse cx="22" cy="17" rx="6" ry="8" fill="white" opacity="0.28" />
      {/* Knot */}
      <circle cx="30" cy="56" r="3" fill={color} opacity="0.8" />
      {/* String */}
      <path
        d="M30 59 Q26 65 30 72 Q34 78 30 78"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  )
}

// ── Stagger variants ──────────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
}

// ── Landing ───────────────────────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate()
  const years = useMemo(() => computeYearsOfLove(), [])

  // Split hero message into lines for individual paragraph rendering
  const heroLines = useMemo(
    () => birthdayMessages.heroMessage.split('\n').filter(Boolean),
    [],
  )

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          'linear-gradient(160deg, #F5ECD7 0%, rgba(255,214,224,0.35) 60%, #F5ECD7 100%)',
      }}
    >
      {/* ── Fixed background layers ───────────────────────────────────────── */}
      <StarField />
      <Fireflies />
      <FloatingHearts />

      {/* ── Floating balloons ─────────────────────────────────────────────── */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-[1]">
        {BALLOON_CONFIGS.map((cfg, i) => (
          <motion.div
            key={i}
            initial={{ y: '110vh', x: cfg.x, opacity: 0, rotate: 0 }}
            animate={{
              y: [null, '-15vh'],
              opacity: [0, 1, 1, 0.6],
              rotate: [0, (i % 2 === 0 ? 1 : -1) * 4, (i % 2 === 0 ? -1 : 1) * 4, 0],
            }}
            transition={{
              duration: 6 + i * 0.8,
              delay: cfg.delay,
              ease: 'easeOut',
              opacity: { duration: 6 + i * 0.8, times: [0, 0.1, 0.85, 1] },
              rotate: {
                duration: 3 + i * 0.5,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
                delay: cfg.delay + 1,
              },
            }}
            style={{ position: 'absolute', bottom: 0, left: 0 }}
          >
            <Balloon color={cfg.color} size={cfg.size} />
          </motion.div>
        ))}
      </div>

      {/* ── Hero content ──────────────────────────────────────────────────── */}
      <motion.main
        className="relative z-10 flex flex-col items-center text-center px-6 py-16 max-w-3xl mx-auto gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        aria-label="Birthday hero section"
      >
        {/* Years heading */}
        <motion.h1
          variants={itemVariants}
          style={{
            fontFamily: "'Playfair Display', serif",
            textShadow: '0 2px 4px rgba(183,110,121,0.15)',
          }}
          className="text-6xl sm:text-7xl md:text-8xl font-bold text-[#B76E79] leading-tight drop-shadow-sm"
          animate={{
            textShadow: [
              '0 2px 4px rgba(183,110,121,0.15)',
              '0 2px 4px rgba(183,110,121,0.15), 0 0 24px rgba(183,110,121,0.45)',
              '0 2px 4px rgba(183,110,121,0.15)',
            ],
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        >
          {years} Years of Love
        </motion.h1>

        {/* Hero message */}
        <motion.div variants={itemVariants} className="flex flex-col gap-2">
          {heroLines.map((line, idx) => (
            <p
              key={idx}
              className={[
                'text-base sm:text-lg leading-relaxed',
                idx === 0
                  ? 'text-[#B76E79] font-semibold text-xl sm:text-2xl'
                  : 'text-[#5a4040]/80',
              ].join(' ')}
            >
              {line}
            </p>
          ))}
        </motion.div>

        {/* Typewriter */}
        <motion.div
          variants={itemVariants}
          className="text-[#B76E79]/70 italic text-lg sm:text-xl min-h-[2rem]"
          style={{ fontFamily: "'Dancing Script', cursive" }}
          aria-live="polite"
        >
          <Typewriter text="Every moment with you is our story…" speed={70} />
        </motion.div>

        {/* Divider */}
        <motion.div variants={itemVariants} className="w-24 h-px bg-[#B76E79]/30 mx-auto" />

        {/* Birthday countdown */}
        <motion.div variants={itemVariants} className="w-full">
          <BirthdayCountdown />
        </motion.div>

        {/* CTA */}
        <motion.div variants={itemVariants}>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/timeline')}
            ariaLabel="Enter our story and explore the timeline"
            className="shadow-[0_4px_24px_rgba(183,110,121,0.35)] hover:shadow-[0_6px_32px_rgba(183,110,121,0.55)] transition-shadow"
          >
            Enter Our Story →
          </Button>
        </motion.div>
      </motion.main>

      {/* ── Subtle vignette ───────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[2]"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 55%, rgba(245,236,215,0.45) 100%)',
        }}
      />
    </div>
  )
}
