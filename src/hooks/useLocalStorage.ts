// ─── Generic typed localStorage React hook ────────────────────────────────
import { useState, useEffect, useCallback } from 'react'
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage'

/**
 * useLocalStorage<T>
 *
 * Behaves exactly like useState but persists the value to localStorage under
 * the given key. The stored value is JSON-serialised / deserialised
 * transparently.
 *
 * Returns a tuple of:
 *  [0] current value
 *  [1] setter — updates both state and localStorage
 *  [2] remover — clears the key from localStorage and resets to initialValue
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void, () => void] {
  // Initialise from storage on first render; fall back to initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    const persisted = getStorageItem<T>(key)
    return persisted !== null ? persisted : initialValue
  })

  // If the key changes (rare but possible in dynamic usage), re-read storage
  useEffect(() => {
    const persisted = getStorageItem<T>(key)
    setStoredValue(persisted !== null ? persisted : initialValue)
    // initialValue intentionally excluded — we only want to react to key changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const setValue = useCallback(
    (value: T) => {
      setStoredValue(value)
      setStorageItem<T>(key, value)
    },
    [key],
  )

  const removeValue = useCallback(() => {
    setStoredValue(initialValue)
    removeStorageItem(key)
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}
