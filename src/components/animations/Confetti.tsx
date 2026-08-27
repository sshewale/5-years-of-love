// ─── Confetti.tsx — Wrapper around canvas-confetti ────────────────────────────
import { useEffect } from 'react'
import confetti from 'canvas-confetti'

type ConfettiVariant = 'burst' | 'hearts' | 'celebration'

interface ConfettiProps {
  trigger: boolean
  variant?: ConfettiVariant
}

// ── Helper: emoji rain fallback for heart shapes ──────────────────────────────
function launchEmojiRain(emojis: string[], count: number) {
  const body = document.body
  const hearts: HTMLDivElement[] = []

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div')
    const emoji = emojis[Math.floor(Math.random() * emojis.length)]
    el.textContent = emoji
    el.style.cssText = [
      'position:fixed',
      `left:${Math.random() * 100}vw`,
      'top:-40px',
      `font-size:${16 + Math.random() * 20}px`,
      'pointer-events:none',
      'z-index:9999',
      'user-select:none',
      `transition:transform ${1.5 + Math.random() * 2}s linear, opacity ${1.5 + Math.random() * 2}s linear`,
    ].join(';')
    body.appendChild(el)
    hearts.push(el)

    setTimeout(() => {
      el.style.transform = `translateY(110vh) rotate(${Math.random() * 720 - 360}deg)`
      el.style.opacity = '0'
    }, 50 + i * 30)

    setTimeout(() => {
      if (body.contains(el)) body.removeChild(el)
    }, 4000 + i * 30)
  }
}

// ── Burst variant ─────────────────────────────────────────────────────────────
function fireBurst() {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#B76E79', '#FFD6E0', '#E8D5F5', '#F5ECD7', '#ffffff', '#ff6b9d'],
    ticks: 200,
    gravity: 1.2,
    scalar: 1.1,
  })
}

// ── Hearts variant ────────────────────────────────────────────────────────────
function fireHearts() {
  // Try to use canvas-confetti's custom shapes (v1.6+)
  try {
    // canvas-confetti exposes shapeFromText in newer builds
    const cf = confetti as typeof confetti & {
      shapeFromText?: (opts: { text: string; scalar?: number }) => unknown
    }

    if (typeof cf.shapeFromText === 'function') {
      const heartShape = cf.shapeFromText({ text: '❤️', scalar: 2 })
      confetti({
        particleCount: 60,
        spread: 90,
        origin: { y: 0.5 },
        shapes: [heartShape as confetti.Shape],
        colors: ['#B76E79', '#ff6b9d', '#FFD6E0', '#ff1744'],
        scalar: 2,
        ticks: 250,
        gravity: 0.8,
      })
    } else {
      throw new Error('shapeFromText not available')
    }
  } catch {
    // Fallback: emoji rain
    launchEmojiRain(['❤️', '🩷', '💕', '💖', '💗'], 40)
  }
}

// ── Celebration variant ───────────────────────────────────────────────────────
function fireCelebration() {
  const duration = 3000
  const end = Date.now() + duration
  const colors = ['#B76E79', '#FFD6E0', '#E8D5F5', '#FFD700', '#ffffff', '#ff6b9d']

  function frame() {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors,
    })
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors,
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  }

  // Initial big blast
  confetti({
    particleCount: 200,
    spread: 100,
    origin: { x: 0.5, y: 0.4 },
    colors,
    gravity: 0.9,
    scalar: 1.2,
    ticks: 300,
  })

  frame()
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Confetti({ trigger, variant = 'burst' }: ConfettiProps) {
  useEffect(() => {
    if (!trigger) return

    switch (variant) {
      case 'burst':
        fireBurst()
        break
      case 'hearts':
        fireHearts()
        break
      case 'celebration':
        fireCelebration()
        break
    }
  }, [trigger, variant])

  // No DOM output — purely side-effect driven
  return null
}
