import { Navigate, Route, Routes } from 'react-router-dom'
import { useApp } from './context/AppContext'
import Layout from './components/Layout'
import AuthPage from './pages/AuthPage'
import SetupPage from './pages/SetupPage'
import HomePage from './pages/HomePage'
import ChoresPage from './pages/ChoresPage'
import ChoreDetailPage from './pages/ChoreDetailPage'
import ChoreFormPage from './pages/ChoreFormPage'
import ApprovalsPage from './pages/ApprovalsPage'
import LeaderboardPage from './pages/LeaderboardPage'
import GoalsPage from './pages/GoalsPage'
import MorePage from './pages/MorePage'
import NotificationsPage from './pages/NotificationsPage'
import { Spinner } from './components/ui'

export default function App() {
  const { session, households, loading } = useApp()

  if (loading) return <div className="min-h-dvh bg-krita flex items-center justify-center"><Spinner /></div>
  if (!session) return <AuthPage />
  if (households.length === 0) return <SetupPage />

  return (
    <Routes>
      <Route path="/setup" element={<SetupPage />} />
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/sysslor" element={<ChoresPage />} />
        <Route path="/sysslor/ny" element={<ChoreFormPage />} />
        <Route path="/sysslor/:id" element={<ChoreDetailPage />} />
        <Route path="/sysslor/:id/redigera" element={<ChoreFormPage />} />
        <Route path="/godkann" element={<ApprovalsPage />} />
        <Route path="/topplista" element={<LeaderboardPage />} />
        <Route path="/mal" element={<GoalsPage />} />
        <Route path="/mer" element={<MorePage />} />
        <Route path="/notiser" element={<NotificationsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
