import { useState } from 'react';
import { Camera, Mail, Phone, User, Save, X } from 'lucide-react';
import { useAuth } from '../../../../../shared/contexts/AuthContext';

interface ProfileSectionProps {
    onDirtyChange?: (isDirty: boolean) => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ onDirtyChange }) => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        profilePhoto: ''
    });

    const [initialData] = useState(formData);

    const isDirty = JSON.stringify(formData) !== JSON.stringify(initialData);

    const handleChange = (field: string, value: string) => {
        const newData = { ...formData, [field]: value };
        setFormData(newData);
        onDirtyChange?.(JSON.stringify(newData) !== JSON.stringify(initialData));
    };

    const handleSave = () => {
        console.log('Saving profile:', formData);
        setIsEditing(false);
        if (user) {
            updateUser({
                ...user,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email
            });
        }
        onDirtyChange?.(false);
    };

    const handleCancel = () => {
        setFormData(initialData);
        setIsEditing(false);
        onDirtyChange?.(false);
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleChange('profilePhoto', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white">Profil</h2>
                    <p className="text-gray-400 mt-1">Gérez vos informations personnelles</p>
                </div>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                        <User size={18} />
                        Modifier le profil
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                            <X size={18} />
                            Annuler
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Save size={18} />
                            Enregistrer
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Photo de profil */}
                <div className="lg:col-span-1">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Photo de profil</h3>
                        <div className="flex flex-col items-center">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                                    {formData.profilePhoto ? (
                                        <img src={formData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{formData.firstName.charAt(0)}{formData.lastName.charAt(0)}</span>
                                    )}
                                </div>
                                {isEditing && (
                                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Camera size={32} className="text-white" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoUpload}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                            <p className="text-sm text-gray-400 mt-4 text-center">
                                {isEditing ? 'Cliquez pour changer la photo' : 'Photo de profil'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Informations personnelles */}
                <div className="lg:col-span-2">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-6">Informations personnelles</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Prénom</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => handleChange('firstName', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Nom de famille</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => handleChange('lastName', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Adresse email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Numéro de téléphone</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        disabled={!isEditing}
                                        placeholder="+225 XX XX XX XX XX"
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Rôle</label>
                                <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
                                    <span className="text-white capitalize">{user?.role || 'Fondateur'}</span>
                                    <span className="ml-2 text-xs text-gray-500">(non modifiable)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSection;
