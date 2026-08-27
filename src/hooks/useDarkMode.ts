// ─── Dark mode hook ────────────────────────────────────────────────────────
import { useEffect, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS } from '../utils/constants'

interface UseDarkModeReturn {
  isDark: boolean
  toggle: () => void
}

/**
 * useDarkMode
 *
 * Persists the user's colour-scheme preference in localStorage and keeps the
 * `data-theme` attribute on <html> in sync so Tailwind / CSS variables can
 * respond to it.
 *
 * Usage:
 *   const { isDark, toggle } = useDarkMode()
 */
export function useDarkMode(): UseDarkModeReturn {
  // Store as the string "true" / "false" to match the STORAGE_KEYS spec
  const [rawValue, setRawValue] = useLocalStorage<string>(
    STORAGE_KEYS.DARK_MODE,
    'false',
  )

  const isDark = rawValue === 'true'

  // Apply / remove the data-theme attribute whenever isDark changes
  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.setAttribute('data-theme', 'dark')
      root.classList.add('dark')
    } else {
      root.removeAttribute('data-theme')
      root.classList.remove('dark')
    }
  }, [isDark])

  const toggle = useCallback(() => {
    setRawValue(isDark ? 'false' : 'true')
  }, [isDark, setRawValue])

  return { isDark, toggle }
}
