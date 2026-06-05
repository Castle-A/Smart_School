import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/contexts/AuthContext';
import { authService } from '../../shared/api/auth.service';
import { Lock, Mail, GraduationCap, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.login({ identifier: email, password });

            // Master Security: Transformer les données du backend vers le format User
            const userData = {
                id: response.user.userId,
                email: response.user.email,
                firstName: response.user.firstName,
                lastName: response.user.lastName,
                role: (response.user.schoolRole || response.user.role) as any,
                schoolRole: response.user.schoolRole,
                platformRole: response.user.platformRole,
                schoolId: response.user.schoolId,
                schoolName: response.user.schoolName,
                gender: response.user.gender,
                mustChangePassword: response.user.mustChangePassword,
                directorType: response.user.directorType,
                phone: response.user.phone,
                permissions: response.user.permissions,
            };

            // Le backend a déjà défini le cookie HttpOnly
            await login(userData);

            // IMPORTANT: Petit délai pour laisser le navigateur traiter le cookie
            // Évite la race condition où les requêtes dashboard sont faites avant que le cookie soit prêt
            await new Promise(resolve => setTimeout(resolve, 100));

            if (response.mustChangePassword) {
                navigate('/change-password');
            } else {
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Identifiants invalides');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo & Titre */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl mb-4">
                        <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">SmartSchool</h1>
                    <p className="text-white/70">Gestion scolaire intelligente</p>
                </div>

                {/* Formulaire */}
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
                    <h2 className="text-2xl font-bold text-white mb-6">Connexion</h2>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-xl mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-white/90 mb-2 text-sm font-medium">Email ou numéro de téléphone</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-10 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                                    placeholder="Email ou numéro de téléphone"
                                    required
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-white/90 mb-2 text-sm font-medium">Mot de passe</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-10 pr-12 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                                    placeholder="••••••••"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-purple-900 font-semibold py-3 rounded-xl hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-white/70">
                            Pas encore de compte ?{' '}
                            <a href="/register" className="text-white font-semibold hover:underline">
                                Créer mon école
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
