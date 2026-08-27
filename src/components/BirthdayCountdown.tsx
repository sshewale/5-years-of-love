// ─── BirthdayCountdown.tsx — Flip-card countdown to Swati's birthday ─────────
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BIRTHDAY_CONFIG } from '../utils/constants'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getNextBirthday(): Date {
  const now = new Date()
  // Use IST offset: UTC+5:30
  const istOffset = 5.5 * 60 * 60 * 1000
  const nowIST = new Date(now.getTime() + istOffset - now.getTimezoneOffset() * 60000)

  const year = nowIST.getFullYear()
  let birthday = new Date(Date.UTC(year, BIRTHDAY_CONFIG.month - 1, BIRTHDAY_CONFIG.day))
  birthday = new Date(birthday.getTime() - istOffset)

  if (now >= birthday) {
    // Already passed this year — use next year
    birthday = new Date(Date.UTC(year + 1, BIRTHDAY_CONFIG.month - 1, BIRTHDAY_CONFIG.day))
    birthday = new Date(birthday.getTime() - istOffset)
  }

  return birthday
}

function computeTimeLeft(): TimeLeft {
  const now = Date.now()
  const target = getNextBirthday().getTime()
  const diff = Math.max(0, target - now)

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function isBirthday(): boolean {
  const t = computeTimeLeft()
  return t.days === 0 && t.hours === 0 && t.minutes === 0 && t.seconds === 0
}

// ── Flip Card ─────────────────────────────────────────────────────────────────
interface FlipCardProps {
  value: number
  label: string
}

function pad(n: number) {
  return n.toString().padStart(2, '0')
}

function FlipCard({ value, label }: FlipCardProps) {
  const [prev, setPrev] = useState(value)
  const [current, setCurrent] = useState(value)
  const [flipping, setFlipping] = useState(false)
  const prevValueRef = useRef(value)

  useEffect(() => {
    if (value !== prevValueRef.current) {
      setPrev(prevValueRef.current)
      setFlipping(true)
      prevValueRef.current = value

      const t = setTimeout(() => {
        setCurrent(value)
        setFlipping(false)
      }, 350)

      return () => clearTimeout(t)
    }
  }, [value])

  const displayVal = pad(current)
  const prevVal = pad(prev)

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Card container */}
      <div
        className="relative w-20 h-24 sm:w-24 sm:h-28"
        style={{ perspective: '500px' }}
        aria-label={`${value} ${label}`}
      >
        {/* Static back card (shows new value) */}
        <div
          className={[
            'absolute inset-0 flex items-center justify-center',
            'bg-gradient-to-b from-[#B76E79] to-[#a55f6a]',
            'rounded-2xl shadow-lg',
            'text-white text-4xl sm:text-5xl font-bold font-mono',
            'select-none',
          ].join(' ')}
        >
          {displayVal}
        </div>

        {/* Flipping top half */}
        <AnimatePresence>
          {flipping && (
            <motion.div
              key={`flip-${prev}`}
              initial={{ rotateX: 0 }}
              animate={{ rotateX: -90 }}
              exit={{}}
              transition={{ duration: 0.35, ease: 'easeIn' }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '50%',
                transformOrigin: 'bottom center',
                zIndex: 10,
                borderRadius: '1rem 1rem 0 0',
                overflow: 'hidden',
                backfaceVisibility: 'hidden',
              }}
              className="flex items-center justify-center bg-gradient-to-b from-[#B76E79] to-[#c47d88] text-white text-4xl sm:text-5xl font-bold font-mono"
            >
              <span style={{ marginTop: '100%' }}>{prevVal}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fold line */}
        <div
          className="absolute left-0 right-0 bg-black/20"
          style={{ top: '50%', height: 2, zIndex: 20 }}
        />
      </div>

      <span className="text-xs sm:text-sm uppercase tracking-widest text-[#B76E79] font-semibold">
        {label}
      </span>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function BirthdayCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(computeTimeLeft)
  const [birthday, setBirthday] = useState(isBirthday)

  useEffect(() => {
    const interval = setInterval(() => {
      const t = computeTimeLeft()
      setTimeLeft(t)
      setBirthday(t.days === 0 && t.hours === 0 && t.minutes === 0 && t.seconds === 0)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  if (birthday) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [1, 1.05, 1], opacity: 1 }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: 'mirror', repeatDelay: 1.5 }}
        className="flex flex-col items-center gap-4 py-8"
        role="status"
        aria-live="polite"
      >
        <span className="text-5xl sm:text-7xl">🎂</span>
        <h2
          className="text-3xl sm:text-5xl font-bold text-[#B76E79]"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Happy Birthday Swati!
        </h2>
        <p className="text-[#B76E79]/80 text-lg">Today is your special day 🎉</p>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6" role="timer" aria-live="off">
      <p className="text-[#B76E79]/70 text-sm uppercase tracking-widest font-medium">
        Countdown to{' '}
        <span className="text-[#B76E79] font-semibold">{BIRTHDAY_CONFIG.label}</span>
      </p>

      <div className="flex items-start gap-4 sm:gap-6">
        <FlipCard value={timeLeft.days} label="Days" />

        <span className="text-4xl text-[#B76E79]/50 font-light mt-6" aria-hidden="true">
          :
        </span>

        <FlipCard value={timeLeft.hours} label="Hours" />

        <span className="text-4xl text-[#B76E79]/50 font-light mt-6" aria-hidden="true">
          :
        </span>

        <FlipCard value={timeLeft.minutes} label="Mins" />

        <span className="text-4xl text-[#B76E79]/50 font-light mt-6" aria-hidden="true">
          :
        </span>

        <FlipCard value={timeLeft.seconds} label="Secs" />
      </div>
    </div>
  )
}
