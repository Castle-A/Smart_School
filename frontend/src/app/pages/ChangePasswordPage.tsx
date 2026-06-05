import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../shared/api/api';
import { Lock, GraduationCap, Eye, EyeOff } from 'lucide-react';
import PasswordValidationPopup from '../../shared/components/PasswordValidationPopup';

export default function ChangePasswordPage() {
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showPasswordPopup, setShowPasswordPopup] = useState(false);
    const navigate = useNavigate();

    const getPasswordStrength = (password: string) => {
        if (!password) return 0;

        const hasLength = password.length >= 8;
        const hasUpper = /[A-Z]/.test(password);
        const hasDigit = /\d/.test(password);

        if (hasLength && hasUpper && hasDigit) return 2; // Fort
        if (password.length >= 6) return 1; // Moyen
        return 0; // Faible
    };

    const passwordStrength = getPasswordStrength(formData.newPassword);
    const strengthLabels = ['Faible', 'Moyen', 'Fort'];
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-green-500'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        // Validation stricte du mot de passe
        if (formData.newPassword.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères');
            return;
        }
        if (!/[A-Z]/.test(formData.newPassword)) {
            setError('Le mot de passe doit contenir au moins une lettre majuscule');
            return;
        }
        if (!/[a-z]/.test(formData.newPassword)) {
            setError('Le mot de passe doit contenir au moins une lettre minuscule');
            return;
        }
        if (!/\d/.test(formData.newPassword)) {
            setError('Le mot de passe doit contenir au moins un chiffre');
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
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] flex items-center justify-center p-4">
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
                                    onFocus={() => setShowPasswordPopup(true)}
                                    onBlur={() => setTimeout(() => setShowPasswordPopup(false), 200)}
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
                                <PasswordValidationPopup password={formData.newPassword} show={showPasswordPopup} />
                            </div>
                            {formData.newPassword && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1">
                                        {[0, 1, 2].map((i) => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 rounded-full transition-all ${i <= passwordStrength ? strengthColors[passwordStrength] : 'bg-white/20'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className={`text-xs ${passwordStrength === 2 ? 'text-green-300' : passwordStrength === 1 ? 'text-orange-300' : 'text-red-300'}`}>
                                        {strengthLabels[passwordStrength]}
                                    </p>
                                </div>
                            )}
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
