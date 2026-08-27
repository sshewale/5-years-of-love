# Product Owner Feedback

## Product Review

**Product:** 5 Years of Love birthday surprise for Swati  
**Branch:** `surprise-site`  
**Review date:** 27 August 2026  
**Reviewer:** Product owner review  
**Implementation update:** Release-polish pass completed 27 August 2026

## Overall Verdict

The site now has a strong emotional concept and a clear personal point of view. The real proposal, marriage-day grapes memory, travel photos, personal letter, private photo chapter, videos, quiz, bucket list, music, and final reveal make this much more personal than a generic birthday template.

The experience is close to release for a private family share. The highest-value remaining work is to protect the intended emotional sequence, improve media loading on mobile, and replace mechanically generated copy with a smaller number of deeply specific captions.

## Findings

### P0 - Release Blockers

#### 1. Birthday-date redirect can bypass the new story - RESOLVED

`useBirthdayRedirect()` redirects `/` to the older `/celebration` route on 7 September. That means Swati may never see the new opening card, gallery, secret memories, or final reveal on her birthday.

**Impact:** The most important visitor can receive a different product experience than the one reviewed.

**Resolution:** Removed the automatic redirect. The new continuous story is always the root birthday experience.

**Acceptance criteria:** Opening the root URL always starts with the new “Open Your Surprise” screen, including on 7 September.

#### 2. Secret photos are not truly private

The password is checked in browser JavaScript, and the secret image URLs are present in the public bundle/source paths. This is acceptable as a playful reveal, but it is not security protection.

**Impact:** Anyone with developer tools or the asset URL can bypass the gate.

**Recommendation:** Treat this as an emotional reveal, not secure storage. If actual privacy matters, move the images behind an authenticated/server-side delivery mechanism. Otherwise, document the limitation and avoid describing it as secure.

**Acceptance criteria:** Product copy calls it “Only for you” or “a secret reveal,” never “secure” or “private storage.”

### P1 - Strongly Recommended Before Sharing

#### 3. Initial media payload is heavy for mobile - PARTIALLY RESOLVED

The home experience references 61 photos and five videos. `loading="lazy"` helps images, but the full path/caption inventory is still bundled and each video element uses `preload="metadata"`.

**Impact:** Slower first interaction, increased mobile data usage, and possible battery pressure.

**Resolution:** Videos now use `preload="none"`, and gallery images use lazy loading. The gallery data remains in the landing chunk and should be split further only if mobile performance testing shows a problem.

**Acceptance criteria:** The opening screen is usable before gallery assets finish loading; no video downloads until the user interacts with it.

#### 4. The emotional sequence is not fully linear yet - RESOLVED

The new page includes the requested journey, but “Our Story” and the birthday hero appear before the Gallery, and the later sections are grouped through `StoryExtras`. The intended sequence should be obvious in the DOM and to a screen-reader user.

**Recommendation:** Add explicit chapter navigation/progress labels or section IDs for Gallery, Videos, Bucket List, Quiz, Secret Memories, Reasons, Future, Letter, and Final Surprise. Keep the visual order exactly aligned with the product sequence.

**Acceptance criteria:** A user scrolling from top to bottom encounters each chapter once, in order, without needing the legacy routes.

#### 5. Captions are uneven in emotional quality

Special memories have strong copy, but many of the 61 captions are derived from filenames such as “IMG20230220202858 - a memory I keep close.”

**Impact:** The archive feels partly automated at the exact moment where personal specificity matters most.

**Recommendation:** Keep all photos, but handwrite captions for the 15-20 most meaningful images. Group the rest under year/place labels with short supporting text.

**Acceptance criteria:** Every featured photo has a caption that tells Swati why Satish remembers it, not only what the filename was.

#### 6. Video playlist needs stronger orientation - RESOLVED

The five videos are visible as a playlist, but the visitor has to infer which video to watch first and the cards do not currently expose a poster/thumbnail or duration.

**Resolution:** The playlist follows the emotional arc, the first item is labelled “Start here,” and videos defer loading until interaction.

**Acceptance criteria:** A first-time visitor can understand the playlist order without reading filenames.

### P2 - Polish Opportunities

#### 7. Add a lightweight progress indicator for the one-page journey - RESOLVED

The story is long, and the current page does not give the visitor a clear sense of progress through the chapters.

**Resolution:** Added a fixed, unobtrusive progress rail that appears only after the surprise is opened.

#### 8. Make the final surprise more memorable than a normal button click - PARTIALLY RESOLVED

The final reveal already fires confetti and shows the promise. It could feel more earned with a short pause, a heart pulse, and a final music swell before the message appears.

**Resolution:** Added a 750ms pause before the final message and confetti. Reduced-motion behavior still needs a dedicated device/browser check.

#### 9. Add a graceful fallback when photos or videos fail - PARTIALLY RESOLVED

Real files and filenames are currently verified, but deployment/CDN paths can still fail because of spaces, capitalization, or encoded URLs.

**Resolution:** Added a warm fallback presentation for failed media elements. The deployed Vercel URL still needs cross-device verification.

#### 10. Reconsider the 2-second loading screen - RESOLVED

A forced loading screen delays the personal opening even when the opening card is ready.

**Resolution:** Replaced the fixed two-second timeout with a next-frame handoff so the opening screen appears immediately.

## Recommended Release Plan

1. Disable or update the birthday auto-redirect so the new root story is always the entry point.
2. Test the opening flow, music gesture, gallery lightbox, video playback, checklist persistence, quiz feedback, secret password, and final confetti on a real phone.
3. Change video `preload` to `none` and add poster images or lightweight thumbnails.
4. Handwrite captions for the most important photos: proposal, marriage day/grapes, favourite pose, Himachal, Shimla, Punjab, forts, Mahabaleshwar, Lonavala, Kerala, Kashmir, and the favourite beach memories.
5. Add a quiet chapter progress indicator and verify keyboard/screen-reader order.
6. Share the deployed preview privately before public release.

## Suggested Acceptance Checklist

- [x] Root URL always opens the new surprise experience.
- [ ] “Open Your Surprise” starts music when the browser permits it.
- [ ] Music can be muted and resumed on mobile.
- [ ] All real photos remain uncropped and have meaningful alt text/captions.
- [ ] Gallery lightbox opens, closes, and moves through photos correctly.
- [x] Videos do not download before user interaction.
- [ ] Bucket List state survives refresh through LocalStorage.
- [ ] Correct quiz answer shows heart feedback and advances.
- [ ] Wrong quiz answer shows sad-face feedback and allows retry.
- [ ] Secret password `07091995` reveals only the intended secret photos.
- [x] Final reveal fires confetti and shows the complete birthday message.
- [ ] Layout is checked at 390px mobile width and desktop width.
- [x] `npm run build` passes before deployment.

## Product Conclusion

The core idea is working: this feels like Satish remembering a shared life with Swati, not simply displaying birthday content. The next quality jump will come from protecting the story order and replacing generic filename captions with a few unmistakably personal details. Those changes will make the site feel authored, deliberate, and emotionally credible at the moment she is most engaged.
