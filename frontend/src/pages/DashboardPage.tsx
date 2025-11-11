import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Toast from '../components/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import type { User } from '@/types';

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
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [showWelcome, setShowWelcome] = useState(false);
  
  const nonNullUser = user as NonNullable<typeof user>;

  const renderRoleDashboard = (u: NonNullable<typeof user>) => {
    // Chaque dashboard reçoit l'utilisateur afin d'utiliser user.schoolId pour les requêtes multi-tenant
    switch (u.role) {
      case 'SUPER_ADMIN':
        return <AdminDashboard />;
      case 'DIRECTEUR':
        return <DirectorDashboard user={u as unknown as User} />;
      case 'FONDATEUR':
        return <FounderDashboard user={u as unknown as User} />;
      case 'ENSEIGNANT':
        return <TeacherDashboard user={u as unknown as User} />;
      case 'CHEF_DECLASSE':
        return <HeadTeacherDashboard user={u as unknown as User} />;
      case 'ELEVE':
        return <StudentDashboard user={u as unknown as User} />;
      case 'PARENT':
        return <ParentDashboard user={u as unknown as User} />;
      case 'SECRETAIRE':
        return <SecretaryDashboard user={u as unknown as User} />;
      default:
        return (
          <div className="p-6 bg-white rounded shadow">
            <h3 className="text-lg font-semibold">Tableau de bord</h3>
            <p>Rôle non reconnu : {u.role}</p>
          </div>
        );
    }
  };

  const getSalutation = () => {
    const gender = (nonNullUser.gender as unknown as string | undefined) || '';
    if (!nonNullUser || !nonNullUser.firstName) return 'Bonjour';
    const name = `${nonNullUser.firstName}${nonNullUser.lastName ? ' ' + nonNullUser.lastName : ''}`.trim();
    if (gender === 'MALE') return `M. ${name}`;
    if (gender === 'FEMALE') return `Mme ${name}`;
    if (gender === 'OTHER') return `Mx ${name}`;
    return `Bonjour ${name}`;
  };

  // === Helpers d'affichage demandés ===
  const isStudent = nonNullUser.role === 'ELEVE';

  const roleLabel = (r: string) => {
    switch (r) {
      case 'ELEVE':
        return 'Élève';
      case 'DIRECTEUR':
        return 'Directeur';
      case 'FONDATEUR':
        return 'Fondateur';
      case 'ENSEIGNANT':
        return 'Enseignant';
      case 'CHEF_DECLASSE':
        return 'Chef de classe';
      case 'PARENT':
        return 'Parent';
      case 'SECRETAIRE':
        return 'Secrétaire';
      case 'SUPER_ADMIN':
        return 'Super administrateur';
      default:
        return r;
    }
  };

  const genderLabel = (g?: string) => {
    if (g === 'MALE') return 'Homme';
    if (g === 'FEMALE') return 'Femme';
    if (g === 'OTHER') return 'Autre';
    return 'Non renseigné';
  };

  const v = (x?: string | null) => (x && String(x).trim().length ? String(x) : '—');

  useEffect(() => {
    // Affiche la bannière de bienvenue si on arrive de la création de compte
    const s = (location.state as unknown as { welcome?: string })?.welcome;
    if (s === 'account_created') {
      setShowWelcome(true);
      const t = setTimeout(() => setShowWelcome(false), 4000);
      return () => clearTimeout(t);
    }
  }, [location.state]);
  // Profile enrichment is handled centrally in AuthProvider; no-op here.

  if (!isAuthenticated || !user) return <div>Redirection en cours...</div>;

  return (
    <div className="p-6">
  {/* Content (container wrapper moved to layout) */}
  <div>
        <Toast
          message={`Bienvenue ${user?.firstName || ''} ! Votre compte a été créé.`}
          type="success"
          visible={showWelcome}
          onClose={() => setShowWelcome(false)}
        />

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
              <div className="p-4 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold">Bienvenue {user?.firstName} 🎉</h2>
                <p className="text-sm opacity-90">Votre tableau de bord est prêt.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>
        </div>

  {/* === Bloc d'informations utilisateur (sans avatar) === */}
  <div className="mt-4 p-3 bg-white rounded-lg shadow-sm w-full">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">👤 Vos informations personnelles</h2>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {getSalutation()} {!['MALE', 'FEMALE', 'OTHER'].includes(user.gender || '') ? '!' : ''}
            </h2>
            <p className="text-sm text-gray-500">
              {/* Affiche la phrase demandée en respectant le genre si disponible */}
              {`Vous êtes ${user.gender === 'FEMALE' ? 'connectée' : 'connecté'} en tant que `}
              <span className="font-medium">{roleLabel(user.role)}</span>
              {` de `}
              <span className="font-medium text-blue-700">{v(user.schoolName)}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Prénom */}
            <div className="p-2 rounded-lg bg-white border border-gray-100">
              <div className="text-xs uppercase tracking-wide text-gray-400">Prénom</div>
              <div className="mt-1 text-gray-800 font-medium">{v(user.firstName)}</div>
            </div>

            {/* Nom de famille */}
            <div className="p-2 rounded-lg bg-white border border-gray-100">
              <div className="text-xs uppercase tracking-wide text-gray-400">Nom</div>
              <div className="mt-1 text-gray-800 font-medium">{v((user as unknown as { lastName?: string }).lastName ?? '')}</div>
            </div>

            {/* Sexe */}
            <div className="p-2 rounded-lg bg-white border border-gray-100">
              <div className="text-xs uppercase tracking-wide text-gray-400">Sexe</div>
              <div className="mt-1 text-gray-800 font-medium">{genderLabel(user.gender)}</div>
            </div>

            {/* Téléphone (ou Matricule pour Élève) */}
            <div className="p-2 rounded-lg bg-white border border-gray-100">
              <div className="text-xs uppercase tracking-wide text-gray-400">
                {isStudent ? 'Matricule' : 'Téléphone'}
              </div>
              <div className="mt-1 text-gray-800 font-medium">
                {isStudent ? v((user as unknown as { matricule?: string }).matricule) : (user.phoneNumber ? (
                  <a href={`tel:${user.phoneNumber}`} className="text-gray-800">{user.phoneNumber}</a>
                ) : '—')}
              </div>
            </div>

            {/* Email (pas pour Élève) */}
            {!isStudent && (
              <div className="p-2 rounded-lg bg-white border border-gray-100">
                <div className="text-xs uppercase tracking-wide text-gray-400">Email</div>
                <div className="mt-1 text-gray-800 font-medium break-all">{v(user.email)}</div>
              </div>
            )}

            {/* Profil (rôle en clair, sans "Rôle:") */}
            <div className="p-2 rounded-lg bg-white border border-gray-100">
              <div className="text-xs uppercase tracking-wide text-gray-400">Profil</div>
              <div className="mt-1 text-gray-800 font-semibold">{roleLabel(user.role)}</div>
            </div>
          </div>
        </div>

  <div className="mt-6">{renderRoleDashboard(user as NonNullable<typeof user>)}</div>
      </div>
    </div>
  );
};

export default DashboardPage;