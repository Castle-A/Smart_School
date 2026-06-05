import { useState, useEffect } from 'react';
import { X, Save, Shield } from 'lucide-react';
import PermissionsChecklist from './PermissionsChecklist';
import api from '../api/api';
import { toastEvents } from '../utils/toast-events';

interface EditPermissionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    member: {
        id: string;
        firstName: string;
        lastName: string;
        role: string;
        directorType?: string;
    };
    onSuccess: () => void;
}

const EditPermissionsModal = ({ isOpen, onClose, member, onSuccess }: EditPermissionsModalProps) => {
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [directorType, setDirectorType] = useState<string | undefined>(member.directorType);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && member) {
            setDirectorType(member.directorType);
            loadCurrentPermissions();
        }
    }, [isOpen, member]);

    const loadCurrentPermissions = async () => {
        try {
            const response = await api.get(`/members/${member.id}/permissions`);
            setSelectedPermissions(response.data || []);
        } catch (error) {
            console.error('Error loading permissions:', error);
            setSelectedPermissions([]);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await api.patch(`/members/${member.id}/permissions`, {
                permissionIds: selectedPermissions,
                directorType: directorType,
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error updating permissions:', error);
            toastEvents.error('Erreur lors de la mise à jour des permissions');
        } finally {
            setLoading(false);
        }
    };

    const showDirectorTypeSelect = ['DIRECTOR', 'SECRETARY'].includes(member.role);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/20 rounded-xl">
                            <Shield className="text-indigo-400" size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Modifier les Permissions</h2>
                            <p className="text-white/70 text-sm">
                                {member.firstName} {member.lastName} • <span className="text-indigo-300">{member.role}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {showDirectorTypeSelect && (
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <label className="block text-sm font-medium text-white/90 mb-2">
                                Type de Direction
                            </label>
                            <select
                                value={directorType || ''}
                                onChange={(e) => setDirectorType(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all [&>option]:bg-slate-800"
                            >
                                <option value="PRIMARY_PRESCHOOL">Primaire & Maternelle</option>
                                <option value="COLLEGE">Collège / Lycée</option>
                                <option value="BOTH">Direction Générale (Les deux)</option>
                            </select>
                            <p className="text-xs text-white/50 mt-2">
                                Ce choix détermine les permissions par défaut et les accès aux classes.
                            </p>
                        </div>
                    )}

                    <PermissionsChecklist
                        role={member.role}
                        directorType={directorType}
                        selectedPermissions={selectedPermissions}
                        onChange={setSelectedPermissions}
                    />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10 bg-white/5">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors font-medium"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg shadow-indigo-500/20"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Enregistrement...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Enregistrer les modifications
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditPermissionsModal;
