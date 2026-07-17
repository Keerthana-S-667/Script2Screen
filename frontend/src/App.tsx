import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import OnboardingPage from './pages/OnboardingPage'
import OnboardingStep1 from './pages/OnboardingStep1'
import OnboardingStep2 from './pages/OnboardingStep2'
import OnboardingStep3 from './pages/OnboardingStep3'
import DashboardPage from './pages/DashboardPage'
import CreateVideoPage from './pages/CreateVideoPage'
import ProfilePage from './pages/ProfilePage'
import MyVideosPage from './pages/MyVideosPage'
import AvatarsPage from './pages/AvatarsPage'
import ScriptsPage from './pages/ScriptsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  return (
    <BrowserRouter basename="/Script2Screen">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/onboarding/step1" element={<OnboardingStep1 />} />
        <Route path="/onboarding/step2" element={<OnboardingStep2 />} />
        <Route path="/onboarding/step3" element={<OnboardingStep3 />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/create-video" element={<CreateVideoPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/my-videos" element={<MyVideosPage />} />
        <Route path="/avatars" element={<AvatarsPage />} />
        <Route path="/scripts" element={<ScriptsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
