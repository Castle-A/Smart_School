import { useState, useEffect } from 'react';
import { Search, MessageSquare, ChevronUp, Send, Filter } from 'lucide-react';
import api from '../../../../../shared/api/api';
import { studentCommentService, type StudentComment } from '../../../../../shared/api/student-comments.service';

interface Student {
    id: string;
    firstName: string;
    lastName: string;
    matricule: string;
    class?: { name: string };
    status: string;
}

const CensorStudentsView = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
    const [comments, setComments] = useState<StudentComment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);

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

    const filtered = students.filter(s =>
        (s.firstName + " " + s.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.matricule.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className={`relative flex items-center transition-all duration-300 ease-in-out ${isSearchExpanded ? 'w-64' : 'w-10'}`}>
                        <button
                            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                            className="absolute left-0 z-10 p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
                        >
                            <Search size={20} />
                        </button>
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className={`pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500 w-full transition-opacity duration-200 ${isSearchExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none border-transparent'}`}
                        />
                    </div>
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg border border-white/10 transition-colors">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
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
                        {filtered.map(student => (
                            <>
                                <tr key={student.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => toggleStudent(student.id)}>
                                    <td className="p-4 font-mono text-indigo-400">{student.matricule}</td>
                                    <td className="p-4 text-white font-medium">{student.firstName} {student.lastName}</td>
                                    <td className="p-4">{student.class?.name || <span className="text-gray-600 italic">Non assigné</span>}</td>
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
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CensorStudentsView;
