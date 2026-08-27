// ─── App-wide constants for "5 Years of Love" ─────────────────────────────
// IMPORTANT: Satish must update ANNIVERSARY_CONFIG with the real wedding date
// before deploying. The placeholder values below are for development only.

export const SECRET_PASSWORD = '07091995' as const

export const BIRTHDAY_CONFIG = {
  day: 7,
  month: 9, // September (1-based)
  label: "Swati's Birthday 🎂",
  timezone: 'Asia/Kolkata',
} as const

export const ANNIVERSARY_CONFIG = {
  day: 21,
  month: 2,  // February (1-based)
  year: 2021,
  timezone: 'Asia/Kolkata',
} as const

export const STORAGE_KEYS = {
  TIMELINE: 'swati_timeline',
  GALLERY: 'swati_gallery',
  NOTES_FAVORITES: 'swati_notes_favorites',
  NOTES_BOOKMARKS: 'swati_notes_bookmarks',
  BUCKET_LIST: 'swati_bucket_list',
  BUCKET_CHECKED: 'swati_bucket_checked',
  BUCKET_CUSTOM: 'swati_bucket_custom',
  FUTURE_DREAMS: 'swati_future_dreams',
  DARK_MODE: 'swati_dark_mode',
  ADMIN_NOTES: 'swati_admin_notes',
  ADMIN_MESSAGE: 'swati_admin_message',
  ADMIN_REASONS: 'swati_admin_reasons',
  NOTE_LANG: 'swati_note_lang',
  INSIDE_JOKES_FAV: 'swati_inside_jokes_fav',
  ADMIN_BIRTHDAY_MSG: 'swati_admin_birthday_msg',
  ADMIN_COUNTDOWN_MSGS: 'swati_admin_countdown_msgs',
  ADMIN_INSIDE_JOKES: 'swati_admin_inside_jokes',
} as const

// Derive a union type of all storage key values
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]
