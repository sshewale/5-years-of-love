// ─── Navbar ────────────────────────────────────────────────────────────────
// Fixed top navigation bar with glass effect on scroll, mobile hamburger,
// active route highlighting, and dark mode toggle.

import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { DarkModeToggle } from '../DarkModeToggle'

interface NavLink {
  to: string
  label: string
}

const NAV_LINKS: NavLink[] = [
  { to: '/timeline', label: 'Timeline' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/reasons', label: 'Reasons' },
  { to: '/notes', label: 'Notes' },
  { to: '/letter', label: 'Letter' },
  { to: '/bucket', label: 'Bucket' },
  { to: '/quiz', label: 'Quiz' },
  { to: '/dreams', label: 'Dreams' },
]

export function Navbar() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState<boolean>(false)
  const [menuOpen, setMenuOpen] = useState<boolean>(false)

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const isActive = (to: string) => location.pathname === to

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{
          position: 'fixed',
          top: '3px', // sits just below the 3px ScrollProgress bar
          left: 0,
          right: 0,
          zIndex: 40,
          transition: 'background 0.3s ease, box-shadow 0.3s ease',
          ...(scrolled
            ? {
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                background: 'rgba(245,236,215,0.85)',
                boxShadow: '0 1px 16px rgba(183,110,121,0.12)',
              }
            : {
                background: 'transparent',
              }),
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 1.25rem',
            height: '3.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            aria-label="Home — Our Story"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: '1.2rem',
              color: '#B76E79',
              textDecoration: 'none',
              letterSpacing: '0.01em',
              flexShrink: 0,
            }}
          >
            ❤️ Our Story
          </Link>

          {/* Desktop links — hidden on mobile via Tailwind, flex on md+ */}
          <ul
            role="list"
            className="hidden md:flex"
            style={{
              alignItems: 'center',
              gap: '0.25rem',
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
          >
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  aria-current={isActive(to) ? 'page' : undefined}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.875rem',
                    fontWeight: isActive(to) ? 600 : 400,
                    color: isActive(to) ? '#B76E79' : '#555',
                    textDecoration: 'none',
                    padding: '0.35rem 0.6rem',
                    borderRadius: '4px',
                    position: 'relative',
                    transition: 'color 0.2s',
                  }}
                >
                  {label}
                  {isActive(to) && (
                    <motion.span
                      layoutId="nav-underline"
                      style={{
                        position: 'absolute',
                        bottom: '-2px',
                        left: '0.6rem',
                        right: '0.6rem',
                        height: '2px',
                        background: '#B76E79',
                        borderRadius: '1px',
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side: dark mode toggle + hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <DarkModeToggle />

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="md:hidden"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#B76E79',
                padding: '0.25rem',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="mobile-menu"
              role="menu"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{
                overflow: 'hidden',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                background: 'rgba(245,236,215,0.96)',
                borderTop: '1px solid rgba(183,110,121,0.15)',
              }}
            >
              <ul
                role="list"
                style={{
                  listStyle: 'none',
                  margin: 0,
                  padding: '0.75rem 1.25rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                }}
              >
                {NAV_LINKS.map(({ to, label }) => (
                  <li key={to} role="menuitem">
                    <Link
                      to={to}
                      aria-current={isActive(to) ? 'page' : undefined}
                      style={{
                        display: 'block',
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '1rem',
                        fontWeight: isActive(to) ? 600 : 400,
                        color: isActive(to) ? '#B76E79' : '#444',
                        textDecoration: 'none',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '6px',
                        background: isActive(to) ? 'rgba(183,110,121,0.1)' : 'transparent',
                        borderLeft: isActive(to) ? '3px solid #B76E79' : '3px solid transparent',
                        transition: 'background 0.2s, border-color 0.2s',
                      }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer so content doesn't hide under navbar */}
      <div style={{ height: '3.85rem' }} aria-hidden="true" />
    </>
  )
}
