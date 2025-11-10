import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import LandingNews from '../components/LandingNews';

// Importez tous vos tableaux de bord ici
import AdminDashboard from './dashboad/AdminDashboard';
import FounderDashboard from './dashboad/FounderDashboard';
import DirectorDashboard from './dashboad/DirectorDashboard';
// HeadTeacherDashboard removed from imports — not used on the landing
import TeacherDashboard from './dashboad/TeacherDashboard';
// SecretaryProfile import removed — not used on the landing
import StudentDashboard from './dashboad/StudentDashboard';
import ParentDashboard from './dashboad/ParentDashboard';

const HomePage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-2xl font-bold text-gray-600">Chargement...</div>
      </div>
    );
  }

  // Landing (utilisateur non connecté)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <header className="py-16">
          <div className="container mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                Smart School — Simplifiez la gestion scolaire
              </h1>
              <p className="text-gray-700 mb-6 text-lg">
                Unifier les présences, notes, communications et plannings dans une interface simple et sécurisée.
                Pour les écoles, enseignants, parents et élèves.
              </p>

              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <span className="bg-indigo-600 text-white rounded-full w-9 h-9 flex items-center justify-center">✓</span>
                  <span className="text-gray-700">Tableaux de bord adaptés aux rôles</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-indigo-600 text-white rounded-full w-9 h-9 flex items-center justify-center">✓</span>
                  <span className="text-gray-700">Communication instantanée et gestion des tâches</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-indigo-600 text-white rounded-full w-9 h-9 flex items-center justify-center">✓</span>
                  <span className="text-gray-700">Sécurité et permissions granulaires</span>
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="inline-flex items-center justify-center py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition">
                  Créer un compte
                </Link>
                <Link to="/login" className="inline-flex items-center justify-center py-3 px-6 bg-white text-indigo-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition">
                  Se connecter
                </Link>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="rounded-2xl shadow-xl overflow-hidden bg-gradient-to-br from-white to-indigo-50 p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Flux d'actualités</h3>
                <LandingNews />
              </div>
            </div>
          </div>
        </header>

        <section className="py-12">
          <div className="container mx-auto px-6 lg:px-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-xl shadow">
                <h4 className="font-semibold text-lg mb-2">Gagnez du temps</h4>
                <p className="text-sm text-gray-600">Automatisez les tâches récurrentes et concentrez-vous sur l’enseignement.</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow">
                <h4 className="font-semibold text-lg mb-2">Communication fluide</h4>
                <p className="text-sm text-gray-600">Messagerie, notifications et partages de documents en quelques clics.</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow">
                <h4 className="font-semibold text-lg mb-2">Sécurité & confidentialité</h4>
                <p className="text-sm text-gray-600">Contrôlez qui voit quoi grâce à des permissions claires.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Utilisateur connecté → on rend le bon dashboard
  const renderDashboard = () => {
    switch (user?.role) {
      case 'ELEVE':
        return <StudentDashboard user={user} />;
      case 'PARENT':
        return <ParentDashboard user={user} />;
      case 'ENSEIGNANT':
        return <TeacherDashboard user={user} />;
      case 'DIRECTEUR':
        return <DirectorDashboard user={user} />;
      case 'FONDATEUR':
        return <FounderDashboard user={user} />;
      case 'SUPER_ADMIN':
        return <AdminDashboard />;
      default:
        return (
          <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-red-600">Erreur</h1>
            <p>Rôle non reconnu : {user?.role}</p>
          </div>
        );
    }
  };

  return <div className="min-h-screen bg-gray-100">{renderDashboard()}</div>;
};

export default HomePage;
