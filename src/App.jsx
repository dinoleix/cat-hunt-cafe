import { Routes, Route, Navigate } from 'react-router-dom'
import HomeScreen from './screens/HomeScreen.jsx'
import GameScreen from './screens/GameScreen.jsx'
import EndScreen from './screens/EndScreen.jsx'
import LeaderboardScreen from './screens/LeaderboardScreen.jsx'
import AdminScreen from './screens/AdminScreen.jsx'

export default function App() {
  return (
    <div className="min-h-screen-d">
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/play" element={<Navigate to="/play/1" replace />} />
        <Route path="/play/:levelId" element={<GameScreen />} />
        <Route path="/end" element={<EndScreen />} />
        <Route path="/leaderboard" element={<LeaderboardScreen />} />
        <Route path="/admin" element={<AdminScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
