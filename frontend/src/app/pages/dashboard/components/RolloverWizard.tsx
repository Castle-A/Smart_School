import React, { useState, useEffect } from 'react';
import { ArrowRight, AlertTriangle, Loader2 } from 'lucide-react';
import { academicYearsService } from '../../../../shared/api/academic-years.service';
import { toastEvents } from '../../../../shared/utils/toast-events';

interface RolloverWizardProps {
    sourceYearId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export const RolloverWizard: React.FC<RolloverWizardProps> = ({ sourceYearId, onClose, onSuccess }) => {
    const [step] = useState(1);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        startDate: '',
        endDate: '',
        inheritOptions: {
            classes: true,
            subjects: true,
            classSubjects: true,
            students: 'PROMOTE'
        }
    });

    useEffect(() => {
        loadPreview();
    }, [sourceYearId]);

    const loadPreview = async () => {
        setLoading(true);
        try {
            const data = await academicYearsService.previewNext(sourceYearId);
            setPreview(data);
            // Pre-fill smart defaults
            setFormData(prev => ({
                ...prev,
                name: data.toCreate?.yearName || '',
                // Auto-set dates to next year logic (simplified here)
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
            }));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await academicYearsService.createNext(sourceYearId, formData);
            onSuccess();
        } catch (err) {
            toastEvents.error("Erreur lors de la transition");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !preview) return <div className="p-8 text-center text-white"><Loader2 className="animate-spin mx-auto mb-2" /> Chargement...</div>;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1e293b] w-full max-w-2xl rounded-xl border border-white/10 shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Transition vers la Nouvelle Année</h2>
                </div>

                <div className="p-6">
                    {step === 1 && preview && (
                        <div className="space-y-6">
                            <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-lg">
                                <h3 className="text-indigo-300 font-semibold mb-2">Résumé de la migration</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                                    <div className="flex justify-between"><span>Classes à dupliquer:</span> <span className="text-white">{preview.toCreate.classesCount}</span></div>
                                    <div className="flex justify-between"><span>Matières à conserver:</span> <span className="text-white">{preview.toCreate.subjectsCount}</span></div>
                                    <div className="flex justify-between"><span>Élèves à promouvoir:</span> <span className="text-green-400">{preview.students.toPromote}</span></div>
                                    <div className="flex justify-between"><span>Élèves redoublants:</span> <span className="text-orange-400">{preview.students.toRepeat}</span></div>
                                </div>
                            </div>

                            {preview.warnings?.length > 0 && (
                                <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                                    <h4 className="text-yellow-500 flex items-center gap-2 font-medium mb-2"><AlertTriangle size={16} /> Attention</h4>
                                    <ul className="text-xs text-yellow-200/80 space-y-1 list-disc list-inside">
                                        {preview.warnings.map((w: string, i: number) => <li key={i}>{w}</li>)}
                                    </ul>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Nom de la nouvelle année</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Date Début</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Date Fin</label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-black/20">
                    <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Annuler</button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                        {loading && <Loader2 className="animate-spin" size={16} />}
                        {loading ? 'Traitement...' : 'Lancer la Transition'}
                        {!loading && <ArrowRight size={16} />}
                    </button>
                </div>
            </div>
        </div>
    );
};
