# CLAUDE.md — 5 Years of Love Project

This file gives Claude instant context for this working directory.
All decisions should reference `brd.md` (v2.0) and `action.md`.

---

## Project Identity

- **Project:** "5 Years of Love" — Birthday Surprise Website for Swati
- **Author:** Satish Shewale (Satish.Shewale@encora.com)
- **End User:** Swati (wife) — birthday 07 September 1995
- **Secret Password:** `07091995` (wife's birthdate, DDMMYYYY)
- **Deploy target:** Vercel (via GitHub)
- **Timeline:** ASAP — 1 to 2 days

---

## Key Files in This Folder

| File | Purpose |
|---|---|
| `brd.md` | Full Business Requirements Document — v2.0, single source of truth |
| `action.md` | Step-by-step task checklist with phases 0–15 |
| `CLAUDE.md` | This file — project context for Claude |

---

## Tech Stack (Do Not Change Without BRD Update)

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript (strict mode) |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Routing | React Router v7 |
| Icons | Lucide React |
| Persistence | Browser LocalStorage only (no backend) |
| Deployment | Vercel |
| PWA | vite-plugin-pwa |

---

## Design System (Quick Reference)

| Token | Value |
|---|---|
| Primary brand | `#B76E79` (rose-gold) |
| Background | `#F5ECD7` (beige-warm) |
| Accent | `#FFD6E0` (pink-soft) |
| Secondary | `#E8D5F5` (lavender) |
| Dark mode base | `#1A1A2E` |
| Heading font | Playfair Display |
| Body font | Inter |
| Letter font | Dancing Script |
| Multilingual font | Noto Sans Devanagari (Marathi / Hindi) |

---

## Critical Constants (set in `src/utils/constants.ts` before deploy)

```typescript
SECRET_PASSWORD = "07091995"           // wife's birthdate
BIRTHDAY_CONFIG  = { day: 7, month: 9, timezone: "Asia/Kolkata" }
ANNIVERSARY_CONFIG = { day: ?, month: ?, year: ?, timezone: "Asia/Kolkata" }
```

> Satish must fill in `ANNIVERSARY_CONFIG` before deploying.

---

## Page / Route Map

| Route | Page | Section |
|---|---|---|
| `/` | Landing.tsx | Hero + Birthday Countdown |
| `/timeline` | Timeline.tsx | Section 1 |
| `/gallery` | Gallery.tsx | Section 2 |
| `/reasons` | ReasonsILoveYou.tsx | Section 3 |
| `/notes` | LoveNotes.tsx | Section 4 (EN/MR/HI) |
| `/letter` | Letter.tsx | Section 5 |
| `/bucket` | BucketList.tsx | Section 6 |
| `/quiz` | Quiz.tsx | Section 7 |
| `/dreams` | FutureDreams.tsx | Section 8 |
| `/celebration` | Celebration.tsx | Section 9 — 5 Years Together |
| `/countdown` | SurpriseCountdownPage.tsx | Section 10 — 30s countdown |
| `/surprise` | SecretSurprise.tsx | Section 11 — Password reveal |
| `/forever` | ForeverPromise.tsx | Section 12 — Closing screen |
| `/jokes` | InsideJokes.tsx | MVP+ — inside jokes |
| `/easter` | Easter egg hidden route | MVP+ |
| `/admin` | AdminPanel.tsx | Hidden admin panel |

---

## LocalStorage Keys

All keys are prefixed `swati_`. Never rename them — Admin Panel reads the same keys.

| Key | Contents |
|---|---|
| `swati_timeline` | Admin-edited timeline events |
| `swati_gallery` | Admin-added gallery photos |
| `swati_notes_favorites` | Favorited note IDs |
| `swati_notes_bookmarks` | Bookmarked note IDs |
| `swati_bucket_list` | Bucket list checked state |
| `swati_future_dreams` | FutureDream objects |
| `swati_dark_mode` | `"true"` / `"false"` |
| `swati_admin_notes` | Admin-edited love notes |
| `swati_admin_message` | Admin-edited secret message |
| `swati_admin_reasons` | Admin-edited reasons array |
| `swati_note_lang` | `"en"` / `"mr"` / `"hi"` |
| `swati_inside_jokes_fav` | Favorited inside joke IDs |
| `swati_admin_birthday_msg` | Admin-edited birthday messages |
| `swati_admin_countdown_msgs` | Admin-edited countdown messages |
| `swati_admin_inside_jokes` | Admin-edited inside jokes |

---

## Data Files (src/data/)

| File | Contents |
|---|---|
| `timeline.ts` | 10 timeline events with emotional titles |
| `reasons.ts` | 100 reasons I love you |
| `loveNotes.ts` | 365 notes in EN / Marathi / Hindi |
| `quizQuestions.ts` | 8 relationship quiz Q&A |
| `bucketList.ts` | 10+ bucket list items |
| `birthdayMessages.ts` | heroMessage, celebrationIntro, finalReveal, foreverPromise, videoUrl? |
| `poetryMessages.ts` | Hindi kavita + Marathi kavita |
| `surpriseCountdownMsgs.ts` | 4 rotating anticipation messages |
| `insideJokes.ts` | Inside jokes / funny memories |

---

## Emotional Journey (in order)

```
Loading → Landing (Curiosity)
→ Timeline + Gallery (Nostalgia)
→ Reasons + Notes + Letter + Quiz (Connection)
→ Bucket List + Dreams (Joy)
→ Celebration + 30s Countdown (Anticipation)
→ Password Reveal + Video (Emotional Peak)
→ Forever Promise (Lasting Impression)
```

---

## Rules for Claude Working in This Folder

1. **Never change the secret password** — it is always `07091995`
2. **Do not add a backend** — everything persists in LocalStorage only
3. **Keep all keys prefixed `swati_`** — Admin Panel depends on them
4. **Emotional copy is as important as code** — don't stub it out; use the drafts in `brd.md`
5. **Do not auto-play music on load** — music starts only after first user interaction
6. **Multilingual support is non-negotiable** — EN, Marathi, Hindi all required in loveNotes
7. **All new pages must be lazy-loaded** via `React.lazy()` + `Suspense`
8. **All interactive elements need ARIA labels** — accessibility is MVP, not nice-to-have
9. **Consult `action.md` for task order** — phases 0–15 define the correct build sequence
10. **Satish must provide:** anniversary date, letter text, quiz answers, inside jokes, birthday video URL
