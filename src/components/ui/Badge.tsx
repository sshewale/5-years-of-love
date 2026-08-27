// ─── Badge.tsx — Pill badge component ────────────────────────────────────────
import type { ReactNode } from 'react'

type BadgeVariant = 'rose' | 'lavender' | 'pink' | 'beige'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  rose: 'bg-[#B76E79]/15 text-[#B76E79] border border-[#B76E79]/30',
  lavender: 'bg-[#E8D5F5]/60 text-[#7c3aed] border border-[#E8D5F5]',
  pink: 'bg-[#FFD6E0]/60 text-[#be185d] border border-[#FFD6E0]',
  beige: 'bg-[#F5ECD7] text-[#78716c] border border-[#e8d5b7]',
}

export default function Badge({
  children,
  variant = 'rose',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  )
}
