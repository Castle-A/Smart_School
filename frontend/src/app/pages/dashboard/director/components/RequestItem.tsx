import { ArrowRight, AlertCircle, Check, X, Clock, User, UserX, UserCog, Users, Archive, Trash2, UserPlus } from 'lucide-react';
import { type AdminRequest } from '../../../../../shared/api/admin-requests.service';

interface RequestItemProps {
    req: AdminRequest;
    involvedTeacher?: any;
    involvedStudent?: any;
    involvedClass?: any;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    onArchive: (id: string) => void;
    processing: string | null;
    showArchived: boolean;
}

export const RequestItem = ({
    req,
    involvedTeacher,
    involvedStudent,
    involvedClass,
    onApprove,
    onReject,
    onArchive,
    processing,
    showArchived
}: RequestItemProps) => {

    const getIcon = (type: string) => {
        switch (type) {
            case 'DELETE_TEACHER': return <UserX className="text-red-400" />;
            case 'UPDATE_TEACHER': return <UserCog className="text-amber-400" />;
            case 'CLASS_ASSEMBLY': return <Users className="text-indigo-400" />;
            case 'DELETE_CLASS': return <Trash2 className="text-red-400" />;
            case 'VALIDATE_STUDENT_REGISTRATION': return <UserPlus className="text-emerald-400" />;
            default: return <AlertCircle className="text-gray-400" />;
        }
    };

    const getTitle = (type: string) => {
        switch (type) {
            case 'DELETE_TEACHER': return 'Suppression de Compte';
            case 'UPDATE_TEACHER': return 'Modification de Profil';
            case 'CLASS_ASSEMBLY': return 'Composition de Classe';
            case 'DELETE_CLASS': return 'Suppression de Classe';
            case 'VALIDATE_STUDENT_REGISTRATION': return 'Inscription Élève';
            default: return type.replace(/_/g, ' ');
        }
    };

    const getDiff = (current: any, proposed: any) => {
        if (!current) return [];
        const changes: { label: string, old: any, new: any }[] = [];

        const fieldLabels: Record<string, string> = {
            firstName: 'Prénom',
            lastName: 'Nom',
            email: 'Email',
            phone: 'Téléphone',
            gender: 'Genre',
            title: 'Titre',
            diploma: 'Diplôme',
            contractType: 'Contrat',
            hireDate: 'Date d\'embauche',
            matricule: 'Matricule',
            specialty: 'Spécialité',
            subjects: 'Matières'
        };

        Object.keys(proposed).forEach(key => {
            if (['cycle', 'photoPreview', 'photo'].includes(key)) return;
            if (!fieldLabels[key]) return;

            let oldVal = current[key];
            let newVal = proposed[key];

            if (key === 'hireDate' && oldVal) oldVal = new Date(oldVal).toISOString().split('T')[0];
            if (key === 'subjects' && Array.isArray(oldVal) && Array.isArray(newVal)) {
                oldVal = oldVal.sort().join(', ');
                newVal = newVal.sort().join(', ');
            }
            if (!oldVal && !newVal) return;
            if (oldVal == newVal) return;

            changes.push({
                label: fieldLabels[key] || key,
                old: oldVal || 'Non défini',
                new: newVal || 'Non défini'
            });
        });
        return changes;
    };

    const renderContent = () => {
        try {
            const data = typeof req.data === 'string' ? JSON.parse(req.data) : req.data;

            switch (req.type) {
                case 'DELETE_TEACHER':
                    const teacherName = involvedTeacher
                        ? `${involvedTeacher.firstName} ${involvedTeacher.lastName}`
                        : `ID: ${data.teacherId}`;
                    return (
                        <div>
                            <p className="text-gray-300">Demande de suppression : <span className="text-white font-medium">{teacherName}</span></p>
                            <p className="text-sm text-red-400 mt-1 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded w-fit">Raison : {data.reason}</p>
                        </div>
                    );
                case 'UPDATE_TEACHER':
                    const currentTeacher = involvedTeacher;
                    const diffs = getDiff(currentTeacher, data.data || data);

                    return (
                        <div className='w-full'>
                            <p className="text-gray-300">Demande de modification de profil : <span className="text-white font-medium">{currentTeacher ? `${currentTeacher.firstName} ${currentTeacher.lastName}` : ''}</span></p>

                            {diffs.length > 0 ? (
                                <div className="mt-3 space-y-2">
                                    {diffs.map((diff, idx) => (
                                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm bg-black/20 p-2 rounded">
                                            <span className="font-bold text-indigo-400 w-32">{diff.label}</span>
                                            <div className="flex items-center gap-2 flex-1">
                                                <span className="text-gray-500 line-through decoration-red-500/50">{String(diff.old)}</span>
                                                <ArrowRight size={14} className="text-gray-600" />
                                                <span className="text-emerald-400 font-medium">{String(diff.new)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 mt-2 italic">Chargement des différences ou aucune modification visible...</p>
                            )}

                            {data.note && <p className="text-xs text-gray-500 mt-2">Note: {data.note}</p>}
                        </div>
                    );
                case 'CLASS_ASSEMBLY':
                    const classInfo = involvedClass;
                    return (
                        <div>
                            <p className="text-gray-300">Proposition de composition de classe : <span className="text-white font-medium">{classInfo ? classInfo.name : 'Chargement...'}</span></p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded text-sm font-medium">
                                    {data.assignments?.length || 0} affectations
                                </span>
                            </div>
                        </div>
                    );
                case 'VALIDATE_STUDENT_REGISTRATION':
                    const student = involvedStudent;
                    return (
                        <div>
                            <p className="text-gray-300">Nouvelle inscription à valider : <span className="text-white font-medium">{student ? `${student.firstName} ${student.lastName}` : 'Chargement...'}</span></p>
                            <p className="text-xs text-gray-500 mt-1">Matricule: {data.matricule || student?.matricule || 'Non défini'}</p>
                        </div>
                    );
                case 'DELETE_CLASS':
                    const classToDelete = involvedClass;
                    return (
                        <div>
                            <p className="text-gray-300">Demande de suppression de la classe : <span className="text-white font-medium">{classToDelete ? classToDelete.name : 'Chargement...'}</span></p>
                            <p className="text-sm text-red-400 mt-1 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded w-fit">Raison : {data.reason || 'Non spécifiée'}</p>
                        </div>
                    );
                default:
                    return <p className="text-gray-300">Type de requête: {req.type.replace(/_/g, ' ')}</p>;
            }
        } catch (e) {
            console.error(e);
            return <p className="text-red-400">Erreur de lecture des données</p>;
        }
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 hover:bg-white/[0.07] transition-colors">
            <div className="flex items-start gap-4 w-full">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 shadow-inner">
                    {getIcon(req.type)}
                </div>
                <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-white font-bold text-lg">{getTitle(req.type)}</h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${req.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                            req.status === 'REJECTED' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            }`}>
                            {req.status === 'APPROVED' ? 'Approuvée' :
                                req.status === 'REJECTED' ? 'Refusée' :
                                    'En Attente'}
                        </span>
                    </div>

                    <div className="mb-4">
                        {renderContent()}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-500 bg-black/20 w-fit px-3 py-1.5 rounded-full border border-white/5">
                        <div className="flex items-center gap-1.5">
                            <User size={12} className="text-indigo-400" />
                            <span className="text-gray-400">Demandé par :</span>
                            <span className="text-gray-300 font-medium capitalize">{req.requester.firstName} {req.requester.lastName}</span>
                        </div>
                        <div className="w-px h-3 bg-white/10" />
                        <div className="flex items-center gap-1.5">
                            <Clock size={12} className="text-indigo-400" />
                            <span className="text-gray-300">{new Date(req.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-auto min-w-[150px]">
                {req.status === 'PENDING' ? (
                    <>
                        <button
                            onClick={() => onApprove(req.id)}
                            disabled={processing === req.id}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all shadow-lg shadow-emerald-900/20 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed w-full"
                        >
                            {processing === req.id ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={16} />}
                            Accepter
                        </button>
                        <button
                            onClick={() => onReject(req.id)}
                            disabled={processing === req.id}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 rounded-lg transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed w-full"
                        >
                            <X size={16} />
                            Refuser
                        </button>
                    </>
                ) : (
                    !showArchived && (
                        <button
                            onClick={() => onArchive(req.id)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 hover:text-gray-300 border border-gray-500/20 rounded-lg transition-all text-sm font-medium w-full"
                        >
                            <Archive size={16} />
                            Archiver
                        </button>
                    )
                )}
            </div>
        </div>
    );
};
