// ─── JourneyNav ────────────────────────────────────────────────────────────
// Persistent Prev / Next navigation bar shown at the bottom of each
// numbered section page, guiding Swati through the story in order.

import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const btnHover = { scale: 1.04, boxShadow: '0 4px 20px rgba(183,110,121,0.35)' }
const btnTap   = { scale: 0.96 }

// Ordered journey — matches the emotional arc in CLAUDE.md
const JOURNEY: { path: string; label: string }[] = [
  { path: '/',            label: 'Home' },
  { path: '/timeline',   label: 'Our Story' },
  { path: '/gallery',    label: 'Our Memories' },
  { path: '/reasons',    label: '100 Reasons' },
  { path: '/notes',      label: 'Love Notes' },
  { path: '/letter',     label: 'My Letter' },
  { path: '/bucket',     label: 'Bucket List' },
  { path: '/quiz',       label: 'Our Quiz' },
  { path: '/dreams',     label: 'Future Dreams' },
  { path: '/jokes',      label: 'Inside Jokes' },
  { path: '/celebration', label: '5 Years' },
]

// Routes where JourneyNav should NOT appear (cinematic + admin)
const HIDDEN_ON = ['/countdown', '/surprise', '/forever', '/easter', '/admin']

export function JourneyNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  if (HIDDEN_ON.some((r) => pathname.startsWith(r))) return null

  const currentIdx = JOURNEY.findIndex((s) => s.path === pathname)
  if (currentIdx === -1) return null

  const prev = currentIdx > 0 ? JOURNEY[currentIdx - 1] : null
  const next = currentIdx < JOURNEY.length - 1 ? JOURNEY[currentIdx + 1] : null

  // On the last regular page (/celebration), "next" goes to the countdown
  const nextOverride =
    pathname === '/celebration'
      ? { path: '/countdown', label: 'The Surprise →' }
      : next

  return (
    <motion.nav
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="flex items-center justify-between gap-4 max-w-2xl mx-auto px-4 py-10"
      aria-label="Journey navigation"
    >
      {/* Prev */}
      {prev ? (
        <motion.button
          onClick={() => navigate(prev.path)}
          aria-label={`Go back to ${prev.label}`}
          whileHover={btnHover}
          whileTap={btnTap}
          className="group flex items-center gap-2 px-4 py-2.5 rounded-2xl border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B76E79]"
          style={{
            borderColor: 'rgba(183,110,121,0.25)',
            backgroundColor: 'rgba(255,255,255,0.45)',
            color: '#B76E79',
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.875rem',
            backdropFilter: 'blur(8px)',
          }}
        >
          <ChevronLeft size={16} aria-hidden="true" className="transition-transform group-hover:-translate-x-0.5" />
          <span className="hidden sm:inline">{prev.label}</span>
          <span className="sm:hidden">Back</span>
        </motion.button>
      ) : (
        <div />
      )}

      {/* Step indicator dots */}
      <div className="flex items-center gap-1.5" aria-hidden="true">
        {JOURNEY.map((_, i) => (
          <motion.span
            key={i}
            className="rounded-full"
            animate={{
              width: i === currentIdx ? '20px' : '6px',
              backgroundColor:
                i === currentIdx
                  ? '#B76E79'
                  : i < currentIdx
                  ? 'rgba(183,110,121,0.5)'
                  : 'rgba(183,110,121,0.2)',
              boxShadow: i === currentIdx
                ? '0 0 8px 2px rgba(183,110,121,0.55)'
                : '0 0 0px 0px transparent',
            }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{ height: '6px', display: 'inline-block' }}
          />
        ))}
      </div>

      {/* Next */}
      {nextOverride ? (
        <motion.button
          onClick={() => navigate(nextOverride.path)}
          aria-label={`Continue to ${nextOverride.label}`}
          whileHover={{ scale: 1.05, boxShadow: '0 6px 24px rgba(183,110,121,0.55)' }}
          whileTap={btnTap}
          className="group flex items-center gap-2 px-4 py-2.5 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B76E79]"
          style={{
            backgroundColor: '#B76E79',
            color: '#fff',
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.875rem',
            boxShadow: '0 2px 12px rgba(183,110,121,0.35)',
          }}
        >
          <span className="hidden sm:inline">{nextOverride.label}</span>
          <span className="sm:hidden">Next</span>
          <ChevronRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
        </motion.button>
      ) : (
        <div />
      )}
    </motion.nav>
  )
}
