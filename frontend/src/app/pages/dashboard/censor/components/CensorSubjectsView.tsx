import { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Edit2, Search, Download, Layers, Filter, Check } from 'lucide-react';
import api from '../../../../../shared/api/api';
import { BENIN_SUBJECTS_LIST } from '../../../../../shared/constants/benin-subjects.constants';
import ImportSubjectsModal from './ImportSubjectsModal';

interface Subject {
    id: string;
    name: string;
    coefficient: number;
    cycle: string;
}

const CensorSubjectsView = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState<string[]>([]);

    // Form State
    const [formData, setFormData] = useState({ name: '', coefficient: 2, cycle: 'COLLEGE' });
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
    const [suggestions, setSuggestions] = useState<{ name: string, defaultCoef: number }[]>([]);

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const res = await api.get('/subjects');
            // Strict Filter: Only show Secondary Subjects for Censor View
            const secondarySubjects = res.data.filter((s: Subject) =>
                ['COLLEGE', 'LYCEE', 'LYCEE_TECHNIQUE', 'COLLEGE_LYCEE'].includes(s.cycle)
            );
            setSubjects(secondarySubjects);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingSubject) {
                await api.patch(`/subjects/${editingSubject.id}`, formData);
            } else {
                await api.post('/subjects', formData);
            }
            setIsAddModalOpen(false);
            setEditingSubject(null);
            fetchSubjects();
        } catch (err) {
            alert('Erreur lors de l\'enregistrement');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Supprimer cette matière ?')) return;
        try {
            await api.delete(`/subjects/${id}`);
            fetchSubjects();
        } catch (err) {
            alert('Erreur lors de la suppression');
        }
    };

    const handleEdit = (s: Subject) => {
        setFormData({ name: s.name, coefficient: s.coefficient, cycle: s.cycle || 'COLLEGE' });
        setEditingSubject(s);
        setIsAddModalOpen(true);
    };

    const toggleFilter = (cycle: string) => {
        setActiveFilters(prev =>
            prev.includes(cycle)
                ? prev.filter(c => c !== cycle)
                : [...prev, cycle]
        );
    };

    const filtered = subjects.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilters.length === 0 || activeFilters.includes(s.cycle) || (activeFilters.includes('LYCEE') && s.cycle === 'COLLEGE_LYCEE') || (activeFilters.includes('COLLEGE') && s.cycle === 'COLLEGE_LYCEE');
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-2">
                {/* Search & Filter Area */}
                <div className="flex items-center gap-2 relative">
                    <div className={`flex items-center transition-all duration-300 ease-in-out ${isSearchExpanded ? 'w-64 bg-white/5 border border-white/10 rounded-lg px-3 py-1' : 'w-10 overflow-hidden'}`}>
                        <button
                            onClick={() => setIsSearchExpanded(true)}
                            className={`text-gray-400 hover:text-white transition-colors py-2 ${isSearchExpanded ? 'mr-2' : ''}`}
                            title="Rechercher"
                        >
                            <Search size={20} />
                        </button>

                        {isSearchExpanded && (
                            <input
                                autoFocus
                                type="text"
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onBlur={() => {
                                    if (!searchTerm) setIsSearchExpanded(false);
                                }}
                                className="bg-transparent border-none outline-none text-white text-sm w-full h-full placeholder-gray-500"
                            />
                        )}
                    </div>

                    {/* Filter Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                            className={`p-2 rounded-lg transition-colors relative ${activeFilters.length > 0 ? 'bg-indigo-500/20 text-indigo-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            title="Filtrer par cycle"
                        >
                            <Filter size={20} />
                            {activeFilters.length > 0 && (
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-[#0f172a]"></span>
                            )}
                        </button>

                        {isFilterMenuOpen && (
                            <div className="absolute top-full left-0 mt-2 w-56 bg-[#1e293b] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden">
                                <div className="px-3 py-2 border-b border-white/5 bg-white/5">
                                    <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Filtrer par Cycle</h4>
                                </div>
                                <div className="p-1">
                                    {[
                                        { id: 'COLLEGE', label: 'Collège' },
                                        { id: 'LYCEE', label: 'Lycée Général' },
                                        { id: 'LYCEE_TECHNIQUE', label: 'Lycée Technique' }
                                    ].map((filter) => (
                                        <label key={filter.id} className="flex items-center justify-between px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer group transition-colors">
                                            <span className={`text-sm ${activeFilters.includes(filter.id) ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-300'}`}>
                                                {filter.label}
                                            </span>
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${activeFilters.includes(filter.id)
                                                    ? 'bg-indigo-500 border-indigo-500'
                                                    : 'border-gray-600 group-hover:border-gray-500 bg-transparent'
                                                }`}>
                                                {activeFilters.includes(filter.id) && <Check size={14} className="text-white" />}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={activeFilters.includes(filter.id)}
                                                onChange={() => toggleFilter(filter.id)}
                                            />
                                        </label>
                                    ))}
                                </div>
                                {activeFilters.length > 0 && (
                                    <button
                                        onClick={() => {
                                            setActiveFilters([]);
                                            setIsFilterMenuOpen(false);
                                        }}
                                        className="w-full text-center text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 py-2 border-t border-white/5 transition-colors"
                                    >
                                        Effacer tout
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                    {/* Backdrop for closing filter menu */}
                    {isFilterMenuOpen && (
                        <div className="fixed inset-0 z-10" onClick={() => setIsFilterMenuOpen(false)}></div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors whitespace-nowrap shadow-lg shadow-emerald-500/20"
                    >
                        <Download size={18} />
                        <span className="hidden sm:inline">Importer du Catalogue</span>
                        <span className="sm:hidden">Importer</span>
                    </button>

                    <button
                        onClick={() => {
                            setEditingSubject(null);
                            setFormData({ name: '', coefficient: 2, cycle: 'COLLEGE' }); // Default to COLLEGE for Censor
                            setIsAddModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors whitespace-nowrap shadow-lg shadow-indigo-500/20"
                    >
                        <Plus size={18} />
                        <span className="hidden sm:inline">Nouvelle Matière</span>
                        <span className="sm:hidden">Créer</span>
                    </button>
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-16 bg-white/5 border border-dashed border-white/10 rounded-2xl">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-500/10 rounded-full mb-4">
                        <Layers className="w-10 h-10 text-indigo-400" />
                    </div>
                    {subjects.length === 0 && searchTerm === '' && activeFilters.length === 0 ? (
                        <>
                            <h3 className="text-xl font-bold text-white mb-2">Aucune matière configurée</h3>
                            <p className="text-gray-400 mb-6 max-w-md mx-auto">
                                Votre catalogue est vide. Importez les matières officielles du Bénin pour commencer rapidement.
                            </p>
                            <button
                                onClick={() => setIsImportModalOpen(true)}
                                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors font-medium inline-flex items-center gap-2"
                            >
                                <Download size={20} />
                                Importer le catalogue officiel
                            </button>
                        </>
                    ) : (
                        <>
                            <h3 className="text-lg font-bold text-white mb-2">Aucun résultat</h3>
                            <p className="text-gray-400">
                                {activeFilters.length > 0
                                    ? "Aucune matière ne correspond à vos filtres."
                                    : `Aucune matière ne correspond à votre recherche "${searchTerm}"`
                                }
                            </p>
                            {(activeFilters.length > 0 || searchTerm) && (
                                <button
                                    onClick={() => {
                                        setActiveFilters([]);
                                        setSearchTerm('');
                                    }}
                                    className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm hover:underline"
                                >
                                    Effacer tous les critères
                                </button>
                            )}
                        </>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {filtered.map(s => (
                        <div key={s.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center group hover:bg-white/10 transition-all">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${s.cycle.includes('TECHNIQUE') ? 'bg-amber-500/20 text-amber-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                                    <BookOpen size={20} />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium">{s.name}</h4>
                                    <div className="flex gap-2 text-xs text-gray-400">
                                        <span className="bg-white/10 px-1.5 py-0.5 rounded">Coef: {s.coefficient}</span>
                                        <span className="uppercase text-[10px] tracking-wide border border-white/10 px-1 rounded">
                                            {s.cycle.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(s)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Modifier">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(s.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Supprimer">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isImportModalOpen && (
                <ImportSubjectsModal
                    existingSubjects={subjects.map(s => s.name)}
                    onClose={() => setIsImportModalOpen(false)}
                    onSuccess={() => {
                        fetchSubjects();
                        // Optional: Show toast
                    }}
                />
            )}

            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-[#1e293b] rounded-xl border border-white/10 w-full max-w-sm p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-white mb-4">{editingSubject ? 'Modifier' : 'Ajouter'} Matière</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Nom</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => {
                                            const val = e.target.value;
                                            setFormData({ ...formData, name: val });
                                            if (val.length > 0) {
                                                const matches = BENIN_SUBJECTS_LIST
                                                    .filter(s => s.name.toLowerCase().includes(val.toLowerCase()))
                                                    .map(s => ({ name: s.name, defaultCoef: s.defaultCoef }));
                                                // Unique by name
                                                const unique = Array.from(new Map(matches.map(item => [item.name, item])).values());
                                                setSuggestions(unique);
                                            } else {
                                                setSuggestions([]);
                                            }
                                        }}
                                        onBlur={() => setTimeout(() => setSuggestions([]), 200)}
                                        className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                                        autoComplete="off"
                                        placeholder="Ex: Mathématiques"
                                    />
                                    {suggestions.length > 0 && (
                                        <ul className="absolute z-10 w-full bg-[#1e293b] border border-white/10 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-xl">
                                            {suggestions.map((s, idx) => (
                                                <li
                                                    key={idx}
                                                    onClick={() => {
                                                        setFormData({ ...formData, name: s.name, coefficient: s.defaultCoef });
                                                        setSuggestions([]);
                                                    }}
                                                    className="px-4 py-2 hover:bg-white/10 cursor-pointer text-gray-300 hover:text-white transition-colors text-sm"
                                                >
                                                    {s.name} (Coef: {s.defaultCoef})
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Coefficient</label>
                                <input
                                    type="number"
                                    required
                                    min="0.5"
                                    step="0.5"
                                    value={formData.coefficient}
                                    onChange={e => setFormData({ ...formData, coefficient: parseFloat(e.target.value) })}
                                    className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Cycle</label>
                                <select
                                    value={formData.cycle}
                                    onChange={e => setFormData({ ...formData, cycle: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                                >
                                    <option value="COLLEGE">Collège</option>
                                    <option value="LYCEE">Lycée</option>
                                    <option value="LYCEE_TECHNIQUE">Lycée Technique</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white px-3 py-2 text-sm">Annuler</button>
                                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg shadow-indigo-500/20">Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CensorSubjectsView;
