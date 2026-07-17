import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
    Camera,
    Trash2,
    CheckCircle2,
    User,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

import { type AvatarSelection, AVATAR_LIBRARY_KEY } from './CreateVideoPage'

// ── Simulated System Data ──────────────────────────────────────────────────────

function loadCustomAvatars(): AvatarSelection[] {
    try {
        const raw = localStorage.getItem(AVATAR_LIBRARY_KEY)
        if (raw) return JSON.parse(raw) as AvatarSelection[]
    } catch {
        // ignore
    }
    return []
}

function saveCustomAvatars(avatars: AvatarSelection[]) {
    localStorage.setItem(AVATAR_LIBRARY_KEY, JSON.stringify(avatars))
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

// ── Image Placeholders ───────────────────────────────────────────────────────

function AvatarPlaceholder({ name, type }: { name: string; type: 'custom' | 'library' }) {
    const initials = name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? '')
        .join('')

    const isCustom = type === 'custom'

    return (
        <div
            style={{
                width: '100%',
                aspectRatio: '1/1',
                background: isCustom
                    ? 'linear-gradient(135deg, #E8EFE0, #D6DFC8)'
                    : 'linear-gradient(135deg, #3D5229, #5C7844)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background pattern */}
            <div style={{
                position: 'absolute', inset: 0, opacity: 0.08,
                backgroundImage: 'radial-gradient(circle at 30% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 70%, white 1px, transparent 1px)',
                backgroundSize: '32px 32px',
            }} />

            <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: isCustom ? 'rgba(92,120,68,0.15)' : 'rgba(255,255,255,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(4px)',
                zIndex: 1,
            }}>
                {isCustom
                    ? <User size={30} color="#5C7844" />
                    : <Camera size={30} color="#fff" />}
            </div>

            <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.85rem',
                fontWeight: 700,
                color: isCustom ? '#5A6348' : 'rgba(255,255,255,0.9)',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                zIndex: 1,
            }}>
                {initials}
            </span>
            
            {/* Bottom Gradient Fade */}
             <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.15), transparent)',
            }} />
        </div>
    )
}

// ── Avatar Card Component ─────────────────────────────────────────────────────

function AvatarCard({ 
    avatar, 
    onDelete, 
    onUse,
    isSelectable = false,
    selectedId = null
}: { 
    avatar: AvatarSelection; 
    onDelete?: (id: string) => void;
    onUse?: (avatar: AvatarSelection) => void;
    isSelectable?: boolean;
    selectedId?: string | null;
}) {
    const isSelected = selectedId === avatar.id

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: EASE }}
            style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                border: isSelected ? '2px solid #5C7844' : '1px solid #D6DFC8',
                boxShadow: isSelected ? '0 8px 24px rgba(61,82,41,0.15)' : '0 2px 16px rgba(61,82,41,0.07)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'all 0.2s ease',
            }}
        >
             {isSelected && (
                <div style={{
                     position: 'absolute', top: '12px', right: '12px', zIndex: 10,
                     background: '#5C7844', borderRadius: '50%', width: '24px', height: '24px',
                     display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <CheckCircle2 size={14} color="#fff" />
                </div>
            )}

            <div style={{ position: 'relative' }}>
                {avatar.url ? (
                    <img src={avatar.url} alt={avatar.name} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }} />
                ) : (
                    <AvatarPlaceholder name={avatar.name} type={'custom'} />
                )}
            </div>

            <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Info */}
                <div>
                     <h3 style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        color: '#2D3425',
                        lineHeight: 1.35,
                        margin: 0,
                    }}>
                        {avatar.name}
                    </h3>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '4px' }}>
                     {isSelectable ? (
                         <motion.button
                            onClick={() => onUse?.(avatar)}
                            whileHover={{ scale: 1.02, backgroundColor: isSelected ? '#5C7844' : 'rgba(92,120,68,0.08)' }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                flex: 1,
                                padding: '9px 12px',
                                borderRadius: '9px',
                                border: isSelected ? 'none' : '1px solid #C8D5B9',
                                background: isSelected ? '#5C7844' : 'transparent',
                                color: isSelected ? '#fff' : '#5C7844',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                fontFamily: "'Inter', sans-serif",
                                transition: 'all 0.18s ease',
                            }}
                        >
                            {isSelected ? 'Selected' : 'Select'}
                        </motion.button>
                     ) : (
                        <>
                            <motion.button
                                onClick={() => onUse?.(avatar)}
                                whileHover={{ scale: 1.02, boxShadow: '0 4px 14px rgba(61,82,41,0.18)' }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    flex: 1,
                                    padding: '9px 12px',
                                    borderRadius: '9px',
                                    border: 'none',
                                    background: '#5C7844',
                                    color: '#fff',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    fontFamily: "'Inter', sans-serif",
                                    transition: 'all 0.18s ease',
                                }}
                            >
                                Use Avatar
                            </motion.button>
        
                            {onDelete && (
                                <motion.button
                                    onClick={() => onDelete(avatar.id)}
                                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(185,60,60,0.08)' }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        width: '36px', height: '36px', flexShrink: 0,
                                        borderRadius: '9px',
                                        border: '1px solid rgba(185,80,80,0.25)',
                                        background: 'transparent',
                                        color: '#9B5050',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.18s ease',
                                    }}
                                >
                                    <Trash2 size={14} />
                                </motion.button>
                            )}
                        </>
                     )}
                </div>
            </div>
        </motion.div>
    )
}

// ── Upload Validation Mock ──────────────────────────────────────────────────

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AvatarsPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [customAvatars, setCustomAvatars] = useState<AvatarSelection[]>(() => loadCustomAvatars())
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const returnPath = searchParams.get('returnPath')
    
    // Photo/Camera State
    const [mode, setMode] = useState<'idle' | 'camera' | 'preview'>('idle')
    const [previewUrl, setPreviewUrl] = useState('')
    const [previewName, setPreviewName] = useState('')
    const [cameraError, setCameraError] = useState('')

    const fileInputRef = useRef<HTMLInputElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const createSectionRef = useRef<HTMLElement>(null)

    // Persist on change
    useEffect(() => {
        saveCustomAvatars(customAvatars)
    }, [customAvatars])

    useEffect(() => stopCamera, [])

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
        stopCamera(); setPreviewUrl(dataUrl); setPreviewName('Camera Photo'); setMode('preview');
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]; if (!file) return
        const reader = new FileReader()
        reader.onload = ev => {
            setPreviewUrl(ev.target?.result as string)
            setPreviewName(file.name.replace(/\.[^.]+$/, ''))
            setMode('preview')
        }
        reader.readAsDataURL(file); e.target.value = ''
    }

    function saveToLibrary() {
        const entry: AvatarSelection = { id: String(Date.now()), name: previewName || 'My Avatar', url: previewUrl }
        setCustomAvatars(prev => [entry, ...prev])
        setMode('idle')
        setPreviewUrl('')
        if (returnPath === 'create-video') {
            navigate('/create-video?new_avatar=true')
        }
    }

    function handleDelete(id: string) {
        setCustomAvatars((prev) => prev.filter((a) => a.id !== id))
    }
    
     function handleUseCustom(avatar: AvatarSelection) {
        if (returnPath === 'create-video') {
            // They can just go back to create-video and select it from their library
            navigate('/create-video?new_avatar=true')
        } else {
            console.log("Use custom avatar:", avatar.name)
        }
    }


    const optionCard: React.CSSProperties = {
        flex: '1 1 180px', borderRadius: '14px', padding: '28px 20px',
        border: '2px dashed #C8D5B9', background: 'rgba(92,120,68,0.03)',
        cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s ease',
    }

    const scrollToCreate = () => {
         createSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div style={{ minHeight: '100vh', background: '#F7F5F0', position: 'relative', overflowX: 'hidden' }}>

            {/* Navbar */}
            <Navbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((v) => !v)} />

            {/* Sidebar */}
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} activePath="/avatars" />

            {/* Main */}
            <main style={{
                position: 'relative', zIndex: 10,
                minHeight: '100vh',
                paddingTop: '88px',
                paddingBottom: '80px',
                paddingLeft: 'clamp(20px, 5vw, 64px)',
                paddingRight: 'clamp(20px, 5vw, 64px)',
                maxWidth: '1200px',
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
                        Avatars
                    </h1>
                     <p style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '1rem',
                        color: '#5A6348',
                        margin: 0,
                    }}>
                        Create and manage your AI avatars.
                    </p>
                </motion.div>

                {/* ── Section 1: Create New Avatar ── */}
                <motion.section 
                    ref={createSectionRef}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
                    style={{ marginBottom: '48px', scrollMarginTop: '100px' }}
                >
                     <div style={{
                        background: '#FFFFFF',
                        borderRadius: '20px',
                        border: '1px solid #D6DFC8',
                        boxShadow: '0 4px 24px rgba(61,82,41,0.06)',
                        padding: 'clamp(24px, 4vw, 40px)',
                    }}>
                         <div style={{ marginBottom: '24px' }}>
                             <h2 style={{
                                fontFamily: "'Playfair Display', Georgia, serif",
                                fontSize: '1.4rem',
                                fontWeight: 700,
                                color: '#2D3425',
                                marginBottom: '8px',
                            }}>
                                Create New Avatar
                            </h2>
                             <p style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: '0.95rem',
                                color: '#5A6348',
                                lineHeight: 1.5,
                            }}>
                                Upload a short video of yourself (5–10 seconds) to generate a personal AI avatar.
                                Make sure your face is clearly visible and you are looking at the camera.
                            </p>
                         </div>
                         
                         {/* ── IDLE: choose capture method ── */}
                         {mode === 'idle' && (
                             <>
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
                                 </div>
                                 <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/jpg" onChange={handleFileChange} style={{ display: 'none' }} />
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
                                     <button onClick={() => { stopCamera(); setMode('idle') }} style={{ padding: '8px 16px', borderRadius: '9px', border: '1px solid #D6DFC8', background: '#fff', color: '#5A6348', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
                                         Cancel
                                     </button>
                                     <button onClick={capturePhoto} style={{ padding: '8px 16px', borderRadius: '9px', border: 'none', background: '#5C7844', color: '#fff', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
                                         📸 Capture Photo
                                     </button>
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
                                     <button onClick={() => { setPreviewUrl(''); setMode('idle'); }} style={{ padding: '8px 16px', borderRadius: '9px', border: '1px solid #D6DFC8', background: '#fff', color: '#5A6348', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
                                         Retake / Change
                                     </button>
                                     <button onClick={saveToLibrary} style={{ padding: '8px 16px', borderRadius: '9px', border: 'none', background: '#5C7844', color: '#fff', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
                                         <CheckCircle2 size={15} style={{ display: 'inline', verticalAlign: '-3px', marginRight: '4px' }}/> 
                                         Save to Library
                                     </button>
                                 </div>
                             </div>
                         )}
                     </div>
                </motion.section>

                {/* ── Section 2: My Avatars ── */}
                <motion.section 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
                    style={{ marginBottom: '48px' }}
                >
                    <h2 style={{
                         fontFamily: "'Playfair Display', Georgia, serif",
                         fontSize: '1.4rem',
                         fontWeight: 700,
                         color: '#2D3425',
                         marginBottom: '20px',
                         paddingBottom: '12px',
                         borderBottom: '1px solid #E8EFE0'
                     }}>
                         My Avatars
                     </h2>
                     
                     {customAvatars.length === 0 ? (
                         // Empty State
                         <div style={{
                             padding: '64px 24px',
                             textAlign: 'center',
                             background: 'rgba(255,255,255,0.5)',
                             borderRadius: '16px',
                             border: '1px dashed #C8D5B9',
                             display: 'flex',
                             flexDirection: 'column',
                             alignItems: 'center',
                             gap: '16px'
                         }}>
                              <div style={{
                                  width: '72px', height: '72px', borderRadius: '50%',
                                  background: 'rgba(92,120,68,0.08)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                              }}>
                                  <User size={32} color="#8FAF72" />
                              </div>
                              <div>
                                  <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.15rem', fontWeight: 600, color: '#2D3425', margin: '0 0 8px 0' }}>
                                      You haven't created any avatars yet.
                                  </p>
                                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color: '#8A9272', margin: 0 }}>
                                      Upload a video above to generate your first personal AI avatar.
                                  </p>
                              </div>
                              <motion.button
                                  onClick={scrollToCreate}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  style={{
                                      marginTop: '8px', padding: '10px 24px', borderRadius: '9999px',
                                      background: '#fff', border: '1px solid #C8D5B9', color: '#3D5229',
                                      fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                                  }}
                              >
                                  Create Avatar
                              </motion.button>
                         </div>
                     ) : (
                         // Grid Layout
                         <motion.div 
                             layout
                             style={{
                                 display: 'grid',
                                 gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                                 gap: '24px',
                             }}
                         >
                             <AnimatePresence>
                                 {customAvatars.map(avatar => (
                                     <AvatarCard 
                                        key={avatar.id} 
                                        avatar={avatar} 
                                        onDelete={handleDelete}
                                        onUse={handleUseCustom}
                                    />
                                 ))}
                             </AnimatePresence>
                         </motion.div>
                     )}
                </motion.section>



            </main>
        </div>
    )
}
