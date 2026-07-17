import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { User, ChevronLeft } from 'lucide-react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { useState } from 'react'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function ProfilePage() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const navigate = useNavigate()
    const userName = localStorage.getItem('userName') || 'Creator'

    return (
        <div style={{ minHeight: '100vh', background: '#F7F5F0', position: 'relative', overflowX: 'hidden' }}>

            <Navbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(v => !v)} />
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} activePath="/profile" />

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

                {/* Back button */}
                <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    style={{ alignSelf: 'flex-start', marginBottom: '32px', maxWidth: '520px', width: '100%' }}
                >
                    <button
                        id="profile-back-btn"
                        onClick={() => navigate('/dashboard')}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            background: 'transparent', border: 'none', cursor: 'pointer',
                            color: '#5C7844', fontSize: '0.85rem', fontWeight: 600,
                            fontFamily: "'Inter', sans-serif", padding: '4px 0',
                            transition: 'color 0.2s ease',
                        }}
                        onMouseOver={e => (e.currentTarget.style.color = '#3D5229')}
                        onMouseOut={e => (e.currentTarget.style.color = '#5C7844')}
                    >
                        <ChevronLeft size={16} />
                        Back to Dashboard
                    </button>
                </motion.div>

                {/* Profile card */}
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.08, ease: EASE }}
                    style={{
                        width: '100%', maxWidth: '520px',
                        padding: '44px 40px',
                        borderRadius: '20px',
                        background: '#FFFFFF',
                        border: '1px solid #D6DFC8',
                        boxShadow: '0 8px 40px rgba(61,82,41,0.08)',
                    }}
                >
                    {/* Avatar */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            style={{
                                width: '80px', height: '80px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, #5C7844, #8FAF72)',
                                border: '3px solid #C8D5B9',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', fontSize: '2rem', fontWeight: 700,
                                marginBottom: '16px',
                                boxShadow: '0 4px 20px rgba(61,82,41,0.18)',
                                fontFamily: "'Inter', sans-serif",
                            }}
                        >
                            {userName[0].toUpperCase()}
                        </motion.div>
                        <h1 style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: '1.6rem', fontWeight: 700,
                            color: '#2D3425', margin: '0 0 4px 0',
                            letterSpacing: '-0.3px',
                        }}>
                            {userName}
                        </h1>
                        <p style={{
                            fontSize: '0.84rem', color: '#8A9272',
                            margin: 0,
                            fontFamily: "'Inter', sans-serif",
                        }}>
                            Script2Screen Creator
                        </p>
                    </div>

                    {/* Placeholder notice */}
                    <div style={{
                        padding: '18px 20px',
                        borderRadius: '12px',
                        background: 'rgba(92,120,68,0.07)',
                        border: '1px solid #C8D5B9',
                        display: 'flex', alignItems: 'flex-start', gap: '12px',
                    }}>
                        <User size={18} style={{ color: '#5C7844', marginTop: '1px', flexShrink: 0 }} />
                        <div>
                            <p style={{
                                margin: '0 0 4px 0',
                                fontSize: '0.88rem', fontWeight: 600,
                                color: '#3D5229',
                                fontFamily: "'Inter', sans-serif",
                            }}>
                                Profile Settings Coming Soon
                            </p>
                            <p style={{
                                margin: 0,
                                fontSize: '0.82rem', color: '#7A8A68',
                                lineHeight: 1.6,
                                fontFamily: "'Inter', sans-serif",
                            }}>
                                This page is a placeholder. Full profile management — including avatar upload, bio, and account settings — will be available once backend integration is complete.
                            </p>
                        </div>
                    </div>
                </motion.div>

            </main>
        </div>
    )
}
