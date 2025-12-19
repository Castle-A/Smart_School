import { useState, useEffect } from 'react';
import { MessageSquare, ChevronUp, Send } from 'lucide-react';
import api from '../../../../../shared/api/api';
import { studentCommentService, type StudentComment } from '../../../../../shared/api/student-comments.service';
import SearchFilterBar from '../../../../../shared/components/SearchFilterBar';

interface Student {
    id: string;
    firstName: string;
    lastName: string;
    matricule: string;
    class?: {
        name: string;
        cycle: string;
        series?: string;
        level: string;
    };
    status: string;
}

const CensorStudentsView = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Advanced Filters State
    const [showFilter, setShowFilter] = useState(false);
    const [sortBy, setSortBy] = useState<'name_asc' | 'name_desc' | 'matricule'>('name_asc');
    const [filterCycle, setFilterCycle] = useState<string>('all');
    const [filterSeries, setFilterSeries] = useState<string>('all');
    const [filterClass, setFilterClass] = useState<string>('all');

    const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
    const [comments, setComments] = useState<StudentComment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await api.get('/students');
            setStudents(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // Derived Options for Filters - Robust handling for missing values
    const uniqueCycles = Array.from(new Set(students.map(s => s.class?.cycle).filter(Boolean))).sort();
    const uniqueSeries = Array.from(new Set(students.map(s => s.class?.series).filter(Boolean))).sort();
    const uniqueClasses = Array.from(new Set(students.map(s => s.class?.name).filter(Boolean))).sort();

    const toggleStudent = async (studentId: string) => {
        if (expandedStudentId === studentId) {
            setExpandedStudentId(null);
            setComments([]);
        } else {
            setExpandedStudentId(studentId);
            fetchComments(studentId);
        }
    };

    const fetchComments = async (studentId: string) => {
        setLoadingComments(true);
        try {
            const res = await studentCommentService.getComments(studentId);
            setComments(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleAddComment = async (studentId: string) => {
        if (!newComment.trim()) return;
        try {
            await studentCommentService.addComment(studentId, newComment);
            setNewComment('');
            fetchComments(studentId);
        } catch (err) {
            alert('Erreur lors de l\'ajout du commentaire');
        }
    };

    const filtered = students.filter(s => {
        const matchesSearch = (
            (s.firstName + " " + s.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.matricule.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const matchesCycle = filterCycle === 'all' || s.class?.cycle === filterCycle;
        const matchesSeries = filterSeries === 'all' || s.class?.series === filterSeries;
        const matchesClass = filterClass === 'all' || s.class?.name === filterClass;

        return matchesSearch && matchesCycle && matchesSeries && matchesClass;
    }).sort((a, b) => {
        if (sortBy === 'name_asc') {
            return (a.lastName + a.firstName).localeCompare(b.lastName + b.firstName);
        }
        if (sortBy === 'name_desc') {
            return (b.lastName + b.firstName).localeCompare(a.lastName + a.firstName);
        }
        if (sortBy === 'matricule') {
            return a.matricule.localeCompare(b.matricule);
        }
        return 0;
    });

    return (
        <div className="space-y-6">
            <SearchFilterBar
                onSearch={setSearchTerm}
                placeholder="Rechercher (Nom, Matricule)..."
                isFilterEnabled={true}
                isFilterOpen={showFilter}
                onFilterClick={() => setShowFilter(!showFilter)}
                filterContent={
                    <div className="p-4 space-y-4">
                        <div>
                            <label className="text-xs font-medium text-gray-400 block mb-1.5 uppercase tracking-wider">Trier par</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none"
                            >
                                <option value="name_asc">Nom (A-Z)</option>
                                <option value="name_desc">Nom (Z-A)</option>
                                <option value="matricule">Matricule</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-medium text-gray-400 block mb-1.5 uppercase tracking-wider">Cycle</label>
                                <select
                                    value={filterCycle}
                                    onChange={(e) => setFilterCycle(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none"
                                >
                                    <option value="all">Tous</option>
                                    {uniqueCycles.map(c => (
                                        <option key={c} value={String(c)}>{String(c).replace('_', ' ')}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-400 block mb-1.5 uppercase tracking-wider">Série</label>
                                <select
                                    value={filterSeries}
                                    onChange={(e) => setFilterSeries(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none"
                                >
                                    <option value="all">Toutes</option>
                                    {uniqueSeries.map(s => (
                                        <option key={s} value={String(s)}>{s}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-gray-400 block mb-1.5 uppercase tracking-wider">Classe</label>
                            <select
                                value={filterClass}
                                onChange={(e) => setFilterClass(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none"
                            >
                                <option value="all">Toutes les classes</option>
                                {uniqueClasses.map(c => (
                                    <option key={c} value={String(c)}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div className="pt-2 border-t border-white/5 flex justify-end">
                            <button
                                onClick={() => {
                                    setSortBy('name_asc');
                                    setFilterCycle('all');
                                    setFilterSeries('all');
                                    setFilterClass('all');
                                }}
                                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                                Réinitialiser filtres
                            </button>
                        </div>
                    </div>
                }
            />

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden min-h-[400px]">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-white/5 text-gray-200 uppercase font-medium">
                        <tr>
                            <th className="p-4">Matricule</th>
                            <th className="p-4">Nom & Prénoms</th>
                            <th className="p-4">Classe</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filtered.length > 0 ? (
                            filtered.map(student => (
                                <>
                                    <tr key={student.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => toggleStudent(student.id)}>
                                        <td className="p-4 font-mono text-indigo-400">{student.matricule}</td>
                                        <td className="p-4 text-white font-medium">{student.firstName} {student.lastName}</td>
                                        <td className="p-4">
                                            {student.class ? (
                                                <div className="flex flex-col">
                                                    <span className="text-white">{student.class.name}</span>
                                                    {student.class.series && <span className="text-xs text-gray-500">Série {student.class.series}</span>}
                                                </div>
                                            ) : (
                                                <span className="text-gray-600 italic">Non assigné</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button className="text-indigo-400 hover:text-white transition-colors">
                                                {expandedStudentId === student.id ? <ChevronUp size={20} /> : <MessageSquare size={20} />}
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedStudentId === student.id && (
                                        <tr className="bg-black/20">
                                            <td colSpan={4} className="p-4">
                                                <div className="ml-4 pl-4 border-l-2 border-indigo-500/30 space-y-4">
                                                    <h4 className="text-white font-medium flex items-center gap-2">
                                                        <MessageSquare size={16} className="text-indigo-400" />
                                                        Commentaires & Observations
                                                    </h4>

                                                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                                        {loadingComments ? (
                                                            <p className="text-xs text-gray-500">Chargement...</p>
                                                        ) : comments.length === 0 ? (
                                                            <p className="text-xs text-gray-500 italic">Aucun commentaire pour cet élève.</p>
                                                        ) : (
                                                            comments.map(comment => (
                                                                <div key={comment.id} className="bg-white/5 rounded-lg p-3 text-sm">
                                                                    <div className="flex justify-between items-start mb-1">
                                                                        <span className="text-indigo-300 font-medium">{comment.author.firstName} {comment.author.lastName}</span>
                                                                        <span className="text-gray-500 text-xs">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                                                    </div>
                                                                    <p className="text-gray-300">{comment.content}</p>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={newComment}
                                                            onChange={e => setNewComment(e.target.value)}
                                                            placeholder="Ajouter une observation..."
                                                            className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                                                            onKeyDown={e => e.key === 'Enter' && handleAddComment(student.id)}
                                                        />
                                                        <button
                                                            onClick={() => handleAddComment(student.id)}
                                                            disabled={!newComment.trim()}
                                                            className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                                                        >
                                                            <Send size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">
                                    Aucun élève trouvé pour ces critères.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CensorStudentsView;
