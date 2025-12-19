import { useState } from 'react';
import { Palette, Share2, Upload } from 'lucide-react';
import type { SchoolConfig } from '../../../../../shared/api/school-config.service';

interface IdentityConfigProps {
    config: SchoolConfig;
    onUpdate: (data: any) => Promise<void>;
}

export const IdentityConfig = ({ config, onUpdate }: IdentityConfigProps) => {
    const [motto, setMotto] = useState(config.motto || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onUpdate({ motto });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Palette className="text-indigo-400" size={24} />
                    <h3 className="text-xl font-semibold text-white">Identité & Branding</h3>
                </div>

                <div className="space-y-4">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                            <div className="flex items-center gap-3 mb-3">
                                <Upload className="text-indigo-400" size={18} />
                                <span className="text-white font-medium">Logo Officiel</span>
                            </div>
                            <div className="flex items-center justify-center p-8 border-2 border-dashed border-white/10 rounded-lg hover:border-indigo-500/50 transition-colors cursor-pointer group">
                                <p className="text-slate-400 text-sm group-hover:text-indigo-400">Cliquez pour téléverser</p>
                            </div>
                        </div>

                        <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                            <div className="flex items-center gap-3 mb-3">
                                <Share2 className="text-indigo-400" size={18} />
                                <span className="text-white font-medium">Couleurs de Marque</span>
                            </div>
                            <div className="flex gap-2">
                                {['#4F46E5', '#10B981', '#F59E0B', '#EF4444'].map((color) => (
                                    <div
                                        key={color}
                                        className="w-8 h-8 rounded-full border border-white/20 cursor-pointer hover:scale-110 transition-transform"
                                        style={{ backgroundColor: color }}
                                    ></div>
                                ))}
                            </div>
                        </div>
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
    );
};
