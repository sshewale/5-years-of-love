// ─── DarkModeToggle ────────────────────────────────────────────────────────
// Small icon button that toggles dark mode via the useDarkMode hook.
// Shows Moon when light mode is active, Sun when dark mode is active.

import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useDarkMode } from '../hooks/useDarkMode'

export function DarkModeToggle() {
  const { isDark, toggle } = useDarkMode()

  return (
    <motion.button
      onClick={toggle}
      aria-label="Toggle dark mode"
      aria-pressed={isDark}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      style={{
        background: 'transparent',
        border: '1.5px solid #B76E79',
        borderRadius: '50%',
        width: '2.25rem',
        height: '2.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: '#B76E79',
        flexShrink: 0,
      }}
    >
      <motion.span
        key={isDark ? 'sun' : 'moon'}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {isDark ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
      </motion.span>
    </motion.button>
  )
}
