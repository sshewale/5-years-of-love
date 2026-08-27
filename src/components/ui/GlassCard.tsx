// ─── GlassCard.tsx — Glassmorphism card component ────────────────────────────
import type { CSSProperties, ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export default function GlassCard({ children, className = '', style }: GlassCardProps) {
  return (
    <div
      className={[
        'backdrop-blur-md',
        'bg-white/60 dark:bg-white/10',
        'border border-[#B76E79]/15',
        'rounded-2xl',
        'shadow-[0_4px_24px_rgba(183,110,121,0.08),inset_0_1px_0_rgba(255,255,255,0.8)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      {children}
    </div>
  )
}
