// ─── FutureDreams.tsx — Add & display shared dreams for the future ────────────
import { useState, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Trash2, Sparkles, PlusCircle } from 'lucide-react'
import type { FutureDream } from '../types'
import { STORAGE_KEYS } from '../utils/constants'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { formatDate } from '../utils/formatters'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'

// ── Shooting star empty state animation ───────────────────────────────────────
function ShootingStarEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center py-20 text-center"
      aria-label="No dreams yet"
    >
      {/* Animated shooting star */}
      <div className="relative w-48 h-32 mb-6 overflow-hidden" aria-hidden="true">
        {/* Static stars */}
        {[
          { top: '10%', left: '20%', size: 3, delay: 0 },
          { top: '30%', left: '70%', size: 2, delay: 0.4 },
          { top: '60%', left: '40%', size: 2.5, delay: 0.8 },
          { top: '80%', left: '85%', size: 2, delay: 1.2 },
          { top: '15%', left: '55%', size: 1.5, delay: 0.2 },
        ].map((star, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 2,
              delay: star.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              borderRadius: '50%',
              backgroundColor: '#B76E79',
              boxShadow: `0 0 ${star.size + 2}px #B76E79`,
            }}
          />
        ))}

        {/* Shooting star streak */}
        <motion.div
          animate={{
            x: ['0%', '180%'],
            y: ['0%', '60%'],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 2.5,
            ease: 'easeIn',
          }}
          style={{
            position: 'absolute',
            top: '20%',
            left: '0%',
            width: '48px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #B76E79, #FFD6E0)',
            borderRadius: '2px',
            transformOrigin: 'right center',
          }}
        />
      </div>

      <p
        className="text-xl font-semibold mb-2"
        style={{
          fontFamily: "'Playfair Display', serif",
          color: '#B76E79',
        }}
      >
        Your dreams will live here… ✨
      </p>
      <p
        className="text-sm max-w-xs"
        style={{ color: '#78716c', fontFamily: "'Inter', sans-serif", lineHeight: 1.7 }}
      >
        Write the first dream for your future together. Every great adventure starts
        with a single wish.
      </p>
    </motion.div>
  )
}

// ── Dream delete button with shake confirmation ───────────────────────────────
function DeleteButton({ onDelete }: { onDelete: () => void }) {
  const [confirmShake, setConfirmShake] = useState(false)
  const [pending, setPending] = useState(false)

  const handleClick = () => {
    if (!pending) {
      // First click: enter pending state, shake to signal
      setPending(true)
      setConfirmShake(true)
      setTimeout(() => setConfirmShake(false), 500)
      // Auto-cancel after 2s if not confirmed
      setTimeout(() => setPending(false), 2000)
    } else {
      // Second click: actually delete
      onDelete()
    }
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      animate={confirmShake ? { x: [-4, 4, -3, 3, 0] } : { x: 0 }}
      transition={{ duration: 0.35 }}
      className="p-2 rounded-xl transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B76E79] focus-visible:ring-offset-1"
      style={{
        color: pending ? '#ef4444' : '#B76E7960',
        backgroundColor: pending ? '#ef444412' : 'transparent',
      }}
      aria-label={pending ? 'Click again to confirm delete' : 'Delete dream'}
      title={pending ? 'Click again to confirm' : 'Delete dream'}
    >
      <Trash2 size={16} aria-hidden="true" />
    </motion.button>
  )
}

// ── Individual dream card ─────────────────────────────────────────────────────
interface DreamCardProps {
  dream: FutureDream
  onDelete: (id: string) => void
  delay?: number
}

function DreamCard({ dream, onDelete, delay = 0 }: DreamCardProps) {
  const { ref, inView } = useScrollAnimation(0.1)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      exit={{ opacity: 0, scale: 0.92, y: -8 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      layout
    >
      <GlassCard className="p-5">
        <div className="flex items-start gap-4">
          {/* Star icon */}
          <div
            className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center mt-0.5"
            style={{ backgroundColor: '#B76E7918' }}
            aria-hidden="true"
          >
            <Star
              size={18}
              fill="#B76E79"
              color="#B76E79"
              strokeWidth={1}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p
              className="text-base italic leading-relaxed mb-2"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: '#3d2c2c',
              }}
            >
              "{dream.text}"
            </p>
            <time
              className="text-xs"
              dateTime={dream.createdAt}
              style={{ color: '#B76E7999', fontFamily: "'Inter', sans-serif" }}
            >
              Added {formatDate(dream.createdAt)}
            </time>
          </div>

          {/* Delete button */}
          <DeleteButton onDelete={() => onDelete(dream.id)} />
        </div>
      </GlassCard>
    </motion.div>
  )
}

// ── Add dream input section ───────────────────────────────────────────────────
function AddDreamSection({
  onAdd,
}: {
  onAdd: (text: string) => void
}) {
  const [text, setText] = useState('')
  const textareaId = useId()
  const maxLength = 280

  const handleAdd = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setText('')
  }

  return (
    <GlassCard className="p-6 mb-10">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={18} color="#B76E79" aria-hidden="true" />
        <h2
          className="text-lg font-semibold"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: '#B76E79',
          }}
        >
          Write a dream for us
        </h2>
      </div>

      <label htmlFor={textareaId} className="sr-only">
        Describe a dream for your future together
      </label>
      <textarea
        id={textareaId}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a dream for us… ✨"
        maxLength={maxLength}
        rows={3}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none border resize-none mb-3"
        style={{
          backgroundColor: 'rgba(255,255,255,0.55)',
          borderColor: '#B76E7930',
          color: '#3d2c2c',
          fontFamily: "'Inter', sans-serif",
          lineHeight: 1.6,
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAdd()
        }}
        aria-label="Dream text input"
        aria-describedby="dream-hint"
      />

      <div className="flex items-center justify-between">
        <p
          id="dream-hint"
          className="text-xs"
          style={{ color: '#B76E7970', fontFamily: "'Inter', sans-serif" }}
        >
          Ctrl+Enter to add
        </p>
        <div className="flex items-center gap-3">
          <span
            className="text-xs"
            style={{ color: text.length > maxLength * 0.85 ? '#ef4444' : '#B76E7960' }}
            aria-live="polite"
          >
            {text.length}/{maxLength}
          </span>
          <Button
            variant="primary"
            size="sm"
            onClick={handleAdd}
            disabled={!text.trim()}
            ariaLabel="Add dream to list"
          >
            <PlusCircle size={15} aria-hidden="true" />
            Add Dream ✨
          </Button>
        </div>
      </div>
    </GlassCard>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function FutureDreams() {
  const [dreams, setDreams] = useLocalStorage<FutureDream[]>(
    STORAGE_KEYS.FUTURE_DREAMS,
    [],
  )

  const { ref: headerRef, inView: headerInView } = useScrollAnimation(0.1)

  const handleAdd = (text: string) => {
    const newDream: FutureDream = {
      id: Date.now().toString(),
      text,
      createdAt: new Date().toISOString(),
    }
    // Newest first
    setDreams([newDream, ...dreams])
  }

  const handleDelete = (id: string) => {
    setDreams(dreams.filter((d) => d.id !== id))
  }

  // Sorted newest first (the array is already newest-first from handleAdd,
  // but guard against data loaded from storage)
  const sortedDreams = [...dreams].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return (
    <main
      className="min-h-screen py-16 px-4"
      style={{ backgroundColor: '#F5ECD7' }}
      aria-label="Future dreams"
    >
      {/* Decorative background */}
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 30%, #E8D5F530 0%, transparent 40%), radial-gradient(circle at 85% 70%, #FFD6E028 0%, transparent 40%)',
          zIndex: 0,
        }}
      />

      <div className="relative z-10 max-w-xl mx-auto">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: -20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
          role="banner"
        >
          <motion.div
            animate={{ rotate: [0, 15, -10, 15, 0] }}
            transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatDelay: 4 }}
            className="text-5xl mb-4 inline-block"
            aria-hidden="true"
          >
            🌠
          </motion.div>
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: '#3d2c2c',
              lineHeight: 1.2,
            }}
          >
            Our Future Dreams
          </h1>
          <p
            className="text-base"
            style={{ color: '#78716c', fontFamily: "'Inter', sans-serif", lineHeight: 1.7 }}
          >
            Every dream written here is a promise to the future.
            <br />
            What do you want us to do, see, feel, become?
          </p>
        </motion.div>

        {/* Add dream section */}
        <AddDreamSection onAdd={handleAdd} />

        {/* Dreams list */}
        <section aria-label="Your dreams list">
          <AnimatePresence mode="popLayout">
            {sortedDreams.length === 0 ? (
              <ShootingStarEmptyState key="empty" />
            ) : (
              <div className="flex flex-col gap-4">
                {/* List header */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 mb-1"
                >
                  <Star size={14} color="#B76E79" fill="#B76E79" aria-hidden="true" />
                  <span
                    className="text-sm font-medium"
                    style={{ color: '#B76E79', fontFamily: "'Inter', sans-serif" }}
                  >
                    {sortedDreams.length} dream{sortedDreams.length !== 1 ? 's' : ''} waiting to come true
                  </span>
                </motion.div>

                {sortedDreams.map((dream, index) => (
                  <DreamCard
                    key={dream.id}
                    dream={dream}
                    onDelete={handleDelete}
                    delay={index * 0.06}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </section>

        {/* Footer */}
        {sortedDreams.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-sm mt-10"
            style={{
              fontFamily: "'Dancing Script', cursive",
              color: '#B76E7999',
              fontSize: '1.05rem',
            }}
          >
            The future is bright when we dream it together. ✨
          </motion.p>
        )}
      </div>
    </main>
  )
}
