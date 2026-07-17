import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'

const steps = [
    {
        title: 'What do you want to create?',
        options: [
            { id: 'social', label: 'Social Media', emoji: '📱' },
            { id: 'ads', label: 'Ads', emoji: '📣' },
            { id: 'edu', label: 'Education & Training Videos', emoji: '🎓' },
            { id: 'product', label: 'Product Demos', emoji: '🛍️' },
            { id: 'internal', label: 'Internal Communications', emoji: '🏢' },
            { id: 'other1', label: 'Other', emoji: '✨' },
        ],
    },
    {
        title: 'What is your role?',
        options: [
            { id: 'marketing', label: 'Marketing', emoji: '📊' },
            { id: 'sales', label: 'Sales', emoji: '💼' },
            { id: 'edu2', label: 'Education & Training', emoji: '📚' },
            { id: 'owner', label: 'Business Owner', emoji: '🏛️' },
            { id: 'creator', label: 'Content Creator', emoji: '🎬' },
            { id: 'other2', label: 'Other', emoji: '✨' },
        ],
    },
    {
        title: 'Which platform will you mainly create for?',
        options: [
            { id: 'youtube', label: 'YouTube Shorts', emoji: '▶️' },
            { id: 'instagram', label: 'Instagram Reels', emoji: '📸' },
            { id: 'both', label: 'Both', emoji: '🚀' },
        ],
    },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function OnboardingPage() {
    const navigate = useNavigate()
    const [step, setStep] = useState(0)
    const [selections, setSelections] = useState<Record<number, string>>({})
    const [direction, setDirection] = useState(1)

    const current = steps[step]
    const selected = selections[step]
    const isLast = step === steps.length - 1

    function select(id: string) {
        setSelections(prev => ({ ...prev, [step]: id }))
    }

    function goNext() {
        if (!selected) return
        if (isLast) {
            console.log('Onboarding complete:', selections)
            localStorage.setItem('s2s_onboarded', 'true')
            navigate('/dashboard')
            return
        }
        setDirection(1)
        setStep(s => s + 1)
    }

    function goBack() {
        setDirection(-1)
        setStep(s => s - 1)
    }

    const progress = ((step) / steps.length) * 100

    return (
        <div style={{
            minHeight: '100vh', background: '#F7F5F0',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '40px 24px',
        }}>
            <div style={{ width: '100%', maxWidth: '640px' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                    <span style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontWeight: 700, fontSize: '1.15rem',
                        letterSpacing: '-0.3px', color: '#2D3425',
                    }}>
                        Script2Screen
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#8A9272', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>
                        Step {step + 1} of {steps.length}
                    </span>
                </div>

                {/* Progress bar */}
                <div style={{
                    width: '100%', height: '3px', borderRadius: '99px',
                    background: '#D6DFC8', marginBottom: '52px', overflow: 'hidden',
                }}>
                    <motion.div
                        animate={{ width: `${progress + (100 / steps.length)}%` }}
                        transition={{ duration: 0.5, ease: EASE }}
                        style={{ height: '100%', borderRadius: '99px', background: 'linear-gradient(90deg, #5C7844, #8FAF72)' }}
                    />
                </div>

                {/* Step card */}
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={step}
                        custom={direction}
                        initial={{ opacity: 0, x: direction * 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction * -50 }}
                        transition={{ duration: 0.38, ease: EASE }}
                    >
                        <h2 style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: 'clamp(1.4rem, 3vw, 1.85rem)',
                            fontWeight: 700, color: '#2D3425',
                            marginBottom: '32px', textAlign: 'center',
                            letterSpacing: '-0.3px',
                        }}>
                            {current.title}
                        </h2>

                        {/* Option cards */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: current.options.length === 3 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
                            gap: '14px',
                            marginBottom: '40px',
                        }}>
                            {current.options.map(opt => {
                                const isSelected = selected === opt.id
                                return (
                                    <motion.button
                                        key={opt.id}
                                        onClick={() => select(opt.id)}
                                        whileHover={{ y: -2, transition: { duration: 0.18 } }}
                                        whileTap={{ scale: 0.97 }}
                                        style={{
                                            padding: '22px 14px',
                                            borderRadius: '14px',
                                            border: isSelected
                                                ? '2px solid #5C7844'
                                                : '1.5px solid #D6DFC8',
                                            background: isSelected ? '#EDE9E1' : '#FFFFFF',
                                            cursor: 'pointer',
                                            textAlign: 'center',
                                            position: 'relative',
                                            boxShadow: isSelected
                                                ? '0 4px 20px rgba(92,120,68,0.15)'
                                                : '0 2px 8px rgba(61,82,41,0.04)',
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        {isSelected && (
                                            <span style={{
                                                position: 'absolute', top: '9px', right: '9px',
                                                width: '20px', height: '20px', borderRadius: '50%',
                                                background: '#5C7844',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <Check size={11} color="#fff" strokeWidth={3} />
                                            </span>
                                        )}
                                        <div style={{ fontSize: '1.8rem', marginBottom: '10px' }}>{opt.emoji}</div>
                                        <div style={{
                                            fontSize: '0.86rem', fontWeight: 600,
                                            color: isSelected ? '#2D3425' : '#5A6348',
                                            fontFamily: "'Inter', sans-serif",
                                            lineHeight: 1.3,
                                        }}>
                                            {opt.label}
                                        </div>
                                    </motion.button>
                                )
                            })}
                        </div>

                        {/* Nav buttons */}
                        <div style={{ display: 'flex', gap: '12px', justifyContent: step === 0 ? 'flex-end' : 'space-between' }}>
                            {step > 0 && (
                                <motion.button
                                    onClick={goBack}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.97 }}
                                    style={{
                                        padding: '12px 26px', borderRadius: '9999px',
                                        border: '1.5px solid #C8D5B9',
                                        background: 'transparent', color: '#5A6348',
                                        fontSize: '0.92rem', fontWeight: 600, cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        transition: 'all 0.2s ease',
                                        fontFamily: "'Inter', sans-serif",
                                    }}
                                    onMouseOver={e => {
                                        e.currentTarget.style.borderColor = '#5C7844'
                                        e.currentTarget.style.color = '#3D5229'
                                    }}
                                    onMouseOut={e => {
                                        e.currentTarget.style.borderColor = '#C8D5B9'
                                        e.currentTarget.style.color = '#5A6348'
                                    }}
                                >
                                    <ArrowLeft size={15} /> Back
                                </motion.button>
                            )}
                            <motion.button
                                onClick={goNext}
                                disabled={!selected}
                                whileHover={selected ? { scale: 1.01, boxShadow: '0 8px 26px rgba(61,82,41,0.22)' } : {}}
                                whileTap={selected ? { scale: 0.97 } : {}}
                                style={{
                                    padding: '12px 30px', borderRadius: '9999px', border: 'none',
                                    background: selected ? '#5C7844' : '#C8D5B9',
                                    color: selected ? '#fff' : '#8A9272',
                                    fontSize: '0.92rem', fontWeight: 600,
                                    cursor: selected ? 'pointer' : 'not-allowed',
                                    boxShadow: selected ? '0 4px 16px rgba(61,82,41,0.18)' : 'none',
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    transition: 'all 0.25s ease',
                                    fontFamily: "'Inter', sans-serif",
                                }}
                            >
                                {isLast ? 'Get Started' : 'Continue'} <ArrowRight size={15} />
                            </motion.button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
