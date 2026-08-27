# Business Requirements Document (BRD)
## Project: "5 Years of Love" — Birthday Surprise Website for Swati

**Author:** Satish Shewale
**Date:** 2026-08-17
**Version:** 2.0
**Status:** Ready for Development
**Deployment Target:** Vercel
**Timeline:** ASAP (1–2 days)

---

## 0. Cinematic Experience Design

### 0.1 User Journey (Emotional Arc)

The website functions as a romantic movie, not a traditional website. Swati moves through a linear emotional journey:

```
Loading Screen
↓
Landing Page — Birthday Countdown + Hero Message
↓
Section 1 — Our Love Story Timeline
↓
Section 2 — Memory Gallery
↓
Section 3 — 100 Reasons I Love You
↓
Section 4 — Love Notes (EN / Marathi / Hindi)
↓
Section 5 — Love Letter
↓
Section 6 — Bucket List
↓
Section 7 — Relationship Quiz
↓
Section 8 — Future Dreams
↓
Section 9 — 5 Years Together Celebration
↓
Section 10 — 30-Second Surprise Countdown
↓
Section 11 — Password-Protected Secret Reveal
↓
Confetti Explosion + Birthday Wish Video
↓
Forever Promise Message
↓
Closing "I Love You" Screen
```

### 0.2 Emotional Phases

| Phase | Name | Sections | Goal |
|---|---|---|---|
| 1 | Curiosity | Loading, Landing, Countdown | Draw her in with anticipation |
| 2 | Nostalgia | Timeline, Gallery | Flood her with shared memories |
| 3 | Connection | Reasons, Love Notes, Letter, Quiz | Deepen the emotional bond |
| 4 | Joy & Play | Bucket List, Future Dreams | Light and hopeful energy |
| 5 | Anticipation | 5 Years Celebration, Surprise Countdown | Build excitement before the reveal |
| 6 | Emotional Peak | Password Reveal, Confetti, Video | Maximum impact moment |
| 7 | Lasting Impression | Forever Promise, Closing Screen | Leave her with warmth forever |

### 0.3 Design Tone
- Feels like a **romantic film**, not a product website
- Every transition should feel earned — never abrupt
- Music underpins the entire journey (soft autoplay after first interaction)
- Emotional copy matters as much as visual design

---

## 1. Project Overview

A premium, mobile-first romantic website built as a birthday surprise for Swati. The site tells the story of 5 years of love through animated timelines, memory galleries, love notes, letters, quizzes, and secret surprises. The experience should feel emotional, elegant, and unforgettable — comparable in design quality to Apple, Airbnb, and Notion.

---

## 2. Goals & Success Criteria

| Goal | Success Criteria |
|---|---|
| Emotional impact | Wife feels moved and surprised when she opens it |
| Premium design quality | Passes a side-by-side visual comparison with Apple/Airbnb aesthetics |
| Performance | Lighthouse score ≥ 90 on mobile |
| Completeness | All 10 sections + Admin panel functional on launch day |
| Persistence | All user interactions (favorites, bucket list, dreams) saved in LocalStorage |
| Deployability | One-command Vercel deploy from GitHub |

---

## 3. Stakeholders

| Role | Person |
|---|---|
| Product Owner / Client | Satish Shewale |
| End User (Primary) | Swati (wife) |
| Developer | Satish / AI-assisted build |

---

## 4. Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript (strict mode) |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Routing | React Router v7 |
| Icons | Lucide React |
| Persistence | Browser LocalStorage |
| Deployment | Vercel |
| Fonts | Google Fonts — Playfair Display (serif headings) + Inter (body) |
| Audio | HTML5 Audio API (royalty-free romantic instrumental placeholder) |

---

## 5. Design System

### 5.1 Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-white` | `#FFFFFF` | Backgrounds, cards |
| `--color-pink-soft` | `#FFD6E0` | Accents, highlights |
| `--color-rose-gold` | `#B76E79` | Primary brand, CTAs |
| `--color-beige-warm` | `#F5ECD7` | Section backgrounds |
| `--color-lavender` | `#E8D5F5` | Secondary accents |
| `--color-dark` | `#1A1A2E` | Dark mode base |

### 5.2 Typography

| Element | Font | Weight | Size |
|---|---|---|---|
| Hero headings | Playfair Display | 700 | 3.5rem–5rem |
| Section titles | Playfair Display | 600 | 2rem–2.5rem |
| Body text | Inter | 400 | 1rem |
| Captions | Inter | 300 | 0.875rem |
| Love letter | Dancing Script (handwriting) | 400 | 1.25rem |

### 5.3 Design Principles

- Glassmorphism cards: `backdrop-blur`, semi-transparent backgrounds
- Soft gradient backgrounds with animated moving stars
- Micro-animations on every interactive element
- Consistent 8px spacing grid
- Rounded corners: `rounded-2xl` (16px) as default

---

## 6. Folder Structure

```
5-years-of-love/
├── public/
│   ├── audio/
│   │   └── romantic-bg.mp3          # Royalty-free placeholder
│   ├── images/
│   │   └── placeholder/             # Placeholder images
│   └── favicon.ico
├── src/
│   ├── assets/                      # Static SVGs, decorative assets
│   ├── components/
│   │   ├── ui/                      # Reusable primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── GlassCard.tsx
│   │   ├── animations/              # Particle & motion components
│   │   │   ├── FloatingHearts.tsx
│   │   │   ├── Confetti.tsx
│   │   │   ├── Fireflies.tsx
│   │   │   ├── StarField.tsx
│   │   │   ├── Typewriter.tsx
│   │   │   └── AnimatedCounter.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ScrollProgress.tsx
│   │   │   └── BackToTop.tsx
│   │   ├── MusicPlayer.tsx          # Floating music player (global, not a page)
│   │   ├── BirthdayCountdown.tsx    # Flip-card countdown widget
│   │   ├── SurpriseCountdown.tsx    # 30s full-screen pre-reveal overlay
│   │   ├── EasterEgg.tsx            # Hidden Easter egg trigger (logo click ×5)
│   │   ├── LoadingScreen.tsx
│   │   └── DarkModeToggle.tsx
│   ├── pages/
│   │   ├── Landing.tsx              # Hero / entry screen
│   │   ├── Timeline.tsx             # Section 1
│   │   ├── Gallery.tsx              # Section 2
│   │   ├── ReasonsILoveYou.tsx      # Section 3
│   │   ├── LoveNotes.tsx            # Section 4
│   │   ├── Letter.tsx               # Section 5
│   │   ├── BucketList.tsx           # Section 6
│   │   ├── Quiz.tsx                 # Section 7
│   │   ├── FutureDreams.tsx         # Section 8
│   │   ├── Celebration.tsx          # Section 9 — 5 Years Together
│   │   ├── SecretSurprise.tsx       # Section 11 — Password reveal
│   │   ├── ForeverPromise.tsx       # Closing screen after reveal
│   │   ├── InsideJokes.tsx          # MVP+ — inside jokes section
│   │   └── admin/
│   │       └── AdminPanel.tsx       # Hidden admin at /admin
│   ├── hooks/
│   │   ├── useLocalStorage.ts
│   │   ├── useDarkMode.ts
│   │   ├── useScrollAnimation.ts
│   │   └── useConfetti.ts
│   ├── types/
│   │   ├── timeline.ts
│   │   ├── gallery.ts
│   │   ├── notes.ts
│   │   └── quiz.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── formatters.ts
│   │   └── storage.ts
│   ├── data/
│   │   ├── timeline.ts              # 10 timeline events (hardcoded)
│   │   ├── reasons.ts               # 100 reasons I love you
│   │   ├── loveNotes.ts             # 365 love notes (EN/MR/HI)
│   │   ├── quizQuestions.ts
│   │   ├── bucketList.ts
│   │   ├── birthdayMessages.ts      # Hero msg, celebration copy, reveal msg, forever promise
│   │   ├── poetryMessages.ts        # Hindi & Marathi kavita
│   │   ├── surpriseCountdownMsgs.ts # 4 rotating messages for 30s countdown
│   │   └── insideJokes.ts           # Inside jokes content
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── index.html
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── vercel.json
```

---

## 7. Pages & Sections — Functional Requirements

### 7.0 Loading Screen
- Full-screen animated loader shown on first visit
- Heartbeat animation + "Loading Our Story…" text
- Fades out after 2 seconds

### 7.1 Landing Page (Hero)
- Full-viewport hero section
- Animated star field background + Fireflies overlay
- Floating hearts particle system
- Balloon animation (5 balloons on mount)
- Hero message (from `data/birthdayMessages.ts`):
  > *"Happy Birthday My Love ❤️*
  > *To the woman who made every ordinary day beautiful,*
  > *this little website is my way of saying thank you.*
  > *Welcome to our story."*
- `Typewriter` component for sub-tagline (e.g. "Every moment with you is our story…")
- Annual year title: **"{N} Years of Love"** — auto-computed from `ANNIVERSARY_CONFIG`
- `BirthdayCountdown` flip-card widget prominently placed below hero text
- "Enter Our Story" button with hover glow animation → smooth scroll to Timeline

### 7.2 Section 1 — Our Timeline
- Vertical animated timeline (scroll-triggered cards)
- Each card supports an **optional short video clip** (MP4/WebM, max 30s recommended) alongside the photo
- Video autoplays muted on hover/tap; controls shown on fullscreen
- Video URL field available in Admin Panel timeline editor and in `data/timeline.ts`
- Falls back gracefully to photo-only if no video provided
- 10 default events (hardcoded in `data/timeline.ts`):

| # | Emotional Title | Icon |
|---|---|---|
| 1 | The Day My Life Changed | ❤️ |
| 2 | The First Good Morning | 📱 |
| 3 | When Friendship Became Love | ☕ |
| 4 | Falling For You | 💍 |
| 5 | The Beginning of Forever | 👰 |
| 6 | Building Our Home | 🏡 |
| 7 | Adventures Together | ✈️ |
| 8 | Our Silliest Moments | 😊 |
| 9 | Today, Still In Love | ❤️ |
| 10 | Our Beautiful Future | 🌸 |

- Each card: photo (placeholder), date, location, short story
- Cards animate in from alternating left/right on scroll
- Admin can add/edit events

### 7.3 Section 2 — Memory Gallery
- Pinterest-style masonry grid
- Categories: Selfies, Wedding, Trips, Funny, Family, Special Days
- Lazy loading images
- Fullscreen lightbox on click with swipe support
- **Placeholder image strategy** (until real photos added via Admin):
  | Slot | Description |
  |---|---|
  | Hero couple | Romantic couple, warm-toned |
  | Sunset walk | Couple walking at sunset |
  | Wedding-style | Formal couple portrait |
  | Travel | Couple at a landmark / travel scene |
  | Birthday | Celebration / cake scene |
  | Letter | Decorative love letter / stationery |
  | Silhouette | Couple silhouette against sky |
- All placeholder URLs point to `public/images/placeholder/` — swappable in Admin

### 7.4 Section 3 — 100 Reasons Why I Love You
- Grid of 100 animated cards
- Cards flip/expand on click to reveal reason
- "Show me another reason" random shuffle button
- Scroll-triggered entrance animation

### 7.5 Section 4 — Love Notes
- Displays one random note per visit from 365 notes
- User can ❤️ Favorite and ⭐ Bookmark notes
- Favorites/bookmarks saved to LocalStorage
- "Next Note" button for manual browse
- Beautiful card with subtle paper texture
- **Multilingual support**: each note has a `lang` field — `'en'`, `'mr'` (Marathi), or `'hi'` (Hindi)
- Language switcher (EN / मर | हिं) pill in the section header
- Selected language persisted in LocalStorage key `swati_note_lang`
- Marathi and Hindi notes pre-written in `data/loveNotes.ts` alongside English pool
- Font: Noto Sans Devanagari (Google Fonts) for Marathi/Hindi rendering

### 7.6 Section 5 — Letters
- Single full-page letter
- Dancing Script (handwriting) font
- Paper texture background
- Content: "Dear Swati ❤️" — emotional romantic letter (pre-written)
- Subtle scroll parallax on paper element
- Wax seal SVG decoration

### 7.7 Section 6 — Bucket List
- Interactive checklist with 7+ items
- Check/uncheck persisted in LocalStorage
- Progress bar showing % completed
- Completed items get strikethrough + celebration micro-animation

### 7.8 Section 7 — Relationship Quiz
- 5–10 multiple choice questions
- Example questions: "Who proposed first?", "Where did we first meet?"
- Correct answer → green glow + confetti burst
- Wrong answer → gentle shake animation
- Final score screen with heart animation

### 7.9 Section 8 — Future Dreams
- Open text journal entry field
- "Add Dream" button saves entry to LocalStorage array
- List of all entered dreams displayed below
- Delete individual dreams
- Dreams displayed with date added

### 7.10 Music Player (Global Floating Widget — not a page section)
- Fixed floating widget (bottom-right), persistent across all pages
- Autoplay DISABLED on load; starts after first user interaction
- Manual play/pause control
- Song title + animated equalizer bars (3 bars, CSS keyframes) when playing
- Royalty-free romantic instrumental as default (`public/audio/romantic-bg.mp3`)
- Volume slider

### 7.11 Section 9 — 5 Years Together Celebration
- Full-page standalone section between Quiz/Dreams and the Surprise Countdown
- Large animated heading: **"5 Years Completed ❤️"** with sparkle animation
- Copy (from `data/birthdayMessages.ts`):
  > *"From our first conversation*
  > *To building a life together,*
  > *Every chapter became my favorite memory."*
- Animated counter: `AnimatedCounter` counting up to 5 (years)
- Hindi Kavita displayed below (from `data/poetryMessages.ts`):
  > *तेरी मुस्कान मेरी सुबह बन जाती है…*
- Marathi Kavita displayed alongside:
  > *तुझ्या हसण्यात माझं विश्व आहे…*
- "Continue to Surprise →" CTA button → navigates to Surprise Countdown

### 7.12 Section 10 — Surprise Countdown (30-Second Anticipation)
- Full-screen overlay that plays before the Secret Surprise password screen
- Builds anticipation with a live 30-second countdown (large animated number)
- `FloatingHearts` animation fills the screen
- Background music continues (or swells if a secondary audio cue is added)
- 4 rotating romantic messages cycle every ~7s (from `data/surpriseCountdownMsgs.ts`):
  1. *"Something special is waiting for you ❤️"*
  2. *"5 years of memories. One beautiful surprise."*
  3. *"Just a little more patience, my love."*
  4. *"The best chapter is about to begin."*
- After 30 seconds → auto-transitions to Secret Surprise (Section 11)
- Component: `components/SurpriseCountdown.tsx`

### 7.13 Section 11 — Secret Surprise (Password Reveal)
- Password input screen
- Hint: "Her Birthday (DDMMYYYY format)"
- Password: `07091995` (Swati's birthdate — 07 Sep 1995)
- Password stored as constant in `utils/constants.ts` (never hard-coded in UI)
- Correct password → full-screen confetti explosion (`celebration` variant) + heart animation
- **Birthday Wish Video** plays (YouTube/Drive embed, optional): `src/data/birthdayMessages.ts` → `videoUrl` field
- Final Birthday Reveal message displayed (from `data/birthdayMessages.ts`):
  > *"🎉 HAPPY BIRTHDAY SWATI 🎂*
  > *Out of billions of people in this world,*
  > *my favorite person is still you.*
  > *The best decision of my life was holding your hand.*
  > *5 years completed. Forever to go."*
- Wrong password → Framer Motion shake animation on input + hint shown
- After reveal → "Continue to Forever Promise →" button

### 7.14 Section 12 — Forever Promise (Closing Screen)
- Full-screen closing message (component: `ForeverPromise.tsx`)
- Copy:
  > *"❤️ I Love You More Than Yesterday,*
  > *But Less Than Tomorrow ❤️"*
- Soft particle rain (rose petals / hearts) continues in background
- Anniversary counter: "Together since [wedding date] · [N] years · [M] days"
- Final "I Love You" animated typography — large Playfair Display, fade-in word by word

### 7.15 Birthday Countdown (Global Widget)
- Prominent flip-card countdown on Hero / Landing page
- Counts down to Swati's next birthday: **07 September**
- Configured via `BIRTHDAY_CONFIG` in `utils/constants.ts`
- Countdown auto-advances to next year once birthday passes
- Displays: **Days · Hours · Minutes · Seconds** (live, ticks every second)
- On birthday (day = 0): switches to **"Happy Birthday Swati! 🎂"** celebration banner + full-screen confetti
- Flip-card CSS 3D animation per unit (no extra library)
- Component: `components/BirthdayCountdown.tsx`

### 7.16 Inside Jokes Section (MVP+)
- Accessible from Navbar or as an unlockable Easter egg
- Styled like a private diary / scrapbook card deck
- Content in `data/insideJokes.ts` — short funny/sweet memories only Satish and Swati understand
- Cards reveal on click; can be favorited

### 7.17 Easter Eggs (MVP+)
- Click the site logo 5× → mini heart explosion + secret message appears
- Tap the infinity symbol in Footer 3× → a hidden short love note appears
- Hidden `/easter` route with a fun surprise (e.g. rain of Swati's name in gold letters)

### 7.18 Footer
- Infinity symbol SVG loop animation (click 3× to trigger Easter egg)
- Text: "Forever Begins Again Every Day ❤️"
- Copyright line

---

## 8. Admin Panel (`/admin`)

Access: Navigate to `/admin` route (hidden, not linked anywhere in UI)

| Feature | Description |
|---|---|
| Timeline Manager | Add, edit, delete timeline events with photo URL, video URL, date, location, story |
| Gallery Manager | Add photo URLs with category tag; manage placeholders |
| Love Notes Editor | Add/edit/delete notes; filter by lang (EN/MR/HI) |
| Reasons Editor | Edit any of the 100 reasons inline |
| Birthday Message | Edit secret surprise text + optional birthday video URL |
| Bucket List Editor | Add/remove bucket list items with emoji |
| Inside Jokes Editor | Add/edit/delete inside jokes entries |
| Surprise Countdown Msgs | Edit the 4 rotating countdown messages |
| Export Data | Download all LocalStorage data as JSON |
| Import Data | Upload JSON to restore/migrate data |

All Admin changes write to LocalStorage and override hardcoded data at runtime.

---

## 9. Global Features (MVP)

| Feature | Priority | Implementation |
|---|---|---|
| Dark Mode | MVP | CSS variables toggle, persisted in LocalStorage (`swati_dark_mode`) |
| Floating Hearts | MVP | Framer Motion canvas overlay |
| Confetti | MVP | `canvas-confetti` library |
| Fireflies | MVP | Animated SVG dots with Framer Motion |
| Star Field BG | MVP | CSS animation + tiny SVG dots |
| Scroll Progress Bar | MVP | Fixed top bar, width = scroll % |
| Back To Top | MVP | Floating button, visible after 300px scroll |
| Loading Screen | MVP | 2s animated intro |
| SEO Meta Tags | MVP | React Helmet or Vite HTML plugin |
| Lazy Loading | MVP | React `lazy()` + `Suspense` per page |
| Responsive | MVP | Tailwind mobile-first breakpoints |
| Accessibility | MVP | ARIA labels, keyboard navigation, focus rings, `prefers-reduced-motion` support |
| Floating Music Player | MVP | Fixed bottom-right widget; play/pause, volume slider, animated equalizer; autoplay disabled |
| Page Transitions | MVP | Framer Motion `AnimatePresence` wrapping all routes in `App.tsx` |
| Glassmorphism Cards | MVP | `backdrop-blur` + semi-transparent backgrounds via `GlassCard.tsx` |
| Typewriter Effect | MVP | Custom `Typewriter.tsx` hook used on Hero tagline |
| Animated Counters | MVP | `AnimatedCounter.tsx` using Framer Motion `useMotionValue` |
| Balloon Animation | MVP | Framer Motion on Landing section |
| Sparkle Effects | MVP | Framer Motion on Landing + Secret Surprise reveal |
| Lightbox / Fullscreen Viewer | MVP | Click-to-expand gallery images with swipe support |
| Password-Protected Reveal | MVP | Secret Surprise locked behind wedding-date password stored in `constants.ts` |
| Admin Panel (Hidden Route) | MVP | `/admin` route (not linked in UI); all changes persist to LocalStorage |
| LocalStorage Persistence | MVP | All user state (favorites, bucket list, dreams, dark mode) persisted across sessions |
| Scroll-Triggered Animations | MVP | `useScrollAnimation.ts` + Framer Motion + IntersectionObserver on all section cards |
| Wax Seal Decoration | MVP | SVG wax seal on Letter page |
| Infinity Footer Animation | MVP | SVG infinity symbol animation in footer |
| Birthday Countdown | MVP | Flip-card countdown to 07 Sep, configured in `BIRTHDAY_CONFIG`; switches to celebration banner on the day |
| Video Timeline Clips | MVP | Optional MP4/WebM per timeline card; autoplays muted on hover; fallback to photo |
| Anniversary Countdown | MVP | Live countdown to next wedding anniversary; configured via `ANNIVERSARY_CONFIG` in `constants.ts` |
| Multilingual Love Notes | MVP | EN / Marathi / Hindi note pools; language switcher persisted in LocalStorage; Noto Sans Devanagari font |
| Annual Version Banner | MVP | Site heading auto-updates year count (e.g. "6 Years of Love") based on `WEDDING_DATE` config |
| PWA / Offline Support | MVP | `vite-plugin-pwa`; service worker caches shell + assets; installable on home screen |
| Surprise Countdown Overlay | MVP | `SurpriseCountdown.tsx`; 30s full-screen; rotating messages; auto-transitions to Secret Surprise |
| 5 Years Celebration Page | MVP | Standalone `Celebration.tsx`; animated counter, kavita poetry, CTA to countdown |
| Birthday Wish Video | MVP | YouTube/Drive embed in Secret Surprise reveal; `videoUrl` field in `birthdayMessages.ts` |
| Forever Promise Screen | MVP | Closing `ForeverPromise.tsx` page; anniversary counter; word-by-word animated text |
| Inside Jokes Section | MVP+ | `InsideJokes.tsx`; scrapbook card deck; content in `data/insideJokes.ts` |
| Easter Eggs | MVP+ | Logo click ×5 = heart burst; footer tap ×3 = hidden note; `/easter` hidden route |
| Personal Video Message | MVP+ | Satish records short video (phone); hosted on YouTube unlisted; embedded in reveal flow |
| Cinematic Page Transitions | MVP | Framer Motion route transitions with emotional timing (longer fade between climax sections) |

---

## 10. Data Models

### TimelineEvent
```typescript
interface TimelineEvent {
  id: string;
  icon: string;
  title: string;
  date: string;        // "DD MMM YYYY"
  location: string;
  story: string;
  photo?: string;      // URL or placeholder path
  video?: string;      // URL to MP4/WebM clip (optional)
}
```

### GalleryPhoto
```typescript
interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  category: 'selfies' | 'wedding' | 'trips' | 'funny' | 'family' | 'special';
  date?: string;
}
```

### LoveNote
```typescript
interface LoveNote {
  id: string;
  text: string;
  lang: 'en' | 'mr' | 'hi';   // English, Marathi, Hindi
  isFavorited: boolean;
  isBookmarked: boolean;
}
```

### BucketItem
```typescript
interface BucketItem {
  id: string;
  label: string;
  emoji: string;
  completed: boolean;
}
```

### FutureDream
```typescript
interface FutureDream {
  id: string;
  text: string;
  createdAt: string;   // ISO date string
}
```

### QuizQuestion
```typescript
interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}
```

### BirthdayMessage (in `data/birthdayMessages.ts`)
```typescript
interface BirthdayMessages {
  heroMessage: string;           // Landing page hero copy
  celebrationIntro: string;      // 5 Years Celebration section
  finalReveal: string;           // Secret Surprise reveal message
  foreverPromise: string;        // Closing screen message
  videoUrl?: string;             // YouTube/Drive embed URL for birthday wish video
}
```

### PoetryMessage (in `data/poetryMessages.ts`)
```typescript
interface PoetryMessage {
  id: string;
  lang: 'hi' | 'mr';
  title: string;
  lines: string[];               // Each string is one line of the poem
}
```

### InsideJoke (in `data/insideJokes.ts`)
```typescript
interface InsideJoke {
  id: string;
  title: string;                 // Short label (visible on card face)
  story: string;                 // Full joke / memory (revealed on flip)
  emoji: string;
  isFavorited: boolean;
}
```

---

## 11. LocalStorage Keys

| Key | Contents |
|---|---|
| `swati_timeline` | Admin-edited timeline events (overrides hardcoded) |
| `swati_gallery` | Admin-added gallery photos |
| `swati_notes_favorites` | Array of favorited note IDs |
| `swati_notes_bookmarks` | Array of bookmarked note IDs |
| `swati_bucket_list` | Bucket list checked state map |
| `swati_future_dreams` | Array of FutureDream objects |
| `swati_dark_mode` | `"true"` or `"false"` |
| `swati_admin_notes` | Admin-edited love notes (overrides hardcoded) |
| `swati_admin_message` | Admin-edited secret surprise message |
| `swati_admin_reasons` | Admin-edited reasons array |
| `swati_note_lang` | Selected love notes language (`"en"` / `"mr"` / `"hi"`) |
| `swati_inside_jokes_fav` | Array of favorited inside joke IDs |
| `swati_admin_birthday_msg` | Admin-edited birthday messages object |
| `swati_admin_countdown_msgs` | Admin-edited surprise countdown messages array |
| `swati_admin_inside_jokes` | Admin-edited inside jokes array |

---

## 12. Animation Inventory

| Animation | Component | Library |
|---|---|---|
| Floating hearts | `FloatingHearts.tsx` | Framer Motion |
| Confetti burst | `Confetti.tsx` | canvas-confetti |
| Fireflies | `Fireflies.tsx` | Framer Motion |
| Moving star field | `StarField.tsx` | CSS keyframes |
| Typewriter | `Typewriter.tsx` | Custom hook |
| Scroll card reveal | `useScrollAnimation.ts` | Framer Motion + IntersectionObserver |
| Page transitions | `App.tsx` route wrapper | Framer Motion AnimatePresence |
| Animated counters | `AnimatedCounter.tsx` | Framer Motion useMotionValue |
| Balloon animation | Landing section | Framer Motion |
| Sparkles | Landing + Secret reveal | Framer Motion |
| Glassmorphism | `GlassCard.tsx` | Tailwind CSS |
| Heart explode | Secret Surprise reveal | Framer Motion + canvas-confetti |
| Surprise countdown | `SurpriseCountdown.tsx` | CSS + Framer Motion |
| Rotating text | Countdown rotating messages | Framer Motion AnimatePresence |
| Rose petal rain | ForeverPromise screen | Framer Motion |
| Word-by-word fade | Forever Promise closing text | Framer Motion stagger |
| 5 years counter | Celebration page | `AnimatedCounter.tsx` |
| Card flip | Inside Jokes cards | CSS 3D transform |
| Easter egg burst | Logo click ×5 | Framer Motion + canvas-confetti |

---

## 12.5 Configuration Constants (`utils/constants.ts`)

All site-wide date/password settings live here — edit before deploying:

```typescript
// Secret Surprise password — wife's birthdate in DDMMYYYY format
export const SECRET_PASSWORD = "07091995";

// Birthday countdown target
export const BIRTHDAY_CONFIG = {
  day: 7,
  month: 9,           // September (1-indexed)
  label: "Swati's Birthday 🎂",
  timezone: "Asia/Kolkata",
};

// Anniversary countdown + annual year label
export const ANNIVERSARY_CONFIG = {
  day: /* wedding day */,
  month: /* wedding month */,
  year: /* wedding year */,
  timezone: "Asia/Kolkata",
};
// Site heading auto-computes: `${currentYear - ANNIVERSARY_CONFIG.year} Years of Love`
```

---

## 13. Installation & Setup

```bash
# 1. Create Vite + React + TypeScript project
npm create vite@latest 5-years-of-love -- --template react-ts
cd 5-years-of-love

# 2. Install dependencies
npm install

# 3. Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 4. Install core libraries
npm install framer-motion react-router-dom lucide-react

# 5. Install extras
npm install canvas-confetti
npm install -D @types/canvas-confetti

# 6. Install PWA plugin
npm install -D vite-plugin-pwa

# 7. Install Noto Sans Devanagari (for Marathi/Hindi notes)
# Add to index.html <head> alongside other Google Fonts:
# family=Noto+Sans+Devanagari:wght@400;600

# 6. Install fonts (via index.html Google Fonts link)
# Add to index.html <head>:
# Playfair Display, Inter, Dancing Script from Google Fonts

# 7. Run development server
npm run dev

# 8. Build for production
npm run build

# 9. Preview production build
npm run preview
```

---

## 14. Vercel Deployment Steps

```bash
# Option A: Via Vercel CLI
npm install -g vercel
vercel login
vercel --prod

# Option B: Via GitHub (recommended)
# 1. Push repo to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/5-years-of-love.git
git push -u origin main

# 2. Go to vercel.com → Import Project → Select repo
# 3. Framework: Vite (auto-detected)
# 4. Build command: npm run build
# 5. Output directory: dist
# 6. Click Deploy

# vercel.json (for React Router SPA routing)
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 15. Action Plan — ASAP (1–2 Days)

### Day 1 — Foundation + Core Sections

| Time | Task |
|---|---|
| 0–1h | Project scaffold: Vite + React 19 + TS + Tailwind + Framer Motion |
| 1–2h | Design system: colors, fonts, Tailwind config, global CSS |
| 2–3h | Layout components: Navbar, Footer, ScrollProgress, BackToTop |
| 3–4h | Animation components: FloatingHearts, Fireflies, StarField, Confetti |
| 4–5h | Loading Screen + Landing Page (Hero) |
| 5–6h | Section 1: Timeline |
| 6–7h | Section 2: Gallery + Lightbox |
| 7–8h | Section 4: Love Notes + LocalStorage favorites |

### Day 2 — Remaining Sections + Admin + Deploy

| Time | Task |
|---|---|
| 0–1h | Section 3: 100 Reasons |
| 1–2h | Section 5: Letter page |
| 2–3h | Section 6: Bucket List + Section 8: Future Dreams |
| 3–4h | Section 7: Quiz |
| 4–5h | Section 10: Secret Surprise (password + reveal) |
| 5–6h | Floating Music Player |
| 6–7h | Admin Panel (`/admin` route) |
| 7–8h | SEO meta tags, performance audit, final testing on mobile |
| 8h+ | Vercel deploy + share link |

---

## 16. Out of Scope for MVP (Phase 2)

| Feature | Reason Deferred |
|---|---|
| Real backend / database | Not needed; LocalStorage sufficient for single user |
| User authentication | Admin access via hidden route is sufficient |
| Email/notification on visit | Requires backend; Phase 2 |
| Voice messages | Record/embed audio; add post-launch |
| Photo upload to cloud | Direct Admin upload to cloud storage; Phase 2 |
| AR heart filter | Experimental WebRTC camera feature; Phase 2 |
| Backend sync (Supabase) | Cross-device sync; Phase 2 |

---

## 17. Future Enhancement Ideas

> Items promoted to MVP or MVP+ are removed from this list.

1. **Voice messages** — Record and embed audio love notes
2. **Backend sync** — Move LocalStorage data to Supabase for cross-device access
3. **Email notification** — Get notified when wife visits the site
4. **Photo upload to cloud** — Direct upload from Admin panel (currently URL-based only)
5. **AR heart filter** — Experimental camera feature using WebRTC
6. **Bengali / Tamil notes** — Expand multilingual pool beyond Marathi/Hindi
7. **Shared bucket list** — Real-time sync so both can check off items
8. **AI memory slideshow** — Auto-generate slideshow from uploaded photos
9. **Family wishes section** — Collect surprise video/text wishes from family members
10. **Anniversary memory montage** — Auto-generated video montage each year

---

## 18. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Photos not ready at launch | Medium | Placeholders pre-built; real photos added via Admin panel |
| Complex animations slow on old phones | High | Framer Motion `reducedMotion` fallback; test on low-end device |
| LocalStorage limit (5MB) | Low | Gallery uses URLs not binary data; monitor usage |
| Secret Surprise password leaked | Medium | Password (`07091995`) lives in `constants.ts`, never hard-coded in UI markup; set before deploy |
| Video clips increase load time | High | Videos lazy-load; autoplay only on hover; Admin adds CDN URLs, not raw uploads |
| Devanagari font load delay | Low | Preload Noto Sans Devanagari in `<link rel="preload">`; subset to required Unicode range |
| PWA cache serving stale content | Medium | Set `vite-plugin-pwa` update prompt so user gets latest version on revisit |
| Vercel SPA routing 404s | High | `vercel.json` rewrite rule included in scaffold |
| Birthday video not ready at launch | Medium | `videoUrl` field is optional; reveal works without it; record and add via Admin later |
| Surprise countdown skipped on refresh | Low | Persist countdown start timestamp in LocalStorage; re-enter countdown if not completed |
| Easter egg discovered accidentally | Low | Require 5 deliberate clicks; low probability of accidental trigger |

---

*This document is the single source of truth for the "5 Years of Love" project. v2.0 merges the original BRD with Final_5_Years_of_Love_BRD_Additions. All development decisions should reference sections above.*
