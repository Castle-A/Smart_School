import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../shared/api/auth.service';
import { Lock, Mail, User, GraduationCap, MapPin, Building2, Eye, EyeOff, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import PhoneInput from '../../shared/components/PhoneInput';
import PasswordValidationPopup from '../../shared/components/PasswordValidationPopup';

export default function RegisterPage() {
    const [step, setStep] = useState(1); // 1 = Personal Info, 2 = School Info
    const [formData, setFormData] = useState({
        // Personal Information
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        gender: '',
        phone: '',
        isFounder: false,

        // School Information
        schoolName: '',
        schoolAddress: '',
        schoolPhone: '',
        schoolEmail: '',
        schoolCycles: [] as string[],
        termsAccepted: false,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showPasswordPopup, setShowPasswordPopup] = useState(false);
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

    const getPasswordStrength = (password: string) => {
        if (!password) return 0;

        const hasLength = password.length >= 8;
        const hasUpper = /[A-Z]/.test(password);
        const hasDigit = /\d/.test(password);

        if (hasLength && hasUpper && hasDigit) return 2; // Fort
        if (password.length >= 6) return 1; // Moyen
        return 0; // Faible
    };

    const passwordStrength = getPasswordStrength(formData.password);
    const strengthLabels = ['Faible', 'Moyen', 'Fort'];
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-green-500'];



    const validateStep1 = () => {
        if (!formData.firstName || !formData.lastName) {
            setError('Veuillez renseigner votre nom et prénom');
            return false;
        }
        if (!formData.email) {
            setError('Veuillez renseigner votre email');
            return false;
        }
        if (!formData.password || !formData.confirmPassword) {
            setError('Veuillez renseigner votre mot de passe');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return false;
        }
        // Validation stricte du mot de passe
        if (formData.password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères');
            return false;
        }
        if (!/[A-Z]/.test(formData.password)) {
            setError('Le mot de passe doit contenir au moins une lettre majuscule');
            return false;
        }
        if (!/[a-z]/.test(formData.password)) {
            setError('Le mot de passe doit contenir au moins une lettre minuscule');
            return false;
        }
        if (!/\d/.test(formData.password)) {
            setError('Le mot de passe doit contenir au moins un chiffre');
            return false;
        }
        if (!formData.gender) {
            setError('Veuillez sélectionner votre genre');
            return false;
        }
        if (!formData.isFounder) {
            setError('Veuillez confirmer que vous êtes le fondateur de cette école');
            return false;
        }
        return true;
    };

    const handleNextStep = () => {
        setError('');
        if (validateStep1()) {
            setStep(2);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.schoolCycles.length === 0) {
            setError('Veuillez sélectionner au moins un cycle');
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
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl mb-4">
                        <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">Créer votre école</h1>
                    <p className="text-white/70">Rejoignez SmartSchool en quelques clics</p>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center justify-center mb-8 gap-4">
                    <div className={`flex items-center gap-2 ${step === 1 ? 'text-white' : 'text-white/50'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 1 ? 'bg-white text-purple-900' : 'bg-white/20'}`}>
                            {step > 1 ? <Check size={16} /> : '1'}
                        </div>
                        <span className="font-medium hidden sm:inline">Informations personnelles</span>
                    </div>
                    <div className="w-12 h-0.5 bg-white/20"></div>
                    <div className={`flex items-center gap-2 ${step === 2 ? 'text-white' : 'text-white/50'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 2 ? 'bg-white text-purple-900' : 'bg-white/20'}`}>
                            2
                        </div>
                        <span className="font-medium hidden sm:inline">Informations de l'école</span>
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-xl mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* STEP 1: Personal Information */}
                        {step === 1 && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
                                    <User className="w-5 h-5" />
                                    Vos informations personnelles
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-white/90 mb-2 text-sm font-medium">Prénom <span className="text-red-500">*</span></label>
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
                                        <label className="block text-white/90 mb-2 text-sm font-medium">Nom <span className="text-red-500">*</span></label>
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
                                        <label className="block text-white/90 mb-3 text-sm font-medium">Genre <span className="text-red-500">*</span></label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { value: 'HOMME', label: 'Masculin' },
                                                { value: 'FEMME', label: 'Féminin' },
                                                { value: 'DIVERS', label: 'Divers' }
                                            ].map((option) => (
                                                <label
                                                    key={option.value}
                                                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.gender === option.value
                                                        ? 'bg-white/20 border-white/50'
                                                        : 'bg-white/5 border-white/20 hover:bg-white/10'
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        value={option.value}
                                                        checked={formData.gender === option.value}
                                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                                        className="w-4 h-4 accent-purple-500"
                                                    />
                                                    <span className="text-white">{option.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <PhoneInput
                                            onChange={(value) => setFormData({ ...formData, phone: value })}
                                            label="Téléphone"
                                            required={false}
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-white/90 mb-2 text-sm font-medium">Email <span className="text-red-500">*</span></label>
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
                                        <label className="block text-white/90 mb-2 text-sm font-medium">Mot de passe <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                onFocus={() => setShowPasswordPopup(true)}
                                                onBlur={() => setTimeout(() => setShowPasswordPopup(false), 200)}
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
                                            <PasswordValidationPopup password={formData.password} show={showPasswordPopup} />
                                        </div>
                                        {formData.password && (
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
                                        <label className="block text-white/90 mb-2 text-sm font-medium">Confirmer le mot de passe <span className="text-red-500">*</span></label>
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

                                <button
                                    type="button"
                                    onClick={handleNextStep}
                                    className="w-full bg-white text-purple-900 font-semibold py-3 rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2"
                                >
                                    Suivant
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        )}

                        {/* STEP 2: School Information */}
                        {step === 2 && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
                                    <Building2 className="w-5 h-5" />
                                    Informations de l'école
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="md:col-span-2">
                                        <label className="block text-white/90 mb-2 text-sm font-medium">Nom de l'école <span className="text-red-500">*</span></label>
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
                                        <label className="block text-white/90 mb-2 text-sm font-medium">Adresse ou Ville <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                            <input
                                                type="text"
                                                value={formData.schoolAddress}
                                                onChange={(e) => setFormData({ ...formData, schoolAddress: e.target.value })}
                                                className="w-full bg-white/10 border border-white/20 rounded-xl px-10 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                                                placeholder="Cotonou, Benin"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <PhoneInput
                                            className="w-full"
                                            onChange={(value) => setFormData({ ...formData, schoolPhone: value })}
                                            label="Téléphone de l'école"
                                            required={true}
                                        />
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
                                        <label className="block text-white/90 mb-3 text-sm font-medium">Cycles de l'école <span className="text-red-500">*</span></label>
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

                                {/* Terms Acceptance */}
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={formData.termsAccepted}
                                            onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                                            className="w-5 h-5 mt-0.5 rounded accent-purple-500"
                                            required
                                        />
                                        <span className="text-white/90 text-sm">
                                            J'ai lu et j'approuve les{' '}
                                            <a
                                                href="/terms"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-purple-400 hover:text-purple-300 underline font-medium"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Conditions Générales d'Utilisation
                                            </a>
                                        </span>
                                    </label>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="flex-1 bg-white/10 text-white font-semibold py-3 rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        <ArrowLeft size={20} />
                                        Retour
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-white text-purple-900 font-semibold py-3 rounded-xl hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Inscription...' : 'Créer mon compte'}
                                    </button>
                                </div>
                            </div>
                        )}
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
