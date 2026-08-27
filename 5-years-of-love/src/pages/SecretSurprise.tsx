// ─── SecretSurprise.tsx — Password reveal + birthday celebration ───────────────
import { useState, useEffect, useCallback, useRef, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import FloatingHearts from '../components/animations/FloatingHearts'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import { useConfetti } from '../hooks/useConfetti'
import { SECRET_PASSWORD, STORAGE_KEYS } from '../utils/constants'
import { getStorageItem } from '../utils/storage'
import { birthdayMessages as defaultMsgs } from '../data/birthdayMessages'
import type { BirthdayMessages } from '../types'

const MAX_ATTEMPTS = 3

// Split multi-line strings into lines for stagger animation
function splitLines(text: string): string[] {
  return text.split('\n').filter((l) => l.trim().length > 0)
}

export default function SecretSurprise() {
  const navigate = useNavigate()
  const { fireCelebration, fireHearts } = useConfetti()

  // ── State ─────────────────────────────────────────────────────────────────
  const [input, setInput] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const celebrationFiredRef = useRef(false)

  // ── Load admin-overridden messages ────────────────────────────────────────
  const msgs: BirthdayMessages =
    getStorageItem<BirthdayMessages>(STORAGE_KEYS.ADMIN_BIRTHDAY_MSG) ?? defaultMsgs

  // ── Confetti on reveal ────────────────────────────────────────────────────
  useEffect(() => {
    if (revealed && !celebrationFiredRef.current) {
      celebrationFiredRef.current = true
      fireCelebration()
      // Extra heart burst a moment later
      setTimeout(() => fireHearts(), 600)
      setTimeout(() => fireCelebration(), 1200)
    }
  }, [revealed, fireCelebration, fireHearts])

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()

      if (input.trim() === SECRET_PASSWORD) {
        setRevealed(true)
        setErrorMsg('')
        return
      }

      const newAttempts = attempts + 1
      setAttempts(newAttempts)

      // Shake animation
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 600)

      if (newAttempts >= MAX_ATTEMPTS) {
        setErrorMsg(
          'Hint: It\'s the most special date — Her Birthday in DDMMYYYY format 💝'
        )
      } else {
        setErrorMsg(
          `That's not quite right. ${MAX_ATTEMPTS - newAttempts} attempt${
            MAX_ATTEMPTS - newAttempts === 1 ? '' : 's'
          } left.`
        )
      }

      setInput('')
      inputRef.current?.focus()
    },
    [input, attempts]
  )

  // ── Reveal lines for stagger ──────────────────────────────────────────────
  const finalRevealLines = splitLines(msgs.finalReveal)

  // ── YouTube embed helper ──────────────────────────────────────────────────
  function getYouTubeEmbedUrl(url: string): string | null {
    try {
      const u = new URL(url)
      // youtu.be/ID or youtube.com/watch?v=ID
      const id =
        u.hostname === 'youtu.be'
          ? u.pathname.slice(1)
          : u.searchParams.get('v')
      if (!id) return null
      return `https://www.youtube.com/embed/${id}?autoplay=0&rel=0`
    } catch {
      return null
    }
  }

  const embedUrl = msgs.videoUrl ? getYouTubeEmbedUrl(msgs.videoUrl) : null

  // ─────────────────────────────────────────────────────────────────────────
  // PRE-REVEAL: Password screen
  // ─────────────────────────────────────────────────────────────────────────
  if (!revealed) {
    return (
      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12"
        style={{ backgroundColor: '#F5ECD7' }}
      >
        <FloatingHearts />

        <div className="relative z-10 w-full max-w-md">
          <GlassCard className="p-8 md:p-10">
            {/* Pulsing heart icon */}
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                aria-hidden="true"
              >
                <Heart
                  size={56}
                  fill="#B76E79"
                  stroke="#B76E79"
                  strokeWidth={1}
                />
              </motion.div>
            </div>

            {/* Heading */}
            <h1
              className="text-3xl text-center mb-2"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: '#B76E79',
                fontWeight: 700,
              }}
            >
              One Last Secret…
            </h1>

            <p
              className="text-center text-sm mb-8"
              style={{ color: '#a07080', fontFamily: "'Inter', sans-serif" }}
            >
              Enter the password to reveal your birthday surprise
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>
              <motion.div
                animate={
                  isShaking
                    ? { x: [0, -10, 10, -10, 10, -6, 6, 0] }
                    : { x: 0 }
                }
                transition={{ duration: 0.5 }}
              >
                <input
                  ref={inputRef}
                  type="password"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="••••••••"
                  aria-label="Enter the secret password"
                  autoComplete="off"
                  className="w-full px-5 py-4 rounded-2xl text-center text-2xl tracking-widest outline-none transition-all duration-200"
                  style={{
                    border: '2px solid #B76E79',
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    color: '#1A1A2E',
                    fontFamily: "'Inter', sans-serif",
                    boxShadow: isShaking
                      ? '0 0 0 3px rgba(220,50,50,0.3)'
                      : '0 0 0 0px transparent',
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = '0 0 0 3px rgba(183,110,121,0.35)'
                  }}
                  onBlur={(e) => {
                    if (!isShaking) e.target.style.boxShadow = '0 0 0 0px transparent'
                  }}
                />
              </motion.div>

              {/* Hint text */}
              <p
                className="text-center text-sm mt-3"
                style={{
                  color: attempts >= MAX_ATTEMPTS ? '#B76E79' : '#b09090',
                  fontStyle: 'italic',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: attempts >= MAX_ATTEMPTS ? 600 : 400,
                  transition: 'all 0.3s',
                }}
              >
                {attempts < MAX_ATTEMPTS
                  ? 'Hint: Her Birthday (DDMMYYYY format)'
                  : 'Hint: Her Birthday (DDMMYYYY format) — Think carefully! 💝'}
              </p>

              {/* Error message */}
              <AnimatePresence>
                {errorMsg && (
                  <motion.p
                    key="error"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-sm mt-2"
                    style={{ color: '#c0505a', fontFamily: "'Inter', sans-serif" }}
                    role="alert"
                    aria-live="assertive"
                  >
                    {errorMsg}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Attempt dots */}
              {attempts > 0 && (
                <div className="flex justify-center gap-2 mt-4" aria-hidden="true">
                  {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                    <span
                      key={i}
                      className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor:
                          i < attempts
                            ? 'rgba(192,80,90,0.7)'
                            : 'rgba(183,110,121,0.2)',
                      }}
                    />
                  ))}
                </div>
              )}

              <div className="mt-8">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  ariaLabel="Reveal birthday surprise"
                >
                  Reveal ❤️
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // POST-REVEAL: Birthday celebration screen
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 py-16"
      style={{ backgroundColor: '#F5ECD7' }}
    >
      <FloatingHearts />

      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center gap-10">
        {/* Animated birthday heading */}
        <motion.h1
          initial={{ scale: 0.3, opacity: 0, rotate: -8 }}
          animate={{ scale: [1.15, 0.95, 1.05, 1], opacity: 1, rotate: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Playfair Display', serif",
            color: '#B76E79',
            fontWeight: 900,
            fontSize: 'clamp(1.6rem, 5vw, 3rem)',
            textAlign: 'center',
            textShadow: '0 0 40px rgba(183,110,121,0.7), 0 0 80px rgba(183,110,121,0.3)',
          }}
        >
          🎉 HAPPY BIRTHDAY SWATI 🎂
        </motion.h1>

        {/* Pulsing heart */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <Heart size={52} fill="#B76E79" stroke="#B76E79" />
        </motion.div>

        {/* Staggered final reveal lines */}
        <GlassCard className="p-8 md:p-10 w-full">
          <div className="space-y-3">
            {finalRevealLines.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.15, duration: 0.5, ease: 'easeOut' }}
                className="text-center"
                style={{
                  fontFamily:
                    line.startsWith('🎉') || line.startsWith('5')
                      ? "'Playfair Display', serif"
                      : "'Dancing Script', cursive",
                  color: '#3a2020',
                  fontSize:
                    line.startsWith('🎉')
                      ? 'clamp(1rem, 3vw, 1.5rem)'
                      : 'clamp(0.95rem, 2.5vw, 1.15rem)',
                  fontWeight: line.startsWith('🎉') ? 700 : 400,
                  lineHeight: 1.7,
                }}
              >
                {line}
              </motion.p>
            ))}
          </div>
        </GlassCard>

        {/* YouTube embed — only if videoUrl is present */}
        {embedUrl && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="w-full max-w-2xl"
          >
            <div
              className="rounded-2xl overflow-hidden shadow-2xl"
              style={{ aspectRatio: '16/9', position: 'relative' }}
            >
              <iframe
                src={embedUrl}
                title="Birthday video for Swati"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                style={{ border: 'none' }}
              />
            </div>
          </motion.div>
        )}

        {/* Continue button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={() => void navigate('/forever')}
            ariaLabel="Continue to Forever Promise"
          >
            Continue to Forever Promise →
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
