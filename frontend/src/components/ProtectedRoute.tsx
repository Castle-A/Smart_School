import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import React from 'react';

// MODIFICATION : Le type des enfants est plus flexible avec React.ReactNode
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // MODIFICATION : On récupère `isLoading` depuis le contexte
  const { isAuthenticated, isLoading } = useAuth();

  // MODIFICATION : Si on est en train de charger, on affiche un indicateur
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Vérification de la session...
      </div>
    );
  }

  // Si le chargement est fini et que l'utilisateur n'est pas authentifié, on redirige
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Sinon, on affiche le contenu protégé
  return <>{children}</>;
};

export default ProtectedRoute;