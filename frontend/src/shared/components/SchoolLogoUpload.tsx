import { useState, useRef } from 'react';
import { Upload, School, X } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../contexts/AuthContext';

interface SchoolLogoUploadProps {
    currentLogo?: string | null;
    schoolId: string;
    onSuccess?: () => void;
}

const SchoolLogoUpload = ({ currentLogo, schoolId, onSuccess }: SchoolLogoUploadProps) => {
    const [preview, setPreview] = useState<string | null>(currentLogo || null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user } = useAuth();

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Veuillez sélectionner une image');
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            setError('L\'image ne doit pas dépasser 2 Mo');
            return;
        }

        setError(null);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload file
        uploadLogo(file);
    };

    const uploadLogo = async (file: File) => {
        setUploading(true);
        setError(null);

        try {
            // For now, we'll use a simple base64 approach
            // In production, you'd upload to a cloud storage service
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64 = reader.result as string;

                if (!user) {
                    setError('Utilisateur non connecté');
                    return;
                }

                const response = await api.put(`/schools/${schoolId}/logo`, {
                    logoUrl: base64,
                    userId: user.id,
                });

                if (response.status === 200 || response.status === 201) {
                    onSuccess?.();
                } else {
                    setError('Erreur lors de l\'upload');
                }
            };
            reader.readAsDataURL(file);
        } catch (err) {
            setError('Erreur lors de l\'upload du logo');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveLogo = async () => {
        if (!confirm('Voulez-vous vraiment supprimer le logo de l\'école ?')) return;

        setUploading(true);
        try {
            if (!user) {
                setError('Utilisateur non connecté');
                return;
            }

            await api.put(`/schools/${schoolId}/logo`, {
                logoUrl: null,
                userId: user.id,
            });

            setPreview(null);
            onSuccess?.();
        } catch (err) {
            setError('Erreur lors de la suppression');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Logo de l'École</h3>
            <p className="text-sm text-gray-400 mb-6">
                Téléchargez le logo de votre école. Il sera affiché dans la barre latérale pour tous les utilisateurs.
            </p>

            <div className="flex flex-col items-center gap-6">
                {/* Preview */}
                <div className="relative">
                    {preview ? (
                        <div className="relative group">
                            <img
                                src={preview}
                                alt="Logo de l'école"
                                className="w-32 h-32 rounded-xl object-cover border-2 border-white/20"
                            />
                            {!uploading && (
                                <button
                                    onClick={handleRemoveLogo}
                                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Supprimer le logo"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="w-32 h-32 rounded-xl bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center">
                            <School size={40} className="text-gray-500" />
                        </div>
                    )}
                </div>

                {/* Upload Button */}
                <div className="w-full">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white rounded-lg transition-colors font-medium"
                    >
                        {uploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Téléchargement...
                            </>
                        ) : preview ? (
                            <>
                                <Upload size={18} />
                                Changer le logo
                            </>
                        ) : (
                            <>
                                <Upload size={18} />
                                Télécharger un logo
                            </>
                        )}
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="w-full p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                )}

                {/* Info */}
                <div className="w-full p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-xs text-blue-400">
                        ℹ️ Formats acceptés : JPG, PNG, GIF. Taille max : 2 Mo
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SchoolLogoUpload;
