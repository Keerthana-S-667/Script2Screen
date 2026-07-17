import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Film,
    Video,
    Download,
    Trash2,
    Play,
    Edit3,
    X,
    Clock,
    Globe,
    User,
    Calendar,
    Plus,
    AlertCircle,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

// ── Types ────────────────────────────────────────────────────────────────────

type VideoStatus = 'draft' | 'completed'

interface VideoItem {
    id: string
    title: string
    status: VideoStatus
    draftStep?: string
    language?: string
    avatar?: string
    createdAt: string // ISO string
    thumbnail?: string
}

// ── Simulated seed data ───────────────────────────────────────────────────────

const SEED_VIDEOS: VideoItem[] = [
    {
        id: '1',
        title: 'Introduction to Machine Learning',
        status: 'completed',
        language: 'English',
        avatar: 'Nova',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: '2',
        title: 'How Blockchain Works',
        status: 'completed',
        language: 'Spanish',
        avatar: 'Aria',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: '3',
        title: 'Healthy Morning Routines',
        status: 'draft',
        draftStep: 'Script Generated',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: '4',
        title: 'Top 10 Travel Destinations 2025',
        status: 'draft',
        draftStep: 'Avatar Selected',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
]

const STORAGE_KEY = 's2s_my_videos'

function loadVideos(): VideoItem[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) return JSON.parse(raw) as VideoItem[]
    } catch {
        // ignore
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_VIDEOS))
    return SEED_VIDEOS
}

function saveVideos(videos: VideoItem[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos))
}

// ── Helpers ───────────────────────────────────────────────────────────────────

type TabFilter = 'all' | 'draft' | 'completed'

const TABS: { id: TabFilter; label: string }[] = [
    { id: 'all', label: 'All Videos' },
    { id: 'draft', label: 'Drafts' },
    { id: 'completed', label: 'Completed' },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

function formatDate(iso: string) {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ── Thumbnail Placeholder ─────────────────────────────────────────────────────

function ThumbnailPlaceholder({ title, isDraft }: { title: string; isDraft: boolean }) {
    const initials = title
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? '')
        .join('')

    return (
        <div
            style={{
                width: '100%',
                aspectRatio: '16/9',
                borderRadius: '10px 10px 0 0',
                background: isDraft
                    ? 'linear-gradient(135deg, #E8EFE0, #D6DFC8)'
                    : 'linear-gradient(135deg, #3D5229, #5C7844)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background pattern */}
            <div style={{
                position: 'absolute', inset: 0, opacity: 0.08,
                backgroundImage: 'radial-gradient(circle at 30% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 70%, white 1px, transparent 1px)',
                backgroundSize: '32px 32px',
            }} />

            <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: isDraft ? 'rgba(92,120,68,0.15)' : 'rgba(255,255,255,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(4px)',
            }}>
                {isDraft
                    ? <Video size={22} color="#5C7844" />
                    : <Play size={22} color="#fff" fill="#fff" />}
            </div>

            <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.72rem',
                fontWeight: 700,
                color: isDraft ? '#5A6348' : 'rgba(255,255,255,0.8)',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
            }}>
                {initials}
            </span>

            {isDraft && (
                <div style={{
                    position: 'absolute', top: '10px', left: '10px',
                    background: 'rgba(255,255,255,0.85)',
                    borderRadius: '6px',
                    padding: '3px 9px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    color: '#5A6348',
                    letterSpacing: '0.5px',
                    fontFamily: "'Inter', sans-serif",
                }}>
                    DRAFT
                </div>
            )}
        </div>
    )
}

// ── Draft Card ────────────────────────────────────────────────────────────────

function DraftCard({ video, onDelete }: { video: VideoItem; onDelete: (id: string) => void }) {
    const navigate = useNavigate()

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: EASE }}
            style={{
                background: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #D6DFC8',
                boxShadow: '0 2px 16px rgba(61,82,41,0.07)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <ThumbnailPlaceholder title={video.title} isDraft />

            <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Title */}
                <h3 style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#2D3425',
                    lineHeight: 1.35,
                    margin: 0,
                }}>
                    {video.title}
                </h3>

                {/* Meta row */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={12} color="#8FAF72" />
                        <span style={{ fontSize: '0.77rem', color: '#5A6348', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>
                            {video.draftStep}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={12} color="#8A9272" />
                        <span style={{ fontSize: '0.75rem', color: '#8A9272', fontFamily: "'Inter', sans-serif" }}>
                            {formatDate(video.createdAt)}
                        </span>
                    </div>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '4px' }}>
                    <motion.button
                        id={`draft-continue-${video.id}`}
                        onClick={() => navigate('/create-video')}
                        whileHover={{ scale: 1.02, boxShadow: '0 4px 14px rgba(61,82,41,0.18)' }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                            flex: 1,
                            padding: '9px 12px',
                            borderRadius: '9px',
                            border: 'none',
                            background: '#5C7844',
                            color: '#fff',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            fontFamily: "'Inter', sans-serif",
                            transition: 'all 0.18s ease',
                        }}
                    >
                        <Edit3 size={13} />
                        Continue Editing
                    </motion.button>

                    <motion.button
                        id={`draft-delete-${video.id}`}
                        onClick={() => onDelete(video.id)}
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(185,60,60,0.08)' }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            width: '36px', height: '36px', flexShrink: 0,
                            borderRadius: '9px',
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
                        <Trash2 size={14} />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}

// ── Completed Card ────────────────────────────────────────────────────────────

function CompletedCard({ video, onDelete, onPreview }: {
    video: VideoItem
    onDelete: (id: string) => void
    onPreview: (video: VideoItem) => void
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
                borderRadius: '14px',
                border: '1px solid #D6DFC8',
                boxShadow: '0 2px 16px rgba(61,82,41,0.07)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Clickable thumbnail */}
            <div
                onClick={() => onPreview(video)}
                style={{ cursor: 'pointer', position: 'relative' }}
            >
                <ThumbnailPlaceholder title={video.title} isDraft={false} />
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0)',
                    borderRadius: '10px 10px 0 0',
                    transition: 'background 0.2s ease',
                }}
                    className="completed-thumb-hover"
                />
            </div>

            <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Title */}
                <h3 style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#2D3425',
                    lineHeight: 1.35,
                    margin: 0,
                }}>
                    {video.title}
                </h3>

                {/* Meta */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {video.language && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Globe size={12} color="#8FAF72" />
                            <span style={{ fontSize: '0.77rem', color: '#5A6348', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>
                                {video.language}
                            </span>
                        </div>
                    )}
                    {video.avatar && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <User size={12} color="#8FAF72" />
                            <span style={{ fontSize: '0.77rem', color: '#5A6348', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>
                                {video.avatar}
                            </span>
                        </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={12} color="#8A9272" />
                        <span style={{ fontSize: '0.75rem', color: '#8A9272', fontFamily: "'Inter', sans-serif" }}>
                            {formatDate(video.createdAt)}
                        </span>
                    </div>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '4px' }}>
                    <motion.button
                        id={`completed-preview-${video.id}`}
                        onClick={() => onPreview(video)}
                        whileHover={{ scale: 1.02, boxShadow: '0 4px 14px rgba(61,82,41,0.18)' }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                            flex: 1,
                            padding: '9px 12px',
                            borderRadius: '9px',
                            border: 'none',
                            background: '#5C7844',
                            color: '#fff',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            fontFamily: "'Inter', sans-serif",
                            transition: 'all 0.18s ease',
                        }}
                    >
                        <Play size={13} fill="#fff" />
                        Preview
                    </motion.button>

                    <motion.button
                        id={`completed-download-${video.id}`}
                        title="Download video"
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(92,120,68,0.10)' }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            width: '36px', height: '36px', flexShrink: 0,
                            borderRadius: '9px',
                            border: '1px solid #C8D5B9',
                            background: 'transparent',
                            color: '#5C7844',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.18s ease',
                        }}
                    >
                        <Download size={14} />
                    </motion.button>

                    <motion.button
                        id={`completed-delete-${video.id}`}
                        onClick={() => onDelete(video.id)}
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(185,60,60,0.08)' }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            width: '36px', height: '36px', flexShrink: 0,
                            borderRadius: '9px',
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
                        <Trash2 size={14} />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}

// ── Preview Modal ─────────────────────────────────────────────────────────────

function PreviewModal({ video, onClose }: { video: VideoItem; onClose: () => void }) {
    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [onClose])

    return (
        <AnimatePresence>
            <motion.div
                id="preview-modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
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
                    id="preview-modal-content"
                    initial={{ opacity: 0, scale: 0.92, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 20 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        background: '#FFFFFF',
                        borderRadius: '20px',
                        border: '1px solid #D6DFC8',
                        boxShadow: '0 24px 64px rgba(61,82,41,0.22)',
                        width: '100%',
                        maxWidth: '660px',
                        overflow: 'hidden',
                    }}
                >
                    {/* Modal header */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '18px 22px',
                        borderBottom: '1px solid #E8EFE0',
                    }}>
                        <h2 style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            color: '#2D3425',
                            margin: 0,
                            maxWidth: '80%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}>
                            {video.title}
                        </h2>
                        <motion.button
                            id="preview-modal-close"
                            onClick={onClose}
                            whileHover={{ scale: 1.1, backgroundColor: '#F7F5F0' }}
                            whileTap={{ scale: 0.92 }}
                            style={{
                                width: '34px', height: '34px', borderRadius: '9px',
                                border: '1px solid #D6DFC8',
                                background: 'transparent',
                                color: '#5A6348',
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.18s ease',
                                flexShrink: 0,
                            }}
                        >
                            <X size={16} />
                        </motion.button>
                    </div>

                    {/* Video player area */}
                    <div style={{ padding: '22px' }}>
                        <div style={{
                            width: '100%',
                            aspectRatio: '16/9',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #2D3425, #3D5229, #5C7844)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            position: 'relative',
                            overflow: 'hidden',
                            border: '1px solid #D6DFC8',
                        }}>
                            {/* Background pattern */}
                            <div style={{
                                position: 'absolute', inset: 0,
                                backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.05) 1px, transparent 1px)',
                                backgroundSize: '28px 28px',
                            }} />

                            {/* Play button */}
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                style={{
                                    width: '72px', height: '72px', borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.18)',
                                    border: '2px solid rgba(255,255,255,0.35)',
                                    backdropFilter: 'blur(8px)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer',
                                }}
                            >
                                <Play size={30} color="#fff" fill="#fff" style={{ marginLeft: '3px' }} />
                            </motion.div>

                            <p style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: '0.82rem',
                                color: 'rgba(255,255,255,0.6)',
                                margin: 0,
                            }}>
                                Video preview placeholder
                            </p>

                            {/* Meta pills */}
                            <div style={{ display: 'flex', gap: '8px', position: 'absolute', bottom: '14px', left: '14px' }}>
                                {video.language && (
                                    <span style={{
                                        padding: '4px 10px', borderRadius: '9999px',
                                        background: 'rgba(255,255,255,0.15)',
                                        backdropFilter: 'blur(4px)',
                                        color: 'rgba(255,255,255,0.85)',
                                        fontSize: '0.72rem', fontWeight: 600,
                                        fontFamily: "'Inter', sans-serif",
                                    }}>
                                        {video.language}
                                    </span>
                                )}
                                {video.avatar && (
                                    <span style={{
                                        padding: '4px 10px', borderRadius: '9999px',
                                        background: 'rgba(255,255,255,0.15)',
                                        backdropFilter: 'blur(4px)',
                                        color: 'rgba(255,255,255,0.85)',
                                        fontSize: '0.72rem', fontWeight: 600,
                                        fontFamily: "'Inter', sans-serif",
                                    }}>
                                        {video.avatar}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Modal actions */}
                        <div style={{ display: 'flex', gap: '10px', marginTop: '16px', justifyContent: 'flex-end' }}>
                            <motion.button
                                id="modal-download-btn"
                                whileHover={{ scale: 1.02, boxShadow: '0 4px 14px rgba(61,82,41,0.18)' }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    padding: '10px 22px',
                                    borderRadius: '9999px',
                                    border: 'none',
                                    background: '#5C7844',
                                    color: '#fff',
                                    fontSize: '0.86rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '7px',
                                    fontFamily: "'Inter', sans-serif",
                                    boxShadow: '0 3px 10px rgba(61,82,41,0.15)',
                                    transition: 'all 0.18s ease',
                                }}
                            >
                                <Download size={14} />
                                Download
                            </motion.button>

                            <motion.button
                                id="modal-close-btn"
                                onClick={onClose}
                                whileHover={{ scale: 1.02, backgroundColor: '#EDE9E1' }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    padding: '10px 22px',
                                    borderRadius: '9999px',
                                    border: '1px solid #D6DFC8',
                                    background: '#F7F5F0',
                                    color: '#5A6348',
                                    fontSize: '0.86rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    fontFamily: "'Inter', sans-serif",
                                    transition: 'all 0.18s ease',
                                }}
                            >
                                Close
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState() {
    const navigate = useNavigate()
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '80px 24px',
                gap: '20px',
            }}
        >
            <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'rgba(92,120,68,0.10)',
                border: '2px solid #C8D5B9',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <Film size={32} color="#8FAF72" />
            </div>

            <div>
                <p style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: '#2D3425',
                    marginBottom: '8px',
                }}>
                    You haven't created any videos yet.
                </p>
                <p style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.88rem',
                    color: '#8A9272',
                }}>
                    Start your first video to see it here.
                </p>
            </div>

            <motion.button
                id="empty-state-create-btn"
                onClick={() => navigate('/create-video')}
                whileHover={{ scale: 1.04, boxShadow: '0 8px 24px rgba(61,82,41,0.20)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                    padding: '12px 30px',
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
                    boxShadow: '0 3px 14px rgba(61,82,41,0.18)',
                    transition: 'all 0.22s ease',
                }}
            >
                <Plus size={16} />
                Create Video
            </motion.button>
        </motion.div>
    )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function MyVideosPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<TabFilter>('all')
    const [videos, setVideos] = useState<VideoItem[]>(() => loadVideos())
    const [previewVideo, setPreviewVideo] = useState<VideoItem | null>(null)

    // Persist on change
    useEffect(() => {
        saveVideos(videos)
    }, [videos])

    function handleDelete(id: string) {
        setVideos((prev) => prev.filter((v) => v.id !== id))
    }

    const filtered = videos.filter((v) => {
        if (activeTab === 'all') return true
        return v.status === activeTab
    })

    const drafts = filtered.filter((v) => v.status === 'draft')
    const completed = filtered.filter((v) => v.status === 'completed')
    const hasDrafts = drafts.length > 0
    const hasCompleted = completed.length > 0
    const isEmpty = filtered.length === 0

    return (
        <div style={{ minHeight: '100vh', background: '#F7F5F0', position: 'relative', overflowX: 'hidden' }}>

            {/* Navbar */}
            <Navbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((v) => !v)} />

            {/* Sidebar */}
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} activePath="/my-videos" />

            {/* Main */}
            <main style={{
                position: 'relative', zIndex: 10,
                minHeight: '100vh',
                paddingTop: '88px',
                paddingBottom: '72px',
                paddingLeft: 'clamp(20px, 5vw, 64px)',
                paddingRight: 'clamp(20px, 5vw, 64px)',
                maxWidth: '1200px',
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
                        marginBottom: '8px',
                    }}>
                        My Videos
                    </h1>
                    <p style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.92rem',
                        color: '#8A9272',
                        fontWeight: 400,
                    }}>
                        Manage your generated videos and unfinished drafts.
                    </p>
                </motion.div>

                {/* ── Filter Tabs ── */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.1, ease: EASE }}
                    style={{
                        display: 'flex',
                        gap: '4px',
                        marginBottom: '32px',
                        background: '#FFFFFF',
                        border: '1px solid #D6DFC8',
                        borderRadius: '12px',
                        padding: '4px',
                        width: 'fit-content',
                        boxShadow: '0 2px 10px rgba(61,82,41,0.06)',
                    }}
                >
                    {TABS.map((tab) => {
                        const isActive = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                id={`tab-${tab.id}`}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    padding: '8px 20px',
                                    borderRadius: '9px',
                                    border: 'none',
                                    background: isActive ? '#5C7844' : 'transparent',
                                    color: isActive ? '#fff' : '#5A6348',
                                    fontSize: '0.85rem',
                                    fontWeight: isActive ? 600 : 500,
                                    cursor: 'pointer',
                                    fontFamily: "'Inter', sans-serif",
                                    transition: 'all 0.2s ease',
                                    letterSpacing: '0.1px',
                                    opacity: isActive ? 1 : 0.6,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                }}
                            >
                                {tab.label}
                                {/* Count badge */}
                                {tab.id !== 'all' && (
                                    <span style={{
                                        marginLeft: '7px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '19px',
                                        height: '19px',
                                        borderRadius: '50%',
                                        fontSize: '0.7rem',
                                        fontWeight: 700,
                                        background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(92,120,68,0.12)',
                                        color: isActive ? '#fff' : '#5C7844',
                                    }}>
                                        {tab.id === 'draft'
                                            ? videos.filter((v) => v.status === 'draft').length
                                            : videos.filter((v) => v.status === 'completed').length}
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </motion.div>

                {/* ── Content ── */}
                <AnimatePresence mode="wait">
                    {isEmpty ? (
                        <EmptyState key="empty" />
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: EASE }}
                        >
                            {/* ── Drafts section ── */}
                            {hasDrafts && (
                                <div style={{ marginBottom: '40px' }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        marginBottom: '16px',
                                    }}>
                                        <h2 style={{
                                            fontFamily: "'Playfair Display', Georgia, serif",
                                            fontSize: '1.15rem',
                                            fontWeight: 700,
                                            color: '#2D3425',
                                            margin: 0,
                                        }}>
                                            Drafts
                                        </h2>
                                        <span style={{
                                            padding: '3px 10px',
                                            borderRadius: '9999px',
                                            background: 'rgba(92,120,68,0.10)',
                                            border: '1px solid #C8D5B9',
                                            fontSize: '0.74rem',
                                            fontWeight: 700,
                                            color: '#5C7844',
                                            fontFamily: "'Inter', sans-serif",
                                        }}>
                                            {drafts.length}
                                        </span>

                                        {/* 7-day warning */}
                                        <div style={{
                                            marginLeft: 'auto',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '5px 12px',
                                            borderRadius: '8px',
                                            background: 'rgba(185,140,60,0.08)',
                                            border: '1px solid rgba(185,140,60,0.25)',
                                        }}>
                                            <AlertCircle size={13} color="#9B7A30" />
                                            <span style={{
                                                fontSize: '0.76rem', fontWeight: 500,
                                                color: '#9B7A30',
                                                fontFamily: "'Inter', sans-serif",
                                            }}>
                                                Drafts are automatically deleted after 7 days.
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                                        gap: '20px',
                                    }}>
                                        <AnimatePresence>
                                            {drafts.map((v) => (
                                                <DraftCard key={v.id} video={v} onDelete={handleDelete} />
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            )}

                            {/* ── Completed section ── */}
                            {hasCompleted && (
                                <div>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        marginBottom: '16px',
                                    }}>
                                        <h2 style={{
                                            fontFamily: "'Playfair Display', Georgia, serif",
                                            fontSize: '1.15rem',
                                            fontWeight: 700,
                                            color: '#2D3425',
                                            margin: 0,
                                        }}>
                                            Completed
                                        </h2>
                                        <span style={{
                                            padding: '3px 10px',
                                            borderRadius: '9999px',
                                            background: 'rgba(92,120,68,0.10)',
                                            border: '1px solid #C8D5B9',
                                            fontSize: '0.74rem',
                                            fontWeight: 700,
                                            color: '#5C7844',
                                            fontFamily: "'Inter', sans-serif",
                                        }}>
                                            {completed.length}
                                        </span>
                                    </div>

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                                        gap: '20px',
                                    }}>
                                        <AnimatePresence>
                                            {completed.map((v) => (
                                                <CompletedCard
                                                    key={v.id}
                                                    video={v}
                                                    onDelete={handleDelete}
                                                    onPreview={setPreviewVideo}
                                                />
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* ── Preview Modal ── */}
            <AnimatePresence>
                {previewVideo && (
                    <PreviewModal video={previewVideo} onClose={() => setPreviewVideo(null)} />
                )}
            </AnimatePresence>

            <style>{`
                .completed-thumb-hover:hover {
                    background: rgba(0,0,0,0.15) !important;
                }
            `}</style>
        </div>
    )
}
