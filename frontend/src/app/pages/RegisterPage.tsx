import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../shared/api/auth.service';
import { Lock, Mail, User, GraduationCap, Phone, MapPin, Building2, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        // School Information
        schoolName: '',
        schoolAddress: '',
        schoolPhone: '',
        schoolEmail: '',
        schoolCycles: [] as string[],

        // Personal Information
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        gender: '',
        phone: '',
        isFounder: false,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const availableCycles = [
        'Maternelle I',
        'Maternelle II',
        'Primaire',
        'Premier Cycle',
        'Second Cycle',
    ];

    const handleCycleToggle = (cycle: string) => {
        setFormData(prev => ({
            ...prev,
            schoolCycles: prev.schoolCycles.includes(cycle)
                ? prev.schoolCycles.filter(c => c !== cycle)
                : [...prev.schoolCycles, cycle]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        if (formData.schoolCycles.length === 0) {
            setError('Veuillez sélectionner au moins un cycle');
            return;
        }

        if (!formData.isFounder) {
            setError('Veuillez confirmer que vous êtes le fondateur de cette école');
            return;
        }

        if (!formData.gender) {
            setError('Veuillez sélectionner votre sexe');
            return;
        }

        setLoading(true);

        try {
            await authService.registerFounder({
                // School info
                schoolName: formData.schoolName,
                schoolAddress: formData.schoolAddress,
                schoolPhone: formData.schoolPhone,
                schoolEmail: formData.schoolEmail,
                schoolCycles: formData.schoolCycles,

                // Personal info
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                gender: formData.gender,
                phone: formData.phone,
            });

            navigate('/subscription', { state: { message: 'Inscription réussie ! Choisissez votre abonnement.' } });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl mb-4">
                        <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">Créer votre école</h1>
                    <p className="text-white/70">Rejoignez SmartSchool en quelques clics</p>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-xl mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* School Information Section */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                                <Building2 className="w-5 h-5" />
                                Informations de l'école
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-white/90 mb-2 text-sm font-medium">Nom de l'école *</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                        <input
                                            type="text"
                                            value={formData.schoolName}
                                            onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                                            className="w-full bg-white/10 border border-white/20 rounded-xl px-10 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                                            placeholder="École Primaire Exemple"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-white/90 mb-2 text-sm font-medium">Adresse ou Ville</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                        <input
                                            type="text"
                                            value={formData.schoolAddress}
                                            onChange={(e) => setFormData({ ...formData, schoolAddress: e.target.value })}
                                            className="w-full bg-white/10 border border-white/20 rounded-xl px-10 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                                            placeholder="Paris, France"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-white/90 mb-2 text-sm font-medium">Téléphone de l'école</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                        <input
                                            type="tel"
                                            value={formData.schoolPhone}
                                            onChange={(e) => setFormData({ ...formData, schoolPhone: e.target.value })}
                                            className="w-full bg-white/10 border border-white/20 rounded-xl px-10 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                                            placeholder="+33 1 23 45 67 89"
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-white/90 mb-2 text-sm font-medium">Email de l'école</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                        <input
                                            type="email"
                                            value={formData.schoolEmail}
                                            onChange={(e) => setFormData({ ...formData, schoolEmail: e.target.value })}
                                            className="w-full bg-white/10 border border-white/20 rounded-xl px-10 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                                            placeholder="contact@ecole.fr"
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-white/90 mb-3 text-sm font-medium">Cycles de l'école *</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {availableCycles.map((cycle) => (
                                            <label
                                                key={cycle}
                                                className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.schoolCycles.includes(cycle)
                                                    ? 'bg-white/20 border-white/50'
                                                    : 'bg-white/5 border-white/20 hover:bg-white/10'
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.schoolCycles.includes(cycle)}
                                                    onChange={() => handleCycleToggle(cycle)}
                                                    className="w-4 h-4 rounded accent-purple-500"
                                                />
                                                <span className="text-white text-sm">{cycle}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Personal Information Section */}
                        <div className="space-y-4 pt-4 border-t border-white/20">
                            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Informations personnelles
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-white/90 mb-2 text-sm font-medium">Prénom *</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="w-full bg-white/10 border border-white/20 rounded-xl px-10 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                                            placeholder="Jean"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-white/90 mb-2 text-sm font-medium">Nom *</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="w-full bg-white/10 border border-white/20 rounded-xl px-10 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                                            placeholder="Dupont"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-white/90 mb-3 text-sm font-medium">Sexe *</label>
                                    <div className="flex gap-4">
                                        <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.gender === 'HOMME'
                                            ? 'bg-white/20 border-white/50'
                                            : 'bg-white/5 border-white/20 hover:bg-white/10'
                                            }`}>
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="HOMME"
                                                checked={formData.gender === 'HOMME'}
                                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                                className="w-4 h-4 accent-purple-500"
                                            />
                                            <span className="text-white">Homme</span>
                                        </label>
                                        <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.gender === 'FEMME'
                                            ? 'bg-white/20 border-white/50'
                                            : 'bg-white/5 border-white/20 hover:bg-white/10'
                                            }`}>
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="FEMME"
                                                checked={formData.gender === 'FEMME'}
                                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                                className="w-4 h-4 accent-purple-500"
                                            />
                                            <span className="text-white">Femme</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-white/90 mb-2 text-sm font-medium">Téléphone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-white/10 border border-white/20 rounded-xl px-10 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                                            placeholder="+33 6 12 34 56 78"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-white/90 mb-2 text-sm font-medium">Email *</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-white/10 border border-white/20 rounded-xl px-10 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                                            placeholder="votre@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-white/90 mb-2 text-sm font-medium">Mot de passe *</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full bg-white/10 border border-white/20 rounded-xl px-10 pr-12 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                                            placeholder="••••••••"
                                            required
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

                                <div>
                                    <label className="block text-white/90 mb-2 text-sm font-medium">Confirmer le mot de passe *</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="w-full bg-white/10 border border-white/20 rounded-xl px-10 pr-12 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/20 cursor-pointer hover:bg-white/10 transition-all">
                                        <input
                                            type="checkbox"
                                            checked={formData.isFounder}
                                            onChange={(e) => setFormData({ ...formData, isFounder: e.target.checked })}
                                            className="w-5 h-5 rounded accent-purple-500"
                                        />
                                        <span className="text-white font-medium">Je confirme être le fondateur de cette école</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-purple-900 font-semibold py-3 rounded-xl hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Inscription...' : 'Créer mon compte'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-white/70">
                            Déjà inscrit ?{' '}
                            <a href="/login" className="text-white font-semibold hover:underline">
                                Se connecter
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
