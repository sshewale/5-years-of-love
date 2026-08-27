// ─── StarField.tsx — 100 twinkling stars + occasional shooting star ───────────
import { useMemo, useEffect, useRef } from 'react'

const STAR_COUNT = 100
const SHOOTING_STAR_INTERVAL = 5000 // ms between shooting stars

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

interface StarConfig {
  id: number
  top: number    // %
  left: number   // %
  size: number   // px (1–3)
  delay: number  // s (0–5)
  duration: number // s (1–3)
  color: string
}

function generateStars(): StarConfig[] {
  return Array.from({ length: STAR_COUNT }, (_, i) => ({
    id: i,
    top: randomBetween(0, 100),
    left: randomBetween(0, 100),
    size: randomBetween(1, 3),
    delay: randomBetween(0, 5),
    duration: randomBetween(1, 3),
    color: i % 3 === 0 ? '#fffde7' : '#ffffff',
  }))
}

function spawnShootingStar(container: HTMLDivElement) {
  const star = document.createElement('div')
  const startLeft = randomBetween(10, 70)
  const startTop = randomBetween(5, 40)
  star.style.cssText = `
    position: absolute;
    left: ${startLeft}%;
    top: ${startTop}%;
    width: 120px;
    height: 2px;
    background: linear-gradient(90deg, rgba(255,255,255,0.95), rgba(255,255,255,0));
    border-radius: 2px;
    transform: rotate(${randomBetween(20, 40)}deg);
    opacity: 0;
    pointer-events: none;
    animation: swati-shoot 0.9s ease-out forwards;
    box-shadow: 0 0 6px 1px rgba(255,255,255,0.6);
  `
  container.appendChild(star)
  setTimeout(() => star.remove(), 1000)
}

export default function StarField() {
  const stars = useMemo(() => generateStars(), [])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const fire = () => {
      if (containerRef.current) spawnShootingStar(containerRef.current)
    }

    // First shoot after a short delay, then periodically
    const initial = setTimeout(fire, 2000)
    const interval = setInterval(fire, SHOOTING_STAR_INTERVAL)
    return () => {
      clearTimeout(initial)
      clearInterval(interval)
    }
  }, [])

  return (
    <>
      <style>{`
        @keyframes swati-twinkle {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50%       { opacity: 1;    transform: scale(1.4); }
        }
        @keyframes swati-shoot {
          0%   { opacity: 0;   transform: translateX(0)   rotate(30deg); }
          15%  { opacity: 1; }
          100% { opacity: 0;   transform: translateX(180px) rotate(30deg); }
        }
      `}</style>

      <div
        ref={containerRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        {stars.map((star) => (
          <div
            key={star.id}
            style={{
              position: 'absolute',
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: star.size,
              height: star.size,
              borderRadius: '50%',
              backgroundColor: star.color,
              boxShadow: `0 0 ${star.size + 1}px ${star.color}`,
              animation: `swati-twinkle ${star.duration}s ${star.delay}s ease-in-out infinite`,
              willChange: 'opacity, transform',
            }}
          />
        ))}
      </div>
    </>
  )
}
