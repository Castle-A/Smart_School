import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import React from 'react';

type Props = {
  children: React.ReactNode;
  // Si fourni, n'autorise que les rôles listés (ex: ['ENSEIGNANT','DIRECTEUR'])
  allowedRoles?: string[];
  // Si true, vérifie que l'utilisateur possède un `schoolId` (multi-tenant safety)
  requireSchool?: boolean;
};

const ProtectedRoute = ({ children, allowedRoles, requireSchool = false }: Props) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Vérification de la session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Vérification multi-tenant : si la route exige une école et que l'utilisateur
  // n'en a pas, on le redirige vers la landing
  if (requireSchool && !user?.schoolId) {
    return <Navigate to="/home" replace />;
  }

  // Vérification des rôles si fournis
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <div className="p-6">Accès refusé — rôle insuffisant.</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;