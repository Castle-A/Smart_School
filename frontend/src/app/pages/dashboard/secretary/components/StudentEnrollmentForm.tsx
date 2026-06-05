import React, { useState, useEffect } from 'react';
import { UserPlus, X, Check, AlertCircle } from 'lucide-react';
import api from '../../../../../shared/api/api';

interface StudentEnrollmentFormProps {
    isOpen: boolean;
    onClose: () => void;
    scope?: string; // PRIMARY_PRESCHOOL, COLLEGE, or undefined (ALL)
}

const StudentEnrollmentForm: React.FC<StudentEnrollmentFormProps> = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [classes, setClasses] = useState<any[]>([]);
    const [feeCategories, setFeeCategories] = useState<{ id: string, name: string }[]>([]);

    // Form Data
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        gender: 'HOMME',
        matricule: '',

        // Parent Info
        parentName: '',
        parentPhone: '',
        countryCode: '+229',
        address: '',
        categoryId: '', // New field for fee profile

        // Academic
        cycle: '',
        classId: '',
        previousSchool: '',

        // Payment
        paymentOption: 'NONE', // NONE, REGISTRATION_ONLY, PARTIAL, FULL
        customTuitionAmount: 0,
        paymentMethod: 'CASH',
    });

    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                try {
                    const [classesRes, configRes] = await Promise.all([
                        api.get('/classes'),
                        api.get('/finance/config') // Assume this endpoint returns { categories: [] }
                    ]);

                    if (Array.isArray(classesRes.data)) {
                        setClasses(classesRes.data);
                    }
                    if (configRes.data && Array.isArray(configRes.data.categories)) {
                        const cats = configRes.data.categories;
                        setFeeCategories(cats);
                        // Auto-select 'Nouveaux' if exists as default
                        const defaultCat = cats.find((c: any) => c.name.toLowerCase().includes('nouveau')) || cats[0];
                        if (defaultCat) setFormData(prev => ({ ...prev, categoryId: defaultCat.id }));
                    }
                } catch (e) {
                    console.error("Failed to fetch data", e);
                }
            };
            fetchData();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const selectedClass = classes.find(c => c.id === formData.classId);
    // Use defaults if class doesn't have fee set
    const registrationFee = selectedClass?.registrationFee || 0;
    const tuitionFee = selectedClass?.tuitionFee || 0;

    const calculateTotal = () => {
        if (formData.paymentOption === 'NONE') return 0;

        // Base is registration fee
        let total = registrationFee;

        if (formData.paymentOption === 'PARTIAL') {
            total += Number(formData.customTuitionAmount);
        } else if (formData.paymentOption === 'FULL') {
            total += tuitionFee;
        }

        return total;
    };

    const remainingTuition = () => {
        if (formData.paymentOption === 'FULL') return 0;
        if (formData.paymentOption === 'PARTIAL') return Math.max(0, tuitionFee - Number(formData.customTuitionAmount));
        return tuitionFee;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Prepare Payment Data
            let paymentData = undefined;
            if (formData.paymentOption !== 'NONE') {
                const totalPaid = calculateTotal();
                if (totalPaid > 0) {
                    const regAmount = registrationFee;
                    let tuiAmount = 0;

                    if (formData.paymentOption === 'PARTIAL') tuiAmount = Number(formData.customTuitionAmount);
                    if (formData.paymentOption === 'FULL') tuiAmount = tuitionFee;

                    paymentData = {
                        registrationAmount: regAmount,
                        tuitionAmount: tuiAmount,
                        method: formData.paymentMethod
                    };
                }
            }

            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                matricule: formData.matricule,
                dob: new Date(formData.dob).toISOString(),
                gender: formData.gender,
                parentName: formData.parentName,
                parentPhone: `${formData.countryCode} ${formData.parentPhone}`,
                address: formData.address,
                classId: formData.classId || undefined,
                previousSchool: formData.previousSchool,
                categoryId: formData.categoryId,
                payment: paymentData
            };

            await api.post('/students', payload);
            onClose();
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.message;
            setError(Array.isArray(msg) ? msg.join(', ') : (msg || "Erreur lors de l'inscription"));
        } finally {
            setLoading(false);
        }
    };

    // Filter classes helper (simplified)
    const availableClasses = classes; // Can verify scope filtering if needed

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col">
                {/* Header */}
                <div className="bg-[#0f172a] p-6 border-b border-white/10 flex justify-between items-center sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                            <UserPlus className="text-indigo-400" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Nouvelle Inscription</h2>
                            <p className="text-sm text-gray-400">Remplissez les informations de l'élève</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8 flex-1 overflow-y-auto">
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-400">
                            <AlertCircle size={20} className="mt-0.5 shrink-0" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {/* 1. Identité */}
                    <div className="space-y-4">
                        <h3 className="text-white font-semibold flex items-center gap-2 border-b border-white/10 pb-2">
                            <span className="bg-indigo-500/20 text-indigo-400 text-xs px-2 py-0.5 rounded-full border border-indigo-500/30">1</span> Identité de l'Élève
                        </h3>

                        <div className="mb-4">
                            <label className="block text-xs font-medium text-gray-400 mb-2">Profil Tarifaire <span className="text-red-400">*</span></label>
                            <div className="flex flex-wrap gap-4">
                                {feeCategories.length > 0 ? feeCategories.map(cat => (
                                    <label key={cat.id} className={`flex items-center gap-2 px-4 py-3 rounded-xl border2 cursor-pointer transition-all ${formData.categoryId === cat.id ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-black/20 border-white/10 text-gray-400 hover:bg-white/5'}`}>
                                        <input
                                            type="radio"
                                            name="categoryId"
                                            checked={formData.categoryId === cat.id}
                                            onChange={() => setFormData({ ...formData, categoryId: cat.id })}
                                            className="hidden" // Hiding default radio for custom UI
                                        />
                                        <span className="font-bold">{cat.name}</span>
                                        {formData.categoryId === cat.id && <Check size={16} />}
                                    </label>
                                )) : (
                                    <p className="text-red-400 text-xs italic">Aucune catégorie de frais configurée. Veuillez contacter le comptable.</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Nom <span className="text-red-400">*</span></label>
                                <input required type="text" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-indigo-500 outline-none" placeholder="Ex: KOSSI" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Prénoms <span className="text-red-400">*</span></label>
                                <input required type="text" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-indigo-500 outline-none" placeholder="Ex: Jean" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Matricule <span className="text-red-400">*</span></label>
                                <input required type="text" value={formData.matricule} onChange={e => setFormData({ ...formData, matricule: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-indigo-500 outline-none font-mono" placeholder="Ex: M2025001" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Date Naissance <span className="text-red-400">*</span></label>
                                    <input required type="date" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-indigo-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Genre <span className="text-red-400">*</span></label>
                                    <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-indigo-500 outline-none">
                                        <option value="HOMME">Masculin</option>
                                        <option value="FEMME">Féminin</option>
                                    </select>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-400 mb-1">École de Provenance</label>
                                <input type="text" value={formData.previousSchool} onChange={e => setFormData({ ...formData, previousSchool: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-indigo-500 outline-none" placeholder="Ex: Complexe Scolaire ..." />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-400 mb-1">Adresse (Quartier/Ville)</label>
                                <input type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-indigo-500 outline-none" placeholder="Ex: Cadjèhoun, Cotonou" />
                            </div>
                        </div>
                    </div>

                    {/* 2. Scolarité */}
                    <div className="space-y-4">
                        <h3 className="text-white font-semibold flex items-center gap-2 border-b border-white/10 pb-2">
                            <span className="bg-indigo-500/20 text-indigo-400 text-xs px-2 py-0.5 rounded-full border border-indigo-500/30">2</span> Affectation
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-400 mb-1">Classe d'Affectation <span className="text-red-400">*</span></label>
                                <select required value={formData.classId} onChange={e => setFormData({ ...formData, classId: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-indigo-500 outline-none">
                                    <option value="">-- Choisir une classe --</option>
                                    {availableClasses.map(c => (
                                        <option key={c.id} value={c.id}>{c.name} (Cycles: {c.cycle || 'N/A'})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 3. Paiement */}
                    {formData.classId && (
                        <div className="space-y-4">
                            <h3 className="text-white font-semibold flex items-center gap-2 border-b border-white/10 pb-2">
                                <span className="bg-indigo-500/20 text-indigo-400 text-xs px-2 py-0.5 rounded-full border border-indigo-500/30">3</span> Paiement
                            </h3>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                    <div className="flex justify-between p-2 bg-black/20 rounded">
                                        <span className="text-gray-400">Frais d'Inscription:</span>
                                        <span className="text-white font-medium">{registrationFee.toLocaleString()} FCFA</span>
                                    </div>
                                    <div className="flex justify-between p-2 bg-black/20 rounded">
                                        <span className="text-gray-400">Scolarité Totale:</span>
                                        <span className="text-white font-medium">{tuitionFee.toLocaleString()} FCFA</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 p-3 bg-black/20 border border-white/5 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                                        <input type="radio" name="payment" value="REGISTRATION_ONLY" checked={formData.paymentOption === 'REGISTRATION_ONLY'} onChange={e => setFormData({ ...formData, paymentOption: e.target.value })} className="accent-indigo-500" />
                                        <div>
                                            <div className="text-white font-medium">Inscription Simple</div>
                                            <div className="text-xs text-gray-400">Payer uniquement les frais d'inscription ({registrationFee.toLocaleString()} FCFA)</div>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 p-3 bg-black/20 border border-white/5 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                                        <input type="radio" name="payment" value="PARTIAL" checked={formData.paymentOption === 'PARTIAL'} onChange={e => setFormData({ ...formData, paymentOption: e.target.value })} className="accent-indigo-500" />
                                        <div className="flex-1">
                                            <div className="text-white font-medium">Inscription + Acompte Scolarité</div>
                                            <div className="text-xs text-gray-400">Verser une partie de la scolarité maintenant</div>
                                        </div>
                                        {formData.paymentOption === 'PARTIAL' && (
                                            <input
                                                type="number"
                                                value={formData.customTuitionAmount}
                                                onChange={e => setFormData({ ...formData, customTuitionAmount: Number(e.target.value) })}
                                                className="w-32 bg-black/40 border border-white/20 rounded px-2 py-1 text-white text-right"
                                                min="0"
                                                placeholder="Montant"
                                                onClick={e => e.stopPropagation()}
                                            />
                                        )}
                                    </label>

                                    <label className="flex items-center gap-3 p-3 bg-black/20 border border-white/5 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                                        <input type="radio" name="payment" value="FULL" checked={formData.paymentOption === 'FULL'} onChange={e => setFormData({ ...formData, paymentOption: e.target.value })} className="accent-indigo-500" />
                                        <div>
                                            <div className="text-white font-medium">Inscription + Scolarité Intégrale</div>
                                            <div className="text-xs text-gray-400">Tout régler maintenant ({(registrationFee + tuitionFee).toLocaleString()} FCFA)</div>
                                        </div>
                                    </label>
                                </div>

                                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center bg-indigo-500/10 p-4 rounded-lg">
                                    <span className="text-gray-300">Net à Payer:</span>
                                    <span className="text-xl font-bold text-indigo-400">{calculateTotal().toLocaleString()} FCFA</span>
                                </div>
                                {formData.paymentOption === 'PARTIAL' && (
                                    <div className="text-right text-xs text-yellow-400 mt-2">
                                        Reste à payer sur scolarité : {remainingTuition().toLocaleString()} FCFA
                                    </div>
                                )}
                            </div>
                        </div>
                    )}


                    {/* 4. Parents */}
                    <div className="space-y-4">
                        <h3 className="text-white font-semibold flex items-center gap-2 border-b border-white/10 pb-2">
                            <span className="bg-indigo-500/20 text-indigo-400 text-xs px-2 py-0.5 rounded-full border border-indigo-500/30">4</span> Responsable / Tuteur
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Nom complet du Parent <span className="text-red-400">*</span></label>
                                <input required type="text" value={formData.parentName} onChange={e => setFormData({ ...formData, parentName: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-indigo-500 outline-none" placeholder="Ex: M. KOSSI Pierre" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Téléphone <span className="text-red-400">*</span></label>
                                <div className="flex gap-2 relative">
                                    <input
                                        required
                                        type="tel"
                                        value={formData.parentPhone}
                                        onChange={e => setFormData({ ...formData, parentPhone: e.target.value })}
                                        className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-indigo-500 outline-none"
                                        placeholder="0197000000"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 5. Documents (Checklist) */}
                    <div className="space-y-4">
                        <h3 className="text-white font-semibold flex items-center gap-2 border-b border-white/10 pb-2">
                            <span className="bg-indigo-500/20 text-indigo-400 text-xs px-2 py-0.5 rounded-full border border-indigo-500/30">5</span> Documents Fournis
                        </h3>
                        <div className="grid grid-cols-1 gap-2 bg-black/10 p-4 rounded-lg">
                            {['Acte de Naissance', 'Photos d\'identité (x2)', 'Dossier Scolaire Précédent', 'Certificat de Nationalité'].map((doc) => (
                                <label key={doc} className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-500 bg-gray-700 text-indigo-500 focus:ring-indigo-500" />
                                    <span className="text-sm text-gray-300">{doc}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10 sticky bottom-0 bg-[#1e293b] pb-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Traitement...' : (
                                <>
                                    <Check size={18} />
                                    Créer l'inscription
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentEnrollmentForm;

