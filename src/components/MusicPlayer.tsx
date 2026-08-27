// ─── MusicPlayer ───────────────────────────────────────────────────────────
// Fixed bottom-right floating music widget.
// Collapsed: small circle with music note icon + rose-gold pulsing ring when playing.
// Expanded: song title, play/pause, volume slider, equalizer bars.
// IMPORTANT: autoplay is DISABLED — music only starts on explicit user click.
// Persists isPlaying state in localStorage key 'swati_music_playing'.

import { useState, useEffect, useRef, useCallback, type ChangeEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, Play, Pause, Volume2, VolumeX, X, MicOff } from 'lucide-react'
import { setStorageItem } from '../utils/storage'

const MUSIC_PLAYING_KEY = 'swati_music_playing'
const AUDIO_SRC = '/audio/romantic-bg.mp3'
const SONG_TITLE = 'Romantic Melody ♪'

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [volume, setVolume] = useState<number>(0.6)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [audioError, setAudioError] = useState<boolean>(false)

  // Initialise audio element once
  useEffect(() => {
    const audio = new Audio(AUDIO_SRC)
    audio.loop = true
    audio.volume = volume
    audioRef.current = audio

    // Detect load errors (missing file, network failure, unsupported codec)
    const handleError = () => {
      setAudioError(true)
      setIsPlaying(false)
    }
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('error', handleError)
      audio.pause()
      audio.src = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync audio element with isPlaying state
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || audioError) return

    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false)
      })
    } else {
      audio.pause()
    }

    setStorageItem<boolean>(MUSIC_PLAYING_KEY, isPlaying)
  }, [isPlaying, audioError])

  // Sync volume (and mute) with audio element
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = isMuted ? 0 : volume
  }, [volume, isMuted])

  const togglePlay = useCallback(() => {
    if (audioError) return
    setIsPlaying((prev) => !prev)
  }, [audioError])

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev)
  }, [])

  const handleVolumeChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    if (isMuted && v > 0) setIsMuted(false)
  }, [isMuted])

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.25rem',
        right: '1.25rem',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '0.5rem',
      }}
    >
      {/* Expanded panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key="music-panel"
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 12 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            role="region"
            aria-label="Music player"
            style={{
              background: 'rgba(245,236,215,0.97)',
              border: '1px solid rgba(183,110,121,0.3)',
              borderRadius: '16px',
              padding: '1rem 1.25rem',
              boxShadow: '0 8px 28px rgba(183,110,121,0.2)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              minWidth: '220px',
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.85rem',
              }}
            >
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: audioError ? '#ef4444' : '#B76E79',
                  maxWidth: '140px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {audioError ? 'Music unavailable' : SONG_TITLE}
              </span>
              <button
                onClick={toggleExpanded}
                aria-label="Collapse music player"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#999',
                  padding: '2px',
                  display: 'flex',
                }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Error state */}
            {audioError ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '0.75rem 0',
                  color: '#B76E7999',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.78rem',
                  lineHeight: 1.5,
                }}
                role="alert"
              >
                <MicOff size={22} style={{ margin: '0 auto 0.5rem', color: '#B76E7960' }} />
                Add a romantic MP3 to{' '}
                <code style={{ fontSize: '0.72rem', background: '#FFD6E030', padding: '1px 4px', borderRadius: 4 }}>
                  public/audio/
                </code>
              </div>
            ) : (
              <>
                {/* Equalizer bars — only animate when playing */}
                <div
                  aria-hidden="true"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '3px',
                    height: '20px',
                    marginBottom: '1rem',
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="eq-bar"
                      style={{
                        animationPlayState: isPlaying ? 'running' : 'paused',
                        height: isPlaying ? undefined : '4px',
                      }}
                    />
                  ))}
                </div>

                {/* Play / Pause button */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <button
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pause music' : 'Play music'}
                    style={{
                      background: '#B76E79',
                      border: 'none',
                      borderRadius: '50%',
                      width: '2.5rem',
                      height: '2.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#fff',
                      boxShadow: '0 2px 10px rgba(183,110,121,0.4)',
                      transition: 'transform 0.15s',
                    }}
                  >
                    {isPlaying ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" />}
                  </button>
                </div>

                {/* Volume row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#B76E79',
                      display: 'flex',
                      padding: '2px',
                      flexShrink: 0,
                    }}
                  >
                    {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    aria-label="Volume"
                    style={{ flex: 1, accentColor: '#B76E79', cursor: 'pointer' }}
                  />
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed circle button — always visible */}
      <motion.button
        onClick={toggleExpanded}
        aria-label={isExpanded ? 'Collapse music player' : 'Open music player'}
        aria-expanded={isExpanded}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        style={{
          position: 'relative',
          width: '3.25rem',
          height: '3.25rem',
          borderRadius: '50%',
          background: audioError ? '#ccc' : '#B76E79',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: audioError ? 'none' : '0 4px 16px rgba(183,110,121,0.4)',
          flexShrink: 0,
        }}
      >
        {/* Pulsing ring when playing */}
        {isPlaying && !audioError && (
          <motion.span
            aria-hidden="true"
            animate={{ scale: [1, 1.55], opacity: [0.6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '2px solid #B76E79',
            }}
          />
        )}
        {audioError ? <MicOff size={20} /> : <Music size={20} />}
      </motion.button>
    </div>
  )
}
