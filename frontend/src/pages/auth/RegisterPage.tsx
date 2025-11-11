import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { useAuth } from '@/context';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    schoolName: '',
    schoolAddress: '',
    schoolPhone: '',
    schoolEmail: '',
    schoolCycles: [] as string[],
    firstName: '',
    lastName: '',
    gender: 'MALE',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'FONDATEUR',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // ⬅️ Récupère setSessionFromToken + setJustLoggedIn pour le toast
  const { setSessionFromToken, setJustLoggedIn } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleCycle = (cycle: string) => {
    setFormData((prev) => {
      const exists = prev.schoolCycles.includes(cycle);
      return {
        ...prev,
        schoolCycles: exists ? prev.schoolCycles.filter((c) => c !== cycle) : [...prev.schoolCycles, cycle],
      };
    });
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
      const result = await authService.registerSchool({
        schoolName: formData.schoolName,
        schoolAddress: formData.schoolAddress,
        schoolPhone: formData.schoolPhone,
        schoolEmail: formData.schoolEmail,
        schoolCycles: formData.schoolCycles,
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender as 'MALE' | 'FEMALE' | 'OTHER',
        email: formData.email,
        password: formData.password,
        role: formData.role as 'FONDATEUR' | 'DIRECTEUR',
      });

      const _res = result as unknown as Record<string, unknown> | null;
      const token = typeof _res?.['access_token'] === 'string' ? String(_res['access_token']) : undefined;

      if (token) {
        // ✅ Initialise la session immédiatement
        setSessionFromToken(token);

        // ✅ Flag “just logged in” pour le toast sur la Home
        try {
          setJustLoggedIn(true);
          sessionStorage.setItem('justLoggedIn', '1');
        } catch { void 0; }

        // ✅ Redirige vers la Home
        navigate('/', { replace: true });
      } else {
        // Pas de login auto : on redirige vers /login (le toast viendra après login)
        navigate('/login', {
          state: { message: 'Compte créé avec succès ! Veuillez vous connecter.' },
        });
      }
    } catch (err: unknown) {
      let message = 'Une erreur est survenue lors de l\'inscription.';
      if (typeof err === 'object' && err !== null) {
        const maybeResp = (err as { response?: { data?: { message?: unknown } } }).response;
        if (maybeResp && maybeResp.data && typeof maybeResp.data.message === 'string') {
          message = maybeResp.data.message;
        }
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg w-full max-w-lg">
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
            <input
              type="email"
              name="schoolEmail"
              placeholder="Email de l'établissement"
              value={formData.schoolEmail}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />

            {/* Cycle d'étude */}
            <div className="mt-3">
              <p className="mb-2 text-sm font-medium text-gray-600">Cycle d'étude de l'école</p>
              <div className="flex gap-2 flex-wrap">
                {['Primaire', 'Premier cycle', 'Second cycle'].map((cycle) => {
                  const selected = formData.schoolCycles.includes(cycle);
                  return (
                    <button
                      key={cycle}
                      type="button"
                      onClick={() => toggleCycle(cycle)}
                      className={`px-3 py-1.5 rounded-full border transition transform duration-150 ease-out flex items-center gap-2 ${selected ? 'bg-indigo-600 text-white border-indigo-600 scale-105 shadow-md' : 'bg-white text-gray-700 hover:scale-105'}`}
                      aria-pressed={selected}
                    >
                      <span className={`inline-block w-3 h-3 rounded-full ${selected ? 'bg-white' : 'bg-gray-200'}`} />
                      <span className="text-sm">{cycle}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                {formData.schoolCycles.map((c) => (
                  <span key={c} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm transition-opacity duration-200">
                    {c}
                    <button type="button" onClick={() => toggleCycle(c)} aria-label={`Retirer ${c}`} className="ml-1 text-indigo-600 font-bold">×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section Administrateur */}
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-2 mt-4">Vos informations</h4>
            <input
              type="text"
              name="firstName"
              placeholder="Votre prénom"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Votre nom de famille"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="FONDATEUR">Fondateur</option>
              <option value="DIRECTEUR">Directeur</option>
            </select>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="MALE">Homme</option>
              <option value="FEMALE">Femme</option>
              <option value="OTHER">Autre</option>
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
