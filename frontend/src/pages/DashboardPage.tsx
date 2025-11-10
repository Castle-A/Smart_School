import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import { motion, AnimatePresence } from 'framer-motion';

// Import des dashboards par rôle
import AdminDashboard from './dashboad/AdminDashboard';
import FounderDashboard from './dashboad/FounderDashboard';
import DirectorDashboard from './dashboad/DirectorDashboard';
import HeadTeacherDashboard from './dashboad/HeadTeacherDashboard';
import TeacherDashboard from './dashboad/TeacherDashboard';
import StudentDashboard from './dashboad/StudentDashboard';
import ParentDashboard from './dashboad/ParentDashboard';
import SecretaryDashboard from './dashboad/SecretaryDashboard';

const DashboardPage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showWelcome, setShowWelcome] = useState(false);
  if (!isAuthenticated || !user) return <div>Redirection en cours...</div>;
  const handleLogout = () => { logout(); navigate('/login'); };

  const renderRoleDashboard = () => {
    // Chaque dashboard reçoit l'utilisateur afin d'utiliser user.schoolId pour les requêtes multi-tenant
    switch (user.role) {
      case 'SUPER_ADMIN':
        return <AdminDashboard />;
      case 'DIRECTEUR':
        return <DirectorDashboard user={user} />;
      case 'FONDATEUR':
        return <FounderDashboard user={user} />;
      case 'ENSEIGNANT':
        return <TeacherDashboard user={user} />;
      case 'CHEF_DECLASSE':
        return <HeadTeacherDashboard user={user} />;
      case 'ELEVE':
        return <StudentDashboard user={user} />;
      case 'PARENT':
        return <ParentDashboard user={user} />;
      case 'SECRETAIRE':
        return <SecretaryDashboard user={user} />;
      default:
        return (
          <div className="p-6 bg-white rounded shadow">
            <h3 className="text-lg font-semibold">Tableau de bord</h3>
            <p>Rôle non reconnu : {user.role}</p>
          </div>
        );
    }
  };

  const getSalutation = () => {
    const gender = user.gender as unknown as string | undefined;
    if (!user || !user.firstName) return 'Bonjour';
    if (gender === 'MALE') return `M. ${user.firstName}`;
    if (gender === 'FEMALE') return `Mme ${user.firstName}`;
    if (gender === 'OTHER') return `Mx ${user.firstName}`;
    return `Bonjour ${user.firstName}`;
  };

  useEffect(() => {
    // show welcome if navigated from registration
    const s = (location.state as any)?.welcome;
    if (s === 'account_created') {
      setShowWelcome(true);
      // dismiss after 4s
      const t = setTimeout(() => setShowWelcome(false), 4000);
      return () => clearTimeout(t);
    }
  }, [location.state]);

  return (
    <div className="p-6">
      <Toast message={`Bienvenue ${user?.firstName || ''} ! Votre compte a été créé.`} type="success" visible={showWelcome} onClose={() => setShowWelcome(false)} />
      {/* small welcome panel that animates in (framer-motion) */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="mb-6"
          >
            <div className="p-4 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold">Bienvenue {user?.firstName} 🎉</h2>
              <p className="text-sm opacity-90">Votre tableau de bord est prêt.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>
      </div>

      <div className="mt-4 p-6 bg-white rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <img
            src={user.avatarUrl || '/default-avatar.svg'}
            alt="Avatar"
            className="w-12 h-12 rounded-full"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const t = e.currentTarget as HTMLImageElement;
              t.onerror = null;
              if (t.src && !t.src.includes('/default-avatar.svg')) {
                t.src = '/default-avatar.svg';
              }
            }}
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-700">{getSalutation()} {!['MALE','FEMALE','OTHER'].includes(user.gender || '') ? '!' : ''}</h2>
            <p className="text-gray-600">Connecté en tant que <span className="font-medium">{user.role}</span> de <span className="font-bold text-blue-600">{user.schoolName}</span></p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        {renderRoleDashboard()}
      </div>
    </div>
  );
};
export default DashboardPage;