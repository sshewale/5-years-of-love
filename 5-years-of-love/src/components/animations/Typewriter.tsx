// ─── Typewriter.tsx — Animated typewriter effect ─────────────────────────────
import { useState, useEffect, useRef } from 'react'

interface TypewriterProps {
  text: string | string[]
  speed?: number           // ms per character (default 80)
  className?: string
  onComplete?: () => void
}

export default function Typewriter({
  text,
  speed = 80,
  className = '',
  onComplete,
}: TypewriterProps) {
  const texts = Array.isArray(text) ? text : [text]

  const [displayedText, setDisplayedText] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  // Typing effect
  useEffect(() => {
    if (isDone) return

    const currentPhrase = texts[phraseIndex]

    if (charIndex < currentPhrase.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + currentPhrase[charIndex])
        setCharIndex((prev) => prev + 1)
      }, speed)
      return () => clearTimeout(timer)
    }

    // Finished typing current phrase
    if (phraseIndex < texts.length - 1) {
      // Pause before next phrase
      const pauseTimer = setTimeout(() => {
        setDisplayedText('')
        setCharIndex(0)
        setPhraseIndex((prev) => prev + 1)
      }, 900)
      return () => clearTimeout(pauseTimer)
    }

    // All phrases done
    setIsDone(true)
    onCompleteRef.current?.()
  }, [charIndex, phraseIndex, isDone, speed, texts])

  // Blinking cursor — stop blinking once done
  useEffect(() => {
    if (isDone) {
      setShowCursor(false)
      return
    }
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 530)
    return () => clearInterval(cursorTimer)
  }, [isDone])

  return (
    <span className={className} aria-live="polite" aria-atomic="true">
      {displayedText}
      {!isDone && (
        <span
          aria-hidden="true"
          style={{
            opacity: showCursor ? 1 : 0,
            transition: 'opacity 0.1s',
            marginLeft: 1,
            fontWeight: 300,
          }}
        >
          |
        </span>
      )}
    </span>
  )
}
