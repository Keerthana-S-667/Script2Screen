import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, User, LogOut } from 'lucide-react'

interface NavbarProps {
    sidebarOpen: boolean
    onToggleSidebar: () => void
}

export default function Navbar({ sidebarOpen, onToggleSidebar }: NavbarProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('userName')
        setDropdownOpen(false)
        navigate('/')
    }

    const handleMyProfile = () => {
        setDropdownOpen(false)
        navigate('/profile')
    }

    return (
        <nav
            id="dashboard-navbar"
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 28px',
                height: '64px',
                background: 'rgba(247, 245, 240, 0.95)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderBottom: '1px solid #D6DFC8',
                boxShadow: '0 1px 12px rgba(61, 82, 41, 0.06)',
            }}
        >
            {/* Left: hamburger */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <motion.button
                    id="sidebar-toggle"
                    onClick={onToggleSidebar}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.93 }}
                    style={{
                        background: 'rgba(92, 120, 68, 0.08)',
                        border: '1px solid #C8D5B9',
                        borderRadius: '10px',
                        width: '38px', height: '38px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: '#5C7844',
                        transition: 'all 0.2s ease',
                    }}
                    aria-label="Toggle sidebar"
                >
                    <AnimatePresence mode="wait">
                        {sidebarOpen ? (
                            <motion.span key="x" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
                                <X size={18} />
                            </motion.span>
                        ) : (
                            <motion.span key="menu" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.2 }}>
                                <Menu size={18} />
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>

                <Link to="/" style={{ textDecoration: 'none' }}>
                    <span style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontWeight: 700,
                        fontSize: '1.2rem',
                        letterSpacing: '-0.3px',
                        color: '#2D3425',
                    }}>
                        Script2Screen
                    </span>
                </Link>
            </div>

            {/* Right: profile with dropdown */}
            <div ref={dropdownRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <motion.button
                    id="profile-icon-btn"
                    onClick={() => setDropdownOpen(v => !v)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #5C7844, #8FAF72)',
                        border: '2px solid #C8D5B9',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: '#fff',
                        transition: 'all 0.25s ease',
                        outline: 'none',
                        boxShadow: dropdownOpen ? '0 0 0 3px rgba(92,120,68,0.2)' : 'none',
                    }}
                    aria-label="Profile menu"
                    aria-expanded={dropdownOpen}
                >
                    <User size={17} />
                </motion.button>

                {/* Dropdown */}
                <AnimatePresence>
                    {dropdownOpen && (
                        <motion.div
                            id="profile-dropdown"
                            initial={{ opacity: 0, y: -8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.96 }}
                            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                            style={{
                                position: 'absolute',
                                top: 'calc(100% + 10px)',
                                right: 0,
                                minWidth: '160px',
                                background: '#FFFFFF',
                                borderRadius: '14px',
                                border: '1px solid #D6DFC8',
                                boxShadow: '0 8px 32px rgba(61,82,41,0.14)',
                                overflow: 'hidden',
                                zIndex: 200,
                            }}
                        >
                            <DropdownItem
                                id="dropdown-my-profile"
                                icon={<User size={14} />}
                                label="My Profile"
                                onClick={handleMyProfile}
                            />
                            <div style={{ height: '1px', background: '#EAEFE0', margin: '0 12px' }} />
                            <DropdownItem
                                id="dropdown-logout"
                                icon={<LogOut size={14} />}
                                label="Logout"
                                onClick={handleLogout}
                                danger
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    )
}

interface DropdownItemProps {
    id: string
    icon: React.ReactNode
    label: string
    onClick: () => void
    danger?: boolean
}

function DropdownItem({ id, icon, label, onClick, danger }: DropdownItemProps) {
    const [hovered, setHovered] = useState(false)
    const color = danger ? '#c0392b' : '#2D3425'
    const hoverBg = danger ? 'rgba(192,57,43,0.06)' : 'rgba(92,120,68,0.07)'

    return (
        <button
            id={id}
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                width: '100%',
                display: 'flex', alignItems: 'center', gap: '9px',
                padding: '11px 16px',
                background: hovered ? hoverBg : 'transparent',
                border: 'none', cursor: 'pointer',
                color: hovered ? color : danger ? '#c0392b' : '#5A6348',
                fontSize: '0.875rem', fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
                textAlign: 'left',
                transition: 'background 0.15s ease, color 0.15s ease',
            }}
        >
            {icon}
            {label}
        </button>
    )
}
