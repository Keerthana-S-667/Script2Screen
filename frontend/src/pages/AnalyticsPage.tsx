import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    Video,
    FileText,
    Download,
    UserCircle,
    Activity,
    Plus,
    BarChart3,
    PieChart as PieChartIcon,
    CalendarClock
} from 'lucide-react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

// ── Types & Simulated Data ───────────────────────────────────────────────────

interface AnalyticsOverview {
    totalVideos: number
    draftVideos: number
    downloads: number
    avatarsCreated: number
}

interface ChartDataPoint {
    name: string
    videos: number
}

interface PlatformDataPoint {
    name: string
    value: number
}

interface ActivityItem {
    id: string
    action: string
    description: string
    timestamp: string
}

// Simulated data states for the dashboard
const MOCK_OVERVIEW: AnalyticsOverview = {
    totalVideos: 12,
    draftVideos: 3,
    downloads: 24,
    avatarsCreated: 2,
}

const MOCK_CHART_DATA: ChartDataPoint[] = [
    { name: 'Mon', videos: 2 },
    { name: 'Tue', videos: 1 },
    { name: 'Wed', videos: 0 },
    { name: 'Thu', videos: 3 },
    { name: 'Fri', videos: 2 },
    { name: 'Sat', videos: 1 },
    { name: 'Sun', videos: 3 },
]

const MOCK_PLATFORM_DATA: PlatformDataPoint[] = [
    { name: 'YouTube Shorts', value: 65 },
    { name: 'Instagram Reels', value: 35 },
]

const COLORS = ['#5C7844', '#8FAF72', '#C8D5B9', '#2D3425']

const MOCK_ACTIVITY: ActivityItem[] = [
    {
        id: 'act-1',
        action: 'Created video',
        description: 'Water Conservation',
        timestamp: '2 hours ago',
    },
    {
        id: 'act-2',
        action: 'Generated script',
        description: 'AI in Education',
        timestamp: '5 hours ago',
    },
    {
        id: 'act-3',
        action: 'Created avatar',
        description: 'Professional Tutor',
        timestamp: '1 day ago',
    },
    {
        id: 'act-4',
        action: 'Downloaded video',
        description: 'Tech Trends 2025',
        timestamp: '2 days ago',
    },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

// ── Shared Card Component ─────────────────────────────────────────────────────

function StatCard({ 
    title, 
    value, 
    icon: Icon 
}: { 
    title: string 
    value: number | string 
    icon: React.ElementType 
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #D6DFC8',
                boxShadow: '0 4px 20px rgba(61,82,41,0.06)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: '#F0F4EC', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <Icon size={20} color="#5C7844" />
                </div>
                <h3 style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: '#5A6348',
                    margin: 0,
                }}>
                    {title}
                </h3>
            </div>
            <div style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '2.5rem',
                fontWeight: 700,
                color: '#2D3425',
                lineHeight: 1,
            }}>
                {value}
            </div>
        </motion.div>
    )
}

// ── Main Page Component ───────────────────────────────────────────────────────

export default function AnalyticsPage() {
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    
    // Simulate reading from local state. Change to EMPTY_OVERVIEW to test empty state.
    const [overview] = useState<AnalyticsOverview>(MOCK_OVERVIEW)
    const [chartData] = useState<ChartDataPoint[]>(MOCK_CHART_DATA)
    const [platformData] = useState<PlatformDataPoint[]>(MOCK_PLATFORM_DATA)
    const [activities] = useState<ActivityItem[]>(MOCK_ACTIVITY)

    const hasData = overview.totalVideos > 0

    return (
        <div style={{ minHeight: '100vh', background: '#F7F5F0', position: 'relative', overflowX: 'hidden' }}>
            <Navbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} activePath="/analytics" />

            <main style={{
                position: 'relative', zIndex: 10,
                minHeight: '100vh',
                paddingTop: '88px',
                paddingBottom: '80px',
                paddingLeft: 'clamp(20px, 5vw, 64px)',
                paddingRight: 'clamp(20px, 5vw, 64px)',
                maxWidth: '1280px',
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
                        Analytics
                    </h1>
                     <p style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '1rem',
                        color: '#5A6348',
                        margin: 0,
                    }}>
                        Track your video creation activity and performance insights.
                    </p>
                </motion.div>

                {/* ── Conditional Rendering for Empty State vs Content ── */}
                {!hasData ? (
                    <motion.div
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
                         style={{
                             padding: '80px 24px', textAlign: 'center', background: '#FFFFFF',
                             borderRadius: '20px', border: '1px dashed #C8D5B9',
                             display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
                             maxWidth: '600px', margin: '0 auto',
                         }}
                     >
                          <div style={{
                              width: '80px', height: '80px', borderRadius: '50%',
                              background: 'rgba(92,120,68,0.08)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                              <BarChart3 size={36} color="#8FAF72" />
                          </div>
                          <div>
                              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.4rem', fontWeight: 600, color: '#2D3425', margin: '0 0 10px 0' }}>
                                  No analytics data yet
                              </h3>
                              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.95rem', color: '#8A9272', margin: 0, maxWidth: '300px' }}>
                                  Start creating videos to see your analytics and platform insights here!
                              </p>
                          </div>
                          <motion.button
                              onClick={() => navigate('/create-video')}
                              whileHover={{ scale: 1.04, boxShadow: '0 8px 24px rgba(61,82,41,0.20)' }}
                              whileTap={{ scale: 0.97 }}
                              style={{
                                  marginTop: '12px', padding: '12px 30px', borderRadius: '9999px',
                                  background: '#5C7844', border: 'none', color: '#fff',
                                  fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', 
                                  display: 'flex', alignItems: 'center', gap: '8px',
                                  fontFamily: "'Inter', sans-serif",
                              }}
                          >
                              <Plus size={18} /> Create Video
                          </motion.button>
                     </motion.div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        
                        {/* ── Overview Statistics Row ── */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                            gap: '24px'
                        }}>
                            <StatCard title="Total Videos Created" value={overview.totalVideos} icon={Video} />
                            <StatCard title="Draft Videos" value={overview.draftVideos} icon={FileText} />
                            <StatCard title="Downloads" value={overview.downloads} icon={Download} />
                            <StatCard title="Avatars Created" value={overview.avatarsCreated} icon={UserCircle} />
                        </div>

                        {/* ── Charts Row ── */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                            gap: '24px'
                        }}>
                            {/* Line / Bar Chart Card */}
                            <motion.div
                                initial={{ opacity: 0, x: -15 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
                                style={{
                                    background: '#FFFFFF', borderRadius: '16px', border: '1px solid #D6DFC8',
                                    boxShadow: '0 4px 20px rgba(61,82,41,0.04)', padding: '24px',
                                    flex: 2, minHeight: '380px', display: 'flex', flexDirection: 'column'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                                    <BarChart3 size={20} color="#5C7844" />
                                    <h2 style={{
                                        fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.25rem',
                                        fontWeight: 700, color: '#2D3425', margin: 0
                                    }}>
                                        Videos Created Over Time
                                    </h2>
                                </div>
                                <div style={{ flex: 1, width: '100%' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EFE0" />
                                            <XAxis 
                                                dataKey="name" 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: '#8A9272', fontSize: 13, fontFamily: 'Inter' }} 
                                                dy={10}
                                            />
                                            <YAxis 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: '#8A9272', fontSize: 13, fontFamily: 'Inter' }}
                                                allowDecimals={false}
                                            />
                                            <Tooltip 
                                                cursor={{ fill: 'rgba(92,120,68,0.06)' }}
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                                                labelStyle={{ fontWeight: 600, color: '#2D3425', marginBottom: '4px' }}
                                            />
                                            <Bar dataKey="videos" fill="#8FAF72" radius={[6, 6, 0, 0]} barSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>

                            {/* Pie Chart Card */}
                            <motion.div
                                initial={{ opacity: 0, x: 15 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
                                style={{
                                    background: '#FFFFFF', borderRadius: '16px', border: '1px solid #D6DFC8',
                                    boxShadow: '0 4px 20px rgba(61,82,41,0.04)', padding: '24px',
                                    flex: 1, minHeight: '380px', display: 'flex', flexDirection: 'column'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                    <PieChartIcon size={20} color="#5C7844" />
                                    <h2 style={{
                                        fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.25rem',
                                        fontWeight: 700, color: '#2D3425', margin: 0
                                    }}>
                                        Platform Usage
                                    </h2>
                                </div>
                                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', color: '#8A9272', margin: '0 0 24px 0' }}>
                                    Target platform distribution.
                                </p>
                                <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={platformData}
                                                cx="50%"
                                                cy="45%"
                                                innerRadius={65}
                                                outerRadius={90}
                                                paddingAngle={4}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {platformData.map((_entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                                                itemStyle={{ fontWeight: 600 }}
                                            />
                                            <Legend 
                                                verticalAlign="bottom" 
                                                height={36} 
                                                iconType="circle"
                                                wrapperStyle={{ fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', color: '#5A6348' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>
                        </div>

                        {/* ── Recent Activity Section ── */}
                        <motion.section
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                <Activity size={22} color="#5C7844" />
                                <h2 style={{
                                    fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.4rem',
                                    fontWeight: 700, color: '#2D3425', margin: 0
                                }}>
                                    Recent Activity
                                </h2>
                            </div>

                            <div style={{
                                background: '#FFFFFF', borderRadius: '16px', border: '1px solid #D6DFC8',
                                padding: '0 24px', boxShadow: '0 4px 20px rgba(61,82,41,0.03)',
                            }}>
                                {activities.map((act, index) => (
                                    <div 
                                        key={act.id}
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            padding: '20px 0',
                                            borderBottom: index !== activities.length - 1 ? '1px solid #E8EFE0' : 'none'
                                        }}
                                    >
                                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                            <div style={{
                                                width: '44px', height: '44px', borderRadius: '50%', background: '#F9FCF5',
                                                border: '1px solid #E8EFE0', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                <CalendarClock size={18} color="#8A9272" />
                                            </div>
                                            <div>
                                                <p style={{
                                                    fontFamily: "'Inter', sans-serif", fontSize: '0.95rem',
                                                    fontWeight: 600, color: '#2D3425', margin: '0 0 4px 0'
                                                }}>
                                                    {act.action}: <span style={{ color: '#5A6348', fontWeight: 500 }}>{act.description}</span>
                                                </p>
                                                <span style={{
                                                    fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', color: '#8A9272'
                                                }}>
                                                    {act.timestamp}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    </div>
                )}
            </main>
        </div>
    )
}
