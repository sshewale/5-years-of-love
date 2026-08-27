// ─── ForeverPromise.tsx — Closing "forever" screen ────────────────────────────
import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Share2, Check } from 'lucide-react'
import FloatingHearts from '../components/animations/FloatingHearts'
import StarField from '../components/animations/StarField'
import { ANNIVERSARY_CONFIG, STORAGE_KEYS } from '../utils/constants'
import { computeYearsOfLove, computeDaysTogether } from '../utils/formatters'
import { birthdayMessages as defaultMsgs } from '../data/birthdayMessages'
import { getStorageItem } from '../utils/storage'
import type { BirthdayMessages } from '../types'

// ── helpers ──────────────────────────────────────────────────────────────────

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/** ms since wedding */
function msSinceWedding(): number {
  const wedding = new Date(
    ANNIVERSARY_CONFIG.year,
    ANNIVERSARY_CONFIG.month - 1,
    ANNIVERSARY_CONFIG.day,
    0, 0, 0, 0
  )
  return Math.max(0, Date.now() - wedding.getTime())
}

interface TimeTogether {
  years: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

function computeTimeTogether(): TimeTogether {
  const ms = msSinceWedding()
  const totalSec = Math.floor(ms / 1000)
  const seconds = totalSec % 60
  const totalMin = Math.floor(totalSec / 60)
  const minutes = totalMin % 60
  const totalHours = Math.floor(totalMin / 60)
  const hours = totalHours % 24
  // approximate years/remaining days
  const years = computeYearsOfLove()
  const days = computeDaysTogether() % 365
  return { years, days, hours, minutes, seconds }
}

function weddingDateLabel(): string {
  const d = new Date(
    ANNIVERSARY_CONFIG.year,
    ANNIVERSARY_CONFIG.month - 1,
    ANNIVERSARY_CONFIG.day
  )
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

// ── component ─────────────────────────────────────────────────────────────────

// ── Share button (light variant for dark background) ──────────────────────────
function ForeverShareButton() {
  const [shared, setShared] = useState(false)

  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: '5 Years of Love',
          text: '❤️ I Love You More Than Yesterday, But Less Than Tomorrow ❤️',
          url: window.location.origin,
        })
      } else {
        await navigator.clipboard.writeText(window.location.origin)
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      }
    } catch {
      // User cancelled — no action needed
    }
  }, [])

  return (
    <motion.button
      onClick={handleShare}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Share this moment"
      className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B76E79]"
      style={{
        backgroundColor: shared ? 'rgba(34,197,94,0.2)' : 'rgba(183,110,121,0.2)',
        color: shared ? '#86efac' : '#FFD6E0',
        border: '1px solid',
        borderColor: shared ? 'rgba(34,197,94,0.4)' : 'rgba(255,214,224,0.3)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {shared ? <Check size={15} aria-hidden="true" /> : <Share2 size={15} aria-hidden="true" />}
      {shared ? 'Link copied!' : 'Share our story'}
    </motion.button>
  )
}

export default function ForeverPromise() {
  const msgs: BirthdayMessages =
    getStorageItem<BirthdayMessages>(STORAGE_KEYS.ADMIN_BIRTHDAY_MSG) ?? defaultMsgs

  // Split foreverPromise into words for staggered word animation
  const words = msgs.foreverPromise.split(/\s+/).filter(Boolean)

  // Live ticking timer
  const [timeTogether, setTimeTogether] = useState<TimeTogether>(computeTimeTogether)

  useEffect(() => {
    const id = window.setInterval(() => {
      setTimeTogether(computeTimeTogether())
    }, 1000)
    return () => clearInterval(id)
  }, [])

  // ── Framer Motion variants ─────────────────────────────────────────────────
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.18 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
  }

  const wordContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } },
  }

  const wordVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 py-20"
      style={{ backgroundColor: '#1A1A2E' }}
      role="main"
      aria-label="Forever Promise — Closing screen"
    >
      {/* Backgrounds */}
      <StarField />

      {/* Double FloatingHearts for denser rain — rendered twice with pointer-events none */}
      <FloatingHearts />
      {/* Second layer via a wrapper that slows hearts down via CSS filter */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          filter: 'saturate(0.7) brightness(0.75)',
          transform: 'scaleX(-1)', // mirror so positions differ
        }}
      >
        <FloatingHearts />
      </div>

      {/* Main content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center gap-12 max-w-3xl w-full text-center"
      >
        {/* 1. "And so…" */}
        <motion.p
          variants={itemVariants}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            color: '#E8D5F5',
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            opacity: 0.85,
          }}
        >
          And so…
        </motion.p>

        {/* 2. Forever promise — word by word */}
        <motion.div
          variants={wordContainerVariants}
          className="flex flex-wrap justify-center gap-x-3 gap-y-1"
          aria-label={msgs.foreverPromise}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariants}
              style={{
                fontFamily: "'Playfair Display', serif",
                color: '#B76E79',
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                fontWeight: 700,
                textShadow: '0 0 20px rgba(183,110,121,0.5)',
                display: 'inline-block',
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>

        {/* 3. Divider — pulsing heart (fade-in via variant, then pulse loops) */}
        <motion.div variants={itemVariants} aria-hidden="true">
          <motion.span
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            style={{ fontSize: '2.5rem', lineHeight: 1, display: 'inline-block' }}
          >
            ❤️
          </motion.span>
        </motion.div>

        {/* 4. Anniversary counter */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center gap-3"
        >
          <p
            style={{
              color: '#FFD6E0',
              fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
              opacity: 0.85,
            }}
          >
            Together since{' '}
            <span style={{ fontWeight: 600, color: '#E8D5F5' }}>
              {weddingDateLabel()}
            </span>
          </p>

          {/* Years + days summary */}
          <p
            style={{
              color: '#FFD6E0',
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
              fontStyle: 'italic',
            }}
          >
            {timeTogether.years} year{timeTogether.years !== 1 ? 's' : ''} ·{' '}
            {timeTogether.days} day{timeTogether.days !== 1 ? 's' : ''}
          </p>

          {/* Live ticking HH:MM:SS */}
          <div
            className="flex items-center gap-4"
            aria-live="polite"
            aria-label={`${timeTogether.hours} hours, ${timeTogether.minutes} minutes, ${timeTogether.seconds} seconds`}
          >
            {[
              { label: 'hrs', value: timeTogether.hours },
              { label: 'min', value: timeTogether.minutes },
              { label: 'sec', value: timeTogether.seconds },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center">
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                    color: '#B76E79',
                    fontWeight: 700,
                    textShadow: '0 0 12px rgba(183,110,121,0.5)',
                    lineHeight: 1,
                    minWidth: '2.5ch',
                    textAlign: 'center',
                    display: 'block',
                  }}
                >
                  {pad(value)}
                </span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    color: 'rgba(255,214,224,0.6)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 5. "I Love You ❤️" — final, large */}
        <motion.p
          variants={itemVariants}
          style={{
            fontFamily: "'Playfair Display', serif",
            color: '#FFD6E0',
            fontSize: 'clamp(2rem, 7vw, 4rem)',
            fontWeight: 900,
            textShadow:
              '0 0 40px rgba(255,214,224,0.6), 0 0 80px rgba(183,110,121,0.4)',
            lineHeight: 1.2,
          }}
        >
          I Love You ❤️
        </motion.p>

        {/* Share button */}
        <motion.div variants={itemVariants}>
          <ForeverShareButton />
        </motion.div>

        {/* Start over link */}
        <motion.div
          variants={itemVariants}
        >
          <Link
            to="/"
            style={{
              color: 'rgba(255,214,224,0.45)',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.8rem',
              textDecoration: 'none',
              letterSpacing: '0.08em',
              transition: 'color 0.2s',
            }}
            aria-label="Start the journey over from the beginning"
            onMouseEnter={(e) => {
              ;(e.target as HTMLAnchorElement).style.color = 'rgba(255,214,224,0.8)'
            }}
            onMouseLeave={(e) => {
              ;(e.target as HTMLAnchorElement).style.color = 'rgba(255,214,224,0.45)'
            }}
          >
            Start Over ❤️
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
