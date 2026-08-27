// ─── Celebration.tsx — Cinematic "5 Years of Love" celebration page ──────────
import type { CSSProperties } from 'react'
import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { birthdayMessages } from '../data/birthdayMessages'
import { poetryMessages } from '../data/poetryMessages'
import type { PoetryMessage } from '../types'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useConfetti } from '../hooks/useConfetti'
import AnimatedCounter from '../components/animations/AnimatedCounter'
import FloatingHearts from '../components/animations/FloatingHearts'
import StarField from '../components/animations/StarField'
import Button from '../components/ui/Button'
import GlassCard from '../components/ui/GlassCard'

// ── Sparkle dot component (random positioned) ─────────────────────────────────
interface SparkleConfig {
  id: number
  top: string
  left: string
  size: number
  delay: number
  duration: number
}

function generateSparkles(count: number): SparkleConfig[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: 4 + Math.random() * 8,
    delay: Math.random() * 3,
    duration: 1.2 + Math.random() * 1.5,
  }))
}

function SparkleField({ count = 18 }: { count?: number }) {
  const sparkles = useMemo(() => generateSparkles(count), [count])

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1.3, 0.5],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            repeatDelay: Math.random() * 2,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            backgroundColor: '#B76E79',
            boxShadow: `0 0 ${s.size + 4}px #B76E79, 0 0 ${s.size * 2}px #FFD6E080`,
          }}
        />
      ))}
    </div>
  )
}

// ── Kavita (poetry) section ───────────────────────────────────────────────────
interface KavitaSectionProps {
  poem: PoetryMessage
  baseDelay: number
}

function KavitaSection({ poem, baseDelay }: KavitaSectionProps) {
  const { ref, inView } = useScrollAnimation(0.15)
  const isHindi = poem.lang === 'hi'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.8, delay: 0.1 }}
      className="my-12"
      role="region"
      aria-label={isHindi ? 'Hindi poem' : 'Marathi poem'}
    >
      <motion.div whileHover={{ scale: 1.02, boxShadow: '0 8px 32px rgba(183,110,121,0.3)' }} transition={{ duration: 0.25 }}>
      <GlassCard className="p-8 text-center">
        {/* Poem badge */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <div
            className="h-px flex-1"
            style={{ backgroundColor: '#B76E7930' }}
          />
          <span
            className="text-xs font-medium tracking-widest uppercase px-3"
            style={{ color: '#B76E7999', fontFamily: "'Inter', sans-serif" }}
          >
            {isHindi ? 'हिंदी कविता' : 'मराठी कविता'}
          </span>
          <div
            className="h-px flex-1"
            style={{ backgroundColor: '#B76E7930' }}
          />
        </div>

        {/* Title */}
        <motion.h3
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: baseDelay + 0.2 }}
          className="text-2xl font-semibold italic mb-6"
          style={{
            fontFamily: "'Noto Sans Devanagari', sans-serif",
            color: '#B76E79',
          }}
        >
          {poem.title}
        </motion.h3>

        {/* Lines */}
        <div
          className="space-y-1"
          style={{
            fontFamily: "'Noto Sans Devanagari', sans-serif",
            color: '#e8d5f5',
            fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
            lineHeight: 2,
          }}
        >
          {poem.lines.map((line, i) =>
            line === '' ? (
              <div key={i} className="h-3" aria-hidden="true" />
            ) : (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                transition={{
                  delay: baseDelay + 0.3 + i * 0.15,
                  duration: 0.5,
                }}
              >
                {line}
              </motion.p>
            ),
          )}
        </div>
      </GlassCard>
      </motion.div>
    </motion.div>
  )
}

// ── Word-by-word fade-in heading ──────────────────────────────────────────────
function WordFadeHeading({
  text,
  delay = 0,
  className,
  style,
}: {
  text: string
  delay?: number
  className?: string
  style?: CSSProperties
}) {
  const words = text.split(' ')
  return (
    <span className={className} style={style} aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: delay + i * 0.12,
            duration: 0.5,
            ease: 'easeOut',
          }}
          className="inline-block"
          style={{ marginRight: '0.35em' }}
          aria-hidden="true"
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

// ── Celebration intro lines ───────────────────────────────────────────────────
function CelebrationIntro({ text, startDelay }: { text: string; startDelay: number }) {
  const lines = text.split('\n').filter(Boolean)
  return (
    <div className="text-center mb-8" aria-label="Celebration message">
      {lines.map((line, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: startDelay + i * 0.2,
            duration: 0.6,
            ease: 'easeOut',
          }}
          className="mb-1"
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: 'clamp(1.1rem, 3vw, 1.35rem)',
            color: '#FFD6E0',
            lineHeight: 1.8,
          }}
        >
          {line}
        </motion.p>
      ))}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Celebration() {
  const navigate = useNavigate()
  const { fireCelebration } = useConfetti()

  const hiPoem = poetryMessages.find((p) => p.lang === 'hi')
  const mrPoem = poetryMessages.find((p) => p.lang === 'mr')

  // Fire celebration confetti on mount
  useEffect(() => {
    const t = setTimeout(() => fireCelebration(), 800)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main
      className="relative min-h-screen overflow-x-hidden"
      style={{ backgroundColor: '#1A1A2E' }}
      aria-label="5 Years of Love celebration"
    >
      {/* Background layers */}
      <StarField />
      <FloatingHearts />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-20">
        {/* ── Hero section ── */}
        <section className="text-center mb-16" aria-label="Anniversary hero">
          {/* Sparkle field around heading */}
          <div className="relative inline-block">
            <SparkleField count={14} />

            {/* Animated "5" counter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.9,
                type: 'spring',
                stiffness: 160,
                damping: 14,
              }}
              className="relative"
            >
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(7rem, 20vw, 10rem)',
                  color: '#B76E79',
                  lineHeight: 1,
                  textShadow: '0 0 60px #B76E7966, 0 0 120px #B76E7933',
                  display: 'block',
                  fontWeight: 700,
                }}
              >
                <AnimatedCounter
                  to={5}
                  duration={1800}
                  inView={true}
                />
              </span>
            </motion.div>
          </div>

          {/* "Years of Love" heading */}
          <div className="mt-2 mb-8">
            <h1
              aria-label="Years of Love"
              className="text-5xl md:text-6xl font-bold"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: '#B76E79',
                lineHeight: 1.2,
              }}
            >
              <WordFadeHeading
                text="Years of Love ❤️"
                delay={0.6}
              />
            </h1>
          </div>

          {/* Celebration intro copy */}
          <CelebrationIntro
            text={birthdayMessages.celebrationIntro}
            startDelay={1.4}
          />

          {/* Sparkle icon row */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.2, duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-10"
            aria-hidden="true"
          >
            <Sparkles size={16} color="#B76E79" />
            <Sparkles size={22} color="#FFD6E0" />
            <Sparkles size={16} color="#B76E79" />
          </motion.div>
        </section>

        {/* ── Rose-gold divider ── */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 2.0, duration: 0.8, ease: 'easeInOut' }}
          className="mb-16"
          aria-hidden="true"
        >
          <div className="flex items-center gap-4">
            <div
              className="flex-1 h-px"
              style={{
                background: 'linear-gradient(90deg, transparent, #B76E79, transparent)',
              }}
            />
            <span style={{ color: '#B76E79', fontSize: '1.25rem' }}>✦</span>
            <div
              className="flex-1 h-px"
              style={{
                background: 'linear-gradient(90deg, transparent, #B76E79, transparent)',
              }}
            />
          </div>
        </motion.div>

        {/* ── Poetry sections ── */}
        {hiPoem && <KavitaSection poem={hiPoem} baseDelay={0.2} />}
        {mrPoem && <KavitaSection poem={mrPoem} baseDelay={0.2} />}

        {/* ── CTA button ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: 'easeOut' }}
          className="text-center mt-16"
        >
          <p
            className="mb-6 text-sm tracking-wider uppercase"
            style={{ color: '#B76E7980', fontFamily: "'Inter', sans-serif" }}
            aria-hidden="true"
          >
            Ready for your surprise?
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/countdown')}
            ariaLabel="Continue to the surprise countdown"
            className="shadow-[0_0_30px_rgba(183,110,121,0.5)]"
          >
            Continue to Surprise →
          </Button>
        </motion.div>

        {/* Bottom breathing room */}
        <div className="h-20" aria-hidden="true" />
      </div>
    </main>
  )
}
