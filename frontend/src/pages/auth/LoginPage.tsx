import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { LoginRequest } from '../../services/authService';
import { useAuth } from '../../context';
import PasswordField from '../../components/PasswordField';

// Schéma de validation avec Yup
const loginSchema = yup.object().shape({
  email: yup.string().email('Format de l\'email invalide').required('L\'email est requis'),
  password: yup.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères').required('Le mot de passe est requis'),
});

const LoginPage = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>({
    resolver: yupResolver(loginSchema),
  });

  // ⬅️ On récupère aussi setJustLoggedIn pour le toast de bienvenue
  const { login, mustChangePassword, setJustLoggedIn } = useAuth();

  const onSubmit = async (data: LoginRequest) => {
    console.log('!!! ÉTAPE 1: onSubmit appelé avec les données:', data);

    try {
      const res = await login(data.email, data.password);
      console.log('!!! ÉTAPE 2: AuthContext login réussi', res);

      if (res?.mustChangePassword || mustChangePassword) {
        navigate('/change-password');
        return;
      }

      // ✅ Flag “just logged in” pour la Home (toast de bienvenue)
      try {
        setJustLoggedIn(true);
        sessionStorage.setItem('justLoggedIn', '1');
      } catch { void 0; }

      // ✅ Redirection vers la Home
      navigate('/', { replace: true });

    } catch (error: unknown) {
      console.error('!!! ÉTAPE 3: Erreur capturée:', error);
      let message = 'Erreur inconnue';
      if (error instanceof Error) message = error.message;
      else if (typeof error === 'object' && error !== null) {
        const e = error as unknown as Record<string, unknown> | null;
        if (e && typeof e['response'] === 'object' && e['response'] !== null) {
          const resp = e['response'] as Record<string, unknown> | null;
          const data = resp?.['data'] as Record<string, unknown> | undefined;
          if (data && typeof data?.['message'] === 'string') message = String(data['message']);
          else if (typeof e['message'] === 'string') message = String(e['message']);
          else message = String(e);
        } else {
          message = String(e);
        }
      }
      alert('Erreur de connexion : ' + message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Connexion à votre compte</h2>
          <p className="mt-2 text-sm text-gray-600">
            Ou{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              créez un nouveau compte
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse email</label>
              <input id="email" type="email" autoComplete="email" {...register('email')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="vous@exemple.com" />
              {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
              {/* PasswordField supports spreading register(...) or controlled props */}
              <PasswordField id="password" autoComplete="current-password" {...register('password')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="•••••••" />
              {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
            </div>
          </div>
          <div>
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
