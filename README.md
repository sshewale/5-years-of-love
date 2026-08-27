# 5 Years of Love

A cinematic, interactive birthday surprise website built for Swati — celebrating five years together.

## What it is

A 12-section emotional journey across:
- **Timeline** — relationship milestones with photos and stories
- **Gallery** — couple photos in a masonry lightbox
- **100 Reasons** — flip cards, each one a reason I love you
- **Love Notes** — 365 notes in English, Marathi, and Hindi
- **A Love Letter** — handwritten in Dancing Script with a paper-texture backdrop
- **Bucket List** — shared adventures checked off together
- **Quiz** — 8 relationship questions with animated feedback
- **Future Dreams** — write dreams for the future, stored locally
- **Celebration** — animated 5-year counter with bilingual poetry
- **Secret Surprise** — password-protected video reveal (`07091995`)
- **Forever Promise** — rose petal rain and a closing message
- **Inside Jokes** — flip cards for our private memories

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Language | TypeScript (strict) |
| Build | Vite |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Routing | React Router v7 |
| Persistence | Browser LocalStorage |
| PWA | vite-plugin-pwa + Workbox |
| Deploy | Vercel |

## Running locally

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`.

## Building for production

```bash
npm run build
npm run preview
```

## Admin Panel

Navigate to `/admin` to edit all content without touching code. Supports JSON export and import for full content portability.

## Deploy

The project is configured for Vercel. Push to GitHub and import via `vercel.com → Import Project`. Framework is auto-detected as Vite.

## Before deploying

1. Set `ANNIVERSARY_CONFIG` in [src/utils/constants.ts](src/utils/constants.ts) to your real anniversary date
2. Add `public/audio/romantic-bg.mp3` (royalty-free romantic instrumental)
3. Replace `videoUrl` in [src/data/birthdayMessages.ts](src/data/birthdayMessages.ts) with your YouTube unlisted embed URL
4. Update quiz `correctIndex` values via Admin Panel or directly in [src/data/quizQuestions.ts](src/data/quizQuestions.ts)
5. Replace inside jokes via Admin Panel with real memories
6. Add real couple photos via Admin Panel after deploy
