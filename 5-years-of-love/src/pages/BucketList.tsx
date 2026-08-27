// ─── BucketList.tsx — Couple bucket list with progress bar + confetti ────────
import { useState, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, PlusCircle, Sparkles, Heart } from 'lucide-react'
import { bucketList } from '../data/bucketList'
import type { BucketItem } from '../types'
import { STORAGE_KEYS } from '../utils/constants'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useConfetti } from '../hooks/useConfetti'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'

// ── Types ─────────────────────────────────────────────────────────────────────
type CheckedState = Record<string, boolean>
type CustomItem = { id: string; label: string; emoji: string }

// ── Individual bucket list item ───────────────────────────────────────────────
interface BucketItemRowProps {
  item: BucketItem | CustomItem
  checked: boolean
  onToggle: (id: string) => void
  delay?: number
}

function BucketItemRow({ item, checked, onToggle, delay = 0 }: BucketItemRowProps) {
  const { ref, inView } = useScrollAnimation(0.1)
  const checkboxId = `bucket-${item.id}`

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      <GlassCard
        className={[
          'flex items-center gap-4 px-5 py-4 cursor-pointer select-none',
          'transition-all duration-300',
          checked ? 'opacity-60' : 'opacity-100',
        ].join(' ')}
      >
        {/* Custom checkbox */}
        <button
          id={checkboxId}
          type="button"
          role="checkbox"
          aria-checked={checked}
          aria-label={`Mark "${item.label}" as ${checked ? 'incomplete' : 'complete'}`}
          onClick={() => onToggle(item.id)}
          className={[
            'flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center',
            'transition-all duration-300 focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-[#B76E79] focus-visible:ring-offset-2',
            checked
              ? 'bg-[#B76E79] border-[#B76E79]'
              : 'border-[#B76E79]/50 bg-white/40 hover:border-[#B76E79] hover:bg-[#FFD6E0]/30',
          ].join(' ')}
        >
          <AnimatePresence>
            {checked && (
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Check size={14} color="white" strokeWidth={3} aria-hidden="true" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Emoji — bounces when checked */}
        <motion.span
          className="text-2xl flex-shrink-0"
          aria-hidden="true"
          animate={checked ? { rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.4, 1.1, 1.2, 1] } : {}}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
        >
          {item.emoji}
        </motion.span>

        {/* Label */}
        <label
          htmlFor={checkboxId}
          className={[
            'flex-1 text-base leading-snug cursor-pointer transition-all duration-300',
            checked
              ? 'line-through text-gray-400'
              : 'text-gray-700',
          ].join(' ')}
          style={{ fontFamily: "'Inter', sans-serif" }}
          onClick={() => onToggle(item.id)}
        >
          {item.label}
        </label>

        {/* Checkmark badge when done */}
        <AnimatePresence>
          {checked && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="flex-shrink-0 text-lg"
              aria-hidden="true"
            >
              ✓
            </motion.span>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  )
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({
  completed,
  total,
}: {
  completed: number
  total: number
}) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div
      className="mb-10"
      role="progressbar"
      aria-valuenow={completed}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`${completed} of ${total} bucket list items completed`}
    >
      <div className="flex justify-between items-end mb-3">
        <p
          className="text-lg font-semibold"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: '#B76E79',
          }}
        >
          {completed} of {total} dreams checked off ❤️
        </p>
        <span
          className="text-sm font-medium"
          style={{ color: '#B76E7999' }}
        >
          {pct}%
        </span>
      </div>

      {/* Track */}
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: '10px', backgroundColor: '#FFD6E060' }}
      >
        {/* Animated fill */}
        <motion.div
          layout
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #B76E79, #FFD6E0)',
            boxShadow: '0 0 8px #B76E7966',
          }}
          initial={{ width: '0%' }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      {/* Milestone celebration */}
      <AnimatePresence mode="wait">
        {pct === 100 ? (
          <motion.p
            key="100"
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-center text-sm font-medium"
            style={{ color: '#B76E79' }}
          >
            🎉 You've done it all together! That's love. 💕
          </motion.p>
        ) : pct >= 75 ? (
          <motion.p
            key="75"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-center text-sm"
            style={{ color: '#B76E79', fontStyle: 'italic' }}
          >
            So close! The best adventures are still ahead ✨
          </motion.p>
        ) : pct >= 50 ? (
          <motion.p
            key="50"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-center text-sm"
            style={{ color: '#B76E79', fontStyle: 'italic' }}
          >
            Halfway there! Look how far you've come together 💕
          </motion.p>
        ) : pct >= 25 ? (
          <motion.p
            key="25"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-center text-sm"
            style={{ color: '#B76E79', fontStyle: 'italic' }}
          >
            Great start! Every dream begins with a single step 🌟
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

// ── Add custom item input ─────────────────────────────────────────────────────
function AddItemInput({
  onAdd,
}: {
  onAdd: (label: string) => void
}) {
  const [value, setValue] = useState('')
  const inputId = useId()

  const handleAdd = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setValue('')
  }

  return (
    <GlassCard className="p-5 mt-10">
      <p
        className="text-base font-semibold mb-3 flex items-center gap-2"
        style={{
          fontFamily: "'Playfair Display', serif",
          color: '#B76E79',
        }}
      >
        <Sparkles size={18} aria-hidden="true" />
        Add to our list
      </p>
      <div className="flex gap-3">
        <label htmlFor={inputId} className="sr-only">
          New bucket list item
        </label>
        <input
          id={inputId}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAdd()
          }}
          placeholder="Write a dream for the two of us…"
          maxLength={120}
          className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none border"
          style={{
            backgroundColor: 'rgba(255,255,255,0.6)',
            borderColor: '#B76E7940',
            color: '#3d2c2c',
            fontFamily: "'Inter', sans-serif",
          }}
          aria-label="New bucket list item text"
        />
        <Button
          variant="primary"
          size="sm"
          onClick={handleAdd}
          disabled={!value.trim()}
          ariaLabel="Add new bucket list item"
        >
          <PlusCircle size={16} aria-hidden="true" />
          Add
        </Button>
      </div>
    </GlassCard>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function BucketList() {
  // Base items: admin-edited list (from the Admin Panel) falls back to the
  // bundled defaults. NOTE: this uses a dedicated key (BUCKET_CHECKED) for the
  // per-user "checked" state so it never collides with the admin-editable
  // item list stored under STORAGE_KEYS.BUCKET_LIST.
  const [baseItems] = useLocalStorage<BucketItem[]>(
    STORAGE_KEYS.BUCKET_LIST,
    bucketList,
  )

  // Checked state persisted in localStorage (separate key from the item list)
  const [checkedState, setCheckedState] = useLocalStorage<CheckedState>(
    STORAGE_KEYS.BUCKET_CHECKED,
    {},
  )

  // Custom user-added items
  const [customItems, setCustomItems] = useLocalStorage<CustomItem[]>(
    STORAGE_KEYS.BUCKET_CUSTOM,
    [],
  )

  const { fireBurst } = useConfetti()
  const { ref: headerRef, inView: headerInView } = useScrollAnimation(0.1)

  // Merge admin-edited (or default) + custom items
  const allItems: (BucketItem | CustomItem)[] = [
    ...baseItems,
    ...customItems,
  ]

  const completedCount = allItems.filter((item) => checkedState[item.id]).length

  const handleToggle = (id: string) => {
    const wasChecked = checkedState[id] ?? false
    const newState = { ...checkedState, [id]: !wasChecked }
    setCheckedState(newState)

    // Fire micro confetti only when checking (not unchecking)
    if (!wasChecked) {
      // Small localised confetti burst
      void import('canvas-confetti').then(({ default: confetti }) => {
        void confetti({
          particleCount: 40,
          spread: 50,
          origin: { x: 0.5, y: 0.6 },
          colors: ['#B76E79', '#FFD6E0', '#E8D5F5'],
          scalar: 0.9,
          gravity: 1.1,
          ticks: 150,
        })
      })

      // Also fire hearts if all done
      const newCompleted = Object.values(newState).filter(Boolean).length
      if (newCompleted === allItems.length) {
        setTimeout(() => fireBurst(), 400)
      }
    }
  }

  const handleAddItem = (label: string) => {
    const newItem: CustomItem = {
      id: `custom_${Date.now()}`,
      label,
      emoji: '✨',
    }
    setCustomItems([...customItems, newItem])
  }

  return (
    <main
      className="min-h-screen py-16 px-4"
      style={{ backgroundColor: '#F5ECD7' }}
      aria-label="Couple bucket list"
    >
      {/* Decorative background */}
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, #FFD6E030 0%, transparent 50%), radial-gradient(circle at 80% 20%, #E8D5F530 0%, transparent 40%)',
          zIndex: 0,
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: -20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
          role="banner"
        >
          <div
            className="flex items-center justify-center gap-2 mb-3"
            aria-hidden="true"
          >
            <Heart
              size={20}
              style={{ color: '#B76E79' }}
              fill="#B76E79"
            />
            <span
              className="text-sm font-medium tracking-widest uppercase"
              style={{ color: '#B76E79' }}
            >
              Our Adventures Together
            </span>
            <Heart
              size={20}
              style={{ color: '#B76E79' }}
              fill="#B76E79"
            />
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-sm"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: '#3d2c2c',
              lineHeight: 1.2,
            }}
          >
            Our Bucket List 🌍
          </h1>
          <p
            className="text-base"
            style={{ color: '#78716c', fontFamily: "'Inter', sans-serif" }}
          >
            Dreams we&apos;re chasing, adventures we&apos;re saving, moments we&apos;re making —
            together.
          </p>
        </motion.div>

        {/* Progress bar */}
        <ProgressBar completed={completedCount} total={allItems.length} />

        {/* Bucket list items */}
        <section
          className="flex flex-col gap-3"
          aria-label="Bucket list items"
        >
          {allItems.map((item, index) => (
            <BucketItemRow
              key={item.id}
              item={item}
              checked={checkedState[item.id] ?? false}
              onToggle={handleToggle}
              delay={index * 0.05}
            />
          ))}
        </section>

        {/* Add custom item */}
        <AddItemInput onAdd={handleAddItem} />

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center text-sm mt-8"
          style={{ color: '#B76E7999', fontFamily: "'Dancing Script', cursive", fontSize: '1rem' }}
        >
          Every dream checked off is a memory made. Keep going. ❤️
        </motion.p>
      </div>
    </main>
  )
}
