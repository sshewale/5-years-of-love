// ─── ReasonsILoveYou.tsx — 100 flip-card reasons ─────────────────────────────
import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../components/ui/Button'
import { reasons as defaultReasons, type LoveReason } from '../data/reasons'
import { getStorageItem, setStorageItem } from '../utils/storage'
import { STORAGE_KEYS } from '../utils/constants'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

// ── Helper: load reasons (admin override > default) ───────────────────────────
function loadReasons(): LoveReason[] {
  const stored = getStorageItem<LoveReason[]>(STORAGE_KEYS.ADMIN_REASONS)
  if (Array.isArray(stored) && stored.length > 0) return stored
  return defaultReasons
}

// Centralized animation timing (easy to tune)
const ANIM = {
  flipMs: 360,
  hoverSec: 0.12,
  revealSec: 0.18,
  batchSec: 0.36,
  headerSec: 0.32,
  progressSec: 0.24,
}

// ── Flip card ─────────────────────────────────────────────────────────────────
interface FlipCardProps {
  reason: LoveReason
  index: number
  isFlipped: boolean
  onFlip: (id: string) => void
  cardRef?: (el: HTMLDivElement | null) => void
  lang?: 'en' | 'mr' | 'hi'
}

function FlipCard({ reason, index, isFlipped, onFlip, cardRef, lang = 'en' }: FlipCardProps) {
  return (
    <motion.div
      ref={cardRef}
      id={`reason-card-${reason.id}`}
      className={`flip-card w-full aspect-square cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B76E79] rounded-2xl min-h-[140px] sm:min-h-[160px] ${isFlipped ? 'flipped' : ''}`}
      onClick={() => onFlip(reason.id)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onFlip(reason.id)}
      tabIndex={0}
      role="button"
      aria-pressed={isFlipped}
      aria-label={`Reason #${index + 1}: ${isFlipped ? reason.text : 'click to reveal'}`}
      whileHover={!isFlipped ? { scale: 1.06, boxShadow: '0 0 18px 4px rgba(183,110,121,0.4)' } : {}}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: ANIM.hoverSec }}
    >
      {/* Wrapper that holds both faces */}
      <div
        className="flip-card-inner relative w-full h-full"
        style={{ transformStyle: 'preserve-3d', transition: `transform ${ANIM.flipMs}ms` }}
      >
        {/* ── Front face ──────────────────────────────────────────────── */}
        <div
          className="flip-card-front absolute inset-0 flex flex-col items-center justify-center rounded-2xl p-3 border border-[#B76E79]/20"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: [
              'linear-gradient(135deg, rgba(255,214,224,0.8) 0%, rgba(232,213,245,0.65) 100%)',
              'linear-gradient(135deg, rgba(232,213,245,0.8) 0%, rgba(255,214,224,0.65) 100%)',
              'linear-gradient(135deg, rgba(255,214,224,0.75) 0%, rgba(245,236,215,0.8) 100%)',
              'linear-gradient(135deg, rgba(245,236,215,0.9) 0%, rgba(255,214,224,0.7) 100%)',
              'linear-gradient(135deg, rgba(232,213,245,0.75) 0%, rgba(245,236,215,0.8) 100%)',
            ][index % 5],
          }}
        >
          <span
            className="text-2xl sm:text-3xl font-bold text-[#B76E79] leading-none mb-1"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            #{index + 1}
          </span>
          <span className="text-[10px] sm:text-xs text-[#B76E79]/60 text-center leading-tight mt-1">
            Click to reveal ❤️
          </span>
        </div>

        {/* ── Back face ───────────────────────────────────────────────── */}
        <div
          className="flip-card-back absolute inset-0 flex items-center justify-center rounded-2xl p-3 border-2 border-[#B76E79]/40"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, rgba(245,236,215,0.95) 0%, rgba(255,214,224,0.6) 100%)',
          }}
        >
          <motion.p
            className="text-[10px] sm:text-xs text-[#5a3040] leading-relaxed text-center italic"
            style={{ fontFamily: "'Playfair Display', serif" }}
            initial={{ opacity: 0, y: 6 }}
            animate={isFlipped ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
            transition={{ duration: ANIM.revealSec, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {reason.text}
          </motion.p>
          <div className="mt-3">
            <span className="text-xs italic text-[#B76E79]/60">
              {lang === 'mr' ? 'माझ्या हृदयात साठवले' : 'Saved to my heart'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Batch of 20 cards with scroll animation ───────────────────────────────────
interface BatchProps {
  batchReasons: LoveReason[]
  startIdx: number
  flippedIds: Set<string>
  onFlip: (id: string) => void
  registerCardRef: (id: string, el: HTMLDivElement | null) => void
  lang?: 'en' | 'mr' | 'hi'
}

function CardBatch({ batchReasons, startIdx, flippedIds, onFlip, registerCardRef, lang = 'en' }: BatchProps) {
  const { ref, inView } = useScrollAnimation(0.08)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: ANIM.batchSec, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
    >
      {batchReasons.map((reason, i) => (
        <FlipCard
          key={reason.id}
          reason={reason}
          index={startIdx + i}
          isFlipped={flippedIds.has(reason.id)}
          onFlip={onFlip}
          cardRef={(el) => registerCardRef(reason.id, el)}
          lang={lang}
        />
      ))}
    </motion.div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ReasonsILoveYou() {
  const navigate = useNavigate()
  const allReasons = useMemo(() => loadReasons(), [])

  const [flippedIds, setFlippedIds] = useState<Set<string>>(new Set())
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const [announcement, setAnnouncement] = useState<{ en: string; mr: string } | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)

  const [noteLang, setNoteLang] = useState<'en' | 'mr' | 'hi'>((getStorageItem<string>(STORAGE_KEYS.NOTE_LANG) ?? 'mr') as 'en' | 'mr' | 'hi')

  // Persist language preference
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.NOTE_LANG, noteLang)
  }, [noteLang])

  const playFlipSound = useCallback(() => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      const ctx = audioCtxRef.current
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sine'
      o.frequency.value = 720
      g.gain.value = 0
      o.connect(g)
      g.connect(ctx.destination)
      const now = ctx.currentTime
      g.gain.linearRampToValueAtTime(0.12, now + 0.001)
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.18)
      o.start(now)
      o.stop(now + 0.2)
    } catch (err) {
      // ignore audio errors
    }
  }, [])

  const handleFlip = useCallback(
    (id: string) => {
      setFlippedIds((prev) => {
        const next = new Set(prev)
        const willReveal = !next.has(id)
        if (willReveal) {
          // announcement (both EN + MR)
          setAnnouncement({
            en: 'A reason was revealed — hope you like it.',
            mr: 'एक कारण उघडले — आशा आहे तुम्हाला आवडेल.',
          })
          // play flip sound
          playFlipSound()
        }

        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })
    },
    [playFlipSound],
  )

  const registerCardRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) cardRefs.current.set(id, el)
    else cardRefs.current.delete(id)
  }, [])

  // "Surprise Me!" — pick a random unflipped card and reveal it
  const handleSurprise = useCallback(() => {
    const unflipped = allReasons.filter((r) => !flippedIds.has(r.id))
    if (unflipped.length === 0) {
      // All revealed — flip all back
      setFlippedIds(new Set())
      return
    }
    const pick = unflipped[Math.floor(Math.random() * unflipped.length)]
    setFlippedIds((prev) => new Set([...prev, pick.id]))

    // Scroll to the card smoothly
    setTimeout(() => {
      const el = cardRefs.current.get(pick.id)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 80)
  }, [allReasons, flippedIds])

  // Split into batches of 20
  const batches = useMemo(() => {
    const result: LoveReason[][] = []
    for (let i = 0; i < allReasons.length; i += 20) {
      result.push(allReasons.slice(i, i + 20))
    }
    return result
  }, [allReasons])

  const flippedCount = flippedIds.size
  const allRevealed = flippedCount === allReasons.length

  useEffect(() => {
    if (!announcement) return
    const t = setTimeout(() => setAnnouncement(null), 1200)
    return () => clearTimeout(t)
  }, [announcement])

  return (
    <div
      className="min-h-screen px-4 py-16"
      style={{
        background:
          'linear-gradient(180deg, #F5ECD7 0%, rgba(232,213,245,0.3) 50%, #F5ECD7 100%)',
      }}
    >
      {/* Live region for flip announcements (EN + MR) */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement && (
          <span>
            <span lang="en">{announcement.en}</span>
            <span lang="mr"> {announcement.mr}</span>
          </span>
        )}
      </div>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: ANIM.headerSec }}
        className="text-center mb-10 max-w-2xl mx-auto"
        aria-label="Reasons I love you section header"
      >
        <p className="text-[#B76E79]/80 text-sm font-medium uppercase tracking-widest mb-3">
          Chapter Three
        </p>
        <h1
          style={{ fontFamily: "'Playfair Display', serif" }}
          className="text-4xl sm:text-5xl font-bold text-[#B76E79] mb-4 drop-shadow-sm"
        >
          {allReasons.length} Reasons I Love You
        </h1>
        <p className="text-[#5a4040]/65 text-base leading-relaxed">
          Each card holds a reason. Tap to reveal. Some are profound. Some are silly. All are true.
        </p>
        <div className="flex items-center gap-3 mt-6 justify-center">
          <div className="h-px w-16 bg-[#B76E79]/30" />
          <span className="text-[#B76E79] text-lg" aria-hidden="true">💝</span>
          <div className="h-px w-16 bg-[#B76E79]/30" />
        </div>
      </motion.header>

      {/* ── Progress + Surprise button ───────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: ANIM.headerSec, delay: 0.12 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-5xl mx-auto mb-8"
      >
        {/* Progress bar */}
        <div className="flex flex-col gap-1.5 w-full sm:w-72" role="status" aria-live="polite" aria-label={`${flippedCount} of ${allReasons.length} reasons revealed`}>
          <div className="flex justify-between text-xs text-[#B76E79]/60">
            <span>{flippedCount} revealed</span>
            <span>{allReasons.length - flippedCount} remaining</span>
          </div>
          <div className="h-2 rounded-full bg-[#B76E79]/15 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#B76E79] to-[#FFD6E0]"
              animate={{ width: `${(flippedCount / allReasons.length) * 100}%` }}
              transition={{ duration: ANIM.progressSec }}
            />
          </div>
        </div>

        {/* Language toggle */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#5a4040]/70">Language</span>
          <div role="tablist" aria-label="Choose note language" className="inline-flex rounded-md bg-white/60 dark:bg-black/40 p-1 ring-1 ring-[#B76E79]/10">
            <button
              onClick={() => setNoteLang('en')}
              aria-pressed={noteLang === 'en'}
              className={`px-3 py-1 text-sm rounded-md ${noteLang === 'en' ? 'bg-[#B76E79] text-white' : 'text-[#5a4040]'}`}
            >
              EN
            </button>
            <button
              onClick={() => setNoteLang('mr')}
              aria-pressed={noteLang === 'mr'}
              className={`px-3 py-1 text-sm rounded-md ${noteLang === 'mr' ? 'bg-[#B76E79] text-white' : 'text-[#5a4040]'}`}
            >
              MR
            </button>
            <button
              onClick={() => setNoteLang('hi')}
              aria-pressed={noteLang === 'hi'}
              className={`px-3 py-1 text-sm rounded-md ${noteLang === 'hi' ? 'bg-[#B76E79] text-white' : 'text-[#5a4040]'}`}
            >
              HI
            </button>
          </div>
        </div>

        {/* Surprise me button */}
        <Button
          variant={allRevealed ? 'outline' : 'primary'}
          size="sm"
          onClick={handleSurprise}
          ariaLabel={allRevealed ? 'Flip all cards back' : 'Surprise me — reveal a random reason'}
          className="flex-shrink-0"
        >
          {allRevealed ? '↩ Reset All' : '✨ Surprise Me!'}
        </Button>
      </motion.div>

      {/* ── Card grid (in batches of 20) ─────────────────────────────────── */}
      <div
        className="flex flex-col gap-8 max-w-5xl mx-auto"
        aria-label="Reasons I love you grid"
      >
        {batches.map((batch, batchIdx) => (
          <CardBatch
            key={batchIdx}
            batchReasons={batch}
            startIdx={batchIdx * 20}
            flippedIds={flippedIds}
            onFlip={handleFlip}
            registerCardRef={registerCardRef}
            lang={noteLang}
          />
        ))}
      </div>

      {/* ── All revealed celebration ─────────────────────────────────────── */}
      <AnimatePresenceWrapper show={allRevealed}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="text-center mt-10 py-8 px-6 rounded-3xl max-w-xl mx-auto"
          style={{
            background: 'linear-gradient(135deg, rgba(255,214,224,0.6) 0%, rgba(232,213,245,0.6) 100%)',
            border: '1.5px solid rgba(183,110,121,0.3)',
          }}
          role="status"
          aria-live="polite"
        >
          <p className="text-4xl mb-3" aria-hidden="true">🎉</p>
          <p
            className="text-2xl font-bold text-[#B76E79] mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            You read all {allReasons.length} reasons!
          </p>
          <p className="text-[#5a4040]/70 text-sm">
            And there are still a thousand more I couldn't fit on a page.
          </p>
        </motion.div>
      </AnimatePresenceWrapper>

      {/* ── Navigation CTA ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-4 mt-16"
      >
        <p
          className="text-[#B76E79]/60 text-sm italic"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Every day I find a new one to add to this list…
        </p>
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/notes')}
          ariaLabel="Read love notes written just for you"
          className="shadow-[0_4px_24px_rgba(183,110,121,0.3)]"
        >
          Read My Love Notes →
        </Button>
      </motion.div>
    </div>
  )
}

// ── AnimatePresence wrapper ────────────────────────────────────────────────────
function AnimatePresenceWrapper({ show, children }: { show: boolean; children: ReactNode }) {
  return <AnimatePresence>{show ? children : null}</AnimatePresence>
}
