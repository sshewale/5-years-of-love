# Satish & Swati — Story Reference Document

**Purpose:** Single source of truth for all personal dates, events, and content used across the website. Use this to verify any data in the code, or when adding new content.

---

## Key Dates

| Event | Date |
|-------|------|
| First meeting (arranged) | 20 December 2020 |
| First WhatsApp message (Swati → Satish) | 25 December 2020 |
| Engagement | 27 December 2020 |
| Satish said "I Love You" | 27 December 2020 (engagement day) |
| Wedding / Marriage Anniversary | 21 February 2021 |
| Swati's Birthday | 7 September (born 1995) |

---

## Travel History

| Year | Destination | Who | Notes |
|------|------------|-----|-------|
| 2022 | Shimla, Manali, Punjab | Just the two of us | 7-day trip, first big solo adventure |
| 2023 | Goa | With Swati's sister | Beach trip, family time |
| 2024 | Kashmir | With friends | Dal Lake, Mughal Gardens, snow mountains |
| 2025 | Kerala | Just the two of us | Backwaters, houseboat, coconut trees |

### Nearby Exploration (Pune)
- Forts: Sinhagad, Rajgad, Torna, Raigad, and others
- Beaches near Pune / Maharashtra coast
- General love of road trips and day trips

---

## Personality Notes

- Both love travelling — it is central to their relationship
- Explorers of nearby places from Pune (forts, beaches, hills)
- Dream destinations include: Rajasthan road trip, Leh–Ladakh, Northeast India, Europe, Northern Lights
- Food lovers — always debate where to eat
- Swati is the photographer of the two ("one more photo")
- Satish is the navigator (with occasional results)

---

## How We Met

- Arranged marriage introduction
- First saw each other on 20 Dec 2020
- Whirlwind timeline: met → WhatsApp → engaged → married in ~63 days
- Satish said "I love you" on the engagement day (27 Dec)
- Swati sent the first message (25 Dec — Christmas Day)

---

## Website Content Locations

| Content | File | Notes |
|---------|------|-------|
| Timeline events | `src/data/timeline.ts` | 10 events with real dates |
| Quiz questions | `src/data/quizQuestions.ts` | All answers based on real story |
| Bucket list | `src/data/bucketList.ts` | Travel-specific items |
| 100 Reasons | `src/data/reasons.ts` | Mix of personal + travel |
| Inside Jokes | `src/data/insideJokes.ts` | Travel stories + daily life |
| Birthday messages | `src/data/birthdayMessages.ts` | Replace `videoUrl` before deploy |
| Love Notes | `src/data/loveNotes.ts` | EN / Marathi / Hindi |
| Anniversary config | `src/utils/constants.ts` | day:21, month:2, year:2021 |
| Birthday config | `src/utils/constants.ts` | day:7, month:9 |
| Secret password | `src/utils/constants.ts` | `07091995` (Swati's birthdate) |

---

## Before Deploying — Content Checklist

- [ ] Replace `videoUrl` in `birthdayMessages.ts` with real YouTube embed URL
- [ ] Replace placeholder images in `public/images/placeholder/` with real trip photos
- [ ] Update inside jokes via Admin Panel with even more specific details
- [ ] Add real couple/trip photos via Admin Panel → Gallery
- [ ] Update letter text via Admin Panel → Letter (or edit `pages/Letter.tsx` directly)
- [ ] Review love notes (EN/MR/HI) for any personalisation

---

*Last updated: 2026-08-20*
