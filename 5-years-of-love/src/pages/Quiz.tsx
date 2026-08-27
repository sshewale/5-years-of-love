// ─── Quiz.tsx — Step-by-step relationship quiz with animated feedback ─────────
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Heart, RotateCcw } from 'lucide-react'
import { quizQuestions } from '../data/quizQuestions'
import type { QuizQuestion } from '../types'
import { getStorageItem } from '../utils/storage'
import { useConfetti } from '../hooks/useConfetti'
import { hapticSuccess, hapticError, hapticCelebration } from '../utils/haptic'
import Button from '../components/ui/Button'
import GlassCard from '../components/ui/GlassCard'

// ── Types ─────────────────────────────────────────────────────────────────────
type AnswerState = Record<string, number> // question id → chosen option index

type OptionStatus = 'idle' | 'correct' | 'wrong' | 'reveal'

// ── Helpers ───────────────────────────────────────────────────────────────────
function getQuestions(): QuizQuestion[] {
  const adminOverride = getStorageItem<QuizQuestion[]>('swati_admin_quiz')
  if (adminOverride && adminOverride.length > 0) return adminOverride
  return quizQuestions
}

function getResultMessage(score: number, total: number): { headline: string; sub: string } {
  const pct = score / total
  if (pct === 1)
    return {
      headline: 'You know us perfectly! 💕',
      sub: "Every answer, every detail — you carry our story in your heart. That's everything.",
    }
  if (pct >= 0.75)
    return {
      headline: 'You know us so well! 🌸',
      sub: "Almost perfect — you've been paying attention, and it shows. We're so in sync.",
    }
  if (pct >= 0.5)
    return {
      headline: 'More than halfway there! 💛',
      sub: "We still have adventures ahead that will fill in all the rest. Can't wait.",
    }
  if (pct >= 0.25)
    return {
      headline: 'A few more chapters to write ✨',
      sub: "That's okay — the best parts of our story are still coming, and I'll be here for all of them.",
    }
  return {
    headline: 'Just getting started! 🌷',
    sub: "The wonderful thing about love is there's always more to discover. Ready to keep going?",
  }
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function QuizProgress({
  current,
  total,
}: {
  current: number
  total: number
}) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0
  return (
    <div
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`Question ${current} of ${total}`}
      className="mb-8"
    >
      <div className="flex justify-between text-sm mb-2" style={{ color: '#B76E7999' }}>
        <span>Question {current} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: '6px', backgroundColor: '#FFD6E040' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #B76E79, #FFD6E0)',
          }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>
    </div>
  )
}

// ── Option button ─────────────────────────────────────────────────────────────
interface OptionButtonProps {
  text: string
  index: number
  status: OptionStatus
  isLocked: boolean
  onSelect: (index: number) => void
}

function OptionButton({ text, index, status, isLocked, onSelect }: OptionButtonProps) {
  const shakeVariants = {
    idle: { x: 0 },
    shake: {
      x: [-8, 8, -6, 6, -4, 4, 0],
      transition: { duration: 0.4, ease: 'easeInOut' as const },
    },
  }

  const bgColor = () => {
    if (status === 'correct') return '#22c55e'
    if (status === 'wrong') return '#ef4444'
    if (status === 'reveal') return '#22c55e20'
    return undefined
  }

  const textColor = () => {
    if (status === 'correct' || status === 'wrong') return 'white'
    if (status === 'reveal') return '#22c55e'
    return '#3d2c2c'
  }

  const borderColor = () => {
    if (status === 'correct') return '#22c55e'
    if (status === 'wrong') return '#ef4444'
    if (status === 'reveal') return '#22c55e60'
    return '#B76E7930'
  }

  return (
    <motion.div
      variants={shakeVariants}
      animate={status === 'wrong' ? 'shake' : 'idle'}
    >
      <motion.button
        type="button"
        onClick={() => !isLocked && onSelect(index)}
        disabled={isLocked}
        whileHover={!isLocked ? { scale: 1.015, x: 4 } : {}}
        whileTap={!isLocked ? { scale: 0.98 } : {}}
        className="w-full text-left px-5 py-4 rounded-2xl border-2 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B76E79] focus-visible:ring-offset-2"
        style={{
          backgroundColor: bgColor() ?? 'rgba(255,255,255,0.5)',
          color: textColor(),
          borderColor: borderColor(),
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.95rem',
          lineHeight: 1.5,
          cursor: isLocked ? 'not-allowed' : 'pointer',
          backdropFilter: 'blur(8px)',
        }}
        aria-label={`Option ${index + 1}: ${text}`}
        aria-pressed={status !== 'idle'}
      >
        <span className="flex items-center gap-3">
          {/* Option letter */}
          <span
            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
            style={{
              backgroundColor:
                status === 'correct' || status === 'wrong'
                  ? 'rgba(255,255,255,0.25)'
                  : '#B76E7918',
              color:
                status === 'correct' || status === 'wrong'
                  ? 'white'
                  : '#B76E79',
            }}
            aria-hidden="true"
          >
            {String.fromCharCode(65 + index)}
          </span>
          <span className="flex-1">{text}</span>
          {/* Status icon */}
          {status === 'correct' && (
            <CheckCircle2
              size={20}
              color="white"
              className="flex-shrink-0"
              aria-hidden="true"
            />
          )}
          {status === 'wrong' && (
            <XCircle
              size={20}
              color="white"
              className="flex-shrink-0"
              aria-hidden="true"
            />
          )}
          {status === 'reveal' && (
            <CheckCircle2
              size={20}
              color="#22c55e"
              className="flex-shrink-0"
              aria-hidden="true"
            />
          )}
        </span>
      </motion.button>
    </motion.div>
  )
}

// ── Results screen ────────────────────────────────────────────────────────────
function ResultsScreen({
  score,
  total,
  onRetry,
}: {
  score: number
  total: number
  onRetry: () => void
}) {
  const { fireCelebration, fireHearts } = useConfetti()
  const { headline, sub } = getResultMessage(score, total)

  useEffect(() => {
    fireHearts()
    hapticCelebration()
    const t = setTimeout(() => fireCelebration(), 600)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 160, damping: 18 }}
      className="text-center py-8"
    >
      {/* Pulsing heart */}
      <motion.div
        animate={{ scale: [1, 1.18, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        className="flex justify-center mb-6"
        aria-hidden="true"
      >
        <Heart
          size={80}
          fill="#B76E79"
          color="#B76E79"
          strokeWidth={1}
        />
      </motion.div>

      {/* Score */}
      <p
        className="text-6xl font-bold mb-2"
        style={{
          fontFamily: "'Playfair Display', serif",
          color: '#B76E79',
        }}
        aria-live="polite"
      >
        {score}/{total}
      </p>
      <p
        className="text-sm mb-6"
        style={{ color: '#B76E7999', fontFamily: "'Inter', sans-serif" }}
      >
        You got {score} out of {total}! ❤️
      </p>

      {/* Headline */}
      <h2
        className="text-3xl font-bold mb-4"
        style={{
          fontFamily: "'Playfair Display', serif",
          color: '#3d2c2c',
          lineHeight: 1.3,
        }}
      >
        {headline}
      </h2>
      <p
        className="text-base mb-10 max-w-sm mx-auto"
        style={{ color: '#78716c', fontFamily: "'Inter', sans-serif", lineHeight: 1.7 }}
      >
        {sub}
      </p>

      <Button
        variant="outline"
        size="md"
        onClick={onRetry}
        ariaLabel="Take the quiz again"
      >
        <RotateCcw size={16} aria-hidden="true" />
        Take Quiz Again
      </Button>
    </motion.div>
  )
}

// ── Main quiz page ────────────────────────────────────────────────────────────
export default function Quiz() {
  const questions = getQuestions()
  const total = questions.length

  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<AnswerState>({})
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [isLocked, setIsLocked] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [showResults, setShowResults] = useState(false)
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { fireBurst } = useConfetti()

  // Clear advance timer on unmount so it doesn't fire after navigation
  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current)
    }
  }, [])

  const currentQuestion: QuizQuestion | undefined = questions[currentStep]

  // Compute option statuses for display
  const getOptionStatus = useCallback(
    (optIndex: number): OptionStatus => {
      if (!isLocked || selectedIndex === null) return 'idle'
      const q = questions[currentStep]
      if (!q) return 'idle'
      if (optIndex === q.correctIndex && feedback === 'wrong') return 'reveal'
      if (optIndex === selectedIndex) {
        return feedback === 'correct' ? 'correct' : 'wrong'
      }
      return 'idle'
    },
    [isLocked, selectedIndex, feedback, currentStep, questions],
  )

  const handleSelect = (optIndex: number) => {
    if (isLocked || !currentQuestion) return

    const isCorrect = optIndex === currentQuestion.correctIndex
    setSelectedIndex(optIndex)
    setIsLocked(true)
    setFeedback(isCorrect ? 'correct' : 'wrong')
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optIndex }))

    if (isCorrect) {
      hapticSuccess()
      // Small confetti on correct
      void import('canvas-confetti').then(({ default: confetti }) => {
        void confetti({
          particleCount: 50,
          spread: 40,
          origin: { x: 0.5, y: 0.55 },
          colors: ['#B76E79', '#FFD6E0', '#E8D5F5'],
          scalar: 0.85,
          gravity: 1,
          ticks: 140,
        })
      })
    } else {
      hapticError()
    }

    const delay = isCorrect ? 1200 : 1500
    if (advanceTimer.current) clearTimeout(advanceTimer.current)
    advanceTimer.current = setTimeout(() => {
      if (currentStep + 1 >= total) {
        setShowResults(true)
        // Fire big celebration before results appear
        setTimeout(() => fireBurst(), 200)
      } else {
        setCurrentStep((s) => s + 1)
        setSelectedIndex(null)
        setIsLocked(false)
        setFeedback(null)
      }
    }, delay)
  }

  const handleRetry = () => {
    setCurrentStep(0)
    setAnswers({})
    setSelectedIndex(null)
    setIsLocked(false)
    setFeedback(null)
    setShowResults(false)
  }

  // Count correct answers
  const score = questions.reduce((acc, q) => {
    return answers[q.id] === q.correctIndex ? acc + 1 : acc
  }, 0)

  if (!currentQuestion && !showResults) return null

  return (
    <main
      className="min-h-screen py-16 px-4"
      style={{ backgroundColor: '#F5ECD7' }}
      aria-label="Relationship quiz"
    >
      {/* Decorative background */}
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle at 70% 30%, #E8D5F528 0%, transparent 45%), radial-gradient(circle at 20% 70%, #FFD6E028 0%, transparent 45%)',
          zIndex: 0,
        }}
      />

      <div className="relative z-10 max-w-xl mx-auto">
        {/* Page title */}
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p
            className="text-sm font-medium tracking-widest uppercase mb-2"
            style={{ color: '#B76E79' }}
          >
            How well do you know us?
          </p>
          <h1
            className="text-4xl font-bold"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: '#3d2c2c',
            }}
          >
            Our Love Quiz 💑
          </h1>
        </motion.header>

        <GlassCard className="p-8">
          <AnimatePresence mode="wait">
            {showResults ? (
              <ResultsScreen
                key="results"
                score={score}
                total={total}
                onRetry={handleRetry}
              />
            ) : (
              <motion.div
                key={`question-${currentStep}`}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                {/* Progress */}
                <QuizProgress current={currentStep + 1} total={total} />

                {/* Question */}
                <h2
                  className="text-2xl font-bold mb-6 leading-snug"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: '#3d2c2c',
                  }}
                >
                  {currentQuestion!.question}
                </h2>

                {/* Feedback banner */}
                <AnimatePresence>
                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="rounded-xl px-4 py-3 mb-5 text-sm font-medium flex items-center gap-2"
                        style={{
                          backgroundColor:
                            feedback === 'correct' ? '#22c55e18' : '#ef444418',
                          color: feedback === 'correct' ? '#16a34a' : '#dc2626',
                          border: `1px solid ${feedback === 'correct' ? '#22c55e40' : '#ef444440'}`,
                        }}
                        role="alert"
                        aria-live="polite"
                      >
                        {feedback === 'correct' ? (
                          <>
                            <CheckCircle2 size={16} aria-hidden="true" />
                            That&apos;s right! ❤️
                          </>
                        ) : (
                          <>
                            <XCircle size={16} aria-hidden="true" />
                            Not quite — the answer is highlighted below.
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Options */}
                <div className="flex flex-col gap-3" role="group" aria-label="Answer options">
                  {currentQuestion!.options.map((opt, i) => (
                    <OptionButton
                      key={i}
                      text={opt}
                      index={i}
                      status={getOptionStatus(i)}
                      isLocked={isLocked}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </div>
    </main>
  )
}
