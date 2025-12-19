import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, X, Layers, BookOpen, Users, UserCheck, AlertCircle } from 'lucide-react';
import api from '../../../../../../shared/api/api';

// Steps with Named Imports
import { Step1Identity } from './Step1Identity';
import { Step2Subjects } from './Step2Subjects';
import { Step3Teachers } from './Step3Teachers';
import { Step4MainTeacher } from './Step4MainTeacher';
import { Step5Review } from './Step5Review';

// Types with Type-only import
import type { WizardData } from './types';

interface ClassBuilderWizardProps {
    onCancel: () => void;
    onSuccess: () => void;
    classes: any[];
}

const ClassBuilderWizard = ({ onCancel, onSuccess, classes }: ClassBuilderWizardProps) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [data, setData] = useState<WizardData>({
        identity: {
            cycle: 'PREMIER_CYCLE',
            level: '',
            series: '',
            name: '',
            room: ''
        },
        subjects: [],
        mainTeacherId: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const steps = [
        { id: 1, label: 'Identité', icon: Layers },
        { id: 2, label: 'Matières & Coeffs', icon: BookOpen },
        { id: 3, label: 'Professeurs', icon: Users },
        { id: 4, label: 'Prof. Principal', icon: UserCheck },
        { id: 5, label: 'Validation', icon: Check },
    ];

    const handleNext = () => {
        // Basic validation per step
        if (currentStep === 1) {
            if (!data.identity.level || !data.identity.name) return;
        }
        if (currentStep === 4) {
            if (!data.mainTeacherId) {
                setError("Veuillez sélectionner un Professeur Principal.");
                return;
            }
        }
        setError(null);
        setCurrentStep(prev => Math.min(prev + 1, 5));
    };

    const handlePrev = () => {
        setError(null);
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async () => {
        if (!confirm('Confirmer la création de la classe ?')) return;
        setLoading(true);
        setError(null);

        try {
            // Prepare payload
            const payload = {
                classId: data.classId, // Add classId for assembly mode
                ...data.identity,
                subjects: data.subjects.filter(s => s.isEnabled).map(s => ({
                    subjectId: s.id,
                    coefficient: s.coefficient,
                    teacherId: s.teacherId
                })),
                mainTeacherId: data.mainTeacherId
            };

            await api.post('/classes/builder', payload);
            onSuccess();
        } catch (err: any) {
            console.error('Builder error:', err);
            setError(err.response?.data?.message || "Erreur lors de la création.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#1e293b] border border-white/10 rounded-2xl shadow-xl overflow-hidden flex flex-col h-full min-h-[600px]">
            {/* Header */}
            <div className="bg-black/20 p-6 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="bg-indigo-500/20 text-indigo-400 p-2 rounded-lg">
                        <Layers size={20} />
                    </span>
                    Assistant de Création de Classe
                </h2>
                <button onClick={onCancel} className="text-gray-400 hover:text-white transition-colors">
                    <X size={24} />
                </button>
            </div>

            {/* Stepper */}
            <div className="bg-black/10 px-6 py-4 border-b border-white/5 overflow-x-auto">
                <div className="flex items-center justify-between min-w-max gap-4">
                    {steps.map((step, idx) => (
                        <div key={step.id} className="flex items-center gap-3">
                            <div className={`flex items-center gap-2 ${currentStep === step.id ? 'text-indigo-400' : currentStep > step.id ? 'text-emerald-400' : 'text-gray-500'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold transition-all ${currentStep === step.id ? 'border-indigo-500 bg-indigo-500/10' :
                                    currentStep > step.id ? 'border-emerald-500 bg-emerald-500/10' :
                                        'border-gray-600 bg-transparent'
                                    }`}>
                                    {currentStep > step.id ? <Check size={16} /> : step.id}
                                </div>
                                <span className="font-medium text-sm">{step.label}</span>
                            </div>
                            {idx < steps.length - 1 && (
                                <div className={`h-0.5 w-12 ${currentStep > step.id ? 'bg-emerald-500/50' : 'bg-gray-700'}`}></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 overflow-y-auto bg-[#1a1f37]/50">
                {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 animate-fade-in">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                {currentStep === 1 && <Step1Identity data={data} updateData={setData} availableClasses={classes} />}
                {currentStep === 2 && <Step2Subjects data={data} updateData={setData} />}
                {currentStep === 3 && <Step3Teachers data={data} updateData={setData} />}
                {currentStep === 4 && <Step4MainTeacher data={data} updateData={setData} />}
                {currentStep === 5 && <Step5Review data={data} />}
            </div>

            {/* Footer Navigation */}
            <div className="bg-black/20 p-6 border-t border-white/10 flex justify-between items-center">
                <button
                    onClick={handlePrev}
                    disabled={currentStep === 1 || loading}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-colors ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <ChevronLeft size={18} /> Précédent
                </button>

                {currentStep < 5 ? (
                    <button
                        onClick={handleNext}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform active:scale-95"
                    >
                        Suivant <ChevronRight size={18} />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform active:scale-95 font-bold"
                    >
                        {loading ? 'Création...' : 'Créer la Classe'} <Check size={18} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default ClassBuilderWizard;
