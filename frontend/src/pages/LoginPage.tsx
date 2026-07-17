import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Home } from 'lucide-react'

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleLogin = () => {
        // Temporary: skip credential validation, redirect to dashboard
        navigate('/dashboard')
    }

    return (
        <div style={{
            minHeight: '100vh', background: '#F7F5F0',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '24px 16px',
        }}>

            {/* Home button */}
            <Link
                to="/"
                id="login-home"
                style={{
                    position: 'fixed', top: '20px', left: '24px', zIndex: 50,
                    display: 'inline-flex', alignItems: 'center', gap: '7px',
                    padding: '8px 16px', borderRadius: '9999px',
                    background: 'transparent',
                    border: '1px solid #C8D5B9',
                    color: '#5A6348', fontSize: '0.82rem', fontWeight: 600,
                    textDecoration: 'none', transition: 'all 0.22s ease',
                    fontFamily: "'Inter', sans-serif",
                }}
                onMouseOver={e => {
                    e.currentTarget.style.background = 'rgba(92,120,68,0.07)'
                    e.currentTarget.style.borderColor = '#5C7844'
                    e.currentTarget.style.color = '#3D5229'
                }}
                onMouseOut={e => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.borderColor = '#C8D5B9'
                    e.currentTarget.style.color = '#5A6348'
                }}
            >
                <Home size={14} />
                Home
            </Link>

            {/* Logo */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ marginBottom: '36px', textAlign: 'center' }}
            >
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <h1 style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 'clamp(1.8rem, 5vw, 2.4rem)',
                        fontWeight: 700,
                        color: '#2D3425',
                        letterSpacing: '-0.5px',
                        margin: 0,
                    }}>
                        Script2Screen
                    </h1>
                    <p style={{ marginTop: '4px', fontSize: '0.82rem', color: '#8A9272', letterSpacing: '0.3px' }}>
                        Welcome back
                    </p>
                </Link>
            </motion.div>

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    width: '100%', maxWidth: '420px',
                    padding: '44px 40px',
                    borderRadius: '20px',
                    background: '#FFFFFF',
                    border: '1px solid #D6DFC8',
                    boxShadow: '0 8px 40px rgba(61,82,41,0.08)',
                }}
            >
                <h2 style={{
                    margin: '0 0 28px 0',
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '1.55rem', fontWeight: 700,
                    color: '#2D3425',
                    letterSpacing: '-0.3px',
                }}>
                    Login
                </h2>

                {/* Email */}
                <div style={{ marginBottom: '18px' }}>
                    <label style={labelStyle}>Email</label>
                    <div style={{ position: 'relative' }}>
                        <span style={fieldIconStyle}><Mail size={16} /></span>
                        <input
                            id="login-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            style={inputStyle}
                            onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                            onBlur={e => Object.assign(e.target.style, inputBlurStyle)}
                        />
                    </div>
                </div>

                {/* Password */}
                <div style={{ marginBottom: '10px' }}>
                    <label style={labelStyle}>Password</label>
                    <div style={{ position: 'relative' }}>
                        <span style={fieldIconStyle}><Lock size={16} /></span>
                        <input
                            id="login-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            style={{ ...inputStyle, paddingRight: '44px' }}
                            onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                            onBlur={e => Object.assign(e.target.style, inputBlurStyle)}
                        />
                        <button
                            onClick={() => setShowPassword(v => !v)}
                            style={{
                                position: 'absolute', right: '13px', top: '50%',
                                transform: 'translateY(-50%)', background: 'none',
                                border: 'none', cursor: 'pointer', color: '#8A9272',
                                padding: 0, display: 'flex', alignItems: 'center',
                            }}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                {/* Forgot password */}
                <div style={{ textAlign: 'right', marginBottom: '28px' }}>
                    <Link to="/forgot-password" style={{
                        fontSize: '0.8rem', color: '#5C7844',
                        textDecoration: 'none', fontWeight: 500,
                    }}
                        onMouseOver={e => (e.currentTarget.style.color = '#3D5229')}
                        onMouseOut={e => (e.currentTarget.style.color = '#5C7844')}
                    >
                        Forgot Password?
                    </Link>
                </div>

                {/* Submit */}
                <motion.button
                    id="login-submit"
                    onClick={handleLogin}
                    whileHover={{ scale: 1.01, boxShadow: '0 8px 28px rgba(61,82,41,0.22)' }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                        width: '100%', padding: '13px',
                        borderRadius: '9999px', border: 'none',
                        background: '#5C7844',
                        color: '#fff', fontSize: '0.95rem', fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: '0 4px 18px rgba(61,82,41,0.18)',
                        transition: 'all 0.25s ease',
                        fontFamily: "'Inter', sans-serif",
                        letterSpacing: '0.2px',
                    }}
                >
                    Login
                </motion.button>

                {/* Sign up link */}
                <p style={{
                    marginTop: '22px', textAlign: 'center',
                    fontSize: '0.88rem', color: '#8A9272',
                    fontFamily: "'Inter', sans-serif",
                }}>
                    New user?{' '}
                    <Link to="/signup" style={{ color: '#5C7844', fontWeight: 600, textDecoration: 'none' }}
                        onMouseOver={e => (e.currentTarget.style.color = '#3D5229')}
                        onMouseOut={e => (e.currentTarget.style.color = '#5C7844')}
                    >
                        Sign Up
                    </Link>
                </p>
            </motion.div>

            <style>{`
        input::placeholder { color: #B5BDA8 !important; }
      `}</style>
        </div>
    )
}

const labelStyle: React.CSSProperties = {
    display: 'block', marginBottom: '7px',
    fontSize: '0.82rem', fontWeight: 600,
    color: '#5A6348', letterSpacing: '0.2px',
    fontFamily: "'Inter', sans-serif",
}

const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px 11px 38px',
    borderRadius: '10px',
    border: '1px solid #D6DFC8',
    background: '#F7F5F0',
    color: '#2D3425',
    fontSize: '0.93rem', outline: 'none',
    transition: 'border-color 0.22s ease, box-shadow 0.22s ease',
    boxSizing: 'border-box',
    fontFamily: "'Inter', sans-serif",
}

const inputFocusStyle: React.CSSProperties = {
    borderColor: '#5C7844',
    boxShadow: '0 0 0 3px rgba(92,120,68,0.15)',
    background: '#FFFFFF',
}

const inputBlurStyle: React.CSSProperties = {
    borderColor: '#D6DFC8',
    boxShadow: 'none',
    background: '#F7F5F0',
}

const fieldIconStyle: React.CSSProperties = {
    position: 'absolute', left: '12px', top: '50%',
    transform: 'translateY(-50%)',
    color: '#8A9272',
    display: 'flex', alignItems: 'center', pointerEvents: 'none',
}
