import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, Check, ChevronLeft, ChevronRight, Frown, Heart, LockKeyhole, RotateCcw, Volume2, VolumeX, X } from 'lucide-react'
import FloatingHearts from '../components/animations/FloatingHearts'
import { useConfetti } from '../hooks/useConfetti'
import { bucketList } from '../data/bucketList'
import { quizQuestions } from '../data/quizQuestions'
import { STORAGE_KEYS } from '../utils/constants'
import { useLocalStorage } from '../hooks/useLocalStorage'

const allPhotoPaths = [
  'engagement_propose.jpg', 'IMG20220129221833.jpg', 'IMG20230220202858.jpg', 'IMG20230220205001.jpg', 'IMG20230220205044.jpg', 'IMG_20221001_123115.jpg',
  '1st year 2021/1stBday_after_merriage.jpg', '1st year 2021/Anniversary_2022.jpg', '1st year 2021/Anniversary_2022_2.jpg', '1st year 2021/Diwali.jpg', '1st year 2021/Gudipadawa.jpg', '1st year 2021/Gudipadawa_2.jpg', '1st year 2021/Himachal.jpg', '1st year 2021/Himachal_2.jpg', '1st year 2021/I like your this pics.jpg', '1st year 2021/Mumbai.jpg', '1st year 2021/Panjab.jpg', '1st year 2021/panshet.jpg', '1st year 2021/Raigad.jpg', '1st year 2021/Shimla.jpg', '1st year 2021/valentine day.jpg',
  '1st year 2021/memory/IMG-20210413-WA0055.jpg', '1st year 2021/memory/IMG-20211226-WA0057.jpg', '1st year 2021/memory/IMG_20210221_193327.jpg', '1st year 2021/memory/IMG_20210226_173907.jpg', '1st year 2021/memory/IMG_20210329_102414.jpg',
  '2st year 2022/Apali 1st 2 wheeler.jpg', '2st year 2022/at lohgad fort___piece.jpg', '2st year 2022/diwali.jpg', '2st year 2022/guest when this capture.jpg', '2st year 2022/Holi.jpg', '2st year 2022/Lonavala__RAiny season_barish_travel.jpg', '2st year 2022/Signgad fort.jpg', '2st year 2022/Your Bday.jpg',
  '3st year 2023/20231112_195212.jpg', '3st year 2023/Bday.jpg', '3st year 2023/butterfly.jpg', '3st year 2023/creativity.jpg', '3st year 2023/Flying_in air.jpg', '3st year 2023/Garba.jpg', '3st year 2023/Koraigad_new_friends.jpg', '3st year 2023/Lonavala.jpg', '3st year 2023/Mahabaleshwar.jpg', '3st year 2023/memory.jpg', '3st year 2023/party.jpg', '3st year 2023/sari.jpg', '3st year 2023/Tu ani Me.jpg', '3st year 2023/women trip_without me trip rajasthan.JPG',
  '4st year 2024/Jaipur.JPG', '4st year 2024/Kashmir.jpg', '4st year 2024/Kashmir_2.jpg', '4st year 2024/Kashmir_3.jpg', '4st year 2024/Kashmir_4.jpg',
  '5th year 2025/20240409_153617.jpg', '5th year 2025/20240714_095548.jpg', '5th year 2025/20240714_120735.jpg', '5th year 2025/Appal ghar swapnpurti.JPG', '5th year 2025/Kerala.JPG',
]
function photoCaption(path: string) {
  const filename = path.split('/').pop()?.replace(/\.[^.]+$/, '') ?? 'Our memory'
  const cleanName = filename.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim()
  if (filename === 'IMG_20210221_193327') return 'This smile... still my favourite view.'
  if (filename === 'IMG-20210413-WA0055') return 'One more memory I would happily live again.'
  if (filename === 'engagement_propose') return 'The day you said yes to our forever.'
  if (filename.toLowerCase().includes('himachal') || filename.toLowerCase().includes('shimla')) return 'The mountains are better with you.'
  if (filename.toLowerCase().includes('kashmir')) return 'Every adventure is better with my favourite person.'
  if (filename.toLowerCase().includes('kerala')) return 'A beautiful place, made better by us.'
  if (filename.toLowerCase().includes('fort') || filename.toLowerCase().includes('raigad')) return 'Exploring the world, hand in hand.'
  return `${cleanName.charAt(0).toUpperCase()}${cleanName.slice(1)} - a memory I keep close.`
}
const gallery = allPhotoPaths.map((path) => ({ image: `/images/${path}`, caption: photoCaption(path) }))
const secretPhotos = [
  { image: '/images/secret only for you ___back to memory/1652335779952.jpg', caption: 'A little memory I kept just for you.' },
  { image: '/images/secret only for you ___back to memory/IMG_20220829_093728.jpg', caption: 'The kind of moment that belongs only to us.' },
  { image: '/images/secret only for you ___back to memory/IMG_20230108_192353.jpg', caption: 'Some memories are too precious for anywhere but here.' },
]
const reasons = [
  ['Your Smile', 'Because somehow it can make even my worst day better.'], ['Your Heart', 'You care more deeply than you realize.'], ['Your Strength', 'I admire the woman you are, especially on the days you doubt yourself.'], ['Your Little Habits', 'Even the things you do not notice have become part of my favourite things.'], ['Your Laugh', 'It is one of the sounds I would choose in every lifetime.'], ['Your Patience', 'You make room for me to be human, and that is a beautiful gift.'], ['My Guide', 'You teach me so much, guide me through life, and help me become a better person.'], ['Your Courage', 'You keep moving forward with a grace I never stop admiring.'], ['Your Kindness', 'You leave every place and every person a little warmer.'], ['Us', 'My favourite version of life is the one where we are together.'],
]
const videos = [
  { src: '/videos/care.mp4', title: 'How much I care', caption: 'In every little thing I do, there is a little more love for you.' },
  { src: '/videos/MustiVideo.mp4', title: 'Our must-have memories', caption: 'The moments I never want to forget, because they have you in them.' },
  { src: '/videos/never forget video full musti day.mp4', title: 'A day I will never forget', caption: 'Some days become part of us forever.' },
  { src: '/videos/travelling_video.mp4', title: 'Our travelling story', caption: 'Every destination is better when I get to find it with you.' },
  { src: '/videos/you likes beaches.mp4', title: 'The places you love', caption: 'Wherever there is a beach, there is another beautiful memory waiting for us.' },
]
function getBirthdayTimeLeft() {
  const target = Date.UTC(2026, 8, 6, 18, 30, 0)
  const remaining = Math.max(0, target - Date.now())
  const totalSeconds = Math.floor(remaining / 1000)
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    unlocked: remaining === 0,
  }
}
const MEDIA_PLAY_EVENT = 'love-media-play'
function announceMediaPlay(source: 'background' | 'video' | 'voice', active?: HTMLMediaElement) {
  window.dispatchEvent(new CustomEvent(MEDIA_PLAY_EVENT, { detail: { source } }))
  document.querySelectorAll<HTMLMediaElement>('.love-story audio, .love-story video').forEach((media) => {
    if (media !== active) media.pause()
  })
}
function Kicker({ children }: { children: string }) { return <p className="story-kicker">{children}</p> }
function StoryButton({ children, onClick, muted = false }: { children: ReactNode; onClick?: () => void; muted?: boolean }) { return <button className={`story-button${muted ? ' story-button-muted' : ''}`} onClick={onClick}>{children}</button> }

const storyChapters = [
  { number: '01', title: 'The Beginning', copy: 'The day our story started... one moment that quietly changed everything.', image: '/images/engagement_propose.jpg', date: 'The day you said yes' },
  { number: '02', title: 'Falling in Love', copy: 'Somewhere between conversations, laughter and beautiful moments... you became my favourite person.', image: '/images/1st year 2021/memory/IMG-20210413-WA0055.jpg', date: 'Our favourite pose' },
  { number: '03', title: 'Creating Memories', copy: 'Trips. Festivals. Random selfies. Late-night conversations. Small fights. Big laughter.', image: '/images/5th year 2025/Kerala.JPG', date: 'Every adventure together' },
  { number: '04', title: 'Becoming Family', copy: 'Life became more beautiful when “Me” slowly became “We”.', image: '/images/1st year 2021/memory/IMG_20210221_193327.jpg', date: '21 February 2021' },
  { number: '05', title: 'Today', copy: 'Five years later... and after everything, I would still choose you. Again. And again. And again.', image: '/images/4st year 2024/Kashmir.jpg', date: 'Forever to go' },
]
const journeyChapterLabels = ['Birthday', 'Our Story', 'Our Places', 'Videos', 'Bucket List', 'Quiz', 'Secret Memories', 'Reasons', 'Open When', 'Future', 'Letter', 'Final Surprise']

function StoryTimeline() {
  return <section id="story" className="story-section story-timeline-section">
    <div className="story-heading timeline-heading"><Kicker>Chapter two / five years of us</Kicker><h2>Our Story <span>♥</span></h2><p>5 years ago, I didn&apos;t know that one person could change my entire life.</p></div>
    <div className="story-timeline">
      <div className="timeline-track" aria-hidden="true"><span /></div>
      {storyChapters.map((chapter, index) => <motion.article key={chapter.number} className={`timeline-chapter timeline-chapter-${index % 2 === 0 ? 'left' : 'right'}`} initial={{ opacity: 0, y: 42 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .35 }} transition={{ duration: .7, ease: [0.16, 1, 0.3, 1] }}>
        <div className="timeline-marker">{chapter.number}</div>
        <div className="timeline-card"><div className="timeline-photo-wrap"><img loading="lazy" src={chapter.image} alt={chapter.title} /></div><div className="timeline-copy"><p className="timeline-date">{chapter.date}</p><h3>{chapter.title}</h3><p>{chapter.copy}</p></div></div>
      </motion.article>)}
    </div>
    <motion.div className="timeline-climax" initial={{ opacity: 0, scale: .94 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: .4 }} transition={{ duration: 1 }}><strong>5 YEARS <span>♥</span></strong><i>↓</i><strong>1,825+ DAYS</strong><i>↓</i><strong>COUNTLESS MEMORIES</strong><i>↓</i><strong>ONE BEAUTIFUL LOVE STORY</strong><p>FOREVER TO GO <span>∞</span></p></motion.div>
  </section>
}

const reasonDeck = [
  ...reasons,
  ['Your smile', 'Because it can make my worst day feel possible again.'], ['Your courage', 'You keep showing up with a strength you do not always see in yourself.'], ['Your honesty', 'With you, I never have to pretend.'], ['Your warmth', 'You make every room feel more like home.'], ['Your curiosity', 'You make the world more interesting just by noticing it.'], ['Your dreams', 'I love the life you are building inside yourself.'], ['Your voice', 'I could find comfort in it anywhere.'], ['Your eyes', 'They still make me stop and look twice.'], ['Your care', 'You remember the little things that everyone else misses.'], ['Your humour', 'You make even the difficult days lighter.'],
  ['Your resilience', 'You have handled more than you give yourself credit for.'], ['Your softness', 'The gentleness in you is one of your greatest strengths.'], ['Your curiosity', 'There is always another place or idea you want us to discover.'], ['Your traditions', 'You turn small rituals into memories I want to keep.'], ['Your fashion', 'You make every colour look like it was waiting for you.'], ['Your cooking', 'Every meal tastes better because it carries your care.'], ['Your surprises', 'You know how to make an ordinary day feel special.'], ['Your forgiveness', 'You give our love room to grow.'], ['Your focus', 'When you believe in something, you make it happen.'], ['Your loyalty', 'You are the person I can count on without asking.'],
  ['Your hugs', 'They are still my favourite place to come back to.'], ['Your timing', 'You somehow know when I need you before I say it.'], ['Your hope', 'You keep a beautiful light alive even on hard days.'], ['Your confidence', 'I love watching you become more fully yourself.'], ['Your playfulness', 'You remind me not to take life too seriously.'], ['Your wisdom', 'You teach me something new without making it feel like a lesson.'], ['Your patience', 'You meet my rough edges with extraordinary grace.'], ['Your generosity', 'Your heart always seems to have room for one more person.'], ['Your dreams for us', 'They make our future feel like a place I can see.'], ['Your trust', 'It is one of the most precious things we share.'],
  ['Your little messages', 'They can change the whole shape of my day.'], ['Your celebrations', 'You know how to make joy feel intentional.'], ['Your photographs', 'You help us notice how much life we have already lived.'], ['Your travelling spirit', 'Every map becomes more exciting when you are beside me.'], ['Your strength for others', 'You stand up for the people you love.'], ['Your ability to learn', 'You never stop growing.'], ['Your calm', 'You bring steadiness when I need it most.'], ['Your mischief', 'You make being sensible much less interesting.'], ['Your kindness to me', 'Even when I do not deserve the easy version of you.'], ['Our story', 'Because my favourite thing about life is that it is ours.'],
]

function ReasonsDeck() {
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const current = reasonDeck[index]
  const next = () => { setIndex((value) => (value + 1) % reasonDeck.length); setRevealed(false) }
  return <section id="reasons" className="story-section reasons-section reasons-deck-section"><div className="story-heading"><Kicker>Chapter eight / the details</Kicker><h2>50 Reasons<br /><em>You&apos;re My Favourite</em></h2><p>Not just the grand gestures. Tap the card and let me remind you of one more thing.</p></div><div className={`reason-flip${revealed ? ' is-revealed' : ''}`} onClick={() => setRevealed(true)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setRevealed(true) }}><div className="reason-face reason-front"><Heart size={28} fill="currentColor" /><span>Tap to reveal a reason</span><small>♥</small></div><div className="reason-face reason-back"><span className="reason-index">{index + 1} / {reasonDeck.length}</span><Heart size={22} fill="currentColor" /><h3>{current[0]}</h3><p>{current[1]}</p></div></div><div className="reason-controls"><button className="story-button" onClick={next}>Next Reason <ArrowDown size={15} /></button><button className="reason-text-button" onClick={() => setShowAll((value) => !value)}>{showAll ? 'Hide all reasons' : 'Browse all reasons'}</button></div>{showAll && <div className="reason-mini-grid">{reasonDeck.map(([title], reasonIndex) => <button key={`${title}-${reasonIndex}`} onClick={() => { setIndex(reasonIndex); setRevealed(true); setShowAll(false) }}>{reasonIndex + 1}. {title}</button>)}</div>}</section>
}

const openWhenLetters = [
  ['Open When You Miss Me', 'No matter where we are, remember this: Somewhere in this world, there is a person thinking about you and feeling lucky to call you his wife. ♥'],
  ['Open When You Are Sad', 'You do not always have to be strong. You can cry. You can rest. You can take time. And through all of it... I will be here. ♥'],
  ['Open When You Are Angry With Me', 'Okay okay... I know I am wrong. (Even if technically I am not.) But I still love you. So please come here and give me a hug. ♥'],
  ['Open When You Need Motivation', 'Look how far you have come. Look at everything you have handled. You are stronger than you realise, and I will always believe in you.'],
]

function OpenWhenSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  return <section id="open-when" className="story-section open-when-section"><div className="story-heading"><Kicker>Chapter nine / little letters</Kicker><h2>Open When... <em>♥</em></h2><p>Four small reminders from me, waiting for the days you need them.</p></div><div className="open-when-grid">{openWhenLetters.map(([title, message], index) => <motion.button key={title} className={`open-when-card${openIndex === index ? ' is-open' : ''}`} whileHover={{ y: -5 }} onClick={() => setOpenIndex(openIndex === index ? null : index)}><span className="envelope-mark">✉</span><strong>{title}</strong><AnimatePresence>{openIndex === index && <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>{message}</motion.p>}</AnimatePresence><small>{openIndex === index ? 'Close letter' : 'Open letter'}</small></motion.button>)}</div></section>
}

function LoveLetterSection() {
  const [opened, setOpened] = useState(false)
  return <section id="letter" className="story-section letter-section"><div className={`letter-envelope${opened ? ' opened' : ''}`} onClick={() => setOpened(true)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setOpened(true) }}>{!opened ? <><span className="wax-seal">♥</span><Kicker>Chapter ten / from my heart</Kicker><h2>You have one unread<br /><em>letter...</em></h2><button className="story-button" onClick={(event) => { event.stopPropagation(); setOpened(true) }}>Open My Letter <Heart size={15} fill="currentColor" /></button></> : <motion.div className="letter-paper letter-reveal" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}><Kicker>Chapter ten / from my heart</Kicker><h2>My Dearest<br /><em>Love,</em></h2><p>Today is your birthday. And while everyone will wish you happiness, success and beautiful things... I just want you to know one thing.</p><p>I feel incredibly lucky that you are part of my life. These past 5 years have given me memories that I will always carry in my heart. We have laughed together. We have argued. We have faced challenges. We have celebrated beautiful moments. And through everything... we kept choosing each other.</p><p>You are not just my wife. You are my best friend. My comfort. My strength. And one of the biggest reasons behind my happiness.</p><p>I do not know what the future holds. But I know one thing. I want to experience it with you. More birthdays. More adventures. More memories. More laughter. And hopefully... a lifetime of holding your hand.</p><p>Happy Birthday, My Love. Thank you for being you. ♥</p><p className="signature">I love you.<br />Today, tomorrow and always.<br /><br />Always yours,<br />Satish</p></motion.div>}</div></section>
}

function CinematicOpening({ onBegin }: { onBegin: () => void }) {
  const [phase, setPhase] = useState(0)
  const [timeLeft, setTimeLeft] = useState(() => getBirthdayTimeLeft())

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setPhase(1), 900),
      window.setTimeout(() => setPhase(2), 2600),
      window.setTimeout(() => setPhase(3), 4700),
    ]
    return () => timers.forEach(window.clearTimeout)
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => setTimeLeft(getBirthdayTimeLeft()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  return <motion.section className="story-opening cinematic-opening" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.03 }}>
    <div className="opening-image" aria-hidden="true" />
    <div className="opening-vignette" aria-hidden="true" />
    <div className="opening-stars" aria-hidden="true">✦　·　✧　·　✦　·　✧</div>
    <div className="opening-rail" aria-hidden="true"><span /><span /><span /></div><div className="princess-train" aria-hidden="true"><div className="train-balloons"><span>●</span><span>●</span><span>●</span><span>●</span><i /><i /><i /><i /></div><div className="train-smoke smoke-one" /><div className="train-smoke smoke-two" /><div className="train-engine"><i /><i /><i /></div><div className="train-carriage carriage-one"><img src="/images/train_1.jpg" alt="" /></div><div className="train-carriage carriage-two"><img src="/images/train_2.jpg" alt="" /></div><div className="train-carriage carriage-three"><img src="/images/train_3.jpg" alt="" /><div className="train-cake"><span>✦</span><b /><i /></div></div><div className="train-wheel wheel-one" /><div className="train-wheel wheel-two" /><div className="train-wheel wheel-three" /><div className="train-wheel wheel-four" /></div>
    <div className="opening-content">
      <motion.div className="opening-heartbeat" animate={{ scale: [1, 1.16, 1] }} transition={{ duration: 1.35, repeat: Infinity, ease: 'easeInOut' }} aria-hidden="true">♥</motion.div>
      <AnimatePresence mode="wait">
        {phase === 0 && <motion.p key="first" className="opening-line opening-line-soft" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>For the most special person in my life...</motion.p>}
        {phase === 1 && <motion.p key="second" className="opening-line" initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0)' }} exit={{ opacity: 0 }}>Today is not just about celebrating your birthday...</motion.p>}
        {phase >= 2 && <motion.div key="welcome" className="opening-welcome" initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}><p className="opening-kicker">All aboard the Princess Express!</p><h1>Happy Birthday,<br /><em>My Love</em> <span>♥</span></h1><p className="opening-description">It&apos;s about celebrating the day the most beautiful person in my life came into this world.</p><p className="opening-platform">Platform 07 · Destination: Forever</p><div className="journey-ticket"><img src="/images/placeholder/timeline-default.jpg" alt="A keepsake from our journey together" /><div><span>5 YEARS OF US</span><strong>Forever to go ∞</strong><small>Next stop: every beautiful memory we haven&apos;t made yet.</small></div></div><div className="birthday-countdown" aria-live="polite"><span>{timeLeft.days}d</span><span>{timeLeft.hours}h</span><span>{timeLeft.minutes}m</span><span>{timeLeft.seconds}s</span><small>{timeLeft.unlocked ? 'The Princess Express has arrived ♥' : 'The birthday journey begins at midnight · 07 September · IST'}</small></div>{phase >= 3 && <motion.div className="opening-action" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}><StoryButton onClick={onBegin}>Begin Our Story <Heart size={16} fill="currentColor" /></StoryButton><p>Made with love, by Satish · A private journey made for Swati</p><span className="begin-hint">Tap to begin the journey ↓</span></motion.div>}</motion.div>}
      </AnimatePresence>
    </div>
    <div className="opening-date" aria-hidden="true"><span>07</span><small>SEP / 2026</small></div>
  </motion.section>
}

function StoryExtras({ checkedDreams, toggleDream, quizStep, quizScore, quizDone, quizFeedback, answerQuiz, resetQuiz, secretUnlocked, secretPassword, setSecretPassword, unlockSecret, secretError }: { checkedDreams: Record<string, boolean>; toggleDream: (id: string) => void; quizStep: number; quizScore: number; quizDone: boolean; quizFeedback: 'correct' | 'wrong' | null; answerQuiz: (answer: number) => void; resetQuiz: () => void; secretUnlocked: boolean; secretPassword: string; setSecretPassword: (value: string) => void; unlockSecret: () => void; secretError: boolean }) {
  const completed = Object.values(checkedDreams).filter(Boolean).length
  return <>
    <section id="videos" className="story-section videos-section"><div className="story-heading"><Kicker>Chapter four / little films</Kicker><h2>Our Memories<br /><em>in Motion</em></h2><p>Start with “How much I care,” then follow our story through mischief, travel and the places you love.</p></div><div className="video-grid">{videos.map((video, index) => <article className="video-card" key={video.src}><div className="video-label">{index === 0 ? 'Start here' : `Film 0${index + 1}`}</div><video controls preload="none" src={video.src} onPlay={(event) => announceMediaPlay('video', event.currentTarget)} onError={(event) => { event.currentTarget.style.display = 'none'; event.currentTarget.parentElement?.classList.add('media-failed') }} /><div><h3>{video.title}</h3><p>{video.caption}</p></div></article>)}</div></section>
    <section className="story-section bucket-section"><div className="story-heading"><Kicker>Chapter five / still dreaming</Kicker><h2>Our Bucket<br /><em>List</em></h2><p>Interactive dreams for the two of us. Check one off, then go make it real.</p></div><div className="dream-progress"><span>{completed} of {bucketList.length} dreams checked</span><div><i style={{ width: `${Math.round((completed / bucketList.length) * 100)}%` }} /></div></div><div className="dream-list">{bucketList.map((dream) => <button className={`dream-row${checkedDreams[dream.id] ? ' checked' : ''}`} key={dream.id} onClick={() => toggleDream(dream.id)}><span className="dream-check">{checkedDreams[dream.id] && <Check size={15} />}</span><span className="dream-emoji">{dream.emoji}</span><span>{dream.label}</span></button>)}</div></section>
    <section className="story-section quiz-section"><div className="story-heading"><Kicker>Chapter six / do you remember?</Kicker><h2>Our Little<br /><em>Love Quiz</em></h2><p>A few questions about the story only we know by heart.</p></div>{quizDone ? <div className="quiz-result"><Heart size={42} fill="currentColor" /><h3>{quizScore}/{quizQuestions.length}</h3><p>{quizScore === quizQuestions.length ? 'You know our story perfectly, my love.' : 'The best part is that we are still writing the answers together.'}</p><button className="story-button" onClick={resetQuiz}>Play Again <RotateCcw size={15} /></button></div> : <div className={`quiz-card quiz-${quizFeedback ?? 'idle'}`}><div className="quiz-meta">Question {quizStep + 1} / {quizQuestions.length}</div><h3>{quizQuestions[quizStep].question}</h3><div className="quiz-options">{quizQuestions[quizStep].options.map((option, index) => <button key={option} onClick={() => answerQuiz(index)} disabled={quizFeedback === 'correct'}><b>{String.fromCharCode(65 + index)}</b>{option}</button>)}</div>{quizFeedback === 'correct' && <motion.div className="quiz-feedback correct" initial={{ opacity: 0, scale: .7 }} animate={{ opacity: 1, scale: 1 }}><Heart size={24} fill="currentColor" />Correct, my love!</motion.div>}{quizFeedback === 'wrong' && <motion.div className="quiz-feedback wrong" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><Frown size={24} />Not this one, sweetheart. Try again.</motion.div>}</div>}</section>
    <section className="story-section secret-section"><div className="story-heading"><Kicker>Chapter seven / only for you</Kicker><h2>Secret<br /><em>Memories</em></h2><p>Some photographs are meant to be opened with a date only we know.</p></div>{secretUnlocked ? <motion.div className="secret-grid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>{secretPhotos.map((photo) => <figure key={photo.image}><img src={photo.image} alt={photo.caption} /><figcaption>{photo.caption}</figcaption></figure>)}</motion.div> : <form className="secret-lock-card" onSubmit={(event) => { event.preventDefault(); unlockSecret() }}><LockKeyhole size={28} /><h3>Only for you, Swati</h3><p>Enter your birthdate in DDMMYYYY format to open these memories.</p><input value={secretPassword} onChange={(event) => setSecretPassword(event.target.value)} inputMode="numeric" maxLength={8} placeholder="DDMMYYYY" aria-label="Secret memory password" /><button className="story-button" type="submit">Open Secret Photos <Heart size={15} fill="currentColor" /></button>{secretError && <span className="secret-error">That is not quite it, my love. Try again.</span>}</form>}</section>
  </>
}

export default function Landing() {
  const [opened, setOpened] = useState(false)
  const [musicOn, setMusicOn] = useState(false)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [finalOpen, setFinalOpen] = useState(false)
  const [checkedDreams, setCheckedDreams] = useLocalStorage<Record<string, boolean>>(STORAGE_KEYS.BUCKET_CHECKED, {})
  const [quizStep, setQuizStep] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [quizDone, setQuizDone] = useState(false)
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [secretUnlocked, setSecretUnlocked] = useState(false)
  const [secretPassword, setSecretPassword] = useState('')
  const [secretError, setSecretError] = useState(false)
  const [chapterProgress, setChapterProgress] = useState(0)
  const [currentChapter, setCurrentChapter] = useState(1)
  const [finalRevealing, setFinalRevealing] = useState(false)
  const [replayPrompt, setReplayPrompt] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { fireCelebration } = useConfetti()
  useEffect(() => { if (opened && musicOn) { const audio = audioRef.current; if (!audio) return; announceMediaPlay('background', audio); void audio.play().catch(() => setMusicOn(false)) } }, [opened, musicOn])
  const openStory = () => { setOpened(true); setMusicOn(true); window.setTimeout(() => document.getElementById('birthday')?.scrollIntoView({ behavior: 'smooth' }), 500) }
  const toggleMusic = () => { if (musicOn) audioRef.current?.pause(); setMusicOn((value) => !value) }
  const revealFinal = () => { if (finalRevealing) return; setFinalRevealing(true); window.setTimeout(() => { setFinalOpen(true); setFinalRevealing(false); fireCelebration() }, 750) }
  const replay = () => { setReplayPrompt(false); setOpened(false); setFinalOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const toggleDream = (id: string) => setCheckedDreams({ ...checkedDreams, [id]: !checkedDreams[id] })
  const answerQuiz = (answer: number) => { const isCorrect = answer === quizQuestions[quizStep].correctIndex; if (!isCorrect) { setQuizFeedback('wrong'); return } const nextScore = quizScore + 1; setQuizScore(nextScore); setQuizFeedback('correct'); window.setTimeout(() => { setQuizFeedback(null); if (quizStep === quizQuestions.length - 1) setQuizDone(true); else setQuizStep(quizStep + 1) }, 900) }
  const resetQuiz = () => { setQuizStep(0); setQuizScore(0); setQuizDone(false); setQuizFeedback(null) }
  const unlockSecret = () => { if (secretPassword === '07091995') { setSecretUnlocked(true); setSecretError(false) } else setSecretError(true) }
  useEffect(() => {
    if (!opened) return
    const updateProgress = () => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>('.love-story main > section, .love-story main > .videos-section, .love-story main > .bucket-section, .love-story main > .quiz-section, .love-story main > .secret-section'))
      const current = sections.filter((section) => section.getBoundingClientRect().top <= window.innerHeight * .45).length
      setCurrentChapter(Math.max(1, Math.min(journeyChapterLabels.length, current)))
      setChapterProgress(Math.min(100, Math.round((current / Math.max(sections.length, 1)) * 100)))
    }
    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    return () => window.removeEventListener('scroll', updateProgress)
  }, [opened])

  return <div className="love-story">
    <audio ref={audioRef} src="/audio/romantic-bg_1.mp3" loop />
    <FloatingHearts />
    {opened && <div className="chapter-progress" aria-label={`${chapterProgress}% of our story completed`}><span style={{ width: `${chapterProgress}%` }} /><strong>Chapter {currentChapter} of {journeyChapterLabels.length} · {journeyChapterLabels[currentChapter - 1]}</strong></div>}
    {opened && <button className="music-control" onClick={toggleMusic} aria-label={musicOn ? 'Mute music' : 'Play music'}>{musicOn ? <Volume2 size={18} /> : <VolumeX size={18} />}<span>{musicOn ? 'Music on' : 'Music off'}</span></button>}
    <AnimatePresence>{!opened && <CinematicOpening onBegin={openStory} />}</AnimatePresence>
    {opened && <main>
      <section id="birthday" className="story-hero story-section"><div className="hero-orbit" aria-hidden="true"><span>♥</span><span>✦</span><span>♥</span></div><Kicker>Chapter one / your day</Kicker><motion.h2 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>Happy Birthday,<br /><em>My Love</em> <span>♥</span></motion.h2><p className="hero-subtitle">To the woman who made my ordinary life extraordinary.</p><div className="cake" aria-label="A birthday cake with glowing candles"><div className="flame">✦</div><div className="cake-candle" /><div className="cake-top" /><div className="cake-body" /><div className="cake-plate" /></div><div className="hero-letter"><p>Swati, you are the person who turned a life into a home. I am endlessly grateful for every day I get to call you my best friend, my partner, and my family.</p><p>Life feels softer, brighter and more possible because you are beside me. I do not just love the big celebrations. I love the sleepy conversations, the shared glances, the little routines and every unremarkable moment that becomes precious because it is ours.</p><p>Here is to every memory we have made, and every one still waiting for us.</p><p className="signature">Always yours,<br />Satish</p></div><a className="scroll-cue" href="#story">Begin our story <ArrowDown size={15} /></a></section>
      <StoryTimeline />
      <section className="story-section gallery-section"><div className="story-heading"><Kicker>Chapter three / kept forever</Kicker><h2>Our Places,<br /><em>Our Years</em></h2><p>Every road, celebration, fort, mountain and quiet day that brought us here. Tap any photograph to see it closer.</p></div><div className="photo-grid">{gallery.map((photo, index) => <motion.button whileHover={{ y: -8 }} className={`photo-tile tile-${index + 1}`} key={photo.image} onClick={() => setLightbox(index)}><img loading="lazy" src={photo.image} alt={photo.caption} /><span>{photo.caption}</span></motion.button>)}</div></section>
      <StoryExtras checkedDreams={checkedDreams} toggleDream={toggleDream} quizStep={quizStep} quizScore={quizScore} quizDone={quizDone} quizFeedback={quizFeedback} answerQuiz={answerQuiz} resetQuiz={resetQuiz} secretUnlocked={secretUnlocked} secretPassword={secretPassword} setSecretPassword={setSecretPassword} unlockSecret={unlockSecret} secretError={secretError} />
      <ReasonsDeck />
      <OpenWhenSection />
      <section className="story-section eyes-section"><div className="eyes-line" /><Kicker>Chapter eleven / if I could give you anything</Kicker><blockquote>&ldquo;I wouldn&apos;t give you diamonds or anything expensive. I&apos;d give you the ability to see yourself through my eyes... so you could see just how beautiful, precious and irreplaceable you are to me.&rdquo;</blockquote><div className="reveal-promise"><p>And if I could ask for one thing...</p><h2>Let me keep making you smile<br />for the rest of our lives. <span>♥</span></h2></div></section>
      <section className="story-section future-section"><div className="future-copy"><Kicker>Chapter twelve / still ahead</Kicker><h2>Our best chapters<br /><em>are still waiting</em><br />to be written...</h2><p>More trips with no perfect itinerary. More laughter until our stomachs hurt. More celebrations, photographs, silly arguments and making up. More peaceful evenings where being together is enough.</p><p>More growing old side by side. More choosing each other. More of us building our little world, one ordinary and beautiful day at a time.</p></div><div className="future-stamp"><span>To<br />infinity</span><strong>∞</strong><small>and always</small></div></section>
      <LoveLetterSection />
      <section id="final-surprise" className={`final-section${finalOpen ? ' final-open' : ''}${finalRevealing ? ' final-revealing' : ''}`}><AnimatePresence mode="wait">{!finalOpen ? <motion.div key="locked" className="final-lock" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><div className="gift-heart" aria-hidden="true">♥</div><Kicker>The final chapter</Kicker><h2>But wait...<br /><em>One Last Surprise</em></h2><p>Your surprise isn&apos;t over yet, my love.</p><StoryButton onClick={revealFinal}>{finalRevealing ? 'Opening your surprise...' : 'Open Your Final Surprise'} <Heart size={16} fill="currentColor" /></StoryButton></motion.div> : <motion.div key="revealed" className="final-message" initial={{ opacity: 0, scale: .88, filter: 'blur(10px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0)' }}><div className="final-sparkle">✦</div><img className="final-best-photo" src="/images/Gemini_Generated_Image_.png" alt="Swati and Satish together inside a heart-shaped arrangement" /><p className="final-overline">HAPPY BIRTHDAY MY LOVE ♥🎂</p><h2>5 Years of Memories.<br /><em>A Lifetime Still To Come.</em></h2><p>I choose you.</p><div className="final-choice">Today.<br />Tomorrow.<br /><strong>Forever. ∞</strong></div><div className="final-divider" /><p className="final-small">Here&apos;s to you.<br />Here&apos;s to us.<br />And here&apos;s to all the beautiful memories we haven&apos;t made yet.</p><StoryButton muted onClick={() => setReplayPrompt(true)}><RotateCcw size={15} /> Replay Our Story</StoryButton>{replayPrompt && <div className="replay-prompt"><p>Start our story again from the beginning?</p><button onClick={replay}>Yes, replay it</button><button onClick={() => setReplayPrompt(false)}>Stay here</button></div>}<div className="voice-message"><span className="voice-message-icon">♥</span><strong>Close Your Eyes...<br />I Want You To Hear Something ❤️</strong><small>For the best experience, listen with headphones.</small><audio controls preload="none" src="/audio/birthday_wish_final.m4a" onPlay={(event) => announceMediaPlay('voice', event.currentTarget)} /><p className="voice-closing">Thank you for listening, my love. The best part of our story is still ahead.</p></div></motion.div>}</AnimatePresence></section>
    </main>}
    <AnimatePresence>{lightbox !== null && <motion.div className="story-lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true"><button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close photo"><X /></button><button className="lightbox-arrow left" onClick={() => setLightbox((lightbox + gallery.length - 1) % gallery.length)} aria-label="Previous photo"><ChevronLeft /></button><motion.img key={lightbox} initial={{ scale: .88 }} animate={{ scale: 1 }} src={gallery[lightbox].image} alt={gallery[lightbox].caption} /><button className="lightbox-arrow right" onClick={() => setLightbox((lightbox + 1) % gallery.length)} aria-label="Next photo"><ChevronRight /></button><p>{gallery[lightbox].caption}</p></motion.div>}</AnimatePresence>
  </div>
}
