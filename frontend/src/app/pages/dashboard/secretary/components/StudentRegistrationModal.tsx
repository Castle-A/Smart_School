import { useState, useEffect } from 'react';
import { X, Save, User, Users, Hash } from 'lucide-react';
import api from '../../../../../shared/api/api';
import { toastEvents } from '../../../../../shared/utils/toast-events';

interface StudentRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    scope?: string;
}

const StudentRegistrationModal = ({ isOpen, onClose, scope }: StudentRegistrationModalProps) => {
    const [formData, setFormData] = useState({
        matricule: '',
        firstName: '',
        lastName: '',
        dob: '',
        gender: 'M',
        classId: '',
        address: '',
        parentName: '',
        parentPhone: ''
    });
    const [classes, setClasses] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingClasses, setIsLoadingClasses] = useState(false);

    const isPrimary = scope === 'PRIMARY_PRESCHOOL';
    const isCollege = scope === 'COLLEGE';

    useEffect(() => {
        if (isOpen) {
            fetchClasses();
        }
    }, [isOpen]);

    const fetchClasses = async () => {
        setIsLoadingClasses(true);
        try {
            const response = await api.get('/classes');
            if (response.data) {
                setClasses(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch classes", error);
        } finally {
            setIsLoadingClasses(false);
        }
    };

    const getFilteredClasses = () => {
        if (!classes.length) return [];
        return classes.filter(cls => {
            if (!scope || scope === 'BOTH') return true;
            if (isPrimary) return ['MATERNELLE_I', 'MATERNELLE_II', 'PRIMAIRE'].includes(cls.cycle) || cls.cycle === 'PRIMAIRE';
            if (isCollege) return ['COLLEGE', 'LYCEE'].includes(cls.cycle);
            return true;
        });
    };

    const filteredClasses = getFilteredClasses();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.matricule || !formData.firstName || !formData.lastName || !formData.dob || !formData.classId || !formData.parentName || !formData.parentPhone) {
            toastEvents.warning("Veuillez remplir tous les champs obligatoires.");
            return;
        }

        setIsSubmitting(true);
        try {
            const genderMap: Record<string, string> = {
                'M': 'HOMME',
                'F': 'FEMME',
                'DIVERS': 'DIVERS'
            };

            const payload = {
                ...formData,
                gender: genderMap[formData.gender] || 'HOMME',
            };

            await api.post('/students', payload);

            toastEvents.success('Élève enregistré avec succès !');
            setFormData({
                matricule: '',
                firstName: '',
                lastName: '',
                dob: '',
                gender: 'M',
                classId: '',
                address: '',
                parentName: '',
                parentPhone: ''
            });
            onClose();
        } catch (error: any) {
            toastEvents.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1e293b] w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div>
                        <h2 className="text-xl font-bold text-white">Nouvelle Inscription</h2>
                        <p className="text-sm text-gray-400">
                            {isPrimary ? 'Section Maternelle / Primaire' : isCollege ? 'Section Collège / Lycée' : 'Fiche Élève'}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <form id="registration-form" onSubmit={handleSubmit} className="space-y-6">

                        {/* Identité Scolaire (Crucial) */}
                        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4">
                            <h3 className="text-indigo-300 font-semibold mb-4 flex items-center gap-2">
                                <Hash size={18} /> Identifiant Unique
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Matricule <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Ex: 23-A0123"
                                        value={formData.matricule}
                                        onChange={(e) => setFormData({ ...formData, matricule: e.target.value })}
                                        className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Obligatoire pour le dossier</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Classe / Niveau <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        required
                                        className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                        value={formData.classId}
                                        onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                                        disabled={isLoadingClasses}
                                    >
                                        <option value="">Sélectionner...</option>
                                        {isLoadingClasses ? (
                                            <option disabled>Chargement...</option>
                                        ) : (
                                            filteredClasses.map((cls) => (
                                                <option key={cls.id} value={cls.id}>
                                                    {cls.name}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Identité Élève */}
                        <div>
                            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                <User size={18} /> Informations Personnelles
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Nom</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Prénoms</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Date de Naissance</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.dob}
                                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Genre</label>
                                    <div className="flex gap-4 mt-2">
                                        <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="M"
                                                checked={formData.gender === 'M'}
                                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                                className="text-indigo-500 focus:ring-indigo-500"
                                            />
                                            Masculin
                                        </label>
                                        <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="F"
                                                checked={formData.gender === 'F'}
                                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                                className="text-indigo-500 focus:ring-indigo-500"
                                            />
                                            Féminin
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Parents */}
                        <div>
                            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                <Users size={18} /> Responsable Légal
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Nom & Prénoms Parent</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.parentName}
                                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Téléphone</label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="+225 ..."
                                        value={formData.parentPhone}
                                        onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                        disabled={isSubmitting}
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        form="registration-form"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Enregistrement...' : (
                            <>
                                <Save size={18} />
                                Valider l'inscription
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentRegistrationModal;
