import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../shared/api/api';
import { User, Mail, Briefcase, ArrowLeft, Shield, Building2, Smartphone } from 'lucide-react';
import PhoneInput from '../../shared/components/PhoneInput';
import PermissionsChecklist from '../../shared/components/PermissionsChecklist';
import SuccessCredentialsModal from '../../shared/components/SuccessCredentialsModal';

type MemberRole = 'DIRECTOR' | 'SECRETARY' | 'SURVEILLANT' | 'CENSEUR' | 'ACCOUNTANT' | 'TEACHER';

const CreateMemberPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const preSelectedRole = (location.state as any)?.role?.toUpperCase();

    // Initialize with valid defaults to avoid "Select..." states
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        gender: 'HOMME', // Default valid value
        phone: '',
        email: '',
        role: (preSelectedRole as MemberRole) || 'DIRECTOR', // Default valid value
        directorType: 'PRIMARY_PRESCHOOL', // Default valid value
        loginMethod: 'email',
    });

    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [generatedCredentials, setGeneratedCredentials] = useState({
        identifier: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));

        if (field === 'role') {
            setSelectedPermissions([]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Nettoyer les champs optionnels inutiles (mais garder loginMethod)
            const payload = {
                ...formData,
                permissionIds: selectedPermissions,
            };

            // Nettoyage conditionnel
            if (!['DIRECTOR', 'SECRETARY'].includes(formData.role)) {
                delete (payload as any).directorType;
            }

            console.log('Create member payload:', payload);

            const response = await api.post('/members/create', payload);
            const data = response.data;

            setGeneratedCredentials({
                identifier: data.credentials.identifier,
                password: data.credentials.tempPassword,
            });
            setIsSuccessModalOpen(true);
        } catch (error: any) {
            console.error('Error creating member:', error.response?.data || error);
            const errorMessage = error.response?.data?.message || error.message || 'Erreur inconnue';
            alert(`Erreur lors de la création du membre: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setIsSuccessModalOpen(false);
        setFormData({
            firstName: '',
            lastName: '',
            gender: 'HOMME',
            phone: '',
            email: '',
            role: 'DIRECTOR',
            directorType: 'PRIMARY_PRESCHOOL',
            loginMethod: 'email',
        });
        setSelectedPermissions([]);
    };

    // Logic to determine if permissions should be shown
    const requiresDirectorType = ['DIRECTOR', 'SECRETARY'].includes(formData.role);
    const shouldShowPermissions =
        ['SURVEILLANT', 'CENSEUR', 'ACCOUNTANT'].includes(formData.role) ||
        (requiresDirectorType && formData.directorType !== '');

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/app/dashboard')}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Nouveau Membre</h1>
                        <p className="text-white/70 mt-1">
                            Créer un nouveau membre de l'administration
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informations personnelles */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 relative z-20">
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <User className="text-indigo-400" size={24} />
                            Informations personnelles
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-white/90 mb-2">
                                    Prénom <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={formData.firstName}
                                        onChange={e => handleChange('firstName', e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-colors"
                                        placeholder="Jean"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/90 mb-2">
                                    Nom <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={formData.lastName}
                                        onChange={e => handleChange('lastName', e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-colors"
                                        placeholder="Dupont"
                                    />
                                </div>
                            </div>

                            <div className="relative z-20">
                                <PhoneInput
                                    value={formData.phone}
                                    onChange={value => handleChange('phone', value)}
                                    label="Numéro de téléphone"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/90 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={e => handleChange('email', e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-colors"
                                        placeholder="jean.dupont@smartschool.com"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-white/90 mb-2">
                                    Genre <span className="text-red-500">*</span>
                                </label>
                                <select
                                    required
                                    value={formData.gender}
                                    onChange={e => handleChange('gender', e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500 [&>option]:bg-slate-800 [&>option]:text-white transition-colors"
                                >
                                    <option value="HOMME">Masculin</option>
                                    <option value="FEMME">Féminin</option>
                                    <option value="DIVERS">Divers</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Poste et type */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 relative z-10">
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <Briefcase className="text-emerald-400" size={24} />
                            Poste et permissions
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-white/90 mb-2">
                                    Poste <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                                    <select
                                        required
                                        value={formData.role}
                                        onChange={e => handleChange('role', e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500 [&>option]:bg-slate-800 [&>option]:text-white appearance-none transition-colors"
                                    >
                                        <option value="DIRECTOR">Directeur</option>
                                        <option value="CENSEUR">Censeur</option>
                                        <option value="SURVEILLANT">Surveillant Général</option>
                                        <option value="ACCOUNTANT">Comptable</option>
                                        <option value="SECRETARY">Secrétaire</option>
                                    </select>
                                </div>
                            </div>

                            {/* Director Type Selection */}
                            {requiresDirectorType && (
                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <label className="block text-sm font-medium text-white/90 mb-2">
                                        {formData.role === 'SECRETARY' ? 'Type de Secrétariat' : 'Type de Direction'} <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                                        <select
                                            required
                                            value={formData.directorType}
                                            onChange={e => handleChange('directorType', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500 [&>option]:bg-slate-800 [&>option]:text-white appearance-none transition-colors"
                                        >
                                            <option value="PRIMARY_PRESCHOOL">Primaire/Maternelle</option>
                                            <option value="COLLEGE">Collège</option>
                                            <option value="BOTH">Les Deux</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {shouldShowPermissions && (
                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                                        <Shield className="text-indigo-400" size={20} />
                                        Configuration des permissions
                                    </h3>
                                    <PermissionsChecklist
                                        role={formData.role}
                                        directorType={formData.directorType}
                                        selectedPermissions={selectedPermissions}
                                        onChange={setSelectedPermissions}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Login Method Selection */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <Smartphone className="text-purple-400" size={24} />
                            Méthode de connexion
                        </h2>
                        <p className="text-sm text-white/70 mb-4">
                            Choisissez comment le membre se connectera à son compte
                        </p>
                        <div className="flex gap-4">
                            <label className="flex-1 cursor-pointer">
                                <input
                                    type="radio"
                                    name="loginMethod"
                                    value="email"
                                    checked={formData.loginMethod === 'email'}
                                    onChange={e => handleChange('loginMethod', e.target.value)}
                                    className="sr-only peer"
                                />
                                <div className="p-4 bg-white/5 border-2 border-white/10 rounded-lg peer-checked:border-indigo-500 peer-checked:bg-indigo-500/10 transition-all hover:bg-white/10">
                                    <div className="flex items-center gap-3">
                                        <Mail className="text-indigo-400" size={20} />
                                        <div>
                                            <div className="font-medium text-white">Email</div>
                                            <div className="text-xs text-white/70">Connexion par email</div>
                                        </div>
                                    </div>
                                </div>
                            </label>
                            <label className="flex-1 cursor-pointer">
                                <input
                                    type="radio"
                                    name="loginMethod"
                                    value="phone"
                                    checked={formData.loginMethod === 'phone'}
                                    onChange={e => handleChange('loginMethod', e.target.value)}
                                    className="sr-only peer"
                                />
                                <div className="p-4 bg-white/5 border-2 border-white/10 rounded-lg peer-checked:border-purple-500 peer-checked:bg-purple-500/10 transition-all hover:bg-white/10">
                                    <div className="flex items-center gap-3">
                                        <Smartphone className="text-purple-400" size={20} />
                                        <div>
                                            <div className="font-medium text-white">Numéro de téléphone</div>
                                            <div className="text-xs text-white/70">Connexion par téléphone</div>
                                        </div>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
                        >
                            {isLoading ? 'Création en cours...' : 'Créer le membre'}
                        </button>
                    </div>
                </form>
            </div>

            <SuccessCredentialsModal
                isOpen={isSuccessModalOpen}
                onClose={() => navigate('/app/dashboard?section=administration')}
                onReset={handleReset}
                credentials={generatedCredentials}
            />
        </div>
    );
};

export default CreateMemberPage;
