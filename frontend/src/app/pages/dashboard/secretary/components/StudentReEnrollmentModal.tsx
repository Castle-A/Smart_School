import React, { useState, useEffect } from 'react';
import { Search, UserCheck, Check, X } from 'lucide-react';
import api from '../../../../../shared/api/api';

interface StudentReEnrollmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    scope?: string;
}

const StudentReEnrollmentModal: React.FC<StudentReEnrollmentModalProps> = ({ isOpen, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [classes, setClasses] = useState<any[]>([]);
    const [feeCategories, setFeeCategories] = useState<any[]>([]);
    const [error, setError] = useState('');

    // Pre-load data
    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                try {
                    const [classesRes, configRes] = await Promise.all([
                        api.get('/classes'),
                        api.get('/finance/config')
                    ]);
                    setClasses(classesRes.data || []);
                    if (configRes.data?.categories) {
                        setFeeCategories(configRes.data.categories);
                    }
                } catch (e) {
                    console.error(e);
                }
            };
            fetchData();
        }
    }, [isOpen]);

    // Search Logic
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery) return;
        setLoading(true);
        try {
            // Use existing global search, assuming it searches matricule
            const res = await api.get(`/students/search?search=${searchQuery}`);
            setSearchResults(res.data.items || res.data); // Handle pagination or array
            setSelectedStudent(null);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // Form State (for selected student)
    const [form, setForm] = useState({
        classId: '',
        categoryId: '',
        paymentOption: 'NONE', // NONE, REGISTRATION, FULL
        customAmount: 0,
        paymentMethod: 'CASH'
    });

    const handleSelectStudent = (student: any) => {
        setSelectedStudent(student);
        // Pre-fill
        const ancienCat = feeCategories.find(c => c.name.toLowerCase().includes('ancien')) || feeCategories[0];
        setForm({
            classId: student.class?.id || '', // Keep current if exists
            categoryId: student.categoryId || ancienCat?.id || '',
            paymentOption: 'NONE',
            customAmount: 0,
            paymentMethod: 'CASH'
        });
    };

    const handleSubmit = async () => {
        if (!selectedStudent) return;
        setSubmitting(true);
        setError('');

        try {
            // Build payload
            let paymentData = undefined;
            // Logic simplified: If REGISTRATION_ONLY, user pays registration fee of new class
            // If FULL, checks fees. For now, manual input is safest or pre-calc from class.
            // Let's implement simple mode first.

            // Get selected class fees to enable automated amount setting?
            // For now, let's trust the user or backend validation.
            // Simplified UI: User enters amount manually or simple selects.

            // NOTE: Ideally we fetch fee config for Class+Category to show exact amount.
            // Doing it simple: User confirms amounts.

            const selectedClass = classes.find(c => c.id === form.classId);
            const regFee = selectedClass?.registrationFee || 0;
            const tuiFee = selectedClass?.tuitionFee || 0;

            if (form.paymentOption !== 'NONE') {
                paymentData = {
                    registrationAmount: form.paymentOption === 'REGISTRATION_ONLY' ? regFee : regFee,
                    tuitionAmount: form.paymentOption === 'FULL' ? tuiFee : 0,
                    method: form.paymentMethod
                };
            }

            await api.post(`/students/${selectedStudent.id}/re-enroll`, {
                classId: form.classId,
                categoryId: form.categoryId,
                payment: paymentData
            });

            onClose();
        } catch (e: any) {
            setError(e.response?.data?.message || 'Erreur réinscription');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0f172a]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                            <UserCheck size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Réinscription</h2>
                            <p className="text-sm text-gray-400">Rechercher un élève existant (Educmaster)</p>
                        </div>
                    </div>
                    <button onClick={onClose}><X className="text-gray-400 hover:text-white" /></button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                    {/* 1. Search */}
                    {!selectedStudent && (
                        <div className="space-y-4">
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Rechercher par Nom ou Matricule..."
                                    className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-indigo-500 outline-none"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                                <button type="submit" disabled={loading} className="px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium">
                                    {loading ? '...' : <Search />}
                                </button>
                            </form>

                            <div className="space-y-2">
                                {searchResults.map(student => (
                                    <div key={student.id} onClick={() => handleSelectStudent(student)} className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg cursor-pointer flex justify-between items-center group">
                                        <div>
                                            <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors">{student.firstName} {student.lastName}</h4>
                                            <p className="text-sm text-gray-400 font-mono">{student.matricule}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">{student.class?.name || 'Sans Classe'}</span>
                                        </div>
                                    </div>
                                ))}
                                {searchResults.length === 0 && searchQuery && !loading && (
                                    <p className="text-center text-gray-500 py-4">Aucun résultat.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 2. Re-Enroll Form */}
                    {selectedStudent && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <h3 className="text-emerald-400 font-bold text-lg">{selectedStudent.firstName} {selectedStudent.lastName}</h3>
                                    <p className="text-emerald-500/70 text-sm font-mono">{selectedStudent.matricule}</p>
                                </div>
                                <button onClick={() => setSelectedStudent(null)} className="text-xs text-emerald-400 hover:underline">Changer</button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Classe de Rentrée <span className="text-red-400">*</span></label>
                                    <select
                                        value={form.classId}
                                        onChange={e => setForm({ ...form, classId: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-indigo-500 outline-none"
                                    >
                                        <option value="">Sélectionner...</option>
                                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Profil Tarifaire</label>
                                    <select
                                        value={form.categoryId}
                                        onChange={e => setForm({ ...form, categoryId: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-indigo-500 outline-none"
                                    >
                                        {feeCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-4">
                                <h4 className="text-white font-semibold mb-3">Paiement Immédiat</h4>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 p-3 bg-black/20 rounded-lg cursor-pointer">
                                        <input type="radio" name="reEnrollPay" checked={form.paymentOption === 'NONE'} onChange={() => setForm({ ...form, paymentOption: 'NONE' })} className="accent-indigo-500" />
                                        <span className="text-gray-300">Pas de paiement maintenant</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 bg-black/20 rounded-lg cursor-pointer">
                                        <input type="radio" name="reEnrollPay" checked={form.paymentOption === 'REGISTRATION_ONLY'} onChange={() => setForm({ ...form, paymentOption: 'REGISTRATION_ONLY' })} className="accent-indigo-500" />
                                        <span className="text-gray-300">Frais d'Inscription Uniquement</span>
                                    </label>
                                </div>
                            </div>

                            {error && <p className="text-red-400 text-sm bg-red-500/10 p-2 rounded">{error}</p>}

                            <button
                                onClick={handleSubmit}
                                disabled={submitting || !form.classId}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex justify-center items-center gap-2"
                            >
                                {submitting ? 'Traitement...' : <><Check size={20} /> Valider la Réinscription</>}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentReEnrollmentModal;
