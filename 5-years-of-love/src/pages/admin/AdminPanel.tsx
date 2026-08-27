// ─── AdminPanel.tsx — Hidden admin panel at /admin ────────────────────────────
// All tabs fully implemented. Access at /admin — not linked in main UI.
import { useState, useEffect, useRef, useCallback, type ChangeEvent, type ReactNode } from 'react'
import { STORAGE_KEYS } from '../../utils/constants'
import { getStorageItem, setStorageItem } from '../../utils/storage'
import { timelineEvents as defaultTimeline } from '../../data/timeline'
import { loveNotes as defaultNotes } from '../../data/loveNotes'
import { reasons as defaultReasons } from '../../data/reasons'
import { birthdayMessages as defaultBirthdayMsgs } from '../../data/birthdayMessages'
import { insideJokes as defaultInsideJokes } from '../../data/insideJokes'
import { surpriseCountdownMsgs as defaultCountdownMsgs } from '../../data/surpriseCountdownMsgs'
import { bucketList as defaultBucketList } from '../../data/bucketList'
import type { TimelineEvent, GalleryPhoto, LoveNote, BucketItem, BirthdayMessages, InsideJoke } from '../../types'
import type { LoveReason } from '../../data/reasons'
import Modal from '../../components/ui/Modal'

// ── Shared styles ─────────────────────────────────────────────────────────────
const INPUT_CLS =
  'w-full px-3 py-2 rounded-xl border border-[#B76E79]/30 bg-white text-sm text-[#1A1A2E] outline-none focus:ring-2 focus:ring-[#B76E79]/50 transition-all'
const TEXTAREA_CLS =
  'w-full px-3 py-2 rounded-xl border border-[#B76E79]/30 bg-white text-sm text-[#1A1A2E] outline-none focus:ring-2 focus:ring-[#B76E79]/50 transition-all resize-y'
const LABEL_CLS = 'block text-xs font-semibold text-[#B76E79] mb-1 uppercase tracking-wide'
const SAVE_BTN =
  'px-4 py-2 bg-[#B76E79] text-white rounded-xl text-sm font-semibold hover:bg-[#a55f6a] active:scale-[0.97] transition-all'
const DELETE_BTN =
  'px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-200 active:scale-[0.97] transition-all'
const ADD_BTN =
  'px-4 py-2 bg-[#FFD6E0] text-[#B76E79] rounded-xl text-sm font-semibold hover:bg-[#ffc0cf] active:scale-[0.97] transition-all'
const PILL_ACTIVE = 'px-3 py-1 rounded-full text-xs font-semibold bg-[#B76E79] text-white cursor-pointer'
const PILL_INACTIVE = 'px-3 py-1 rounded-full text-xs font-semibold bg-[#FFD6E0] text-[#B76E79] cursor-pointer hover:bg-[#ffc0cf] transition-colors'

type TabId =
  | 'timeline'
  | 'banner'
  | 'gallery'
  | 'notes'
  | 'reasons'
  | 'birthday'
  | 'jokes'
  | 'countdown'
  | 'bucket'
  | 'import'
  | 'export'

const TABS: { id: TabId; label: string }[] = [
  { id: 'timeline', label: 'Timeline' },
  { id: 'banner', label: 'Banner' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'notes', label: 'Love Notes' },
  { id: 'reasons', label: 'Reasons' },
  { id: 'birthday', label: 'Birthday Msg' },
  { id: 'jokes', label: 'Inside Jokes' },
  { id: 'countdown', label: 'Countdown Msgs' },
  { id: 'bucket', label: 'Bucket List' },
  { id: 'import', label: 'Import' },
  { id: 'export', label: 'Export' },
]

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-lg font-bold text-[#B76E79] font-[Playfair_Display,serif] mb-4">
      {children}
    </h2>
  )
}

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <div className="fixed bottom-6 right-6 z-[9999] bg-[#B76E79] text-white px-5 py-3 rounded-2xl shadow-lg text-sm font-semibold animate-bounce">
      {msg}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: Timeline
// ══════════════════════════════════════════════════════════════════════════════
function TimelineTab({ onSaved }: { onSaved: () => void }) {
  const [events, setEvents] = useState<TimelineEvent[]>(() =>
    getStorageItem<TimelineEvent[]>(STORAGE_KEYS.TIMELINE) ?? defaultTimeline
  )
  const [editing, setEditing] = useState<TimelineEvent | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  function openEdit(ev: TimelineEvent) {
    setEditing({ ...ev })
    setIsOpen(true)
  }

  function openNew() {
    setEditing({
      id: `t${Date.now()}`,
      icon: '❤️',
      title: '',
      date: '',
      location: '',
      story: '',
      photo: '',
      video: '',
    })
    setIsOpen(true)
  }

  function handleSaveModal() {
    if (!editing) return
    const updated = events.find((e) => e.id === editing.id)
      ? events.map((e) => (e.id === editing.id ? editing : e))
      : [...events, editing]
    setEvents(updated)
    setStorageItem(STORAGE_KEYS.TIMELINE, updated)
    setIsOpen(false)
    onSaved()
  }

  function handleDelete(id: string) {
    const updated = events.filter((e) => e.id !== id)
    setEvents(updated)
    setStorageItem(STORAGE_KEYS.TIMELINE, updated)
    onSaved()
  }

  function field(key: keyof TimelineEvent, label: string, multiline = false) {
    if (!editing) return null
    const value = (editing[key] as string) ?? ''
    const onChange = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => setEditing({ ...editing, [key]: e.target.value })
    return (
      <div className="mb-4">
        <label className={LABEL_CLS}>{label}</label>
        {multiline ? (
          <textarea className={TEXTAREA_CLS} rows={4} value={value} onChange={onChange} />
        ) : (
          <input className={INPUT_CLS} value={value} onChange={onChange} />
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <SectionTitle>Timeline Events</SectionTitle>
        <button className={ADD_BTN} onClick={openNew}>+ Add New</button>
      </div>

      <div className="space-y-2">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-[#FFD6E0]"
          >
            <span className="text-xl" aria-hidden="true">{ev.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-[#1A1A2E] truncate">{ev.title}</p>
              <p className="text-xs text-gray-400 truncate">{ev.date} · {ev.location}</p>
            </div>
            <button className={ADD_BTN} onClick={() => openEdit(ev)} aria-label={`Edit ${ev.title}`}>
              Edit
            </button>
            <button className={DELETE_BTN} onClick={() => handleDelete(ev.id)} aria-label={`Delete ${ev.title}`}>
              Delete
            </button>
          </div>
        ))}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editing?.id ? 'Edit Event' : 'New Event'}>
        {field('icon', 'Icon (emoji)')}
        {field('title', 'Title')}
        {field('date', 'Date')}
        {field('location', 'Location')}
        {field('story', 'Story', true)}
        {field('photo', 'Photo URL')}
        {field('video', 'Video URL')}
        <button className={SAVE_BTN} onClick={handleSaveModal}>Save Event</button>
      </Modal>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: Gallery
// ══════════════════════════════════════════════════════════════════════════════
const GALLERY_CATEGORIES: GalleryPhoto['category'][] = [
  'selfies', 'wedding', 'trips', 'funny', 'family', 'special',
]

function GalleryTab({ onSaved }: { onSaved: () => void }) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(
    () => getStorageItem<GalleryPhoto[]>(STORAGE_KEYS.GALLERY) ?? []
  )
  const [form, setForm] = useState<Omit<GalleryPhoto, 'id'>>({
    src: '',
    alt: '',
    category: 'selfies',
    date: '',
  })

  function handleAdd() {
    if (!form.src.trim()) return
    const newPhoto: GalleryPhoto = { id: `g${Date.now()}`, ...form }
    const updated = [...photos, newPhoto]
    setPhotos(updated)
    setStorageItem(STORAGE_KEYS.GALLERY, updated)
    setForm({ src: '', alt: '', category: 'selfies', date: '' })
    onSaved()
  }

  function handleDelete(id: string) {
    const updated = photos.filter((p) => p.id !== id)
    setPhotos(updated)
    setStorageItem(STORAGE_KEYS.GALLERY, updated)
    onSaved()
  }

  return (
    <div>
      <SectionTitle>Gallery Photos</SectionTitle>

      {/* Add new photo form */}
      <div className="bg-[#FFF5F7] rounded-2xl p-5 mb-6 border border-[#FFD6E0]">
        <p className="text-sm font-semibold text-[#B76E79] mb-3">Add New Photo</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className={LABEL_CLS}>Image URL</label>
            <input
              className={INPUT_CLS}
              placeholder="https://..."
              value={form.src}
              onChange={(e) => setForm({ ...form, src: e.target.value })}
            />
          </div>
          <div>
            <label className={LABEL_CLS}>Alt Text</label>
            <input
              className={INPUT_CLS}
              placeholder="Description"
              value={form.alt}
              onChange={(e) => setForm({ ...form, alt: e.target.value })}
            />
          </div>
          <div>
            <label className={LABEL_CLS}>Category</label>
            <select
              className={INPUT_CLS}
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value as GalleryPhoto['category'] })
              }
              aria-label="Photo category"
            >
              {GALLERY_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={LABEL_CLS}>Date (optional)</label>
            <input
              className={INPUT_CLS}
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
        </div>
        <button className={`${SAVE_BTN} mt-3`} onClick={handleAdd}>Add Photo</button>
      </div>

      {/* Photo list */}
      {photos.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No photos added yet.</p>
      ) : (
        <div className="space-y-2">
          {photos.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-[#FFD6E0]"
            >
              {p.src ? (
                <img
                  src={p.src}
                  alt={p.alt}
                  className="w-12 h-12 object-cover rounded-lg border border-[#FFD6E0]"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-[#FFD6E0] flex items-center justify-center text-xl">
                  📷
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1A1A2E] truncate">{p.alt || '(no alt text)'}</p>
                <p className="text-xs text-gray-400">{p.category} {p.date ? `· ${p.date}` : ''}</p>
              </div>
              <button className={DELETE_BTN} onClick={() => handleDelete(p.id)} aria-label={`Delete photo ${p.alt}`}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: Love Notes
// ══════════════════════════════════════════════════════════════════════════════
type NoteLang = 'en' | 'mr' | 'hi'
const LANG_LABELS: Record<NoteLang, string> = { en: 'English', mr: 'Marathi', hi: 'Hindi' }

function NotesTab({ onSaved }: { onSaved: () => void }) {
  const [notes, setNotes] = useState<LoveNote[]>(
    () => getStorageItem<LoveNote[]>(STORAGE_KEYS.ADMIN_NOTES) ?? defaultNotes
  )
  const [filterLang, setFilterLang] = useState<NoteLang>('en')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [newNote, setNewNote] = useState({ text: '', lang: 'en' as NoteLang })

  const filtered = notes.filter((n) => n.lang === filterLang)

  function handleEditClick(note: LoveNote) {
    setEditingId(note.id)
    setEditText(note.text)
  }

  function handleSaveNote() {
    const updated = notes.map((n) =>
      n.id === editingId ? { ...n, text: editText } : n
    )
    setNotes(updated)
    setStorageItem(STORAGE_KEYS.ADMIN_NOTES, updated)
    setEditingId(null)
    onSaved()
  }

  function handleAddNote() {
    if (!newNote.text.trim()) return
    const created: LoveNote = {
      id: `n${Date.now()}`,
      text: newNote.text,
      lang: newNote.lang,
      isFavorited: false,
      isBookmarked: false,
    }
    const updated = [...notes, created]
    setNotes(updated)
    setStorageItem(STORAGE_KEYS.ADMIN_NOTES, updated)
    setNewNote({ text: '', lang: 'en' })
    onSaved()
  }

  function handleDelete(id: string) {
    const updated = notes.filter((n) => n.id !== id)
    setNotes(updated)
    setStorageItem(STORAGE_KEYS.ADMIN_NOTES, updated)
    onSaved()
  }

  return (
    <div>
      <SectionTitle>Love Notes</SectionTitle>

      {/* Lang filter */}
      <div className="flex gap-2 mb-5" role="group" aria-label="Filter by language">
        {(['en', 'mr', 'hi'] as NoteLang[]).map((lang) => (
          <button
            key={lang}
            className={filterLang === lang ? PILL_ACTIVE : PILL_INACTIVE}
            onClick={() => setFilterLang(lang)}
            aria-pressed={filterLang === lang}
          >
            {LANG_LABELS[lang]}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400 self-center">
          {filtered.length} notes
        </span>
      </div>

      {/* Add new note */}
      <div className="bg-[#FFF5F7] rounded-2xl p-4 mb-5 border border-[#FFD6E0]">
        <p className="text-sm font-semibold text-[#B76E79] mb-2">Add New Note</p>
        <div className="flex gap-2 mb-2">
          {(['en', 'mr', 'hi'] as NoteLang[]).map((lang) => (
            <button
              key={lang}
              className={newNote.lang === lang ? PILL_ACTIVE : PILL_INACTIVE}
              onClick={() => setNewNote({ ...newNote, lang })}
              aria-pressed={newNote.lang === lang}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
        <textarea
          className={TEXTAREA_CLS}
          rows={3}
          placeholder="Enter note text…"
          value={newNote.text}
          onChange={(e) => setNewNote({ ...newNote, text: e.target.value })}
          aria-label="New note text"
        />
        <button className={`${SAVE_BTN} mt-2`} onClick={handleAddNote}>Add Note</button>
      </div>

      {/* Note list */}
      <div className="space-y-2">
        {filtered.map((note) => (
          <div
            key={note.id}
            className="bg-white rounded-xl px-4 py-3 border border-[#FFD6E0]"
          >
            {editingId === note.id ? (
              <div>
                <textarea
                  className={TEXTAREA_CLS}
                  rows={3}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  aria-label="Edit note text"
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <button className={SAVE_BTN} onClick={handleSaveNote}>Save</button>
                  <button
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <p className="flex-1 text-sm text-[#1A1A2E] leading-relaxed">{note.text}</p>
                <div className="flex gap-1.5 shrink-0">
                  <button className={ADD_BTN} onClick={() => handleEditClick(note)} aria-label="Edit note">
                    Edit
                  </button>
                  <button className={DELETE_BTN} onClick={() => handleDelete(note.id)} aria-label="Delete note">
                    Del
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: Banner (featured message)
// ══════════════════════════════════════════════════════════════════════════════
function BannerTab({ onSaved }: { onSaved: () => void }) {
  const STORAGE_KEY = STORAGE_KEYS.ADMIN_MESSAGE
  const saved = getStorageItem<any>(STORAGE_KEY)
  const [image, setImage] = useState<string>(saved?.image ?? '/images/5th%20year%202025/20240409_153617.jpg')
  const [text, setText] = useState<string>(saved?.text ?? "You come into my life unexpectedly and I'm addicted to you permanently..")
  const [signature, setSignature] = useState<string>(saved?.signature ?? '— With all my heart')
  const [overlay, setOverlay] = useState<number>(saved?.overlay ?? 38)
  const [blur, setBlur] = useState<number>(saved?.blur ?? 4)
  const [align, setAlign] = useState<'left' | 'center' | 'right'>(saved?.align ?? 'center')

  function handleSave() {
    const payload = { image, text, signature, overlay, blur, align }
    setStorageItem(STORAGE_KEY, payload)
    onSaved()
  }

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result ?? '')
      setImage(result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <SectionTitle>Featured Banner</SectionTitle>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={LABEL_CLS}>Message</label>
          <textarea className={TEXTAREA_CLS} rows={4} value={text} onChange={(e) => setText(e.target.value)} />

          <label className={LABEL_CLS}>Signature</label>
          <input className={INPUT_CLS} value={signature} onChange={(e) => setSignature(e.target.value)} />

          <label className={LABEL_CLS}>Image URL</label>
          <input className={INPUT_CLS} value={image} onChange={(e) => setImage(e.target.value)} placeholder="/images/... or https://..." />

          <label className={LABEL_CLS}>Or upload image</label>
          <input type="file" accept="image/*" onChange={handleFile} className="w-full" />

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLS}>Overlay darkness (%)</label>
              <input className="w-full" type="range" min={0} max={80} value={overlay} onChange={(e) => setOverlay(Number(e.target.value))} />
            </div>
            <div>
              <label className={LABEL_CLS}>Backdrop blur (px)</label>
              <input className="w-full" type="range" min={0} max={16} value={blur} onChange={(e) => setBlur(Number(e.target.value))} />
            </div>
          </div>

          <label className={LABEL_CLS}>Text alignment</label>
          <div className="flex gap-2 mb-4">
            {(['left', 'center', 'right'] as const).map((a) => (
              <button
                key={a}
                onClick={() => setAlign(a)}
                className={align === a ? PILL_ACTIVE : PILL_INACTIVE}
                aria-pressed={align === a}
              >
                {a}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button className={SAVE_BTN} onClick={handleSave}>Save Banner</button>
            <button className={DELETE_BTN} onClick={() => {
              setImage('')
              setText('')
              setSignature('')
              setStorageItem(STORAGE_KEY, null)
              onSaved()
            }}>Clear</button>
          </div>
        </div>

        <div>
          <SectionTitle>Preview</SectionTitle>
          <div className="rounded-2xl overflow-hidden border border-[#E9DDE0] bg-black">
            {image ? (
              <div className="relative" style={{ aspectRatio: '16/9' }}>
                <img src={image} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${overlay/100})`, backdropFilter: `blur(${blur}px)` }} />
                <div className="relative p-6 h-full flex items-center" style={{ justifyContent: align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end' }}>
                  <div className="text-white max-w-[85%]">
                    <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl leading-tight">{text}</p>
                    <p className="mt-2 text-sm">{signature}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ aspectRatio: '16/9' }} className="flex items-center justify-center text-gray-400 py-8">No image selected</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: Reasons
// ══════════════════════════════════════════════════════════════════════════════
function ReasonsTab({ onSaved }: { onSaved: () => void }) {
  const [reasons, setReasons] = useState<LoveReason[]>(
    () => getStorageItem<LoveReason[]>(STORAGE_KEYS.ADMIN_REASONS) ?? defaultReasons
  )

  function handleChange(id: string, text: string) {
    setReasons(reasons.map((r) => (r.id === id ? { ...r, text } : r)))
  }

  function handleSaveAll() {
    setStorageItem(STORAGE_KEYS.ADMIN_REASONS, reasons)
    onSaved()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <SectionTitle>100 Reasons I Love You</SectionTitle>
        <button className={SAVE_BTN} onClick={handleSaveAll}>Save All</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {reasons.map((r, i) => (
          <div key={r.id} className="flex items-center gap-2">
            <span className="text-xs text-gray-400 w-8 text-right shrink-0">
              {i + 1}.
            </span>
            <input
              className={INPUT_CLS}
              value={r.text}
              onChange={(e) => handleChange(r.id, e.target.value)}
              aria-label={`Reason ${i + 1}`}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button className={SAVE_BTN} onClick={handleSaveAll}>Save All</button>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: Birthday Messages
// ══════════════════════════════════════════════════════════════════════════════
function BirthdayMsgTab({ onSaved }: { onSaved: () => void }) {
  const [msgs, setMsgs] = useState<BirthdayMessages>(
    () => getStorageItem<BirthdayMessages>(STORAGE_KEYS.ADMIN_BIRTHDAY_MSG) ?? defaultBirthdayMsgs
  )

  function handleSave() {
    setStorageItem(STORAGE_KEYS.ADMIN_BIRTHDAY_MSG, msgs)
    onSaved()
  }

  function field(key: keyof BirthdayMessages, label: string) {
    const value = (msgs[key] as string | undefined) ?? ''
    return (
      <div className="mb-5">
        <label className={LABEL_CLS} htmlFor={`bday-${key}`}>{label}</label>
        {key === 'videoUrl' ? (
          <input
            id={`bday-${key}`}
            className={INPUT_CLS}
            placeholder="https://youtu.be/..."
            value={value}
            onChange={(e) => setMsgs({ ...msgs, [key]: e.target.value || undefined })}
          />
        ) : (
          <textarea
            id={`bday-${key}`}
            className={TEXTAREA_CLS}
            rows={key === 'heroMessage' || key === 'finalReveal' ? 6 : 4}
            value={value}
            onChange={(e) => setMsgs({ ...msgs, [key]: e.target.value })}
          />
        )}
      </div>
    )
  }

  return (
    <div>
      <SectionTitle>Birthday Messages</SectionTitle>
      {field('heroMessage', 'Hero Message (Landing Page)')}
      {field('celebrationIntro', 'Celebration Intro (Celebration Page)')}
      {field('finalReveal', 'Final Reveal (Password Screen)')}
      {field('foreverPromise', 'Forever Promise (Closing Screen)')}
      {field('videoUrl', 'Birthday Video URL (YouTube — optional)')}
      <button className={SAVE_BTN} onClick={handleSave}>Save Messages</button>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: Inside Jokes
// ══════════════════════════════════════════════════════════════════════════════
function InsideJokesTab({ onSaved }: { onSaved: () => void }) {
  const [jokes, setJokes] = useState<InsideJoke[]>(
    () => getStorageItem<InsideJoke[]>(STORAGE_KEYS.ADMIN_INSIDE_JOKES) ?? defaultInsideJokes
  )

  function handleChange<K extends keyof InsideJoke>(id: string, key: K, value: InsideJoke[K]) {
    setJokes(jokes.map((j) => (j.id === id ? { ...j, [key]: value } : j)))
  }

  function handleSave() {
    setStorageItem(STORAGE_KEYS.ADMIN_INSIDE_JOKES, jokes)
    onSaved()
  }

  function handleAdd() {
    const newJoke: InsideJoke = {
      id: `ij${Date.now()}`,
      emoji: '😄',
      title: '',
      story: '',
      isFavorited: false,
    }
    setJokes([...jokes, newJoke])
  }

  function handleDelete(id: string) {
    setJokes(jokes.filter((j) => j.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <SectionTitle>Inside Jokes</SectionTitle>
        <div className="flex gap-2">
          <button className={ADD_BTN} onClick={handleAdd}>+ Add</button>
          <button className={SAVE_BTN} onClick={handleSave}>Save All</button>
        </div>
      </div>

      <div className="space-y-4">
        {jokes.map((joke) => (
          <div
            key={joke.id}
            className="bg-white rounded-2xl p-4 border border-[#FFD6E0]"
          >
            <div className="flex gap-3 mb-3">
              <div className="w-20">
                <label className={LABEL_CLS}>Emoji</label>
                <input
                  className={INPUT_CLS}
                  value={joke.emoji}
                  onChange={(e) => handleChange(joke.id, 'emoji', e.target.value)}
                  aria-label={`Emoji for ${joke.title}`}
                />
              </div>
              <div className="flex-1">
                <label className={LABEL_CLS}>Title</label>
                <input
                  className={INPUT_CLS}
                  value={joke.title}
                  onChange={(e) => handleChange(joke.id, 'title', e.target.value)}
                  aria-label="Joke title"
                />
              </div>
              <button
                className={`${DELETE_BTN} self-end`}
                onClick={() => handleDelete(joke.id)}
                aria-label={`Delete joke: ${joke.title}`}
              >
                Delete
              </button>
            </div>
            <div>
              <label className={LABEL_CLS}>Story</label>
              <textarea
                className={TEXTAREA_CLS}
                rows={3}
                value={joke.story}
                onChange={(e) => handleChange(joke.id, 'story', e.target.value)}
                aria-label={`Story for ${joke.title}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <button className={SAVE_BTN} onClick={handleSave}>Save All</button>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: Countdown Messages
// ══════════════════════════════════════════════════════════════════════════════
function CountdownMsgsTab({ onSaved }: { onSaved: () => void }) {
  const [msgs, setMsgs] = useState<string[]>(
    () => getStorageItem<string[]>(STORAGE_KEYS.ADMIN_COUNTDOWN_MSGS) ?? [...defaultCountdownMsgs]
  )

  // Ensure exactly 4 slots
  const slots = Array.from({ length: 4 }, (_, i) => msgs[i] ?? '')

  function handleChange(i: number, val: string) {
    const next = [...slots]
    next[i] = val
    setMsgs(next)
  }

  function handleSave() {
    setStorageItem(STORAGE_KEYS.ADMIN_COUNTDOWN_MSGS, msgs)
    onSaved()
  }

  return (
    <div>
      <SectionTitle>Countdown Messages</SectionTitle>
      <p className="text-xs text-gray-400 mb-5">
        4 messages rotate every 7 seconds during the 30-second countdown.
      </p>
      {slots.map((msg, i) => (
        <div key={i} className="mb-4">
          <label className={LABEL_CLS} htmlFor={`cdmsg-${i}`}>
            Message {i + 1}
          </label>
          <input
            id={`cdmsg-${i}`}
            className={INPUT_CLS}
            value={msg}
            onChange={(e) => handleChange(i, e.target.value)}
            aria-label={`Countdown message ${i + 1}`}
          />
        </div>
      ))}
      <button className={SAVE_BTN} onClick={handleSave}>Save Messages</button>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: Bucket List
// ══════════════════════════════════════════════════════════════════════════════
function BucketListTab({ onSaved }: { onSaved: () => void }) {
  const [items, setItems] = useState<BucketItem[]>(
    () => getStorageItem<BucketItem[]>(STORAGE_KEYS.BUCKET_LIST) ?? defaultBucketList
  )
  const [newItem, setNewItem] = useState({ label: '', emoji: '✨' })

  function handleChange<K extends keyof BucketItem>(id: string, key: K, value: BucketItem[K]) {
    setItems(items.map((it) => (it.id === id ? { ...it, [key]: value } : it)))
  }

  function handleSave() {
    setStorageItem(STORAGE_KEYS.BUCKET_LIST, items)
    onSaved()
  }

  function handleAdd() {
    if (!newItem.label.trim()) return
    const created: BucketItem = {
      id: `b${Date.now()}`,
      label: newItem.label,
      emoji: newItem.emoji,
      completed: false,
    }
    setItems([...items, created])
    setNewItem({ label: '', emoji: '✨' })
  }

  function handleDelete(id: string) {
    setItems(items.filter((it) => it.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <SectionTitle>Bucket List</SectionTitle>
        <button className={SAVE_BTN} onClick={handleSave}>Save All</button>
      </div>

      {/* Add new */}
      <div className="bg-[#FFF5F7] rounded-2xl p-4 mb-5 border border-[#FFD6E0]">
        <p className="text-sm font-semibold text-[#B76E79] mb-2">Add New Item</p>
        <div className="flex gap-2">
          <input
            className={`${INPUT_CLS} w-16`}
            value={newItem.emoji}
            onChange={(e) => setNewItem({ ...newItem, emoji: e.target.value })}
            placeholder="✨"
            aria-label="Emoji"
          />
          <input
            className={`${INPUT_CLS} flex-1`}
            value={newItem.label}
            onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
            placeholder="Something to do together…"
            aria-label="Bucket list item label"
          />
          <button className={ADD_BTN} onClick={handleAdd}>Add</button>
        </div>
      </div>

      {/* Items list */}
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-[#FFD6E0]"
          >
            <input
              type="checkbox"
              checked={item.completed}
              onChange={(e) => handleChange(item.id, 'completed', e.target.checked)}
              className="w-4 h-4 accent-[#B76E79] shrink-0"
              aria-label={`Mark "${item.label}" as ${item.completed ? 'incomplete' : 'complete'}`}
            />
            <input
              className="w-10 px-1 py-1 text-center text-lg border border-[#FFD6E0] rounded-lg bg-[#FFF5F7] outline-none"
              value={item.emoji}
              onChange={(e) => handleChange(item.id, 'emoji', e.target.value)}
              aria-label="Item emoji"
            />
            <input
              className={`${INPUT_CLS} flex-1`}
              value={item.label}
              onChange={(e) => handleChange(item.id, 'label', e.target.value)}
              style={{ textDecoration: item.completed ? 'line-through' : 'none', opacity: item.completed ? 0.55 : 1 }}
              aria-label="Bucket list item label"
            />
            <button className={DELETE_BTN} onClick={() => handleDelete(item.id)} aria-label={`Delete ${item.label}`}>
              Del
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <button className={SAVE_BTN} onClick={handleSave}>Save All</button>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: Export
// ══════════════════════════════════════════════════════════════════════════════
function ExportTab() {
  function handleExport() {
    const backup: Record<string, unknown> = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('swati_')) {
        try {
          backup[key] = JSON.parse(localStorage.getItem(key) ?? 'null')
        } catch {
          backup[key] = localStorage.getItem(key)
        }
      }
    }

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'swati-backup.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <SectionTitle>Export Data</SectionTitle>
      <p className="text-sm text-gray-500 mb-6">
        Downloads a JSON backup of all <code className="text-[#B76E79]">swati_*</code> localStorage
        keys. You can use this to restore data on another device via the Import tab.
      </p>
      <button className={SAVE_BTN} onClick={handleExport}>
        ⬇️ Download swati-backup.json
      </button>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: Import
// ══════════════════════════════════════════════════════════════════════════════
function ImportTab({ onSaved }: { onSaved: () => void }) {
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const raw = ev.target?.result as string
        const parsed = JSON.parse(raw) as Record<string, unknown>
        let count = 0
        for (const [key, value] of Object.entries(parsed)) {
          if (key.startsWith('swati_')) {
            localStorage.setItem(key, JSON.stringify(value))
            count++
          }
        }
        setStatus({ type: 'success', msg: `✅ Imported ${count} key(s) successfully.` })
        onSaved()
      } catch {
        setStatus({ type: 'error', msg: '❌ Failed to parse file. Make sure it is a valid swati-backup.json.' })
      }
    }
    reader.readAsText(file)

    // Reset file input
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div>
      <SectionTitle>Import Data</SectionTitle>
      <p className="text-sm text-gray-500 mb-6">
        Upload a <code className="text-[#B76E79]">swati-backup.json</code> file to restore data.
        Only keys starting with <code className="text-[#B76E79]">swati_</code> will be imported.
        <strong className="text-red-500 ml-1">This will overwrite existing data.</strong>
      </p>

      <label
        className="flex flex-col items-center justify-center gap-3 w-full p-10 border-2 border-dashed border-[#B76E79]/40 rounded-2xl cursor-pointer bg-[#FFF5F7] hover:bg-[#FFD6E0]/30 transition-all"
        aria-label="Upload backup JSON file"
      >
        <span className="text-3xl">📂</span>
        <span className="text-sm text-[#B76E79] font-semibold">Click to choose file</span>
        <span className="text-xs text-gray-400">swati-backup.json</span>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          onChange={handleFile}
          aria-label="Select backup file"
        />
      </label>

      {status && (
        <p
          className={`mt-4 text-sm font-medium p-3 rounded-xl ${
            status.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-600 border border-red-200'
          }`}
          role="alert"
        >
          {status.msg}
        </p>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN: AdminPanel
// ══════════════════════════════════════════════════════════════════════════════
export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<TabId>('timeline')
  const [toastMsg, setToastMsg] = useState('')

  const showToast = useCallback((msg: string = 'Saved ✓') => {
    setToastMsg(msg)
  }, [])

  const clearToast = useCallback(() => setToastMsg(''), [])

  const onSaved = useCallback(() => showToast('Saved ✓'), [showToast])

  function renderTab() {
    switch (activeTab) {
      case 'timeline': return <TimelineTab onSaved={onSaved} />
      case 'banner': return <BannerTab onSaved={onSaved} />
      case 'gallery': return <GalleryTab onSaved={onSaved} />
      case 'notes': return <NotesTab onSaved={onSaved} />
      case 'reasons': return <ReasonsTab onSaved={onSaved} />
      case 'birthday': return <BirthdayMsgTab onSaved={onSaved} />
      case 'jokes': return <InsideJokesTab onSaved={onSaved} />
      case 'countdown': return <CountdownMsgsTab onSaved={onSaved} />
      case 'bucket': return <BucketListTab onSaved={onSaved} />
      case 'export': return <ExportTab />
      case 'import': return <ImportTab onSaved={onSaved} />
      default: return null
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: '#F5ECD7' }}
      role="main"
      aria-label="Admin Panel"
    >
      {/* Header */}
      <header
        className="sticky top-0 z-40 px-4 py-4 border-b border-[#FFD6E0]"
        style={{ backgroundColor: '#F5ECD7' }}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center gap-2">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "'Playfair Display', serif", color: '#B76E79' }}
            >
              Admin Panel 🛠️
            </h1>
            <p className="text-xs text-red-500 font-semibold mt-0.5">
              This page is only for Satish
            </p>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="max-w-5xl mx-auto mt-4 overflow-x-auto">
          <div className="flex gap-1 min-w-max" role="tablist" aria-label="Admin sections">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`tab-panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#B76E79] text-white shadow-sm'
                    : 'bg-white text-[#B76E79] hover:bg-[#FFD6E0]/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Tab content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div
          id={`tab-panel-${activeTab}`}
          role="tabpanel"
          aria-label={TABS.find((t) => t.id === activeTab)?.label}
        >
          {renderTab()}
        </div>
      </main>

      {/* Toast */}
      {toastMsg && <Toast msg={toastMsg} onDone={clearToast} />}
    </div>
  )
}
