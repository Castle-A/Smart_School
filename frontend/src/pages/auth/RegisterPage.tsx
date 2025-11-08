import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    schoolName: '',
    schoolAddress: '', // <-- AJOUTÉ
    schoolPhone: '',   // <-- AJOUTÉ
    email: '',
    password: '',
    confirmPassword: '',
    role: 'FONDATEUR',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.registerSchool({
        schoolName: formData.schoolName,
        schoolAddress: formData.schoolAddress, // <-- ENVOYÉ
        schoolPhone: formData.schoolPhone,     // <-- ENVOYÉ
        email: formData.email,
        password: formData.password,
        role: formData.role as 'FONDATEUR' | 'DIRECTEUR',
      });

      navigate('/login', {
        state: { message: 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.' },
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg w-full max-w-md">
        <h3 className="text-2xl font-bold text-center text-gray-800">Créer un compte</h3>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
          
          {/* Section Établissement */}
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">Informations sur l'établissement</h4>
            <input
              type="text"
              name="schoolName"
              placeholder="Nom de l'établissement"
              value={formData.schoolName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            <input
              type="text"
              name="schoolAddress"
              placeholder="Adresse de l'établissement"
              value={formData.schoolAddress}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            <input
              type="tel"
              name="schoolPhone"
              placeholder="Numéro de téléphone"
              value={formData.schoolPhone}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          {/* Section Administrateur */}
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-2 mt-4">Votre compte</h4>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="FONDATEUR">Fondateur</option>
              <option value="DIRECTEUR">Directeur</option>
            </select>
            <input
              type="email"
              name="email"
              placeholder="Votre email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Votre mot de passe"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 mt-6 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Création...' : 'Créer le compte'}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Vous avez déjà un compte ?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;