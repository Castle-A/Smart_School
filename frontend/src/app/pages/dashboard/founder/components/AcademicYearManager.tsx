import { useState, useEffect } from 'react';
import { Calendar, Plus, ArrowRight, CheckCircle, Lock, Play, RefreshCw, ShieldCheck } from 'lucide-react';
import { academicYearsService } from '../../../../../shared/api/academic-years.service';
import { toastEvents } from '../../../../../shared/utils/toast-events';

interface WizardStep {
    id: 'IDENTITY' | 'PERIODS' | 'CLOSURE';
    title: string;
    description: string;
}

const AcademicYearManager = () => {
    // const { user } = useAuth();
    const [years, setYears] = useState<any[]>([]); // TODO: Type properly
    // const [activeYearId, setActiveYearId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [currentStep, setCurrentStep] = useState<number>(0);
    // const [isLoading, setIsLoading] = useState(true);

    // New Year Form State
    const [formData, setFormData] = useState<{
        name: string;
        startDate: string;
        endDate: string;
        periodType: 'TRIMESTER' | 'SEMESTER';
        autoClosureEnabled: boolean;
        autoClosureDate: string;
        sourceYearId: string;
        keepTeachers: boolean;
    }>({
        name: '',
        startDate: '',
        endDate: '',
        periodType: 'TRIMESTER',
        autoClosureEnabled: false,
        autoClosureDate: '',
        sourceYearId: '',
        keepTeachers: false
    });

    useEffect(() => {
        fetchYears();
    }, []);

    const fetchYears = async () => {
        try {
            const data = await academicYearsService.findAll();
            setYears(data);

            // INTELLIGENT DEFAULT :
            // Si des années existent, on pré-sélectionne la plus récente pour le Rollover
            if (data.length > 0) {
                // Trier par date de fin décroissante
                const latestYear = [...data].sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())[0];

                setFormData(prev => ({
                    ...prev,
                    sourceYearId: latestYear.id,
                    keepTeachers: true // Par défaut, on propose de garder les profs
                }));
            }
        } catch (error) {
            console.error('Failed to fetch years', error);
        } finally {
            // setIsLoading(false);
        }
    };

    const steps: WizardStep[] = [
        { id: 'IDENTITY', title: 'Identité', description: 'Nom et dates de l\'année' },
        { id: 'PERIODS', title: 'Périodes', description: 'Découpage du calendrier' },
        { id: 'CLOSURE', title: 'Clôture', description: 'Règles de fermeture' }
    ];

    const handleCreate = async () => {
        try {
            await academicYearsService.create(formData);
            toastEvents.emit('success', 'Année scolaire créée avec succès');
            setIsCreating(false);
            fetchYears();
        } catch (error) {
            toastEvents.emit('error', 'Erreur lors de la création');
        }
    };

    // Render Wizard Content
    const renderWizard = () => {
        return (
            <div className="bg-slate-900 rounded-xl border border-white/10 p-6 animate-in slide-in-from-right">
                {/* Progress Steps */}
                <div className="flex justify-between items-center mb-8 relative">
                    <div className="absolute left-0 top-1/2 w-full h-0.5 bg-white/10 -z-0"></div>
                    {steps.map((step, idx) => (
                        <div key={step.id} className={`relative z-10 flex flex-col items-center gap-2 ${idx <= currentStep ? 'text-indigo-400' : 'text-slate-600'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${idx <= currentStep ? 'bg-indigo-900 border-indigo-500' : 'bg-slate-900 border-slate-700'
                                }`}>
                                {idx < currentStep ? <CheckCircle size={16} /> : <span className="text-sm font-bold">{idx + 1}</span>}
                            </div>
                            <span className="text-xs font-medium bg-slate-900 px-2">{step.title}</span>
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div className="min-h-[300px]">
                    {currentStep === 0 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-white mb-4">Définissons la nouvelle année</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400">Nom (ex: 2025-2026)</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                                        placeholder="2025-2026"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400">Copier la structure de... (Optionnel)</label>
                                    <select
                                        value={formData.sourceYearId}
                                        onChange={e => setFormData({ ...formData, sourceYearId: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                                    >
                                        <option value="">Aucune (Création vierge)</option>
                                        {years.map(y => (
                                            <option key={y.id} value={y.id}>{y.name}</option>
                                        ))}
                                    </select>

                                    {formData.sourceYearId && (
                                        <div className="flex items-start gap-2 mt-2 p-2 bg-indigo-500/10 rounded border border-indigo-500/20 animate-in slide-in-from-top-1">
                                            <input
                                                type="checkbox"
                                                id="keepTeachers"
                                                checked={formData.keepTeachers}
                                                onChange={e => setFormData({ ...formData, keepTeachers: e.target.checked })}
                                                className="mt-1"
                                            />
                                            <label htmlFor="keepTeachers" className="text-xs text-indigo-300 cursor-pointer select-none">
                                                <strong>Conserver les Enseignants</strong>
                                                <br />
                                                <span className="opacity-80">Copie aussi les affectations par matière ("Mme Diallo en Maths 6ème A").</span>
                                            </label>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400">Date de Début</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400">Date de Fin</label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-white mb-4">Découpage du Calendrier</h3>
                            <div className="flex gap-4 mb-6">
                                <button
                                    onClick={() => setFormData({ ...formData, periodType: 'TRIMESTER' })}
                                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${formData.periodType === 'TRIMESTER' ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 hover:bg-white/5'}`}
                                >
                                    <h4 className="font-bold text-white mb-1">Trimestres</h4>
                                    <p className="text-xs text-slate-400">3 Périodes classiques</p>
                                </button>
                                <button
                                    onClick={() => setFormData({ ...formData, periodType: 'SEMESTER' })}
                                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${formData.periodType === 'SEMESTER' ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 hover:bg-white/5'}`}
                                >
                                    <h4 className="font-bold text-white mb-1">Semestres</h4>
                                    <p className="text-xs text-slate-400">2 Grandes périodes</p>
                                </button>
                            </div>
                            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-200 text-sm">
                                <span className="block font-bold mb-1">ℹ️ Note Importante</span>
                                Vous définissez uniquement les dates ici. Les poids et coefficients des matières sont gérés spécifiquement par cycle (Maternelle, Collège...).
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-white mb-4">Automatisation de la Clôture</h3>

                            <div className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-white font-medium">Clôture Automatique</h4>
                                        <p className="text-sm text-slate-400">Le système tentera de clôturer l'année à une date précise.</p>
                                    </div>
                                    <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                        <input
                                            type="checkbox"
                                            checked={formData.autoClosureEnabled}
                                            onChange={e => setFormData({ ...formData, autoClosureEnabled: e.target.checked })}
                                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 right-6"
                                        />
                                        <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${formData.autoClosureEnabled ? 'bg-indigo-600' : 'bg-slate-700'}`}></label>
                                    </div>
                                </div>

                                {formData.autoClosureEnabled && (
                                    <div className="pt-4 border-t border-white/10 animate-in slide-in-from-top-2">
                                        <label className="text-sm text-slate-400 block mb-2">Date de tentative de clôture</label>
                                        <input
                                            type="date"
                                            value={formData.autoClosureDate}
                                            onChange={e => setFormData({ ...formData, autoClosureDate: e.target.value })}
                                            className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white"
                                        />
                                        <div className="flex gap-2 mt-3 text-xs text-indigo-300 bg-indigo-500/10 p-2 rounded">
                                            <ShieldCheck size={14} className="mt-0.5" />
                                            <p><strong>Sécurité Active :</strong> Même si la date est atteinte, la clôture ne se fera QUE si les 3 validations (Académique & Finance) sont vertes.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="flex justify-between mt-8 border-t border-white/10 pt-6">
                    <button
                        onClick={() => currentStep > 0 ? setCurrentStep(curr => curr - 1) : setIsCreating(false)}
                        className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                    >
                        {currentStep === 0 ? 'Annuler' : 'Retour'}
                    </button>

                    {currentStep < 2 ? (
                        <button
                            onClick={() => setCurrentStep(curr => curr + 1)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                        >
                            Suivant <ArrowRight size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={handleCreate}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                        >
                            Créer l'année {formData.name} <CheckCircle size={16} />
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {!isCreating ? (
                // Dashboard View
                <>
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-white">Gestion des Années</h3>
                        <button
                            onClick={() => setIsCreating(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                        >
                            <Plus size={18} /> Nouvelle Année
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {years.map((year) => (
                            <div key={year.id} className={`p-6 rounded-xl border backdrop-blur-sm relative group overflow-hidden ${year.status === 'ACTIVE'
                                ? 'bg-emerald-500/10 border-emerald-500/50'
                                : 'bg-white/5 border-white/10 hover:border-white/20'
                                }`}>
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-2xl font-bold text-white">{year.name}</span>
                                    {year.status === 'ACTIVE' && (
                                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded uppercase">
                                            En Cours
                                        </span>
                                    )}
                                    {year.status === 'DRAFT' && (
                                        <span className="px-2 py-1 bg-slate-500/20 text-slate-400 text-xs font-bold rounded uppercase">
                                            Brouillon
                                        </span>
                                    )}
                                    {year.status === 'CLOSED' && (
                                        <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded uppercase">
                                            Clôturée
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                        <Calendar size={14} />
                                        <span>{new Date(year.startDate).toLocaleDateString()} - {new Date(year.endDate).toLocaleDateString()}</span>
                                    </div>
                                    {year.autoClosureEnabled && (
                                        <div className="flex items-center gap-2 text-xs text-indigo-400">
                                            <RefreshCw size={12} />
                                            <span>Clôture auto: {new Date(year.autoClosureDate).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    {year.status === 'DRAFT' && (
                                        <button className="flex-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 py-2 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2">
                                            <Play size={14} /> Activer
                                        </button>
                                    )}
                                    {year.status === 'ACTIVE' && (
                                        <button className="flex-1 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 py-2 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2">
                                            <Lock size={14} /> Clôturer
                                        </button>
                                    )}
                                    <button className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors">
                                        Configurer
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                renderWizard()
            )}
        </div>
    );
};

export default AcademicYearManager;
