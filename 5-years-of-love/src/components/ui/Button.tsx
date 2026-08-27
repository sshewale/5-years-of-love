// ─── Button.tsx — Reusable button component ──────────────────────────────────
import type { ReactNode, MouseEvent } from 'react'

type Variant = 'primary' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant?: Variant
  size?: Size
  children: ReactNode
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
  ariaLabel?: string
}

const variantClasses: Record<Variant, string> = {
  primary: [
    'bg-[#B76E79] text-white',
    'hover:bg-[#a55f6a]',
    'hover:shadow-[0_0_20px_rgba(183,110,121,0.5)]',
    'active:scale-[0.97]',
    'disabled:bg-[#B76E79]/50 disabled:shadow-none disabled:cursor-not-allowed',
  ].join(' '),
  ghost: [
    'bg-transparent text-[#B76E79]',
    'hover:bg-[#FFD6E0]/20',
    'active:scale-[0.97]',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ].join(' '),
  outline: [
    'bg-transparent text-[#B76E79]',
    'border-2 border-[#B76E79]',
    'hover:bg-[#B76E79]/10',
    'active:scale-[0.97]',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ].join(' '),
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  ariaLabel,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      className={[
        'inline-flex items-center justify-center gap-2',
        'rounded-2xl font-semibold',
        'transition-all duration-200 ease-in-out',
        'focus-visible:outline-none',
        'focus-visible:ring-2 focus-visible:ring-[#B76E79] focus-visible:ring-offset-2',
        'select-none',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  )
}
