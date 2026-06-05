import { X, Mail, Phone, Shield, Calendar, Lock, Check, Trash2, Key } from 'lucide-react';
import { ROLE_LABELS } from '../../../../shared/constants/roles';

interface Member {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    status: 'active' | 'inactive';
    lastLogin?: string;
    phone?: string;
    gender?: string;
    loginMethod?: string;
    directorType?: string;
}

interface MemberDetailsModalProps {
    member: Member;
    onClose: () => void;
    onResetPassword: (member: Member) => void;
    onToggleStatus: (member: Member) => void;
    onDelete: (member: Member) => void;
    onEditPermissions?: (member: Member) => void;
    readOnly?: boolean;
}

const MemberDetailsModal = ({
    member,
    onClose,
    onResetPassword,
    onToggleStatus,
    onDelete,
    onEditPermissions,
    readOnly = false
}: MemberDetailsModalProps) => {

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl max-w-md w-full relative overflow-hidden">
                {/* Header Background */}
                <div className="h-24 bg-gradient-to-r from-indigo-600 to-indigo-700"></div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Profile Content */}
                <div className="px-6 pb-6">
                    {/* Avatar */}
                    <div className="relative -mt-12 mb-4 flex justify-center">
                        <div className="w-24 h-24 rounded-full bg-slate-900/90 p-1">
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                                {getInitials(member.firstName, member.lastName)}
                            </div>
                        </div>
                        <div className={`absolute bottom-1 right-[calc(50%-2.5rem)] w-5 h-5 rounded-full border-4 border-slate-900 ${member.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                    </div>

                    {/* Name & Role */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-white mb-1">
                            {member.firstName} {member.lastName}
                        </h2>
                        <div className="inline-flex flex-col items-center px-3 py-1 bg-white/10 rounded-xl text-sm text-indigo-300 border border-white/10">
                            {(() => {
                                const baseRole = ROLE_LABELS[member.role as keyof typeof ROLE_LABELS] || member.role;
                                if ((member.role === 'DIRECTOR' || member.role === 'SECRETARY') && member.directorType) {
                                    let typeLabel = '';
                                    switch (member.directorType) {
                                        case 'PRIMARY_PRESCHOOL':
                                            typeLabel = 'Maternelle - Primaire';
                                            break;
                                        case 'COLLEGE':
                                            typeLabel = 'Collège';
                                            break;
                                        case 'BOTH':
                                            typeLabel = 'Maternelle - Primaire - Collège';
                                            break;
                                    }
                                    if (typeLabel) {
                                        return (
                                            <>
                                                <span className="font-semibold">{baseRole}</span>
                                                <span className="text-xs opacity-80">{typeLabel}</span>
                                            </>
                                        );
                                    }
                                }
                                return baseRole;
                            })()}
                        </div>
                    </div>

                    {/* Contact Card */}
                    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden mb-8">
                        <div className="bg-white/5 px-4 py-2 border-b border-white/5">
                            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider">Contact & Connexion</h3>
                        </div>

                        <div className="p-4 space-y-4">
                            {/* Contact Info */}
                            <div className="space-y-3">

                                {member.phone ? (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                                            <Phone size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-white/50">Téléphone</p>
                                            <p className="text-sm text-white font-medium">{member.phone}</p>
                                        </div>
                                    </div>

                                ) : (
                                    <div className="flex items-center gap-3 opacity-50">
                                        <div className="p-2 bg-white/10 rounded-lg text-white/50">
                                            <Phone size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-white/50">Téléphone</p>
                                            <p className="text-sm text-white font-medium italic">Non renseigné</p>
                                        </div>
                                    </div>
                                )}

                                {member.email && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                            <Mail size={16} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs text-white/50">Email</p>
                                            <p className="text-sm text-white font-medium truncate" title={member.email}>{member.email}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Separator */}
                            <div className="h-px bg-white/10 my-2"></div>

                            {/* Connection Details */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-white/50 mb-1">Méthode de connexion</p>
                                    <div className="flex items-center gap-2 text-white">
                                        {member.loginMethod === 'phone' ? (
                                            <Phone size={14} className="text-emerald-400" />
                                        ) : (
                                            <Mail size={14} className="text-indigo-400" />
                                        )}
                                        <span className="text-sm font-medium">
                                            {member.loginMethod === 'phone' ? 'Téléphone' : 'Email'}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-white/50 mb-1">Dernière connexion</p>
                                    <div className="flex items-center gap-2 text-white">
                                        <Calendar size={14} className="text-purple-400" />
                                        <span className="text-sm font-medium">
                                            {member.lastLogin && !isNaN(new Date(member.lastLogin).getTime())
                                                ? new Date(member.lastLogin).toLocaleDateString('fr-FR', {
                                                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                })
                                                : 'Jamais'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    {!readOnly && (
                        <div className="grid grid-cols-4 gap-3 pt-4 border-t border-white/10">
                            <button
                                onClick={() => onResetPassword(member)}
                                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors group"
                                title="Réinitialiser le mot de passe"
                            >
                                <div className="p-2 rounded-full bg-white/10 group-hover:bg-indigo-500/20 text-indigo-400">
                                    <Key size={20} />
                                </div>
                                <span className="text-[10px] sm:text-xs text-center">Réinitialiser</span>
                            </button>

                            <button
                                onClick={() => onToggleStatus(member)}
                                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors group"
                                title={member.status === 'active' ? 'Désactiver le compte' : 'Activer le compte'}
                            >
                                <div className={`p-2 rounded-full bg-white/10 group-hover:bg-opacity-20 ${member.status === 'active' ? 'group-hover:bg-red-500 text-red-400' : 'group-hover:bg-emerald-500 text-emerald-400'}`}>
                                    {member.status === 'active' ? <Lock size={20} /> : <Check size={20} />}
                                </div>
                                <span className="text-[10px] sm:text-xs text-center">{member.status === 'active' ? 'Désactiver' : 'Activer'}</span>
                            </button>

                            <button
                                onClick={() => onEditPermissions && onEditPermissions(member)}
                                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors group"
                                title="Modifier les permissions"
                            >
                                <div className="p-2 rounded-full bg-white/10 group-hover:bg-blue-500/20 text-blue-400">
                                    <Shield size={20} />
                                </div>
                                <span className="text-[10px] sm:text-xs text-center">Permissions</span>
                            </button>

                            <button
                                onClick={() => onDelete(member)}
                                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white/10 text-white/70 hover:text-red-400 transition-colors group"
                                title="Supprimer le compte"
                            >
                                <div className="p-2 rounded-full bg-white/10 group-hover:bg-red-500/20 text-red-400">
                                    <Trash2 size={20} />
                                </div>
                                <span className="text-[10px] sm:text-xs text-center">Supprimer</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MemberDetailsModal;
