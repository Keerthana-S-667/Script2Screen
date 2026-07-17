import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, RotateCcw, BookmarkPlus, CheckCircle } from 'lucide-react'
import type { AvatarSelection } from '../pages/CreateVideoPage'
import {
    AVATAR_LIBRARY_KEY,
    PrimaryBtn,
    SecondaryBtn,
    Card,
    SectionTitle
} from '../pages/CreateVideoPage'

export default function AvatarCreationStep({ selectedAvatar, onSelect, onContinue }: {
    selectedAvatar: AvatarSelection | null
    onSelect: (av: AvatarSelection) => void
    onContinue: () => void
}) {
    const navigate = useNavigate()
    const [mode, setMode] = useState<'idle' | 'camera' | 'preview'>('idle')
    const [previewUrl, setPreviewUrl] = useState('')
    const [previewName, setPreviewName] = useState('')
    const [library, setLibrary] = useState<AvatarSelection[]>([])
    const [libSaved, setLibSaved] = useState(false)
    const [cameraError, setCameraError] = useState('')

    const fileInputRef = useRef<HTMLInputElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const streamRef = useRef<MediaStream | null>(null)

    useEffect(() => {
        try {
            const stored = localStorage.getItem(AVATAR_LIBRARY_KEY)
            if (stored) setLibrary(JSON.parse(stored))
        } catch { /* ignore */ }
        return () => stopCamera()
    }, [])

    function stopCamera() {
        streamRef.current?.getTracks().forEach(t => t.stop())
        streamRef.current = null
    }

    async function startCamera() {
        setCameraError('')
        setMode('camera')
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
            streamRef.current = stream
            if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play() }
        } catch {
            setCameraError('Could not access camera. Please check browser permissions.')
            setMode('idle')
        }
    }

    function capturePhoto() {
        if (!videoRef.current || !canvasRef.current) return
        const v = videoRef.current; const c = canvasRef.current
        c.width = v.videoWidth || 640; c.height = v.videoHeight || 480
        c.getContext('2d')?.drawImage(v, 0, 0)
        const dataUrl = c.toDataURL('image/jpeg', 0.92)
        stopCamera(); setPreviewUrl(dataUrl); setPreviewName('Camera Photo'); setMode('preview'); setLibSaved(false)
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]; if (!file) return
        const reader = new FileReader()
        reader.onload = ev => {
            setPreviewUrl(ev.target?.result as string)
            setPreviewName(file.name.replace(/\.[^.]+$/, ''))
            setMode('preview'); setLibSaved(false)
        }
        reader.readAsDataURL(file); e.target.value = ''
    }

    function saveToLibrary() {
        const entry: AvatarSelection = { id: String(Date.now()), name: previewName || 'My Avatar', url: previewUrl }
        const updated = [entry, ...library]
        setLibrary(updated); localStorage.setItem(AVATAR_LIBRARY_KEY, JSON.stringify(updated)); setLibSaved(true)
    }

    function confirmPhoto() {
        onSelect({ id: String(Date.now()), name: previewName || 'My Avatar', url: previewUrl })
    }

    function retake() { setPreviewUrl(''); setMode('idle'); setLibSaved(false) }

    function deleteFromLibrary(id: string) {
        const updated = library.filter(a => a.id !== id)
        setLibrary(updated); localStorage.setItem(AVATAR_LIBRARY_KEY, JSON.stringify(updated))
    }

    const optionCard: React.CSSProperties = {
        flex: '1 1 180px', borderRadius: '14px', padding: '28px 20px',
        border: '2px dashed #C8D5B9', background: 'rgba(92,120,68,0.03)',
        cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s ease',
    }

    return (
        <Card>
            <SectionTitle>Create Your Avatar</SectionTitle>
            <p style={{ fontSize: '0.84rem', color: '#8A9272', marginBottom: '24px', fontFamily: "'Inter', sans-serif" }}>
                Your avatar image will be animated using AI. The system will synchronize the selected voice with your avatar to generate a talking video.
            </p>

            {/* Selected avatar badge */}
            {selectedAvatar && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 16px', borderRadius: '12px',
                    background: 'rgba(92,120,68,0.08)', border: '1.5px solid #5C7844',
                    marginBottom: '20px',
                }}>
                    <img src={selectedAvatar.url} alt="Selected avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #5C7844' }} />
                    <div>
                        <div style={{ fontSize: '0.72rem', color: '#5C7844', fontWeight: 700, fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.5px' }}>Avatar Selected</div>
                        <div style={{ fontSize: '0.88rem', color: '#2D3425', fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>{selectedAvatar.name}</div>
                    </div>
                    <button onClick={() => { setMode('idle'); setPreviewUrl('') }} style={{ marginLeft: 'auto', padding: '5px 12px', borderRadius: '9999px', border: '1.5px solid #C8D5B9', background: 'transparent', color: '#5A6348', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
                        Change
                    </button>
                </div>
            )}

            {/* ── IDLE: choose capture method ── */}
            {mode === 'idle' && (
                <>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#5A6348', marginBottom: '14px', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Add Avatar Photo
                    </h3>
                    {cameraError && <p style={{ fontSize: '0.82rem', color: '#c0392b', marginBottom: '14px', fontFamily: "'Inter', sans-serif" }}>{cameraError}</p>}
                    <div style={{ display: 'flex', gap: '14px', marginBottom: '28px', flexWrap: 'wrap' }}>

                        {/* Upload Photo */}
                        <motion.div whileHover={{ y: -3, borderColor: '#5C7844', background: 'rgba(92,120,68,0.07)' }} whileTap={{ scale: 0.98 }} onClick={() => fileInputRef.current?.click()} style={optionCard}>
                            <div style={{ fontSize: '2.2rem', marginBottom: '10px' }}>📸</div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#2D3425', fontFamily: "'Inter', sans-serif", marginBottom: '6px' }}>Upload Photo</div>
                            <div style={{ fontSize: '0.8rem', color: '#8A9272', fontFamily: "'Inter', sans-serif", marginBottom: '14px' }}>JPG or PNG</div>
                            <div style={{ padding: '7px 18px', borderRadius: '9999px', background: '#E8EFE0', color: '#5A6348', fontSize: '0.8rem', fontWeight: 600, display: 'inline-block', fontFamily: "'Inter', sans-serif" }}>Browse Files</div>
                        </motion.div>

                        {/* Use Camera */}
                        <motion.div whileHover={{ y: -3, borderColor: '#5C7844', background: 'rgba(92,120,68,0.07)' }} whileTap={{ scale: 0.98 }} onClick={startCamera} style={optionCard}>
                            <div style={{ fontSize: '2.2rem', marginBottom: '10px' }}>🎥</div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#2D3425', fontFamily: "'Inter', sans-serif", marginBottom: '6px' }}>Use Camera</div>
                            <div style={{ fontSize: '0.8rem', color: '#8A9272', fontFamily: "'Inter', sans-serif", marginBottom: '14px' }}>Capture a photo live</div>
                            <div style={{ padding: '7px 18px', borderRadius: '9999px', background: '#E8EFE0', color: '#5A6348', fontSize: '0.8rem', fontWeight: 600, display: 'inline-block', fontFamily: "'Inter', sans-serif" }}>Open Camera</div>
                        </motion.div>

                        {/* Custom Avatar Options Page */}
                        <motion.div whileHover={{ y: -3, borderColor: '#5C7844', background: 'rgba(92,120,68,0.07)' }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/avatars?returnPath=create-video')} style={optionCard}>
                            <div style={{ fontSize: '2.2rem', marginBottom: '10px' }}>👤</div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#2D3425', fontFamily: "'Inter', sans-serif", marginBottom: '6px' }}>Create New Avatar</div>
                            <div style={{ fontSize: '0.8rem', color: '#8A9272', fontFamily: "'Inter', sans-serif", marginBottom: '14px' }}>Advanced customization</div>
                            <div style={{ padding: '7px 18px', borderRadius: '9999px', background: '#E8EFE0', color: '#5A6348', fontSize: '0.8rem', fontWeight: 600, display: 'inline-block', fontFamily: "'Inter', sans-serif" }}>Go to Avatars</div>
                        </motion.div>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/jpg" onChange={handleFileChange} style={{ display: 'none' }} />

                    {/* Avatar Library */}
                    {library.length > 0 && (
                        <>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#5A6348', marginBottom: '14px', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Avatar Library
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                                {library.map(av => {
                                    const isSel = selectedAvatar?.id === av.id
                                    return (
                                        <motion.div key={av.id} whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(61,82,41,0.14)' }} style={{ borderRadius: '14px', padding: '14px 10px', border: isSel ? '2px solid #5C7844' : '1.5px solid #D6DFC8', background: isSel ? 'rgba(92,120,68,0.08)' : '#FFFFFF', textAlign: 'center', position: 'relative', transition: 'all 0.2s ease' }}>
                                            {isSel && <div style={{ position: 'absolute', top: '8px', right: '8px', width: '18px', height: '18px', borderRadius: '50%', background: '#5C7844', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle size={11} color="#fff" /></div>}
                                            <img src={av.url} alt={av.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(92,120,68,0.2)', margin: '0 auto 10px', display: 'block' }} />
                                            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#2D3425', fontFamily: "'Inter', sans-serif", marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{av.name}</div>
                                            <button onClick={() => onSelect(av)} style={{ padding: '4px 0', borderRadius: '9999px', border: 'none', background: isSel ? '#5C7844' : '#E8EFE0', color: isSel ? '#fff' : '#5A6348', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif", marginBottom: '6px', display: 'block', width: '100%' }}>
                                                {isSel ? '\u2713 Selected' : 'Select'}
                                            </button>
                                            <button onClick={() => deleteFromLibrary(av.id)} style={{ padding: '3px 8px', borderRadius: '9999px', border: '1px solid #D6DFC8', background: 'transparent', color: '#8A9272', fontSize: '0.68rem', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>Remove</button>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </>
                    )}
                </>
            )}

            {/* ── CAMERA: live preview ── */}
            {mode === 'camera' && (
                <div>
                    <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', marginBottom: '16px', background: '#000' }}>
                        <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', maxHeight: '380px', objectFit: 'cover', display: 'block' }} />
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                        <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', padding: '4px 10px' }}>
                            <span style={{ color: '#fff', fontSize: '0.75rem', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>📷 Camera Active</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <SecondaryBtn onClick={() => { stopCamera(); setMode('idle') }}><ArrowLeft size={14} /> Cancel</SecondaryBtn>
                        <PrimaryBtn onClick={capturePhoto}><span style={{ fontSize: '1rem' }}>📸</span> Capture Photo</PrimaryBtn>
                    </div>
                </div>
            )}

            {/* ── PREVIEW: review uploaded / captured photo ── */}
            {mode === 'preview' && previewUrl && (
                <div>
                    <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', marginBottom: '16px' }}>
                        <img src={previewUrl} alt="Avatar preview" style={{ width: '100%', maxHeight: '380px', objectFit: 'cover', display: 'block' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.35), transparent)' }} />
                        <p style={{ position: 'absolute', bottom: '16px', left: '16px', color: '#fff', fontSize: '0.82rem', fontFamily: "'Inter', sans-serif", fontWeight: 600, margin: 0 }}>{previewName}</p>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                        <SecondaryBtn onClick={retake}><RotateCcw size={14} /> Retake / Change</SecondaryBtn>
                        <SecondaryBtn onClick={saveToLibrary}>
                            {libSaved ? <><CheckCircle size={14} /> Saved!</> : <><BookmarkPlus size={14} /> Save to Library</>}
                        </SecondaryBtn>
                        <PrimaryBtn onClick={confirmPhoto}><CheckCircle size={15} /> Use this Photo</PrimaryBtn>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
                <PrimaryBtn id="cv-avatar-continue" onClick={onContinue} disabled={!selectedAvatar}>
                    Continue <ArrowRight size={15} />
                </PrimaryBtn>
            </div>
        </Card>
    )
}
