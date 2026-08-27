// ─── Date / time formatting utilities ─────────────────────────────────────
import { ANNIVERSARY_CONFIG } from './constants'

// ── formatDate ─────────────────────────────────────────────────────────────
/**
 * Formats an ISO date string (or any string parseable by Date) into a
 * human-readable form, e.g. "14 February 2021".
 * Falls back to the original string if the value cannot be parsed.
 */
export function formatDate(dateStr: string): string {
  const parsed = new Date(dateStr)
  if (isNaN(parsed.getTime())) return dateStr

  return parsed.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// ── formatCountdown ────────────────────────────────────────────────────────
export interface CountdownParts {
  days: number
  hours: number
  minutes: number
  seconds: number
}

/**
 * Converts a raw millisecond duration into { days, hours, minutes, seconds }.
 * All values are non-negative integers. If ms ≤ 0 every part is 0.
 */
export function formatCountdown(ms: number): CountdownParts {
  const total = Math.max(0, Math.floor(ms))

  const seconds = Math.floor((total / 1000) % 60)
  const minutes = Math.floor((total / 1000 / 60) % 60)
  const hours = Math.floor((total / 1000 / 60 / 60) % 24)
  const days = Math.floor(total / 1000 / 60 / 60 / 24)

  return { days, hours, minutes, seconds }
}

// ── anniversaryDate (shared helper) ───────────────────────────────────────
function getAnniversaryDate(): Date {
  // month is 1-based in ANNIVERSARY_CONFIG; Date() expects 0-based
  return new Date(
    ANNIVERSARY_CONFIG.year,
    ANNIVERSARY_CONFIG.month - 1,
    ANNIVERSARY_CONFIG.day,
    0,
    0,
    0,
    0,
  )
}

// ── computeYearsOfLove ─────────────────────────────────────────────────────
/**
 * Returns the floor of the number of complete years since the wedding date.
 * E.g. if the anniversary was 3.7 years ago it returns 3.
 */
export function computeYearsOfLove(): number {
  const anniversary = getAnniversaryDate()
  const now = new Date()

  let years = now.getFullYear() - anniversary.getFullYear()

  // Subtract 1 if the current calendar date hasn't yet reached the anniversary
  // month/day this year
  const hasHadAnniversaryThisYear =
    now.getMonth() > anniversary.getMonth() ||
    (now.getMonth() === anniversary.getMonth() &&
      now.getDate() >= anniversary.getDate())

  if (!hasHadAnniversaryThisYear) years -= 1

  return Math.max(0, years)
}

// ── computeDaysTogether ────────────────────────────────────────────────────
/**
 * Returns the total number of complete days elapsed since the wedding date.
 */
export function computeDaysTogether(): number {
  const anniversary = getAnniversaryDate()
  const now = new Date()
  const diffMs = now.getTime() - anniversary.getTime()
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)))
}

// NOTE: getNextBirthday() used to live here as well, but it duplicated the
// (IST-aware, timezone-correct) implementation in
// components/BirthdayCountdown.tsx with different — timezone-naive — logic.
// It was unused outside this file, so it was removed to avoid the two
// implementations drifting out of sync. BirthdayCountdown.tsx is now the
// single source of truth for "next birthday" calculations.
