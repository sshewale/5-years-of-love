// ─── Footer ────────────────────────────────────────────────────────────────
// Dark footer with an animated infinity SVG, tagline, copyright, and an
// Easter egg: clicking the ∞ symbol 3 times reveals a hidden love quote.

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const HIDDEN_QUOTES: string[] = [
  '"In you, I found the home I never knew I was looking for." — Satish',
  '"Every day with you is my favourite day, so today is my new favourite day." ❤️',
  '"You are my today and all of my tomorrows." — Satish',
  '"I look at you and see the rest of my life in front of my eyes." ❤️',
  '"Meeting you was fate, becoming your friend was a choice, but falling in love with you — that was completely out of my hands." — Satish',
]

// Infinity SVG: a figure-8 path with a looping stroke-dashoffset animation.
function InfinitySymbol({ onClick }: { onClick: () => void }) {
  // Approximate perimeter of the ∞ path at this scale ≈ 300
  const dashLength = 300

  return (
    <button
      onClick={onClick}
      aria-label="Hidden love note (click 3 times)"
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '0.5rem',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width="80"
        height="40"
        viewBox="0 0 120 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/*
          Infinity path built from two circles meeting at the centre.
          Using a cubic bezier approximation: two rounded loops.
        */}
        <path
          d="M60,30
             C60,15 45,5 30,5
             C15,5 5,15 5,30
             C5,45 15,55 30,55
             C45,55 60,45 60,30
             C60,15 75,5 90,5
             C105,5 115,15 115,30
             C115,45 105,55 90,55
             C75,55 60,45 60,30 Z"
          stroke="#B76E79"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray={dashLength}
          strokeDashoffset={0}
        >
          <animate
            attributeName="stroke-dashoffset"
            from={dashLength}
            to={0}
            dur="2.5s"
            repeatCount="indefinite"
            calcMode="linear"
          />
        </path>
      </svg>
    </button>
  )
}

export function Footer() {
  const [clickCount, setClickCount] = useState<number>(0)
  const [quoteIndex, setQuoteIndex] = useState<number>(0)
  const [showQuote, setShowQuote] = useState<boolean>(false)

  const handleInfinityClick = useCallback(() => {
    setClickCount((prev) => {
      const next = prev + 1
      if (next >= 3) {
        // Pick a random quote (different from current if possible)
        setQuoteIndex((qi) => {
          let next_qi = Math.floor(Math.random() * HIDDEN_QUOTES.length)
          if (next_qi === qi && HIDDEN_QUOTES.length > 1) {
            next_qi = (qi + 1) % HIDDEN_QUOTES.length
          }
          return next_qi
        })
        setShowQuote(true)
        return 0 // reset counter so it can be triggered again
      }
      return next
    })
  }, [])

  function dismissQuote() {
    setShowQuote(false)
  }

  return (
    <footer
      style={{
        background: '#1A1A2E',
        color: '#e5e5e5',
        padding: '3rem 1.5rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle rose-gold top border */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(to right, transparent, #B76E79, #FFD6E0, #B76E79, transparent)',
        }}
      />

      {/* Animated infinity symbol */}
      <InfinitySymbol onClick={handleInfinityClick} />

      {/* Click hint */}
      <p
        style={{
          fontSize: '0.7rem',
          color: 'rgba(183,110,121,0.6)',
          marginTop: '0.25rem',
          fontFamily: "'Inter', sans-serif",
          letterSpacing: '0.05em',
        }}
      >
        {clickCount > 0 ? `${3 - clickCount} more click${3 - clickCount !== 1 ? 's' : ''}…` : 'click ∞ for a surprise'}
      </p>

      {/* Tagline */}
      <h2
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.35rem',
          fontWeight: 600,
          color: '#FFD6E0',
          marginTop: '1.25rem',
          marginBottom: '0.5rem',
          letterSpacing: '0.01em',
        }}
      >
        Forever Begins Again Every Day ❤️
      </h2>

      {/* Copyright */}
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.8rem',
          color: 'rgba(229,229,229,0.5)',
          marginTop: '1.5rem',
        }}
      >
        © 2024 Made with ❤️ by Satish
      </p>

      {/* Hidden love note overlay */}
      <AnimatePresence>
        {showQuote && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            role="dialog"
            aria-modal="true"
            aria-label="Hidden love note"
            style={{
              position: 'fixed',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 60,
              maxWidth: '480px',
              width: 'calc(100% - 2rem)',
              background: 'rgba(26,26,46,0.97)',
              border: '1px solid rgba(183,110,121,0.4)',
              borderRadius: '16px',
              padding: '1.5rem 1.75rem',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: '1.2rem',
                color: '#FFD6E0',
                lineHeight: 1.6,
                marginBottom: '1.25rem',
              }}
            >
              {HIDDEN_QUOTES[quoteIndex]}
            </p>
            <button
              onClick={dismissQuote}
              aria-label="Close hidden love note"
              style={{
                background: '#B76E79',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.45rem 1.25rem',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Close ❤️
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  )
}
