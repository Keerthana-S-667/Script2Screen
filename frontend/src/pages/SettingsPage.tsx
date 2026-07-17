import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    User,
    Mail,
    Edit2,
    Save,
    X,
    Settings as SettingsIcon,
    LogOut,
    AlertTriangle
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

// ── Helpers ───────────────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

// ── Main Component ────────────────────────────────────────────────────────────

export default function SettingsPage() {
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    // Profile State
    const [userName, setUserName] = useState('Creator')
    const [isEditingName, setIsEditingName] = useState(false)
    const [editNameValue, setEditNameValue] = useState('')

    // Preferences State (from Onboarding)
    const [contentType, setContentType] = useState('Not specified')
    const [role, setRole] = useState('Not specified')
    const [platforms, setPlatforms] = useState<string[]>([])

    // Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    // Load Data
    useEffect(() => {
        const storedName = localStorage.getItem('userName')
        if (storedName) setUserName(storedName)

        const storedContentType = localStorage.getItem('contentType')
        if (storedContentType) setContentType(storedContentType)

        const storedRole = localStorage.getItem('role')
        if (storedRole) setRole(storedRole)

        const storedPlatforms = localStorage.getItem('platformPreference')
        if (storedPlatforms) {
            try {
                setPlatforms(JSON.parse(storedPlatforms))
            } catch (e) {
                // fallback
            }
        }
    }, [])

    // Handlers
    const handleEditProfileClick = () => {
        setEditNameValue(userName)
        setIsEditingName(true)
    }

    const handleSaveProfile = () => {
        if (editNameValue.trim()) {
            setUserName(editNameValue.trim())
            localStorage.setItem('userName', editNameValue.trim())
        }
        setIsEditingName(false)
    }

    const handleLogout = () => {
        localStorage.clear()
        navigate('/')
    }

    const handleDeleteAccount = () => {
        localStorage.clear()
        navigate('/')
    }

    // Card Helper Component
    const SettingsCard = ({ title, children, delay = 0 }: { title: string, children: React.ReactNode, delay?: number }) => (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: EASE }}
            style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #D6DFC8',
                boxShadow: '0 4px 20px rgba(61,82,41,0.04)',
                padding: '32px',
                marginBottom: '24px',
            }}
        >
            <h2 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '1.4rem',
                fontWeight: 600,
                color: '#2D3425',
                marginBottom: '24px',
                borderBottom: '1px solid #E8EFE0',
                paddingBottom: '12px',
            }}>
                {title}
            </h2>
            {children}
        </motion.div>
    )

    return (
        <div style={{ minHeight: '100vh', background: '#F7F5F0', position: 'relative', overflowX: 'hidden' }}>
            <Navbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} activePath="/settings" />

            <main style={{
                position: 'relative', zIndex: 10,
                minHeight: '100vh',
                paddingTop: '88px',
                paddingBottom: '80px',
                paddingLeft: 'clamp(20px, 5vw, 64px)',
                paddingRight: 'clamp(20px, 5vw, 64px)',
                maxWidth: '900px',
                margin: '0 auto',
            }}>

                {/* ── Page Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: -18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: EASE }}
                    style={{ marginBottom: '40px' }}
                >
                    <h1 style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
                        fontWeight: 700,
                        color: '#2D3425',
                        marginBottom: '10px',
                    }}>
                        Settings
                    </h1>
                     <p style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '1rem',
                        color: '#5A6348',
                        margin: 0,
                    }}>
                        Manage your account and creator preferences.
                    </p>
                </motion.div>

                {/* ── Section 1: Profile Information ── */}
                <SettingsCard title="Profile Information" delay={0.1}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Name Field */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <label style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', fontWeight: 600, color: '#8A9272', marginBottom: '8px' }}>Name</label>
                                {isEditingName ? (
                                    <input
                                        type="text"
                                        value={editNameValue}
                                        onChange={(e) => setEditNameValue(e.target.value)}
                                        style={{
                                            width: '100%', padding: '10px 14px', borderRadius: '8px',
                                            border: '2px solid #5C7844', background: '#FFFFFF',
                                            fontSize: '1rem', color: '#2D3425', fontFamily: "'Inter', sans-serif", outline: 'none'
                                        }}
                                        autoFocus
                                    />
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F0F4EC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <User size={18} color="#5C7844" />
                                        </div>
                                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.05rem', color: '#2D3425', fontWeight: 500 }}>
                                            {userName}
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Action Button */}
                            <div style={{ display: 'flex', gap: '8px', marginTop: isEditingName ? '24px' : '20px' }}>
                                {isEditingName ? (
                                    <>
                                        <motion.button
                                            onClick={() => setIsEditingName(false)}
                                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                            style={{
                                                padding: '8px 16px', borderRadius: '8px', border: '1px solid #D6DFC8',
                                                background: '#FFFFFF', color: '#5A6348', fontWeight: 500, cursor: 'pointer', fontFamily: "'Inter', sans-serif"
                                            }}
                                        >
                                            <X size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> Cancel
                                        </motion.button>
                                        <motion.button
                                            onClick={handleSaveProfile}
                                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                            style={{
                                                padding: '8px 16px', borderRadius: '8px', border: 'none',
                                                background: '#5C7844', color: '#FFFFFF', fontWeight: 500, cursor: 'pointer', fontFamily: "'Inter', sans-serif"
                                            }}
                                        >
                                            <Save size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> Save
                                        </motion.button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleEditProfileClick}
                                        style={{
                                            padding: '8px 16px', borderRadius: '8px', border: '1px solid #D6DFC8',
                                            background: '#F9FCF5', color: '#3D5229', fontWeight: 500, cursor: 'pointer', 
                                            fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', gap: '6px',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#F0F4EC'}
                                        onMouseLeave={e => e.currentTarget.style.background = '#F9FCF5'}
                                    >
                                        <Edit2 size={14} /> Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Email Field (Read Only) */}
                        <div>
                             <label style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', fontWeight: 600, color: '#8A9272', marginBottom: '8px' }}>Email</label>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F0F4EC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Mail size={18} color="#5C7844" />
                                </div>
                                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.05rem', color: '#5A6348' }}>
                                    creator@example.com <span style={{ fontSize: '0.8rem', color: '#8FAF72', marginLeft: '8px', background: '#F9FCF5', padding: '2px 6px', borderRadius: '4px', border: '1px solid #E8EFE0' }}>Verified</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </SettingsCard>

                {/* ── Section 2: Creator Preferences ── */}
                <SettingsCard title="Creator Preferences" delay={0.2}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '24px' }}>
                        <div>
                             <label style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', fontWeight: 600, color: '#8A9272', marginBottom: '8px' }}>Content Type</label>
                             <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.05rem', color: '#2D3425', margin: 0, fontWeight: 500 }}>{contentType}</p>
                        </div>
                        <div>
                             <label style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', fontWeight: 600, color: '#8A9272', marginBottom: '8px' }}>Role</label>
                             <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.05rem', color: '#2D3425', margin: 0, fontWeight: 500 }}>{role}</p>
                        </div>
                        <div>
                             <label style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', fontWeight: 600, color: '#8A9272', marginBottom: '8px' }}>Platforms</label>
                             <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                 {platforms.length > 0 ? platforms.map(p => (
                                     <span key={p} style={{
                                         background: '#F0F4EC', color: '#5C7844', padding: '4px 10px', borderRadius: '6px',
                                         fontSize: '0.85rem', fontWeight: 600, fontFamily: "'Inter', sans-serif"
                                     }}>
                                         {p}
                                     </span>
                                 )) : (
                                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.05rem', color: '#2D3425', margin: 0, fontWeight: 500 }}>Not specified</p>
                                 )}
                             </div>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/onboarding/step1')}
                        style={{
                            padding: '10px 20px', borderRadius: '8px', border: '1px solid #D6DFC8',
                            background: '#F9FCF5', color: '#3D5229', fontWeight: 500, cursor: 'pointer', 
                            fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', gap: '8px',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#F0F4EC'}
                        onMouseLeave={e => e.currentTarget.style.background = '#F9FCF5'}
                    >
                        <SettingsIcon size={16} /> Edit Preferences
                    </button>
                </SettingsCard>

                {/* ── Section 3: Account Actions ── */}
                <SettingsCard title="Account Actions" delay={0.3}>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.95rem', color: '#5A6348', marginBottom: '20px' }}>
                        Log out of your account on this device.
                    </p>
                    <motion.button
                        onClick={handleLogout}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        style={{
                            padding: '12px 24px', borderRadius: '8px', border: '1px solid #D6DFC8',
                            background: '#FFFFFF', color: '#5A6348', fontWeight: 600, cursor: 'pointer', 
                            fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', gap: '10px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                        }}
                    >
                        <LogOut size={18} /> Logout
                    </motion.button>
                </SettingsCard>

                {/* ── Section 4: Danger Zone ── */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4, ease: EASE }}
                    style={{
                        background: '#FFF5F5',
                        borderRadius: '16px',
                        border: '1px solid #FBCFE8',
                        padding: '32px',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                         <AlertTriangle size={24} color="#E11D48" />
                         <h2 style={{
                            fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.4rem',
                            fontWeight: 600, color: '#9F1239', margin: 0
                        }}>
                            Danger Zone
                        </h2>
                    </div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.95rem', color: '#BE123C', marginBottom: '24px' }}>
                        Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <motion.button
                        onClick={() => setShowDeleteModal(true)}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        style={{
                            padding: '12px 24px', borderRadius: '8px', border: 'none',
                            background: '#E11D48', color: '#FFFFFF', fontWeight: 600, cursor: 'pointer', 
                            fontFamily: "'Inter', sans-serif",
                            boxShadow: '0 4px 12px rgba(225,29,72,0.2)'
                        }}
                    >
                        Delete Account
                    </motion.button>
                </motion.div>

            </main>

            {/* ── Discard Modal Overlay ── */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 200,
                            background: 'rgba(45,52,37,0.55)', backdropFilter: 'blur(6px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
                        }}
                        onMouseDown={() => setShowDeleteModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            onMouseDown={(e) => e.stopPropagation()}
                            style={{
                                background: '#FFFFFF', borderRadius: '20px', border: '1px solid #FBCFE8',
                                boxShadow: '0 24px 64px rgba(225,29,72,0.15)', width: '100%', maxWidth: '440px',
                                padding: '32px', textAlign: 'center'
                            }}
                        >
                            <div style={{
                                width: '64px', height: '64px', borderRadius: '50%', background: '#FFF0F2',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto'
                            }}>
                                <AlertTriangle size={32} color="#E11D48" />
                            </div>
                            
                            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.4rem', fontWeight: 700, color: '#2D3425', margin: '0 0 12px 0' }}>
                                Delete Account?
                            </h2>
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.95rem', color: '#5A6348', margin: '0 0 32px 0', lineHeight: 1.5 }}>
                                Are you sure you want to delete your account? This action cannot be undone and all your simulated data will be lost.
                            </p>

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                <motion.button
                                    onClick={() => setShowDeleteModal(false)}
                                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                    style={{
                                        flex: 1, padding: '12px 0', borderRadius: '9999px',
                                        border: '1px solid #D6DFC8', background: '#FFFFFF', color: '#5A6348',
                                        fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                                    }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    onClick={handleDeleteAccount}
                                    whileHover={{ scale: 1.02, boxShadow: '0 4px 14px rgba(225,29,72,0.2)' }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{
                                        flex: 1, padding: '12px 0', borderRadius: '9999px',
                                        border: 'none', background: '#E11D48', color: '#fff',
                                        fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                                    }}
                                >
                                    Delete
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    )
}
