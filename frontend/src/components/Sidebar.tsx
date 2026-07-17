import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    Video,
    Film,
    UserCircle2,
    FileText,
    BarChart2,
    Settings,
    LogOut,
} from 'lucide-react'

interface SidebarProps {
    open: boolean
    onClose: () => void
    activePath?: string
}

const NAV_ITEMS = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Create Video', icon: Video, href: '/create-video' },
    { label: 'My Videos', icon: Film, href: '/my-videos' },
    { label: 'Avatars', icon: UserCircle2, href: '/avatars' },
    { label: 'Scripts', icon: FileText, href: '/scripts' },
    { label: 'Analytics', icon: BarChart2, href: '/analytics' },
    { label: 'Settings', icon: Settings, href: '/settings' },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function Sidebar({ open, onClose, activePath }: SidebarProps) {
    const navigate = useNavigate()

    function handleNav(href: string) {
        navigate(href)
        onClose()
    }

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={false}
                animate={{ opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
                transition={{ duration: 0.3 }}
                onClick={onClose}
                style={{
                    position: 'fixed', inset: 0, zIndex: 90,
                    background: 'rgba(45, 52, 37, 0.25)',
                    backdropFilter: 'blur(2px)',
                }}
            />

            {/* Sliding panel */}
            <motion.aside
                id="sidebar"
                initial={false}
                animate={{ x: open ? 0 : '-100%' }}
                transition={{ type: 'tween', duration: 0.35, ease: EASE }}
                style={{
                    position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 95,
                    width: '260px',
                    background: '#F7F5F0',
                    borderRight: '1px solid #D6DFC8',
                    boxShadow: '4px 0 32px rgba(61, 82, 41, 0.10)',
                    display: 'flex',
                    flexDirection: 'column',
                    paddingTop: '64px',
                }}
            >
                {/* Olive accent strip at top */}
                <div style={{
                    height: '3px',
                    background: 'linear-gradient(90deg, #5C7844, #8FAF72, transparent)',
                    position: 'absolute', top: 0, left: 0, right: 0,
                }} />

                {/* Brand area */}
                <div style={{
                    padding: '20px 20px 8px',
                    borderBottom: '1px solid #E8EFE0',
                }}>
                    <span style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontWeight: 700,
                        fontSize: '1rem',
                        letterSpacing: '-0.2px',
                        color: '#2D3425',
                    }}>
                        Script2Screen
                    </span>
                </div>

                {/* Nav items */}
                <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 12px 0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {NAV_ITEMS.map((item, i) => {
                        const Icon = item.icon
                        const isActive = activePath === item.href
                        return (
                            <motion.button
                                key={item.href}
                                id={`sidebar-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                                onClick={() => handleNav(item.href)}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: open ? 1 : 0, x: open ? 0 : -20 }}
                                transition={{ delay: open ? i * 0.04 : 0, duration: 0.3, ease: EASE }}
                                whileHover={{ x: 3, backgroundColor: 'rgba(92,120,68,0.08)' }}
                                style={{
                                    width: '100%',
                                    display: 'flex', alignItems: 'center', gap: '11px',
                                    padding: '11px 13px', borderRadius: '10px',
                                    border: isActive ? '1px solid #C8D5B9' : '1px solid transparent',
                                    background: isActive ? 'rgba(92, 120, 68, 0.10)' : 'transparent',
                                    color: isActive ? '#3D5229' : '#5A6348',
                                    fontSize: '0.88rem', fontWeight: isActive ? 600 : 500,
                                    cursor: 'pointer', textAlign: 'left',
                                    transition: 'all 0.18s ease',
                                    fontFamily: "'Inter', sans-serif",
                                }}
                            >
                                <Icon size={17} style={{ flexShrink: 0, color: isActive ? '#5C7844' : '#8A9272' }} />
                                {item.label}
                                {isActive && (
                                    <div style={{
                                        marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%',
                                        background: '#5C7844',
                                    }} />
                                )}
                            </motion.button>
                        )
                    })}
                </nav>

                {/* Pinned logout */}
                <div style={{ padding: '16px', borderTop: '1px solid #E8EFE0' }}>
                    <motion.button
                        id="sidebar-logout"
                        onClick={() => { navigate('/login') }}
                        whileHover={{ scale: 1.01, backgroundColor: 'rgba(185, 60, 60, 0.06)' }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                            width: '100%', padding: '11px 13px', borderRadius: '10px',
                            border: '1px solid rgba(185, 80, 80, 0.25)',
                            background: 'transparent',
                            color: '#9B5050', fontSize: '0.88rem', fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '11px',
                            transition: 'all 0.2s ease',
                            fontFamily: "'Inter', sans-serif",
                        }}
                    >
                        <LogOut size={16} />
                        Logout
                    </motion.button>
                </div>
            </motion.aside>
        </>
    )
}
