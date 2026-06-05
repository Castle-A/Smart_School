import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ProtectedRoute from './components/ProtectedRoute'
import SupportInboxPage from './components/layout/SupportInbox'
import AuditLogPage from './pages/AuditLogPage'
import ManageTeamPage from './pages/ManageTeamPage'
import SupportLayout from './components/layout/SupportLayout'

import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Route Publique : Login / Landing */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Navigate to="/" replace />} />

          {/* Routes Protégées : Nécessitent authentification */}
          <Route path="/inbox" element={
            <ProtectedRoute>
              <SupportLayout>
                <SupportInboxPage />
              </SupportLayout>
            </ProtectedRoute>
          } />

          <Route path="/audit-logs" element={
            <ProtectedRoute>
              <SupportLayout>
                <AuditLogPage />
              </SupportLayout>
            </ProtectedRoute>
          } />

          <Route path="/team" element={
            <ProtectedRoute>
              <SupportLayout>
                <ManageTeamPage />
              </SupportLayout>
            </ProtectedRoute>
          } />

          {/* Fallback 404 */}
          <Route path="*" element={<div className="h-screen flex items-center justify-center text-slate-500 bg-slate-950">404 - Page Non Trouvée</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
