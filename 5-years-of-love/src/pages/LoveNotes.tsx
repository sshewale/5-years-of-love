// ─── LoveNotes.tsx — Daily love notes in EN / Marathi / Hindi ─────────────────
import { useState, useMemo, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Bookmark } from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { loveNotes } from '../data/loveNotes'
import { getStorageItem, setStorageItem } from '../utils/storage'
import { STORAGE_KEYS } from '../utils/constants'
import type { LoveNote } from '../types'

type Lang = 'en' | 'mr' | 'hi'

// ── Language config ───────────────────────────────────────────────────────────
const LANG_CONFIG: { key: Lang; label: string; locale: string }[] = [
  { key: 'en', label: 'EN',     locale: 'English' },
  { key: 'mr', label: 'मराठी', locale: 'Marathi' },
  { key: 'hi', label: 'हिंदी', locale: 'Hindi' },
]

// ── Helper: pick a random index different from current ────────────────────────
function pickRandom(pool: LoveNote[], currentId: string): number {
  if (pool.length <= 1) return 0
  let idx: number
  do {
    idx = Math.floor(Math.random() * pool.length)
  } while (pool[idx].id === currentId)
  return idx
}

// ── Helper: load notes (admin override merged with defaults) ──────────────────
function loadNotes(): LoveNote[] {
  const adminNotes = getStorageItem<LoveNote[]>(STORAGE_KEYS.ADMIN_NOTES)
  if (!Array.isArray(adminNotes) || adminNotes.length === 0) return loveNotes

  // Admin notes take priority; default notes fill any gaps
  const adminIds = new Set(adminNotes.map((n) => n.id))
  const merged = [
    ...adminNotes,
    ...loveNotes.filter((n) => !adminIds.has(n.id)),
  ]
  return merged
}

// ── Large decorative quote mark ───────────────────────────────────────────────
function QuoteMark({ side }: { side: 'open' | 'close' }) {
  return (
    <span
      aria-hidden="true"
      className="text-[#B76E79]/20 select-none pointer-events-none"
      style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '6rem',
        lineHeight: 0.8,
        display: 'block',
        height: '3rem',
        userSelect: 'none',
      }}
    >
      {side === 'open' ? '“' : '”'}
    </span>
  )
}

// ── Note card ─────────────────────────────────────────────────────────────────
interface NoteCardProps {
  note: LoveNote
  isFavorited: boolean
  isBookmarked: boolean
  onFavorite: () => void
  onBookmark: () => void
}

function NoteCard({ note, isFavorited, isBookmarked, onFavorite, onBookmark }: NoteCardProps) {
  const isDevanagari = note.lang === 'mr' || note.lang === 'hi'

  return (
    <GlassCard
      className="px-6 pt-5 pb-6 relative flex flex-col gap-4 border border-[#B76E79]/15"
      style={{ backgroundColor: 'rgba(255,255,255,0.8)', boxShadow: '0 8px 32px rgba(183,110,121,0.12)' }}
    >
      {/* Opening quote */}
      <QuoteMark side="open" />

      {/* Note text */}
      <AnimatePresence mode="wait">
        <motion.p
          key={note.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={[
            'text-[#3d2a2a] text-lg sm:text-xl leading-relaxed text-center px-2',
            isDevanagari
              ? 'font-devanagari'
              : "italic",
          ].join(' ')}
          style={
            isDevanagari
              ? { fontFamily: "'Noto Sans Devanagari', sans-serif", fontStyle: 'normal' }
              : { fontFamily: "'Playfair Display', serif" }
          }
          lang={note.lang === 'mr' ? 'mr' : note.lang === 'hi' ? 'hi' : 'en'}
        >
          {note.text}
        </motion.p>
      </AnimatePresence>

      {/* Closing quote */}
      <div className="flex justify-end">
        <QuoteMark side="close" />
      </div>

      {/* Divider */}
      <div className="h-px bg-[#B76E79]/15 mx-4" />

      {/* Action row: heart + bookmark */}
      <div className="flex items-center justify-between px-2">
        {/* Note ID badge */}
        <Badge variant="beige" className="text-xs">
          Note #{note.id.replace(/\D/g, '')}
        </Badge>

        <div className="flex items-center gap-3">
          {/* Favorite */}
          <motion.button
            whileTap={{ scale: 0.82 }}
            onClick={onFavorite}
            aria-pressed={isFavorited}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            className={[
              'flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B76E79]',
              isFavorited
                ? 'bg-[#B76E79]/15 text-[#B76E79]'
                : 'bg-white/30 text-[#B76E79]/40 hover:text-[#B76E79] hover:bg-[#FFD6E0]/40',
            ].join(' ')}
          >
            <Heart
              size={18}
              aria-hidden="true"
              fill={isFavorited ? '#B76E79' : 'none'}
              stroke="#B76E79"
              strokeWidth={isFavorited ? 0 : 1.8}
            />
          </motion.button>

          {/* Bookmark */}
          <motion.button
            whileTap={{ scale: 0.82 }}
            onClick={onBookmark}
            aria-pressed={isBookmarked}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this note'}
            className={[
              'flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B76E79]',
              isBookmarked
                ? 'bg-[#E8D5F5]/60 text-[#7c3aed]'
                : 'bg-white/30 text-[#7c3aed]/40 hover:text-[#7c3aed] hover:bg-[#E8D5F5]/40',
            ].join(' ')}
          >
            <Bookmark
              size={18}
              aria-hidden="true"
              fill={isBookmarked ? '#7c3aed' : 'none'}
              stroke={isBookmarked ? '#7c3aed' : '#a78bfa'}
              strokeWidth={isBookmarked ? 0 : 1.8}
            />
          </motion.button>
        </div>
      </div>
    </GlassCard>
  )
}

// ── Stats bar ─────────────────────────────────────────────────────────────────
function StatsBar({ favoriteCount, bookmarkCount, totalInLang }: {
  favoriteCount: number
  bookmarkCount: number
  totalInLang: number
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3" role="status" aria-live="polite">
      <Badge variant="rose">
        <Heart size={12} fill="#B76E79" className="mr-1 inline" aria-hidden="true" />
        {favoriteCount} Favorited
      </Badge>
      <Badge variant="lavender">
        <Bookmark size={12} fill="#7c3aed" className="mr-1 inline" aria-hidden="true" />
        {bookmarkCount} Bookmarked
      </Badge>
      <Badge variant="beige">
        {totalInLang} Notes Available
      </Badge>
    </div>
  )
}

// ── Main LoveNotes ────────────────────────────────────────────────────────────
export default function LoveNotes() {
  const navigate = useNavigate()
  const allNotes = useMemo(() => loadNotes(), [])

  // Language — persisted to localStorage
  const [lang, setLang] = useState<Lang>(() => {
    return (getStorageItem<Lang>(STORAGE_KEYS.NOTE_LANG)) ?? 'mr'
  })

  // Favorites & bookmarks persisted separately
  const [favorites, setFavorites] = useState<string[]>(() => {
    return getStorageItem<string[]>(STORAGE_KEYS.NOTES_FAVORITES) ?? []
  })
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    return getStorageItem<string[]>(STORAGE_KEYS.NOTES_BOOKMARKS) ?? []
  })

  // Notes filtered by current language
  const pool = useMemo(() => allNotes.filter((n) => n.lang === lang), [allNotes, lang])

  // Current note index
  const [noteIndex, setNoteIndex] = useState<number>(() =>
    pool.length > 0 ? Math.floor(Math.random() * pool.length) : 0,
  )

  // Re-initialise index when language changes
  useEffect(() => {
    if (pool.length > 0) {
      setNoteIndex(Math.floor(Math.random() * pool.length))
    }
  }, [lang, pool.length])

  const currentNote: LoveNote | undefined = pool[noteIndex]

  // ── Language switcher ──────────────────────────────────────────────────────
  const switchLang = useCallback((newLang: Lang) => {
    setLang(newLang)
    setStorageItem(STORAGE_KEYS.NOTE_LANG, newLang)
  }, [])

  // ── Next note ──────────────────────────────────────────────────────────────
  const handleNext = useCallback(() => {
    if (!currentNote) return
    const newIdx = pickRandom(pool, currentNote.id)
    setNoteIndex(newIdx)
  }, [currentNote, pool])

  // ── Favorite toggle ────────────────────────────────────────────────────────
  const handleFavorite = useCallback(() => {
    if (!currentNote) return
    setFavorites((prev) => {
      const next = prev.includes(currentNote.id)
        ? prev.filter((id) => id !== currentNote.id)
        : [...prev, currentNote.id]
      setStorageItem(STORAGE_KEYS.NOTES_FAVORITES, next)
      return next
    })
  }, [currentNote])

  // ── Bookmark toggle ────────────────────────────────────────────────────────
  const handleBookmark = useCallback(() => {
    if (!currentNote) return
    setBookmarks((prev) => {
      const next = prev.includes(currentNote.id)
        ? prev.filter((id) => id !== currentNote.id)
        : [...prev, currentNote.id]
      setStorageItem(STORAGE_KEYS.NOTES_BOOKMARKS, next)
      return next
    })
  }, [currentNote])

  return (
    <div
      className="min-h-screen px-4 py-16"
      style={{
        background:
          'linear-gradient(180deg, #F5ECD7 0%, rgba(255,214,224,0.25) 50%, #F5ECD7 100%)',
      }}
    >
      {/* ── Decorative background radial gradients ───────────────────────── */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true" style={{
        background: 'radial-gradient(ellipse at 20% 60%, rgba(255,214,224,0.35) 0%, transparent 55%), radial-gradient(ellipse at 80% 30%, rgba(232,213,245,0.30) 0%, transparent 45%)',
        zIndex: 0,
      }} />

      <div className="relative z-10">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 max-w-xl mx-auto"
        aria-label="Love notes section header"
      >
        <p className="text-[#B76E79]/80 text-sm font-medium uppercase tracking-widest mb-3">
          Chapter Four
        </p>
        <h1
          style={{ fontFamily: "'Playfair Display', serif" }}
          className="text-4xl sm:text-5xl font-bold text-[#B76E79] mb-4 drop-shadow-sm"
        >
          Love Notes
        </h1>
        <p className="text-[#5a4040]/65 text-base leading-relaxed">
          Little thoughts I hold for you — in three languages, because one was never enough.
        </p>
        <div className="flex items-center gap-3 mt-6 justify-center">
          <div className="h-px w-16 bg-[#B76E79]/30" />
          <span className="text-[#B76E79] text-lg" aria-hidden="true">💌</span>
          <div className="h-px w-16 bg-[#B76E79]/30" />
        </div>
      </motion.header>

      {/* ── Language switcher ────────────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="flex justify-center gap-2 mb-8"
        aria-label="Choose note language"
      >
        {LANG_CONFIG.map((cfg) => {
          const isActive = lang === cfg.key
          return (
            <button
              key={cfg.key}
              onClick={() => switchLang(cfg.key)}
              aria-pressed={isActive}
              aria-label={`Switch to ${cfg.locale}`}
              className={[
                'px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B76E79]',
                isActive
                  ? 'text-white shadow-[0_2px_12px_rgba(183,110,121,0.4)]'
                  : 'bg-white/40 text-[#B76E79] border border-[#B76E79]/25 hover:bg-[#FFD6E0]/60',
                cfg.key !== 'en' ? 'font-devanagari' : '',
              ].join(' ')}
              style={
                isActive
                  ? {
                      background: 'linear-gradient(135deg, #B76E79 0%, #c9828c 100%)',
                      ...(cfg.key !== 'en' ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {}),
                    }
                  : cfg.key !== 'en'
                  ? { fontFamily: "'Noto Sans Devanagari', sans-serif" }
                  : undefined
              }
            >
              {cfg.label}
            </button>
          )
        })}
      </motion.nav>

      {/* ── Stats bar ────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex justify-center mb-8"
      >
        <StatsBar
          favoriteCount={favorites.length}
          bookmarkCount={bookmarks.length}
          totalInLang={pool.length}
        />
      </motion.div>

      {/* ── Note card ────────────────────────────────────────────────────── */}
      <div className="max-w-lg mx-auto mb-8">
        {pool.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <p className="text-[#B76E79]/60">No notes available in this language yet.</p>
            <p className="text-[#B76E79]/40 text-sm mt-1">Add some from the Admin Panel.</p>
          </GlassCard>
        ) : currentNote ? (
          <NoteCard
            note={currentNote}
            isFavorited={favorites.includes(currentNote.id)}
            isBookmarked={bookmarks.includes(currentNote.id)}
            onFavorite={handleFavorite}
            onBookmark={handleBookmark}
          />
        ) : null}
      </div>

      {/* ── Next Note button ──────────────────────────────────────────────── */}
      {pool.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="flex justify-center mb-12"
        >
          <Button
            variant="outline"
            size="md"
            onClick={handleNext}
            ariaLabel="Show a different love note"
          >
            Next Note ✨
          </Button>
        </motion.div>
      )}

      {/* ── Favorites / bookmarks summary ────────────────────────────────── */}
      {(favorites.length > 0 || bookmarks.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-lg mx-auto mb-10 p-4 rounded-2xl text-center"
          style={{
            background: 'rgba(255,214,224,0.35)',
            border: '1px solid rgba(183,110,121,0.18)',
          }}
          aria-live="polite"
        >
          <p className="text-[#B76E79]/70 text-sm">
            {favorites.length > 0 && (
              <>
                <Heart size={13} fill="#B76E79" className="inline mr-1" aria-hidden="true" />
                <strong>{favorites.length}</strong> note{favorites.length > 1 ? 's' : ''} you loved
              </>
            )}
            {favorites.length > 0 && bookmarks.length > 0 && (
              <span className="mx-2 opacity-40">·</span>
            )}
            {bookmarks.length > 0 && (
              <>
                <Bookmark size={13} fill="#7c3aed" className="inline mr-1" aria-hidden="true" />
                <strong>{bookmarks.length}</strong> note{bookmarks.length > 1 ? 's' : ''} saved
              </>
            )}
          </p>
          <p className="text-[#5a4040]/50 text-xs mt-1">
            Your choices are saved — they will be here whenever you return.
          </p>
        </motion.div>
      )}

      {/* ── Navigation CTA ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-4 mt-6"
      >
        <p
          className="text-[#B76E79]/60 text-sm italic"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          There is a letter I wrote just for you…
        </p>
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/letter')}
          ariaLabel="Read the personal letter written for you"
          className="shadow-[0_4px_24px_rgba(183,110,121,0.3)]"
        >
          Read My Letter to You →
        </Button>
      </motion.div>

      </div>{/* end relative z-10 */}
    </div>
  )
}
