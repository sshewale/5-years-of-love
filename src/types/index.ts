// ─── Core domain types for "5 Years of Love" ──────────────────────────────

export interface TimelineEvent {
  id: string
  icon: string
  title: string
  date: string          // ISO date string or human-readable date
  location: string
  story: string
  photo?: string        // URL / import path
  video?: string        // URL
}

export interface GalleryPhoto {
  id: string
  src: string
  alt: string
  category: 'selfies' | 'wedding' | 'trips' | 'funny' | 'family' | 'special'
  date?: string         // ISO date string or human-readable date
}

export interface LoveNote {
  id: string
  text: string
  lang: 'en' | 'mr' | 'hi'
  isFavorited: boolean
  isBookmarked: boolean
}

export interface BucketItem {
  id: string
  label: string
  emoji: string
  completed: boolean
}

export interface FutureDream {
  id: string
  text: string
  createdAt: string     // ISO timestamp
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number  // 0-based index into options[]
}

export interface BirthdayMessages {
  heroMessage: string
  celebrationIntro: string
  finalReveal: string
  foreverPromise: string
  videoUrl?: string
}

export interface PoetryMessage {
  id: string
  lang: 'hi' | 'mr'
  title: string
  lines: string[]
}

export interface InsideJoke {
  id: string
  title: string
  story: string
  emoji: string
  isFavorited: boolean
}
