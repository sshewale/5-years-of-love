import { lazy, Suspense, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { EasterEggProvider } from './components/EasterEgg'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { JourneyNav } from './components/layout/JourneyNav'
import { ScrollProgress } from './components/layout/ScrollProgress'
import { BackToTop } from './components/layout/BackToTop'
import { MusicPlayer } from './components/MusicPlayer'
import { LoadingScreen } from './components/LoadingScreen'
import { useDarkMode } from './hooks/useDarkMode'
import { BIRTHDAY_CONFIG } from './utils/constants'

const Landing                = lazy(() => import('./pages/Landing'))
const Timeline               = lazy(() => import('./pages/Timeline'))
const Gallery                = lazy(() => import('./pages/Gallery'))
const ReasonsILoveYou        = lazy(() => import('./pages/ReasonsILoveYou'))
const LoveNotes              = lazy(() => import('./pages/LoveNotes'))
const Letter                 = lazy(() => import('./pages/Letter'))
const BucketList             = lazy(() => import('./pages/BucketList'))
const Quiz                   = lazy(() => import('./pages/Quiz'))
const FutureDreams           = lazy(() => import('./pages/FutureDreams'))
const Celebration            = lazy(() => import('./pages/Celebration'))
const SurpriseCountdownPage  = lazy(() => import('./pages/SurpriseCountdownPage'))
const SecretSurprise         = lazy(() => import('./pages/SecretSurprise'))
const ForeverPromise         = lazy(() => import('./pages/ForeverPromise'))
const InsideJokes            = lazy(() => import('./pages/InsideJokes'))
const AdminPanel             = lazy(() => import('./pages/admin/AdminPanel'))

const CINEMATIC_ROUTES = ['/celebration', '/countdown', '/surprise', '/forever']

// ── Birthday auto-detection ───────────────────────────────────────────────────
// If Swati opens the site on her actual birthday (Sept 7 IST), redirect straight
// to the celebration page instead of showing the countdown.
function useBirthdayRedirect() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    if (pathname !== '/') return
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: BIRTHDAY_CONFIG.timezone }))
    if (now.getDate() === BIRTHDAY_CONFIG.day && now.getMonth() + 1 === BIRTHDAY_CONFIG.month) {
      navigate('/celebration', { replace: true })
    }
  }, [navigate, pathname])
}

// ── Page loader ───────────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--color-beige-warm)' }}
      role="status"
      aria-label="Loading page"
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-12 h-12 rounded-full border-4 border-[#FFD6E0] border-t-[#B76E79] animate-spin"
          aria-hidden="true"
        />
        <p className="text-[#B76E79]/60 text-sm italic" style={{ fontFamily: "'Dancing Script', cursive" }}>
          Just a moment…
        </p>
      </div>
    </div>
  )
}

// ── Animated routes ───────────────────────────────────────────────────────────
function AnimatedRoutes() {
  const location = useLocation()
  const isCinematic = CINEMATIC_ROUTES.some(r => location.pathname.startsWith(r))
  useBirthdayRedirect()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: isCinematic ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: isCinematic ? 0 : -12 }}
        transition={{ duration: isCinematic ? 0.6 : 0.3, ease: 'easeInOut' }}
      >
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes location={location}>
              <Route path="/"            element={<Landing />} />
              <Route path="/timeline"    element={<Timeline />} />
              <Route path="/gallery"     element={<Gallery />} />
              <Route path="/reasons"     element={<ReasonsILoveYou />} />
              <Route path="/notes"       element={<LoveNotes />} />
              <Route path="/letter"      element={<Letter />} />
              <Route path="/bucket"      element={<BucketList />} />
              <Route path="/quiz"        element={<Quiz />} />
              <Route path="/dreams"      element={<FutureDreams />} />
              <Route path="/celebration" element={<Celebration />} />
              <Route path="/countdown"   element={<SurpriseCountdownPage />} />
              <Route path="/surprise"    element={<SecretSurprise />} />
              <Route path="/forever"     element={<ForeverPromise />} />
              <Route path="/jokes"       element={<InsideJokes />} />
              <Route path="/easter"      element={<EasterPage />} />
              <Route path="/admin"       element={<AdminPanel />} />
              <Route path="*"            element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </motion.div>
    </AnimatePresence>
  )
}

// ── Easter egg page ───────────────────────────────────────────────────────────
function EasterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#1A1A2E' }}>
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 12 }}
      >
        <div className="text-8xl mb-6">🥚</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#B76E79', fontSize: '3rem' }}>
          You found the Easter Egg!
        </h1>
        <p style={{ color: '#FFD6E0', fontFamily: "'Dancing Script', cursive", fontSize: '1.5rem', marginTop: '1rem' }}>
          Swati, you are as curious as you are beautiful ❤️
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-4xl">
          {['S','W','A','T','I','❤️'].map((c, i) => (
            <motion.span
              key={i}
              style={{ color: '#FFD700', display: 'inline-block' }}
              animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.15 }}
            >
              {c}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// ── 404 page ──────────────────────────────────────────────────────────────────
function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ backgroundColor: '#F5ECD7' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-6"
      >
        <div className="text-7xl" aria-hidden="true">🗺️</div>
        <h1
          className="text-4xl font-bold"
          style={{ fontFamily: "'Playfair Display', serif", color: '#B76E79' }}
        >
          You got a little lost
        </h1>
        <p
          className="text-base max-w-sm"
          style={{ color: '#78716c', fontFamily: "'Inter', sans-serif", lineHeight: 1.7 }}
        >
          This page doesn't exist — but our story does. Let's get you back to it.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 rounded-2xl font-medium text-white transition-transform hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #B76E79, #a55f6a)',
            fontFamily: "'Inter', sans-serif",
            boxShadow: '0 4px 16px rgba(183,110,121,0.35)',
          }}
        >
          Back to Our Story ❤️
        </button>
      </motion.div>
    </div>
  )
}

// ── App shell ─────────────────────────────────────────────────────────────────
function Shell() {
  const location = useLocation()
  const { isDark } = useDarkMode()
  const isCinematic = CINEMATIC_ROUTES.some(r => location.pathname.startsWith(r))
  const isAdmin = location.pathname === '/admin'
  const isLoveStory = location.pathname === '/'

  return (
    <div data-theme={isDark ? 'dark' : undefined} style={{ minHeight: '100vh' }}>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <ScrollProgress />
      {!isCinematic && !isAdmin && !isLoveStory && <Navbar />}
      <main id="main-content">
        <AnimatedRoutes />
      </main>
      {!isCinematic && !isAdmin && !isLoveStory && <JourneyNav />}
      {!isCinematic && !isAdmin && !isLoveStory && <Footer />}
      {!isLoveStory && <MusicPlayer />}
      {!isLoveStory && <BackToTop />}
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [loading, setLoading] = useState(true)

  return (
    <EasterEggProvider>
      <BrowserRouter>
        <AnimatePresence>
          {loading && <LoadingScreen key="loader" onComplete={() => setLoading(false)} />}
        </AnimatePresence>
        {!loading && <Shell />}
      </BrowserRouter>
    </EasterEggProvider>
  )
}
