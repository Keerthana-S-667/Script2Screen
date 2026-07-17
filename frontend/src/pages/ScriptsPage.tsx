import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search,
    Filter,
    FileText,
    Edit3,
    Video,
    Trash2,
    Calendar,
    Globe,
    X,
    Plus,
    Save,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

// ── Types ────────────────────────────────────────────────────────────────────

interface ScriptItem {
    id: string
    title: string
    language: string
    content: string
    createdAt: string // ISO string
}

// ── Simulated System Data ──────────────────────────────────────────────────────

const SEED_SCRIPTS: ScriptItem[] = [
    {
        id: 'script-1',
        title: 'Water Conservation',
        language: 'English',
        content: '"Water is life. Every drop matters. In this video, we will explore the critical importance of water conservation and steps we can take today to secure our future..."',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'script-2',
        title: 'The Future of AI',
        language: 'English',
        content: '"Artificial Intelligence is rapidly changing the landscape of technology. From healthcare to transportation, AI brings unprecedented opportunities..."',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'script-3',
        title: 'Healthy Eating Habits',
        language: 'Spanish',
        content: '"Comer sano no se trata de dietas estrictas, sino de sentirse bien y tener más energía. Descubre estos cinco hábitos saludables elementales..."',
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'script-4',
        title: 'Learn React in 10 Minutes',
        language: 'English',
        content: '"Welcome! Today we are diving into React, one of the most popular UI libraries for building fast and interactive web applications..."',
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    },
]

const STORAGE_KEY = 's2s_my_scripts'

function loadScripts(): ScriptItem[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) return JSON.parse(raw) as ScriptItem[]
    } catch {
        // ignore
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_SCRIPTS))
    return SEED_SCRIPTS
}

function saveScripts(scripts: ScriptItem[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scripts))
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

function formatDate(iso: string) {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const LANGUAGES = ['All Scripts', 'English', 'Tamil', 'Telugu', 'Hindi', 'Spanish']

// ── Script Card Component ─────────────────────────────────────────────────────

function ScriptCard({ 
    script, 
    onEdit, 
    onGenerate,
    onDelete 
}: { 
    script: ScriptItem
    onEdit: (script: ScriptItem) => void
    onGenerate: (script: ScriptItem) => void
    onDelete: (id: string) => void
}) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: EASE }}
            style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #D6DFC8',
                boxShadow: '0 4px 20px rgba(61,82,41,0.06)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease',
            }}
        >
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Header row */}
                <div>
                     <h3 style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        color: '#2D3425',
                        lineHeight: 1.35,
                        margin: '0 0 10px 0',
                    }}>
                        {script.title}
                    </h3>

                    {/* Meta row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            background: '#F0F4EC', color: '#5C7844',
                            padding: '4px 10px', borderRadius: '6px',
                            fontSize: '0.75rem', fontWeight: 600,
                            fontFamily: "'Inter', sans-serif"
                        }}>
                             <Globe size={12} /> {script.language}
                        </span>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={12} color="#8A9272" />
                            <span style={{ fontSize: '0.75rem', color: '#8A9272', fontFamily: "'Inter', sans-serif" }}>
                                {formatDate(script.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Preview text */}
                <div style={{
                     background: '#F9FCF5', padding: '16px', borderRadius: '10px', border: '1px solid #E8EFE0',
                     flex: 1
                }}>
                    <p style={{
                         fontFamily: "'Inter', sans-serif",
                         fontSize: '0.9rem', color: '#5A6348', lineHeight: 1.6, margin: 0,
                         display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                         fontStyle: 'italic'
                    }}>
                        {script.content}
                    </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <motion.button
                        id={`script-edit-${script.id}`}
                        onClick={() => onEdit(script)}
                        whileHover={{ scale: 1.02, backgroundColor: '#F0F4EC' }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                            flex: 1,
                            padding: '10px 12px',
                            borderRadius: '10px',
                            border: '1px solid #C8D5B9',
                            background: '#FFFFFF',
                            color: '#3D5229',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            fontFamily: "'Inter', sans-serif",
                            transition: 'all 0.18s ease',
                        }}
                    >
                        <Edit3 size={15} /> Edit Script
                    </motion.button>

                    <motion.button
                        id={`script-generate-${script.id}`}
                        onClick={() => onGenerate(script)}
                        whileHover={{ scale: 1.02, boxShadow: '0 4px 14px rgba(61,82,41,0.18)' }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                            flex: 1,
                            padding: '10px 12px',
                            borderRadius: '10px',
                            border: 'none',
                            background: '#5C7844',
                            color: '#fff',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            fontFamily: "'Inter', sans-serif",
                            transition: 'all 0.18s ease',
                        }}
                    >
                        <Video size={15} /> Generate Video
                    </motion.button>

                    {/* Delete button (icon only) */}
                    <motion.button
                        id={`script-delete-${script.id}`}
                        onClick={() => onDelete(script.id)}
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(185,60,60,0.08)' }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            padding: '10px',
                            borderRadius: '10px',
                            border: '1px solid rgba(185,80,80,0.25)',
                            background: 'transparent',
                            color: '#9B5050',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.18s ease',
                        }}
                    >
                        <Trash2 size={16} />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}

// ── Edit Modal Component ──────────────────────────────────────────────────────

function EditModal({ 
    script, 
    onClose, 
    onSave 
}: { 
    script: ScriptItem
    onClose: () => void
    onSave: (id: string, newContent: string) => void
}) {
    const [content, setContent] = useState(script.content)

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [onClose])

    return (
        <AnimatePresence>
            <motion.div
                id="edit-modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onMouseDown={onClose}
                style={{
                    position: 'fixed', inset: 0, zIndex: 200,
                    background: 'rgba(45,52,37,0.55)',
                    backdropFilter: 'blur(6px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px',
                }}
            >
                <motion.div
                    id="edit-modal-content"
                    initial={{ opacity: 0, scale: 0.96, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 15 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    onMouseDown={(e) => e.stopPropagation()}
                    style={{
                        background: '#FFFFFF',
                        borderRadius: '20px',
                        border: '1px solid #D6DFC8',
                        boxShadow: '0 24px 64px rgba(61,82,41,0.22)',
                        width: '100%',
                        maxWidth: '700px',
                        display: 'flex',
                        flexDirection: 'column',
                        maxHeight: '90vh',
                    }}
                >
                     {/* Header */}
                     <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '20px 24px',
                        borderBottom: '1px solid #E8EFE0',
                    }}>
                         <div>
                             <h2 style={{
                                fontFamily: "'Playfair Display', Georgia, serif",
                                fontSize: '1.25rem',
                                fontWeight: 700,
                                color: '#2D3425',
                                margin: '0 0 6px 0',
                            }}>
                                Edit Script
                            </h2>
                            <p style={{
                                fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', color: '#8A9272', margin: 0
                            }}>
                                {script.title}
                            </p>
                         </div>
                        <motion.button
                            onClick={onClose}
                            whileHover={{ scale: 1.1, backgroundColor: '#F7F5F0' }}
                            whileTap={{ scale: 0.92 }}
                            style={{
                                width: '36px', height: '36px', borderRadius: '10px',
                                border: '1px solid #D6DFC8', background: 'transparent',
                                color: '#5A6348', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.18s ease', flexShrink: 0,
                            }}
                        >
                            <X size={18} />
                        </motion.button>
                     </div>

                     {/* Content area */}
                     <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                          <textarea
                              id="edit-script-textarea"
                              value={content}
                              onChange={(e) => setContent(e.target.value)}
                              style={{
                                  width: '100%', height: '300px', padding: '16px',
                                  borderRadius: '12px', border: '1.5px solid #D6DFC8',
                                  background: '#F9FCF5', color: '#2D3425',
                                  fontSize: '0.95rem', lineHeight: 1.7, resize: 'none',
                                  fontFamily: "'Inter', sans-serif", outline: 'none',
                                  boxSizing: 'border-box',
                                  transition: 'border-color 0.2s',
                              }}
                              onFocus={e => { e.target.style.borderColor = '#5C7844'; e.target.style.background = '#fff' }}
                              onBlur={e => { e.target.style.borderColor = '#D6DFC8'; e.target.style.background = '#F9FCF5' }}
                          />
                     </div>

                     {/* Footer */}
                     <div style={{
                         display: 'flex', gap: '12px', justifyContent: 'flex-end',
                         padding: '20px 24px', borderTop: '1px solid #E8EFE0',
                         background: '#FDFCF9', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px'
                     }}>
                          <motion.button
                              onClick={onClose}
                              whileHover={{ scale: 1.02, backgroundColor: '#F0F4EC' }}
                              whileTap={{ scale: 0.97 }}
                              style={{
                                  padding: '10px 24px', borderRadius: '9999px',
                                  border: '1px solid #C8D5B9', background: '#FFFFFF', color: '#5A6348',
                                  fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
                                  fontFamily: "'Inter', sans-serif", transition: 'all 0.2s ease',
                              }}
                          >
                              Cancel
                          </motion.button>

                          <motion.button
                                onClick={() => onSave(script.id, content)}
                                whileHover={{ scale: 1.02, boxShadow: '0 4px 14px rgba(61,82,41,0.18)' }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    padding: '10px 28px',
                                    borderRadius: '9999px',
                                    border: 'none',
                                    background: '#5C7844',
                                    color: '#fff',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontFamily: "'Inter', sans-serif",
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                <Save size={16} /> Save Changes
                            </motion.button>
                     </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ScriptsPage() {
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [scripts, setScripts] = useState<ScriptItem[]>(() => loadScripts())
    
    // Filtering and Searching
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedLanguage, setSelectedLanguage] = useState('All Scripts')
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    // Editing logic
    const [editingScript, setEditingScript] = useState<ScriptItem | null>(null)

    // Persist changes to local storage
    useEffect(() => {
        saveScripts(scripts)
    }, [scripts])

    // Handlers
    function handleDelete(id: string) {
        setScripts(prev => prev.filter(s => s.id !== id))
    }

    function handleGenerate(script: ScriptItem) {
        // Redirect to create-video and pass the script ID via query params.
        navigate(`/create-video?script=${script.id}`)
    }

    function handleSaveEdit(id: string, newContent: string) {
        setScripts(prev => prev.map(s => s.id === id ? { ...s, content: newContent } : s))
        setEditingScript(null)
    }

    // Filter Logic
    const filteredScripts = scripts.filter(script => {
        const matchesSearch = script.title.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesLang = selectedLanguage === 'All Scripts' || script.language === selectedLanguage
        return matchesSearch && matchesLang
    })

    return (
        <div style={{ minHeight: '100vh', background: '#F7F5F0', position: 'relative', overflowX: 'hidden' }}>

            {/* Navbar & Sidebar */}
            <Navbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} activePath="/scripts" />

            {/* Main Content Area */}
            <main style={{
                position: 'relative', zIndex: 10,
                minHeight: '100vh',
                paddingTop: '88px',
                paddingBottom: '80px',
                paddingLeft: 'clamp(20px, 5vw, 64px)',
                paddingRight: 'clamp(20px, 5vw, 64px)',
                maxWidth: '1280px',
                margin: '0 auto',
            }}>

                {/* ── Page Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: -18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: EASE }}
                    style={{ marginBottom: '32px' }}
                >
                    <h1 style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
                        fontWeight: 700,
                        color: '#2D3425',
                        marginBottom: '10px',
                    }}>
                        Scripts
                    </h1>
                     <p style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '1rem',
                        color: '#5A6348',
                        margin: 0,
                    }}>
                        View, edit, and reuse your generated scripts.
                    </p>
                </motion.div>

                {/* ── Search and Filter Section ── */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
                    style={{ 
                        display: 'flex', gap: '16px', marginBottom: '40px', flexWrap: 'wrap',
                        alignItems: 'center',
                    }}
                >
                    {/* Search Bar */}
                    <div style={{
                        flex: '1 1 300px', position: 'relative', display: 'flex', alignItems: 'center'
                    }}>
                        <Search size={18} color="#8FAF72" style={{ position: 'absolute', left: '16px' }} />
                        <input
                            type="text"
                            placeholder="Search scripts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%', padding: '14px 16px 14px 44px',
                                borderRadius: '12px', border: '1px solid #D6DFC8',
                                background: '#FFFFFF', color: '#2D3425',
                                fontSize: '0.95rem', outline: 'none',
                                fontFamily: "'Inter', sans-serif",
                                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                                transition: 'all 0.2s ease'
                            }}
                            onFocus={e => { e.target.style.borderColor = '#5C7844'; e.target.style.boxShadow = '0 4px 12px rgba(92,120,68,0.08)' }}
                            onBlur={e => { e.target.style.borderColor = '#D6DFC8'; e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)' }}
                        />
                    </div>

                    {/* Filter Dropdown Toggle */}
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            style={{
                                padding: '14px 20px', borderRadius: '12px',
                                border: '1px solid #D6DFC8', background: isFilterOpen ? '#F0F4EC' : '#FFFFFF',
                                color: '#3D5229', fontSize: '0.95rem', fontWeight: 500,
                                display: 'flex', alignItems: 'center', gap: '10px',
                                cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                                transition: 'all 0.2s ease', 
                                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                            }}
                        >
                            <Filter size={18} color="#8FAF72" />
                            {selectedLanguage}
                        </button>
                        
                        {/* Dropdown Menu */}
                        <AnimatePresence>
                            {isFilterOpen && (
                                <>
                                    <div style={{ position: 'fixed', inset: 0, zIndex: 90 }} onClick={() => setIsFilterOpen(false)} />
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        style={{
                                            position: 'absolute', top: '100%', right: 0, marginTop: '8px',
                                            background: '#FFFFFF', border: '1px solid #D6DFC8',
                                            borderRadius: '12px', boxShadow: '0 12px 32px rgba(61,82,41,0.12)',
                                            padding: '8px', minWidth: '180px', zIndex: 100,
                                            display: 'flex', flexDirection: 'column', gap: '4px'
                                        }}
                                    >
                                        {LANGUAGES.map(lang => (
                                            <button
                                                key={lang}
                                                onClick={() => { setSelectedLanguage(lang); setIsFilterOpen(false); }}
                                                style={{
                                                    padding: '10px 16px', background: selectedLanguage === lang ? '#F9FCF5' : 'transparent',
                                                    border: 'none', borderRadius: '8px',
                                                    color: selectedLanguage === lang ? '#3D5229' : '#5A6348',
                                                    fontWeight: selectedLanguage === lang ? 600 : 500,
                                                    textAlign: 'left', cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                                                    transition: 'background 0.2s',
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#F0F4EC'}
                                                onMouseLeave={e => e.currentTarget.style.background = selectedLanguage === lang ? '#F9FCF5' : 'transparent'}
                                            >
                                                {lang}
                                            </button>
                                        ))}
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* ── Scripts Library Grid ── */}
                <motion.section 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
                >
                     {scripts.length === 0 ? (
                         // Total Empty State (no scripts created ever)
                         <motion.div
                             initial={{ opacity: 0, y: 20 }}
                             animate={{ opacity: 1, y: 0 }}
                             style={{
                                 padding: '80px 24px', textAlign: 'center', background: '#FFFFFF',
                                 borderRadius: '20px', border: '1px dashed #C8D5B9',
                                 display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px'
                             }}
                         >
                              <div style={{
                                  width: '80px', height: '80px', borderRadius: '50%',
                                  background: 'rgba(92,120,68,0.08)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                              }}>
                                  <FileText size={36} color="#8FAF72" />
                              </div>
                              <div>
                                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.4rem', fontWeight: 600, color: '#2D3425', margin: '0 0 10px 0' }}>
                                      You haven't generated any scripts yet.
                                  </h3>
                                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.95rem', color: '#8A9272', margin: 0 }}>
                                      Scripts generated from the Create Video tool will appear here.
                                  </p>
                              </div>
                              <motion.button
                                  onClick={() => navigate('/create-video')}
                                  whileHover={{ scale: 1.04, boxShadow: '0 8px 24px rgba(61,82,41,0.20)' }}
                                  whileTap={{ scale: 0.97 }}
                                  style={{
                                      marginTop: '12px', padding: '12px 30px', borderRadius: '9999px',
                                      background: '#5C7844', border: 'none', color: '#fff',
                                      fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', 
                                      display: 'flex', alignItems: 'center', gap: '8px',
                                      fontFamily: "'Inter', sans-serif",
                                  }}
                              >
                                  <Plus size={18} /> Create Video
                              </motion.button>
                         </motion.div>
                     ) : filteredScripts.length === 0 ? (
                         // Filter Empty State
                         <div style={{ padding: '60px 24px', textAlign: 'center' }}>
                             <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1rem', color: '#8A9272' }}>
                                 No scripts found matching your filters.
                             </p>
                             <button
                                onClick={() => { setSearchQuery(''); setSelectedLanguage('All Scripts'); }}
                                style={{
                                    marginTop: '16px', padding: '8px 20px', borderRadius: '8px',
                                    border: '1px solid #C8D5B9', background: 'transparent', color: '#5C7844',
                                    cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontWeight: 500,
                                }}
                             >
                                 Clear Filters
                             </button>
                         </div>
                     ) : (
                         // Grid Layout
                         <motion.div 
                             layout
                             style={{
                                 display: 'grid',
                                 gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                                 gap: '24px',
                             }}
                         >
                             <AnimatePresence>
                                 {filteredScripts.map(script => (
                                     <ScriptCard 
                                        key={script.id} 
                                        script={script} 
                                        onEdit={setEditingScript}
                                        onGenerate={handleGenerate}
                                        onDelete={handleDelete}
                                    />
                                 ))}
                             </AnimatePresence>
                         </motion.div>
                     )}
                </motion.section>

            </main>

            {/* Editing Modal */}
            {editingScript && (
                <EditModal 
                    script={editingScript} 
                    onClose={() => setEditingScript(null)} 
                    onSave={handleSaveEdit}
                />
            )}
        </div>
    )
}
