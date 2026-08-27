// ─── Letter.tsx — Full-page love letter with paper texture + scroll parallax ──
import type { CSSProperties } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'
import { useRef, useState, useCallback } from 'react'
import { Share2, Check } from 'lucide-react'
import { getStorageItem } from '../utils/storage'
import { STORAGE_KEYS } from '../utils/constants'

// Admin-override key for the letter body (stored by AdminPanel)
const LETTER_STORAGE_KEY = STORAGE_KEYS.ADMIN_MESSAGE

const DEFAULT_LETTER_PARAGRAPHS = [
  'Dear Swati, I want to tell you about a day — 20th December 2020. An arranged meeting, two nervous people, a lot of hoping. I walked in and saw you, and something inside me went very quiet in the best possible way. I did not know then that I was meeting my future. I only knew I wanted the conversation to never end.',
  'Seven days later, on our engagement day, I told you I loved you. It should have been too soon. It was not. It was the truest thing I had ever said — and you smiled in that way that makes me forget everything else. That smile. I have been chasing it ever since.',
  'These five years have taken us everywhere. Mountains in Manali where we got a little lost and laughed about it. The beaches of Goa where your sister kept us perfectly chaotic. Kashmir in all its impossible beauty — the Dal Lake at dawn, the gardens in bloom, and you beside me. Kerala on a houseboat, the backwaters drifting past, you asleep on the deck in the most peaceful way. Every single trip, you are my favourite part.',
  'But it is not just the mountains and the oceans. It is the forts near Pune that we climb even when it is hot and steep. It is every dinner debate about where to eat. It is your "one more photo" at every viewpoint. It is the drive home when we are tired and happy and completely ourselves. The ordinary days are where I love you most.',
  'You taught me what it means to be truly known by someone. To be loved not despite your imperfections but including them. You see all of me — and you stay. That is the greatest gift anyone has ever given me.',
  'On every trip, in every city, at every viewpoint with a ridiculous number of photos — I look at you and think: of all the things I have ever done right, finding you is the best one.',
  'Happy birthday, Swati. I loved you the moment I saw you, I love you more with every year, and I will love you longer than forever has words for.',
  'With all my heart, always,\nSatish ❤️',
]

function getLetterContent(): string[] {
  const adminMessage = getStorageItem<string>(LETTER_STORAGE_KEY)
  if (adminMessage && adminMessage.trim().length > 0) {
    // Split admin message into paragraphs on double newlines
    return adminMessage
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean)
  }
  return DEFAULT_LETTER_PARAGRAPHS
}

// ── WaxSeal SVG ───────────────────────────────────────────────────────────────
function WaxSeal() {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -20, opacity: 0 }}
      animate={{ scale: 1, rotate: -8, opacity: 1 }}
      transition={{ delay: 1.2, type: 'spring', stiffness: 200, damping: 18 }}
      className="flex justify-center mt-10"
      aria-hidden="true"
    >
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Wax seal"
      >
        {/* Outer circle */}
        <circle cx="40" cy="40" r="38" fill="#B76E79" />
        {/* Inner decorative ring */}
        <circle cx="40" cy="40" r="32" fill="none" stroke="#FFD6E0" strokeWidth="1.5" strokeDasharray="4 3" />
        {/* Heart shape */}
        <path
          d="M40 54 C40 54 22 42 22 30 C22 23 28 18 34 20 C37 21 40 24 40 24 C40 24 43 21 46 20 C52 18 58 23 58 30 C58 42 40 54 40 54Z"
          fill="#FFD6E0"
          opacity="0.9"
        />
        {/* Shine */}
        <ellipse cx="30" cy="24" rx="5" ry="3" fill="white" opacity="0.2" transform="rotate(-30 30 24)" />
      </svg>
    </motion.div>
  )
}

// ── Decorative corner flourish ────────────────────────────────────────────────
function CornerFlourish({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M4 44 Q4 4 44 4"
        stroke="#B76E79"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
        fill="none"
      />
      <path
        d="M4 44 Q24 4 44 4"
        stroke="#B76E79"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.25"
        fill="none"
      />
      <circle cx="4" cy="44" r="2.5" fill="#B76E79" opacity="0.4" />
      <circle cx="44" cy="4" r="2.5" fill="#B76E79" opacity="0.4" />
      <circle cx="24" cy="24" r="1.5" fill="#B76E79" opacity="0.3" />
    </svg>
  )
}

// ── Share button ──────────────────────────────────────────────────────────────
function ShareButton() {
  const [shared, setShared] = useState(false)

  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: '5 Years of Love — A Letter',
          text: 'A love letter written just for you ❤️',
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      }
    } catch {
      // User cancelled share — no action needed
    }
  }, [])

  return (
    <motion.button
      onClick={handleShare}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Share this letter"
      className="flex items-center gap-2 mx-auto mt-6 px-5 py-2.5 rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B76E79]"
      style={{
        backgroundColor: shared ? '#22c55e' : 'rgba(183,110,121,0.1)',
        color: shared ? '#fff' : '#B76E79',
        border: '1px solid',
        borderColor: shared ? '#22c55e' : 'rgba(183,110,121,0.3)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {shared ? <Check size={15} aria-hidden="true" /> : <Share2 size={15} aria-hidden="true" />}
      {shared ? 'Link copied!' : 'Share this letter'}
    </motion.button>
  )
}

export default function Letter() {
  const containerRef = useRef<HTMLDivElement>(null)
  const paragraphs = getLetterContent()

  // Scroll-based parallax on the outer wrapper
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })
  const yParallax = useTransform(scrollYProgress, [0, 1], [-20, 20])

  // Separate letter body from closing signature
  const signaturePara = paragraphs[paragraphs.length - 1]
  const bodyParagraphs = paragraphs.slice(0, -1)

  return (
    <main
      ref={containerRef}
      className="min-h-screen py-16 px-4"
      style={{ backgroundColor: '#F5ECD7' }}
      aria-label="Love letter to Swati"
    >
      {/* Subtle decorative background dots */}
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle, #B76E7915 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          zIndex: 0,
        }}
      />

      <motion.div
        style={{ y: yParallax, position: 'relative', zIndex: 1 }}
        className="flex justify-center"
      >
        {/* Paper card */}
        <motion.article
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="paper-texture relative w-full max-w-2xl rounded-2xl shadow-2xl"
          style={{
            backgroundColor: '#fffef8',
            padding: '4rem 3rem',
            // Subtle gradient to make it feel like aged paper
            background:
              'linear-gradient(135deg, #fffef8 0%, #fef9ef 50%, #fdf5e8 100%)',
          }}
          aria-label="Letter content"
        >
          {/* Corner flourishes */}
          <CornerFlourish className="absolute top-4 left-4" />
          <CornerFlourish
            className="absolute top-4 right-4"
            style={{ transform: 'scaleX(-1)' } as CSSProperties}
          />
          <CornerFlourish
            className="absolute bottom-4 left-4"
            style={{ transform: 'scaleY(-1)' } as CSSProperties}
          />
          <CornerFlourish
            className="absolute bottom-4 right-4"
            style={{ transform: 'scale(-1)' } as CSSProperties}
          />

          {/* Decorative top line */}
          <div
            className="flex items-center gap-3 mb-10"
            aria-hidden="true"
          >
            <div className="flex-1 h-px" style={{ backgroundColor: '#B76E7940' }} />
            <span style={{ color: '#B76E79', fontSize: '1.25rem' }}>✦</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#B76E7940' }} />
          </div>

          {/* "Dear Swati" heading */}
          <motion.h1
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: 'clamp(2rem, 5vw, 2.5rem)',
              color: '#B76E79',
              marginBottom: '2rem',
              lineHeight: 1.3,
            }}
          >
            Dear Swati ❤️
          </motion.h1>

          {/* Letter body paragraphs */}
          <div
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: 'clamp(1.05rem, 2.5vw, 1.2rem)',
              color: '#3d2c2c',
              lineHeight: 2,
            }}
          >
            {bodyParagraphs.map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.4 + i * 0.12,
                  duration: 0.6,
                  ease: 'easeOut',
                }}
                style={{
                  marginBottom: '1.5rem',
                  textIndent: i === 0 ? '0' : '1.5rem',
                }}
              >
                {para}
              </motion.p>
            ))}

            {/* Decorative divider before signature */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.9 + bodyParagraphs.length * 0.12, duration: 0.5 }}
              className="flex items-center gap-3 my-8"
              aria-hidden="true"
            >
              <div className="flex-1 h-px" style={{ backgroundColor: '#B76E7930' }} />
              <span style={{ color: '#B76E7960', fontSize: '1rem' }}>❤</span>
              <div className="flex-1 h-px" style={{ backgroundColor: '#B76E7930' }} />
            </motion.div>

            {/* Signature / closing */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1.0 + bodyParagraphs.length * 0.12,
                duration: 0.6,
              }}
              style={{
                whiteSpace: 'pre-line',
                textAlign: 'right',
                fontSize: 'clamp(1.1rem, 2.8vw, 1.3rem)',
                color: '#B76E79',
                fontWeight: 600,
              }}
            >
              {signaturePara}
            </motion.p>
          </div>

          {/* Wax seal */}
          <WaxSeal />

          {/* Share */}
          <ShareButton />

          {/* Decorative bottom line */}
          <div
            className="flex items-center gap-3 mt-10"
            aria-hidden="true"
          >
            <div className="flex-1 h-px" style={{ backgroundColor: '#B76E7940' }} />
            <span style={{ color: '#B76E79', fontSize: '1.25rem' }}>✦</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#B76E7940' }} />
          </div>
        </motion.article>
      </motion.div>
    </main>
  )
}
