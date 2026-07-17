import { motion, type Variants, type Transition } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
    Sparkles,
    Video,
    Globe,
    Smartphone,
    RefreshCw,
    Hash,
} from 'lucide-react'

const EASE: Transition['ease'] = [0.22, 1, 0.36, 1] as [number, number, number, number]

const features = [
    {
        icon: <Sparkles className="w-6 h-6" />,
        title: 'AI Script Generator',
        desc: 'Generate engaging scripts instantly by entering a topic. Perfect for short-form video content.',
    },
    {
        icon: <Video className="w-6 h-6" />,
        title: 'Custom Creator Avatars',
        desc: 'Upload a short video of yourself and create a reusable AI avatar for generating videos.',
    },
    {
        icon: <Globe className="w-6 h-6" />,
        title: 'Regional Language Support',
        desc: 'Translate scripts into Tamil, Telugu and Hindi to reach regional audiences.',
    },
    {
        icon: <Smartphone className="w-6 h-6" />,
        title: 'Reel-Ready Video Generation',
        desc: 'Generate vertical avatar videos optimized for YouTube Shorts and Instagram Reels.',
    },
    {
        icon: <RefreshCw className="w-6 h-6" />,
        title: 'Regenerate with Feedback',
        desc: 'Improve videos by regenerating them with remarks like tone adjustments or pacing changes.',
    },
    {
        icon: <Hash className="w-6 h-6" />,
        title: 'Caption & Hashtag Generator',
        desc: 'Automatically generate captions and hashtags to improve engagement on social media.',
    },
]

const fadeDown: Variants = {
    hidden: { opacity: 0, y: -20 },
    show: { opacity: 1, y: 0 },
}

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 36 },
    show: { opacity: 1, y: 0 },
}

function heroTransition(i: number): Transition {
    return { delay: i * 0.1, duration: 0.65, ease: EASE }
}

function cardTransition(i: number): Transition {
    return { delay: i * 0.08, duration: 0.6, ease: EASE }
}

export default function LandingPage() {
    return (
        <div style={{ background: '#F7F5F0', minHeight: '100vh' }}>

            {/* ── NAVBAR ── */}
            <nav
                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
                style={{
                    padding: '18px 48px',
                    background: 'rgba(247, 245, 240, 0.96)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid #D6DFC8',
                    boxShadow: '0 1px 12px rgba(61,82,41,0.05)',
                }}
            >
                <span style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    letterSpacing: '-0.3px',
                    color: '#2D3425',
                }}>
                    Script2Screen
                </span>
                <div className="flex gap-3">
                    <Link to="/login" id="nav-login" className="nav-ghost-btn">Login</Link>
                    <Link to="/signup" id="nav-signup" className="nav-solid-btn">Sign Up</Link>
                </div>
            </nav>

            {/* ── HERO ── */}
            <section
                id="hero"
                className="relative flex flex-col items-center justify-center text-center px-6"
                style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '80px' }}
            >
                {/* Subtle background accent */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'radial-gradient(ellipse at 60% 20%, rgba(143,175,114,0.12) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(200,213,185,0.15) 0%, transparent 55%)',
                    pointerEvents: 'none',
                }} />

                {/* Badge */}
                <motion.div
                    variants={fadeDown} initial="hidden" animate="show" transition={heroTransition(0)}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '6px 18px', marginBottom: '32px',
                        borderRadius: '9999px',
                        background: 'rgba(92, 120, 68, 0.10)',
                        border: '1px solid #C8D5B9',
                        fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.8px',
                        color: '#5C7844', textTransform: 'uppercase',
                    }}
                >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#5C7844', display: 'block' }} />
                    AI-Powered Creator Platform
                </motion.div>

                {/* Title */}
                <motion.h1
                    variants={fadeDown} initial="hidden" animate="show" transition={heroTransition(1)}
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 'clamp(3.2rem, 9vw, 7rem)',
                        fontWeight: 900,
                        letterSpacing: '-2px',
                        lineHeight: 1.05,
                        color: '#2D3425',
                        margin: 0,
                    }}
                >
                    Script
                    <em style={{ color: '#5C7844', fontStyle: 'italic' }}>2</em>
                    Screen
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    variants={fadeDown} initial="hidden" animate="show" transition={heroTransition(2)}
                    style={{
                        fontSize: 'clamp(1rem, 2.2vw, 1.25rem)',
                        marginTop: '24px',
                        lineHeight: '1.8',
                        color: '#5A6348',
                        maxWidth: '520px',
                        fontWeight: 400,
                    }}
                >
                    Turn your ideas into AI avatar videos in minutes.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    variants={fadeDown} initial="hidden" animate="show" transition={heroTransition(3)}
                    className="flex flex-wrap justify-center gap-4"
                    style={{ marginTop: '40px' }}
                >
                    <Link to="/login" id="hero-login" className="hero-outline-btn">Login</Link>
                    <Link to="/signup" id="hero-signup" className="hero-solid-btn">Get Started</Link>
                </motion.div>

                {/* Scroll cue */}
                <motion.div
                    variants={fadeDown} initial="hidden" animate="show" transition={heroTransition(4)}
                    className="flex flex-col items-center gap-2"
                    style={{ marginTop: '80px', opacity: 0.4 }}
                >
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2.5px', color: '#8A9272' }}>Scroll</span>
                    <div
                        style={{
                            width: '24px', height: '36px', borderRadius: '12px',
                            border: '1.5px solid #C8D5B9',
                            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                            paddingTop: '6px',
                        }}
                    >
                        <span style={{
                            display: 'block', width: '4px', height: '10px', borderRadius: '99px',
                            background: '#8A9272', animation: 'scrollBounce 2s ease-in-out infinite',
                        }} />
                    </div>
                </motion.div>
            </section>

            {/* ── FEATURES ── */}
            <section id="features" style={{ background: '#EDE9E1', padding: '96px 24px' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

                    {/* Section header */}
                    <motion.div
                        style={{ textAlign: 'center', marginBottom: '64px' }}
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.7, ease: EASE }}
                    >
                        <p style={{
                            fontSize: '0.73rem', fontWeight: 600, letterSpacing: '3px',
                            color: '#5C7844', textTransform: 'uppercase', marginBottom: '16px',
                        }}>
                            What We Offer
                        </p>
                        <h2 style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: 'clamp(2rem, 4vw, 3rem)',
                            fontWeight: 700,
                            color: '#2D3425',
                            letterSpacing: '-0.5px',
                        }}>
                            Everything you need to<br />
                            <em style={{ color: '#5C7844', fontStyle: 'italic' }}>go from idea to video</em>
                        </h2>
                        <p style={{
                            marginTop: '16px',
                            maxWidth: '500px', margin: '16px auto 0',
                            color: '#5A6348', fontSize: '1rem', lineHeight: '1.75',
                        }}>
                            A complete AI-powered pipeline — from script generation to publishing-ready reels.
                        </p>
                    </motion.div>

                    {/* Cards grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: '24px' }}>
                        {features.map((f, i) => (
                            <motion.div
                                key={f.title}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="show"
                                transition={cardTransition(i)}
                                viewport={{ once: true, amount: 0.15 }}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                className="feature-card"
                            >
                                <div className="feature-icon">
                                    <span style={{ color: '#5C7844' }}>{f.icon}</span>
                                </div>
                                <h3 style={{
                                    marginTop: '20px',
                                    fontFamily: "'Playfair Display', Georgia, serif",
                                    fontSize: '1.1rem', fontWeight: 700,
                                    color: '#2D3425',
                                }}>
                                    {f.title}
                                </h3>
                                <p style={{ marginTop: '10px', color: '#5A6348', fontSize: '0.9rem', lineHeight: '1.7' }}>
                                    {f.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer
                style={{
                    background: '#F7F5F0',
                    borderTop: '1px solid #D6DFC8',
                    padding: '48px 24px',
                    textAlign: 'center',
                }}
            >
                <p style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '1.1rem', fontWeight: 700,
                    color: '#2D3425',
                }}>
                    Script2Screen
                </p>
                <p style={{ marginTop: '6px', fontSize: '0.82rem', color: '#8A9272', letterSpacing: '0.5px' }}>
                    AI Creator Video Platform
                </p>
            </footer>

            {/* ── Inline styles ── */}
            <style>{`
        /* Navbar buttons */
        .nav-ghost-btn {
          padding: 8px 22px;
          border-radius: 9999px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #5A6348;
          border: 1.5px solid #C8D5B9;
          background: transparent;
          transition: all 0.25s ease;
          text-decoration: none;
          font-family: 'Inter', sans-serif;
        }
        .nav-ghost-btn:hover {
          border-color: #5C7844;
          color: #3D5229;
          background: rgba(92,120,68,0.07);
        }
        .nav-solid-btn {
          padding: 8px 22px;
          border-radius: 9999px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #fff;
          border: none;
          background: #5C7844;
          transition: all 0.25s ease;
          text-decoration: none;
          font-family: 'Inter', sans-serif;
        }
        .nav-solid-btn:hover {
          background: #3D5229;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(61,82,41,0.25);
        }

        /* Hero buttons */
        .hero-outline-btn {
          padding: 14px 40px;
          border-radius: 9999px;
          font-size: 1rem;
          font-weight: 600;
          color: #3D5229;
          border: 1.5px solid #5C7844;
          background: transparent;
          transition: all 0.3s ease;
          text-decoration: none;
          font-family: 'Inter', sans-serif;
        }
        .hero-outline-btn:hover {
          background: rgba(92,120,68,0.08);
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(92,120,68,0.15);
        }
        .hero-solid-btn {
          padding: 14px 40px;
          border-radius: 9999px;
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
          border: none;
          background: #5C7844;
          transition: all 0.3s ease;
          text-decoration: none;
          font-family: 'Inter', sans-serif;
          box-shadow: 0 4px 20px rgba(61,82,41,0.22);
        }
        .hero-solid-btn:hover {
          background: #3D5229;
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(61,82,41,0.30);
        }

        /* Feature card */
        .feature-card {
          background: #FFFFFF;
          border: 1px solid #D6DFC8;
          border-radius: 18px;
          padding: 32px 28px;
          cursor: default;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .feature-card:hover {
          border-color: #8FAF72;
          box-shadow: 0 8px 32px rgba(61,82,41,0.10);
        }
        .feature-icon {
          width: 50px; height: 50px;
          border-radius: 14px;
          background: rgba(92,120,68,0.10);
          border: 1px solid #C8D5B9;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.25s ease;
        }
        .feature-card:hover .feature-icon {
          background: rgba(92,120,68,0.16);
        }
      `}</style>
        </div>
    )
}
