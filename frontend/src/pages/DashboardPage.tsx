import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Lightbulb, Settings2, ChevronDown, Sparkles, Zap } from 'lucide-react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function DashboardPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [ideaText, setIdeaText] = useState('')
    const navigate = useNavigate()

    const userName = localStorage.getItem('userName') || 'Creator'

    return (
        <div style={{ minHeight: '100vh', background: '#F7F5F0', position: 'relative', overflowX: 'hidden' }}>

            {/* Top Navbar */}
            <Navbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(v => !v)} />

            {/* Sidebar */}
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} activePath="/dashboard" />

            {/* Main content */}
            <main style={{
                position: 'relative', zIndex: 10,
                minHeight: '100vh',
                paddingTop: '96px',
                paddingBottom: '60px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingLeft: '24px',
                paddingRight: '24px',
            }}>

                {/* Greeting */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, ease: EASE }}
                    style={{ textAlign: 'center', marginBottom: '52px' }}
                >
                    <p style={{
                        fontSize: '0.88rem', color: '#5C7844', fontWeight: 500,
                        marginBottom: '10px', letterSpacing: '0.4px',
                        fontFamily: "'Inter', sans-serif",
                    }}>
                        Welcome back 👋
                    </p>
                    <h1 style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                        fontWeight: 700, letterSpacing: '-0.5px', lineHeight: 1.2,
                        color: '#2D3425', margin: 0,
                    }}>
                        Hi {userName},<br />
                        <em style={{ color: '#5C7844', fontStyle: 'italic', fontWeight: 600 }}>
                            What will you create?
                        </em>
                    </h1>
                </motion.div>

                {/* AI Input Card */}
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.15, ease: EASE }}
                    style={{
                        width: '100%', maxWidth: '740px',
                        padding: '24px 28px',
                        borderRadius: '18px',
                        background: '#FFFFFF',
                        border: '1px solid #D6DFC8',
                        boxShadow: '0 4px 28px rgba(61,82,41,0.08)',
                        marginBottom: '28px',
                    }}
                >
                    {/* Top row */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>

                        {/* User avatar */}
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                            background: 'linear-gradient(135deg, #5C7844, #8FAF72)',
                            border: '2px solid #C8D5B9',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontSize: '0.85rem', fontWeight: 700,
                            marginTop: '2px',
                            fontFamily: "'Inter', sans-serif",
                        }}>
                            {userName[0].toUpperCase()}
                        </div>

                        <div style={{ flex: 1 }}>
                            {/* Auto dropdown tag */}
                            <div style={{ marginBottom: '12px' }}>
                                <button style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                                    padding: '4px 12px', borderRadius: '9999px',
                                    background: 'rgba(92,120,68,0.10)',
                                    border: '1px solid #C8D5B9',
                                    color: '#5C7844', fontSize: '0.77rem', fontWeight: 600,
                                    cursor: 'pointer', letterSpacing: '0.3px',
                                    fontFamily: "'Inter', sans-serif",
                                }}>
                                    <Sparkles size={11} />
                                    Auto
                                    <ChevronDown size={11} />
                                </button>
                            </div>

                            {/* Textarea */}
                            <textarea
                                id="idea-input"
                                value={ideaText}
                                onChange={e => setIdeaText(e.target.value)}
                                placeholder="Describe your video idea..."
                                rows={3}
                                style={{
                                    width: '100%', background: 'transparent', border: 'none', outline: 'none',
                                    color: '#2D3425', fontSize: '1rem', lineHeight: 1.7, resize: 'none',
                                    fontFamily: "'Inter', sans-serif",
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>
                    </div>

                    {/* Bottom row */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        marginTop: '16px', paddingTop: '16px',
                        borderTop: '1px solid #E8EFE0',
                    }}>
                        {/* Utility icons */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {[
                                { Icon: Plus, title: 'Add attachment', id: 'add-attachment' },
                                { Icon: Lightbulb, title: 'Idea suggestions', id: 'idea-suggest' },
                                { Icon: Settings2, title: 'Generation settings', id: 'gen-settings' },
                            ].map(({ Icon, title, id }) => (
                                <motion.button
                                    key={title}
                                    id={id}
                                    title={title}
                                    whileHover={{ scale: 1.1, color: '#5C7844' }}
                                    whileTap={{ scale: 0.92 }}
                                    style={{
                                        width: '34px', height: '34px', borderRadius: '9px',
                                        background: '#F7F5F0',
                                        border: '1px solid #D6DFC8',
                                        color: '#8A9272', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'all 0.18s ease',
                                    }}
                                >
                                    <Icon size={15} />
                                </motion.button>
                            ))}
                        </div>

                        {/* Generate button */}
                        <motion.button
                            id="generate-btn"
                            whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(61,82,41,0.22)' }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                padding: '10px 24px', borderRadius: '9999px', border: 'none',
                                background: '#5C7844',
                                color: '#fff', fontSize: '0.88rem', fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '7px',
                                boxShadow: '0 3px 14px rgba(61,82,41,0.18)',
                                transition: 'all 0.22s ease',
                                fontFamily: "'Inter', sans-serif",
                            }}
                            onClick={() => {
                                const params = new URLSearchParams()
                                if (ideaText.trim()) params.set('topic', ideaText.trim())
                                navigate(`/create-video${ideaText.trim() ? '?' + params.toString() : ''}`)
                            }}
                        >
                            <Sparkles size={14} />
                            Generate
                        </motion.button>
                    </div>
                </motion.div>

                {/* Create with AI Studio CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.3, ease: EASE }}
                >
                    <motion.button
                        id="ai-studio-btn"
                        onClick={() => navigate('/create-video')}
                        whileHover={{
                            scale: 1.03,
                            boxShadow: '0 10px 32px rgba(61,82,41,0.22)',
                        }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                            padding: '15px 44px', borderRadius: '9999px', border: 'none',
                            background: '#3D5229',
                            color: '#fff', fontSize: '0.96rem', fontWeight: 600,
                            cursor: 'pointer', letterSpacing: '0.2px',
                            display: 'flex', alignItems: 'center', gap: '10px',
                            boxShadow: '0 4px 20px rgba(61,82,41,0.20)',
                            transition: 'all 0.25s ease',
                            fontFamily: "'Inter', sans-serif",
                        }}
                    >
                        <Zap size={17} />
                        Create with AI Studio
                    </motion.button>
                </motion.div>

            </main>

            <style>{`
        textarea::placeholder { color: #B5BDA8; }
      `}</style>
        </div>
    )
}
