import { useState, useEffect, useRef } from 'react';
import { Camera, Save, Lock, Mail, Phone, User as UserIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { profileService } from '../../shared/api/profile.service';
import type { UserProfile } from '../../shared/api/profile.service';
import { authService } from '../../shared/api/auth.service';

export default function SettingsPage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await profileService.getProfile();
            setProfile(data);
            setFormData(prev => ({
                ...prev,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone || '',
                email: data.email
            }));
        } catch (error) {
            console.error('Failed to load profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            await profileService.updateProfile({
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone
            });
            setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
            loadProfile();
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur lors de la mise à jour du profil' });
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Les nouveaux mots de passe ne correspondent pas' });
            return;
        }

        setSaving(true);
        setMessage(null);

        try {
            await authService.changePassword(formData.currentPassword, formData.newPassword);
            setMessage({ type: 'success', text: 'Mot de passe modifié avec succès' });
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur lors du changement de mot de passe' });
        } finally {
            setSaving(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            await profileService.uploadProfilePicture(file);
            loadProfile();
            setMessage({ type: 'success', text: 'Photo de profil mise à jour' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur lors du téléchargement de la photo' });
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Chargement...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 font-sans text-slate-100">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold text-white mb-8">Paramètres du compte</h1>

                {message && (
                    <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Profile Picture & Basic Info */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 text-center">
                            <div className="relative inline-block mb-4 group">
                                {profile?.profilePicture ? (
                                    <img
                                        src={profile.profilePicture}
                                        alt={profile.fullName}
                                        className="w-32 h-32 rounded-full object-cover border-4 border-white/10"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-4xl border-4 border-white/10">
                                        {profile?.initials}
                                    </div>
                                )}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full text-white hover:bg-purple-500 transition-colors shadow-lg"
                                >
                                    <Camera className="w-5 h-5" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>
                            <h2 className="text-xl font-bold text-white">{profile?.fullName}</h2>
                            <p className="text-white/60 text-sm">{profile?.role}</p>
                        </div>
                    </div>

                    {/* Forms */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Personal Info Form */}
                        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <UserIcon className="w-5 h-5 text-blue-400" />
                                Informations Personnelles
                            </h3>
                            <form onSubmit={handleProfileUpdate} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1">Prénom</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1">Nom</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-1">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            disabled
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white/60 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-1">Téléphone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                        />
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4" />
                                        Enregistrer
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Password Form */}
                        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Lock className="w-5 h-5 text-purple-400" />
                                Sécurité
                            </h3>
                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-white/60 mb-1">Mot de passe actuel</label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1">Nouveau mot de passe</label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1">Confirmer</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                        />
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4" />
                                        Modifier le mot de passe
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
