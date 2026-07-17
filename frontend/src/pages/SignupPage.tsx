import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Lock, Eye, EyeOff, CheckCircle2, XCircle, Home } from 'lucide-react'
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? 'YOUR_GOOGLE_CLIENT_ID'

const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

interface FormState {
    name: string
    email: string
    password: string
    confirm: string
}

interface FormErrors {
    name?: string
    email?: string
    password?: string
    confirm?: string
}

function validateForm(form: FormState): FormErrors {
    const errors: FormErrors = {}
    if (!form.name.trim()) errors.name = 'Full name is required'
    if (!form.email.trim()) errors.email = 'Email is required'
    else if (!isValidEmail(form.email)) errors.email = 'Please enter a valid email address'
    if (!form.password) errors.password = 'Password is required'
    else if (form.password.length < 6) errors.password = 'Password must be at least 6 characters'
    if (!form.confirm) errors.confirm = 'Please confirm your password'
    else if (form.password !== form.confirm) errors.confirm = 'Passwords do not match'
    return errors
}

function SignupForm() {
    const [form, setForm] = useState<FormState>({ name: '', email: '', password: '', confirm: '' })
    const [errors, setErrors] = useState<FormErrors>({})
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const navigate = useNavigate()

    const passwordsMatch = form.password.length > 0 && form.confirm.length > 0 && form.password === form.confirm
    const passwordMismatch = form.confirm.length > 0 && form.password !== form.confirm

    const isFormComplete =
        form.name.trim() !== '' &&
        isValidEmail(form.email) &&
        form.password.length >= 6 &&
        passwordsMatch

    const handleInputChange = useCallback(
        (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value
            setForm(prev => ({ ...prev, [field]: value }))
            if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
        },
        [errors],
    )

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitted(true)
        const validationErrors = validateForm(form)
        setErrors(validationErrors)
        if (Object.keys(validationErrors).length === 0) {
            // Simulate account creation — store name for greeting
            localStorage.setItem('userName', form.name.trim())
            navigate('/onboarding/step1')
        }
    }

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            console.log('Google user token:', tokenResponse)
        },
        onError: (error) => {
            console.error('Google login failed:', error)
        },
    })

    const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.borderColor = '#5C7844'
        e.target.style.boxShadow = '0 0 0 3px rgba(92,120,68,0.15)'
        e.target.style.background = '#FFFFFF'
    }
    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.borderColor = '#D6DFC8'
        e.target.style.boxShadow = 'none'
        e.target.style.background = '#F7F5F0'
    }

    return (
        <div style={{
            minHeight: '100vh', background: '#F7F5F0',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '32px 16px',
        }}>

            {/* Home button */}
            <Link
                to="/"
                id="signup-home"
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
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                style={{ marginBottom: '36px', textAlign: 'center' }}
            >
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <h1 style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 'clamp(1.8rem, 5vw, 2.4rem)',
                        fontWeight: 700, color: '#2D3425',
                        letterSpacing: '-0.5px', margin: 0,
                    }}>
                        Script2Screen
                    </h1>
                    <p style={{ marginTop: '4px', fontSize: '0.82rem', color: '#8A9272' }}>
                        Create your account
                    </p>
                </Link>
            </motion.div>

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                style={{
                    width: '100%', maxWidth: '440px',
                    padding: '44px 40px', borderRadius: '20px',
                    background: '#FFFFFF',
                    border: '1px solid #D6DFC8',
                    boxShadow: '0 8px 40px rgba(61,82,41,0.08)',
                }}
            >
                <h2 style={{
                    margin: '0 0 24px 0',
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '1.5rem', fontWeight: 700,
                    color: '#2D3425', letterSpacing: '-0.3px',
                }}>
                    Sign Up
                </h2>

                <form onSubmit={handleSubmit} noValidate>

                    {/* Full Name */}
                    <FieldWrapper label="Full Name" error={submitted ? errors.name : undefined} style={{ marginBottom: '15px' }}>
                        <FieldInput
                            id="signup-name" type="text" placeholder="Jane Doe"
                            value={form.name} onChange={handleInputChange('name')}
                            icon={<User size={15} />} onFocus={onFocus} onBlur={onBlur}
                            hasError={submitted && !!errors.name}
                        />
                    </FieldWrapper>

                    {/* Email */}
                    <FieldWrapper label="Email" error={submitted ? errors.email : undefined} style={{ marginBottom: '15px' }}>
                        <FieldInput
                            id="signup-email" type="email" placeholder="you@example.com"
                            value={form.email} onChange={handleInputChange('email')}
                            icon={<Mail size={15} />} onFocus={onFocus} onBlur={onBlur}
                            hasError={submitted && !!errors.email}
                        />
                    </FieldWrapper>

                    {/* Password */}
                    <FieldWrapper label="Password" error={submitted ? errors.password : undefined} style={{ marginBottom: '15px' }}>
                        <FieldInput
                            id="signup-password" type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters"
                            value={form.password} onChange={handleInputChange('password')}
                            icon={<Lock size={15} />} onFocus={onFocus} onBlur={onBlur}
                            hasError={submitted && !!errors.password}
                            endAdornment={<EyeToggle show={showPassword} onToggle={() => setShowPassword(v => !v)} />}
                        />
                    </FieldWrapper>

                    {/* Confirm Password */}
                    <FieldWrapper
                        label="Confirm Password"
                        error={passwordMismatch ? 'Passwords do not match' : (submitted ? errors.confirm : undefined)}
                        style={{ marginBottom: '22px' }}
                    >
                        <div style={{ position: 'relative' }}>
                            <FieldInput
                                id="signup-confirm" type={showConfirm ? 'text' : 'password'} placeholder="Re-enter password"
                                value={form.confirm} onChange={handleInputChange('confirm')}
                                icon={<Lock size={15} />} onFocus={onFocus} onBlur={onBlur}
                                hasError={passwordMismatch || (submitted && !!errors.confirm)}
                                endAdornment={<EyeToggle show={showConfirm} onToggle={() => setShowConfirm(v => !v)} />}
                            />
                            <AnimatePresence>
                                {passwordsMatch && (
                                    <motion.span key="match" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
                                        style={{ position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)', color: '#4ade80' }}>
                                        <CheckCircle2 size={16} />
                                    </motion.span>
                                )}
                                {passwordMismatch && (
                                    <motion.span key="mismatch" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
                                        style={{ position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)', color: '#f87171' }}>
                                        <XCircle size={16} />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    </FieldWrapper>

                    {/* Submit */}
                    <motion.button
                        id="signup-submit"
                        type="submit"
                        disabled={!isFormComplete}
                        whileHover={isFormComplete ? { scale: 1.01, boxShadow: '0 8px 28px rgba(61,82,41,0.22)' } : {}}
                        whileTap={isFormComplete ? { scale: 0.98 } : {}}
                        style={{
                            width: '100%', padding: '13px',
                            borderRadius: '9999px', border: 'none',
                            background: isFormComplete ? '#5C7844' : '#C8D5B9',
                            color: isFormComplete ? '#fff' : '#8A9272',
                            fontSize: '0.95rem', fontWeight: 600,
                            cursor: isFormComplete ? 'pointer' : 'not-allowed',
                            boxShadow: isFormComplete ? '0 4px 18px rgba(61,82,41,0.18)' : 'none',
                            letterSpacing: '0.2px', transition: 'all 0.25s ease',
                            fontFamily: "'Inter', sans-serif",
                        }}
                    >
                        Create Account
                    </motion.button>
                </form>

                {/* OR divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
                    <div style={{ flex: 1, height: '1px', background: '#D6DFC8' }} />
                    <span style={{ fontSize: '0.73rem', color: '#8A9272', fontWeight: 600, letterSpacing: '1.5px', fontFamily: "'Inter', sans-serif" }}>OR</span>
                    <div style={{ flex: 1, height: '1px', background: '#D6DFC8' }} />
                </div>

                {/* Google button */}
                <motion.button
                    id="signup-google"
                    type="button"
                    onClick={() => handleGoogleLogin()}
                    whileHover={{ scale: 1.01, boxShadow: '0 4px 20px rgba(61,82,41,0.10)' }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                        width: '100%', padding: '12px',
                        borderRadius: '9999px',
                        border: '1px solid #D6DFC8',
                        background: '#FFFFFF', color: '#2D3425',
                        fontSize: '0.92rem', fontWeight: 600, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                        transition: 'all 0.22s ease',
                        fontFamily: "'Inter', sans-serif",
                    }}
                >
                    <GoogleIcon />
                    Continue with Google
                </motion.button>

                {/* Login redirect */}
                <p style={{
                    marginTop: '20px', textAlign: 'center',
                    fontSize: '0.88rem', color: '#8A9272',
                    fontFamily: "'Inter', sans-serif",
                }}>
                    Already a user?{' '}
                    <Link to="/login" style={{ color: '#5C7844', fontWeight: 600, textDecoration: 'none' }}
                        onMouseOver={e => (e.currentTarget.style.color = '#3D5229')}
                        onMouseOut={e => (e.currentTarget.style.color = '#5C7844')}
                    >
                        Login
                    </Link>
                </p>
            </motion.div>

            <style>{`
        input::placeholder { color: #B5BDA8 !important; }
      `}</style>
        </div>
    )
}

/* Sub-components */

function FieldWrapper({
    label, error, children, style,
}: { label: string; error?: string; children: React.ReactNode; style?: React.CSSProperties }) {
    return (
        <div style={style}>
            <label style={labelStyle}>{label}</label>
            {children}
            <AnimatePresence>
                {error && (
                    <motion.p
                        key={error}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                        style={{ margin: '5px 0 0 2px', fontSize: '0.77rem', color: '#e05252', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    )
}

interface FieldInputProps {
    id: string
    type: string
    placeholder: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    icon: React.ReactNode
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => void
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void
    hasError?: boolean
    endAdornment?: React.ReactNode
}

function FieldInput({ id, type, placeholder, value, onChange, icon, onFocus, onBlur, hasError, endAdornment }: FieldInputProps) {
    return (
        <div style={{ position: 'relative' }}>
            <span style={iconStyle}>{icon}</span>
            <input
                id={id} type={type} placeholder={placeholder}
                value={value} onChange={onChange} onFocus={onFocus} onBlur={onBlur}
                style={{
                    ...inputStyle,
                    paddingRight: endAdornment ? '76px' : '14px',
                    borderColor: hasError ? 'rgba(224,82,82,0.65)' : '#D6DFC8',
                    boxShadow: hasError ? '0 0 0 2px rgba(224,82,82,0.12)' : 'none',
                }}
            />
            {endAdornment}
        </div>
    )
}

function EyeToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
    return (
        <button type="button" onClick={onToggle} style={{
            position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer', color: '#8A9272',
            padding: 0, display: 'flex', alignItems: 'center',
        }}>
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
    )
}

function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        </svg>
    )
}

const labelStyle: React.CSSProperties = {
    display: 'block', marginBottom: '7px',
    fontSize: '0.82rem', fontWeight: 600,
    color: '#5A6348', letterSpacing: '0.2px',
    fontFamily: "'Inter', sans-serif",
}

const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px 11px 36px',
    borderRadius: '10px', border: '1px solid #D6DFC8',
    background: '#F7F5F0', color: '#2D3425',
    fontSize: '0.92rem', outline: 'none',
    transition: 'border-color 0.22s ease, box-shadow 0.22s ease, background 0.22s ease',
    boxSizing: 'border-box',
    fontFamily: "'Inter', sans-serif",
}

const iconStyle: React.CSSProperties = {
    position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
    color: '#8A9272', display: 'flex', alignItems: 'center', pointerEvents: 'none',
}

export default function SignupPage() {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <SignupForm />
        </GoogleOAuthProvider>
    )
}
