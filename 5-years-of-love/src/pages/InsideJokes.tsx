// ─── InsideJokes.tsx — Scrapbook flip-card grid of inside jokes ────────────────
import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { STORAGE_KEYS } from '../utils/constants'
import { getStorageItem } from '../utils/storage'
import { insideJokes as defaultJokes } from '../data/insideJokes'
import type { InsideJoke } from '../types'

// ── Flip card CSS injected once ───────────────────────────────────────────────
const FLIP_CARD_STYLE = `
.swati-flip-card {
  perspective: 1000px;
}
.swati-flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}
.swati-flip-card.flipped .swati-flip-card-inner {
  transform: rotateY(180deg);
}
.swati-flip-card-front,
.swati-flip-card-back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 1.25rem;
  overflow: hidden;
}
.swati-flip-card-back {
  transform: rotateY(180deg);
}
`

interface JokeCardProps {
  joke: InsideJoke
  isFavorited: boolean
  onToggleFav: (id: string) => void
}

function JokeCard({ joke, isFavorited, onToggleFav }: JokeCardProps) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className={`swati-flip-card${flipped ? ' flipped' : ''}`}
      style={{ height: '300px', cursor: 'pointer' }}
      onClick={() => setFlipped((f) => !f)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setFlipped((f) => !f)
        }
      }}
      tabIndex={0}
      role="button"
      aria-pressed={flipped}
      aria-label={`${joke.title} — click to ${flipped ? 'hide' : 'read'} the story`}
    >
      <div className="swati-flip-card-inner">
        {/* FRONT */}
        <div
          className="swati-flip-card-front flex flex-col items-center justify-center gap-4 p-6"
          style={{
            background: 'linear-gradient(135deg, #FFF5F7 0%, #FFD6E0 60%, #F5ECD7 100%)',
            border: '2px solid rgba(183,110,121,0.2)',
          }}
        >
          <span style={{ fontSize: '3.5rem', lineHeight: 1 }} aria-hidden="true">
            {joke.emoji}
          </span>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              color: '#B76E79',
              fontWeight: 700,
              fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
              textAlign: 'center',
              lineHeight: 1.4,
            }}
          >
            {joke.title}
          </p>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.72rem',
              color: 'rgba(183,110,121,0.6)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Tap to read ↩
          </p>
        </div>

        {/* BACK */}
        <div
          className="swati-flip-card-back flex flex-col justify-between p-6"
          style={{
            background: 'linear-gradient(135deg, #1A1A2E 0%, #2a1a2e 100%)',
            border: '2px solid rgba(183,110,121,0.3)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Story text */}
          <div className="flex-1 flex items-center overflow-y-auto">
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                color: '#FFD6E0',
                fontSize: 'clamp(0.82rem, 1.8vw, 0.95rem)',
                lineHeight: 1.75,
                fontWeight: 400,
                fontStyle: 'normal',
              }}
            >
              {joke.story}
            </p>
          </div>

          {/* Footer: emoji + fav */}
          <div className="flex items-center justify-between mt-4">
            <span style={{ fontSize: '1.5rem' }} aria-hidden="true">
              {joke.emoji}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleFav(joke.id)
              }}
              aria-label={
                isFavorited
                  ? `Remove ${joke.title} from favourites`
                  : `Add ${joke.title} to favourites`
              }
              aria-pressed={isFavorited}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-200"
              style={{
                backgroundColor: isFavorited
                  ? 'rgba(183,110,121,0.25)'
                  : 'rgba(255,255,255,0.07)',
                border: `1.5px solid ${isFavorited ? '#B76E79' : 'rgba(183,110,121,0.3)'}`,
              }}
            >
              <Heart
                size={15}
                fill={isFavorited ? '#B76E79' : 'none'}
                stroke="#B76E79"
                strokeWidth={2}
              />
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.7rem',
                  color: '#B76E79',
                }}
              >
                {isFavorited ? 'Loved' : 'Love it'}
              </span>
            </button>
          </div>

          {/* Flip back hint */}
          <p
            className="text-center mt-3"
            style={{
              fontSize: '0.65rem',
              color: 'rgba(255,214,224,0.35)',
              fontFamily: "'Inter', sans-serif",
              letterSpacing: '0.08em',
            }}
          >
            Tap card to flip back
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function InsideJokes() {
  // Load jokes: admin override or default data
  const jokes: InsideJoke[] =
    getStorageItem<InsideJoke[]>(STORAGE_KEYS.ADMIN_INSIDE_JOKES) ?? defaultJokes

  // Favorites stored in localStorage
  const [favIds, setFavIds] = useLocalStorage<string[]>(
    STORAGE_KEYS.INSIDE_JOKES_FAV,
    []
  )

  const handleToggleFav = useCallback(
    (id: string) => {
      setFavIds(
        favIds.includes(id)
          ? favIds.filter((fid) => fid !== id)
          : [...favIds, id]
      )
    },
    [favIds, setFavIds]
  )

  const favCount = favIds.length

  return (
    <>
      {/* Inject flip-card CSS once */}
      <style>{FLIP_CARD_STYLE}</style>

      <main
        className="min-h-screen px-4 py-16 md:py-20"
        style={{ backgroundColor: '#F5ECD7' }}
      >
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              color: '#B76E79',
              fontWeight: 900,
              fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              lineHeight: 1.2,
            }}
          >
            Just Between Us 🤫
          </h1>
          <p
            className="mt-3"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: '#a07080',
              fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
            }}
          >
            Things only we would understand ❤️
          </p>

          {favCount > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2"
              style={{
                fontSize: '0.85rem',
                color: '#B76E79',
                fontFamily: "'Inter', sans-serif",
                fontStyle: 'italic',
              }}
            >
              {favCount} {favCount === 1 ? 'memory' : 'memories'} loved ❤️
            </motion.p>
          )}
        </motion.div>

        {/* Card grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.09 } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {jokes.map((joke) => (
            <motion.div
              key={joke.id}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
              }}
            >
              <JokeCard
                joke={joke}
                isFavorited={favIds.includes(joke.id)}
                onToggleFav={handleToggleFav}
              />
            </motion.div>
          ))}
        </motion.div>
      </main>
    </>
  )
}
