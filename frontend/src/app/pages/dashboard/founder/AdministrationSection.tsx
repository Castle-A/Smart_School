import { useState, useEffect } from 'react';
import { Users, Shield, Lock, Settings, UserPlus, X, Check, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Member {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    status: 'active' | 'inactive';
    lastLogin?: string;
}

interface PostCount {
    role: string;
    label: string;
    count: number;
}

interface AdministrationSectionProps {
    readOnly?: boolean;
}

const AdministrationSection = ({ readOnly = false }: AdministrationSectionProps) => {
    const navigate = useNavigate();
    const [members, setMembers] = useState<Member[]>([]);
    const [postCounts, setPostCounts] = useState<PostCount[]>([
        { role: 'DIRECTEUR', label: 'Directeur', count: 0 },
        { role: 'CENSEUR', label: 'Censeur', count: 0 },
        { role: 'SURVEILLANT', label: 'Surveillant', count: 0 },
        { role: 'SECRETAIRE', label: 'Secrétaire', count: 0 },
        { role: 'COMPTABLE', label: 'Comptable', count: 0 },
    ]);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetCredentials, setResetCredentials] = useState({ identifier: '', password: '' });

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://localhost:3000/members/list', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setMembers(data.map((m: any) => ({
                id: m.id,
                firstName: m.firstName,
                lastName: m.lastName,
                email: m.email,
                role: m.role,
                status: 'active', // TODO: Add status field to backend
                lastLogin: 'Récemment'
            })));

            // Calculate counts
            const counts = postCounts.map(pc => ({
                ...pc,
                count: data.filter((m: any) => m.role === pc.role).length
            }));
            setPostCounts(counts);
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    };

    const handlePostClick = (role: string) => {
        if (!readOnly) {
            navigate('/app/create-member', { state: { role } });
        }
    };

    const handleResetPassword = async (member: Member) => {
        const confirmed = window.confirm(
            `Voulez-vous réinitialiser le mot de passe de ${member.firstName} ${member.lastName} ?`
        );
        if (!confirmed) return;

        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`http://localhost:3000/members/${member.id}/reset-password`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setResetCredentials({
                    identifier: data.tempPassword ? member.email : member.email,
                    password: data.tempPassword
                });
                setShowResetModal(true);
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            alert('Erreur lors de la réinitialisation du mot de passe');
        }
    };

    const handleToggleStatus = async (member: Member) => {
        const newStatus = member.status === 'active' ? 'inactive' : 'active';
        const action = newStatus === 'inactive' ? 'désactiver' : 'activer';
        const confirmed = window.confirm(
            `Voulez-vous ${action} le compte de ${member.firstName} ${member.lastName} ?`
        );
        if (!confirmed) return;

        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`http://localhost:3000/members/${member.id}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) {
                // Update local state
                setMembers(prev => prev.map(m =>
                    m.id === member.id ? { ...m, status: newStatus } : m
                ));
                setOpenMenuId(null);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Erreur lors de la modification du statut');
        }
    };

    const handleDeleteMember = async (member: Member) => {
        const confirmed = window.confirm(
            `⚠️ ATTENTION : Voulez-vous vraiment supprimer le compte de ${member.firstName} ${member.lastName} ? Cette action est irréversible.`
        );
        if (!confirmed) return;

        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`http://localhost:3000/members/${member.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                fetchMembers();
                setOpenMenuId(null);
            }
        } catch (error) {
            console.error('Error deleting member:', error);
            alert('Erreur lors de la suppression du membre');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Administration</h2>
                    <p className="text-gray-400">Gérez les membres de l'administration</p>
                </div>
                {!readOnly && (
                    <button
                        onClick={() => navigate('/app/create-member')}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                        <UserPlus size={18} />
                        Nouveau Membre
                    </button>
                )}
            </div>

            {/* Gestion des Postes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="text-indigo-400" size={24} />
                        <h3 className="text-xl font-semibold text-white">Gestion des Postes</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">
                        {readOnly
                            ? "Vue d'ensemble des postes administratifs"
                            : "Cliquez sur un poste pour créer un nouveau membre"}
                    </p>
                    <div className="space-y-3">
                        {postCounts.map((post) => (
                            <div
                                key={post.role}
                                onClick={() => handlePostClick(post.role)}
                                className={`flex justify-between items-center p-3 bg-white/5 rounded-lg transition-colors group ${!readOnly ? 'cursor-pointer hover:bg-white/10' : ''}`}
                            >
                                <span className="text-gray-200 group-hover:text-white transition-colors">{post.label}</span>
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm font-medium">
                                        {post.count}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Équipe Administrative */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Users className="text-emerald-400" size={24} />
                        <h3 className="text-xl font-semibold text-white">Équipe Administrative</h3>
                    </div>
                    <div className="space-y-4">
                        {members.map((member) => (
                            <div key={member.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                                        {member.firstName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{member.firstName} {member.lastName}</p>
                                        <p className="text-xs text-gray-400">{member.role} • {member.lastLogin}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${member.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>

                                    {!readOnly && (
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => handleResetPassword(member)}
                                                title="Réinitialiser mot de passe"
                                                className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                                            >
                                                <Lock size={14} />
                                            </button>
                                            <div className="relative">
                                                <button
                                                    onClick={() => setOpenMenuId(openMenuId === member.id ? null : member.id)}
                                                    title="Plus d'options"
                                                    className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                                                >
                                                    <Settings size={14} />
                                                </button>
                                                {openMenuId === member.id && (
                                                    <div className="absolute right-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-xl rounded-lg border border-white/20 shadow-xl z-50">
                                                        <button
                                                            onClick={() => handleToggleStatus(member)}
                                                            className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                                                        >
                                                            {member.status === 'active' ? <><Lock size={14} /> Désactiver ce compte</> : <><Check size={14} /> Activer ce compte</>}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteMember(member)}
                                                            className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2"
                                                        >
                                                            <Trash2 size={14} /> Supprimer
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {members.length === 0 && (
                            <p className="text-center text-gray-400 py-4">Aucun membre pour le moment</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Password Reset Modal */}
            {showResetModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1f37] border border-white/10 rounded-xl p-8 max-w-md w-full relative">
                        <button
                            onClick={() => setShowResetModal(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X size={20} className="text-gray-400" />
                        </button>

                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Lock size={32} className="text-emerald-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Mot de passe réinitialisé !</h2>
                            <p className="text-gray-400">Voici les nouveaux identifiants de connexion</p>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="bg-white/5 rounded-lg p-4">
                                <p className="text-sm text-gray-400 mb-1">Identifiant</p>
                                <p className="text-white font-mono font-medium">{resetCredentials.identifier}</p>
                            </div>

                            <div className="bg-white/5 rounded-lg p-4">
                                <p className="text-sm text-gray-400 mb-1">Nouveau mot de passe temporaire</p>
                                <p className="text-white font-mono font-medium text-lg">{resetCredentials.password}</p>
                            </div>
                        </div>

                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                            <p className="text-yellow-400 text-sm">
                                ⚠️ L'utilisateur devra changer ce mot de passe lors de sa prochaine connexion
                            </p>
                        </div>

                        <button
                            onClick={() => setShowResetModal(false)}
                            className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdministrationSection;
