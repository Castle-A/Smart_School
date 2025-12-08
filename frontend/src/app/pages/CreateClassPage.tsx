import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, School, Users, Check, AlertCircle } from 'lucide-react';
import api from '../../shared/api/api';
import { useAuth } from '../../shared/contexts/AuthContext';

interface Teacher {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    matricule: string;
    role: string;
}

const CYCLES = [
    { value: 'MATERNELLE', label: 'Maternelle' },
    { value: 'PRIMAIRE', label: 'Primaire' },
    { value: 'PREMIER_CYCLE', label: 'Premier Cycle (Collège)' },
    { value: 'SECOND_CYCLE', label: 'Second Cycle (Lycée)' },
];

const LEVELS = {
    MATERNELLE: ['Maternelle I', 'Maternelle II'],
    PRIMAIRE: ['CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2'],
    PREMIER_CYCLE: ['6ème', '5ème', '4ème', '3ème'],
    SECOND_CYCLE: ['2nde', '1ère', 'Terminale'],
};

const SERIES = {
    PREMIER_CYCLE: ['A', 'B', 'C', 'D', 'E', 'F'],
    SECOND_CYCLE: ['A1', 'A2', 'B1', 'B2', 'C', 'D', 'G1', 'G2', 'G3'],
};

const CreateClassPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        cycle: '',
        level: '',
        series: '',
        room: '',
        mainTeacherId: '',
        capacity: 0,
    });

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await api.get('/teachers');
                setTeachers(response.data);
            } catch (err) {
                console.error('Error fetching teachers:', err);
            }
        };
        fetchTeachers();
    }, []);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => {
            const updates: any = { [field]: value };

            // Reset dependent fields
            if (field === 'cycle') {
                updates.level = '';
                updates.series = '';
            }
            if (field === 'level') {
                // Reset series if level changes (though series usually depends on cycle, 
                // but strictly speaking series is for specific levels in some systems, 
                // here we follow the prompt: 6eme-3eme have series, 2nde-Tle have series)
                updates.series = '';
            }

            return { ...prev, ...updates };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Construct class name
            let name = formData.level;
            if (formData.series) {
                name += ` ${formData.series}`;
            } else if (formData.cycle === 'MATERNELLE' || formData.cycle === 'PRIMAIRE') {
                // For primary/kindergarten, maybe append A, B, C if multiple classes of same level?
                // For now, let's just use the level name or ask for a suffix?
                // The prompt says "6ème A", "3ème B". So we probably need a suffix/series even for primary if there are multiple.
                // But the prompt specifically mentioned series A-F for college and A1-G3 for lycee.
                // For primary/kindergarten, usually it's A, B, C. 
                // Let's add a "Suffixe/Groupe" field for all cycles if series is not applicable?
                // Or just assume the "Series" field can be used as "Groupe" for primary.
                // Let's stick to the prompt: "Series" for college/lycee. 
                // For others, maybe we need a simple letter input?
                // The prompt didn't explicitly ask for primary series, but "6ème A" implies a letter.
                // Let's add a generic "Nom/Suffixe" input if series is not selected?
                // Actually, let's just use the Series dropdown for College/Lycee and a text input for others if needed?
                // Re-reading: "dans serie on aura A B C D E F pour les classe de 6eme en 3eme..."
                // It doesn't mention primary series. I'll add a simple text input for "Nom de la classe (ex: A, B)" if no series logic applies.
            }

            // Actually, let's auto-generate name based on inputs
            // If series is present, append it.
            // If not, maybe we should allow a custom suffix? 
            // Let's add a "Suffixe" field for Primary/Maternelle to allow "CP A", "CP B".

            const payload: any = {
                ...formData,
                name: `${formData.level} ${formData.series || ''}`.trim(),
            };

            if (!payload.mainTeacherId) {
                delete payload.mainTeacherId;
            }

            await api.post('/classes', payload);
            // Retour au dashboard section Administration après création de la classe
            navigate('/app/dashboard', {
                state: {
                    section: 'administration',
                    view: 'classes'
                }
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    const showSeries = formData.cycle === 'PREMIER_CYCLE' || formData.cycle === 'SECOND_CYCLE';
    const availableSeries = formData.cycle === 'PREMIER_CYCLE' ? SERIES.PREMIER_CYCLE : SERIES.SECOND_CYCLE;

    return (
        <div className="min-h-screen bg-[#0f172a] p-6">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Retour au tableau de bord
                </button>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-indigo-500/20 rounded-xl">
                            <School className="w-8 h-8 text-indigo-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Créer une Nouvelle Classe</h1>
                            <p className="text-gray-400">Configuration de la classe et affectation</p>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                            <AlertCircle size={20} />
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Cycle & Niveau */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Cycle <span className="text-red-500">*</span></label>
                                <select
                                    value={formData.cycle}
                                    onChange={(e) => handleChange('cycle', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 [&>option]:bg-slate-800"
                                    required
                                >

                                    <option value="">Sélectionner un cycle</option>
                                    {CYCLES.filter(c => {
                                        if (user?.role !== 'DIRECTOR') return true;
                                        if (!user.directorType) return true;

                                        if (user.directorType === 'PRIMARY_PRESCHOOL') {
                                            return ['MATERNELLE', 'PRIMAIRE'].includes(c.value);
                                        }
                                        if (user.directorType === 'COLLEGE') {
                                            return ['PREMIER_CYCLE', 'SECOND_CYCLE'].includes(c.value);
                                        }
                                        if (user.directorType === 'BOTH') {
                                            return true; // All cycles allowed
                                        }
                                        return true;
                                    }).map(c => (
                                        <option key={c.value} value={c.value}>{c.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Niveau <span className="text-red-500">*</span></label>
                                <select
                                    value={formData.level}
                                    onChange={(e) => handleChange('level', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 [&>option]:bg-slate-800"
                                    required
                                    disabled={!formData.cycle}
                                >
                                    <option value="">Sélectionner un niveau</option>
                                    {formData.cycle && LEVELS[formData.cycle as keyof typeof LEVELS].map(l => (
                                        <option key={l} value={l}>{l}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Série & Salle */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {showSeries ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Série <span className="text-red-500">*</span></label>
                                    <select
                                        value={formData.series}
                                        onChange={(e) => handleChange('series', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 [&>option]:bg-slate-800"
                                        required
                                    >

                                        <option value="">Sélectionner une série</option>
                                        {availableSeries?.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Suffixe (Optionnel)</label>
                                    <input
                                        type="text"
                                        value={formData.series}
                                        onChange={(e) => handleChange('series', e.target.value)}
                                        placeholder="Ex: A, B, Rouge..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 placeholder-gray-500"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Salle de classe</label>
                                <input
                                    type="text"
                                    value={formData.room}
                                    onChange={(e) => handleChange('room', e.target.value)}
                                    placeholder="Ex: Salle 101, Bâtiment A"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 placeholder-gray-500"
                                />
                            </div>
                        </div>

                        {/* Professeur Principal */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                {['MATERNELLE', 'PRIMAIRE'].includes(formData.cycle) ? 'Maître / Maîtresse' : 'Professeur Principal'}
                            </label>
                            <div className="relative">
                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <select
                                    value={formData.mainTeacherId}
                                    onChange={(e) => handleChange('mainTeacherId', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 [&>option]:bg-slate-800"
                                >
                                    <option value="">
                                        {['MATERNELLE', 'PRIMAIRE'].includes(formData.cycle)
                                            ? "Sélectionner un maître / une maîtresse"
                                            : "Sélectionner un professeur principal"}
                                    </option>
                                    {teachers
                                        .filter(t => {
                                            if (!formData.cycle) return true;
                                            if (['MATERNELLE', 'PRIMAIRE'].includes(formData.cycle)) {
                                                return t.role === 'MAITRE';
                                            }
                                            if (['PREMIER_CYCLE', 'SECOND_CYCLE'].includes(formData.cycle)) {
                                                return t.role === 'TEACHER';
                                            }
                                            return true;
                                        })
                                        .map(t => (
                                            <option key={t.id} value={t.userId}>
                                                {t.firstName} {t.lastName}{t.matricule ? ` (${t.matricule})` : ''}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-4 rounded-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Check size={20} />
                                        Créer la Classe
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateClassPage;
