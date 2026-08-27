# Action Plan — "5 Years of Love"
## Birthday Surprise Website for Swati

**Author:** Satish Shewale
**Date:** 2026-08-17
**Target:** Deploy on Vercel — ASAP (1–2 days)
**Reference:** brd.md v2.0

---

## Legend

| Symbol | Meaning |
|---|---|
| `[ ]` | Not started |
| `[x]` | Done |
| `~` | Blocked / needs content from Satish |

---

## Phase 0 — Pre-Dev Setup (30 min)

- [ ] Confirm wedding anniversary date (needed for `ANNIVERSARY_CONFIG`)
- [ ] Gather any photos/videos to use at launch (even 5–10 is enough)
- [ ] Find or download a royalty-free romantic MP3 for `public/audio/romantic-bg.mp3`
- [ ] Decide Vercel account / GitHub repo name (`5-years-of-love`)
- [ ] Record short birthday wish video on phone (optional but high impact — upload to YouTube unlisted; note the URL)
- [ ] Write 5–10 inside jokes / funny memories to seed `data/insideJokes.ts`
- [ ] Finalize quiz answers (correct options for all 8 questions)

---

## Phase 1 — Project Scaffold ✅

### 1.1 Create project
- [x] `npm create vite@latest 5-years-of-love -- --template react-ts`
- [x] `cd 5-years-of-love && npm install`

### 1.2 Install all dependencies
- [x] Tailwind CSS v4: `@tailwindcss/vite` plugin
- [x] Core: `framer-motion react-router-dom lucide-react`
- [x] Extras: `canvas-confetti @types/canvas-confetti`
- [x] PWA: `vite-plugin-pwa`

### 1.3 Configure tooling
- [x] `vite.config.ts` — Tailwind v4 plugin + VitePWA manifest
- [x] `tsconfig.json` — strict: true
- [x] `vercel.json` — SPA rewrite rule

### 1.4 Google Fonts
- [x] `index.html <head>`: Playfair Display, Inter, Dancing Script, Noto Sans Devanagari

### 1.5 Folder structure
- [x] All folders: `components/ui/`, `components/animations/`, `components/layout/`, `pages/admin/`, `hooks/`, `types/`, `utils/`, `data/`

---

## Phase 2 — Design System & Global CSS ✅

- [x] `src/index.css` — CSS variables, dark mode `[data-theme="dark"]`, flip-card classes, twinkle/equalize keyframes

---

## Phase 3 — Configuration Constants ✅

- [x] `src/utils/constants.ts` — SECRET_PASSWORD, BIRTHDAY_CONFIG, ANNIVERSARY_CONFIG (placeholder), STORAGE_KEYS

---

## Phase 4 — Reusable UI Primitives ✅

- [x] `Button.tsx` — variants: primary/ghost/outline; hover glow
- [x] `Card.tsx` — base card
- [x] `GlassCard.tsx` — backdrop-blur-md, dark-mode aware
- [x] `Modal.tsx` — focus trap, ESC close, ARIA role="dialog"
- [x] `Badge.tsx` — pill in 4 color variants
- [x] `useLocalStorage.ts`
- [x] `useDarkMode.ts`
- [x] `useScrollAnimation.ts`
- [x] `useConfetti.ts`

---

## Phase 5 — Animation Components ✅

- [x] `FloatingHearts.tsx`
- [x] `Fireflies.tsx`
- [x] `StarField.tsx`
- [x] `Confetti.tsx`
- [x] `Typewriter.tsx`
- [x] `AnimatedCounter.tsx`
- [x] `BirthdayCountdown.tsx` — flip-card CSS 3D, IST-aware, birthday banner
- [x] `SurpriseCountdown.tsx` — 30s, SVG ring, rotating messages, localStorage resume
- [x] `EasterEgg.tsx` — provider + hook, 5-click logo trigger, footer trigger

---

## Phase 6 — Layout Components ✅

- [x] `Navbar.tsx` — glass on scroll, mobile hamburger, dark mode toggle
- [x] `Footer.tsx` — SVG infinity, 3-tap Easter egg
- [x] `ScrollProgress.tsx` — rose-gold gradient bar
- [x] `BackToTop.tsx` — visible after 300px
- [x] `DarkModeToggle.tsx`
- [x] `LoadingScreen.tsx` — heartbeat SVG, 2s
- [x] `MusicPlayer.tsx` — fixed bottom-right, equalizer bars, autoplay disabled

---

## Phase 7 — Data Files ✅

- [x] `timeline.ts` — 10 events with emotional titles
- [x] `reasons.ts` — 100 reasons
- [x] `loveNotes.ts` — 100 notes (EN/MR/HI)
- [x] `quizQuestions.ts` — 8 questions (all correctIndex: 0; update via Admin)
- [x] `bucketList.ts` — 12 items
- [x] `birthdayMessages.ts` — exact BRD copy
- [x] `poetryMessages.ts` — Hindi + Marathi kavita
- [x] `surpriseCountdownMsgs.ts` — 4 strings
- [x] `insideJokes.ts` — 8 placeholder jokes (Satish to replace via Admin)
- [x] `src/types/index.ts` — all 9 interfaces

---

## Phase 8 — Pages ✅

- [x] `Landing.tsx` — StarField + Fireflies + FloatingHearts, balloons, Typewriter, BirthdayCountdown
- [x] `Timeline.tsx` — alternating cards, video hover-play, scroll animation
- [x] `Gallery.tsx` — masonry, category filter, lightbox Modal
- [x] `ReasonsILoveYou.tsx` — 100 flip cards, "Surprise Me!"
- [x] `LoveNotes.tsx` — EN/MR/HI switcher, heart/bookmark, Devanagari font
- [x] `Letter.tsx` — Dancing Script, paper-texture, scroll parallax, wax seal
- [x] `BucketList.tsx` — progress bar, per-item confetti, custom add
- [x] `Quiz.tsx` — step-by-step, shake on wrong, reveal correct, 5-tier results
- [x] `FutureDreams.tsx` — textarea add, newest-first, two-click delete
- [x] `Celebration.tsx` — dark bg, AnimatedCounter 0→5, kavita poetry
- [x] `SurpriseCountdownPage.tsx` — full-screen 30s, auto-navigates to /surprise
- [x] `SecretSurprise.tsx` — password input, shake on wrong, video embed, staggered reveal
- [x] `ForeverPromise.tsx` — rose petal rain, word-by-word text, anniversary counter
- [x] `InsideJokes.tsx` — flip cards, favorites
- [x] Easter Page (inline in App.tsx) — bouncing SWATI letters

---

## Phase 9 — Admin Panel ✅

- [x] 10 tabs: Timeline, Gallery, Love Notes, Reasons, Birthday Msg, Inside Jokes, Countdown Msgs, Bucket List, Export, Import
- [x] All tabs save to respective `swati_*` LocalStorage keys
- [x] Export: JSON download of all keys; Import: file upload parse

---

## Phase 10 — App Shell & Routing ✅

- [x] `src/App.tsx` — BrowserRouter, all 15+ lazy routes, AnimatePresence transitions
- [x] Cinematic routes (celebration/countdown/surprise/forever) hide Navbar/Footer
- [x] LoadingScreen 2s on first load

---

## Phase 11 — SEO & PWA ✅

- [x] `index.html` — title, meta description, OG tags
- [x] PWA manifest: name, theme_color, icons, display: standalone
- [x] Workbox: CacheFirst for assets, 43 entries precached

---

## Phase 12 — Accessibility ✅

- [x] All interactive elements have aria-label
- [x] role="dialog" + focus trap in Modal
- [x] focus-visible:ring on all buttons
- [x] aria-hidden on decorative elements
- [x] role="progressbar" with aria-valuenow

---

## Phase 13 — Dark Mode ✅

- [x] useDarkMode toggles data-theme="dark" on html
- [x] CSS variables have dark mode overrides
- [x] DarkModeToggle in Navbar
- [x] Persisted in swati_dark_mode

---

## Phase 14 — Performance & Quality ✅ (partial)

- [x] `npm run build` — clean build, 0 TypeScript errors, 43 assets in dist/
- [x] Dev server — HTTP 200, app served correctly
- [ ] Test all 15+ sections end-to-end in browser
- [ ] Test LocalStorage persist: refresh → state retained
- [ ] Test Secret Surprise: wrong password → shake; correct `07091995` → reveal
- [ ] Test Birthday Countdown: verify correct IST display
- [ ] Test Surprise Countdown: 30s, rotating messages, auto-navigate
- [ ] Test multilingual notes: EN → MR → HI; Devanagari font renders
- [ ] Test Admin Panel: edit timeline event → appears on Timeline page
- [ ] Walk full emotional journey as Swati would experience it
- [ ] Lighthouse audit on mobile: target ≥ 90 Performance, 90 Accessibility

---

## Phase 15 — Deploy

- [ ] `git init && git add . && git commit -m "Initial commit"`
- [ ] Create GitHub repo `5-years-of-love` (private)
- [ ] `git remote add origin https://github.com/YOUR_USERNAME/5-years-of-love.git && git push -u origin main`
- [ ] Go to vercel.com → Import Project → select repo
- [ ] Framework: Vite (auto-detected); Build: `npm run build`; Output: `dist`
- [ ] Click Deploy
- [ ] Verify live URL: all routes work (no 404 on refresh)
- [ ] Share URL with Swati on her birthday — **07 Sep 🎂**

---

## Content Checklist (Satish to Fill)

These are items only Satish can provide — block on these before launch:

| Item | Status | Notes |
|---|---|---|
| Wedding anniversary date | ~ | Update `ANNIVERSARY_CONFIG` in `src/utils/constants.ts` |
| Secret love letter text | ~ | Update text in `src/pages/Letter.tsx` (or via Admin if added) |
| Hero message text | ~ | `data/birthdayMessages.ts → heroMessage` (BRD draft pre-filled) |
| 5 Years celebration intro | ~ | `data/birthdayMessages.ts → celebrationIntro` (BRD draft pre-filled) |
| Final birthday reveal message | ~ | `data/birthdayMessages.ts → finalReveal` (BRD draft pre-filled) |
| Forever promise closing text | ~ | `data/birthdayMessages.ts → foreverPromise` (BRD draft pre-filled) |
| Birthday wish video URL | ~ | YouTube unlisted → paste URL into Admin > Birthday Msg > videoUrl |
| Quiz answers (correct options) | ~ | Update `correctIndex` in `data/quizQuestions.ts` or re-order options via Admin |
| Inside jokes content | ~ | Replace placeholders via Admin > Inside Jokes |
| Real couple photos | ~ | Add via Admin > Gallery after deploy |
| Royalty-free MP3 | ~ | Drop file at `public/audio/romantic-bg.mp3` |
| 100 reasons — personalize | ~ | Review/edit `data/reasons.ts` |
| Marathi / Hindi notes — review | ~ | Review/edit `data/loveNotes.ts` |

---

## Quick Reference — Key Files

| File | Purpose |
|---|---|
| `src/utils/constants.ts` | Password, birthday config, anniversary config — **edit before deploy** |
| `src/data/birthdayMessages.ts` | Hero, celebration, reveal, forever promise, videoUrl |
| `src/data/timeline.ts` | 10 hardcoded timeline events |
| `src/data/loveNotes.ts` | Notes in EN/MR/HI |
| `src/data/reasons.ts` | 100 reasons I love you |
| `src/data/quizQuestions.ts` | Quiz Q&A (update correctIndex) |
| `src/data/insideJokes.ts` | Inside jokes (replace via Admin) |
| `src/data/poetryMessages.ts` | Hindi + Marathi kavita |
| `src/data/surpriseCountdownMsgs.ts` | 4 rotating countdown messages |
| `src/data/bucketList.ts` | Bucket list items |
| `public/audio/romantic-bg.mp3` | Background music — **add this file** |
| `vercel.json` | SPA routing rewrite |
| `vite.config.ts` | PWA manifest config |

---

*Action plan derived from brd.md v2.0. Build: ✅ clean (0 errors, 43 assets). Dev server: ✅ HTTP 200.*
