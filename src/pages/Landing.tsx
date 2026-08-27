import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, Check, ChevronLeft, ChevronRight, Frown, Heart, LockKeyhole, RotateCcw, Volume2, VolumeX, X } from 'lucide-react'
import FloatingHearts from '../components/animations/FloatingHearts'
import { useConfetti } from '../hooks/useConfetti'
import { bucketList } from '../data/bucketList'
import { quizQuestions } from '../data/quizQuestions'
import { STORAGE_KEYS } from '../utils/constants'
import { useLocalStorage } from '../hooks/useLocalStorage'

const memories = [
  { title: 'The Beginning', date: 'The day you said yes', image: '/images/engagement_propose.jpg', caption: 'The moment our forever began.', detail: 'I still remember the feeling of asking, hoping, and hearing you say yes.' },
  { title: 'The Day You Smiled', date: '21 February 2021', image: '/images/1st year 2021/memory/IMG_20210221_193327.jpg', caption: 'You were crying, so I bought you grapes - your favourite - and that smile came back.', detail: 'That little smile on our marriage day is one of the memories I will protect forever.' },
  { title: 'The Adventures', date: 'Every trip we take', image: '/images/5th year 2025/Kerala.JPG', caption: 'Every road is my favourite when I am travelling it with you.', detail: 'We both love travelling, and every place feels more alive because we discover it together.' },
  { title: 'The Little Things', date: 'A favourite pose', image: '/images/1st year 2021/memory/IMG-20210413-WA0055.jpg', caption: 'Us - exactly where I want to be.', detail: 'The quiet moments are not background to our story. They are the story.' },
]
const gallery = [
  { image: '/images/1st year 2021/memory/IMG_20210221_193327.jpg', caption: 'This smile... still my favourite view.' },
  { image: '/images/engagement_propose.jpg', caption: 'The day you said yes to our forever.' },
  { image: '/images/1st year 2021/memory/IMG-20210413-WA0055.jpg', caption: 'One more memory I would happily live again.' },
  { image: '/images/5th year 2025/Kerala.JPG', caption: 'Some moments become memories. Some memories become treasures.' },
  { image: '/images/1st year 2021/Himachal.jpg', caption: 'The best views are the ones we share.' },
  { image: '/images/4st year 2024/Kashmir.jpg', caption: 'Every adventure is better with my favourite person.' },
  { image: '/images/2st year 2022/Lonavala__RAiny season_barish_travel.jpg', caption: 'Rain, roads, and you.' },
  { image: '/images/3st year 2023/Tu ani Me.jpg', caption: 'My favourite place is beside you.' },
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
function Kicker({ children }: { children: string }) { return <p className="story-kicker">{children}</p> }
function StoryButton({ children, onClick, muted = false }: { children: ReactNode; onClick?: () => void; muted?: boolean }) { return <button className={`story-button${muted ? ' story-button-muted' : ''}`} onClick={onClick}>{children}</button> }

function RomanticCanvasCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    const image = new Image()
    image.src = '/images/1st year 2021/memory/IMG-20210413-WA0055.jpg'

    const drawCard = () => {
      const width = canvas.clientWidth * window.devicePixelRatio
      const height = canvas.clientHeight * window.devicePixelRatio
      canvas.width = width
      canvas.height = height
      context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0)
      const cardWidth = canvas.clientWidth
      const cardHeight = canvas.clientHeight
      context.fillStyle = '#392127'
      context.fillRect(0, 0, cardWidth, cardHeight)

      const scale = Math.min(cardWidth / image.naturalWidth, cardHeight / image.naturalHeight)
      const imageWidth = image.naturalWidth * scale
      const imageHeight = image.naturalHeight * scale
      context.drawImage(image, (cardWidth - imageWidth) / 2, (cardHeight - imageHeight) / 2, imageWidth, imageHeight)
      const tint = context.createLinearGradient(0, 0, 0, cardHeight)
      tint.addColorStop(0, 'rgba(42, 18, 28, .12)')
      tint.addColorStop(.58, 'rgba(42, 18, 28, .05)')
      tint.addColorStop(1, 'rgba(42, 18, 28, .82)')
      context.fillStyle = tint
      context.fillRect(0, 0, cardWidth, cardHeight)

      for (let index = 0; index < 12; index += 1) {
        const x = 20 + ((index * 67) % Math.max(cardWidth - 40, 1))
        const y = 22 + ((index * 31) % Math.max(cardHeight * .42, 1))
        context.beginPath()
        context.arc(x, y, 2.5, 0, Math.PI * 2)
        context.fillStyle = index % 3 === 0 ? '#ffd38a' : '#fff0c4'
        context.shadowColor = '#ffd38a'
        context.shadowBlur = 12
        context.fill()
        context.shadowBlur = 0
      }

      context.fillStyle = '#fff4e7'
      context.textAlign = 'center'
      context.font = '600 13px Georgia, serif'
      context.fillText('HAPPY BIRTHDAY, SWATI', cardWidth / 2, cardHeight - 78)
      context.font = 'italic 25px Georgia, serif'
      context.fillStyle = '#ffd6c4'
      context.fillText('my favourite person', cardWidth / 2, cardHeight - 45)
      context.fillStyle = '#f3b06a'
      context.fillRect(cardWidth / 2 - 32, cardHeight - 25, 64, 8)
      context.fillStyle = '#fff4e7'
      context.beginPath()
      context.arc(cardWidth / 2 - 15, cardHeight - 29, 3, 0, Math.PI * 2)
      context.arc(cardWidth / 2, cardHeight - 29, 3, 0, Math.PI * 2)
      context.arc(cardWidth / 2 + 15, cardHeight - 29, 3, 0, Math.PI * 2)
      context.fill()
    }

    image.onload = drawCard
    window.addEventListener('resize', drawCard)
    return () => window.removeEventListener('resize', drawCard)
  }, [])

  return <canvas ref={canvasRef} className="romantic-canvas" aria-label="A birthday card made from one of our favourite memories" />
}

function StoryExtras({ checkedDreams, toggleDream, quizStep, quizScore, quizDone, quizFeedback, answerQuiz, resetQuiz }: { checkedDreams: Record<string, boolean>; toggleDream: (id: string) => void; quizStep: number; quizScore: number; quizDone: boolean; quizFeedback: 'correct' | 'wrong' | null; answerQuiz: (answer: number) => void; resetQuiz: () => void }) {
  const completed = Object.values(checkedDreams).filter(Boolean).length
  return <>
    <section className="story-section videos-section"><div className="story-heading"><Kicker>Chapter four / little films</Kicker><h2>Our Memories<br /><em>in Motion</em></h2><p>Five little films from the life we keep making together.</p></div><div className="video-grid">{videos.map((video) => <article className="video-card" key={video.src}><video controls preload="metadata" src={video.src} /><div><h3>{video.title}</h3><p>{video.caption}</p></div></article>)}</div></section>
    <section className="story-section bucket-section"><div className="story-heading"><Kicker>Chapter five / still dreaming</Kicker><h2>Our Bucket<br /><em>List</em></h2><p>Interactive dreams for the two of us. Check one off, then go make it real.</p></div><div className="dream-progress"><span>{completed} of {bucketList.length} dreams checked</span><div><i style={{ width: `${Math.round((completed / bucketList.length) * 100)}%` }} /></div></div><div className="dream-list">{bucketList.map((dream) => <button className={`dream-row${checkedDreams[dream.id] ? ' checked' : ''}`} key={dream.id} onClick={() => toggleDream(dream.id)}><span className="dream-check">{checkedDreams[dream.id] && <Check size={15} />}</span><span className="dream-emoji">{dream.emoji}</span><span>{dream.label}</span></button>)}</div></section>
    <section className="story-section quiz-section"><div className="story-heading"><Kicker>Chapter six / do you remember?</Kicker><h2>Our Little<br /><em>Love Quiz</em></h2><p>A few questions about the story only we know by heart.</p></div>{quizDone ? <div className="quiz-result"><Heart size={42} fill="currentColor" /><h3>{quizScore}/{quizQuestions.length}</h3><p>{quizScore === quizQuestions.length ? 'You know our story perfectly, my love.' : 'The best part is that we are still writing the answers together.'}</p><button className="story-button" onClick={resetQuiz}>Play Again <RotateCcw size={15} /></button></div> : <div className={`quiz-card quiz-${quizFeedback ?? 'idle'}`}><div className="quiz-meta">Question {quizStep + 1} / {quizQuestions.length}</div><h3>{quizQuestions[quizStep].question}</h3><div className="quiz-options">{quizQuestions[quizStep].options.map((option, index) => <button key={option} onClick={() => answerQuiz(index)} disabled={quizFeedback === 'correct'}><b>{String.fromCharCode(65 + index)}</b>{option}</button>)}</div>{quizFeedback === 'correct' && <motion.div className="quiz-feedback correct" initial={{ opacity: 0, scale: .7 }} animate={{ opacity: 1, scale: 1 }}><Heart size={24} fill="currentColor" />Correct, my love!</motion.div>}{quizFeedback === 'wrong' && <motion.div className="quiz-feedback wrong" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><Frown size={24} />Not this one, sweetheart. Try again.</motion.div>}</div>}</section>
  </>
}

export default function Landing() {
  const [opened, setOpened] = useState(false)
  const [musicOn, setMusicOn] = useState(false)
  const [selectedMemory, setSelectedMemory] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [finalOpen, setFinalOpen] = useState(false)
  const [checkedDreams, setCheckedDreams] = useLocalStorage<Record<string, boolean>>(STORAGE_KEYS.BUCKET_CHECKED, {})
  const [quizStep, setQuizStep] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [quizDone, setQuizDone] = useState(false)
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { fireCelebration } = useConfetti()
  useEffect(() => { if (opened && musicOn) void audioRef.current?.play().catch(() => setMusicOn(false)) }, [opened, musicOn])
  const openStory = () => { setOpened(true); setMusicOn(true); window.setTimeout(() => document.getElementById('birthday')?.scrollIntoView({ behavior: 'smooth' }), 500) }
  const toggleMusic = () => { if (musicOn) audioRef.current?.pause(); setMusicOn((value) => !value) }
  const revealFinal = () => { setFinalOpen(true); fireCelebration() }
  const replay = () => { setOpened(false); setFinalOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const toggleDream = (id: string) => setCheckedDreams({ ...checkedDreams, [id]: !checkedDreams[id] })
  const answerQuiz = (answer: number) => { const isCorrect = answer === quizQuestions[quizStep].correctIndex; if (!isCorrect) { setQuizFeedback('wrong'); return } const nextScore = quizScore + 1; setQuizScore(nextScore); setQuizFeedback('correct'); window.setTimeout(() => { setQuizFeedback(null); if (quizStep === quizQuestions.length - 1) setQuizDone(true); else setQuizStep(quizStep + 1) }, 900) }
  const resetQuiz = () => { setQuizStep(0); setQuizScore(0); setQuizDone(false); setQuizFeedback(null) }

  return <div className="love-story">
    <audio ref={audioRef} src="/audio/romantic-bg_1.mp3" loop />
    <FloatingHearts />
    {opened && <button className="music-control" onClick={toggleMusic} aria-label={musicOn ? 'Mute music' : 'Play music'}>{musicOn ? <Volume2 size={18} /> : <VolumeX size={18} />}<span>{musicOn ? 'Music on' : 'Music off'}</span></button>}
    <AnimatePresence>{!opened && <motion.section className="story-opening" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.04 }}>
      <div className="opening-sun" aria-hidden="true" /><RomanticCanvasCard /><div className="opening-copy"><Kicker>A birthday love letter, in chapters</Kicker><h1>Swati... I made something special for you <span>♥</span></h1><p className="opening-subtitle">Before you start... promise me you&apos;ll go through this till the very end.</p><StoryButton onClick={openStory}>Open Your Surprise <Heart size={16} fill="currentColor" /></StoryButton><p className="opening-signature">With all my love, Satish</p></div><div className="opening-note" aria-hidden="true"><span>07</span><small>SEP</small><span>26</span></div>
    </motion.section>}</AnimatePresence>
    {opened && <main>
      <section id="birthday" className="story-hero story-section"><div className="hero-orbit" aria-hidden="true"><span>♥</span><span>✦</span><span>♥</span></div><Kicker>Chapter one / your day</Kicker><motion.h2 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>Happy Birthday,<br /><em>My Love</em> <span>♥</span></motion.h2><p className="hero-subtitle">To the woman who made my ordinary life extraordinary.</p><div className="cake" aria-label="A birthday cake with glowing candles"><div className="flame">✦</div><div className="cake-candle" /><div className="cake-top" /><div className="cake-body" /><div className="cake-plate" /></div><div className="hero-letter"><p>Swati, you are the person who turned a life into a home. I am endlessly grateful for every day I get to call you my best friend, my partner, and my family.</p><p>Life feels softer, brighter and more possible because you are beside me. I do not just love the big celebrations. I love the sleepy conversations, the shared glances, the little routines and every unremarkable moment that becomes precious because it is ours.</p><p>Here is to every memory we have made, and every one still waiting for us.</p><p className="signature">Always yours,<br />Satish</p></div><a className="scroll-cue" href="#story">Begin our story <ArrowDown size={15} /></a></section>
      <section id="story" className="story-section story-paper"><div className="story-heading"><Kicker>Chapter two / then and now</Kicker><h2>Our Story</h2><p>Five years, a thousand small moments, and one favourite person.</p></div><div className="memory-layout"><div className="memory-list">{memories.map((memory, index) => <button className={`memory-tab${selectedMemory === index ? ' active' : ''}`} key={memory.title} onClick={() => setSelectedMemory(index)}><span>0{index + 1}</span><strong>{memory.title}</strong><small>{memory.date}</small></button>)}</div><AnimatePresence mode="wait"><motion.article className="memory-feature" key={selectedMemory} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: .35 }}><img src={memories[selectedMemory].image} alt={memories[selectedMemory].title} /><div className="memory-feature-copy"><p className="memory-date">{memories[selectedMemory].date}</p><h3>{memories[selectedMemory].title}</h3><p>{memories[selectedMemory].caption}</p><small>{memories[selectedMemory].detail}</small></div></motion.article></AnimatePresence></div></section>
      <section className="story-section gallery-section"><div className="story-heading"><Kicker>Chapter three / kept forever</Kicker><h2>Memory Gallery</h2><p>Some moments become memories. Some memories become treasures.</p></div><div className="photo-grid">{gallery.map((photo, index) => <motion.button whileHover={{ y: -8 }} className={`photo-tile tile-${index + 1}`} key={photo.image} onClick={() => setLightbox(index)}><img src={photo.image} alt={photo.caption} /><span>{photo.caption}</span></motion.button>)}</div></section>
      <section className="story-section reasons-section"><div className="story-heading"><Kicker>Chapter four / the details</Kicker><h2>Things I Love<br /><em>About You</em></h2><p>Not just the grand gestures. The details that make you, you.</p></div><div className="reasons-grid">{reasons.map(([title, copy], index) => <motion.article className="reason-card" key={title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }} transition={{ delay: index * .04 }}><span className="reason-number">{String(index + 1).padStart(2, '0')}</span><Heart size={17} fill="currentColor" /><h3>{title}</h3><p>{copy}</p></motion.article>)}</div></section>
      <section className="story-section eyes-section"><div className="eyes-line" /><Kicker>Chapter five / if I could give you anything</Kicker><blockquote>&ldquo;I wouldn&apos;t give you diamonds or anything expensive. I&apos;d give you the ability to see yourself through my eyes... so you could see just how beautiful, precious and irreplaceable you are to me.&rdquo;</blockquote><div className="reveal-promise"><p>And if I could ask for one thing...</p><h2>Let me keep making you smile<br />for the rest of our lives. <span>♥</span></h2></div></section>
      <section className="story-section future-section"><div className="future-copy"><Kicker>Chapter six / still ahead</Kicker><h2>Our best chapters<br /><em>are still waiting</em><br />to be written...</h2><p>More trips with no perfect itinerary. More laughter until our stomachs hurt. More celebrations, photographs, silly arguments and making up. More peaceful evenings where being together is enough.</p><p>More growing old side by side. More choosing each other. More of us building our little world, one ordinary and beautiful day at a time.</p></div><div className="future-stamp"><span>To<br />infinity</span><strong>∞</strong><small>and always</small></div></section>
      <section className="story-section letter-section"><div className="letter-paper"><Kicker>Chapter seven / from my heart</Kicker><h2>A Letter For<br /><em>My Wife</em></h2><p>My dearest Swati,</p><p>Happy birthday to the woman who has made my world feel like the safest and most beautiful place to return to.</p><p>Sometimes I think about the person I was before you, and I cannot quite remember how that life felt. You have become part of the way I see mornings, plans, problems, celebrations and the future. You are in the little things: the stories I save to tell you, the first person I look for in a crowded room, the comfort of knowing that no matter how the day went, I get to come home to you.</p><p>I may not say it every day, and I may not always express it perfectly... but you mean more to me than I can put into words. Thank you for being my best friend, my partner in every adventure, and my family in the truest sense.</p><p>I hope this year gives you back some of the love you give so freely. There is still so much life ahead of us, and I want to fill it with places we have not seen, photographs we have not taken, jokes we have not told and the peaceful kind of happiness that only grows with time.</p><p>Happy Birthday, Swati. <span>♥</span></p><p className="signature">Always yours,<br />Satish</p></div></section>
      <section className={`final-section${finalOpen ? ' final-open' : ''}`}><AnimatePresence mode="wait">{!finalOpen ? <motion.div key="locked" className="final-lock" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><LockKeyhole size={26} /><Kicker>The final chapter</Kicker><h2>One Last Surprise...</h2><p>You made it all the way here, my love.</p><StoryButton onClick={revealFinal}>I&apos;m Ready <Heart size={16} fill="currentColor" /></StoryButton></motion.div> : <motion.div key="revealed" className="final-message" initial={{ opacity: 0, scale: .92 }} animate={{ opacity: 1, scale: 1 }}><div className="final-sparkle">✦</div><h2>If I had to choose you<br />all over again...<br /><em>I&apos;d still choose you.</em></h2><p>Every single time. <span>♥</span></p><div className="final-divider" /><h3>Happy Birthday, My Love.</h3><p className="final-small">Here&apos;s to you.<br />Here&apos;s to us.<br />And here&apos;s to all the beautiful memories we haven&apos;t made yet.</p><StoryButton muted onClick={replay}><RotateCcw size={15} /> Replay Our Story</StoryButton></motion.div>}</AnimatePresence></section>
      <StoryExtras checkedDreams={checkedDreams} toggleDream={toggleDream} quizStep={quizStep} quizScore={quizScore} quizDone={quizDone} quizFeedback={quizFeedback} answerQuiz={answerQuiz} resetQuiz={resetQuiz} />
    </main>}
    <AnimatePresence>{lightbox !== null && <motion.div className="story-lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true"><button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close photo"><X /></button><button className="lightbox-arrow left" onClick={() => setLightbox((lightbox + gallery.length - 1) % gallery.length)} aria-label="Previous photo"><ChevronLeft /></button><motion.img key={lightbox} initial={{ scale: .88 }} animate={{ scale: 1 }} src={gallery[lightbox].image} alt={gallery[lightbox].caption} /><button className="lightbox-arrow right" onClick={() => setLightbox((lightbox + 1) % gallery.length)} aria-label="Next photo"><ChevronRight /></button><p>{gallery[lightbox].caption}</p></motion.div>}</AnimatePresence>
  </div>
}
