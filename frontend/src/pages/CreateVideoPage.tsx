import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft, ArrowRight, RefreshCw, Save, Languages,
    Play, Download, RotateCcw, BookmarkPlus, CheckCircle,
    Loader2, Sparkles,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import axios from 'axios'

import AvatarCreationStep from '../components/AvatarCreationStep'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const STEPS = [
    { id: 1, label: 'Topic' },
    { id: 2, label: 'Script' },
    { id: 3, label: 'Edit Script' },
    { id: 4, label: 'Translate' },
    { id: 5, label: 'Edit Translation' },
    { id: 6, label: 'Voice' },
    { id: 7, label: 'Avatar' },
    { id: 8, label: 'Generate' },
    { id: 9, label: 'Preview' },
]

const PLACEHOLDER_SCRIPT = `Welcome to our channel! Today, we're diving into a fascinating topic that's changing the way people think about content creation.

AI-powered tools are transforming the creative landscape, making it easier than ever to bring your ideas to life. From scriptwriting to video production, the possibilities are endless.

In just a few minutes, you'll learn how to leverage these powerful technologies to create compelling content that resonates with your audience.

Let's get started and unlock the potential of AI in your creative journey!`

// ── Avatar selection data model ───────────────────────────────────────────────
export const AVATAR_LIBRARY_KEY = 's2s_avatarLibrary'

export interface AvatarSelection {
    id: string
    name: string
    url: string
}

interface Voice {
    id: string
    name: string
    gender: 'Male' | 'Female'
    language: string
    emoji: string
    color: string
}

const VOICES: Voice[] = [
    { id: 'tamil_male',   name: 'Tamil Male Voice',   gender: 'Male',   language: 'Tamil',   emoji: '🎤', color: '#E8F0E0' },
    { id: 'tamil_female', name: 'Tamil Female Voice',  gender: 'Female', language: 'Tamil',   emoji: '🎵', color: '#F0E8F0' },
    { id: 'telugu_male',  name: 'Telugu Male Voice',   gender: 'Male',   language: 'Telugu',  emoji: '🎤', color: '#E0EAF8' },
    { id: 'telugu_female',name: 'Telugu Female Voice', gender: 'Female', language: 'Telugu',  emoji: '🎵', color: '#F8F0E0' },
    { id: 'hindi_male',   name: 'Hindi Male Voice',    gender: 'Male',   language: 'Hindi',   emoji: '🎤', color: '#F0F0E8' },
    { id: 'hindi_female', name: 'Hindi Female Voice',  gender: 'Female', language: 'Hindi',   emoji: '🎵', color: '#E8F0F0' },
    { id: 'english_male', name: 'English Male Voice',  gender: 'Male',   language: 'English', emoji: '🎤', color: '#EEE8F0' },
    { id: 'english_female',name:'English Female Voice',gender: 'Female', language: 'English', emoji: '🎵', color: '#F0EEE8' },
]

// Sample preview sentence per language
const PREVIEW_SAMPLES: Record<string, string> = {
    Tamil:   'வணக்கம்! இது உங்கள் குரல் மாதிரி.',
    Telugu:  'నమస్కారం! ఇది మీ వాయిస్ ప్రివ్యూ.',
    Hindi:   'नमस्ते! यह आपका आवाज़ पूर्वावलोकन है।',
    English: 'Hello! This is your voice preview.',
}

// ────────────────────────────────────────────
// Step Progress Indicator
// ────────────────────────────────────────────
function StepIndicator({ currentStep }: { currentStep: number }) {
    return (
        <div style={{ width: '100%', overflowX: 'auto', paddingBottom: '4px' }}>
            <div style={{
                display: 'flex', alignItems: 'center',
                gap: 0, minWidth: 'max-content', margin: '0 auto',
                width: 'fit-content',
            }}>
                {STEPS.map((step, i) => {
                    const isActive = step.id === currentStep
                    const isDone = step.id < currentStep
                    return (
                        <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                <motion.div
                                    animate={{
                                        background: isDone ? '#5C7844' : isActive ? '#5C7844' : '#E8EFE0',
                                        scale: isActive ? 1.15 : 1,
                                    }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        width: '28px', height: '28px', borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: isActive ? '2px solid #3D5229' : isDone ? '2px solid #5C7844' : '2px solid #C8D5B9',
                                        flexShrink: 0,
                                    }}
                                >
                                    {isDone
                                        ? <CheckCircle size={14} color="#fff" />
                                        : <span style={{
                                            fontSize: '0.72rem', fontWeight: 700,
                                            color: isActive ? '#fff' : '#8A9272',
                                            fontFamily: "'Inter', sans-serif",
                                        }}>{step.id}</span>
                                    }
                                </motion.div>
                                <span style={{
                                    fontSize: '0.68rem', fontWeight: isActive ? 700 : 500,
                                    color: isActive ? '#3D5229' : isDone ? '#5C7844' : '#8A9272',
                                    fontFamily: "'Inter', sans-serif",
                                    whiteSpace: 'nowrap',
                                }}>
                                    {step.label}
                                </span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div style={{
                                    width: '32px', height: '2px', margin: '0 4px', marginBottom: '18px',
                                    background: isDone ? '#5C7844' : '#D6DFC8',
                                    borderRadius: '99px', flexShrink: 0,
                                    transition: 'background 0.3s ease',
                                }} />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// ────────────────────────────────────────────
// Shared styled buttons
// ────────────────────────────────────────────
export function PrimaryBtn({ onClick, disabled, children, id }: {
    onClick: () => void; disabled?: boolean; children: React.ReactNode; id?: string
}) {
    return (
        <motion.button
            id={id}
            onClick={onClick}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.02, boxShadow: '0 8px 24px rgba(61,82,41,0.22)' } : {}}
            whileTap={!disabled ? { scale: 0.97 } : {}}
            style={{
                padding: '11px 26px', borderRadius: '9999px', border: 'none',
                background: disabled ? '#C8D5B9' : '#5C7844',
                color: disabled ? '#8A9272' : '#fff',
                fontSize: '0.9rem', fontWeight: 600,
                cursor: disabled ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'all 0.22s ease',
                fontFamily: "'Inter', sans-serif",
                boxShadow: disabled ? 'none' : '0 4px 16px rgba(61,82,41,0.18)',
            }}
        >
            {children}
        </motion.button>
    )
}

export function SecondaryBtn({ onClick, children, id }: {
    onClick: () => void; children: React.ReactNode; id?: string
}) {
    return (
        <motion.button
            id={id}
            onClick={onClick}
            whileHover={{ scale: 1.01, borderColor: '#5C7844', color: '#3D5229' }}
            whileTap={{ scale: 0.97 }}
            style={{
                padding: '11px 22px', borderRadius: '9999px',
                border: '1.5px solid #C8D5B9',
                background: 'transparent', color: '#5A6348',
                fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'all 0.2s ease',
                fontFamily: "'Inter', sans-serif",
            }}
        >
            {children}
        </motion.button>
    )
}

export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
    return (
        <div style={{
            background: '#FFFFFF', borderRadius: '18px',
            border: '1px solid #D6DFC8',
            boxShadow: '0 4px 24px rgba(61,82,41,0.07)',
            padding: '28px', ...style,
        }}>
            {children}
        </div>
    )
}

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 'clamp(1.3rem, 2.5vw, 1.65rem)',
        fontWeight: 700, color: '#2D3425',
        marginBottom: '24px', letterSpacing: '-0.3px',
    }}>{children}</h2>
)

const Label = ({ children }: { children: React.ReactNode }) => (
    <label style={{
        display: 'block', marginBottom: '8px',
        fontSize: '0.82rem', fontWeight: 600, color: '#5A6348',
        fontFamily: "'Inter', sans-serif",
    }}>{children}</label>
)

// ────────────────────────────────────────────
// STEP 1: Topic Input
// ────────────────────────────────────────────
interface TopicData {
    topic: string
    description: string
    tone: string
    duration: string
    platform: string
}

function Step1Topic({ data, onChange, onNext, isGenerating }: {
    data: TopicData
    onChange: (d: Partial<TopicData>) => void
    onNext: () => void
    isGenerating?: boolean
}) {
    const tones = ['Educational', 'Motivational', 'Funny', 'Storytelling']
    const durations = ['30 seconds', '45 seconds', '60 seconds']
    const platforms = ['YouTube Shorts', 'Instagram Reels']

    const canProceed = data.topic.trim().length > 0 && data.tone && data.duration && data.platform

    const chipStyle = (active: boolean): React.CSSProperties => ({
        padding: '8px 16px', borderRadius: '9999px', cursor: 'pointer',
        border: active ? '2px solid #5C7844' : '1.5px solid #D6DFC8',
        background: active ? 'rgba(92,120,68,0.12)' : '#FFFFFF',
        color: active ? '#3D5229' : '#5A6348',
        fontSize: '0.85rem', fontWeight: active ? 700 : 500,
        transition: 'all 0.18s ease',
        fontFamily: "'Inter', sans-serif",
    })

    return (
        <Card>
            <SectionTitle>Create Video</SectionTitle>

            <div style={{ marginBottom: '20px' }}>
                <Label>Topic <span style={{ color: '#e05252' }}>*</span></Label>
                <input
                    id="cv-topic"
                    type="text"
                    placeholder="e.g. Benefits of morning routines"
                    value={data.topic}
                    onChange={e => onChange({ topic: e.target.value })}
                    style={{
                        width: '100%', padding: '11px 14px',
                        borderRadius: '10px', border: '1.5px solid #D6DFC8',
                        background: '#F7F5F0', color: '#2D3425',
                        fontSize: '0.92rem', outline: 'none',
                        fontFamily: "'Inter', sans-serif",
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#5C7844'; e.target.style.background = '#fff' }}
                    onBlur={e => { e.target.style.borderColor = '#D6DFC8'; e.target.style.background = '#F7F5F0' }}
                />
            </div>

            <div style={{ marginBottom: '24px' }}>
                <Label>Brief Description <span style={{ color: '#B5BDA8', fontWeight: 400 }}>(optional)</span></Label>
                <textarea
                    id="cv-description"
                    placeholder="Describe your video idea..."
                    value={data.description}
                    onChange={e => onChange({ description: e.target.value })}
                    rows={3}
                    style={{
                        width: '100%', padding: '11px 14px',
                        borderRadius: '10px', border: '1.5px solid #D6DFC8',
                        background: '#F7F5F0', color: '#2D3425',
                        fontSize: '0.92rem', outline: 'none', resize: 'vertical',
                        fontFamily: "'Inter', sans-serif",
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#5C7844'; e.target.style.background = '#fff' }}
                    onBlur={e => { e.target.style.borderColor = '#D6DFC8'; e.target.style.background = '#F7F5F0' }}
                />
            </div>

            <div style={{ marginBottom: '24px' }}>
                <Label>Tone</Label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {tones.map(t => (
                        <button
                            key={t}
                            id={`cv-tone-${t.toLowerCase()}`}
                            onClick={() => onChange({ tone: t })}
                            style={chipStyle(data.tone === t)}
                        >{t}</button>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
                <Label>Duration</Label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {durations.map(d => (
                        <button
                            key={d}
                            id={`cv-duration-${d.split(' ')[0]}`}
                            onClick={() => onChange({ duration: d })}
                            style={chipStyle(data.duration === d)}
                        >{d}</button>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
                <Label>Platform</Label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {platforms.map(p => (
                        <button
                            key={p}
                            id={`cv-platform-${p.toLowerCase().replace(/\s+/g, '-')}`}
                            onClick={() => onChange({ platform: p })}
                            style={chipStyle(data.platform === p)}
                        >
                            {p === 'YouTube Shorts' ? '▶️ ' : '📸 '}{p}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <PrimaryBtn id="cv-generate-script" onClick={onNext} disabled={!canProceed || isGenerating}>
                    {isGenerating
                        ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Generating script...</>
                        : <><Sparkles size={15} /> Generate Script</>
                    }
                </PrimaryBtn>
            </div>
        </Card>
    )
}

// ────────────────────────────────────────────
// STEP 2: Script Generation
// ────────────────────────────────────────────
function Step2Script({ script, onRegenerate, onContinue }: {
    script: string
    onRegenerate: () => void
    onContinue: () => void
}) {
    return (
        <Card>
            <SectionTitle>Generated Script</SectionTitle>
            <p style={{
                fontSize: '0.84rem', color: '#8A9272', marginBottom: '16px',
                fontFamily: "'Inter', sans-serif",
            }}>
                Your AI-generated script is ready. Review it and continue to edit.
            </p>
            <div style={{
                background: '#F7F5F0', borderRadius: '12px',
                border: '1px solid #D6DFC8', padding: '20px',
                minHeight: '220px', marginBottom: '28px',
                fontSize: '0.92rem', lineHeight: 1.75, color: '#2D3425',
                fontFamily: "'Inter', sans-serif",
                whiteSpace: 'pre-wrap',
            }}>
                {script}
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
                <SecondaryBtn id="cv-regenerate" onClick={onRegenerate}>
                    <RefreshCw size={14} /> Regenerate Script
                </SecondaryBtn>
                <PrimaryBtn id="cv-script-continue" onClick={onContinue}>
                    Continue <ArrowRight size={15} />
                </PrimaryBtn>
            </div>
        </Card>
    )
}

// ────────────────────────────────────────────
// STEP 3: Edit English Script
// ────────────────────────────────────────────
function Step3EditScript({ script, onScriptChange, onSave, onTranslate }: {
    script: string
    onScriptChange: (s: string) => void
    onSave: () => void
    onTranslate: () => void
}) {
    const [saved, setSaved] = useState(false)

    function handleSave() {
        onSave()
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <Card>
            <SectionTitle>Edit Script</SectionTitle>
            <p style={{ fontSize: '0.84rem', color: '#8A9272', marginBottom: '16px', fontFamily: "'Inter', sans-serif" }}>
                Refine the script to match your voice and style.
            </p>
            <textarea
                id="cv-edit-script"
                value={script}
                onChange={e => onScriptChange(e.target.value)}
                rows={12}
                style={{
                    width: '100%', padding: '16px',
                    borderRadius: '12px', border: '1.5px solid #D6DFC8',
                    background: '#F7F5F0', color: '#2D3425',
                    fontSize: '0.92rem', lineHeight: 1.75, resize: 'vertical',
                    fontFamily: "'Inter', sans-serif",
                    boxSizing: 'border-box', outline: 'none',
                    marginBottom: '24px', transition: 'border-color 0.2s',
                }}
                onFocus={e => { e.target.style.borderColor = '#5C7844'; e.target.style.background = '#fff' }}
                onBlur={e => { e.target.style.borderColor = '#D6DFC8'; e.target.style.background = '#F7F5F0' }}
            />
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
                <SecondaryBtn id="cv-save-script" onClick={handleSave}>
                    {saved ? <><CheckCircle size={14} /> Saved!</> : <><Save size={14} /> Save Script</>}
                </SecondaryBtn>
                <PrimaryBtn id="cv-translate-script" onClick={onTranslate}>
                    <Languages size={15} /> Translate Script
                </PrimaryBtn>
            </div>
        </Card>
    )
}

// ────────────────────────────────────────────
// STEP 4: Translation
// ────────────────────────────────────────────
function Step4Translate({ sourceScript, onContinue }: { sourceScript: string, onContinue: (lang: string, text: string) => void }) {
    const languages = ['English', 'Tamil', 'Telugu', 'Hindi']
    const [activeTab, setActiveTab] = useState('English')
    const [isTranslating, setIsTranslating] = useState(false)
    const [translatedContent, setTranslatedContent] = useState<Record<string, string>>({})

    const currentTranslation = activeTab === 'English'
        ? sourceScript
        : (translatedContent[activeTab] || 'Click "Translate Script" to generate translation.')

    const handleTranslate = async () => {
        if (activeTab === 'English') {
            onContinue('English', sourceScript)
            return
        }

        const langMap: Record<string, string> = {
            'Tamil': 'ta',
            'Telugu': 'te',
            'Hindi': 'hi'
        }

        setIsTranslating(true)
        try {
            const response = await axios.post('http://localhost:5000/api/script/translate', {
                script: sourceScript,
                language: langMap[activeTab] || 'hi'
            })
            const newTranslation = response.data.translated_script
            setTranslatedContent(prev => ({ ...prev, [activeTab]: newTranslation }))
            onContinue(activeTab, newTranslation)
        } catch (error) {
            console.error('Translation error:', error)
            alert('Translation failed. Please try again.')
        } finally {
            setIsTranslating(false)
        }
    }

    const tabStyle = (active: boolean): React.CSSProperties => ({
        padding: '10px 20px',
        border: 'none',
        borderBottom: active ? '2px solid #5C7844' : '2px solid transparent',
        background: 'transparent',
        color: active ? '#3D5229' : '#8A9272',
        fontSize: '0.88rem', fontWeight: active ? 700 : 500,
        cursor: 'pointer', transition: 'all 0.2s ease',
        fontFamily: "'Inter', sans-serif",
    })

    return (
        <Card>
            <SectionTitle>Translation</SectionTitle>
            <p style={{ fontSize: '0.84rem', color: '#8A9272', marginBottom: '20px', fontFamily: "'Inter', sans-serif" }}>
                Select a language to view the translated script.
            </p>

            <div style={{
                display: 'flex', borderBottom: '1px solid #D6DFC8', marginBottom: '20px',
                overflowX: 'auto',
            }}>
                {languages.map(lang => (
                    <button
                        key={lang}
                        id={`cv-lang-${lang.toLowerCase()}`}
                        onClick={() => setActiveTab(lang)}
                        style={tabStyle(activeTab === lang)}
                    >{lang}</button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    style={{
                        background: '#F7F5F0', borderRadius: '12px',
                        border: '1px solid #D6DFC8', padding: '20px',
                        minHeight: '200px', marginBottom: '28px',
                        fontSize: '0.92rem', lineHeight: 1.8, color: '#2D3425',
                        fontFamily: "'Inter', sans-serif",
                        whiteSpace: 'pre-wrap',
                    }}
                >
                    {currentTranslation}
                </motion.div>
            </AnimatePresence>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <PrimaryBtn id="cv-translation-continue" onClick={handleTranslate} disabled={isTranslating}>
                    {isTranslating
                        ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Translating script...</>
                        : activeTab === 'English' || translatedContent[activeTab]
                            ? <>Continue <ArrowRight size={15} /></>
                            : <><Languages size={15} /> Translate Script</>
                    }
                </PrimaryBtn>
            </div>
        </Card>
    )
}

// ────────────────────────────────────────────
// STEP 5: Edit Translated Script
// ────────────────────────────────────────────
function Step5EditTranslation({ translation, onTranslationChange, onSave, onContinue }: {
    translation: string
    onTranslationChange: (s: string) => void
    onSave: () => void
    onContinue: () => void
}) {
    const [saved, setSaved] = useState(false)

    function handleSave() {
        onSave()
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <Card>
            <SectionTitle>Edit Translation</SectionTitle>
            <p style={{ fontSize: '0.84rem', color: '#8A9272', marginBottom: '16px', fontFamily: "'Inter', sans-serif" }}>
                Review and edit the translated script as needed.
            </p>
            <textarea
                id="cv-edit-translation"
                value={translation}
                onChange={e => onTranslationChange(e.target.value)}
                rows={12}
                style={{
                    width: '100%', padding: '16px',
                    borderRadius: '12px', border: '1.5px solid #D6DFC8',
                    background: '#F7F5F0', color: '#2D3425',
                    fontSize: '0.92rem', lineHeight: 1.75, resize: 'vertical',
                    fontFamily: "'Inter', sans-serif",
                    boxSizing: 'border-box', outline: 'none',
                    marginBottom: '24px', transition: 'border-color 0.2s',
                }}
                onFocus={e => { e.target.style.borderColor = '#5C7844'; e.target.style.background = '#fff' }}
                onBlur={e => { e.target.style.borderColor = '#D6DFC8'; e.target.style.background = '#F7F5F0' }}
            />
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
                <SecondaryBtn id="cv-save-translation" onClick={handleSave}>
                    {saved ? <><CheckCircle size={14} /> Saved!</> : <><Save size={14} /> Save Translation</>}
                </SecondaryBtn>
                <PrimaryBtn id="cv-translation-done" onClick={onContinue}>
                    Continue <ArrowRight size={15} />
                </PrimaryBtn>
            </div>
        </Card>
    )
}

// ────────────────────────────────────────────
// STEP 6: Voice Selection (with live TTS preview)
// ────────────────────────────────────────────
function Step6Voice({ selectedVoice, onSelect, onContinue }: {
    selectedVoice: string
    onSelect: (id: string) => void
    onContinue: () => void
}) {
    const [previewLoading, setPreviewLoading] = useState<string | null>(null)
    const [previewError, setPreviewError] = useState<string | null>(null)

    async function handlePreview(voice: Voice, e: React.MouseEvent) {
        e.stopPropagation()
        setPreviewError(null)
        setPreviewLoading(voice.id)
        const sampleText = PREVIEW_SAMPLES[voice.language] ?? PREVIEW_SAMPLES.English
        try {
            const res = await axios.post('http://localhost:5000/api/voice/generate', {
                script: sampleText,
                voice: voice.id,
            })
            const audioUrl: string = res.data.audio_url
            new Audio(audioUrl).play()
        } catch (err) {
            console.error('Voice preview error:', err)
            setPreviewError('Voice generation failed. Please try again.')
        } finally {
            setPreviewLoading(null)
        }
    }

    return (
        <Card>
            <SectionTitle>Choose Voice for Your Avatar</SectionTitle>
            <p style={{ fontSize: '0.84rem', color: '#8A9272', marginBottom: '6px', fontFamily: "'Inter', sans-serif" }}>
                This voice will be used to generate the speech audio that drives the avatar's lip-sync animation.
            </p>
            <p style={{ fontSize: '0.84rem', color: '#8A9272', marginBottom: '24px', fontFamily: "'Inter', sans-serif" }}>
                Choose the voice that best suits your content language and style.
            </p>

            {previewError && (
                <p style={{ fontSize: '0.83rem', color: '#c0392b', marginBottom: '16px', fontFamily: "'Inter', sans-serif" }}>
                    ⚠️ {previewError}
                </p>
            )}

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '14px',
                marginBottom: '32px',
            }}>
                {VOICES.map(voice => {
                    const isSelected = selectedVoice === voice.id
                    const isPreviewing = previewLoading === voice.id
                    return (
                        <motion.div
                            key={voice.id}
                            whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(61,82,41,0.14)' }}
                            onClick={() => onSelect(voice.id)}
                            style={{
                                borderRadius: '14px',
                                padding: '20px 16px',
                                border: isSelected ? '2px solid #5C7844' : '1.5px solid #D6DFC8',
                                background: isSelected ? 'rgba(92,120,68,0.10)' : '#FFFFFF',
                                cursor: 'pointer',
                                position: 'relative',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {isSelected && (
                                <div style={{
                                    position: 'absolute', top: '10px', right: '10px',
                                    width: '18px', height: '18px', borderRadius: '50%',
                                    background: '#5C7844',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <CheckCircle size={11} color="#fff" />
                                </div>
                            )}

                            <div style={{
                                width: '52px', height: '52px', borderRadius: '50%',
                                background: voice.color,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.5rem', marginBottom: '12px',
                                border: '2px solid rgba(92,120,68,0.15)',
                            }}>
                                {voice.emoji}
                            </div>

                            <div style={{
                                fontSize: '0.85rem', fontWeight: 700, color: '#2D3425',
                                fontFamily: "'Inter', sans-serif", marginBottom: '4px',
                            }}>
                                {voice.name}
                            </div>

                            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
                                <span style={{
                                    fontSize: '0.72rem', fontWeight: 600,
                                    color: voice.gender === 'Male' ? '#4A7DAA' : '#9A5A7A',
                                    background: voice.gender === 'Male' ? '#E0EAF8' : '#F0E8F0',
                                    borderRadius: '9999px', padding: '2px 10px',
                                    fontFamily: "'Inter', sans-serif",
                                }}>
                                    {voice.gender}
                                </span>
                                <span style={{
                                    fontSize: '0.72rem', fontWeight: 600,
                                    color: '#5A6348', background: '#E8EFE0',
                                    borderRadius: '9999px', padding: '2px 10px',
                                    fontFamily: "'Inter', sans-serif",
                                }}>
                                    {voice.language}
                                </span>
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                <motion.button
                                    id={`cv-voice-preview-${voice.id}`}
                                    onClick={e => handlePreview(voice, e)}
                                    disabled={!!previewLoading}
                                    whileHover={!previewLoading ? { scale: 1.05 } : {}}
                                    whileTap={!previewLoading ? { scale: 0.95 } : {}}
                                    style={{
                                        flex: 1, padding: '6px 0',
                                        borderRadius: '9999px',
                                        border: '1.5px solid #C8D5B9',
                                        background: isPreviewing ? '#E8EFE0' : 'transparent',
                                        color: '#5A6348',
                                        fontSize: '0.74rem', fontWeight: 600,
                                        cursor: previewLoading ? 'not-allowed' : 'pointer',
                                        display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', gap: '4px',
                                        fontFamily: "'Inter', sans-serif",
                                        opacity: previewLoading && !isPreviewing ? 0.5 : 1,
                                    }}
                                >
                                    {isPreviewing
                                        ? <><Loader2 size={10} style={{ animation: 'spin 1s linear infinite' }} /> Generating…</>
                                        : <><Play size={10} /> Preview</>
                                    }
                                </motion.button>
                                <motion.button
                                    id={`cv-voice-select-${voice.id}`}
                                    onClick={e => { e.stopPropagation(); onSelect(voice.id) }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        flex: 1, padding: '6px 0',
                                        borderRadius: '9999px', border: 'none',
                                        background: isSelected ? '#5C7844' : '#E8EFE0',
                                        color: isSelected ? '#fff' : '#5A6348',
                                        fontSize: '0.74rem', fontWeight: 600,
                                        cursor: 'pointer',
                                        fontFamily: "'Inter', sans-serif",
                                    }}
                                >
                                    {isSelected ? 'Selected' : 'Select'}
                                </motion.button>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <PrimaryBtn id="cv-voice-continue" onClick={onContinue} disabled={!selectedVoice}>
                    Continue <ArrowRight size={15} />
                </PrimaryBtn>
            </div>
        </Card>
    )
}

// ────────────────────────────────────────────
// STEP 8: Video Generation
// ────────────────────────────────────────────
function Step8Generate({ selectedAvatar, selectedVoice, script, onGenerate }: {
    selectedAvatar: AvatarSelection | null
    selectedVoice: string
    script: string
    onGenerate: (videoUrl: string) => void
}) {
    const [generating, setGenerating] = useState(false)
    const [genError, setGenError] = useState('')
    const voiceInfo = VOICES.find(v => v.id === selectedVoice)

    async function handleGenerate() {
        if (!selectedAvatar?.url) {
            setGenError('Please upload or capture a photo before generating the video.')
            return
        }
        if (!script) {
            setGenError('Script is empty. Please complete the previous steps.')
            return
        }
        setGenerating(true)
        setGenError('')
        try {
            // First: Generate the full length audio of the finalized script instead of the preview sample
            const audioRes = await axios.post('http://localhost:5000/api/voice/generate', {
                script: script,
                voice: selectedVoice,
            })
            const finalAudioUrl = audioRes.data.audio_url

            // Second: Call Replicate SadTalker
            const response = await axios.post('http://localhost:5000/api/video/generate', {
                avatar_url: selectedAvatar?.url ?? '',
                audio_url: finalAudioUrl,
            })
            onGenerate(response.data.video_url)
        } catch (err: any) {
            console.error('Video generation error:', err)
            if (err.response?.data?.error) {
                setGenError(err.response.data.error)
            } else {
                setGenError('Video generation failed. Please try again.')
            }
        } finally {
            setGenerating(false)
        }
    }

    return (
        <Card>
            <SectionTitle>Generate Video</SectionTitle>
            <p style={{ fontSize: '0.84rem', color: '#8A9272', marginBottom: '24px', fontFamily: "'Inter', sans-serif" }}>
                Review your selections and generate the final video.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                {/* Voice summary */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    padding: '16px', borderRadius: '12px',
                    background: '#F7F5F0', border: '1px solid #D6DFC8',
                }}>
                    <div style={{
                        width: '52px', height: '52px', borderRadius: '50%',
                        background: voiceInfo?.color ?? '#E8F0E0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.5rem', flexShrink: 0,
                    }}>
                        {voiceInfo?.emoji ?? '🎵'}
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: '#8A9272', fontFamily: "'Inter', sans-serif", marginBottom: '4px' }}>
                            Selected Voice
                        </div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#2D3425', fontFamily: "'Inter', sans-serif" }}>
                            {voiceInfo?.name ?? 'No voice selected'}
                        </div>
                    </div>
                </div>

                {/* Avatar summary */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    padding: '16px', borderRadius: '12px',
                    background: '#F7F5F0', border: '1px solid #D6DFC8',
                }}>
                    {selectedAvatar?.url ? (
                        <img src={selectedAvatar.url} alt="Avatar" style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(92,120,68,0.2)', flexShrink: 0 }} />
                    ) : (
                        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#E8F0E0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>🎙️</div>
                    )}
                    <div>
                        <div style={{ fontSize: '0.75rem', color: '#8A9272', fontFamily: "'Inter', sans-serif", marginBottom: '4px' }}>
                            Selected Avatar
                        </div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#2D3425', fontFamily: "'Inter', sans-serif" }}>
                            {selectedAvatar?.name ?? 'No avatar selected'}
                        </div>
                    </div>
                </div>

                {/* Script preview */}
                <div style={{
                    padding: '16px', borderRadius: '12px',
                    background: '#F7F5F0', border: '1px solid #D6DFC8',
                }}>
                    <div style={{ fontSize: '0.75rem', color: '#8A9272', fontFamily: "'Inter', sans-serif", marginBottom: '8px' }}>
                        Script Preview
                    </div>
                    <div style={{
                        fontSize: '0.88rem', color: '#2D3425', lineHeight: 1.65,
                        fontFamily: "'Inter', sans-serif",
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}>
                        {script}
                    </div>
                </div>
            </div>

            {generating && (
                <p style={{
                    textAlign: 'center', fontSize: '0.84rem', color: '#5A6348',
                    fontFamily: "'Inter', sans-serif", marginBottom: '16px',
                }}>
                    Generating avatar video. This may take a few seconds…
                </p>
            )}

            {genError && (
                <p style={{
                    textAlign: 'center', fontSize: '0.84rem', color: '#c0392b',
                    fontFamily: "'Inter', sans-serif", marginBottom: '16px',
                }}>
                    {genError}
                </p>
            )}

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <PrimaryBtn id="cv-generate-video" onClick={handleGenerate} disabled={generating}>
                    {generating
                        ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Generating video…</>
                        : <><Sparkles size={15} /> Generate Video</>
                    }
                </PrimaryBtn>
            </div>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </Card>
    )
}

// ────────────────────────────────────────────
// STEP 9: Video Preview
// ────────────────────────────────────────────
function Step9Preview({ videoUrl, script, voice, avatar, onSave, onRegenerate }: { 
    videoUrl?: string; 
    script: string;
    voice: string;
    avatar: AvatarSelection | null;
    onSave: () => void;
    onRegenerate: () => void;
}) {
    const [saved, setSaved] = useState(false)
    const navigate = useNavigate()

    function handleSave() {
        const existing = JSON.parse(localStorage.getItem('myVideos') ?? '[]')
        existing.unshift({
            id: Date.now(),
            title: 'Talking Avatar Video',
            date: new Date().toISOString(),
            videoUrl: videoUrl ?? '',
            script,
            voice,
            avatar
        })
        localStorage.setItem('myVideos', JSON.stringify(existing))
        onSave()
        setSaved(true)
        setTimeout(() => {
            navigate('/my-videos')
        }, 1200)
    }

    function handleDownload() {
        if (videoUrl) window.open(videoUrl, '_blank')
    }

    return (
        <Card>
            <SectionTitle>Video Preview</SectionTitle>
            <p style={{ fontSize: '0.84rem', color: '#8A9272', marginBottom: '24px', fontFamily: "'Inter', sans-serif" }}>
                Your video is ready! Preview, download, or save it to My Videos.
            </p>

            {videoUrl ? (
                <video
                    id="cv-video-player"
                    src={videoUrl}
                    controls
                    style={{
                        width: '100%', maxHeight: '380px', borderRadius: '14px',
                        border: '1px solid #5C7844',
                        boxShadow: '0 8px 32px rgba(61,82,41,0.18)',
                        marginBottom: '28px', background: '#000',
                        display: 'block',
                    }}
                />
            ) : (
                <div style={{
                    width: '100%', aspectRatio: '16/9', maxHeight: '380px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #2D3425, #3D5229)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    marginBottom: '28px',
                    border: '1px solid #5C7844',
                    boxShadow: '0 8px 32px rgba(61,82,41,0.18)',
                    position: 'relative', overflow: 'hidden',
                }}>
                    <motion.div
                        animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                            position: 'absolute', inset: 0,
                            background: 'radial-gradient(circle at 50% 50%, rgba(92,120,68,0.25), transparent 70%)',
                        }}
                    />
                    <motion.div
                        whileHover={{ scale: 1.12 }}
                        style={{
                            width: '68px', height: '68px', borderRadius: '50%',
                            background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(8px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '16px', cursor: 'pointer', zIndex: 1,
                            border: '1.5px solid rgba(255,255,255,0.25)',
                        }}
                    >
                        <Play size={28} color="#fff" fill="#fff" />
                    </motion.div>
                    <p style={{
                        color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem',
                        fontFamily: "'Inter', sans-serif", zIndex: 1,
                    }}>
                        Generated video preview will appear here
                    </p>
                </div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                <SecondaryBtn id="cv-download" onClick={handleDownload}>
                    <Download size={14} /> Download Video
                </SecondaryBtn>
                <SecondaryBtn id="cv-regenerate-video" onClick={onRegenerate}>
                    <RotateCcw size={14} /> Regenerate Video
                </SecondaryBtn>
                <PrimaryBtn id="cv-save-to-videos" onClick={handleSave}>
                    {saved
                        ? <><CheckCircle size={14} /> Saved! Redirecting...</>
                        : <><BookmarkPlus size={15} /> Save to My Videos</>
                    }
                </PrimaryBtn>
            </div>
        </Card>
    )
}

// ────────────────────────────────────────────
// MAIN PAGE
// ────────────────────────────────────────────
export default function CreateVideoPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [searchParams] = useSearchParams()
    const [step, setStep] = useState(() => searchParams.get('new_avatar') ? 7 : 1)

    const [topicData, setTopicData] = useState<TopicData>(() => ({
        topic: searchParams.get('topic') ?? '',
        description: '', tone: '', duration: '', platform: '',
    }))

    const [isGeneratingScript, setIsGeneratingScript] = useState(false)
    const [script, setScript] = useState(PLACEHOLDER_SCRIPT)
    const [translation, setTranslation] = useState('')
    const [selectedAvatar, setSelectedAvatar] = useState<AvatarSelection | null>(null)
    const [selectedVoice, setSelectedVoice] = useState('')
    const [generatedVideo, setGeneratedVideo] = useState('')

    function next() { setStep(s => Math.min(s + 1, 9)) }
    function back() { setStep(s => Math.max(s - 1, 1)) }

    const handleGenerateScript = async () => {
        setIsGeneratingScript(true)
        try {
            const response = await axios.post('http://localhost:5000/api/script/generate', {
                topic: topicData.topic,
                tone: topicData.tone,
                duration: topicData.duration
            })
            setScript(response.data.script)
            next()
        } catch (error) {
            console.error('Error generating script:', error)
            alert('Script generation failed. Please try again.')
        } finally {
            setIsGeneratingScript(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: '#F7F5F0', position: 'relative', overflowX: 'hidden' }}>
            <Navbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(v => !v)} />
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} activePath="/create-video" />

            <main style={{
                position: 'relative', zIndex: 10,
                minHeight: '100vh', paddingTop: '96px', paddingBottom: '60px',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                paddingLeft: '24px', paddingRight: '24px',
            }}>
                <div style={{ width: '100%', maxWidth: '760px' }}>

                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, ease: EASE }}
                        style={{ marginBottom: '32px', textAlign: 'center' }}
                    >
                        <h1 style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
                            fontWeight: 700, color: '#2D3425',
                            letterSpacing: '-0.5px', margin: '0 0 8px',
                        }}>
                            Create Video
                        </h1>
                        <p style={{
                            fontSize: '0.88rem', color: '#8A9272',
                            fontFamily: "'Inter', sans-serif",
                        }}>
                            Follow the steps below to create your AI-powered video
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        style={{
                            background: '#FFFFFF', borderRadius: '14px',
                            padding: '20px 24px', marginBottom: '28px',
                            border: '1px solid #D6DFC8',
                            boxShadow: '0 2px 12px rgba(61,82,41,0.06)',
                        }}
                    >
                        <StepIndicator currentStep={step} />
                    </motion.div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.32, ease: EASE }}
                        >
                            {step === 1 && (
                                <Step1Topic
                                    data={topicData}
                                    onChange={d => setTopicData(prev => ({ ...prev, ...d }))}
                                    onNext={handleGenerateScript}
                                    isGenerating={isGeneratingScript}
                                />
                            )}
                            {step === 2 && (
                                <Step2Script
                                    script={script}
                                    onRegenerate={() => setScript(PLACEHOLDER_SCRIPT + '\n\n[Regenerated version]')}
                                    onContinue={next}
                                />
                            )}
                            {step === 3 && (
                                <Step3EditScript
                                    script={script}
                                    onScriptChange={setScript}
                                    onSave={() => { }}
                                    onTranslate={next}
                                />
                            )}
                            {step === 4 && (
                                <Step4Translate
                                    sourceScript={script}
                                    onContinue={(_lang, text) => {
                                        setTranslation(text)
                                        next()
                                    }}
                                />
                            )}
                            {step === 5 && (
                                <Step5EditTranslation
                                    translation={translation}
                                    onTranslationChange={setTranslation}
                                    onSave={() => { }}
                                    onContinue={next}
                                />
                            )}
                            {step === 6 && (
                                <Step6Voice
                                    selectedVoice={selectedVoice}
                                    onSelect={setSelectedVoice}
                                    onContinue={next}
                                />
                            )}
                            {step === 7 && (
                                <AvatarCreationStep
                                    selectedAvatar={selectedAvatar}
                                    onSelect={setSelectedAvatar}
                                    onContinue={next}
                                />
                            )}
                            {step === 8 && (
                                <Step8Generate
                                    selectedAvatar={selectedAvatar}
                                    selectedVoice={selectedVoice}
                                    script={translation || script}
                                    onGenerate={(videoUrl) => {
                                        setGeneratedVideo(videoUrl)
                                        next()
                                    }}
                                />
                            )}
                            {step === 9 && (
                                <Step9Preview 
                                    videoUrl={generatedVideo} 
                                    script={script}
                                    voice={selectedVoice}
                                    avatar={selectedAvatar}
                                    onSave={() => { }}
                                    onRegenerate={() => setStep(8)}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {step > 1 && step < 9 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ marginTop: '16px', display: 'flex' }}
                        >
                            <SecondaryBtn id="cv-back" onClick={back}>
                                <ArrowLeft size={15} /> Back
                            </SecondaryBtn>
                        </motion.div>
                    )}
                </div>
            </main>

            <style>{`
                textarea::placeholder, input::placeholder { color: #B5BDA8 !important; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    )
}
