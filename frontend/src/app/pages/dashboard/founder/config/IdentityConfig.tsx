import { useState, useEffect, type DragEvent } from 'react';
import { Palette, Share2, Upload, Loader2, CheckCircle, X } from 'lucide-react';
import type { SchoolConfig } from '../../../../../shared/api/school-config.service';
import api from '../../../../../shared/api/api';
import { Vibrant } from 'node-vibrant/browser';

interface IdentityConfigProps {
    config: SchoolConfig;
    onUpdate: (data: any) => Promise<void>;
}

export const IdentityConfig = ({ config, onUpdate }: IdentityConfigProps) => {
    const [motto, setMotto] = useState(config.motto || '');
    const [isSaving, setIsSaving] = useState(false);

    // Logo upload states
    const [, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(config.logo || null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Color detection states
    const [detectedColors, setDetectedColors] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [isExtractingColors, setIsExtractingColors] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const updateData: any = { motto };

            // Save selected colors if any
            if (selectedColors.length > 0) {
                updateData.officialColors = JSON.stringify(selectedColors);
            }

            await onUpdate(updateData);
        } finally {
            setIsSaving(false);
        }
    };

    // Validation du fichier
    const validateFile = (file: File): string | null => {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
        const maxSize = 2 * 1024 * 1024; // 2MB

        if (!allowedTypes.includes(file.type)) {
            return 'Format non accepté. Utilisez PNG, JPG ou SVG uniquement.';
        }

        if (file.size > maxSize) {
            return 'Fichier trop volumineux. Taille maximale : 2MB.';
        }

        return null;
    };

    // Handle file selection
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    // Process file (upload logo)
    const processFile = (file: File) => {
        const error = validateFile(file);
        if (error) {
            setUploadError(error);
            return;
        }

        setLogoFile(file);
        setUploadError(null);
        setUploadSuccess(false);

        // Créer aperçu
        const reader = new FileReader();
        reader.onloadend = () => {
            setLogoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload automatique
        uploadLogo(file);
    };

    // Upload logo to server
    const uploadLogo = async (file: File) => {
        setIsUploading(true);
        setUploadError(null);

        const formData = new FormData();
        formData.append('logo', file);

        try {
            const response = await api.post('/files/school-logo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                setLogoPreview(response.data.logoUrl);
                setUploadSuccess(true);

                // Auto-hide success message after 3s
                setTimeout(() => setUploadSuccess(false), 3000);

                // Extract colors from uploaded logo
                extractColorsFromImage(file);
            }
        } catch (error: any) {
            setUploadError(
                error.response?.data?.message || 'Erreur lors du téléversement du logo'
            );
        } finally {
            setIsUploading(false);
        }
    };

    // Drag & Drop handlers
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            processFile(file);
        }
    };

    // Remove logo
    const handleRemoveLogo = () => {
        setLogoFile(null);
        setLogoPreview(null);
        setUploadSuccess(false);
        setUploadError(null);
        setDetectedColors([]);
        setSelectedColors([]);
    };

    // Extract colors from image using Vibrant
    const extractColorsFromImage = async (file: File) => {
        setIsExtractingColors(true);
        try {
            const img = new Image();
            const reader = new FileReader();

            reader.onload = async (e) => {
                img.src = e.target?.result as string;

                img.onload = async () => {
                    try {
                        const palette = await Vibrant.from(img.src).getPalette();

                        const colors: string[] = [];

                        // Extract colors in order of prominence
                        if (palette.Vibrant) colors.push(palette.Vibrant.hex);
                        if (palette.DarkVibrant) colors.push(palette.DarkVibrant.hex);
                        if (palette.LightVibrant) colors.push(palette.LightVibrant.hex);
                        if (palette.Muted) colors.push(palette.Muted.hex);
                        if (palette.DarkMuted) colors.push(palette.DarkMuted.hex);
                        if (palette.LightMuted) colors.push(palette.LightMuted.hex);

                        setDetectedColors(colors);
                        setSelectedColors(colors.slice(0, 4)); // Auto-select first 4
                    } catch (error) {
                        console.error('Error extracting colors:', error);
                    } finally {
                        setIsExtractingColors(false);
                    }
                };
            };

            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error processing image:', error);
            setIsExtractingColors(false);
        }
    };

    // Toggle color selection
    const toggleColorSelection = (color: string) => {
        setSelectedColors(prev =>
            prev.includes(color)
                ? prev.filter(c => c !== color)
                : [...prev, color]
        );
    };

    // Initialize colors from config
    useEffect(() => {
        if (config.officialColors) {
            try {
                const parsed = typeof config.officialColors === 'string'
                    ? JSON.parse(config.officialColors)
                    : config.officialColors;

                if (Array.isArray(parsed)) {
                    setSelectedColors(parsed);
                    // If we have saved colors but no detected ones (refresh), 
                    // use saved ones as "detected" to allow deselection/viewing
                    if (detectedColors.length === 0) {
                        setDetectedColors(parsed);
                    }
                }
            } catch (e) {
                console.error('Failed to parse official colors', e);
            }
        }
    }, [config.officialColors]);

    return (
        <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Palette className="text-indigo-400" size={24} />
                    <h3 className="text-xl font-semibold text-white">Identité & Branding</h3>
                </div>

                <div className="space-y-6">
                    {/* Devise */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Devise de l'école
                        </label>
                        <input
                            type="text"
                            value={motto}
                            onChange={(e) => setMotto(e.target.value)}
                            className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Ex: Excellence, Travail, Discipline"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Logo Upload */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Upload className="text-indigo-400" size={18} />
                                <span className="text-white font-medium">Logo Officiel</span>
                            </div>

                            {/* Drop Zone */}
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`relative group border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer overflow-hidden ${isDragging
                                    ? 'border-indigo-500 bg-indigo-500/10'
                                    : 'border-white/10 hover:border-indigo-500/50 bg-white/5'
                                    }`}
                            >
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                                    onChange={handleFileSelect}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />

                                {logoPreview ? (
                                    <div className="relative flex flex-col items-center justify-center min-h-[160px]">
                                        <div className="relative p-2 bg-white/5 rounded-lg mb-4 group-hover:bg-white/10 transition-colors">
                                            <img
                                                src={logoPreview}
                                                alt="Logo preview"
                                                className="max-h-40 max-w-full object-contain drop-shadow-lg"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-400 bg-black/20 px-3 py-1.5 rounded-full">
                                            <Upload size={12} />
                                            <span>Cliquez ou glissez pour changer</span>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveLogo();
                                            }}
                                            className="absolute top-0 right-0 p-2 bg-red-500/80 text-white rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all z-20"
                                            title="Supprimer le logo"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <Upload className="text-indigo-400" size={32} />
                                        </div>
                                        <p className="text-sm text-slate-300 font-medium mb-1">
                                            Glissez-déposez votre logo ici
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            PNG, JPG, SVG • Max 2MB
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Upload Status */}
                            {isUploading && (
                                <div className="flex items-center gap-2 text-indigo-400 text-sm animate-pulse">
                                    <Loader2 className="animate-spin" size={16} />
                                    <span>Téléversement en cours...</span>
                                </div>
                            )}

                            {uploadSuccess && (
                                <div className="flex items-center gap-2 text-green-400 text-sm">
                                    <CheckCircle size={16} />
                                    <span>Logo mis à jour !</span>
                                </div>
                            )}

                            {uploadError && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <p className="text-red-400 text-sm">{uploadError}</p>
                                </div>
                            )}
                        </div>

                        {/* Brand Colors */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Share2 className="text-indigo-400" size={18} />
                                <span className="text-white font-medium">Couleurs de Marque</span>
                            </div>
                            <div className="p-6 bg-white/5 border border-white/10 rounded-xl min-h-[300px]">
                                {isExtractingColors ? (
                                    <div className="h-full flex flex-col items-center justify-center text-indigo-400 gap-3">
                                        <Loader2 className="animate-spin" size={32} />
                                        <span className="text-sm">Extraction de la palette...</span>
                                    </div>
                                ) : (detectedColors.length > 0 || selectedColors.length > 0) ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Palette size={16} className="text-indigo-400" />
                                                <span className="text-xs text-slate-300 font-medium">
                                                    Palette Principale
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-slate-500 bg-white/5 px-2 py-1 rounded">
                                                {selectedColors.length} active(s)
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            {(detectedColors.length > 0 ? detectedColors : selectedColors).map((color, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => toggleColorSelection(color)}
                                                    className={`group relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${selectedColors.includes(color)
                                                        ? 'bg-white/10 ring-1 ring-indigo-500/50'
                                                        : 'bg-white/5 hover:bg-white/10'
                                                        }`}
                                                >
                                                    <div
                                                        className="w-12 h-12 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300 relative"
                                                        style={{ backgroundColor: color }}
                                                    >
                                                        {selectedColors.includes(color) && (
                                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                                                                <CheckCircle className="text-white drop-shadow-md" size={20} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                                                        {color}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>

                                        {detectedColors.length > 0 && (
                                            <p className="text-xs text-slate-500 text-center mt-4 italic">
                                                Couleurs extraites automatiquement du logo
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                        <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center mb-3">
                                            <Palette className="text-slate-600" size={24} />
                                        </div>
                                        <p className="text-sm text-slate-400 max-w-[200px]">
                                            Téléversez un logo pour générer votre palette automatiquement
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                            >
                                {isSaving ? 'Enregistrement...' : 'Sauvegarder les modifications'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
