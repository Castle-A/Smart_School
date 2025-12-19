import { useState } from 'react';
import { BookOpen, GraduationCap, Percent } from 'lucide-react';
import type { SchoolConfig } from '../../../../../shared/api/school-config.service';

interface AcademicConfigProps {
    config: SchoolConfig;
    onUpdate: (data: any) => Promise<void>;
}

export const AcademicConfig = ({ config, onUpdate }: AcademicConfigProps) => {
    const [gradingScale, setGradingScale] = useState(config.gradingScale);
    const [passingGrade, setPassingGrade] = useState(config.passingGrade);
    const [defaultCoefficient, setDefaultCoefficient] = useState(config.defaultCoefficient);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onUpdate({ gradingScale, passingGrade, defaultCoefficient });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <BookOpen className="text-emerald-400" size={24} />
                    <h3 className="text-xl font-semibold text-white">Paramètres Académiques</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                        <div className="flex items-center gap-3 mb-4 text-emerald-400">
                            <GraduationCap size={20} />
                            <span className="text-white font-medium">Échelle de Notes</span>
                        </div>
                        <input
                            type="number"
                            value={gradingScale}
                            onChange={(e) => setGradingScale(Number(e.target.value))}
                            className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <p className="text-xs text-slate-500 mt-2">Maximum possible (ex: 20)</p>
                    </div>

                    <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                        <div className="flex items-center gap-3 mb-4 text-emerald-400">
                            <Percent size={20} />
                            <span className="text-white font-medium">Moyenne de Passage</span>
                        </div>
                        <input
                            type="number"
                            value={passingGrade}
                            onChange={(e) => setPassingGrade(Number(e.target.value))}
                            className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <p className="text-xs text-slate-500 mt-2">Moyenne minimale d'admission</p>
                    </div>

                    <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                        <div className="flex items-center gap-3 mb-4 text-emerald-400">
                            <Percent size={20} />
                            <span className="text-white font-medium">Codéfficient Défaut</span>
                        </div>
                        <input
                            type="number"
                            value={defaultCoefficient}
                            onChange={(e) => setDefaultCoefficient(Number(e.target.value))}
                            className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <p className="text-xs text-slate-500 mt-2">Appliqué si non spécifié</p>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                        {isSaving ? 'Enregistrement...' : 'Mettre à jour les règles'}
                    </button>
                </div>
            </div>
        </div>
    );
};
