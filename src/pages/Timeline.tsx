// ─── Timeline.tsx — Alternating vertical timeline of relationship milestones ───
import { useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import { timelineEvents } from '../data/timeline'
import { getStorageItem } from '../utils/storage'
import { STORAGE_KEYS } from '../utils/constants'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import type { TimelineEvent } from '../types'

// ── Helper: load events (admin override > default) ────────────────────────────
function loadEvents(): TimelineEvent[] {
  const stored = getStorageItem<TimelineEvent[]>(STORAGE_KEYS.TIMELINE)
  if (Array.isArray(stored) && stored.length > 0) return stored
  return timelineEvents
}

// ── Timeline dot with rose-gold pulse ─────────────────────────────────────────
function TimelineDot({ icon }: { icon: string }) {
  return (
    <div className="relative flex-shrink-0 z-10" aria-hidden="true">
      {/* Pulse ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-[#B76E79]/25"
        animate={{ scale: [1, 1.7, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ borderRadius: '50%' }}
      />
      <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#B76E79] to-[#a55f6a] flex items-center justify-center text-xl shadow-[0_0_16px_rgba(183,110,121,0.4)]">
        {icon}
      </div>
    </div>
  )
}

// ── Individual timeline card ───────────────────────────────────────────────────
interface EventCardProps {
  event: TimelineEvent
  isRight: boolean
}

function EventCard({ event, isRight }: EventCardProps) {
  const { ref, inView } = useScrollAnimation(0.12)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleMouseEnter = useCallback(() => {
    videoRef.current?.play().catch(() => {})
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }, [])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isRight ? 60 : -60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className={[
        'w-full md:w-[46%]',
        isRight ? 'md:ml-auto' : 'md:mr-auto',
      ].join(' ')}
    >
      <GlassCard
        className="overflow-hidden border-l-4 border-[#B76E79] p-0"
      >
        {/* Photo / Video */}
        <div
          className="relative w-full overflow-hidden rounded-t-2xl bg-[#F5ECD7]"
          style={{ aspectRatio: '16/9', backgroundColor: '#F5ECD7' }}
          onMouseEnter={event.video ? handleMouseEnter : undefined}
          onMouseLeave={event.video ? handleMouseLeave : undefined}
        >
          {event.video ? (
            <video
              ref={videoRef}
              src={event.video}
              poster={event.photo}
              muted
              playsInline
              loop
              className="w-full h-full object-contain object-center bg-black"
              aria-label={`Video for ${event.title}`}
            />
          ) : (
            <img
              src={event.photo ?? '/images/placeholder/timeline-default.jpg'}
              alt={event.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-contain object-center bg-transparent"
              onError={(e) => {
                const img = e.currentTarget
                // Fallback: rose-gold gradient placeholder
                img.style.display = 'none'
                const parent = img.parentElement
                if (parent && !parent.querySelector('.img-fallback')) {
                  const fallback = document.createElement('div')
                  fallback.className = 'img-fallback w-full h-full flex items-center justify-center text-5xl'
                  fallback.style.background =
                    'linear-gradient(135deg, #FFD6E0 0%, #E8D5F5 100%)'
                  fallback.textContent = event.icon
                  parent.appendChild(fallback)
                }
              }}
            />
          )}

          {/* Date badge overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-4 py-3">
            <span className="text-white text-xs font-medium tracking-wide">
              {event.date}
            </span>
          </div>
        </div>

        {/* Card body */}
        <div className="px-5 pt-4 pb-5 flex flex-col gap-2">
          {/* Location */}
          <p className="text-[#B76E79]/60 text-xs font-medium tracking-wider uppercase flex items-center gap-1">
            <span aria-hidden="true">📍</span>
            {event.location}
          </p>

          {/* Title */}
          <h3
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-xl font-bold text-[#B76E79] leading-snug"
          >
            {event.title}
          </h3>

          {/* Story */}
          <p className="text-[#5a4040]/75 text-sm leading-relaxed">
            {event.story}
          </p>
        </div>
      </GlassCard>
    </motion.div>
  )
}

// ── Main Timeline ─────────────────────────────────────────────────────────────
export default function Timeline() {
  const navigate = useNavigate()
  const events = loadEvents()
  const adminBanner = getStorageItem<any>(STORAGE_KEYS.ADMIN_MESSAGE) ?? null

  return (
    <div
      className="min-h-screen px-4 py-16"
      style={{
        background:
          'linear-gradient(180deg, #F5ECD7 0%, rgba(232,213,245,0.25) 50%, #F5ECD7 100%)',
      }}
    >
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 max-w-2xl mx-auto"
        aria-label="Timeline section header"
      >
        <p className="text-[#B76E79]/60 text-sm font-medium uppercase tracking-widest mb-3">
          Chapter One
        </p>
        <h1
          style={{ fontFamily: "'Playfair Display', serif" }}
          className="text-4xl sm:text-5xl font-bold text-[#B76E79] mb-4"
        >
          Our Story
        </h1>
        <p className="text-[#5a4040]/65 text-base leading-relaxed">
          Every love story is made of moments. Here are ours.
        </p>
        {/* Decorative rule */}
        <div className="flex items-center gap-3 mt-6 justify-center">
          <div className="h-px w-16 bg-[#B76E79]/30" />
          <span className="text-[#B76E79] text-lg">❤️</span>
          <div className="h-px w-16 bg-[#B76E79]/30" />
        </div>
      </motion.header>

      {/* Featured personal message using saved banner settings */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="max-w-3xl mx-auto mb-12 text-center px-4"
        aria-hidden={false}
      >
        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#E9DDE0]">
          <img
            src={adminBanner?.image ?? '/images/5th%20year%202025/20240409_153617.jpg'}
            alt={adminBanner?.alt ?? 'A special memory'}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transformOrigin: 'center' }}
          />

          <div
            className="absolute inset-0"
            style={{
              background: `rgba(0,0,0,${(adminBanner?.overlay ?? 38) / 100})`,
              backdropFilter: `blur(${adminBanner?.blur ?? 4}px)`,
            }}
          />

          <div className="relative px-6 py-8 sm:py-10">
            <div
              className="h-full flex items-center"
              style={{ justifyContent: adminBanner?.align === 'left' ? 'flex-start' : adminBanner?.align === 'right' ? 'flex-end' : 'center' }}
            >
              <div className="text-white max-w-[85%]">
                <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl sm:text-3xl leading-tight drop-shadow-md">
                  {adminBanner?.text ?? "You come into my life unexpectedly and I'm addicted to you permanently.."}
                </p>
                <p className="mt-3 text-sm text-white/90">{adminBanner?.signature ?? '— With all my heart'}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Timeline body ────────────────────────────────────────────────── */}
      <ol
        className="relative max-w-5xl mx-auto"
        aria-label="Relationship timeline"
      >
        {/* Central vertical line (desktop only) */}
        <div
          aria-hidden="true"
          className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px"
          style={{
            background:
              'linear-gradient(to bottom, transparent, #B76E79 8%, #B76E79 92%, transparent)',
            opacity: 0.35,
          }}
        />

        <div className="flex flex-col gap-12">
          {events.map((event, idx) => {
            const isRight = idx % 2 !== 0
            return (
              <li
                key={event.id}
                className="relative flex flex-col md:flex-row items-start md:items-center gap-6"
              >
                {/* Mobile: dot on left; Desktop: dot in centre */}
                <div
                  className={[
                    'flex-shrink-0',
                    'md:absolute md:left-1/2 md:-translate-x-1/2',
                    'md:top-1/2 md:-translate-y-1/2',
                    'order-first md:order-none',
                  ].join(' ')}
                >
                  <TimelineDot icon={event.icon} />
                </div>

                {/* Card */}
                <EventCard event={event} isRight={isRight} />
              </li>
            )
          })}
        </div>
      </ol>

      {/* ── Navigation CTA ───────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-4 mt-20"
      >
        <p
          className="text-[#B76E79]/60 text-sm italic"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          And there are so many memories still to make…
        </p>
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/gallery')}
          ariaLabel="Explore our photo memories in the gallery"
          className="shadow-[0_4px_24px_rgba(183,110,121,0.3)]"
        >
          Explore Our Memories →
        </Button>
      </motion.div>
    </div>
  )
}
