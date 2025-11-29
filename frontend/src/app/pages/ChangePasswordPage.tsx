import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../shared/api/api';
import { Lock, GraduationCap, Eye, EyeOff } from 'lucide-react';

export default function ChangePasswordPage() {
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        if (formData.newPassword.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères');
            return;
        }

        setLoading(true);

        try {
            await api.post('/auth/change-password', {
                newPassword: formData.newPassword,
            });

            navigate('/app/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors du changement de mot de passe');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl mb-4">
                        <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">SmartSchool</h1>
                    <p className="text-white/70">Créez votre nouveau mot de passe</p>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
                    <div className="bg-amber-500/20 border border-amber-500/50 text-white px-4 py-3 rounded-xl mb-6 flex items-start gap-3">
                        <Lock className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-semibold mb-1">Première connexion</p>
                            <p className="text-sm text-white/90">
                                Pour des raisons de sécurité, vous devez créer un nouveau mot de passe.
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-xl mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-white/90 mb-2 text-sm font-medium">
                                Nouveau mot de passe
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-10 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                                    placeholder="Minimum 8 caractères"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-white/90 mb-2 text-sm font-medium">
                                Confirmer le mot de passe
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-10 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                                    placeholder="Confirmer le mot de passe"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="bg-blue-500/20 border border-blue-500/50 text-white px-4 py-3 rounded-xl text-sm">
                            💡 Votre mot de passe doit contenir au moins 8 caractères
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-purple-900 font-semibold py-3 rounded-xl hover:bg-white/90 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Changement...' : 'Créer mon mot de passe'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
