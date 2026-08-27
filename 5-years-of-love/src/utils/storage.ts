// ─── Generic typed LocalStorage helpers ───────────────────────────────────

/**
 * Reads and JSON-parses a value from localStorage.
 * Returns null if the key is absent or if the stored value cannot be parsed.
 */
export function getStorageItem<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return null
    return JSON.parse(raw) as T
  } catch {
    // Malformed JSON or localStorage access denied (e.g. private mode)
    return null
  }
}

/**
 * JSON-serialises a value and writes it to localStorage.
 * Silently ignores write failures (storage quota exceeded, private mode, etc.).
 */
export function setStorageItem<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Fail silently — the UI should still work without persistence
  }
}

/**
 * Removes a key from localStorage.
 * Silently ignores errors.
 */
export function removeStorageItem(key: string): void {
  try {
    window.localStorage.removeItem(key)
  } catch {
    // Fail silently
  }
}
