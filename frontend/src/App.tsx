import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from '@shared/contexts/AuthContext';
import ProtectedRoute from '@shared/components/ProtectedRoute';
import RequirePlatformRole from '@shared/components/RequirePlatformRole';
import RequireSchoolAuth from '@shared/components/RequireSchoolAuth';
import LandingPage from '@app/pages/LandingPage';
import LoginPage from '@app/pages/LoginPage';
import RegisterPage from '@app/pages/RegisterPage';
import SubscriptionPage from '@app/pages/SubscriptionPage';
import ChangePasswordPage from '@app/pages/ChangePasswordPage';
import SettingsPage from '@app/pages/SettingsPage';
import CreateMemberPage from '@app/pages/CreateMemberPage';
import DashboardWrapper from '@shared/components/DashboardWrapper';
import FounderDashboard from '@app/pages/dashboard/FounderDashboard';
import DirectorDashboard from '@app/pages/dashboard/DirectorDashboard';
import AccountantDashboard from '@app/pages/dashboard/AccountantDashboard';
import TeacherDashboard from '@app/pages/dashboard/TeacherDashboard';
import SupportLayout from '@support/layouts/SupportLayout';
import SchoolListPage from '@support/pages/SchoolListPage';
import SchoolDetailsPage from '@support/pages/SchoolDetailsPage';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />

          {/* App Routes (School) */}
          <Route path="/app" element={
            <RequireSchoolAuth>
              <Outlet />
            </RequireSchoolAuth>
          }>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="create-member" element={<CreateMemberPage />} />
            <Route path="dashboard" element={<DashboardWrapper />}>
              <Route index element={<FounderDashboard />} />
              <Route path="founder" element={<FounderDashboard />} />
              <Route path="director" element={<DirectorDashboard />} />
              <Route path="accountant" element={<AccountantDashboard />} />
              <Route path="teacher" element={<TeacherDashboard />} />
            </Route>
          </Route>

          {/* Support Routes (Platform) */}
          <Route path="/support" element={
            <RequirePlatformRole>
              <SupportLayout />
            </RequirePlatformRole>
          }>
            <Route index element={<SchoolListPage />} />
            <Route path="schools/:id" element={<SchoolDetailsPage />} />
          </Route>

          {/* Legacy dashboard redirect */}
          <Route path="/dashboard/*" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
